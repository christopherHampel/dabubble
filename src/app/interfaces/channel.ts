export interface Channel {
    id: string,
    name: string,
    description: string,
    participants: string[],
    participantsDetails: {
        name:string,
        avatar:string
    }[]
}
