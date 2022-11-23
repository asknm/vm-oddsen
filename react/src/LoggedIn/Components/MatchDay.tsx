import React, { useState } from 'react';
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import Typography from "@mui/material/Typography/Typography";


import { DtoMatch } from "common";
import { Collapse, createTheme, responsiveFontSizes } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Match from './Match';

type MatchDayProps = {
    date: number,
    matches: DtoMatch[]
}

export default function MatchDay(props: MatchDayProps) {
    const [expanded, setExpanded] = useState(Date.now() - 24 * 60 * 60 * 1000 < props.date);

    let theme = createTheme();
    theme = responsiveFontSizes(theme);

    const navigate = useNavigate();
    function navigateToMatchPage(match: DtoMatch) {
        navigate(`/m/${match.id}`, {
            state: {
                match: match,
            }
        });
    }

    function toggleExpanded() {
        setExpanded(!expanded);
    }

    return <ThemeProvider theme={theme} key={props.date}>
        <div style={{ border: "1px solid black" }} onClick={() => toggleExpanded()} >
            <Typography variant="h5"> {new Date(props.date).toLocaleDateString('no-NO')} </Typography>
            <Collapse in={expanded}>
                {props.matches.map((value, index) => {
                    return <div className={"row"} key={index} onClick={() => navigateToMatchPage(value)}>
                        <Match match={value} />
                    </div>
                })}
            </Collapse>
        </div>
        <p></p>
    </ThemeProvider>
}