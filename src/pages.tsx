import {useEffect,useState,ReactNode} from 'react'
import {Link} from 'react-router-dom'
import {CloudSun,Wheat,BarChart3,Leaf,Camera,Upload,Sun,Info} from 'lucide-react'
import {useT,LOCALE} from './translations'
import {FEATS,PageShell,LocationPicker,useLoc,Skeleton,Disclaimer,Hills} from './components'
import {getWeather,W} from './lib/api'
import {season,recommendCrop,soilScore,rainFactor} from './lib/recommendCrop'
import {crops} from './data/crops'
import {soilByState,Soil} from './data/soilByRegion'
function useWeather(){const{loc}=useLoc(),[w,setW]=useState<W|null>(null),[err,setErr]=useState(''),[ld,setLd]=useState(false)
 useEffect(()=>{if(!loc)return;setLd(true);setErr('');setW(null);getWeather(loc).then(setW).catch(()=>setErr('Could not load weather. Check your internet and try again.')).finally(()=>setLd(false))},[loc]);return{loc,w,err,ld}}
const St=({ld,err,children}:{ld:boolean;err:string;children:ReactNode})=>ld?<Skeleton/>:err?<div className="card text-red-700">{err}</div>:<>{children}</>
export function Home(){const{t,lang}=useT(),[now]=useState(new Date()),h=now.getHours()
 return<><section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky via-[#FFE9B8] to-cream flex flex-col items-center justify-center text-center px-4">
 <Sun className="absolute top-16 right-10 text-wheat animate-spin" size={80} style={{animationDuration:'60s'}}/><div className="drift absolute top-24 text-5xl opacity-70">☁️</div><div className="drift absolute top-44 text-4xl opacity-50" style={{animationDelay:'-15s'}}>☁️</div>
 <Hills/><div className="relative z-10 space-y-4"><p className="font-semibold">{new Intl.DateTimeFormat(LOCALE[lang],{dateStyle:'full'}).format(now)}</p>
 <span className="inline-block bg-leaf text-white rounded-full px-4 py-1">{season(now)}</span><p className="text-xl">{h<12?t.morning:h<17?t.afternoon:t.evening} 🌱</p>
 <h1 className="text-4xl md:text-6xl font-bold text-leaf max-w-2xl">{t.head}</h1>
 <button className="btn bob" onClick={()=>document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}>{t.explore}</button></div></section>
 <section id="features" className="bg-gradient-to-b from-cream to-sky p-6"><div className="max-w-4xl mx-auto grid grid-cols-1 min-[480px]:grid-cols-2 gap-4">
 {FEATS.map(f=><Link key={f.to} to={f.to} className={`card ${f.c} space-y-2 hover:scale-[1.02] transition`}><f.I size={40}/><h3 className="text-xl font-bold">{(t as any)[f.k]}</h3><p className="text-sm">{(t as any)[f.d]}</p><span className="btn">{t.open}</span></Link>)}</div></section></>}
export const About=()=>{const{t}=useT();return<PageShell title={t.about} subtitle={t.tag} icon={Info}>
 <div className="card"><p>CropSense was built to give every farmer simple, clear answers from free weather and soil knowledge, in their own language.</p></div>
 <div className="grid sm:grid-cols-3 gap-3">{[t.s1,t.s2,t.s3].map((s,i)=><div key={i} className="card text-center"><div className="text-3xl font-head text-leaf">{i+1}</div>{s}</div>)}</div><Disclaimer/></PageShell>}
const Chip=({c,children}:{c:'g'|'a'|'r';children:ReactNode})=><span className={`rounded-full px-3 py-1 text-sm font-semibold ${c=='g'?'bg-green-200 text-green-900':c=='a'?'bg-amber-200 text-amber-900':'bg-red-200 text-red-900'}`}>{children}</span>
export function Weather(){const{t,lang}=useT(),{loc,w,err,ld}=useWeather()
 const adv=w?(()=>{const d=w.days,p=d[0].p,wind=w.now.wind_speed_10m,rain2=d[0].mm+d[1].mm
  return[[t.irr,rain2>5?'r':'g',rain2>5?`${rain2.toFixed(0)} mm rain expected in 2 days: skip irrigation`:'Little rain expected: irrigate if soil is dry'],
  [t.spr,p>50||wind>20?'r':'g',p>50?`Rain chance ${p}%: avoid spraying`:wind>20?`Wind ${wind} km/h: avoid spraying`:'Calm and dry: good time to spray'],
  [t.sow,p>70?'a':'g',p>70?'Heavy rain likely: wait to sow':'Conditions fine for sowing'],
  [t.har,d[0].p>40||d[1].p>40?'a':'g',d[0].p>40||d[1].p>40?'Rain may come: harvest early or cover':'Dry days ahead: good for harvest']] as [string,'g'|'a'|'r',string][]})():[]
 return<PageShell title={t.weather} subtitle={t.wd} icon={CloudSun}><LocationPicker/>{!loc&&<p className="text-center">Pick a location above.</p>}<St ld={ld} err={err}>{w&&<>
 <div className="card text-center"><div className="text-6xl font-head font-bold">{Math.round(w.now.temperature_2m)}°C</div><p>💧 {w.now.relative_humidity_2m}% &nbsp; 💨 {w.now.wind_speed_10m} km/h</p></div>
 <div className="flex gap-2 overflow-x-auto">{w.days.map(d=><div key={d.t} className="card !p-3 min-w-[110px] text-center text-sm"><b>{new Intl.DateTimeFormat(LOCALE[lang],{weekday:'short'}).format(new Date(d.t))}</b><div>{Math.round(d.max)}° / {Math.round(d.min)}°</div><div>🌧 {d.p}%</div><div>{d.mm.toFixed(1)} mm</div></div>)}</div>
 {adv.map(([n,c,r])=><div key={n} className="card flex items-center gap-3"><Chip c={c}>{c=='g'?'Good':c=='a'?'Careful':'Avoid'}</Chip><div><b>{n}</b><p className="text-sm">{r}</p></div></div>)}</>}</St></PageShell>}
const SOILS:Soil[]=['Black','Red','Sandy','Alluvial']
function useSoil(){const{loc}=useLoc(),[o,setO]=useState<Soil|null>(null),[ch,setCh]=useState(false);const auto=(loc&&soilByState[loc.state])||'Alluvial';return{soil:o||auto,setO:(s:Soil)=>{setO(s);setCh(false)},ch,setCh}}
const SoilBox=({s}:{s:ReturnType<typeof useSoil>})=><div className="card"><p>Your region's soil: <b>{s.soil}</b> <button className="underline text-leaf" onClick={()=>s.setCh(!s.ch)}>Not correct? Change</button></p>
 {s.ch&&<div className="grid grid-cols-4 gap-2 mt-2">{SOILS.map(x=><button key={x} className="min-h-[48px] rounded-2xl bg-soil/20 font-semibold" onClick={()=>s.setO(x)}>{x}</button>)}</div>}</div>
export function CropPage(){const{t,lang}=useT(),{loc,w,err,ld}=useWeather(),s=useSoil()
 return<PageShell title={t.crop} subtitle={t.cd} icon={Wheat}><LocationPicker/>{loc&&<SoilBox s={s}/>}<St ld={ld} err={err}>{w&&<>
 {recommendCrop(s.soil,w.now.temperature_2m,w.rain30).map(({crop,score,reasons})=><div key={crop.id} className="card space-y-2"><div className="flex justify-between items-center"><h3 className="text-xl font-bold">{crop.e} {(crop as any)[lang==='en'?'en':lang]}</h3><b>{score}%</b></div>
 <div className="h-3 bg-gray-200 rounded-full"><div className="h-3 bg-crop rounded-full" style={{width:score+'%'}}/></div>{reasons.map(r=><p key={r} className="text-sm">✔ {r}</p>)}</div>)}
 <p className="text-sm text-center">Based on regional soil averages. For exact results, get a soil test.</p></>}</St></PageShell>}
export function Yield(){const{t,lang}=useT(),{loc,w,err,ld}=useWeather(),s=useSoil(),[id,setId]=useState('rice'),[a,setA]=useState(1),[ha,setHa]=useState(false),[price,setPrice]=useState('')
 const c=crops.find(x=>x.id===id)!,ac=ha?a*2.471:a,exp=w?c.y*ac*soilScore(c,s.soil)*rainFactor(c,w.rain30):0,f=(n:number)=>`${n.toFixed(1)} q (${Math.round(n*100)} kg)`
 return<PageShell title={t.yield} subtitle={t.yd} icon={BarChart3}><LocationPicker/>{loc&&<SoilBox s={s}/>}
 <div className="card grid grid-cols-3 gap-2">{crops.map(x=><button key={x.id} onClick={()=>setId(x.id)} className={`min-h-[56px] rounded-2xl text-sm ${x.id==id?'bg-leaf text-white':'bg-sky/60'}`}>{x.e}<br/>{(x as any)[lang==='en'?'en':lang]}</button>)}</div>
 <div className="card flex items-center justify-center gap-3"><button className="btn" onClick={()=>setA(Math.max(.5,a-.5))}>−</button><b className="text-xl w-16 text-center">{a}</b><button className="btn" onClick={()=>setA(a+.5)}>+</button>
 <button className="btn !bg-wheat !text-ink" onClick={()=>setHa(!ha)}>{ha?'hectare':'acre'}</button></div>
 <St ld={ld} err={err}>{w&&<div className="card space-y-1"><p>Low: <b>{f(exp*.8)}</b></p><p className="text-xl">Expected: <b>{f(exp)}</b></p><p>High: <b>{f(exp*1.2)}</b></p>
 <input className="min-h-[48px] rounded-full border-2 border-paddy px-4 w-full" inputMode="numeric" placeholder="Price per quintal (₹), optional" value={price} onChange={e=>setPrice(e.target.value.replace(/\D/g,''))}/>
 {price&&<p>Approx. income: ₹{Math.round(exp*+price).toLocaleString('en-IN')}</p>}<p className="text-sm">An estimate for planning, not a guarantee.</p></div>}</St>{!loc&&<p className="text-center">Pick a location for rainfall data.</p>}</PageShell>}
type R={status:'healthy'|'possibly_diseased'|'unclear';name:string;symptoms:string[];advice:string[]}
// LOCAL DEMO ONLY: colour heuristic on the photo. Replace analyse() with a call to a server-side AI vision endpoint for real results.
async function analyse(file:File):Promise<R>{const img=await new Promise<HTMLImageElement>((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>no(new Error('Could not read the image'));i.src=URL.createObjectURL(file)})
 const k=Math.min(1,1024/Math.max(img.width,img.height)),cv=document.createElement('canvas');cv.width=img.width*k;cv.height=img.height*k;const x=cv.getContext('2d')!;x.drawImage(img,0,0,cv.width,cv.height)
 const d=x.getImageData(0,0,cv.width,cv.height).data;let g=0,y=0,n=0;for(let i=0;i<d.length;i+=16){n++;const[r,gg,b]=[d[i],d[i+1],d[i+2]];if(gg>r&&gg>b)g++;else if(r>gg&&gg>b&&r>100)y++}
 if(g/n<.15)return{status:'unclear',name:'',symptoms:['No clear leaf found'],advice:['Retake the photo in daylight, close to one leaf']}
 return y/(g+y)>.25?{status:'possibly_diseased',name:'Spots or yellowing (demo guess)',symptoms:['Yellow/brown patches seen'],advice:['Remove badly affected leaves','Show the leaf to an agriculture officer']}:{status:'healthy',name:'',symptoms:['Mostly green leaf'],advice:['Keep watching the crop weekly']}}
export function Disease(){const{t}=useT(),[prev,setPrev]=useState(''),[r,setR]=useState<R|null>(null),[ld,setLd]=useState(false),[err,setErr]=useState('')
 const pick=async(e:React.ChangeEvent<HTMLInputElement>)=>{const f=e.target.files?.[0];if(!f)return;setPrev(URL.createObjectURL(f));setR(null);setErr('');setLd(true);try{setR(await analyse(f))}catch(x:any){setErr(x.message||t.err)}setLd(false)}
 const col={healthy:'bg-green-600',possibly_diseased:'bg-amber-500',unclear:'bg-gray-500'}
 return<PageShell title={t.disease} subtitle={t.dd} icon={Leaf}><div className="card bg-amber-100 text-sm">⚠ Local demo: this uses a simple colour check on your phone, not an AI model. It is not a real diagnosis.</div>
 <div className="card flex gap-3 flex-wrap">{[['Take photo',Camera,true],['Upload photo',Upload,false]].map(([l,I,cap]:any)=><label key={l} className="btn flex-1 cursor-pointer"><I/>{l}<input type="file" accept="image/*" {...(cap?{capture:'environment'}:{})} hidden onChange={pick}/></label>)}</div>
 {prev&&<img src={prev} className="card !p-0 w-full max-h-80 object-cover"/>}{ld&&<Skeleton/>}{err&&<div className="card text-red-700">{err}</div>}
 {r&&<div className="card !p-0 overflow-hidden"><div className={`${col[r.status]} text-white p-3 font-bold capitalize`}>{r.status.replace('_',' ')}</div><div className="p-4 space-y-1">{r.name&&<h3 className="font-bold">{r.name}</h3>}{r.symptoms.map(s=><p key={s}>• {s}</p>)}{r.advice.map(s=><p key={s}>✔ {s}</p>)}</div></div>}
 <p className="text-center font-semibold">First check only. Confirm with an agriculture expert.</p></PageShell>}
