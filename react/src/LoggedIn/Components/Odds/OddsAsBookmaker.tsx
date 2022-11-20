import { Odds, ToOddsArray } from "common"
import OddsSetter from "./OddsSetter"
import OddsViewer from "./OddsViewer"

type OddsAsBookmakerProps = {
    odds: Odds,
    mid: string
}

export default function OddsAsBookmaker(props: OddsAsBookmakerProps) {

    if (props.odds.H) {
        return <OddsViewer odds={ToOddsArray(props.odds)} />
    }
    else {
        return <OddsSetter mid={props.mid} />
    } 

}