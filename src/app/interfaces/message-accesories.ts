import { ChatPartner } from "./incoming-message";

export interface MessageAccesories {
    chatId: string,
    chatPartner: ChatPartner,
    component:string,
    mentionedUsers: [],
    message: string
}
