import { BaseMatchWithId } from "../base/match"

export type DtoMatch = BaseMatchWithId<string, number>;

export function HasStarted(match: DtoMatch): boolean {
    return Date.now() > match.utcDate;
}
