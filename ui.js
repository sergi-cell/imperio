/* IMPERIO — interfaz */
(function(){
'use strict';
const G=window.IMP, f=G.fmt, U=G.util;
const $=s=>document.querySelector(s);
const h=(t,c,x)=>{const e=document.createElement(t); if(c)e.className=c; if(x!==undefined)e.innerHTML=x; return e;};
let S=null, zona='despacho', vista='oficina', neg=null, colaFin=null, colaMis=[];

/* ================= SONIDO (con el desbloqueo de iOS) ================= */
const SND=(function(){
  let ctx=null, ok=false;
  function init(){ if(ctx) return; try{ ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
  function unlock(){ init(); if(!ctx) return; if(ctx.state!=='running') ctx.resume();
    if(ctx.state==='running'&&!ok){ ok=true; const b=ctx.createBuffer(1,1,22050),s=ctx.createBufferSource(); s.buffer=b; s.connect(ctx.destination); s.start(0); } }
  ['touchstart','touchend','mousedown','click','keydown'].forEach(e=>document.addEventListener(e,unlock,{passive:true}));
  function when(fn){ init(); if(!ctx) return; if(ctx.state==='running') fn(ctx); else ctx.resume().then(()=>{ if(ctx.state==='running') fn(ctx); }).catch(()=>{}); }
  function tono(fr,dur,tipo,vol,slide){ when(c=>{
    const o=c.createOscillator(), g=c.createGain(), t=c.currentTime;
    o.type=tipo||'sine'; o.frequency.setValueAtTime(fr,t);
    if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(40,slide),t+dur);
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol||.14,t+.012);
    g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+dur+.02);
  }); }
  function ruido(dur,vol){ when(c=>{
    const n=c.sampleRate*dur, b=c.createBuffer(1,n,c.sampleRate), d=b.getChannelData(0);
    for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2.4);
    const s=c.createBufferSource(), g=c.createGain(), fl=c.createBiquadFilter();
    fl.type='highpass'; fl.frequency.value=900; s.buffer=b; g.gain.value=vol||.09;
    s.connect(fl); fl.connect(g); g.connect(c.destination); s.start();
  }); }
  return {
    tap:()=>tono(520,.05,'square',.05),
    ok:()=>{tono(660,.1,'triangle',.12); setTimeout(()=>tono(990,.16,'triangle',.11),85);},
    mal:()=>tono(190,.3,'sawtooth',.09,90),
    caja:()=>{tono(1180,.07,'square',.07); setTimeout(()=>tono(1560,.14,'square',.06),60); setTimeout(()=>ruido(.14,.05),40);},
    nivel:()=>{[523,659,784,1046].forEach((n,i)=>setTimeout(()=>tono(n,.3,'triangle',.13),i*95));},
    dia:()=>{tono(330,.24,'sine',.09); setTimeout(()=>tono(247,.34,'sine',.08),150);},
    alarma:()=>{tono(300,.16,'square',.1); setTimeout(()=>tono(300,.16,'square',.1),210);}
  };
})();

/* ================= UTILIDADES UI ================= */
function toast(t){ const e=$('#toast'); e.textContent=t; e.classList.add('on'); clearTimeout(e._t); e._t=setTimeout(()=>e.classList.remove('on'),2400); }
function flash(tit,txt,cb,btn){ $('#ftit').textContent=tit; $('#ftxt').textContent=txt; $('#fok').textContent=btn||'Seguir';
  $('#flash').classList.add('on'); $('#fok').onclick=()=>{ $('#flash').classList.remove('on'); if(cb)cb(); }; }
function color(v,inv){ const x=inv?100-v:v; return x>66?'var(--verde)':x>33?'var(--oro)':'var(--rojo)'; }
function barra(v,c){ return `<div class="barra"><i style="width:${U.clamp(v,0,100)}%;background:${c||color(v)}"></i></div>`; }

/* ================= HUD ================= */
function hud(){
  S=G.S;
  $('#s-caja').textContent=(Math.abs(S.caja)>=1e6? (S.caja/1e6).toFixed(2).replace('.',',')+'M' : Math.abs(S.caja)>=1e5? (S.caja/1000).toFixed(0)+'k' : f(S.caja))+' €';
  $('#s-caja').parentNode.className='stat '+(S.caja<0?'rojo':S.caja<G.gastoMensual()?'oro':'oro');
  const rec=G.recurrente();
  $('#s-rec').textContent=(rec>=1e5? (rec/1000).toFixed(0)+'k' : f(rec))+' €';
  $('#s-dia').textContent=S.dia;
  const r=G.rango();
  $('#s-nivlab').textContent='Rango '+r.r;
  $('#s-niv').textContent=S.nivel;
  let p=''; for(let i=0;i<S.energiaMax;i++) p+=`<div class="pila${i<S.energia?' on':''}"></div>`;
  $('#s-pilas').innerHTML=p;
  $('#xpbar i').style.width=(S.xp/G.xpNecesaria(S.nivel)*100)+'%';
  pintarVista(); pintarObjetivo();
}

