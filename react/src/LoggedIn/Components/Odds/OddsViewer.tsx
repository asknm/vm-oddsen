import { createTheme, responsiveFontSizes, ThemeProvider, Typography } from '@mui/material';
import { OddsOptions } from 'common';

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import RGL, { WidthProvider } from "react-grid-layout";
const ReactGridLayout = WidthProvider(RGL);

type OddsViewerProps = {
    odds: number[],
    betAmount: number | undefined,
    betSelection: OddsOptions | undefined,
}

export default function OddsViewer(props: OddsViewerProps) {
    const selectionSymbols = ["H", "U", "B"];
    let bet = <p></p>
    if (props.betSelection) {
        bet = <p> Du satt {props.betAmount}kr på {selectionSymbols[props.betSelection]} </p>
    }

    const theme = responsiveFontSizes(createTheme())

    const layout = [
        { i: 'h', x: 0, y: 0, w: 1, h: 1, static: true },
        { i: 'u', x: 1, y: 0, w: 1, h: 1, static: true },
        { i: 'b', x: 2, y: 0, w: 1, h: 1, static: true },
        { i: 'o0', x: 0, y: 1, w: 1, h: 1, static: true },
        { i: 'o1', x: 1, y: 1, w: 1, h: 1, static: true },
        { i: 'o2', x: 2, y: 1, w: 1, h: 1, static: true },
        { i: 'bet', x: 0, y: 2, w: 3, h: 1, static: true },
    ];

    return <ThemeProvider theme={theme}>
        <ReactGridLayout layout={layout} cols={3} rowHeight={32}>

            <Typography variant="body1" key="h" component={'span'}> H </Typography>
            <Typography variant="body1" key="u" component={'span'}> U </Typography>
            <Typography variant="body1" key="b" component={'span'}> B </Typography>

            <Typography variant="body1" key="o0" component={'span'}> {props.odds[OddsOptions.H]} </Typography>
            <Typography variant="body1" key="o1" component={'span'}> {props.odds[OddsOptions.U]} </Typography>
            <Typography variant="body1" key="o2" component={'span'}> {props.odds[OddsOptions.B]} </Typography>

            <Typography variant="body1" key="bet" component={'span'}> {bet} </Typography>
        </ReactGridLayout>
    </ThemeProvider>

}