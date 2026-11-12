import {context} from 'esbuild';import fs from 'fs';
const port=Number(process.env.PORT)||5173;
fs.mkdirSync('.dev',{recursive:true});
fs.writeFileSync('.dev/index.html',`<!DOCTYPE html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>Satyendra Kumar Singh (dev)</title><meta name="description" content=""><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="/main.css"></head><body><div id="root"></div><script src="/main.js"></script><script>new EventSource('/esbuild').addEventListener('change',()=>location.reload())</script></body></html>`);
const ctx=await context({entryPoints:['src/main.jsx'],bundle:true,outdir:'.dev',loader:{'.png':'dataurl','.jpg':'dataurl'},define:{'process.env.NODE_ENV':'"development"'},jsx:'automatic',sourcemap:true});
await ctx.watch();
const {port:p}=await ctx.serve({servedir:'.dev',port,host:'0.0.0.0'});
console.log(`Dev server: http://localhost:${p}`);
