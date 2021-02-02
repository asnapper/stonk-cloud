import { getRabbitListener, getRabbitSender } from './rabbit'
import { IncomingMessage, OutgoingMessage } from '../../common/ts/interfaces/telegram-messages'

const { RABBIT_QUEUE_IN, RABBIT_QUEUE_OUT, RABBIT_URL } = process.env

console.info({ RABBIT_QUEUE_IN, RABBIT_QUEUE_OUT, RABBIT_URL })

const { makeDelegator } = require('amqp-delegate')




async function main() {

    const send = await getRabbitSender(RABBIT_QUEUE_OUT as string, RABBIT_URL as string)
    const listener = await getRabbitListener(RABBIT_QUEUE_IN as string, RABBIT_URL as string)

    const delegator = makeDelegator({
        url: RABBIT_URL
    })
    await delegator.start()

    listener.on('message', async (msg: IncomingMessage) => {
        switch (msg.type) {
            case 'text':
                // TODO: implement buisness logic here
                console.debug({msg})
                const reply: OutgoingMessage = {
                    to: msg.from,
                    type: 'text',
                    payload: 'result =',
                    chat: msg.chat
                }

                if (typeof msg.payload == 'string') {
                    const numbers = msg.payload?.match(/(\d+)/g) || []
                    console.debug({numbers})
                    const result = await delegator.invoke('adder', ...numbers.map(n => parseInt(n, 10)))
                    reply.payload += ` ${result}`
                    send(reply)
                }
                break;
        }
    })


}

main()

