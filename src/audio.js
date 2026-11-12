let ctx,master,mus,sfx,bus,bellT,on=false,m=.35,v=.65;
const pent=[440,493.88,554.37,659.25,739.99,880,987.77];
function init(){if(ctx)return;const C=window.AudioContext||window.webkitAudioContext;if(!C)return;ctx=new C();master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);
mus=ctx.createGain();mus.gain.value=m;mus.connect(master);sfx=ctx.createGain();sfx.gain.value=.5;sfx.connect(master);
const lp=ctx.createBiquadFilter();lp.type="lowpass";lp.frequency.value=900;lp.connect(mus);
[110,164.81,220,277.18,329.63].forEach((f,i)=>{const o=ctx.createOscillator();o.type=i%2?"triangle":"sine";o.frequency.value=f;o.detune.value=(Math.random()-.5)*12;const g=ctx.createGain();g.gain.value=.05;const l=ctx.createOscillator();l.frequency.value=.05+Math.random()*.08;const lg=ctx.createGain();lg.gain.value=.03;l.connect(lg);lg.connect(g.gain);o.connect(g);g.connect(lp);o.start();l.start()});
bus=ctx.createGain();bus.connect(mus);const d=ctx.createDelay(1);d.delayTime.value=.38;const fb=ctx.createGain();fb.gain.value=.4;bus.connect(d);d.connect(fb);fb.connect(d);d.connect(mus)}
function bell(f,vol,dur){const t=ctx.currentTime;[1,2.01].forEach((k,i)=>{const o=ctx.createOscillator();o.type="sine";o.frequency.value=f*k;const g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol/(i+1),t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(bus);o.start(t);o.stop(t+dur+.1)})}
export const A={
get on(){return on},get music(){return m},get master(){return v},
setOn(b){init();if(!ctx)return;ctx.resume();on=b;master.gain.setTargetAtTime(b?v:0,ctx.currentTime,.5);clearInterval(bellT);bellT=null;if(b){bellT=setInterval(()=>bell(pent[Math.floor(Math.random()*pent.length)],.07,3.2),3800)}},
setMusic(x){m=x;if(mus)mus.gain.setTargetAtTime(x,ctx.currentTime,.1)},
setMaster(x){v=x;if(on&&master)master.gain.setTargetAtTime(x,ctx.currentTime,.1)},
tick(){if(!on||!ctx)return;const t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(1400,t);o.frequency.exponentialRampToValueAtTime(900,t+.05);g.gain.setValueAtTime(.05,t);g.gain.exponentialRampToValueAtTime(.0001,t+.07);o.connect(g);g.connect(sfx);o.start(t);o.stop(t+.08)},
chime(f=880){if(!on||!ctx)return;bell(f,.16,1.4)},
arp(){if(!on||!ctx)return;[523.25,659.25,783.99,1046.5,1318.5].forEach((f,i)=>setTimeout(()=>bell(f,.14,1.8),i*95))}};
