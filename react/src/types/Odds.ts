import { doc, DocumentReference, getFirestore, getDoc } from "@firebase/firestore";
import { OddsWithBookmaker, UserWithId } from "common";
import { getUserFromRef, User } from "./User";

export type OddsWithBookmakerRef = OddsWithBookmaker<DocumentReference<User>>;
export type OddsWithBookmakerName = OddsWithBookmaker<UserWithId>;

export function getOddsRef(mid: string): DocumentReference<OddsWithBookmakerRef> {
    return doc(getFirestore(), "matches", mid, "odds", "odds") as DocumentReference<OddsWithBookmakerRef>;
}

export async function getOdds(mid: string): Promise<OddsWithBookmakerRef | undefined> {
    const ref = getOddsRef(mid);
    const snap = await getDoc(ref);
    return snap.data();
}

export async function ToOddsWithBookmakerName(oddsWithBookmakerRef: OddsWithBookmakerRef): Promise<OddsWithBookmakerName> {
    const user = await getUserFromRef(oddsWithBookmakerRef.bookmaker);
    return {
        H: oddsWithBookmakerRef.H,
        U: oddsWithBookmakerRef.U,
        B: oddsWithBookmakerRef.B,
        bookmaker: {
            id: oddsWithBookmakerRef.bookmaker.id,
            name: user?.name ?? oddsWithBookmakerRef.bookmaker.id,
        },
    };
}
