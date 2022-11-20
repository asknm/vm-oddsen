import { Typography } from "@mui/material";
import { OddsOptions } from "common";
import OddsViewer from "./OddsViewer";

type OddsBetterViewProps = {
    odds: number[],
    betAmount: number,
    betSelection: OddsOptions,
}

export default function OddsBetterView(props: OddsBetterViewProps) {

    const selectionSymbols = ["H", "U", "B"];

    return <div>
        <OddsViewer odds={props.odds} />
        <Typography variant="body1" key="bet" component={'span'}> Du satt {props.betAmount}kr på {selectionSymbols[props.betSelection]} </Typography>
    </div>
}