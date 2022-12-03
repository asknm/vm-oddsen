import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { BaseMatch, IUser } from "common";
import { getFunctions, TaskQueue } from "firebase-admin/functions";

export type FirebaseMatch = BaseMatch<Timestamp>;

export const myRegion = "europe-central2";

export type InsertUser = IUser<FieldValue>;

export function getQueue(): TaskQueue {
    return getFunctions().taskQueue(`locations/${myRegion}/functions/checkScore`);
}
