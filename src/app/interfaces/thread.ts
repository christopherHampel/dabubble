export interface userDetails {
    name: string,
    avatar: string
}

export interface Thread {
    participiants: string[],
    belongsToMessage: string,
    participiantsDetails: {
        [key: string]: userDetails;
    }
}
