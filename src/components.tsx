import {createContext,useContext,useEffect,useState,ReactNode} from 'react'
import {Link,NavLink} from 'react-router-dom'
import {Sprout,MapPin,Menu,X,ChevronDown,CloudSun,Wheat,Leaf,BarChart3,ArrowUp} from 'lucide-react'
import {useT,Lang} from './translations'
import {Loc,geocode,byPin,byGps} from './lib/api'
export const FEATS=[{to:'/weather',k:'weather',d:'wd',I:CloudSun,c:'bg-sky'},{to:'/crop',k:'crop',d:'cd',I:Wheat,c:'bg-paddy'},{to:'/disease',k:'disease',d:'dd',I:Leaf,c:'bg-harvest/60'},{to:'/yield',k:'yield',d:'yd',I:BarChart3,c:'bg-wheat/70'}] as const
export const Logo=({tag=true}:{tag?:boolean})=>{const{t}=useT();return<Link to="/" className="flex items-center gap-2"><Sprout className="text-crop" size={30}/><span><span className="font-head font-bold text-xl text-leaf">Crop</span><span className="font-head font-bold text-xl text-wheat">Sense</span>{tag&&<small className="hidden lg:block text-xs text-soil -mt-1">{t.tag}</small>}</span></Link>}
export const Hills=()=><svg viewBox="0 0 800 160" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-40 opacity-30 pointer-events-none"><path d="M0 90Q200 20 400 80T800 60V160H0Z" fill="#9CCC65"/><path d="M0 120Q250 70 500 110T800 100V160H0Z" fill="#4CAF50"/>{[...Array(40)].map((_,i)=><path key={i} d={`M${i*20+5} 160v-25`} stroke="#2E7D32" strokeWidth="3"/>)}</svg>
export const PageShell=({title,subtitle,icon:I,children}:{title:string;subtitle:string;icon:any;children:ReactNode})=>
<div className="relative min-h-screen bg-gradient-to-b from-sky to-cream pb-44"><div className="max-w-3xl mx-auto p-4 space-y-4 relative z-10">
<div className="card flex items-center gap-4 bg-leaf/90 !text-white"><I size={44}/><div><h1 className="text-2xl font-bold">{title}</h1><p className="text-sm opacity-90">{subtitle}</p></div></div>{children}</div><Hills/></div>
const LC=createContext<{loc:Loc|null;setLoc:(l:Loc)=>void}>({loc:null,setLoc:()=>{}})
export const useLoc=()=>useContext(LC)
export const LocationProvider=({children}:{children:ReactNode})=>{const[loc,s]=useState<Loc|null>(()=>{try{return JSON.parse(localStorage.getItem('loc')||'null')}catch{return null}})
 return<LC.Provider value={{loc,setLoc:l=>{s(l);localStorage.setItem('loc',JSON.stringify(l))}}}>{children}</LC.Provider>}
export const LocationPicker=()=>{const{t}=useT(),{loc,setLoc}=useLoc(),[pin,setPin]=useState(''),[q,setQ]=useState(''),[res,setRes]=useState<Loc[]>([]),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false)
 const run=async(f:()=>Promise<any>)=>{setBusy(true);setMsg('');try{await f()}catch(e:any){setMsg(e.message||t.err)}setBusy(false)}
 const inp="min-h-[48px] rounded-full border-2 border-paddy px-4 flex-1 min-w-0"
 return<div className="card space-y-3"><p className="flex items-center gap-2 font-semibold"><MapPin className="text-leaf"/>{loc?`${loc.name}${loc.state?', '+loc.state:''}`:'—'}</p>
 <button className="btn w-full" disabled={busy} onClick={()=>run(()=>new Promise<void>((ok,no)=>navigator.geolocation?navigator.geolocation.getCurrentPosition(async p=>{setLoc(await byGps(p.coords.latitude,p.coords.longitude));ok()},()=>no(new Error('Location blocked. Use PIN or search.'))):no(new Error('No GPS'))))}>{t.gps}</button>
 <div className="flex gap-2"><input className={inp} inputMode="numeric" maxLength={6} placeholder={t.pin} value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,''))}/><button className="btn" disabled={busy||pin.length!==6} onClick={()=>run(async()=>setLoc(await byPin(pin)))}>{t.go}</button></div>
 <div className="flex gap-2"><input className={inp} placeholder={t.search} value={q} onChange={e=>setQ(e.target.value)}/><button className="btn" disabled={busy||!q} onClick={()=>run(async()=>{const r=await geocode(q);if(!r.length)throw new Error('Place not found');setRes(r)})}>{t.go}</button></div>
 {res.map((r,i)=><button key={i} className="block w-full text-left min-h-[48px] px-4 rounded-2xl bg-sky/60" onClick={()=>{setLoc(r);setRes([])}}>{r.name}, {r.state}</button>)}
 {msg&&<p className="text-red-700 text-sm">{msg}</p>}</div>}
