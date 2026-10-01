import logoUrl from '../../assets/logoPNG.png'

const colors = { dark: '#0c2923', green: '#194b39', lime: '#d2ef85', white: '#f7f9f3', muted: '#b7c7bc' }
const formatDate = date => { const [y,m,d] = date.split('-'); return `${d}/${m}/${y}` }

function rounded(ctx,x,y,w,h,r) {
  ctx.beginPath(); ctx.roundRect(x,y,w,h,r)
}
function fitText(ctx,text,maxWidth,size,min=24) {
  let font=size
  do { ctx.font=`700 ${font}px Manrope, Arial, sans-serif`; if(ctx.measureText(text).width<=maxWidth) break; font-=2 } while(font>min)
  return font
}
function loadLogo() {
  return new Promise(resolve => {
    const image=new Image()
    image.onload=()=>resolve(image)
    image.onerror=()=>resolve(null)
    image.src=logoUrl
  })
}
export async function createPoster(match, draw) {
  const teams=draw.teams
  const columns=teams.length>4?2:teams.length>2?2:1
  const rows=Math.ceil(teams.length/columns)
  const longest=Math.max(...teams.map(team=>team.players.length),0)
  const cardHeight=Math.max(280,126+longest*48)
  const height=Math.max(1350,430+rows*(cardHeight+24)+(draw.reserves.length?130:0)+115)
  const canvas=document.createElement('canvas')
  canvas.width=1080;canvas.height=height
  const ctx=canvas.getContext('2d')
  const gradient=ctx.createLinearGradient(0,0,1080,height)
  gradient.addColorStop(0,colors.dark);gradient.addColorStop(1,'#061b17')
  ctx.fillStyle=gradient;ctx.fillRect(0,0,1080,height)
  ctx.fillStyle='rgba(210,239,133,.075)'
  for(let i=0;i<15;i++){ctx.beginPath();ctx.arc(1060,120+i*90,250+i*15,0,Math.PI*2);ctx.strokeStyle='rgba(210,239,133,.045)';ctx.lineWidth=2;ctx.stroke()}
  const logo=await loadLogo()
  if(logo) { ctx.drawImage(logo,72,66,90,90) }
  ctx.fillStyle=colors.lime;ctx.font='800 25px Manrope, Arial, sans-serif';ctx.fillText('PELADA NOVA GERAÇÃO',logo?184:72,104)
  ctx.fillStyle=colors.muted;ctx.font='700 21px Manrope, Arial, sans-serif';ctx.fillText('ESCALAÇÃO OFICIAL',logo?184:72,139)
  ctx.fillStyle=colors.white;fitText(ctx,match.name,930,78,44);ctx.fillText(match.name,72,250)
  ctx.fillStyle=colors.lime;ctx.font='800 32px Manrope, Arial, sans-serif';ctx.fillText(`${formatDate(match.date)}${match.time?`  •  ${match.time}`:''}`,74,312)
  ctx.fillStyle=colors.muted;ctx.font='600 22px Manrope, Arial, sans-serif';ctx.fillText(`${teams.length} TIMES  •  ${teams.reduce((sum,team)=>sum+team.players.length,0)} JOGADORES`,74,353)
  const gap=24, left=72, usable=936, cardWidth=(usable-gap*(columns-1))/columns
  teams.forEach((team,index)=>{
    const x=left+(index%columns)*(cardWidth+gap),y=405+Math.floor(index/columns)*(cardHeight+gap)
    ctx.fillStyle='#173e31';rounded(ctx,x,y,cardWidth,cardHeight,24);ctx.fill()
    ctx.fillStyle=[colors.lime,'#a7dce0','#f4c58e','#dcbdf5'][index%4];rounded(ctx,x,y,10,cardHeight,5);ctx.fill()
    ctx.fillStyle=colors.white;ctx.font='800 38px Manrope, Arial, sans-serif';ctx.fillText(`TIME ${String(index+1).padStart(2,'0')}`,x+34,y+64)
    ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(x+34,y+82,cardWidth-68,1)
    team.players.forEach((player,playerIndex)=>{
      const label=player.apelido||player.nome
      ctx.fillStyle=colors.white;fitText(ctx,label,cardWidth-75,29,21);ctx.fillText(label,x+34,y+128+playerIndex*48)
    })
  })
  let bottom=405+rows*(cardHeight+gap)
  if(draw.reserves.length){
    ctx.fillStyle=colors.lime;ctx.font='800 23px Manrope, Arial, sans-serif';ctx.fillText('RESERVAS',72,bottom+35)
    ctx.fillStyle=colors.white;fitText(ctx,draw.reserves.map(p=>p.apelido||p.nome).join('  •  '),936,25,18);ctx.fillText(draw.reserves.map(p=>p.apelido||p.nome).join('  •  '),72,bottom+75)
    bottom+=130
  }
  ctx.fillStyle=colors.muted;ctx.font='700 19px Manrope, Arial, sans-serif';ctx.fillText('FUTEBOL. RESENHA. PNG.',72,height-65)
  ctx.fillStyle=colors.lime;ctx.fillRect(72,height-43,936,3)
  return await new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Falha ao gerar imagem.')),'image/png'))
}
export function posterFilename(match) { return `pelada-${match.date.split('-').reverse().join('-')}-times.png` }
export function downloadPoster(blob,filename) {
  const url=URL.createObjectURL(blob),anchor=document.createElement('a')
  anchor.href=url;anchor.download=filename;document.body.append(anchor);anchor.click();anchor.remove()
  setTimeout(()=>URL.revokeObjectURL(url),60_000)
}
