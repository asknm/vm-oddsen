import { IApiMatch } from "../../../common/football-data/match";
import { DocumentData, DocumentReference, Firestore, UpdateData } from "firebase-admin/firestore";
import axios from 'axios';

export async function checkScoreHandler(mid: string, db: Firestore, apiKey: string) {
    const [apiMatch, dbScore] = await Promise.all([
        getMatchFromApi(mid),
        getScoreFromDb(mid),
    ]);

    if (!dbScore) {
        await scoreDoc(mid).set({
            home: apiMatch.score.fullTime.home,
            away: apiMatch.score.fullTime.away,
        });
    }
    else {
        const updateData: UpdateData = {};

        if (apiMatch.score.fullTime.home !== dbScore["home"]) {
            updateData["home"] = apiMatch.score.fullTime.home;
        }
        if (apiMatch.score.fullTime.away !== dbScore["away"]) {
            updateData["away"] = apiMatch.score.fullTime.away;
        }

        if (Object.keys(updateData).length) {
            await scoreDoc(mid).update(updateData);
        }
    }

    if (apiMatch.status !== "FINISHED") {
        throw new Error();
    }
    else {
        // TODO: Settle debts
        // TODO: Set next bookmakker
    }

    async function getMatchFromApi(mid: string): Promise<IApiMatch> {
        const response = await axios.get(`https://api.football-data.org/v4/matches/${mid}`, {
            headers: {
                "X-Auth-Token": apiKey,
            },
        });
        return response.data;
    }

    function scoreDoc(mid: string): DocumentReference {
        return db.collection("matches").doc(mid).collection("score").doc("score");
    }

    async function getScoreFromDb(mid: string): Promise<DocumentData | undefined> {
        const doc = await scoreDoc(mid).get();
        if (!doc.exists) {
            return undefined;
        }
        return doc.data();
    }
}
