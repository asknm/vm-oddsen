import { UserRecord } from "firebase-admin/auth";
import { FieldValue, Firestore } from "firebase-admin/firestore";

export async function newUserHandler(user: UserRecord, db: Firestore) {
	const docRef = db.collection("users").doc(user.uid);
	await docRef.set({
		name: user.displayName,
		email: user.email,
		timestamp: FieldValue.serverTimestamp(),
	});
}
