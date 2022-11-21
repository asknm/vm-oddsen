import { IBaseBet } from "common";
import { Timestamp } from "firebase-admin/firestore";

export type Bet = IBaseBet<Timestamp>;
