import { DtoMatchDictionary, DtoMatch } from "common";
import { CollectionReference, Firestore } from "firebase-admin/firestore";
import { logger, Response } from "firebase-functions/v1";
import { FirebaseMatch, getFetchMatchesQueue } from "./constants";
import { fromApiMatch as dtoMatchFromApi, fromSnapshot } from "./extensions/dtoMatchExtensions";
import { fromApiMatch as firebaseMatchFromApi } from "./extensions/firebaseMatchExtensions";
import { getMatchesFromApi } from "./helpers/apiHelpers";


export async function getMatchesHandler(db: Firestore, apiKey: string, res: Response) {
    res.set('Access-Control-Allow-Origin', '*');
    try {
        const matchesCollection = db.collection("matches") as CollectionReference<FirebaseMatch>;

        const matches = await getMatchesFromDb(matchesCollection);

        if (!matches.length) {
            logger.log('Fetching matches from api');
            const matchesFromApi = await getMatchesFromApi(apiKey);
            const batch = db.batch();
            for (const match of matchesFromApi) {
                const ref = matchesCollection.doc(match.id.toString());
                batch.set(ref, firebaseMatchFromApi(match));
                matches.push(dtoMatchFromApi(match));
            }
            await batch.commit();
        }

        const matchDict = matches.reduce<DtoMatchDictionary>((previous, current) => {
            const date = new Date(current.utcDate);
            const dateValue = Date.UTC(date.getUTCFullYear(), date.getMonth(), date.getDate());
            if (previous[dateValue]) {
                previous[dateValue].push(current);
            }
            else {
                previous[dateValue] = [current];
            }
            return previous;
        }, {});

        await getFetchMatchesQueue().enqueue(
            {
                id: new Date().getHours(),
            },
            {
            }
        );

        res.set('Cache-Control', 'public, max-age=3600');
        res.status(200).send(matchDict);
    } catch (error) {
        res.status(500).send(error);
    }
}

async function getMatchesFromDb(matchesCollection: CollectionReference<FirebaseMatch>): Promise<DtoMatch[]> {
    const snapshot = await matchesCollection.orderBy("utcDate").get();
    return snapshot.docs.map(doc => fromSnapshot(doc));
}
