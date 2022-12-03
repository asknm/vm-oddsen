import React from 'react';

import { useEffect, useState } from "react";
import { DtoMatchDictionary } from "common";
import MatchDay from './Components/MatchDay';

export default function Dashboard() {
    const [matchDict, setMatchDict] = useState({} as DtoMatchDictionary)

    useEffect(() => {

        async function getMatches() {
            const projectId = require('../firebase-config.json').result.sdkConfig.projectId;
            const response = await fetch(`https://europe-central2-${projectId}.cloudfunctions.net/getMatchesHttp`);
            const data = await response.json();
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