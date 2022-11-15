import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const db = admin.firestore();

exports.newUser = functions
	.region("europe-central2")
	.auth.user().onCreate(async (user) => {
		const docRef = db.collection("users").doc(user.uid);
		await docRef.set({
			name: user.displayName,
			email: user.email,
			timestamp: admin.firestore.FieldValue.serverTimestamp(),
		});
	});
