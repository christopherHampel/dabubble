export interface Channel {
    id: string,
    name: string,
    description: string,
    participants: {
        id: string,
        createdBy:boolean,
    }[],
    participantIds: string[]
}
