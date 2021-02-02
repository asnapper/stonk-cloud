import TelegramBot from "node-telegram-bot-api"
import { IncomingMessage } from "./interfaces"

export const mapTelegramMessage = (message: TelegramBot.Message, metadata: TelegramBot.Metadata): IncomingMessage | null => {
    const mappedMessage: Partial<IncomingMessage> = {
        id: message.message_id,
        from: {
            id: message.from?.id || 0,
            name: message.from?.first_name || message.from?.username || message.from?.username
        },
        chat: {
            id: message.chat.id || 0,
            name: message.chat.title
        }
    }

    switch (metadata.type) {
        case 'text':
            mappedMessage.type = metadata.type
            mappedMessage.payload = message.text
            return mappedMessage as IncomingMessage
    }

    return null
}