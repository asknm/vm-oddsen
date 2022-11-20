import { doc, DocumentReference, getFirestore, onSnapshot } from "@firebase/firestore"
import { DtoMatch, ToOddsArray } from "common"
import { useState } from "react"
import OddsAsBookmaker from "./OddsAsBookmaker"
import OddsAsBetter from "./OddsAsBetter"
import { OddsWithRef } from "../../../types/Odds"
import { HasStarted } from "common/dist/dto/match"

type OddsProps = {
    match: DtoMatch,
    uid: string,
}

export default function Odds(props: OddsProps) {
    const [odds, setOdds] = useState<OddsWithRef | undefined>();

    onSnapshot(doc(getFirestore(), "matches", props.match.id, "odds", "odds") as DocumentReference<OddsWithRef>, doc => {
        if (doc.exists()) {
            setOdds(doc.data());
        }
    })

    if (odds) {
        if (props.uid === odds.bookmaker.id) {
            return <OddsAsBookmaker odds={odds} mid={props.match.id} />
        }
        else if (odds.H && !HasStarted(props.match)) {
            return <OddsAsBetter odds={ToOddsArray(odds)} mid={props.match.id} uid={props.uid} />
        }
    }

    return <div></div>

}