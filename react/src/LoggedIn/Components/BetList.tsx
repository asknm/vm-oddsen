import { useState } from "react"
import { collection, CollectionReference, getFirestore, onSnapshot } from "@firebase/firestore"
import { BaseBet, BetWithBetter, ToBetWithBetter } from "../../types/Bet"
import { Typography } from "@mui/material"

type BetListProps = {
    mid: string,
}

export default function BetList(props: BetListProps) {
    const [bets, setBets] = useState<BetWithBetter[]>([])

    onSnapshot(collection(getFirestore(), "matches", props.mid, "bets") as CollectionReference<BaseBet>, async snapshot => {
        const betsWithBetterName = await Promise.all<BetWithBetter>(snapshot.docs.map(async doc => await ToBetWithBetter(doc)));
        setBets(betsWithBetterName);
    })

    const selectionSymbols = ["H", "U", "B"];

    return <div>
        {bets.map((value, index) => {
            return <Typography variant="body1" key={index}> {value.amount}kr på {selectionSymbols[value.selection]} : {value.better} : {value.timestamp.toDate().toLocaleString()} </Typography>
        })}
    </div>

}
