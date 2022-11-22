import React from 'react';
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import Typography from "@mui/material/Typography/Typography";
import createTheme from "@mui/material/styles/createTheme";
import responsiveFontSizes from "@mui/material/styles/responsiveFontSizes";

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import RGL, { WidthProvider } from "react-grid-layout";

import { DtoMatch } from "common";

type MatchProps = {
    match: DtoMatch
}

export default function Match(props: MatchProps) {

    const ReactGridLayout = WidthProvider(RGL);

    const layout = [
        { i: 'date', x: 0, y: 0, w: 3, h: 1, static: true },
        { i: 'odds', x: 3, y: 0, w: 2, h: 1, static: true },
        { i: 'f0', x: 0, y: 1, w: 1, h: 2, static: true },
        { i: 't0', x: 1, y: 1, w: 1, h: 2, static: true },
        { i: '-', x: 2, y: 1, w: 1, h: 2, static: true },
        { i: 't1', x: 3, y: 1, w: 1, h: 2, static: true },
        { i: 'f1', x: 4, y: 1, w: 1, h: 2, static: true },
    ];

    const theme = responsiveFontSizes(createTheme())

    return <div style={{ border: "1px solid black" }} >
        <ThemeProvider theme={theme}>
            <ReactGridLayout layout={layout} cols={5} rowHeight={32}>
                <Typography variant="h6" key="date"> {new Date(props.match.utcDate).toLocaleTimeString()} </Typography>
                {/* TODO: <Typography variant="body1" key="odds" align="right"> Odds: {this.state.oddsSetterName} </Typography> */}

                <div key="f0"> <img alt="" src={props.match.homeTeam.crest} height={50} /> </div>
                <Typography variant="body1" key="t0" align="center"> {props.match.homeTeam.name} </Typography>
                {/* TODO: <Typography variant="h6" key="-" align="center"> {getStanding(props.match.score)?.homeTeam} - {getStanding(this.props.match.score)?.awayTeam} </Typography> */}
                <Typography variant="body1" key="t1" align="center"> {props.match.awayTeam.name} </Typography>
                <div key="f1"> <img alt="" src={props.match.awayTeam.crest} height={50} /> </div>
            </ReactGridLayout>
        </ThemeProvider>
    </div>

}