import { doc, DocumentReference, getFirestore, onSnapshot } from "@firebase/firestore"
import { DtoMatch, ToOddsArray } from "common"
import { useState } from "react"
import { getAuth } from "@firebase/auth"
import OddsAsBookmaker from "./OddsAsBookmaker"
import OddsAsBetter from "./OddsAsBetter"
import { OddsWithRef } from "../../../types/Odds"

type OddsProps = {
    match: DtoMatch
}

export default function Odds(props: OddsProps) {
    const [odds, setOdds] = useState<OddsWithRef | undefined>();

    onSnapshot(doc(getFirestore(), "matches", props.match.id, "odds", "odds") as DocumentReference<OddsWithRef>, doc => {
        if (doc.exists()) {
            setOdds(doc.data());
        }
    })

    const uid = getAuth().currentUser?.uid;

    if (odds && uid) {
        if (uid === odds.bookmaker.id) {
            return <OddsAsBookmaker odds={odds} mid={props.match.id} />
        }
        else if (odds.H) {
            return <OddsAsBetter odds={ToOddsArray(odds)} mid={props.match.id} uid={uid} />
        }
    }

    return <div></div>

}