import { CollectionReference, DocumentReference, Firestore } from "firebase-admin/firestore";
import { FirebaseMatch } from "../types/Match";

export function matchCollection(db: Firestore): CollectionReference<FirebaseMatch> {
    return db.collection("matches") as CollectionReference<FirebaseMatch>;
}

export function matchDoc(db: Firestore, mid: string): DocumentReference<FirebaseMatch> {
    return db.collection("matches").doc(mid) as DocumentReference<FirebaseMatch>;
}
