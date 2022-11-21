import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { FirebaseMatch, getQueue } from "./constants";

export async function newMatchHandler(snap: QueryDocumentSnapshot) {
	const match = snap.data() as FirebaseMatch;

	await getQueue().enqueue(
		{
			mid: snap.id,
		},
		{
			scheduleTime: match.utcDate.toDate(),
		}
	);
}
