import { BaseMatchWithId } from "../base/match"
import { Score } from "../base/score"

export interface ApiMatch extends BaseMatchWithId<number, string> {
    status: string,
    score: Score,
}