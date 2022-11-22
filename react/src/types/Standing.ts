import { doc, DocumentReference, getDoc, getFirestore } from "@firebase/firestore";
import { StandingWithFinished } from "common";

export function getStandingRef(mid: string): DocumentReference<StandingWithFinished> {
    return doc(getFirestore(), "matches", mid, "score", "score") as DocumentReference<StandingWithFinished>;
}

export async function getStanding(mid: string): Promise<StandingWithFinished | undefined> {
    const ref = getStandingRef(mid);
    const snap = await getDoc(ref);
    return snap.data();
}
