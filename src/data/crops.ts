import type {Soil} from './soilByRegion'
export type Crop={id:string;e:string;en:string;hi:string;kn:string;seasons:string[];t:[number,number];r:[number,number];soils:Soil[];y:number}
// t = ideal °C, r = ideal rain mm/month, y = avg quintals per acre
const K='Kharif',R='Rabi',Z='Zaid'
const c=(id:string,e:string,en:string,hi:string,kn:string,seasons:string[],t:[number,number],r:[number,number],soils:Soil[],y:number):Crop=>({id,e,en,hi,kn,seasons,t,r,soils,y})
export const crops:Crop[]=[
c('rice','🌾','Rice','धान','ಭತ್ತ',[K],[22,35],[150,300],['Alluvial','Black','Laterite'],20),
c('wheat','🌾','Wheat','गेहूँ','ಗೋಧಿ',[R],[10,25],[20,70],['Alluvial','Black'],18),
c('maize','🌽','Maize','मक्का','ಮೆಕ್ಕೆಜೋಳ',[K,R],[18,32],[60,150],['Alluvial','Red','Sandy'],22),
c('cotton','☁️','Cotton','कपास','ಹತ್ತಿ',[K],[21,35],[60,150],['Black'],8),
c('sugarcane','🎋','Sugarcane','गन्ना','ಕಬ್ಬು',[K,Z],[20,35],[100,200],['Alluvial','Black'],300),
c('groundnut','🥜','Groundnut','मूँगफली','ಕಡಲೆಕಾಯಿ',[K,Z],[22,32],[50,120],['Red','Sandy'],8),
c('soybean','🫘','Soybean','सोयाबीन','ಸೋಯಾ',[K],[20,30],[80,160],['Black'],8),
c('ragi','🌿','Ragi','रागी','ರಾಗಿ',[K],[20,30],[40,110],['Red','Laterite'],8),
c('jowar','🌾','Jowar','ज्वार','ಜೋಳ',[K,R],[22,34],[40,100],['Black','Red','Sandy'],8),
c('tur','🫛','Tur (Arhar)','अरहर','ತೊಗರಿ',[K],[20,32],[60,130],['Black','Red'],5),
c('gram','🫘','Gram (Chana)','चना','ಕಡಲೆ',[R],[15,28],[15,60],['Black','Alluvial'],6),
c('mustard','🌼','Mustard','सरसों','ಸಾಸಿವೆ',[R],[10,25],[15,50],['Alluvial','Sandy'],6),
c('potato','🥔','Potato','आलू','ಆಲೂಗಡ್ಡೆ',[R],[12,24],[30,80],['Alluvial','Sandy','Mountain'],80),
c('tomato','🍅','Tomato','टमाटर','ಟೊಮೆಟೊ',[R,Z,K],[18,30],[40,110],['Red','Alluvial','Laterite'],100),
c('onion','🧅','Onion','प्याज','ಈರುಳ್ಳಿ',[R,K],[13,30],[30,90],['Black','Red','Alluvial'],90)]
