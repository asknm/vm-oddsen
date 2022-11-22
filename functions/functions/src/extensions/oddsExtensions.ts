import { Standing, Odds } from "common";
import { DocumentReference, Firestore } from "firebase-admin/firestore";
import { OddsWithBookmakerRef } from "../types/Odds";
import { matchDoc } from "./matchExtensions";

enum OddsOptions {
    H,
    U,
    B,
}

export function oddsDoc(db: Firestore, mid: string): DocumentReference<OddsWithBookmakerRef> {
    return matchDoc(db, mid).collection("odds").doc("odds") as DocumentReference<OddsWithBookmakerRef>;
}

export function correctOddsOption(finalStanding: Standing): OddsOptions {
    if (finalStanding.home > finalStanding.away) {
        return OddsOptions.H;
    }
    else if (finalStanding.home === finalStanding.away) {
        return OddsOptions.U;
    }
    else {
        return OddsOptions.B;
    }
}

export function oddsValue(odds: Odds, option: OddsOptions): number {
    switch (option) {
        case OddsOptions.H:
            return odds.H;
        case OddsOptions.U:
            return odds.U;
        case OddsOptions.B:
            return odds.B;
    }
}
