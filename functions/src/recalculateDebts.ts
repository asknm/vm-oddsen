import { ApiMatch } from "common";
import { Firestore, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { userCollection } from "./extensions/userExtensions";
import { getMatchesFromApi } from "./helpers/apiHelpers";
import { settleDebts } from "./helpers/debtSettling";
import { Response } from "firebase-functions/v1";

export async function recalculateDebtsHandler(db: Firestore, apiKey: string, res: Response) {
    try {
        const users = await userCollection(db).get();
        Promise.all(users.docs.map(async doc => await resetBalance(doc)));

        const apiMatches = await getMatchesFromApi(apiKey);

        await Promise.all(apiMatches.map(async apiMatch => await settleDebtsIfFinished(apiMatch, db, apiKey)));

        res.status(200).end();
    }
    catch (error) {
        res.status(500).send(error);
    }
}

async function settleDebtsIfFinished(apiMatch: ApiMatch, db: Firestore, apiKey: string) {
    if (apiMatch.status !== "FINISHED") {
        return;
    }
    await settleDebts(db, apiMatch.id.toString(), apiMatch);
}

async function resetBalance(doc: QueryDocumentSnapshot) {
    await doc.ref.update({
        balance: 0,
    });
}
