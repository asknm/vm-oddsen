import { BaseMatch } from "../base/match"
import { Score } from "../base/score"

export interface IApiMatch extends BaseMatch<string> {
    id: number,
    status: string,
    score: Score,
}