/* ================= MAPA ================= */
function pintarVista(){
  document.querySelectorAll('#seg button').forEach(b=>{
    const on=b.dataset.v===vista; b.classList.toggle('on',on); b.setAttribute('aria-selected',on?'true':'false');
  });
  $('#oficina').hidden = vista!=='oficina';
  $('#ciudad').hidden  = vista!=='ciudad';
  const t=G.tier();
  $('#segtier').textContent = vista==='oficina' ? t.n : 'Fuera';
  if(vista==='oficina') pintarOficina(); else pintarCiudad();
  guiar();
}
const EN_OFICINA={despacho:1,sala:1,taller:1,equipo:1,objetivos:1};
function guiar(){
  const mi=G.misionActual(), dest=mi&&mi.m.ir;
  document.querySelectorAll('.bt').forEach(b=>b.classList.remove('guia'));
  document.querySelectorAll('#seg button').forEach(b=>b.classList.remove('guia'));
  document.querySelectorAll('.hot,.nodo').forEach(b=>b.classList.remove('guia'));
  if(!dest) return;
  if(dest==='pipeline'||dest==='codex'||dest==='equipo'){
    const b=document.querySelector('[data-ir='+(dest==='equipo'?'equipo':dest)+']'); if(b) b.classList.add('guia');
  }
  if(dest==='cartera'){ const g=document.querySelector('.hot[data-z=taller]'); if(g) g.classList.add('guia'); }
  if(EN_OFICINA[dest]){ const g=document.querySelector('.hot[data-z='+dest+']'); if(g) g.classList.add('guia'); return; }
  const z=G.ZONAS.find(x=>x.id===dest);
  if(z && z.donde==='ciudad'){
    if(vista==='oficina'){ const pu=document.querySelector('.hot[data-z=ciudad]'); if(pu) pu.classList.add('guia');
      const sb=document.querySelector('#seg button[data-v=ciudad]'); if(sb) sb.classList.add('guia'); }
    else { const n=[...document.querySelectorAll('#ciudad .nodo')].find(el=>{
        const b=el.querySelector('button'); return b && b.getAttribute('aria-label').indexOf(z.n)===0; });
      if(n) n.classList.add('guia'); }
  }
}
function pintarOficina(){
  const c=$('#oficina'); c.innerHTML=G.oficinaSVG();
  c.querySelectorAll('.hot').forEach(g=>{
    const z=g.dataset.z;
    const ir=()=>{ SND.tap();
      if(z==='ciudad'){ vista='ciudad'; pintarVista(); return; }
      if(z==='objetivos') return pObjetivos();
      if(z==='equipo') return pEquipo();
      if(z==='taller'){ abrir('Entrega','Los que ya tienes. Retenerlos cuesta una fracción de conseguirlos.',pCartera,'taller'); return chequear(); }
      const zz=G.ZONAS.find(x=>x.id===z); if(zz){ zona=z; abrirZona(zz); }
    };
    g.addEventListener('click',ir);
    g.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); ir(); } });
  });
}
const ICONOS={
 desk:'<path d="M3 8h20M5 8v13M21 8v13M3 14h20"/>',
 road:'<path d="M8 22 11 3M18 22 15 3M13 6v3M13 12v3M13 18v3"/>',
 chair:'<path d="M6 20v-7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v7M9 10V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4M4 20h18"/>',
 gear:'<circle cx="13" cy="13" r="3.4"/><path d="M13 3v3M13 20v3M3 13h3M20 13h3M6 6l2 2M18 18l2 2M20 6l-2 2M8 18l-2 2"/>',
 people:'<circle cx="9" cy="8" r="3"/><circle cx="18" cy="9" r="2.4"/><path d="M3 21c0-3.6 2.7-6 6-6s6 2.4 6 6M16 21c0-2.6 1.4-4.4 3.6-4.4S23 18.4 23 21"/>',
 bank:'<path d="M3 10 13 4l10 6M5 10v9M11 10v9M15 10v9M21 10v9M2 21h22"/>',
 stamp:'<path d="M9 3h8v6l2 4H7l2-4zM4 17h18v4H4zM4 17c0-1.6 1.3-2.4 3-2.4h12c1.7 0 3 .8 3 2.4"/>',
 ship:'<path d="M4 17h18l-2 5H6zM13 4v9M6 13h14M9 8h8"/>',
 crown:'<path d="M3 8l3.5 10h13L23 8l-5 4-5-7-5 7z"/>'
};
function pintarCiudad(){
  const w=$('#mapwrap'), zonas=G.ZONAS.filter(z=>z.donde==='ciudad');
  w.querySelectorAll('.nodo').forEach(n=>n.remove());
  const svg=$('#rutas'); svg.innerHTML='';
  let sk='';
  for(let x=0;x<100;x+=5){ const bh=6+Math.abs(Math.sin(x*0.8))*13;
    sk+=`<rect x="${x}" y="${100-bh}" width="4.2" height="${bh}" fill="#121926"/>`; }
  svg.insertAdjacentHTML('beforeend', sk);
  for(let i=1;i<zonas.length;i++){ const a=zonas[i-1], b=zonas[i], vis=S.nivel>=b.nivel;
    svg.insertAdjacentHTML('beforeend',
      `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${vis?'#2E3A50':'#1A2130'}" stroke-width=".4" stroke-dasharray="1.6 1.6" vector-effect="non-scaling-stroke"/>`);
  }
  zonas.forEach(z=>{
    const abierta=S.nivel>=z.nivel;
    const n=h('div','nodo'+(zona===z.id?' aqui':'')+(abierta?'':' cerrada'));
    n.style.left=z.x+'%'; n.style.top=z.y+'%';
    const b=h('button'); b.disabled=!abierta;
    b.innerHTML=`<svg viewBox="0 0 26 26" aria-hidden="true">${ICONOS[z.ic]}</svg>`;
    b.setAttribute('aria-label',z.n+(abierta?'':' — bloqueado, nivel '+z.nivel));
    b.onclick=()=>{ SND.tap(); zona=z.id; $('#ficha').style.left=z.x+'%'; $('#ficha').style.top=z.y+'%';
      document.querySelectorAll('.nodo').forEach(x=>x.classList.remove('aqui')); n.classList.add('aqui');
      setTimeout(()=>abrirZona(z),200); };
    n.appendChild(b);
    n.appendChild(h('em',null, z.n + (abierta?'':'<i>Nivel '+z.nivel+'</i>')));
    if(z.id==='calle' && !S.leads.filter(l=>l.estado!=='frio').length)
      n.insertAdjacentHTML('beforeend','<span class="badge oro">!</span>');
    if(z.id==='talento' && S.flags.candidatoTop) n.insertAdjacentHTML('beforeend','<span class="badge oro">!</span>');
    w.appendChild(n);
  });
  const zz=zonas.find(z=>z.id===zona)||zonas[0];
  const fi=$('#ficha'); fi.style.left=zz.x+'%'; fi.style.top=zz.y+'%';
}

/* ================= OBJETIVOS Y MISIONES ================= */
function pintarObjetivo(){
  const mi=G.misionActual(), e=$('#objetivo');
  if(!mi){ $('#ob-eti').textContent='Todo hecho'; $('#ob-tit').textContent='No queda ningún objetivo'; $('#ob-pista').textContent='Sigue jugando: la dificultad no para.'; return; }
  $('#ob-eti').textContent = mi.tipo==='tutorial' ? `Paso ${mi.i} de ${mi.n}` : `Objetivo ${mi.i} de ${mi.n}`;
  $('#ob-tit').textContent = mi.m.t;
  $('#ob-pista').textContent = mi.m.pista || mi.m.d;
  e.classList.toggle('listo', mi.tipo!=='tutorial');
}
function chequear(){
  const hechas=G.revisarMisiones();
  if(hechas.length) colaMis=colaMis.concat(hechas);
  hud();
  if(colaMis.length) verMision();
}
function verMision(){
  const x=colaMis.shift(); if(!x) return;
  SND.nivel();
  const eraTut=x.tipo==='tutorial';
  flash(eraTut?'PASO SUPERADO':'OBJETIVO CUMPLIDO', x.m.hecho || x.m.d, ()=>{
    if(colaMis.length) return verMision();
    if(S.puntos>0){ flash('NIVEL '+S.nivel, 'Rango '+G.rango().r+' — '+G.rango().n+'. Tienes '+S.puntos+' punto(s) para repartir en tu mesa.', ()=>hud()); }
    else hud();
  }, '+'+(x.m.xp||0)+' XP');
}
function pObjetivos(){
  abrir('Objetivos','Los pasos van en orden. Los objetivos se cumplen cuando toque.', w=>{
    const pend=G.TUTORIAL.filter(m=>!S.misiones[m.id]);
    if(pend.length){
      w.appendChild(h('div','tit','Primeros pasos · '+(G.TUTORIAL.length-pend.length)+'/'+G.TUTORIAL.length));
      G.TUTORIAL.forEach(m=>{
        const ok=!!S.misiones[m.id], act=pend[0]&&pend[0].id===m.id;
        if(!ok && !act) return;
        w.insertAdjacentHTML('beforeend',
          `<div class="card${act?' acc':''}" style="${ok?'opacity:.55':''}">
            <h3>${ok?'✓ ':''}${m.t}</h3><p>${ok? m.hecho : m.d}</p>
            ${act? `<span class="eti oro">Ahora</span><span class="eti">${m.pista}</span>`:`<span class="eti verde">Hecho el día ${S.misiones[m.id]}</span>`}</div>`);
      });
      if(pend.length>1) w.insertAdjacentHTML('beforeend',
        `<p class="tell">Quedan ${pend.length-1} pasos más. Van saliendo de uno en uno.</p>`);
    }
    const hechos=G.OBJETIVOS.filter(o=>S.objetivos[o.id]);
    w.appendChild(h('div','tit','Objetivos largos · '+hechos.length+'/'+G.OBJETIVOS.length));
    G.OBJETIVOS.forEach(o=>{
      const ok=!!S.objetivos[o.id];
      w.insertAdjacentHTML('beforeend',
        `<div class="kv"><span style="color:${ok?'var(--verde)':'var(--mut)'}">${ok?'✓':'○'} ${o.t}</span>
         <b style="font-family:var(--body);font-weight:400;font-size:12.5px;color:var(--dim);text-align:right">${ok?'día '+S.objetivos[o.id]:o.d}</b></div>`);
    });
  });
}

/* ================= PANEL ================= */
function abrir(tit,sub,render,claveZona){
  $('#ptit').textContent=tit; $('#psub').textContent=sub||'';
  const w=$('#pwrap'); w.innerHTML='';
  if(claveZona && G.PRIMERA[claveZona] && !S.flags['visto_'+claveZona]){
    const e=G.PRIMERA[claveZona];
    w.insertAdjacentHTML('beforeend',
      `<div class="primera"><b>Cómo funciona esto</b><h4>${e.t}</h4><p>${e.d}</p></div>`);
  }
  if(claveZona && !S.flags['visto_'+claveZona]){ S.flags['visto_'+claveZona]=S.dia; G.guardar(); }
  render(w);
  $('#panel').classList.add('on'); $('#pbody').scrollTop=0;
}
function cerrar(){ $('#panel').classList.remove('on'); neg=null; hud(); }
$('#pcerrar').onclick=()=>{ SND.tap(); if(neg && confirm('Si te vas ahora pierdes la conversación. ¿Seguro?')){ G.S.pend=null; cerrar(); } else if(!neg) cerrar(); };

