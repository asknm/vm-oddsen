import { doc, DocumentReference, getFirestore, onSnapshot } from "@firebase/firestore"
import { DtoMatch, OddsWithBookmaker, ToOddsArray } from "common"
import { useState } from "react"
import { getAuth } from "@firebase/auth"
import OddsAsBookmaker from "./OddsAsBookmaker"
import OddsAsBetter from "./OddsAsBetter"

type OddsProps = {
    match: DtoMatch
}

export default function Odds(props: OddsProps) {
    const [odds, setOdds] = useState<OddsWithBookmaker | undefined>();

    onSnapshot(doc(getFirestore(), "matches", props.match.id, "odds", "odds") as DocumentReference<OddsWithBookmaker>, doc => {
        if (doc.exists()) {
            setOdds(doc.data());
        }
    })

    const uid = getAuth().currentUser?.uid;

    if (!odds || !uid) {
        return <div></div>
    }

    if (uid === odds.bookmaker) {
        return <OddsAsBookmaker odds={odds} mid={props.match.id} />
    }
    else {
        return <OddsAsBetter odds={ToOddsArray(odds)} mid={props.match.id} uid={uid} />   
    }

}