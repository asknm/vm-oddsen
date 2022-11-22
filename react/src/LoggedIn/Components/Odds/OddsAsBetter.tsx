import React from 'react';
import { doc, DocumentReference, getFirestore, onSnapshot } from "@firebase/firestore"
import { DtoMatch, HasStarted, OddsArray } from "common"
import { useEffect, useState } from "react"
import { BaseBet } from "../../../types/Bet"
import OddsBetter from "./OddsBetter"
import OddsViewer from "./OddsViewer"

type OddsAsBetterProps = {
    odds: OddsArray,
    match: DtoMatch,
    uid: string,
}

export default function OddsAsBetter(props: OddsAsBetterProps) {
    const [bet, setBet] = useState<BaseBet | null | undefined>(undefined);

    useEffect(() => {
        onSnapshot(doc(getFirestore(), "matches", props.match.id, "bets", props.uid) as DocumentReference<BaseBet>, doc => {
            if (!doc.exists()) {
                setBet(null);
                return;
            }
            setBet(doc.data());
        });
    }, []);

    if (bet === null && !HasStarted(props.match)) {
        return <OddsBetter odds={props.odds} mid={props.match.id} uid={props.uid} />
    }

    return <OddsViewer odds={props.odds} />

}