import { DtoMatchDictionary, DtoMatch, ApiMatch } from "common";
import { CollectionReference, Firestore } from "firebase-admin/firestore";
import axios from 'axios';
import { logger } from "firebase-functions/v1";
import { FirebaseMatch } from "./constants";
import { fromApiMatch as dtoMatchFromApi, fromSnapshot } from "./extensions/dtoMatchExtensions";
import { fromApiMatch as firebaseMatchFromApi } from "./extensions/firebaseMatchExtensions";


export async function getMatchesHandler(db: Firestore, apiKey: string) {
    const matchesCollection = db.collection("matches") as CollectionReference<FirebaseMatch>;

    const matches = await getMatchesFromDb();

    if (!matches.length) {
        logger.log('Fetching matches from api');
        const matchesFromApi = await getMatchesFromApi();
        const batch = db.batch();
        for (const match of matchesFromApi) {
            const ref = matchesCollection.doc(match.id.toString());
            batch.set(ref, firebaseMatchFromApi(match));
            matches.push(dtoMatchFromApi(match));
        }
        await batch.commit();
    }

    return matches.reduce<DtoMatchDictionary>((previous, current) => {
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

    async function getMatchesFromDb(): Promise<DtoMatch[]> {
        const snapshot = await matchesCollection.orderBy("utcDate").get();
        return snapshot.docs.map(doc => fromSnapshot(doc));
    }

    async function getMatchesFromApi(): Promise<ApiMatch[]> {
        const response = await axios.get('https://api.football-data.org/v4/competitions/2000/matches', {
            headers: {
                "X-Auth-Token": apiKey,
            },
        });
        const data = response.data;
        return data.matches;
    }
}