function abrirZona(z){
  const m={despacho:pDespacho, calle:pCalle, sala:pSala, taller:pCartera, talento:pTalento,
           banco:pBanco, hacienda:pHacienda, puerto:pPuerto, cumbre:pCumbre, equipo:()=>pEquipo()};
  if(z.id==='equipo') return pEquipo();
  abrir(z.n, z.desc, m[z.id], z.id);
  chequear();
}

/* ================= DESPACHO ================= */
function pDespacho(w){
  const rec=G.recurrente(), gas=G.gastoMensual(), ben=G.beneficio(), run=G.runway();
  const cap=G.capacidad(), car=G.carga();
  w.appendChild(h('div','tit','Cómo vas'));
  const c=h('div','card');
  c.innerHTML=`
   <div class="kv"><span>Entra al mes</span><b style="color:var(--verde)">${f(rec)} €</b></div>
   <div class="kv"><span>Margen sobre eso</span><b>${Math.round(S.margen*100)}% · ${f(rec*S.margen)} €</b></div>
   <div class="kv"><span>Sale al mes</span><b style="color:var(--rojo)">−${f(gas)} €</b></div>
   <div class="kv"><span>Resultado</span><b style="color:${ben>=0?'var(--verde)':'var(--rojo)'}">${ben>=0?'+':'−'}${f(Math.abs(ben))} €</b></div>
   <div class="kv"><span>Punto muerto</span><b>${f(gas/S.margen)} €/mes</b></div>
   <div class="kv"><span>Meses de aire</span><b style="color:${run===Infinity?'var(--verde)':run<3?'var(--rojo)':'var(--oro)'}">${run===Infinity?'sin fuga':String(run).replace('.',',')+' meses'}</b></div>
   <div class="kv"><span>Deuda</span><b>${f(S.deuda)} €${S.linea.limite?' · línea '+f(S.linea.limite-S.linea.usado)+' € libre':''}</b></div>
   <div class="kv"><span>IVA acumulado (no es tuyo)</span><b style="color:var(--oro)">${f(S.ivaAcum)} €</b></div>`;
  w.appendChild(c);

  w.appendChild(h('div','tit','Capacidad de entrega'));
  const cc=h('div','card');
  const r=car/Math.max(cap,1);
  cc.innerHTML=`<div class="kv"><span>Puedes atender</span><b>${f(cap)} €/mes</b></div>
   <div class="kv"><span>Tienes contratado</span><b style="color:${r>1?'var(--rojo)':'var(--verde)'}">${f(car)} €/mes</b></div>
   ${barra(r*100/1.5, r>1?'var(--rojo)':r>0.8?'var(--oro)':'var(--verde)')}
   <p style="margin:8px 0 0">${r>1.15?'Estás vendiendo más de lo que puedes entregar. Los clientes lo notan antes que tú.':r>0.85?'Al límite. El siguiente cliente hay que poder atenderlo.':'Te sobra capacidad: o vendes más o te sobra gente.'}</p>`;
  w.appendChild(cc);

  w.appendChild(h('div','tit','Tú'));
  const a=h('div','card');
  a.innerHTML=`<h3>${G.rango().r} · ${G.rango().n}</h3><p>${G.rango().desc}</p>`+
   Object.entries(S.attrs).map(([k,v])=>`<div class="kv"><span>${k[0].toUpperCase()+k.slice(1)}</span><b>${v}/10</b></div>${barra(v*10,'var(--violeta)')}`).join('');
  if(S.puntos>0){
    a.insertAdjacentHTML('beforeend',`<p style="color:var(--oro);margin-top:12px">Tienes ${S.puntos} punto(s) por repartir.</p>`);
    Object.keys(S.attrs).forEach(k=>{
      const b=h('button','op',`Subir ${k} → ${S.attrs[k]+1}`);
      b.disabled=S.attrs[k]>=10;
      b.onclick=()=>{ S.attrs[k]++; S.puntos--; SND.ok(); G.guardar(); abrirZona(G.ZONAS[0]); };
      a.appendChild(b);
    });
  }
  w.appendChild(a);

  w.appendChild(h('div','tit','Diario'));
  if(!S.diario.length) w.appendChild(h('div','vacio','Todavía no ha pasado nada.'));
  S.diario.slice(0,16).forEach(l=>{
    const col=l.k==='ok'?'var(--verde)':l.k==='bad'?'var(--rojo)':l.k==='warn'?'var(--oro)':'var(--dim)';
    w.insertAdjacentHTML('beforeend',`<div class="kv"><span style="color:${col};font-family:var(--mono);font-size:11px">D${l.d}</span><b style="font-family:var(--body);font-weight:400;font-size:13px;text-align:right;color:var(--mut)">${l.t}</b></div>`);
  });
}

/* ================= LA CALLE (prospección) ================= */
function pCalle(w){
  w.insertAdjacentHTML('beforeend',`<p style="color:var(--mut);font-size:13.5px;margin:0 0 16px">De cada 100 impactos salen unas 20 respuestas, 8 reuniones y 2 clientes. No es que lo hagas mal: es la tasa. El error es medir el resultado de diez intentos.</p>`);
  G.CANALES.forEach(c=>{
    const no=G.canalDisponible(c), coste=G.costeCanal(c);
    const b=h('button','op'+(no?' bloq':''));
    b.innerHTML=`<b>${c.n}</b><br><span style="color:var(--mut);font-size:13px">${c.desc}</span>
      <small>${c.energia} energía · ${coste?f(coste)+' €':'gratis'} · ${Math.round(c.rech*100)}% de rechazo · calidad ${c.cal[0]}-${c.cal[1]}${no?' · '+no:''}</small>`;
    b.disabled=!!no;
    b.onclick=()=>{
      const r=G.prospectar(c.id);
      if(r.err) return toast(r.err);
      r.n?SND.ok():SND.mal();
      abrir('Resultado', c.n, x=>{
        x.insertAdjacentHTML('beforeend',
          `<div class="feed${r.n?'':' mal'}"><b>${r.n?'Han salido cosas':'Nada'}</b>
           <p><b class="num">${r.rechazos}</b> noes y <b class="num">${r.n}</b> contacto${r.n===1?'':'s'} nuevo${r.n===1?'':'s'}.
           ${r.coste?'Te ha costado '+f(r.coste)+' €.':''}</p></div>`);
        r.nuevos.forEach(l=>x.insertAdjacentHTML('beforeend',
          `<div class="card"><h3>${l.empresa}</h3><p>${l.contacto}, ${l.cargo} · ${l.secN}</p>
           <span class="eti">Calidad ${l.q}</span><span class="eti oro">~${f(l.ticket)} €/mes</span></div>`));
        if(r.cpt) x.insertAdjacentHTML('beforeend', conceptoHTML(r.cpt));
        const v=h('button','big','Volver'); v.onclick=()=>{ hud(); pCalle($('#pwrap')); $('#ptit').textContent='La calle'; }; x.appendChild(v);
      });
      chequear();
    };
    w.appendChild(b);
  });
}

