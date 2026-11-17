(async()=>{
const grid=document.getElementById('props');
if(!grid)return;
const empty=document.getElementById('empty'),bar=document.getElementById('filters');
const sel={loc:document.getElementById('f-loc'),type:document.getElementById('f-type'),price:document.getElementById('f-price')};
let data=[];
try{const r=await fetch('/data/properties.json',{cache:'no-cache'});data=await r.json()}catch(e){}
data=(Array.isArray(data)?data:[]).filter(p=>p&&p.title);

/* USD formatter — replaces the old kes() */
const usd=n=>'USD '+Number(n).toLocaleString('en-US');
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};

/* ── lightbox ── */
const lb=document.createElement('dialog');lb.className='lightbox';
const lbImg=document.createElement('img'),lbCap=el('p','lb-cap'),lbX=el('button','lb-close','Close');lbX.type='button';
lb.append(lbImg,lbCap,lbX);document.body.append(lb);
lb.addEventListener('click',()=>lb.close());
function openLB(p){lbImg.src=p.image;lbImg.alt=p.title+' in '+p.location;lbCap.textContent=p.title+' · '+p.location;lb.showModal()}

/* ── enquiry modal (Web3Forms only) ── */
const KEY='280f5487-132e-4d78-a5ea-281f4a258dc7';
const enq=document.createElement('dialog');enq.className='enquiry';
enq.innerHTML='<div class="enq-box"><button type="button" class="enq-x" aria-label="Close">Close</button><h3>Request details</h3><p class="enq-prop"></p><form class="enq-form"><label>Full name<input name="name" type="text" autocomplete="name" required></label><label>Email<input name="email" type="email" autocomplete="email" required></label><label>Phone<input name="phone" type="tel" autocomplete="tel" required></label><label>Message (optional)<textarea name="message" rows="3"></textarea></label><input type="checkbox" name="botcheck" class="enq-bot" tabindex="-1" autocomplete="off"><button type="submit" class="btn">Send request</button><p class="enq-fine">We use your details only to reply to your enquiry.</p></form><p class="enq-status" role="status"></p></div>';
document.body.append(enq);
const eForm=enq.querySelector('form'),eProp=enq.querySelector('.enq-prop'),eStat=enq.querySelector('.enq-status'),eBtn=enq.querySelector('button[type=submit]');
let cur=null;
enq.querySelector('.enq-x').addEventListener('click',()=>enq.close());
enq.addEventListener('click',e=>{if(e.target===enq)enq.close()});
function openEnq(p){cur=p;eProp.textContent=p.title+' · '+p.location+(p.price?' · '+usd(p.price):'');eStat.textContent='';eStat.className='enq-status';eForm.hidden=false;enq.showModal()}
eForm.addEventListener('submit',async e=>{
 e.preventDefault();
 const fd=new FormData(eForm);
 const body={access_key:KEY,subject:'Property enquiry: '+cur.title+(cur.id?' ('+cur.id+')':''),from_name:'AM International Group website',name:fd.get('name'),email:fd.get('email'),phone:fd.get('phone'),message:fd.get('message')||'(no message)',property:cur.title,reference:cur.id||'',location:cur.location,price:cur.price?usd(cur.price):'',botcheck:fd.get('botcheck')?true:false};
 eBtn.disabled=true;eBtn.textContent='Sending...';
 try{
  const r=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(body)});
  const d=await r.json();
  if(!d.success)throw new Error();
  eForm.reset();eForm.hidden=true;eStat.className='enq-status ok';eStat.textContent='Thank you. We have received your request and will be in touch soon.';
 }catch(err){eStat.className='enq-status bad';eStat.textContent='Sorry, that did not send. Please try again.'}
 eBtn.disabled=false;eBtn.textContent='Send request';
});

/* ── helpers ── */
const STATUS={available:'Available','under-offer':'Under offer',sold:'Sold'};
function fmtDate(d){const x=new Date(d);return isNaN(x)?'':x.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}

/* ── card ── */
function card(p){
 const c=el('article','card');
 if(p.image){
  const i=el('img','p-img');i.src=p.image;i.alt=p.title+' in '+p.location;i.loading='lazy';
  if(p.image_position)i.style.objectPosition=p.image_position;
  const z=el('button','p-zoom');z.type='button';z.setAttribute('aria-label','View full photo: '+p.title);
  z.append(i);z.addEventListener('click',()=>openLB(p));c.append(z);
 }else c.append(el('div','p-img p-noimg'));

 const b=el('div','body');
 b.append(el('span','tag',[p.location,p.type,p.mode==='rent'?'For rent':'For sale'].filter(Boolean).join(' · ')));
 b.append(el('h3',null,p.title));

 /* USD only */
 b.append(el('span','price',p.price?usd(p.price)+(p.mode==='rent'?' / month':''):'Price on request'));

 const f=el('div','facts');
 if(p.bedrooms!=null)f.append(el('span',null,p.bedrooms+' bed'));
 if(p.bathrooms!=null)f.append(el('span',null,p.bathrooms+' bath'));
 if(p.size)f.append(el('span',null,p.size));
 b.append(f);

 if(p.description)b.append(el('p','p-desc',p.description));

 const st=p.status||'available';
 const u=fmtDate(p.updated);
 b.append(el('span','status',(STATUS[st]||'Available')+(u?' · Updated '+u:'')));

 if(st!=='sold'){
  const r=el('button','btn sm','Request details');r.type='button';r.addEventListener('click',()=>openEnq(p));
  const act=el('div','p-actions');act.append(r);b.append(act);
 }
 c.append(b);return c;
}

/* ── filters (USD bands) / draw ── */
function fill(s,vals){[...new Set(vals.filter(Boolean))].sort().forEach(v=>{const o=el('option',null,v);o.value=v;s.append(o)})}
function draw(){
 const l=sel.loc.value,t=sel.type.value;
 const band=sel.price.value.split('-');           /* "min-max" in USD, either side may be empty */
 const min=Number(band[0])||0;
 const max=Number(band[1])||0;
 const list=data.filter(p=>{
   if(l&&p.location!==l)return false;
   if(t&&p.type!==t)return false;
   if(!band.join(''))return true;
   if(p.price==null)return false;
   if(min&&p.price<min)return false;
   if(max&&p.price>max)return false;
   return true;
 });
 grid.replaceChildren(...list.map(card));
 empty.hidden=list.length>0;
}
if(data.length){bar.hidden=false;fill(sel.loc,data.map(p=>p.location));fill(sel.type,data.map(p=>p.type));Object.values(sel).forEach(s=>s.addEventListener('change',draw))}
draw();
})();
