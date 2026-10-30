export type Loc={lat:number;lon:number;name:string;state:string}
export async function geocode(q:string):Promise<Loc[]>{const j=await(await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&country_code=IN`)).json()
 return(j.results||[]).map((x:any)=>({lat:x.latitude,lon:x.longitude,name:x.name,state:x.admin1||''}))}
export async function byPin(p:string):Promise<Loc>{const j=await(await fetch(`https://api.postalpincode.in/pincode/${p}`)).json();const o=j[0]?.PostOffice?.[0]
 if(!o)throw new Error('PIN code not found');const g=await geocode(o.District);if(!g[0])throw new Error('District not found');return{...g[0],name:o.District,state:o.State}}
export async function byGps(lat:number,lon:number):Promise<Loc>{let name='Your location',state=''
 try{const j=await(await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)).json();name=j.city||j.locality||name;state=j.principalSubdivision||''}catch{}
 return{lat,lon,name,state}}
export async function getWeather(l:Loc){
 const j=await(await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${l.lat}&longitude=${l.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum&past_days=30&forecast_days=5&timezone=auto`)).json()
 if(!j.daily)throw new Error('No data');const d=j.daily,n=(k:string)=>d[k].slice(30)
 return{now:j.current,days:d.time.slice(30).map((t:string,i:number)=>({t,max:n('temperature_2m_max')[i],min:n('temperature_2m_min')[i],p:n('precipitation_probability_max')[i]||0,mm:n('precipitation_sum')[i]||0})),
  rain30:(d.precipitation_sum.slice(0,30) as number[]).reduce((a,b)=>a+(b||0),0)}}
export type W=Awaited<ReturnType<typeof getWeather>>
