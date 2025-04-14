import { FieldValue, Timestamp } from 'firebase/firestore';

export interface IncomingMessage {
    associatedThreadId: AssociatedThreadId,
    chatId: string,
    chatPartner: ChatPartner,
    component: string,
    createdAt: Timestamp | FieldValue,
    docId: string,
    emojis: [],
    firstMessageOfTheDay: boolean,
    mentionedUsers: [],
    messageAuthor: MessageAuthor,
    text: string
}

export interface AssociatedThreadId {
    threadId: string,
    count: number,
    lastMessage: string
}

export interface ChatPartner {
    chatPartner: string,
    currentUser: string
}

export interface MessageAuthor {
    avatar: string,
    id: string,
    name: string
}