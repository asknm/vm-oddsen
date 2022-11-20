import { Timestamp } from "firebase-admin/firestore";
import { ApiMatch } from "common";
import { FirebaseMatch } from "../constants";
import { fromApiTeam } from "./teamExtensions";

export function fromApiMatch(apiMatch: ApiMatch): FirebaseMatch {
    return {
        utcDate: Timestamp.fromMillis(Date.parse(apiMatch.utcDate)),
        homeTeam: fromApiTeam(apiMatch.homeTeam),
        awayTeam: fromApiTeam(apiMatch.awayTeam),
    };
}
