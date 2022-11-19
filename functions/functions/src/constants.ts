import { IFirebaseMatch } from "../../../common/firebase/match";
import { IFirebaseMatchDictionary } from "../../../common/firebase/matchDictionary";
import { Timestamp } from "firebase-admin/firestore";

export type FirebaseMatch = IFirebaseMatch<Timestamp>;
export type FirebaseMatchDictionary = IFirebaseMatchDictionary<Timestamp>;

export const myRegion = "europe-central2";
