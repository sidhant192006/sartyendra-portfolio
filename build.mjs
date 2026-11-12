import {build} from 'esbuild';import fs from 'fs';
await build({entryPoints:['src/main.jsx'],bundle:true,minify:true,outdir:'dist',loader:{'.png':'dataurl','.jpg':'dataurl'},define:{'process.env.NODE_ENV':'"production"'},jsx:'automatic'});
const js=fs.readFileSync('dist/main.js','utf8').replace(/<\/script/g,'<\\/script'),css=fs.readFileSync('dist/main.css','utf8');
fs.writeFileSync('dist/index.html',`<!DOCTYPE html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#c8101e"><title>Satyendra Kumar Singh | Stores & Purchase Manager – SAP, Procurement & Material Management</title><meta name="description" content="Satyendra Kumar Singh – Associate Manager (Stores & Purchase) with 19.5+ years in highway project stores, procurement, SAP MM (PO, PR, GRN), MDM and inventory control. Based in Kanpur, India."><meta name="keywords" content="Satyendra Kumar Singh, stores manager, purchase manager, associate manager stores and purchase, procurement manager, material management, inventory management, store keeper, SAP MM, SAP PO PR GRN, MDM item code, vendor code creation, highway project stores, NH road construction stores, Bharatmala Pariyojana, weighbridge, material reconciliation, stores and procurement jobs, Kanpur, Indore, Uttar Pradesh, Madhya Pradesh"><meta name="author" content="Satyendra Kumar Singh"><meta name="robots" content="index, follow"><link rel="canonical" href="${process.env.SITE_URL?process.env.SITE_URL.replace(/\/+$/,"")+"/":"https://www.example.com/"}"><meta property="og:type" content="website"><meta property="og:title" content="Satyendra Kumar Singh – Stores & Purchase Manager"><meta property="og:description" content="19.5+ years in stores, procurement and material control on national highway projects. SAP, MDM, inventory control."><meta name="twitter:card" content="summary"><script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Satyendra Kumar Singh","jobTitle":"Associate Manager – Stores & Purchase","telephone":"+91-8299807477","email":"satyendrasingh.1083@gmail.com","address":{"@type":"PostalAddress","addressLocality":"Kanpur","addressRegion":"Uttar Pradesh","addressCountry":"IN"},"alumniOf":{"@type":"CollegeOrUniversity","name":"CSJM University, Kanpur"},"knowsLanguage":["Hindi","English"],"knowsAbout":["Stores management","Procurement","Material management","Inventory control","SAP MM","GRN","Master data management","Highway project stores","Weighbridge operations","Material reconciliation"]}</script><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700;800&display=swap" rel="stylesheet"><style>${css}</style></head><body><div id="root"></div><script>${js}</script></body></html>`);

// ---- SEO: sitemap.xml + robots.txt ----
// Set your real domain: SITE_URL=https://yourdomain.com npm run build
const SITE=(process.env.SITE_URL||'https://www.example.com').replace(/\/+$/,'');
const today=new Date().toISOString().slice(0,10);
const pages=[['', '1.0'],['#work','0.8'],['#services','0.8'],['#about','0.7'],['#contact','0.7']];
const sitemap=`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(([p,pr])=>`  <url>
    <loc>${SITE}/${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${pr}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync('dist/sitemap.xml',sitemap);
fs.writeFileSync('dist/robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