/* ================= PIPELINE / SALA ================= */
function pSala(w){ pipeline(w,true); }
function pPipeline(){ abrir('Pipeline','Todo lo que tienes abierto. Ponderado, no sumado.', w=>pipeline(w,false), 'pipeline'); chequear(); }
function pipeline(w, soloCalientes){
  const cal=S.leads.filter(l=>l.estado!=='frio'), frios=S.leads.filter(l=>l.estado==='frio');
  const pond=cal.reduce((a,l)=>a+l.ticket*(l.q/160),0);
  w.insertAdjacentHTML('beforeend',
    `<div class="card"><div class="kv"><span>Abiertos</span><b>${cal.length}</b></div>
     <div class="kv"><span>Suma bruta</span><b>${f(cal.reduce((a,l)=>a+l.ticket,0))} €/mes</b></div>
     <div class="kv"><span>Previsión ponderada</span><b style="color:var(--oro)">${f(pond)} €/mes</b></div>
     <div class="kv"><span>Enfriados</span><b>${frios.length}</b></div></div>`);
  w.appendChild(h('div','tit','Vivos'));
  if(!cal.length) w.appendChild(h('div','vacio','No tienes nada abierto. Vete a la calle.'));
  cal.sort((a,b)=>b.q-a.q).forEach(l=>w.appendChild(tarjetaLead(l,true)));
  if(frios.length){
    w.appendChild(h('div','tit','Enfriados — aquí está el dinero que ya te has ganado'));
    w.insertAdjacentHTML('beforeend','<p style="color:var(--dim);font-size:12.5px;margin:-4px 0 10px">La mayoría de las ventas se cierran entre el quinto y el duodécimo contacto. La mayoría de la gente lo deja en el segundo.</p>');
    frios.sort((a,b)=>b.toques-a.toques).forEach(l=>w.appendChild(tarjetaLead(l,false)));
  }
}
function tarjetaLead(l, vivo){
  const c=h('div','card'+(vivo?' acc':''));
  const arq=G.ARQUETIPOS.find(a=>a.id===l.arq);
  c.innerHTML=`<h3>${l.empresa}</h3><p>${l.contacto}, ${l.cargo} · ${l.secN}</p>
    <span class="eti">Calidad ${l.q}</span><span class="eti oro">~${f(l.ticket)} €/mes</span>
    <span class="eti ${l.toques>=5?'verde':''}">Toque ${l.toques}</span>
    ${l.toques>=2?'<span class="eti vio">'+arq.n+'</span>':''}`;
  const b=h('button','op', vivo? '<b>Llamar y trabajarlo</b><small>1 energía · conversación completa</small>'
    : `<b>Hacer seguimiento</b><small>1 energía · toque nº ${l.toques+1}${l.toques>=4?' · estás en la franja buena':''}</small>`);
  b.disabled=S.energia<1;
  b.onclick=()=>{
    if(vivo){ const n=G.abrirNeg(l.id); if(n&&n.err) return toast(n.err); neg=n; SND.tap(); pintarNeg(); }
    else{ const r=G.seguir(l.id); if(r.err) return toast(r.err);
      r.reabre?SND.ok():SND.mal();
      toast(r.reabre? '¡Responde! Toque nº '+r.t : 'Nada. Toque nº '+r.t+' ('+Math.round(r.p*100)+'% de probabilidad)');
      if(r.cpt) setTimeout(()=>abrir('Has aprendido algo','', x=>{ x.insertAdjacentHTML('beforeend',conceptoHTML(r.cpt));
        const v=h('button','big','Seguir'); v.onclick=()=>{hud(); pPipeline();}; x.appendChild(v); }),400);
      else { chequear(); pipeline($('#pwrap'), false); } }
  };
  c.appendChild(b);
  return c;
}

/* ================= NEGOCIACIÓN ================= */
function pintarNeg(fb){
  const lead=S.leads.find(l=>l.id===neg.leadId);
  const arq=G.ARQUETIPOS.find(a=>a.id===neg.arq);
  abrir(lead.empresa, `${lead.contacto} · ${lead.cargo} · ${lead.secN}`, w=>{
    w.insertAdjacentHTML('beforeend',`<div class="medidores">
      <div class="med"><b>Interés</b><s style="color:${color(neg.interes)}">${Math.round(neg.interes)}</s>${barra(neg.interes)}</div>
      <div class="med"><b>Confianza</b><s style="color:${color(neg.confianza)}">${Math.round(neg.confianza)}</s>${barra(neg.confianza)}</div>
      <div class="med"><b>Paciencia</b><s style="color:${neg.paciencia<=2?'var(--rojo)':'var(--tx)'}">${neg.paciencia}</s></div></div>`);

    if(neg.hist.length>=2) w.insertAdjacentHTML('beforeend',`<p class="tell" style="margin:-8px 0 12px">Te huele a <b style="color:var(--violeta)">${arq.n.toLowerCase()}</b>. ${arq.desc}</p>`);

    if(fb){
      w.insertAdjacentHTML('beforeend',
        `<div class="feed${(fb.i||0)+(fb.c||0)<0?' mal':''}"><b>${fb.tit||'Lo que ha pasado'}</b><p>${fb.fb}</p>
         ${fb.delta||''}</div>`);
      (fb.extra||[]).forEach(e=>w.insertAdjacentHTML('beforeend',`<p class="tell">${e}</p>`));
      if(fb.revelado) w.insertAdjacentHTML('beforeend',
        `<div class="card acc"><span class="eti oro">Ahora sabes</span><p style="margin:8px 0 0;color:var(--tx)">${textoRevelado(fb.revelado)}</p></div>`);
      if(fb.cpt) w.insertAdjacentHTML('beforeend', conceptoHTML(fb.cpt));
    }

    const ctx=G.opciones(neg);
    if(Object.keys(neg.reveal).length){
      w.insertAdjacentHTML('beforeend','<div class="tit">Lo que has averiguado</div>');
      const c=h('div','card');
      Object.keys(neg.reveal).forEach(k=>c.insertAdjacentHTML('beforeend',
        `<div class="kv"><span>${etiq(k)}</span><b>${valorRev(k,neg.reveal[k])}</b></div>`));
      if(neg.fase!=='apertura'&&neg.fase!=='descubrimiento') c.insertAdjacentHTML('beforeend',
        `<div class="kv"><span>Tu precio</span><b style="color:var(--oro)">${f(neg.precio)} €/mes</b></div>`);
      w.appendChild(c);
    }

    w.insertAdjacentHTML('beforeend','<div class="tit">'+
      ({apertura:'Cómo abres',pregunta:'Descubrimiento',precio:'El número',objecion:'Te pone una pega',cierre:'El cierre'}[ctx.tipo])+'</div>');
    if(ctx.tipo==='objecion'){
      w.insertAdjacentHTML('beforeend',`<div class="dialogo">${ctx.txt}</div><p class="tell">${ctx.tell}</p>`);
      const m=G.nivelMaestria(ctx.obj.id);
      if(m) w.insertAdjacentHTML('beforeend',`<p class="tell" style="margin-top:-8px"><span class="eti verde">Dominio ${'★'.repeat(m)}${'☆'.repeat(5-m)}</span></p>`);
    } else if(ctx.txt) w.insertAdjacentHTML('beforeend',`<div class="dialogo">${ctx.txt}</div>`);

    ctx.ops.forEach(o=>{
      const b=h('button','op', o.t.replace(/\{(\w+)\}/g,(m,k)=>G.interpolar('{'+k+'}',lead,neg)));
      b.onclick=()=>{
        const r=G.jugar(neg, o.id||o.t);
        const di=neg.hist[neg.hist.length-1];
        r.delta=`<div class="delta"><i class="${di.i>=0?'up':'down'}">Interés ${di.i>=0?'+':''}${Math.round(di.i)}</i>
                 <i class="${di.c>=0?'up':'down'}">Confianza ${di.c>=0?'+':''}${Math.round(di.c)}</i></div>`;
        r.i=di.i; r.c=di.c;
        (di.i+di.c)>=2?SND.ok():SND.mal();
        if(r.fin) return finNeg(r, lead);
        hud(); pintarNeg(r);
      };
      w.appendChild(b);
    });
    (ctx.bloq||[]).forEach(b2=>{
      const b=h('button','op bloq', b2.t+`<small>Bloqueado: ${b2.why}</small>`); b.disabled=true; w.appendChild(b);
    });
    if(ctx.puedePasar){
      const b=h('button','op','<b>Dejar de preguntar y pasar al precio</b><small>Cuanto más sepas, más fácil será defenderlo. Pero la paciencia se acaba.</small>');
      b.onclick=()=>{ neg.fase='propuesta'; SND.tap(); pintarNeg(); };
      w.appendChild(b);
    }
  });
}
function etiq(k){return {dolor:'Su problema',coste:'Le cuesta al mes',presupuesto:'Su presupuesto',decisor:'¿Decide él?',
  urgencia:'Urgencia',alternativa:'Alternativa',riesgo:'Lo que le preocupa',proceso:'Cómo se decide'}[k]||k;}
