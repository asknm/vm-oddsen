import { doc, DocumentReference, getFirestore, onSnapshot } from "@firebase/firestore"
import { BaseBet, OddsArray } from "common"
import { useState } from "react"
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
        return <OddsViewer odds={props.odds} betAmount={undefined} betSelection={undefined} />
    }
    else if (bet === null) {
        return <OddsBetter odds={props.odds} mid={props.mid} />
    }

    return <div></div>

}