import { doc, DocumentReference, getDoc, getFirestore } from "@firebase/firestore";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom"
import { DtoMatch } from "common";
import { FirebaseMatch, ToDtoMatch } from "../../types/Match";
import Match from "../Components/Match"
import Odds from "../Components/Odds/Odds";
import { getAuth } from "@firebase/auth";
import BetList from "../Components/BetList";


export default function MatchPage() {
    const { state } = useLocation();
    const stateMatch: DtoMatch | undefined = state?.match;

    const [match, setMatch] = useState<DtoMatch | undefined>(stateMatch);

    const { mid }: any = useParams();

    if (!match) {
        getMatch(mid);
    }

    async function getMatch(mid: string) {
        const ref = doc(getFirestore(), "matches", mid) as DocumentReference<FirebaseMatch>;
        const document = await getDoc(ref);
        const dtoMatch = ToDtoMatch(document);
        if (dtoMatch) {
            setMatch(dtoMatch);
        }
    }

    const uid = getAuth().currentUser?.uid;

    return <div>
        {match && uid &&
            <div>
                <Match match={match} />
                <Odds match={match} uid={uid} />
                <BetList mid={match.id} />
            </div>
        }
    </div>

}