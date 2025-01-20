export interface autor {
    name: string,
    id: string
}

export interface Message {
    docId: string,
    messageAuthor: autor,
    text: string,
    createdAt: any,
    emojis: []
}
