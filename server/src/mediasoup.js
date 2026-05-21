import mediasoup from 'mediasoup'
import { requireEnv } from './env.js'

/** @type {import('mediasoup').types.Worker | null} */
let worker = null

export async function createWorker() {
  const rtcMinPort = Number(requireEnv('MEDIASOUP_MIN_PORT'))
  const rtcMaxPort = Number(requireEnv('MEDIASOUP_MAX_PORT'))

  worker = await mediasoup.createWorker({
    logLevel: 'warn',
    rtcMinPort,
    rtcMaxPort,
  })

  worker.on('died', () => {
    console.error('mediasoup worker died, restarting process')
    process.exit(1)
  })

  console.log(`mediasoup worker pid ${worker.pid} created (RTC ports ${rtcMinPort}–${rtcMaxPort})`)
  return worker
}

export function getWorker() {
  return worker
}
