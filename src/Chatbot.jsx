import {useState,useEffect,useRef} from 'react';

const norm=s=>s.toLowerCase().replace(/[^a-z0-9ऀ-ॿ\s+\-]/g," ");

export default function Chatbot({P,data}){
const {career,edu,projs,groups,duties,faqs}=data;
const wa=(t)=>"https://wa.me/91"+P.phone+(t?"?text="+encodeURIComponent(t):"");
const contactActs=[{l:"💬 WhatsApp",h:wa("Hello "+P.name+", I found you on your website.")},{l:"📞 Call",h:"tel:+91"+P.phone},{l:"✉️ Email",h:"mailto:"+P.email}];
const chipsMain=["Experience","Projects","SAP & MDM","Services","Education","Contact","Leave a message"];

// Knowledge base: keywords (English + Hinglish) -> answer
const KB=[
{k:["hello","hi","hey","namaste","namaskar","hii","good morning","good evening","kaise ho"],a:()=>({t:"Namaste! 🙏 I'm the SKS Assistant. Ask me anything about "+P.name+" — experience, projects, SAP skills, or how to reach him."})},
{k:["who","kaun","about","introduce","profile","parichay","tell me about","bare mein","baare mein"],a:()=>({t:P.name+" is an "+P.role+" with 19.5+ years in stores and procurement on national highway projects. He is based in Kanpur, Uttar Pradesh, works in SAP and MDM, and is known for accurate records and reliable material control."})},
{k:["experience","anubhav","years","kitne saal","career","worked","work history","company","companies","kaam kiya"],a:()=>({t:"19.5+ years of experience across three organisations:\n"+career.map(c=>"• "+c[1]+" — "+c[2].split(" · ")[0]+" ("+c[3]+")").join("\n"),c:["Projects","SAP & MDM","Contact"]})},
{k:["project","highway","nh-","nh4","bharatmala","road","tejajinagar","balwara","indore","gujarat","ayodhya","gorakhpur","dbfot"],a:()=>({t:"Highway projects handled:\n"+projs.map(p=>"• "+p[0]+": "+p[2]+" ("+p[1]+")").join("\n"),c:["Experience","Services","Contact"]})},
{k:["training","trained","course","seekha","sap","mdm","grn","po ","pr ","item code","vendor code","system","software","erp","tools","excel","powerpoint","office","sop"],a:()=>({t:"Systems & tools: "+groups[0][1].join(", ")+".\nAll GRN, issue indents, issue returns and STN are recorded in SAP the same day, accurately. He has also attended hands-on SAP training sessions (see the SAP Training section).",c:["Services","Education","Contact"]})},
{k:["service","duty","duties","responsib","kya karte","what do you do","store","stores","inventory","procurement","purchase","material","reconcil","weighbridge","bill","reorder","re-order","physical","verification","subcontract","kaam"],a:()=>({t:"Core responsibilities:\n"+duties.map(d=>"• "+d[1]).join("\n"),c:["SAP & MDM","Projects","Contact"]})},
{k:["education","study","degree","qualification","padhai","university","college","graduation","economics","school","padhe"],a:()=>({t:"Education:\n"+edu.map(e=>"• "+e[1]+" — "+e[2]+" ("+e[3]+")").join("\n")})},
{k:["skill","strength","strengths","quality","khubi","personality","analytical","team"],a:()=>({t:"Strengths: "+groups[2][1].join(", ")+". Stores skills: "+groups[1][1].join(", ")+".",c:["Experience","Contact"]})},
{k:["where","location","city","kanpur","address","kahan","rehte","based","relocate","relocation"],a:()=>({t:"Based in Kanpur, Uttar Pradesh. He has long experience on projects in Madhya Pradesh (Indore region) and Uttar Pradesh. For relocation or site-posting questions, please speak to him directly.",a:contactActs})},
{k:["language","bhasha","hindi","english","speak"],a:()=>({t:"Hindi and English — read, write and speak."})},
{k:["hobby","hobbies","interest","cricket","travel","shauk"],a:()=>({t:"Interests: playing cricket, making new friends and travelling. 🏏"})},
{k:["hire","hiring","job","vacancy","opening","available","availability","joining","notice","salary","ctc","package","expected","interview","opportunity","naukri","offer","recruit"],a:()=>({t:"Thanks for your interest! Salary, notice period, availability and interview timing are best discussed directly with "+P.name+". Reach him here or leave a message and I'll pass it on.",a:contactActs,c:["Leave a message"]})},
{k:["contact","phone","number","call","email","mail","whatsapp","reach","baat","sampark","mobile","connect","talk"],a:()=>({t:"You can reach "+P.name+" on +91 "+P.phone+" (call or WhatsApp) or at "+P.email+".",a:contactActs})},
{k:["thanks","thank","shukriya","dhanyavad","thx","ok thanks","great","nice","badhiya"],a:()=>({t:"You're welcome! 😊 Anything else you'd like to know?",c:chipsMain.slice(0,4)})},
{k:["bye","goodbye","alvida","see you"],a:()=>({t:"Goodbye! If you'd like to continue, you can always message "+P.name+" directly.",a:contactActs})}
];

const start=()=>[{r:"b",t:"Namaste! 🙏 I'm the SKS Assistant. Ask me about "+P.name+"'s experience, projects, SAP skills — or leave a message and he will get back to you.",c:chipsMain}];
const load=()=>{try{const v=JSON.parse(sessionStorage.getItem("sks-chat"));if(Array.isArray(v)&&v.length)return v}catch(e){}return start()};
const [open,setOpen]=useState(false);
const [msgs,setMsgs]=useState(load);
const [val,setVal]=useState("");
const [typing,setTyping]=useState(false);
const [mode,setMode]=useState(null); // null | {step:"name"} | {step:"msg",name}
const [unread,setUnread]=useState(true);
const box=useRef(),inp=useRef();

useEffect(()=>{try{sessionStorage.setItem("sks-chat",JSON.stringify(msgs.slice(-40)))}catch(e){}},[msgs]);
useEffect(()=>{if(box.current)box.current.scrollTop=box.current.scrollHeight},[msgs,typing,open]);
useEffect(()=>{if(open){setUnread(false);setTimeout(()=>inp.current&&inp.current.focus(),250)}},[open]);
useEffect(()=>{const f=e=>{if(e.key==="Escape")setOpen(false)};addEventListener("keydown",f);return()=>removeEventListener("keydown",f)},[]);
useEffect(()=>{const t=setTimeout(()=>{if(!open)setUnread(true)},9000);return()=>clearTimeout(t)},[]);

const reply=(m)=>{setTyping(true);setTimeout(()=>{setTyping(false);setMsgs(x=>[...x,{r:"b",...m}])},550+Math.min(900,(m.t||"").length*6))};

const answer=(q)=>{
 const s=" "+norm(q)+" ";
 if(/leave a message|message chhod|message dena|message bhej|msg|pass.*message|send.*message/.test(s)){setMode({step:"name"});return reply({t:"Sure! What's your name?"})}
 let best=null,bs=0;
 KB.forEach(e=>{let sc=0;e.k.forEach(k=>{if(s.includes(k.length<=3?" "+k.trim()+" ":k))sc+=k.length>4?2:1});if(sc>bs){bs=sc;best=e}});
 if(best&&bs>0)return reply(best.a());
 const f=faqs.find(f=>{const w=norm(f[0]).split(/\s+/).filter(x=>x.length>4);return w.some(x=>s.includes(x))});
 if(f)return reply({t:f[1]});
 reply({t:"I'm not sure I have that one — but "+P.name+" can answer directly. Pick a topic below, or leave a message.",c:chipsMain,a:contactActs});
};

const send=(text)=>{
 const q=(text??val).trim();if(!q||typing)return;
 setVal("");setMsgs(x=>x.map(m=>({...m,c:undefined})).concat({r:"u",t:q}));
 if(mode&&mode.step==="name"){setMode({step:"msg",name:q});return reply({t:"Nice to meet you, "+q+"! What would you like to tell "+P.name.split(" ")[0]+"? Type your message."})}
 if(mode&&mode.step==="msg"){const nm=mode.name;setMode(null);return reply({t:"Thanks "+nm+"! Tap below to send this straight to "+P.name.split(" ")[0]+" on WhatsApp — it's pre-filled with your message.",a:[{l:"Send on WhatsApp →",h:wa("Hello "+P.name+", I am "+nm+". "+q+" (via your website)"),p:1},{l:"✉️ Email instead",h:"mailto:"+P.email+"?subject="+encodeURIComponent("Message from "+nm)+"&body="+encodeURIComponent(q)}]})}
 answer(q);
};
const reset=()=>{setMode(null);setMsgs(start())};

return <>
<button className={"cbf"+(open?" x":"")} onClick={()=>setOpen(!open)} aria-label={open?"Close chat":"Chat with SKS Assistant"} aria-expanded={open}>
 <span className="cbi">{open?"✕":"💬"}</span>{!open&&unread&&<i className="cbd"/>}{!open&&<span className="cbl">Ask me anything</span>}
</button>
<div className={"cbp"+(open?" on":"")} role="dialog" aria-label="Chat assistant" aria-hidden={!open}>
 <div className="cbh"><div className="cba">SKS</div><div><b>SKS Assistant</b><small><i/>Online · replies instantly</small></div><button onClick={reset} title="New chat" aria-label="Restart chat">↺</button><button onClick={()=>setOpen(false)} aria-label="Close chat">✕</button></div>
 <div className="cbm" ref={box} aria-live="polite">
  {msgs.map((m,i)=><div key={i} className={"cbr "+m.r}><div className="cbb">{m.t.split("\n").map((l,j)=><span key={j}>{l}<br/></span>)}
   {m.a&&<div className="cbk">{m.a.map(a=><a key={a.l} href={a.h} target={a.h.startsWith("http")?"_blank":undefined} rel="noreferrer" className={a.p?"p":""}>{a.l}</a>)}</div>}</div>
   {m.c&&i===msgs.length-1&&<div className="cbc">{m.c.map(c=><button key={c} onClick={()=>send(c)}>{c}</button>)}</div>}</div>)}
  {typing&&<div className="cbr b"><div className="cbb cbt"><i/><i/><i/></div></div>}
 </div>
 <form className="cbi2" onSubmit={e=>{e.preventDefault();send()}}>
  <input ref={inp} value={val} onChange={e=>setVal(e.target.value)} placeholder={mode?mode.step==="name"?"Your name…":"Type your message…":"Ask in English or Hinglish…"} maxLength={400} aria-label="Type your message"/>
  <button type="submit" disabled={!val.trim()||typing} aria-label="Send">➤</button>
 </form>
 <div className="cbf2">Or talk directly: <a href={wa("Hello "+P.name)} target="_blank" rel="noreferrer">WhatsApp</a> · <a href={"tel:+91"+P.phone}>Call</a> · <a href={"mailto:"+P.email}>Email</a></div>
</div>
</>}
