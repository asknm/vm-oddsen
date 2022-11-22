import React from 'react';
import { onSnapshot } from "@firebase/firestore"
import { DtoMatch, ToOddsArray } from "common"
import { useEffect, useState } from "react"
import OddsAsBookmaker from "./OddsAsBookmaker"
import OddsAsBetter from "./OddsAsBetter"
import { getOddsRef, OddsWithBookmakerName, ToOddsWithBookmakerName } from "../../../types/Odds"
import { Typography } from '@mui/material';

type OddsProps = {
    match: DtoMatch,
    uid: string,
}

export default function Odds(props: OddsProps) {
    const [odds, setOdds] = useState<OddsWithBookmakerName | undefined>();

    useEffect(() => {
        onSnapshot(getOddsRef(props.match.id), async doc => {
            if (doc.exists()) {
                const withName = await ToOddsWithBookmakerName(doc.data());
                setOdds(withName);
            }
        });
    }, []);

    let oddsComponent: JSX.Element | null = null;
    if (odds) {
        if (props.uid === odds.bookmaker.id) {
            oddsComponent = <OddsAsBookmaker odds={odds} mid={props.match.id} />
        }
        else if (odds.H) {
            oddsComponent = <OddsAsBetter odds={ToOddsArray(odds)} match={props.match} uid={props.uid} />
        }
    }

    return <div>
        <Typography variant="body1" > {odds?.bookmaker.name} </Typography>
        {oddsComponent}
    </div>

}