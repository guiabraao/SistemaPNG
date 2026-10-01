import { randomBytes, scryptSync } from 'node:crypto'
import { stdin, stdout } from 'node:process'
if(!stdin.isTTY) throw new Error('Execute em um terminal interativo.')
stdout.write('Senha administrativa: ')
stdin.setRawMode(true)
let password=''
stdin.setEncoding('utf8')
stdin.on('data',chunk=>{
  if(chunk==='\u0003') process.exit(1)
  if(chunk==='\r'||chunk==='\n') {
    stdin.setRawMode(false);stdin.pause();stdout.write('\n')
    const salt=randomBytes(16).toString('hex')
    stdout.write(`${salt}:${scryptSync(password,salt,64).toString('hex')}\n`)
    return
  }
  if(chunk==='\u007f') password=password.slice(0,-1)
  else password+=chunk
})
