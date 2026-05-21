import { Router } from 'express'
import { getWorker } from '../mediasoup.js'

const router = Router()

router.get('/health', (_req, res) => {
  const worker = getWorker()
  const workerReady = worker !== null && !worker.closed
  // Always 200 so the Docker healthcheck passes once Express is up.
  // Body signals whether the mediasoup worker is live.
  res.status(200).json({
    status: 'ok',
    mediasoup: workerReady ? 'running' : 'initializing',
  })
})

export default router
