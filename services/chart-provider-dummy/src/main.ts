const { makeWorker } = require('amqp-delegate')

const task = (a: number, b: number) => new Promise(resolve => setTimeout(() => resolve(a + b), 10))

const worker = makeWorker({
  name: 'adder',
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