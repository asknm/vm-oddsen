type BaseUser = {
    name: string,
}

export interface IUser<TTimestamp> extends BaseUser {
    timestamp: TTimestamp,
};

export interface UserWithBalance extends BaseUser {
    balance: number,
}

export interface UserWithId extends BaseUser {
    id: string,
}
