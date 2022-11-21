import { ApiMatch, OddsWithBookmakerRef } from "common";
import { DocumentData, DocumentReference, FieldValue, Firestore, UpdateData } from "firebase-admin/firestore";
import axios from 'axios';
import { oddsDoc, correctOddsOption, oddsValue } from "./extensions/oddsExtensions";
import { betCollection } from "./extensions/betExtensions";
import { userDoc } from "./extensions/userExtensions";

export async function checkScoreHandler(mid: string, db: Firestore, apiKey: string) {
    const [apiMatch, dbScore] = await Promise.all([
        getMatchFromApi(mid),
        getScoreFromDb(mid),
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
        await scoreDoc(mid).update({
            finished: true,
        });
        await settleDebts();
        // TODO: Settle debts
        // TODO: Set next bookmakker
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

        async function settleWinners(odds: OddsWithBookmakerRef<DocumentReference>) {
            const oddsV = oddsValue(odds, correctOption);
            const winners = await betCollection(db, mid).where("selection", "==", correctOption).get();
            await Promise.all(winners.docs.map(async doc => {
                const bet = doc.data();
                const winAmount = bet.amount * (oddsV - 1);
                await transfer(odds.bookmaker, doc.id, winAmount);
            }));
        }

        async function settleLosers(odds: OddsWithBookmakerRef<DocumentReference>) {
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


    async function getMatchFromApi(mid: string): Promise<ApiMatch> {
        const response = await axios.get(`https://api.football-data.org/v4/matches/${mid}`, {
            headers: {
                "X-Auth-Token": apiKey,
            },
        });
        return response.data;
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
