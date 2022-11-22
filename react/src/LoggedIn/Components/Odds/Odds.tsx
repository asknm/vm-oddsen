import React from 'react';
import { doc, DocumentReference, getFirestore, onSnapshot } from "@firebase/firestore"
import { DtoMatch, ToOddsArray } from "common"
import { useEffect, useState } from "react"
import OddsAsBookmaker from "./OddsAsBookmaker"
import OddsAsBetter from "./OddsAsBetter"
import { OddsWithRef } from "../../../types/Odds"

type OddsProps = {
    match: DtoMatch,
    uid: string,
}

export default function Odds(props: OddsProps) {
    const [odds, setOdds] = useState<OddsWithRef | undefined>();

    useEffect(() => {
        onSnapshot(doc(getFirestore(), "matches", props.match.id, "odds", "odds") as DocumentReference<OddsWithRef>, doc => {
            if (doc.exists()) {
                setOdds(doc.data());
            }
        });
    }, []);

    if (odds) {
        if (props.uid === odds.bookmaker.id) {
            return <OddsAsBookmaker odds={odds} mid={props.match.id} />
        }
        else if (odds.H) {
            return <OddsAsBetter odds={ToOddsArray(odds)} match={props.match} uid={props.uid} />
        }
    }

    return <div></div>

}