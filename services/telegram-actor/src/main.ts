import { getRabbitListener, getRabbitSender } from './rabbit'
import { IncomingMessage, OutgoingMessage } from '../../common/ts/interfaces/telegram-messages'

const { RABBIT_QUEUE_IN, RABBIT_QUEUE_OUT, RABBIT_URL } = process.env

console.info({ RABBIT_QUEUE_IN, RABBIT_QUEUE_OUT, RABBIT_URL })

async function main() {

    const send = await getRabbitSender(RABBIT_QUEUE_OUT as string, RABBIT_URL as string)
    const listener = await getRabbitListener(RABBIT_QUEUE_IN as string, RABBIT_URL as string)

    listener.on('message', (msg: IncomingMessage) => {
        switch (msg.type) {
            case 'text':
                // TODO: implement buisness logic here
                console.debug({msg})
                const reply: OutgoingMessage = {
                    to: msg.from,
                    type: 'text',
                    payload: 'hola',
                    chat: msg.chat
                }
                console.debug({reply})
                send(reply)
                break;
        }
    })


}

main()

