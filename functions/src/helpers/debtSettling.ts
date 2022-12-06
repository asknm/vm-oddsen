import { ApiMatch } from "common";
import { DocumentReference, FieldValue, Firestore } from "firebase-admin/firestore";
import { betCollection } from "../extensions/betExtensions";
import { correctOddsOption, oddsDoc, oddsValue } from "../extensions/oddsExtensions";
import { userDoc } from "../extensions/userExtensions";
import { OddsWithBookmakerRef } from "../types/Odds";

export async function settleDebts(db: Firestore, mid: string, apiMatch: ApiMatch) {
    const correctOption = correctOddsOption(apiMatch.score.regularTime ?? apiMatch.score.fullTime);
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
