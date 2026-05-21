import express from 'express'
import { createWorker } from './mediasoup.js'
import healthRouter from './routes/health.js'
import { requireEnv } from './env.js'

const PORT = Number(requireEnv('SERVER_PORT'))

async function main() {
  await createWorker()

  const app = express()
  app.use(express.json())
  app.use(healthRouter)

  app.listen(PORT, () => {
    console.log(`mediasoup server listening on port ${PORT}`)
  })
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
