import { CollectionReference, Firestore } from "firebase-admin/firestore";
import { Bet } from "../types/Bet";
import { matchDoc } from "./matchExtensions";

export function betCollection(db: Firestore, mid: string): CollectionReference<Bet> {
    return matchDoc(db, mid).collection("bets") as CollectionReference<Bet>;
}
