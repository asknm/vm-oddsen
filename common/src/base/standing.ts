export type Standing = {
    home: number,
    away: number;
}

export interface StandingWithFinished extends Standing {
    finished: boolean,
}
