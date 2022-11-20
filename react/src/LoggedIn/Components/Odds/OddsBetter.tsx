import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import RGL, { WidthProvider } from "react-grid-layout";
import { createTheme, responsiveFontSizes, ThemeProvider, Typography } from '@mui/material';
import NumericInput from 'react-numeric-input';
import { OddsArray, OddsOptions } from 'common';
import { useState } from 'react';
import { doc, getFirestore, serverTimestamp, setDoc } from '@firebase/firestore';
import { getAuth } from '@firebase/auth';
const ReactGridLayout = WidthProvider(RGL);

type OddsBetterProps = {
    mid: string,
    odds: OddsArray,
}

export default function OddsBetter(props: OddsBetterProps) {
    const [selected , setSelected] = useState<OddsOptions | undefined>(undefined)
    const [amount , setAmount] = useState(25)

    async function submit() {
        const uid = getAuth().currentUser?.uid;
        if (selected && uid) {
            const ref = doc(getFirestore(), "matches", props.mid, "bets", uid)
            await setDoc(ref, {
                selection: selected,
                amount: amount,
                timestamp: serverTimestamp()
            })
        }
    }

    const theme = responsiveFontSizes(createTheme())
    
    const layout = [
        { i: 'h', x: 0, y: 0, w: 1, h: 1, static: true },
        { i: 'u', x: 1, y: 0, w: 1, h: 1, static: true },
        { i: 'b', x: 2, y: 0, w: 1, h: 1, static: true },
        { i: 'o0', x: 0, y: 1, w: 1, h: 1, static: true },
        { i: 'o1', x: 1, y: 1, w: 1, h: 1, static: true },
        { i: 'o2', x: 2, y: 1, w: 1, h: 1, static: true },
        { i: 's0', x: 0, y: 2, w: 1, h: 1, static: true },
        { i: 's1', x: 1, y: 2, w: 1, h: 1, static: true },
        { i: 's2', x: 2, y: 2, w: 1, h: 1, static: true },
        { i: 'amount', x: 0, y: 3, w: 3, h: 1, static: true },
        { i: 'submit', x: 0, y: 4, w: 3, h: 1, static: true },
    ];

    return <ThemeProvider theme={theme}>
        <ReactGridLayout layout={layout} cols={3} rowHeight={32}>
            <Typography variant="body1" key="h"> H </Typography>
            <Typography variant="body1" key="u"> U </Typography>
            <Typography variant="body1" key="b"> B </Typography>

            <Typography variant="body1" key="o0"> {props.odds[0]} </Typography>
            <Typography variant="body1" key="o1"> {props.odds[1]} </Typography>
            <Typography variant="body1" key="o2"> {props.odds[2]} </Typography>

            <div key="s0">
                <input type="checkbox" checked={selected === OddsOptions.H} onChange={_ => setSelected(OddsOptions.H)} />
            </div>
            <div key="s1">
                <input type="checkbox" checked={selected === OddsOptions.U} onChange={_ => setSelected(OddsOptions.U)} />
            </div>
            <div key="s2">
                <input type="checkbox" checked={selected === OddsOptions.B} onChange={_ => setSelected(OddsOptions.B)} />
            </div>

            <div key="amount">
                <NumericInput min={1} max={25} value={amount} step={1} onChange={v => v && setAmount(v)} />
            </div>
            <div key="submit">
                <button onClick={e => submit()}>
                    Bekreft
                </button>
            </div>
        </ReactGridLayout>
    </ThemeProvider>

}