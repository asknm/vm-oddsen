import React from 'react';

import { getFunctions, httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { DtoMatchDictionary } from "common";
import MatchDay from './Components/MatchDay';

export default function Dashboard() {
    const [matchDict, setMatchDict] = useState({} as DtoMatchDictionary)

    useEffect(() => {

        async function getMatches() {
            const getMatches = httpsCallable<null, DtoMatchDictionary>(getFunctions(undefined, "europe-central2"), 'getMatches');
            const res = await getMatches.call(null);
            const data = res.data;
            setMatchDict(data);
        }

        getMatches()
    }, []);

    return <div>
        {
            Object.entries(matchDict).map(([key, matches]) =>
                <MatchDay matches={matches} date={parseInt(key)} key={key} />
            )
        }
    </div >
}