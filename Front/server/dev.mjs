import { spawn } from 'node:child_process'

const adminPort = String(process.env.PNG_ADMIN_PORT || 3030)
const environment = { ...process.env, NODE_ENV: 'development', PORT: adminPort }
const processes = []
let stopping = false

function stop() {
  if (stopping) return
  stopping = true
  processes.forEach(child => { if (!child.killed) child.kill() })
}

process.on('SIGINT', stop)
process.on('SIGTERM', stop)

const api = spawn(process.execPath, ['server/index.mjs'], { stdio: ['inherit', 'pipe', 'inherit'], env: environment })
processes.push(api)

try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('A API administrativa demorou para iniciar.')), 10000)
    api.stdout.on('data', chunk => {
      const message = chunk.toString()
      process.stdout.write(message)
      if (message.includes('PNG admin API:')) { clearTimeout(timeout); resolve() }
    })
    api.once('exit', code => {
      clearTimeout(timeout)
      reject(new Error(`A API administrativa encerrou com código ${code}.`))
    })
  })
  const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1'], { stdio: 'inherit', env: environment })
  processes.push(vite)
  vite.once('exit', code => { stop(); process.exitCode = code || 0 })
  api.once('exit', code => {
    if (!stopping) {
      console.error(`A API administrativa parou (código ${code}). Encerrando o site local.`)
      stop()
      process.exitCode = 1
    }
  })
} catch (error) {
  console.error(error.message)
  stop()
  process.exitCode = 1
}
