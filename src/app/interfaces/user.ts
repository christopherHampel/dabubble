export interface User {
    id: string | undefined,
    userName: string,
    email: string,
    avatar: string,
    active: boolean
    direktMessages: string[],
    channels: string[]
}
