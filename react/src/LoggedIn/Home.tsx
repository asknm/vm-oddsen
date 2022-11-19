import { getFunctions, httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { FirebaseMatchDictionary } from "../types/matchDictionary";

export default function Home() {
    const [matchDict, setMatchDict] = useState({} as FirebaseMatchDictionary)

    useEffect(() => {

        async function getMatches() {
            const getMatches = httpsCallable<null, FirebaseMatchDictionary>(getFunctions(undefined, "europe-central2"), 'getMatches');
            const res = await getMatches.call(null);
            setMatchDict(res.data);
        }

        if (!Object.keys(matchDict).length) {
            getMatches()
        }
    })

    return <div>
        {
            Object.keys(matchDict).map(value => <p>{value}</p>)
        }
    </div>
}