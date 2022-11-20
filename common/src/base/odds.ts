export interface Odds {
    H: number,
    U: number,
    B: number,
};

export interface OddsWithBookmakerRef<RefType> extends Odds {
    bookmaker: RefType,
};

export type OddsArray = [
    H: number,
    U: number,
    B: number,
];

export enum OddsOptions {
    H,
    U,
    B,
};

export function OddsFromArray(array: OddsArray): Odds {
    return {
        H: array[OddsOptions.H],
        U: array[OddsOptions.U],
        B: array[OddsOptions.B],
    };
};

export function ToOddsArray(odds: Odds): OddsArray {
    return [odds.H, odds.U, odds.B];
}
