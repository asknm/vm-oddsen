import { Timestamp } from "firebase-admin/firestore";
import { BaseMatch } from "common";

export type FirebaseMatch = BaseMatch<Timestamp>;
