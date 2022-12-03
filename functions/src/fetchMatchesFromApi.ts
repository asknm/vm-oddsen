import { ApiMatch } from "common";
import { Firestore } from "firebase-admin/firestore";
import { matchDoc } from "./extensions/matchExtensions";
import { fromApiTeam } from "./extensions/teamExtensions";
import { getMatchesFromApiFromDate } from "./helpers/apiHelpers";

export async function fetchMatchesFromApiHandler(db: Firestore, apiKey: string) {
    const matchesFromApi = await getMatchesFromApiFromDate(apiKey, new Date());
    await Promise.all(matchesFromApi.map(async apiMatch => await setMatchTeamsIfMissing(apiMatch)));

    async function setMatchTeamsIfMissing(apiMatch: ApiMatch) {
        const matchRef = matchDoc(db, apiMatch.id.toString());
        const snapshot = await matchRef.get();
        const matchData = snapshot.data();
        if (!matchData) {
            return;
        }
        if ((matchData.homeTeam.name || !apiMatch.homeTeam.name) && ((matchData.awayTeam.name || !apiMatch.awayTeam.name))) {
            return;
        }
        await matchRef.update({
            homeTeam: fromApiTeam(apiMatch.homeTeam),
            awayTeam: fromApiTeam(apiMatch.awayTeam),
        });
    }
}
