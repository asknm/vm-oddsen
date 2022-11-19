import { IFirebaseMatch } from "./match"

export type IFirebaseMatchDictionary<TTimeStamp> = { [field: string]: IFirebaseMatch<TTimeStamp>[] };
