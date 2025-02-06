import { Timestamp } from 'firebase/firestore';

export interface CurrentMessage {
    accociatedThreadId:string
    name:string,
    uid:string,
    avatar:string,
    createdAt:Timestamp,
    text:string,
    docId:string,
    emojis: [{emoji:string, count:number}];
}
