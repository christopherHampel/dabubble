import { Timestamp } from 'firebase/firestore';

export interface AccociatedThreadId {
    count:number,
    lastMessage: Timestamp,
    threadId:string
}

export interface MessageAuthor {
    avatar: string,
    id: string,
    name: string
}

export interface CurrentMessage {
    accociatedThreadId:[AccociatedThreadId]
    name:string,
    uid:string,
    avatar:string,
    createdAt:Timestamp,
    text:string,
    docId:string,
    emojis: [{emoji:string, count:number}],
    chatId:string,
    component:string,
    chatPartner: string,
    mentionedUsers: [{name:string, uid:string}],
    messageAuthor: MessageAuthor,
    firstMessageOfTheDay: boolean,
    originalChatInfo: string,
}
