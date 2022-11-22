import { FieldValue, QueryDocumentSnapshot, Timestamp } from "@firebase/firestore";
import { IBaseBet, IBetWithBetter } from "common";
import { getUserFromId } from "./User";

export type BaseBet = IBaseBet<Timestamp>;
export type BetWithBetter = IBetWithBetter<Timestamp>;
export type InsertBet = IBaseBet<FieldValue>;

export async function ToBetWithBetter(snapshot: QueryDocumentSnapshot<BaseBet>): Promise<BetWithBetter> {
    const user = await getUserFromId(snapshot.id);
    const baseBet = snapshot.data();
    return {
        better: user?.name ?? snapshot.id, 
        selection: baseBet.selection,
        amount: baseBet.amount,
        timestamp: baseBet.timestamp,
    };
}