import { OddsOptions } from "./odds"

export type IBaseBet<TTimestamp> = {
    amount: number,
    selection: OddsOptions,
    timestamp: TTimestamp,
}

export interface IBetWithBetter<TTimestamp> extends IBaseBet<TTimestamp> {
    better: string,
}
