import {crops,Crop} from '../data/crops'
import type {Soil} from '../data/soilByRegion'
export const season=(d=new Date())=>{const m=d.getMonth()+1;return m>=6&&m<=10?'Kharif':m>=11||m<=3?'Rabi':'Zaid'}
export const soilScore=(c:Crop,s:Soil)=>c.soils.includes(s)?1:.6
export const rainFactor=(c:Crop,mm:number)=>mm>=c.r[0]&&mm<=c.r[1]?1:mm<c.r[0]*.5||mm>c.r[1]*1.8?.7:.88
const fit=(v:number,[a,b]:[number,number],w:number)=>v>=a&&v<=b?w:Math.max(0,w*(1-Math.min(Math.abs(v<a?a-v:v-b)/((b-a)||1),1)))
// TODO: a trained ML model (soil + climate features -> crop) can replace this function.
export function recommendCrop(soil:Soil,tempC:number,rainMonth:number,sea=season()){
 return crops.map(c=>{const se=c.seasons.includes(sea),so=c.soils.includes(soil)
  const score=Math.round((se?30:5)+(so?25:8)+fit(tempC,c.t,25)+fit(rainMonth,c.r,20))
  const a=so?`${soil} soil suits ${c.en.toLowerCase()}`:`${soil} soil is workable, not ideal`
  const b=se?`Good fit for the ${sea} season`:`Usually grown in ${c.seasons.join('/')}`
  const t=tempC>=c.t[0]&&tempC<=c.t[1]?`${Math.round(tempC)}°C is in its comfort range`:`Prefers ${c.t[0]}–${c.t[1]}°C`
  return{crop:c,score,reasons:[a,se?b:t]}}).sort((x,y)=>y.score-x.score).slice(0,3)}
