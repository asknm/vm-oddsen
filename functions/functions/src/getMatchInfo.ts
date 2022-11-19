import { FirebaseMatch, FirebaseMatchDictionary } from "./constants";
import { IApiMatch } from "../../../common/football-data/match";
import { Firestore, Timestamp } from "firebase-admin/firestore";
import axios from 'axios';
import { fromApiTeam } from "../../../common/base/team";
import { logger } from "firebase-functions/v1";


export async function getMatchesHandler(db: Firestore, apiKey: string) {
    const matchesCollection = db.collection("matches");

    const matches = await getMatchesFromDb();

    if (!matches.length) {
        logger.log('Fetching matches from api');
        const matchesFromApi = await getMatchesFromApi();
        const batch = db.batch();
        for (const match of matchesFromApi) {
            const ref = matchesCollection.doc(match.id.toString());
            const data: FirebaseMatch = {
                utcDate: Timestamp.fromMillis(Date.parse(match.utcDate)),
                homeTeam: fromApiTeam(match.homeTeam),
                awayTeam: fromApiTeam(match.awayTeam),
            };
            batch.set(ref, data);
            matches.push(data);
        }
        await batch.commit();
    }

    return matches.reduce<FirebaseMatchDictionary>((previous, current) => {
        const timestamp: Timestamp = current.utcDate;
        const dateString = timestamp.toDate().toLocaleDateString('no-NO');
        if (previous[dateString]) {
            previous[dateString].push(current);
        }
        else {
            previous[dateString] = [current];
        }
        return previous;
    }, {});

    async function getMatchesFromDb(): Promise<FirebaseMatch[]> {
        const snapshot = await matchesCollection.get();
        return snapshot.docs.map(doc => doc.data() as FirebaseMatch);
    }

    async function getMatchesFromApi(): Promise<IApiMatch[]> {
        const response = await axios.get('https://api.football-data.org/v4/competitions/2000/matches', {
            headers: {
                "X-Auth-Token": apiKey,
            },
        });
        const data = response.data;
        return data.matches;
    }
}