function valorRev(k,v){
  if(k==='coste'||k==='presupuesto') return f(v)+' €';
  if(k==='decisor') return v?'Sí':'NO — hay alguien más';
  if(k==='dolor'||k==='urgencia'||k==='riesgo') return Math.round(v)+'/100';
  if(k==='alternativa') return {ninguna:'Ninguna, siguen igual',proveedor:'Ya tienen proveedor',interno:'Lo hacen ellos'}[v];
  return v;
}
function textoRevelado(r){
  const t={dolor:'Le duele '+Math.round(r.v)+' sobre 100.',
    coste:'El problema le cuesta '+f(r.v)+' € al mes. Ese es el número contra el que se compara tu precio.',
    presupuesto:'Tiene en la cabeza unos '+f(r.v)+' €. Pasarte mucho de ahí es tirar la conversación.',
    decisor: r.v?'Firma él. No hace falta nadie más.':'NO decide él. Si cierras aquí, tu propuesta la defenderá alguien que no sabe defenderla.',
    urgencia:'Urgencia '+Math.round(r.v)+'/100.'+(r.v<35?' Sin urgencia no hay venta, hay una conversación agradable.':''),
    alternativa:{ninguna:'No compites contra nadie: compites contra que sigan igual.',proveedor:'Ya trabajan con otro. No cambian el día que se lo propones: cambian el día que el otro la lía.',interno:'Lo hacen ellos por dentro. Tu enemigo es el orgullo, no el precio.'}[r.v],
    riesgo:'Riesgo percibido '+Math.round(r.v)+'/100.'+(r.v>60?' No duda de que funcione: duda de quedar mal si no funciona.':''),
    proceso:'Después de decir que sí: '+r.v+'.'};
  return t[r.k];
}
function finNeg(r, lead){
  const gan=r.fin==='ganada';
  gan?SND.caja():SND.mal();
  abrir(gan?'CERRADO':(r.fin==='frio'?'Se enfría':'Perdido'), lead.empresa, w=>{
    w.insertAdjacentHTML('beforeend',
      `<div class="feed${gan?'':' mal'}"><b>${gan?'Ha entrado':'No ha entrado'}</b><p>${r.fb}</p>
       ${r.score!==undefined?`<div class="delta"><i>Tu puntuación ${r.score} · hacía falta ${r.umbral}</i></div>`:''}</div>`);
    if(r.aviso) w.insertAdjacentHTML('beforeend',`<div class="card acc"><span class="eti oro">Lo importante</span><p style="margin:8px 0 0;color:var(--tx)">${r.aviso}</p></div>`);
    if(gan) w.insertAdjacentHTML('beforeend',
      `<div class="card"><h3>${r.cliente.empresa}</h3>
       <div class="kv"><span>Entra al mes</span><b style="color:var(--verde)">${f(r.cliente.mensual)} €</b></div>
       <div class="kv"><span>Te paga a</span><b>${r.cliente.plazo} días</b></div>
       <div class="kv"><span>Satisfacción inicial</span><b style="color:${color(r.cliente.satisf)}">${Math.round(r.cliente.satisf)}</b></div>
       <div class="kv"><span>Contrato</span><b>${Math.round(r.cliente.meses)} meses</b></div></div>`);
    if(r.cpt) w.insertAdjacentHTML('beforeend', conceptoHTML(r.cpt));
    if(!gan) w.insertAdjacentHTML('beforeend',
      `<p class="tell">${r.fin==='frio'?'Sigue en el pipeline como enfriado. El seguimiento es donde está el dinero que ya te has ganado.':'También queda en enfriados. Un perdido de hoy es un cliente dentro de seis meses si le haces seguimiento.'}</p>`);
    const b=h('button','big','Seguir'); b.onclick=()=>{ neg=null; chequear(); pPipeline(); }; w.appendChild(b);
  });
  neg=null; G.guardar();
}
function conceptoHTML(c){
  return `<div class="concepto"><b>Concepto desbloqueado · ${c.a}</b><h4>${c.n}</h4><p>${c.d}</p>${c.f?'<code>'+c.f+'</code>':''}</div>`;
}

/* ================= CARTERA ================= */
function pCartera(w){
  const cap=G.capacidad(), car=G.carga(), r=car/Math.max(cap,1);
  w.insertAdjacentHTML('beforeend',
    `<div class="card"><div class="kv"><span>Clientes</span><b>${S.clientes.length}</b></div>
     <div class="kv"><span>Recurrente</span><b style="color:var(--verde)">${f(G.recurrente())} €/mes</b></div>
     <div class="kv"><span>Capacidad usada</span><b style="color:${r>1?'var(--rojo)':'var(--verde)'}">${Math.round(r*100)}%</b></div>
     ${barra(r*100/1.5,r>1?'var(--rojo)':'var(--verde)')}
     <div class="kv"><span>Perdidos hasta hoy</span><b>${S.perdidos.length}</b></div></div>`);
  if(S.clientes.length){
    const top=S.clientes.slice().sort((a,b)=>b.mensual-a.mensual)[0];
    const peso=top.mensual/Math.max(G.recurrente(),1);
    if(peso>0.3) w.insertAdjacentHTML('beforeend',
      `<div class="feed mal"><b>Concentración</b><p><b>${top.empresa}</b> es el ${Math.round(peso*100)}% de lo que entra. Eso no es un cliente: es un jefe. Y no lo notas hasta que te pide algo que no quieres hacer.</p></div>`);
  }
  w.appendChild(h('div','tit','Tus clientes'));
  if(!S.clientes.length) w.appendChild(h('div','vacio','Ninguno. Ese es el problema.'));
  S.clientes.slice().sort((a,b)=>a.satisf-b.satisf).forEach(c=>{
    const el=h('div','card'+(c.satisf<45?' acc':''));
    el.innerHTML=`<h3>${c.empresa}</h3><p>${c.secN} · desde el día ${c.alta}</p>
      <div class="kv"><span>Al mes</span><b style="color:var(--verde)">${f(c.mensual)} €</b></div>
      <div class="kv"><span>Satisfacción</span><b style="color:${color(c.satisf)}">${Math.round(c.satisf)}</b></div>
      ${barra(c.satisf)}
      <div class="kv"><span>Contrato</span><b>${Math.max(0,Math.round(c.meses))} meses</b></div>
      <div class="kv"><span>Te paga a</span><b>${c.plazo} días</b></div>
      ${c.satisf<45?'<p style="color:var(--rojo);margin:8px 0 0">Se va a ir. Y cuando se vaya, te enterarás por un correo de dos líneas.</p>':''}`;
    if(c.satisf<70){
      const b=h('button','op','<b>Dedicarle un día</b><small>1 energía · +18 de satisfacción</small>');
      b.disabled=S.energia<1;
      b.onclick=()=>{ S.energia--; c.satisf=U.clamp(c.satisf+18,0,100); G.xp(10); SND.ok();
        G.log('Atiendes a '+c.empresa+'.'); G.guardar(); chequear(); abrir('Cartera','',pCartera); };
      el.appendChild(b);
    }
    w.appendChild(el);
  });
}

