import axios from 'axios';
import { ApiMatch } from 'common';

export async function getMatchFromApi(mid: string, apiKey: string): Promise<ApiMatch> {
    const response = await axios.get(`https://api.football-data.org/v4/matches/${mid}`, {
        headers: {
            "X-Auth-Token": apiKey,
        },
    });
    return response.data;
}

export async function getMatchesFromApiFromDate(apiKey: string, date: Date): Promise<ApiMatch[]> {
    const dateString = date.toISOString().split('T')[0];
    return await getMatchesInner(apiKey, `https://api.football-data.org/v4/competitions/2000/matches?dateFrom${dateString}`);
}

export async function getMatchesFromApi(apiKey: string): Promise<ApiMatch[]> {
    return await getMatchesInner(apiKey, 'https://api.football-data.org/v4/competitions/2000/matches');
}

async function getMatchesInner(apiKey: string, url: string): Promise<ApiMatch[]> {
    const response = await axios.get(url, {
        headers: {
            "X-Auth-Token": apiKey,
        },
    });
    const data = response.data;
    return data.matches;
}
