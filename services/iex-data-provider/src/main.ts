import { intradayPrices } from 'iex-cloud'
const { makeWorker } = require('amqp-delegate')

const task = (symbol: string) => intradayPrices(symbol)

const worker = makeWorker({
  name: 'intraday',
  task,
  url: process.env.RABBIT_URL
})

worker
  .start()
  .then(() => {
    process.on('SIGINT', () => {
      worker.stop().then(() => {
        process.exit(0)
      })
    })
  })
  .catch((err: any) => {
    console.error('caught', err)
  })