/* ================= EQUIPO ================= */
function pEquipo(){
  abrir('Equipo','Cada uno produce un número al mes. Si su coste es mayor, estás pagando por perder dinero.', w=>{
    w.insertAdjacentHTML('beforeend',
      `<div class="card"><div class="kv"><span>Personas</span><b>${S.equipo.length}</b></div>
       <div class="kv"><span>Coste total</span><b style="color:var(--rojo)">${f(S.equipo.reduce((a,e)=>a+G.costeEmpleado(e),0))} €/mes</b></div>
       <div class="kv"><span>Producción total</span><b style="color:var(--verde)">${f(S.equipo.reduce((a,e)=>a+G.output(e),0))} €/mes</b></div>
       <div class="kv"><span>Moral del equipo</span><b style="color:${color(S.moral)}">${Math.round(S.moral)}</b></div>${barra(S.moral)}</div>`);
    if(!S.equipo.length) w.appendChild(h('div','vacio','Estás tú solo. Si paras tú, para todo.'));
    S.equipo.forEach(e=>{
      const out=G.output(e), cos=G.costeEmpleado(e), neto=out-cos;
      const r=G.RASGOS.find(x=>x.id===e.rasgo);
      const el=h('div','card'+(neto<0?' acc':''));
      el.innerHTML=`<h3>${e.nombre}</h3><p>${e.perfil} · ${G.ROLES[e.rol].n} · desde el día ${e.alta}</p>
        <div class="kv"><span>Produce</span><b style="color:var(--verde)">${f(out)} €/mes</b></div>
        <div class="kv"><span>Te cuesta</span><b style="color:var(--rojo)">${f(cos)} €/mes</b></div>
        <div class="kv"><span>Neto</span><b style="color:${neto>=0?'var(--verde)':'var(--rojo)'}">${neto>=0?'+':'−'}${f(Math.abs(neto))} €</b></div>
        <div class="kv"><span>Moral</span><b style="color:${color(e.moral)}">${Math.round(e.moral)}</b></div>${barra(e.moral)}
        <div style="margin-top:9px">${Object.entries(e.st).map(([k,v])=>`<span class="eti">${k} ${v}</span>`).join('')}</div>
        <div style="margin-top:8px">${e.visto? `<span class="eti ${r.bueno===true?'verde':r.bueno===false?'rojo':'vio'}">${r.n}</span> <span style="font-size:12.5px;color:var(--mut)">${r.desc}</span>`
          : `<span class="eti">Aún no sabes cómo es · faltan ${Math.max(0,r.dias-(S.dia-e.alta))} días</span>`}</div>
        <div class="kv" style="margin-top:8px"><span>Indemnización si le echas</span><b>${f(G.indemnizacion(e))} €</b></div>`;
      const f1=h('button','op','<b>Formarle</b><small>1 energía · '+f(420+(e.bruto||1200)*0.25)+' € · +1 a una habilidad y +6 de moral</small>');
      f1.disabled=S.energia<1; f1.onclick=()=>{ const r2=G.formar(e.id); if(r2.err) return toast(r2.err); SND.ok(); toast('+1 en '+r2.k); chequear(); pEquipo(); };
      el.appendChild(f1);
      const f2=h('button','op','<b>Subirle un 10%</b><small>Sube la moral. Si el problema no era el dinero, compras tiempo, no lealtad.</small>');
      f2.onclick=()=>{ G.subirSueldo(e.id,0.10); SND.tap(); G.guardar(); hud(); pEquipo(); };
      el.appendChild(f2);
      const f3=h('button','op','<b>Despedirle</b><small>'+f(G.indemnizacion(e))+' € de indemnización · golpe a la moral del resto</small>');
      f3.onclick=()=>{ if(!confirm('¿Despedir a '+e.nombre+'? Indemnización '+f(G.indemnizacion(e))+' €.')) return;
        const r2=G.despedir(e.id); if(r2.err) return toast(r2.err); SND.mal();
        abrir('Despido', e.nombre, x=>{
          x.insertAdjacentHTML('beforeend',`<div class="feed mal"><b>Hecho</b><p>Indemnización ${f(r2.ind)} €.${r2.roba?' Se lleva '+r2.roba+' cliente(s) con él.':''}${r2.juicio?' Y te ha demandado: pagas un 80% más.':''}</p></div>`);
          x.insertAdjacentHTML('beforeend',conceptoHTML(G.CONCEPTS.find(c=>c.id==='despedir-tarde')));
          const b=h('button','big','Seguir'); b.onclick=()=>{chequear(); pEquipo();}; x.appendChild(b); });
      };
      el.appendChild(f3);
      w.appendChild(el);
    });
  }, 'equipo');
  chequear();
}

/* ================= TALENTO ================= */
let cacheCand=null, cacheDia=-1;
function pTalento(w){
  if(cacheDia!==S.dia){ cacheCand=G.candidatos(4); cacheDia=S.dia; }
  w.insertAdjacentHTML('beforeend','<p style="color:var(--mut);font-size:13.5px;margin:0 0 16px">La ficha nunca dice lo importante. Cada persona esconde un rasgo que solo vas a descubrir conviviendo con ella. El coste real es el bruto por 1,32.</p>');
  cacheCand.forEach(c=>{
    const el=h('div','card');
    el.innerHTML=`<h3>${c.nombre}</h3><p>${c.perfil} · ${G.ROLES[c.rol].n}</p>
      <p style="color:var(--dim)">${c.desc}</p>
      <div style="margin:8px 0">${Object.entries(c.st).map(([k,v])=>`<span class="eti">${k} ${v}</span>`).join('')}</div>
      <div class="kv"><span>Bruto</span><b>${c.bruto?f(c.bruto)+' €/mes':(c.porHora?f(c.porHora)+' €/hora':'solo comisión '+Math.round(c.comision*100)+'%')}</b></div>
      <div class="kv"><span>Coste real para ti</span><b style="color:var(--rojo)">${f(c.coste||(c.porHora?c.porHora*80:0))} €/mes</b></div>
      <div class="kv"><span>Alta y selección</span><b>${f((c.bruto||0)*0.6+280)} €</b></div>`;
    const b=h('button','op','<b>Contratar</b><small>El rasgo oculto lo descubrirás jugando</small>');
    b.onclick=()=>{ const r=G.contratar(c); if(r.err) return toast(r.err); SND.ok();
      cacheCand=cacheCand.filter(x=>x.id!==c.id); chequear(); abrir('Mercado de talento','',pTalento); };
    el.appendChild(b);
    w.appendChild(el);
  });
}

/* ================= BANCO ================= */
function pBanco(w){
  const rat=G.rating();
  w.insertAdjacentHTML('beforeend',
    `<div class="card"><h3>Tu rating: ${rat}/100</h3>
     ${barra(rat)}
     <p style="margin-top:8px">${rat>=70?'Te dan lo que pidas. Justo ahora que no lo necesitas: así funciona.':rat>=42?'Te van a dar, pero caro.':'Con estos números no te dan nada. El banco presta paraguas cuando no llueve.'}</p>
     <div class="kv"><span>Meses de aire</span><b>${G.runway()===Infinity?'sin fuga':G.runway()+' meses'}</b></div>
     <div class="kv"><span>Deuda actual</span><b>${f(S.deuda)} €</b></div>
     <div class="kv"><span>Cuotas al mes</span><b>${f(S.prestamos.reduce((a,p)=>a+p.cuota,0))} €</b></div></div>`);
  G.BANCO.forEach(p=>{
    const of=G.ofertaBanco(p);
    const el=h('div','card');
    el.innerHTML=`<h3>${p.n}</h3><p>${p.desc}</p>
      ${of.ok? `<div class="kv"><span>Máximo</span><b style="color:var(--oro)">${f(of.max)} €</b></div>
                ${p.id==='factoring'?`<div class="kv"><span>Comisión</span><b>${(of.com*100).toFixed(1)}%</b></div>`
                                     :`<div class="kv"><span>Interés</span><b>${(of.tin*100).toFixed(1)}%</b></div>`}`
              : `<p style="color:var(--rojo)">${of.motivo}</p>`}`;
    if(of.ok){
      [0.35,0.7,1].forEach(frac=>{
        const imp=Math.round(of.max*frac/500)*500; if(imp<500) return;
        const b=h('button','op',`<b>${p.id==='factoring'?'Adelantar':'Pedir'} ${f(imp)} €</b>`+
          (p.id==='prestamo'||p.id==='leasing'? `<small>Cuota aprox. ${f(imp*(of.tin/12)/(1-Math.pow(1+of.tin/12,-36)))} €/mes durante 36 meses</small>`:
           p.id==='factoring'? `<small>Recibes ${f(imp*(1-of.com))} € hoy · pierdes ${f(imp*of.com)} €</small>`:'<small>Solo pagas si la usas</small>'));
        b.onclick=()=>{ const r=G.pedir(p.id, imp, 36); if(r.err) return toast(r.err); SND.caja(); toast('Hecho'); chequear(); abrir('Banco','',pBanco); };
        el.appendChild(b);
      });
    }
    w.appendChild(el);
  });
}

/* ================= HACIENDA ================= */
function pHacienda(w){
  const prox=90-(S.dia%90);
  w.insertAdjacentHTML('beforeend',
    `<div class="card"><h3>Trimestre</h3>
     <div class="kv"><span>IVA acumulado</span><b style="color:var(--oro)">${f(S.ivaAcum)} €</b></div>
     <div class="kv"><span>Se paga dentro de</span><b>${prox} días</b></div>
     <div class="kv"><span>Tienes en caja</span><b style="color:${S.caja>S.ivaAcum?'var(--verde)':'var(--rojo)'}">${f(S.caja)} €</b></div>
     <p style="margin-top:10px">${S.caja>S.ivaAcum?'Te da. Ese dinero no era tuyo: estaba de paso.':'No te da. El IVA entró en tu cuenta y parecía dinero tuyo. Nunca lo fue.'}</p></div>`);
  w.insertAdjacentHTML('beforeend', conceptoHTML(G.CONCEPTS.find(c=>c.id==='iva-no-es-tuyo')));
  w.insertAdjacentHTML('beforeend',
    `<div class="card"><h3>Facturas pendientes de cobro</h3>
     <div class="kv"><span>Te deben</span><b>${f(S.cobros.reduce((a,c)=>a+c.importe,0))} €</b></div>
     <div class="kv"><span>Plazo medio</span><b>${S.clientes.length?Math.round(S.clientes.reduce((a,c)=>a+c.plazo,0)/S.clientes.length):0} días</b></div>
     <p style="margin-top:8px">Cobrar a 90 días es financiar gratis a tu cliente con tu dinero, y encima adelantando el IVA.</p></div>`);
}

