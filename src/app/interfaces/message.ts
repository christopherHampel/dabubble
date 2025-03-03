export interface autor {
    name: string,
    id: string
    avatar: string
}

export interface Message {
    docId: string,
    associatedThreadId: string,
    messageAuthor: autor,
    text: string,
    createdAt: any,
    firstMessageOfTheDay: boolean,
    emojis: [],
    component:string,
    chatId:string
}
