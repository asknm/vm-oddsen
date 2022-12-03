import { Team } from "common";

export function fromApiTeam(apiTeam: Team): Team {
    return {
        name: apiTeam.name,
        crest: apiTeam.crest,
    };
}