/* ================= PUERTO (M&A) ================= */
function pPuerto(w){
  w.insertAdjacentHTML('beforeend','<p style="color:var(--mut);font-size:13.5px;margin:0 0 16px">Se paga por múltiplo del beneficio operativo. Lo que te arruina no es el precio: es lo que no miraste antes de firmar.</p>');
  if(!S.empresas.length===false){}
  if(S.empresas.length){
    w.appendChild(h('div','tit','Tuyas'));
    S.empresas.forEach(e=>w.insertAdjacentHTML('beforeend',
      `<div class="card"><h3>${e.n}</h3><div class="kv"><span>Aporta</span><b style="color:var(--verde)">${f(e.mensual)} €/mes</b></div>
       <div class="kv"><span>Pagaste</span><b>${f(e.precio)} €</b></div>
       <div class="kv"><span>Se amortiza en</span><b>${Math.round(e.precio/Math.max(e.mensual,1))} meses</b></div></div>`));
  }
  w.appendChild(h('div','tit','En venta'));
  S.mercado.forEach(t=>{
    const v=G.valorar(t);
    const el=h('div','card');
    el.innerHTML=`<h3>${t.n}</h3><p>${(G.SECTORES.find(s=>s.id===t.sec)||{}).n} · ${t.pub.ant} años · ${t.pub.emp} personas</p>
      <div class="kv"><span>Factura</span><b>${f(t.pub.fact)} €/año</b></div>
      <div class="kv"><span>EBITDA</span><b>${f(t.pub.ebitda)} €</b></div>
      <div class="kv"><span>Pide</span><b style="color:var(--oro)">${f(t.precio)} € · ×${t.pide.toFixed(1)}</b></div>
      ${t.descubierto.length?`<div class="kv"><span>Precio justo con lo que sabes</span><b style="color:var(--verde)">${f(v.justo)} €</b></div>`:''}`;
    if(t.descubierto.length) t.descubierto.forEach(id=>{
      const o=t.oc.find(x=>x.id===id);
      el.insertAdjacentHTML('beforeend',`<div class="feed mal" style="margin-top:8px"><b>Hallazgo</b><p>${o.t}</p></div>`);
    });
    el.insertAdjacentHTML('beforeend','<div class="tit">Due diligence</div>');
    G.DD.forEach(a=>{
      const coste=Math.round(t.precio*a.coste/100)*100;
      const b=h('button','op',`<b>${a.n}</b> — ${a.desc}<small>1 energía · ${f(coste)} €</small>`);
      b.disabled=S.energia<1||S.caja<coste;
      b.onclick=()=>{ const r=G.dueDiligence(t.key,a.id); if(r.err) return toast(r.err);
        r.hallados.length?SND.alarma():SND.ok();
        toast(r.hallados.length? r.hallados.length+' hallazgo(s)' : 'Nada raro por aquí'); chequear(); abrir('El puerto','',pPuerto); };
      el.appendChild(b);
    });
    el.insertAdjacentHTML('beforeend','<div class="tit">Ofertar</div>');
    [{p:Math.round(t.precio*0.72/1000)*1000,l:'Ofrecer bajo'},{p:Math.round(t.precio*0.88/1000)*1000,l:'Negociar'},{p:t.precio,l:'Pagar lo que pide'}].forEach(o=>{
      ['caja','deuda','earnout'].forEach(est=>{
        if(est!=='caja'&&o.l!=='Negociar') return;
        const b=h('button','op',`<b>${o.l} — ${f(o.p)} €</b><small>${est==='caja'?'De tu caja':est==='deuda'?'Con préstamo a 5 años':'50% ahora, 50% en 18 meses si cumple'}</small>`);
        b.onclick=()=>{
          if(!confirm(`Comprar ${t.n} por ${f(o.p)} €?`+(t.oc.length>t.descubierto.length?' Hay áreas sin auditar.':''))) return;
          const r=G.ofertar(t.key,o.p,est);
          if(!r.ok) return toast(r.msg||'No');
          r.bomba.length?SND.alarma():SND.caja();
          abrir('Compra cerrada', t.n, x=>{
            x.insertAdjacentHTML('beforeend',`<div class="feed"><b>Firmado</b><p>Suma ${f(r.mensual)} €/mes.</p></div>`);
            r.bomba.forEach(o2=>x.insertAdjacentHTML('beforeend',
              `<div class="feed mal"><b>Lo que no miraste</b><p>${o2.t}</p></div>`+conceptoHTML(G.CONCEPTS.find(c=>c.id===o2.cpt)||{a:'',n:'',d:'',f:null})));
            const b2=h('button','big','Seguir'); b2.onclick=()=>{chequear(); abrir('El puerto','',pPuerto);}; x.appendChild(b2);
          });
        };
        el.appendChild(b);
      });
    });
    w.appendChild(el);
  });
}
function pCumbre(w){
  w.insertAdjacentHTML('beforeend','<p style="color:var(--mut)">Los grandes. Ciclos de meses, comités y contratos que cambian la empresa.</p>');
  const b=h('button','op','<b>Buscar una cuenta grande</b><small>2 energía · ticket 4× tu media · mucho más difícil</small>');
  b.disabled=S.energia<2;
  b.onclick=()=>{ S.energia-=2; const l=G.generarLead(85); l.ticket=Math.round(l.ticket*4/10)*10; l.tam=3;
    l.hidden.decisor=Math.random()<0.3; S.leads.push(l); SND.ok(); G.guardar(); hud();
    toast('Una puerta se ha abierto: '+l.empresa); abrir('La cumbre','',pCumbre); };
  w.appendChild(b);
}

