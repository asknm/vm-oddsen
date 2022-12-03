import { CollectionReference, DocumentData, DocumentReference, FieldValue, Firestore, Timestamp, UpdateData } from "firebase-admin/firestore";
import { oddsDoc, correctOddsOption, oddsValue } from "./extensions/oddsExtensions";
import { betCollection } from "./extensions/betExtensions";
import { userCollection, userDoc } from "./extensions/userExtensions";
import { FirebaseMatch } from "./types/Match";
import { OddsWithBookmakerRef } from "./types/Odds";
import { getMatchFromApi } from "./helpers/apiHelpers";

export async function checkScoreHandler(mid: string, db: Firestore, apiKey: string) {
    const [apiMatch, dbScore] = await Promise.all([
        getMatchFromApi(mid, apiKey),
        getScoreFromDb(mid),
        setNextBookmaker(),
    ]);

    if (!dbScore) {
        await scoreDoc(mid).set({
            home: apiMatch.score.fullTime.home,
            away: apiMatch.score.fullTime.away,
        });
    }
    else {
        const updateData: UpdateData = {};

        if (apiMatch.score.fullTime.home !== dbScore["home"]) {
            updateData["home"] = apiMatch.score.fullTime.home;
        }
        if (apiMatch.score.fullTime.away !== dbScore["away"]) {
            updateData["away"] = apiMatch.score.fullTime.away;
        }

        if (Object.keys(updateData).length) {
            await scoreDoc(mid).update(updateData);
        }
    }

    if (apiMatch.status !== "FINISHED") {
        throw new Error("Not yet finished, requeue");
    }
    else {
        Promise.all([
            finishMatch(),
            settleDebts(),
        ]);
    }


    async function finishMatch() {
        await scoreDoc(mid).update({
            finished: true,
        });
    }

    async function settleDebts() {
        const correctOption = correctOddsOption(apiMatch.score.fullTime);
        const oddsRef = await oddsDoc(db, mid).get();
        const odds = oddsRef.data();
        if (!odds) {
            throw new Error("Missing odds");
        }
        await Promise.all([
            settleWinners(odds),
            settleLosers(odds),
        ]);

        async function settleWinners(odds: OddsWithBookmakerRef) {
            const oddsV = oddsValue(odds, correctOption);
            const winners = await betCollection(db, mid).where("selection", "==", correctOption).get();
            await Promise.all(winners.docs.map(async doc => {
                const bet = doc.data();
                const winAmount = bet.amount * (oddsV - 1);
                await transfer(odds.bookmaker, doc.id, winAmount);
            }));
        }

        async function settleLosers(odds: OddsWithBookmakerRef) {
            const losers = await betCollection(db, mid).where("selection", "!=", correctOption).get();
            await Promise.all(losers.docs.map(async doc => {
                const bet = doc.data();
                await transfer(odds.bookmaker, doc.id, -bet.amount);
            }));
        }

        async function transfer(from: DocumentReference, to: string, amount: number) {
            const userRef = userDoc(db, to);
            await Promise.all([
                incrementBalance(from, -amount),
                incrementBalance(userRef, amount),
            ]);
        }

        async function incrementBalance(userDoc: DocumentReference, amount: number) {
            await userDoc.update({
                "balance": FieldValue.increment(amount),
            });
        }
    }

    async function setNextBookmaker() {
        const nextMatchesSnapshot = await (db.collection("matches") as CollectionReference<FirebaseMatch>).where("utcDate", ">", Timestamp.now()).orderBy("utcDate").limit(4).get();

        const matchDocs = nextMatchesSnapshot.docs;
        if (!matchDocs.length) {
            return;
        }
        const firstMatchSnapshot = matchDocs[0];
        const oddsDocRef = firstMatchSnapshot.ref.collection("odds").doc("odds");
        const oddsDoc = await oddsDocRef.get();
        if (oddsDoc.exists) {
            return;
        }
        const nextBookmaker = await findNextBookmaker();
        await oddsDocRef.set({
            bookmaker: userDoc(db, nextBookmaker),
        });
        const firstMatch = firstMatchSnapshot.data();

        let i = 1;
        for (i; i < matchDocs.length; i++) {
            const matchSnapshot = matchDocs[i];
            const match = matchSnapshot.data();
            if (firstMatch.utcDate.toDate().getDate() !== match.utcDate.toDate().getDate()) {
                return;
            }
            await matchSnapshot.ref.collection("odds").doc("odds").set({
                bookmaker: userDoc(db, nextBookmaker),
            });
        }
        await userDoc(db, nextBookmaker).update({
            matchesAsOdds: FieldValue.increment(i),
        });
    }

    async function findNextBookmaker(): Promise<string> {
        const usersSnapshot = await userCollection(db).get();
        const nextBookmaker = usersSnapshot.docs.reduce<[uid: string, value: number]>((previous, current) => {
            const totalBettedAmount: number = current.get("totalBettedAmount");
            const matchesAsOdds: number = current.get("matchesAsOdds") ?? 0.1;
            const value = totalBettedAmount / matchesAsOdds;
            if (value > previous[1]) {
                return [current.id, value];
            }
            return previous;
        }, ["", 0]);
        return nextBookmaker[0];
    }

    function scoreDoc(mid: string): DocumentReference {
        return db.collection("matches").doc(mid).collection("score").doc("score");
    }

    async function getScoreFromDb(mid: string): Promise<DocumentData | undefined> {
        const doc = await scoreDoc(mid).get();
        if (!doc.exists) {
            return undefined;
        }
        return doc.data();
    }
}
