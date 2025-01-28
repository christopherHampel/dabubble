export interface ChatData {
    chatId:string,
    participants: [],
    belongsToMessage?:string,
    participantsDetails: [{
        name:string,
        avatar:string
    }]
}
