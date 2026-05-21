import mediasoup from 'mediasoup'

function requireEnv(name) {
  const value = process.env[name]
  if (!value) {
    console.error(`[config] Required environment variable "${name}" is not set. Exiting.`)
    process.exit(1)
  }
  return value
}

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
