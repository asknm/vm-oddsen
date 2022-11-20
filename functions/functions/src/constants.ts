import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { BaseMatch, IUser } from "common";

export type FirebaseMatch = BaseMatch<Timestamp>;

export const myRegion = "europe-central2";

export type User = IUser<FieldValue>;
