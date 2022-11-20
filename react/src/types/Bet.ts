import { doc, DocumentReference, FieldValue, getDoc, getFirestore, QueryDocumentSnapshot, Timestamp } from "@firebase/firestore";
import { IBaseBet, IBetWithBetter } from "common";
import { User } from "./User";

export type BaseBet = IBaseBet<Timestamp>;
export type BetWithBetter = IBetWithBetter<Timestamp>;
export type InsertBet = IBaseBet<FieldValue>;

export async function ToBetWithBetter(snapshot: QueryDocumentSnapshot<BaseBet>): Promise<BetWithBetter> {
    const userDoc = await getDoc(doc(getFirestore(), "users", snapshot.id) as DocumentReference<User>);
    const user = userDoc.data();
    const baseBet = snapshot.data();
    console.log(baseBet);
    return {
        better: user?.name ?? snapshot.id, 
        selection: baseBet.selection,
        amount: baseBet.amount,
        timestamp: baseBet.timestamp,
    };
}