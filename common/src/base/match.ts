import { Team } from "./team"

export interface BaseMatch<DateType> {
    utcDate: DateType,
    homeTeam: Team,
    awayTeam: Team,
}

export interface BaseMatchWithId<IdType, DateType> extends BaseMatch<DateType> {
    id: IdType
}