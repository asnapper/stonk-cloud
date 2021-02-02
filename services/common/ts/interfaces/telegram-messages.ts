interface UserOrChatIdentifier {
    id: number
    name?: string
}

export interface IncomingMessage {
    id: number
    from: UserOrChatIdentifier
    chat: UserOrChatIdentifier
    type: 'text' | 'whatever'
    payload: string | Object | undefined
}

export interface OutgoingMessage {
    to: UserOrChatIdentifier
    chat: UserOrChatIdentifier
    type: 'text' | 'image'
    payload: string | Object
}