/* ================= CÓDEX ================= */
function pCodex(){
  abrir('Códex', Object.keys(S.codex).length+' de '+G.CONCEPTS.length+' conceptos. Se desbloquean viviéndolos, no leyéndolos.', w=>{
    const areas=[...new Set(G.CONCEPTS.map(c=>c.a))];
    const dom=Object.keys(S.maestria).length;
    if(dom) {
      w.appendChild(h('div','tit','Dominio de objeciones'));
      Object.keys(S.maestria).forEach(id=>{
        const o=G.OBJECIONES.find(x=>x.id===id); if(!o) return;
        const m=G.nivelMaestria(id), st=S.maestria[id];
        const t0=o.txt[0].replace(/[«»"“”]/g,'');
        const corto=t0.length>44? t0.slice(0,44).replace(/[.,;:\s]+$/,'')+'…' : t0;
        w.insertAdjacentHTML('beforeend',
          `<div class="kv"><span>${corto}</span><b style="color:${m>=3?'var(--verde)':'var(--mut)'}">${'★'.repeat(m)}${'☆'.repeat(5-m)} ${st.ok}/${st.int}</b></div>`);
      });
    }
    areas.forEach(a=>{
      const cs=G.CONCEPTS.filter(c=>c.a===a);
      w.appendChild(h('div','tit',a+' · '+cs.filter(c=>S.codex[c.id]).length+'/'+cs.length));
      cs.forEach(c=>{
        if(S.codex[c.id]){
          w.insertAdjacentHTML('beforeend',
            `<div class="card"><h3>${c.n}</h3><p style="color:#C9CEDC">${c.d}</p>${c.f?'<code style="display:block;font-family:var(--mono);font-size:12px;color:var(--violeta);background:rgba(124,107,255,.09);padding:7px 9px">'+c.f+'</code>':''}
             <span class="eti">Lo viviste el día ${S.codex[c.id].dia}</span></div>`);
        } else {
          w.insertAdjacentHTML('beforeend',`<div class="card" style="opacity:.42"><h3 style="color:var(--dim)">? ? ? ? ?</h3><p>Sin desbloquear.</p></div>`);
        }
      });
    });
  }, 'codex');
  chequear();
}

/* ================= FIN DE DÍA ================= */
function finDia(){
  const cajaAntes=S.caja;
  const r=G.finDia(); SND.dia();
  colaFin=r;
  abrir('Día '+(S.dia-1)+' cerrado','', w=>{
    const dif=S.caja-cajaAntes;
    w.insertAdjacentHTML('beforeend',
      `<div class="card"><div class="kv"><span>Has cobrado</span><b style="color:var(--verde)">+${f(r.cobrado)} €</b></div>
       <div class="kv"><span>Has pagado</span><b style="color:var(--rojo)">−${f(r.gd)} €</b></div>
       <div class="kv"><span>Movimiento del día</span><b style="color:${dif>=0?'var(--verde)':'var(--rojo)'}">${dif>=0?'+':'−'}${f(Math.abs(dif))} €</b></div>
       <div class="kv"><span>Caja</span><b>${f(S.caja)} €</b></div>
       <div class="kv"><span>Capacidad usada</span><b style="color:${r.ratio>1?'var(--rojo)':'var(--verde)'}">${Math.round(r.ratio*100)}%</b></div></div>`);
    if(!r.ev.length) w.insertAdjacentHTML('beforeend','<p class="tell">Día tranquilo. No siempre pasa algo.</p>');
    r.ev.forEach(e=>w.insertAdjacentHTML('beforeend',
      `<div class="feed${e.k==='bad'?' mal':''}"><b>${e.k==='ok'?'Bien':e.k==='bad'?'Mal':'Ojo'}</b><p>${e.t}</p></div>`));
    if(S.flags.cerrada){
      w.insertAdjacentHTML('beforeend','<div class="feed mal"><b>Fin</b><p>Has cerrado la empresa. Aguantaste '+S.dia+' días.</p></div>');
      const b=h('button','big','Empezar otra vez'); b.onclick=()=>{ if(confirm('¿Borrar la partida y empezar de cero?')){ G.borrar(); location.reload(); } }; w.appendChild(b);
      return;
    }
    const b=h('button','big','Empezar el día '+S.dia);
    b.onclick=()=>{ G.revisarMisiones().forEach(x=>colaMis.push(x)); siguientePaso(); };
    w.appendChild(b);
  });
  hud();
}
function siguientePaso(){
  const r=colaFin;
  if(colaMis.length) return verMision();
  if(r && r.dilema){ const d=r.dilema; r.dilema=null; return verDilema(d); }
  if(r && r.conflicto){ const c=r.conflicto; r.conflicto=null; return verConflicto(c); }
  colaFin=null;
  if(S.puntos>0){ SND.nivel(); return flash('NIVEL '+S.nivel, 'Rango '+G.rango().r+' — '+G.rango().n+'. Tienes '+S.puntos+' punto(s) para repartir en el despacho.', ()=>{ cerrar(); abrirZona(G.ZONAS[0]); }); }
  cerrar();
}
function verDilema(d){
  abrir(d.tit,'Decisión', w=>{
    w.insertAdjacentHTML('beforeend',`<div class="dialogo">${texto(d.txt)}</div>`);
    d.op.forEach((o,i)=>{
      const b=h('button','op',o.t);
      b.onclick=()=>{ const r=G.resolverDilema(d,i); SND.tap();
        abrir(d.tit,'Consecuencia', x=>{
          x.insertAdjacentHTML('beforeend',`<div class="feed"><b>Lo que has decidido</b><p>${r.fb}</p></div>`);
          if(r.cpt) x.insertAdjacentHTML('beforeend',conceptoHTML(r.cpt));
          const b2=h('button','big','Seguir'); b2.onclick=()=>{ chequear(); siguientePaso(); }; x.appendChild(b2);
        });
      };
      w.appendChild(b);
    });
  });
}
function verConflicto(c){
  const cf=c.def, e=c.emp;
  abrir(cf.tit, e.nombre+' · '+e.perfil, w=>{
    w.insertAdjacentHTML('beforeend',`<p class="tell">${texto(cf.intro,e)}</p><div class="dialogo">${texto(cf.txt,e)}</div>`);
    cf.res.forEach((o,i)=>{
      const b=h('button','op',texto(o.t,e));
      b.onclick=()=>{ const r=G.resolverConflicto(cf,e,i); SND.tap();
        abrir(cf.tit,'Cómo ha ido', x=>{
          x.insertAdjacentHTML('beforeend',`<div class="feed${(o.m||0)<0?' mal':''}"><b>Resultado</b><p>${r.fb}</p></div>`);
          if(r.cpt) x.insertAdjacentHTML('beforeend',conceptoHTML(r.cpt));
          const b2=h('button','big','Seguir'); b2.onclick=()=>{ chequear(); siguientePaso(); }; x.appendChild(b2);
        });
      };
      w.appendChild(b);
    });
  });
}
function texto(t,e){
  const cli=S.clientes.length?S.clientes[Math.floor(Math.random()*S.clientes.length)]:{empresa:'un cliente',mensual:900};
  return t.replace(/\{(\w+)\}/g,(m,k)=>{
    if(k==='nombre') return e?e.nombre:'alguien';
    if(k==='otro') return S.equipo.length>1? S.equipo.find(x=>x!==e).nombre : 'otro';
    if(k==='meses') return e?Math.round((S.dia-e.alta)/30):6;
    if(k==='oferta') return f((e?e.bruto:1800)*1.18);
    if(k==='alt') return f((e?e.bruto:1800)*1.07);
    if(k==='objetivo') return 'los objetivos del trimestre';
    if(k==='coste') return f(e?G.costeEmpleado(e):0);
    if(k==='output') return f(e?G.output(e):0);
    if(k==='cliente') return cli.empresa;
    if(k==='importe') return f(Math.round(Math.max(1200,G.recurrente()*0.7)/100)*100);
    if(k==='peso') return Math.round(cli.mensual/Math.max(G.recurrente(),1)*100);
    if(k==='pct') return 8+Math.floor(Math.random()*12);
    if(k==='empleado') return S.equipo.length?S.equipo[0].nombre:'alguien';
    return m;
  });
}

/* ================= BOOT ================= */
$('#b-dia').onclick=()=>{ if(neg) return toast('Termina la conversación primero'); finDia(); };
document.querySelectorAll('[data-ir]').forEach(b=>b.onclick=()=>{
  SND.tap();
  const m={pipeline:pPipeline, cartera:()=>{abrir('Cartera','Los que ya tienes. Retenerlos cuesta una fracción de conseguirlos.',pCartera,'taller');chequear();},
           equipo:pEquipo, codex:pCodex};
  m[b.dataset.ir]();
});
document.querySelectorAll('#seg button').forEach(b=>b.onclick=()=>{ SND.tap(); vista=b.dataset.v; pintarVista(); });
$('#objetivo').onclick=()=>{ SND.tap(); pObjetivos(); };
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&$('#panel').classList.contains('on')&&!neg) cerrar(); });

function intro(){
  flash('IMPERIO','Un garaje, 14.000 € y un cliente heredado. Finanzas 8, ventas 2: sabes leer perfectamente una cuenta de resultados mientras se vacía.',
   ()=>flash('CÓMO SE JUEGA','Cada día tienes unas pocas acciones. Sales a la calle a buscar gente, la trabajas en la sala de reuniones y entregas lo que vendes. Todo pasa dentro de esta oficina o al salir por la puerta.',
    ()=>flash('LA REGLA','Nadie compra porque se lo cuentes: compran porque les preguntas. Las mejores respuestas están bloqueadas hasta que descubres con quién hablas.',
     ()=>flash('NO VAS SOLO','Abajo tienes siempre el objetivo de ahora mismo, con la pista de dónde tocarlo. Quince pasos y ya sabes jugar.',
      ()=>{ cerrar(); hud(); }, 'Empezar'),'Vale'),'Sigue'),'Vale');
}
(function boot(){
  const s=G.cargar();
  if(s){ S=s; hud();
    if(s.ampliacion){ delete s.ampliacion; G.guardar(); toast('Ampliación cargada. Tu partida sigue.'); }
    toast('Partida recuperada · día '+S.dia);
  } else { G.nuevo(); S=G.S; hud(); intro(); }
  if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
window.addEventListener('beforeunload',()=>{ try{G.guardar();}catch(e){} });
})();
