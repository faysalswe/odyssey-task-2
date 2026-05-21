export function requireEnv(name) {
  const value = process.env[name]
  if (!value) {
    console.error(`[config] Required environment variable "${name}" is not set. Exiting.`)
    process.exit(1)
  }
  return value
}
