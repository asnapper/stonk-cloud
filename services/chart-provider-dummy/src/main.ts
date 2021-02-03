const { makeWorker } = require('amqp-delegate')

const task = (...a: Array<number>) => new Promise(resolve => setTimeout(() => resolve(a.reduce((acc, val) => acc + val, 0)), 10))

const worker = makeWorker({
  name: 'summer',
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