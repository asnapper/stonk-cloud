import TelegramBot from 'node-telegram-bot-api'
import { getRabbitListener, getRabbitSender } from './rabbit'
import { mapTelegramMessage } from './mappers'
import { OutgoingMessage } from '../../common/ts/interfaces/telegram-messages'

const { TELEGRAM_BOT_TOKEN, RABBIT_QUEUE_IN, RABBIT_QUEUE_OUT, RABBIT_URL } = process.env

console.info({ TELEGRAM_BOT_TOKEN, RABBIT_QUEUE_IN, RABBIT_QUEUE_OUT, RABBIT_URL })

async function main() {

    const bot = new TelegramBot(TELEGRAM_BOT_TOKEN as string)

    const send = await getRabbitSender(RABBIT_QUEUE_IN as string, RABBIT_URL as string)
    const listener = await getRabbitListener(RABBIT_QUEUE_OUT as string, RABBIT_URL as string)

    listener.on('message', (msg: OutgoingMessage) => {
        switch (msg.type) {
            case 'text':
                bot.sendMessage(msg.to.id, msg.payload as string)
                break;
        }
    })

    bot.startPolling()

    bot.on('message', (message, metadata) => {
        if (!message.from?.is_bot) {
            console.debug({ message, metadata, token: TELEGRAM_BOT_TOKEN })
            send(mapTelegramMessage(message, metadata))
        }
    })

}

main()

