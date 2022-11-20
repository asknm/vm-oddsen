import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { DtoMatch, ApiMatch } from "common";
import { FirebaseMatch } from "../constants";
import { fromApiTeam } from "./teamExtensions";

export function fromSnapshot(snapshot: QueryDocumentSnapshot<FirebaseMatch>): DtoMatch {
    const dbMatch = snapshot.data();
    return {
        id: snapshot.id,
        utcDate: dbMatch.utcDate.toMillis(),
        homeTeam: dbMatch.homeTeam,
        awayTeam: dbMatch.awayTeam,
    };
}

export function fromApiMatch(apiMatch: ApiMatch): DtoMatch {
    return {
        id: apiMatch.id.toString(),
        utcDate: Date.parse(apiMatch.utcDate),
        homeTeam: fromApiTeam(apiMatch.homeTeam),
        awayTeam: fromApiTeam(apiMatch.awayTeam),
    };
}
