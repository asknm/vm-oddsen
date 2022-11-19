import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { getFunctions } from "firebase-admin/functions";
import { FirebaseMatch, myRegion } from "./constants";

export async function newMatchHandler(snap: QueryDocumentSnapshot) {
	const queue = getFunctions().taskQueue(`locations/${myRegion}/functions/checkScore`);

	const match = snap.data() as FirebaseMatch;

	await queue.enqueue(
		{
			mid: snap.id,
		},
		{
			scheduleTime: match.utcDate.toDate(),
		}
	);
}
