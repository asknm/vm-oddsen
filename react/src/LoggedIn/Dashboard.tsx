import createTheme from "@mui/material/styles/createTheme";
import responsiveFontSizes from "@mui/material/styles/responsiveFontSizes";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import Typography from "@mui/material/Typography/Typography";

import { getFunctions, httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { DtoMatchDictionary } from "common";
import Match from "./Components/Match";

export default function Dashboard() {
    const [matchDict, setMatchDict] = useState({} as DtoMatchDictionary)

    useEffect(() => {

        async function getMatches() {
            const getMatches = httpsCallable<null, DtoMatchDictionary>(getFunctions(undefined, "europe-central2"), 'getMatches');
            const res = await getMatches.call(null);
            setMatchDict(res.data);
        }

        if (!Object.keys(matchDict).length) {
            getMatches()
        }
    })

    let theme = createTheme();
    theme = responsiveFontSizes(theme);

    return <div>
        {
            Object.entries(matchDict).map(([key, matches]) =>
                <ThemeProvider theme={theme} key={key}>
                    <div style={{ border: "1px solid black" }}>
                        <Typography variant="h5"> {key} </Typography>
                        {matches.map((value, index) => {
                            return <div className={"row"} key={index}>
                                <Match match={value} />
                            </div>
                        })}
                    </div>
                    <p></p>
                </ThemeProvider>
            )
        }
    </div>
}