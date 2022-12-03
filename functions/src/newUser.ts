import { UserRecord } from "firebase-admin/auth";
import { FieldValue, Firestore } from "firebase-admin/firestore";
import { InsertUser } from "./constants";

export async function newUserHandler(userRecord: UserRecord, db: Firestore) {
	const docRef = db.collection("users").doc(userRecord.uid);
	const user: InsertUser = {
		name: userRecord.displayName ?? "No name",
		timestamp: FieldValue.serverTimestamp(),
	};
	await docRef.set(user);
}
