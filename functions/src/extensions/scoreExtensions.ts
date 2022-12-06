import { StandingWithFinished } from "common";
import { CollectionGroup, Firestore, QuerySnapshot } from "firebase-admin/firestore";


export function scoreCollectionGroup(db: Firestore): CollectionGroup<StandingWithFinished> {
    return db.collectionGroup("score") as CollectionGroup<StandingWithFinished>;
}

export async function scoresOfFinishedMatches(db: Firestore): Promise<QuerySnapshot<StandingWithFinished>> {
    const query = scoreCollectionGroup(db).where("finished", "==", true);
    return await query.get();
}
