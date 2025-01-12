export interface userDetails {
    name: string,
    avatar: string
}

export interface Thread {
    participiants: string[],
    chatId: string,
    participiantsDetails: {
        [key: string]: userDetails;
    }
}
