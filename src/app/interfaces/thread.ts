export interface userDetails {
    avatar: string
    name: string,
}

export interface Thread {
    docId: string,
    participiants: string[],
    belongsToMessage: string,
    participiantsDetails: {
        [key: string]: userDetails;
    }
}
