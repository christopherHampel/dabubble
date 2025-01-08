import { Timestamp } from 'firebase/firestore';

export interface CurrentMessage {
    name:string,
    uid:string,
    avatar:string,
    createdAt:Timestamp,
    text:string,
    docId:string,
    emojis: [{emoji:string, count:number}];
}
