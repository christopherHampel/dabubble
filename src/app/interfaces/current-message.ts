import { Timestamp } from 'firebase/firestore';

export interface CurrentMessage {
    uid:string,
    avatar:string,
    createdAt:Timestamp,
    text:string,
    emoji: [];
}
