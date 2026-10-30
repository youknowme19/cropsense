import {createContext,useContext} from 'react'
export type Lang='en'|'hi'|'kn'
export const LOCALE={en:'en-IN',hi:'hi-IN',kn:'kn-IN'}
const en={home:'Home',features:'Features',about:'About',weather:'Weather',crop:'Crop Recommendation',disease:'Disease Check',yield:'Yield Estimate',
tag:'Sense. Decide. Grow.',head:'Smarter farming. Simpler decisions.',explore:'Explore Features',open:'Open',morning:'Good morning',afternoon:'Good afternoon',evening:'Good evening',
wd:'Current weather and farm advice',cd:'Best crops for your land',dd:'Check a leaf with a photo',yd:'Plan your harvest',disc:'A support tool for farmers, not a replacement for expert judgement.',
gps:'Use my location',pin:'6-digit PIN code',search:'Search place',go:'Go',loading:'Loading…',err:'Something went wrong. Please try again.',
irr:'Irrigation',spr:'Spraying',sow:'Sowing',har:'Harvesting',s1:'Tell us your location',s2:'We read soil and weather',s3:'You get a clear answer'}
const hi:typeof en={...en,home:'होम',features:'सुविधाएँ',about:'हमारे बारे में',weather:'मौसम',crop:'फसल सुझाव',disease:'रोग जाँच',yield:'उपज अनुमान',tag:'समझें। चुनें। उगाएँ।',head:'स्मार्ट खेती। आसान फैसले।',explore:'सुविधाएँ देखें',open:'खोलें',morning:'सुप्रभात',afternoon:'नमस्कार',evening:'शुभ संध्या',gps:'मेरी लोकेशन',search:'जगह खोजें',go:'जाएँ',loading:'लोड हो रहा है…',irr:'सिंचाई',spr:'छिड़काव',sow:'बुवाई',har:'कटाई'}
const kn:typeof en={...en,home:'ಮುಖಪುಟ',features:'ಸೌಲಭ್ಯಗಳು',about:'ನಮ್ಮ ಬಗ್ಗೆ',weather:'ಹವಾಮಾನ',crop:'ಬೆಳೆ ಶಿಫಾರಸು',disease:'ರೋಗ ಪರೀಕ್ಷೆ',yield:'ಇಳುವರಿ ಅಂದಾಜು',tag:'ಅರಿಯಿರಿ. ನಿರ್ಧರಿಸಿ. ಬೆಳೆಯಿರಿ.',head:'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ. ಸರಳ ನಿರ್ಧಾರ.',explore:'ಸೌಲಭ್ಯಗಳನ್ನು ನೋಡಿ',open:'ತೆರೆಯಿರಿ',morning:'ಶುಭೋದಯ',afternoon:'ನಮಸ್ಕಾರ',evening:'ಶುಭ ಸಂಜೆ',gps:'ನನ್ನ ಸ್ಥಳ',search:'ಸ್ಥಳ ಹುಡುಕಿ',go:'ಹೋಗಿ',loading:'ಲೋಡ್ ಆಗುತ್ತಿದೆ…',irr:'ನೀರಾವರಿ',spr:'ಸಿಂಪಡಣೆ',sow:'ಬಿತ್ತನೆ',har:'ಕೊಯ್ಲು'}
export const T={en,hi,kn}
export const LangCtx=createContext<{lang:Lang;setLang:(l:Lang)=>void}>({lang:'en',setLang:()=>{}})
export const useT=()=>{const{lang,setLang}=useContext(LangCtx);return{t:T[lang],lang,setLang}}
