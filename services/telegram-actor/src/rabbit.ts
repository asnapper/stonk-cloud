import { connect } from 'amqplib'
import { EventEmitter } from 'node-telegram-bot-api'

export const getRabbitSender = async (queue: string, url: string) => {
    const connection = await connect(url)
    const channel = await connection.createChannel()

    return async (payload: any) => {
        await channel.assertQueue(queue)
        return await channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)))
    }
}

export const getRabbitListener = async (queue: string, url: string) => {

    const connection = await connect(url)
    const channel = await connection.createChannel()
    const emitter = new EventEmitter()

    channel.assertQueue(queue)

    channel.consume(queue, (msg) => {
        try {
            const decoded = JSON.parse(msg?.content.toString('utf-8') || '')
            console.debug({ decoded })
            if (decoded) {
                emitter.emit('message', decoded)
            }
        } catch (e) {
            console.error('failed to decode incoming message', e, msg)
        }
    }, {
        noAck: true
    })

    return emitter

}
