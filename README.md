# CropSense
```
npm install
npm run dev
```
Works: splash, navbar+dropdown, EN/HI/KN toggle, home (real date/season/greeting), /about, location picker (GPS, PIN, search; saved in localStorage), /weather with advice, /crop (auto soil + top 3), /yield, /disease.
Disease is a clearly labelled LOCAL DEMO (colour heuristic). For real analysis, add a server-side vision endpoint (e.g. a "analyze-leaf" edge function with your own AI key) and call it from `analyse()` in src/pages.tsx.
Needs internet for Open-Meteo, postalpincode.in and bigdatacloud APIs. No keys needed.
