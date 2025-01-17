export interface userDetails {
    avatar: string
    name: string,
}

export interface Thread {
    participiants: string[],
    belongsToMessage: string,
    participiantsDetails: {
        [key: string]: userDetails;
    }
}