export const Skeleton=()=><div className="card animate-pulse space-y-3"><div className="h-8 bg-sky rounded"/><div className="h-24 bg-sky rounded"/></div>
export const Disclaimer=()=><p className="text-sm text-soil text-center">A support tool for farmers, not a replacement for expert judgement.</p>
export function Navbar(){const{t,lang,setLang}=useT(),[dd,setDd]=useState(false),[m,setM]=useState(false)
 useEffect(()=>{const f=()=>setDd(false),k=(e:KeyboardEvent)=>e.key==='Escape'&&setDd(false);document.addEventListener('click',f);document.addEventListener('keydown',k);return()=>{document.removeEventListener('click',f);document.removeEventListener('keydown',k)}},[])
 const feats=<>{FEATS.map(f=><Link key={f.to} to={f.to} onClick={()=>setM(false)} className="flex items-center gap-2 min-h-[48px] px-4 hover:bg-sky rounded-xl"><f.I size={20}/>{(t as any)[f.k]}</Link>)}</>
 const sel=<select aria-label="Language" value={lang} onChange={e=>setLang(e.target.value as Lang)} className="min-h-[44px] rounded-full border-2 border-paddy px-2 bg-white"><option value="en">English</option><option value="hi">हिन्दी</option><option value="kn">ಕನ್ನಡ</option></select>
 return<nav className="sticky top-0 z-50 bg-white/95 shadow"><div className="max-w-6xl mx-auto flex items-center justify-between p-2 px-4"><Logo/>
 <div className="hidden md:flex items-center gap-4"><NavLink to="/">{t.home}</NavLink>
 <div className="relative" onClick={e=>e.stopPropagation()}><button className="flex items-center gap-1 min-h-[48px]" onClick={()=>setDd(!dd)}>{t.features}<ChevronDown size={16}/></button>{dd&&<div className="absolute top-12 w-64 card !p-2" onClick={()=>setDd(false)}>{feats}</div>}</div>
 <NavLink to="/about">{t.about}</NavLink>{sel}</div>
 <button className="md:hidden min-h-[48px] min-w-[48px]" aria-label="Menu" onClick={()=>setM(!m)}>{m?<X/>:<Menu/>}</button></div>
 {m&&<div className="md:hidden p-3 space-y-1"><Link to="/" onClick={()=>setM(false)} className="block min-h-[48px] px-4 leading-[48px]">{t.home}</Link><details><summary className="min-h-[48px] px-4 leading-[48px]">{t.features}</summary>{feats}</details><Link to="/about" onClick={()=>setM(false)} className="block min-h-[48px] px-4 leading-[48px]">{t.about}</Link>{sel}</div>}</nav>}
export const Footer=()=>{const{t}=useT();return<footer className="bg-leaf text-white p-6 space-y-3 text-center"><div className="flex justify-center bg-white rounded-full w-fit mx-auto px-4"><Logo tag={false}/></div>
 <div className="flex flex-wrap justify-center gap-4"><Link to="/">{t.home}</Link>{FEATS.map(f=><Link key={f.to} to={f.to}>{(t as any)[f.k]}</Link>)}<Link to="/about">{t.about}</Link></div><Disclaimer/>
 <button aria-label="Back to top" className="fixed bottom-4 right-4 btn !p-0 w-12 shadow-lg" onClick={()=>scrollTo({top:0,behavior:'smooth'})}><ArrowUp/></button></footer>}
export function Splash({done}:{done:()=>void}){const[s,setS]=useState(0)
 useEffect(()=>{const a=setTimeout(()=>setS(1),2000),b=setTimeout(()=>setS(2),2800),c=setTimeout(done,3300);return()=>{clearTimeout(a);clearTimeout(b);clearTimeout(c)}},[])
 const{t}=useT()
 return<div onClick={done} className={`fixed inset-0 z-[100] bg-gradient-to-b from-sky to-cream flex flex-col items-center justify-end transition-opacity duration-500 ${s==2?'opacity-0':''}`}>
 <div className="flex-1 flex flex-col items-center justify-center">{s<1?<svg width="200" height="240" viewBox="0 0 200 240"><g className="sway"><path className="grow" d="M100 230V90" stroke="#2E7D32" strokeWidth="8" fill="none"/>
 <ellipse className="pop" style={{animationDelay:'1s'}} cx="70" cy="140" rx="30" ry="14" fill="#9CCC65" transform="rotate(-30 70 140)"/><ellipse className="pop" style={{animationDelay:'1.2s'}} cx="130" cy="120" rx="30" ry="14" fill="#4CAF50" transform="rotate(30 130 120)"/>
 <circle className="pop" style={{animationDelay:'1.5s'}} cx="100" cy="80" r="14" fill="#F2B84B"/></g></svg>:<div className="fade text-center"><div className="flex justify-center scale-150 mb-3 bg-white/70 rounded-full px-4"><Logo tag={false}/></div><p className="font-head text-soil">{t.tag}</p></div>}</div>
 <div className="w-full h-16 bg-soil rounded-t-[50%]"/></div>}
