import { doc, DocumentReference, getDoc, getFirestore } from "@firebase/firestore";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom"
import { DtoMatch } from "common";
import { FirebaseMatch, ToDtoMatch } from "../../types/FirebaseMatch";
import Match from "../Components/Match"
import Odds from "../Components/Odds/Odds";


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

    return <div>
        {match &&
            <div>
                <Match match={match} />
                <Odds match={match} />
            </div>
        }
    </div>

}