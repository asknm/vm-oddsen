import { CollectionReference, DocumentData, DocumentReference, FieldValue, Firestore, Timestamp, UpdateData } from "firebase-admin/firestore";
import { userCollection, userDoc } from "./extensions/userExtensions";
import { FirebaseMatch } from "./types/Match";
import { getMatchFromApi } from "./helpers/apiHelpers";
import { settleDebts } from "./helpers/debtSettling";

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
            settleDebts(db, mid, apiMatch),
        ]);
    }


    async function finishMatch() {
        await scoreDoc(mid).update({
            finished: true,
        });
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
