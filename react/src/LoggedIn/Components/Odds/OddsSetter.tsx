import React from 'react';
import { doc, DocumentReference, getFirestore, updateDoc } from "@firebase/firestore";
import { useState } from "react";
import NumericInput from "react-numeric-input";
import { Odds, OddsFromArray, OddsArray, OddsOptions } from "common";

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import RGL, { WidthProvider } from "react-grid-layout";
const ReactGridLayout = WidthProvider(RGL);

type OddsSetterProps = {
    mid: string
}

export default function OddsSetter(props: OddsSetterProps) {
    const [locked, setLock] = useState(OddsOptions.U)
    const [odds, setOdds] = useState<OddsArray>([3, 3, 3]);

    function oddsChanged(option: OddsOptions, value: number | null) {
        if (option !== locked && value) {
            const optionToChange: OddsOptions = 3 - option - locked;

            const v1 = Math.round(value * 20) / 20;
            const v2 = odds[locked];
            const a = (1 / v1) + (1 / v2);
            if (a >= 1) {
                setOdds(odds);
                return;
            }
            const newValue: number = 1 / (1 - a);
            const roundNewValue = Math.round(newValue * 20) / 20
            const newOdds: OddsArray = [0, 0, 0];
            newOdds[option] = v1;
            newOdds[locked] = v2;
            newOdds[optionToChange] = roundNewValue;
            setOdds(newOdds);
        }
        else {
            setOdds(odds);
        }
    }

    async function submit() {
        const ref = doc(getFirestore(), "matches", props.mid, "odds", "odds") as DocumentReference<Odds>
        await updateDoc(ref, OddsFromArray(odds));
    }

    const layout = [
        { i: 'h', x: 0, y: 0, w: 1, h: 1, static: true },
        { i: 'u', x: 1, y: 0, w: 1, h: 1, static: true },
        { i: 'b', x: 2, y: 0, w: 1, h: 1, static: true },
        { i: 'o0', x: 0, y: 1, w: 1, h: 1, static: true },
        { i: 'o1', x: 1, y: 1, w: 1, h: 1, static: true },
        { i: 'o2', x: 2, y: 1, w: 1, h: 1, static: true },
        { i: 'l0', x: 0, y: 2, w: 1, h: 1, static: true },
        { i: 'l1', x: 1, y: 2, w: 1, h: 1, static: true },
        { i: 'l2', x: 2, y: 2, w: 1, h: 1, static: true },
        { i: 'submit', x: 0, y: 3, w: 3, h: 1, static: true },
    ];

    return (
        <div className="OddsSetter">
            <ReactGridLayout layout={layout} cols={3} rowHeight={32}>
                <div key="h"> H </div>
                <div key="u"> U </div>
                <div key="b"> B </div>
                <div key="o0">
                    <NumericInput min={1} value={odds[OddsOptions.H]} step={0.05} onChange={v => oddsChanged(OddsOptions.H, v)} />
                </div>
                <div key="o1">
                    <NumericInput min={1} value={odds[OddsOptions.U]} step={0.05} onChange={v => oddsChanged(OddsOptions.U, v)} />
                </div>
                <div key="o2">
                    <NumericInput min={1} value={odds[OddsOptions.B]} step={0.05} onChange={v => oddsChanged(OddsOptions.B, v)} />
                </div>
                <div key="l0">
                    <input type="checkbox" checked={locked === OddsOptions.H} onChange={() => setLock(OddsOptions.H)} />
                </div>
                <div key="l1">
                    <input type="checkbox" checked={locked === OddsOptions.U} onChange={() => setLock(OddsOptions.U)} />
                </div>
                <div key="l2">
                    <input type="checkbox" checked={locked === OddsOptions.B} onChange={() => setLock(OddsOptions.B)} />
                </div>
                <div key="submit">
                    <button onClick={submit}>
                        Bekreft
                    </button>
                </div>
            </ReactGridLayout>
        </div>
    );

}