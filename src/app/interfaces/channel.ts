export interface Channel {
    id: string,
    createdBy: string,
    name: string,
    description: string,
    participants: string[],
    participantsDetails: {
        name:string,
        avatar:string
    }[]
}
