import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { FirebaseMatch, getCheckScoreQueue } from "./constants";

export async function newMatchHandler(snap: QueryDocumentSnapshot) {
	const match = snap.data() as FirebaseMatch;

	await getCheckScoreQueue().enqueue(
		{
			mid: snap.id,
		},
		{
			scheduleTime: match.utcDate.toDate(),
		}
	);
}
