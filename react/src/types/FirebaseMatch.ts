import { DocumentSnapshot, Timestamp } from "@firebase/firestore";
import { BaseMatch, DtoMatch } from "common";

export type FirebaseMatch = BaseMatch<Timestamp>;

export function ToDtoMatch(snapshot: DocumentSnapshot<FirebaseMatch>): DtoMatch | undefined {
    const dbMatch = snapshot.data();
    if (!dbMatch) {
        return undefined;
    }
    return {
        id: snapshot.id,
        utcDate: dbMatch.utcDate.toMillis(),
        homeTeam: dbMatch.homeTeam,
        awayTeam: dbMatch.awayTeam,
    };
}
