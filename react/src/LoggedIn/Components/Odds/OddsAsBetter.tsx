import { doc, DocumentReference, getFirestore, onSnapshot } from "@firebase/firestore"
import { OddsArray } from "common"
import { useState } from "react"
import { BaseBet } from "../../../types/Bet"
import OddsBetter from "./OddsBetter"
import OddsViewer from "./OddsViewer"

type OddsAsBetterProps = {
    odds: OddsArray,
    mid: string,
    uid: string,
}

export default function OddsAsBetter(props: OddsAsBetterProps) {
    const [bet, setBet] = useState<BaseBet | null | undefined>(undefined);

    onSnapshot(doc(getFirestore(), "matches", props.mid, "bets", props.uid) as DocumentReference<BaseBet>, doc => {
        if (!doc.exists()) {
            setBet(null);
            return;
        }
        setBet(doc.data());
    });

    if (bet) {
        return <OddsViewer odds={props.odds} />
    }
    else if (bet === null) {
        return <OddsBetter odds={props.odds} mid={props.mid} uid={props.uid} />
    }

    return <div></div>

}