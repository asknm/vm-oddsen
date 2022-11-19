export type Team = {
    name: string,
    crest: string,
}

export function fromApiTeam(apiTeam: Team): Team {
    return {
        name: apiTeam.name,
        crest: apiTeam.crest,
    }
}