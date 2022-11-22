import { doc, DocumentReference, getDoc, getFirestore, Timestamp } from "@firebase/firestore";
import { IUser } from "common";

export type User = IUser<Timestamp>;

export async function getUserFromId(uid: string): Promise<User | undefined> {
    const ref = doc(getFirestore(), "users", uid) as DocumentReference<User>;
    return getUserFromRef(ref);
}

export async function getUserFromRef(ref: DocumentReference<User>): Promise<User | undefined> {
    const userDoc = await getDoc(ref);
    return userDoc.data();
}
