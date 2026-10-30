import {useState} from 'react';import {Routes,Route} from 'react-router-dom'
import {LangCtx,Lang} from './translations';import {LocationProvider,Navbar,Footer,Splash} from './components'
import {Home,About,Weather,CropPage,Yield,Disease} from './pages'
export default function App(){const[lang,setLang]=useState<Lang>('en'),[splash,setSplash]=useState(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!sessionStorage.getItem('seen'))
 return<LangCtx.Provider value={{lang,setLang}}><LocationProvider>{splash&&<Splash done={()=>{sessionStorage.setItem('seen','1');setSplash(false)}}/>}
 <Navbar/><Routes><Route path="/" element={<Home/>}/><Route path="/about" element={<About/>}/><Route path="/weather" element={<Weather/>}/><Route path="/crop" element={<CropPage/>}/><Route path="/yield" element={<Yield/>}/><Route path="/disease" element={<Disease/>}/></Routes><Footer/></LocationProvider></LangCtx.Provider>}
