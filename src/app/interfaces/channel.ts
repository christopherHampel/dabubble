export interface Channel {
    id: string,
    name: string,
    description: string,
    createdBy: {
        id: string,
        userName: string,
        avatar: string,
        active: boolean
    },
    participants: {
        id: string,
        userName:string,
        avatar:string,
        active: boolean
    }[]
}
