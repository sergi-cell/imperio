/* IMPERIO — motor. Estado, economía, ventas, equipo, banco, compras. */
window.IMP = window.IMP || {};
(function(G){
'use strict';

const SAVE_KEY='imperio_save_v1', SAVE_V=1;
const rnd=(a,b)=>a+Math.random()*(b-a);
const ri=(a,b)=>Math.floor(rnd(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const round=(v,n=0)=>{const m=Math.pow(10,n);return Math.round(v*m)/m;};
G.util={rnd,ri,pick,clamp,round};

/* ---------- registro de packs de contenido (para ampliar sin romper partidas) ---------- */
G.PACKS=['core'];
G.pack=function(p){
  G.PACKS.push(p.id);
  ['CONCEPTS','SECTORES','ARQUETIPOS','CANALES','APERTURAS','PREGUNTAS','OBJECIONES','CIERRES',
   'CANDIDATOS','RASGOS','CONFLICTOS','ZONAS','TARGETS','EVENTOS','DILEMAS','BANCO'].forEach(k=>{
    if(p[k]) G[k]=G[k].concat(p[k]);
  });
  if(G.S) G.log('Ampliación cargada: '+p.n);
};

/* ================= ESTADO ================= */
function nuevoEstado(){
  return {
    v:SAVE_V, packs:G.PACKS.slice(),
    dia:1, mes:1, trim:1,
    caja:14000, deuda:0, fijos:1380,
    xp:0, nivel:1, puntos:0,
    attrs:{ventas:2, marketing:3, operaciones:4, finanzas:8, liderazgo:5},
    energia:4, energiaMax:4,
    moral:72, repu:10,
    margen:0.62,
    equipo:[], clientes:[], leads:[], perdidos:[], empresas:[], prestamos:[],
    linea:{limite:0, usado:0}, ivaAcum:0, cobros:[],
    mercado:[], dd:{},
    codex:{}, maestria:{}, logros:{},
    stats:{toques:0, noes:0, cierres:0, perdidas:0, facturado:0, despidos:0,
           prospecciones:0, negociaciones:0, objeciones:0, cierresPedidos:0, maxReveal:0, maxToques:0,
           cierresSinDescuento:0, cierresAnclaAlta:0, cierresFrios:0, hallazgos:0, referidos:0},
    misiones:{}, objetivos:{},
    flags:{}, hist:[], diario:[],
    racha:{ultimo:null, dias:0},
    pend:null, quiebras:0
  };
}
G.nuevo=function(){ G.S=nuevoEstado(); generarMercado(); semilla(); G.guardar(); return G.S; };

function semilla(){
  // Arrancas con un cliente heredado y dos leads. Nadie empieza de cero absoluto.
  const s=pick(G.SECTORES);
  G.S.clientes.push(crearCliente({sector:s, empresa:nombreEmpresa(s), mensual:820, plazo:30}, 12));
  for(let i=0;i<2;i++) G.S.leads.push(generarLead(30));
  G.log('Arrancas con un cliente heredado y dos contactos tibios. Finanzas 8, ventas 2: sabes leer la caja perfectamente mientras se vacía.');
}

/* ================= GUARDADO ================= */
G.guardar=function(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(G.S)); }catch(e){} };
G.cargar=function(){
  try{
    const raw=localStorage.getItem(SAVE_KEY); if(!raw) return null;
    let s=JSON.parse(raw);
    s=migrar(s); G.S=s; return s;
  }catch(e){ return null; }
};
G.borrar=function(){ try{ localStorage.removeItem(SAVE_KEY);}catch(e){} G.S=null; };
function migrar(s){
  const base=nuevoEstado();
  for(const k in base) if(s[k]===undefined) s[k]=base[k];      // campos nuevos
  if(!s.packs) s.packs=['core'];
  const nuevos=G.PACKS.filter(p=>s.packs.indexOf(p)<0);
  if(nuevos.length){ s.packs=G.PACKS.slice(); s.ampliacion=nuevos; }
  s.v=SAVE_V; return s;
}

/* ================= MISIONES ================= */
G.misionActual=function(){
  const S=G.S;
  const t=G.TUTORIAL.find(m=>!S.misiones[m.id]);
  if(t) return {m:t, tipo:'tutorial', i:G.TUTORIAL.indexOf(t)+1, n:G.TUTORIAL.length};
  const o=G.OBJETIVOS.filter(m=>!S.objetivos[m.id]);
  if(!o.length) return null;
  return {m:o[0], tipo:'objetivo', i:G.OBJETIVOS.length-o.length+1, n:G.OBJETIVOS.length};
};
G.revisarMisiones=function(){
  const S=G.S, hechas=[];
  // el tutorial va en orden, de una en una
  let guard=0;
  while(guard++<20){
    const t=G.TUTORIAL.find(m=>!S.misiones[m.id]);
    if(!t) break;
    let ok=false; try{ ok=t.check(S,G); }catch(e){ ok=false; }
    if(!ok) break;
    S.misiones[t.id]=S.dia; G.xp(t.xp||0); if(t.cash) S.caja+=t.cash;
    hechas.push({m:t, tipo:'tutorial'});
  }
  // los objetivos se cumplen cuando toque
  G.OBJETIVOS.forEach(o=>{
    if(S.objetivos[o.id]) return;
    let ok=false; try{ ok=o.check(S,G); }catch(e){ ok=false; }
    if(ok){ S.objetivos[o.id]=S.dia; G.xp(o.xp||0); hechas.push({m:o, tipo:'objetivo'}); }
  });
  if(hechas.length) G.guardar();
  return hechas;
};

/* ================= DIFICULTAD ================= */
G.dif=function(){ const S=G.S; return 1 + Math.pow(S.dia/60,0.75)*0.55 + (S.trim-1)*0.02; };

/* ================= LOG ================= */
G.log=function(txt, tipo){ const S=G.S; S.diario.unshift({d:S.dia, t:txt, k:tipo||'info'}); if(S.diario.length>140) S.diario.pop(); };

/* ================= CÓDEX ================= */
G.aprender=function(id){
  if(!id) return null;
  const S=G.S, c=G.CONCEPTS.find(x=>x.id===id); if(!c) return null;
  if(S.codex[id]){ S.codex[id].veces++; return null; }
  S.codex[id]={dia:S.dia, veces:1}; G.xp(14);
  return c;
};

/* ================= XP / NIVEL ================= */
G.xpNecesaria=n=>Math.round(88*Math.pow(n,1.55));
G.xp=function(n){
  const S=G.S; S.xp+=n; let subio=false;
  while(S.xp>=G.xpNecesaria(S.nivel)){ S.xp-=G.xpNecesaria(S.nivel); S.nivel++; S.puntos+=2; subio=true;
    if(S.nivel%5===0 && S.energiaMax<9) S.energiaMax++;
  }
  return subio;
};
G.rango=function(){ let r=G.RANGOS[0]; G.RANGOS.forEach(x=>{ if(G.S.nivel>=x.min) r=x; }); return r; };

/* ================= NOMBRES ================= */
function nombreEmpresa(sec){ return pick(sec.pref)+' '+pick(G.APELLIDOS); }
function nombrePersona(){ return pick(G.NOMBRES)+' '+pick(G.APELLIDOS); }

/* ================= LEADS ================= */
let LID=1;
function generarLead(calidad){
  const S=G.S, d=G.dif(), sec=pick(G.SECTORES), arq=pick(G.ARQUETIPOS);
  let mk=0; S.equipo.forEach(e=>{ if(e.rol==='marketing'){ mk+=e.st.ejec*1.1 + (e.extra&&e.extra.calidadUp? e.extra.calidadUp*30:0); } });
  const q=clamp(calidad + (S.attrs.marketing-3)*2 + S.repu*0.25 + mk - (d-1)*8
                + (S.flags.marca && S.dia-S.flags.marca>90 ? 12:0), 5, 98);
  const tam=q>70?ri(2,3):q>40?ri(1,2):1;                       // 1 micro · 2 pyme · 3 mediana
  const base=rnd(sec.tick[0], sec.tick[1]) * (tam===1?0.7:tam===2?1:1.9);
  return {
    id:LID++, empresa:nombreEmpresa(sec), sector:sec.id, secN:sec.n, dolorSec:sec.dolor,
    contacto:nombrePersona(), cargo:pick(G.CARGOS), arq:arq.id, tam, q:round(q),
    ticket:round(base/10)*10, ciclo:ri(sec.ciclo[0],sec.ciclo[1]),
    estado:'nuevo', toques:0, ultimo:S.dia, nacido:S.dia,
    hidden:{
      dolor:round(clamp(rnd(20,95)*(q/60),5,100)),
      coste:round(base*rnd(1.4,6.5)/10)*10,
      presupuesto:round(base*rnd(0.55,2.2)/(0.86+d*0.14)/10)*10,
      urgencia:round(clamp(rnd(0,100)*(q/70),0,100)),
      decisor:Math.random()< (0.35+q/220),
      alternativa:pick(['ninguna','proveedor','interno','ninguna']),
      riesgo:round(rnd(15,90)),
      proceso:pick(['firma él y ya','pasa por administración','comité mensual','lo ve el socio'])
    },
    known:{}
  };
}
G.generarLead=generarLead;

/* ---- prospección ---- */
G.canalDisponible=function(c){
  const S=G.S;
  if(S.nivel<c.nivel) return 'Nivel '+c.nivel;
  if(c.reqClientes && S.clientes.length<c.reqClientes) return 'Necesitas clientes';
  if(c.reqPerdidos && S.perdidos.length<c.reqPerdidos) return 'Aún no has perdido a nadie';
  if(S.energia<c.energia) return 'Sin energía';
  if(S.caja < costeCanal(c)) return 'Sin caja';
  return null;
};
function costeCanal(c){ const S=G.S; let x=c.coste; if(c.escala) x*= (1+ (S.dia/120)) * (S.cacMul||1); return round(x); }
G.costeCanal=costeCanal;

G.prospectar=function(canalId){
  const S=G.S, c=G.CANALES.find(x=>x.id===canalId);
  if(G.canalDisponible(c)) return {err:G.canalDisponible(c)};
  S.energia-=c.energia; S.caja-=costeCanal(c); S.stats.toques++; S.stats.prospecciones++;
  const attr=S.attrs[c.attr]||3;
  let n=ri(c.leads[0], c.leads[1]) + (attr>=7?1:0) + (Math.random()<S.repu/140?1:0);
  const rechazos = Math.round(rnd(6,18) * c.rech * G.dif());
  S.stats.noes += rechazos;
  const nuevos=[];
  for(let i=0;i<n;i++){ const l=generarLead(rnd(c.cal[0],c.cal[1])); if(c.diferido) l.estado='tibio'; l.origen=c.id; S.leads.push(l); nuevos.push(l); }
  const cpt=G.aprender(c.cpt);
  G.xp(6+n*4);
  G.log(`${c.n}: ${rechazos} noes y ${n} contacto${n===1?'':'s'}.`, n?'ok':'bad');
  return {n, rechazos, nuevos, cpt, coste:costeCanal(c)};
};

/* ================= NEGOCIACIÓN ================= */
G.abrirNeg=function(leadId){
  const S=G.S, lead=S.leads.find(l=>l.id===leadId);
  if(!lead) return null;
  if(S.energia<1) return {err:'Sin energía'};
  if(S.pend) return {err:'Ya tienes una conversación abierta'};
  S.energia--; lead.toques++; lead.ultimo=S.dia; S.stats.toques++; S.stats.negociaciones++;
  const arq=G.ARQUETIPOS.find(a=>a.id===lead.arq);
  const d=G.dif();
  const neg={
    leadId, arq:arq.id,
    interes: round(clamp(lead.hidden.dolor*0.30 + lead.q*0.14 + (lead.toques>1?8:0), 8, 50)),
    confianza: round(clamp(24 + S.repu*0.35 - (d-1)*7, 6, 58)),
    paciencia: Math.max(3, Math.round(arq.pac - (d-1)*1.6 + (S.attrs.liderazgo-5)*0.3)),
    precio: lead.ticket, precioBase: lead.ticket,
    plazoCobro:60, anticipo:0, garantia:false, prueba:false,
    fase:'apertura', hechas:[], reveal:{}, hist:[], usadas:{}
  };
  S.pend={tipo:'neg', neg};
  return neg;
};

G.opciones=function(neg){
  const S=G.S, lead=S.leads.find(l=>l.id===neg.leadId);
  if(neg.fase==='apertura'){
    let ops=G.APERTURAS.filter(a=>!a.reqRef || S.clientes.length>=2);
    return {tipo:'apertura', txt:`${lead.contacto}, ${lead.cargo} de ${lead.empresa}. Coges el teléfono.`, ops:mezclar(ops).slice(0,4)};
  }
  if(neg.fase==='descubrimiento'){
    let ops=G.PREGUNTAS.filter(q=>!q.req || neg.reveal[q.req]).filter(q=>!neg.usadas[q.id]);
    ops=mezclar(ops).slice(0,4);
    return {tipo:'pregunta', txt:'¿Qué le preguntas?', ops, puedePasar:true};
  }
  if(neg.fase==='propuesta'){
    const b=neg.precioBase;
    return {tipo:'precio', txt:'Toca decir un número.', ops:[
      {id:'alto', t:`Anclar alto: ${fmt(round(b*1.35/10)*10)} €/mes`, mul:1.35, i:-6, c:0, cpt:'anclaje', fb:'Anclar alto te deja sitio para negociar. Duele en el momento y casi siempre acabas cerrando por encima de lo que habrías pedido.'},
      {id:'medio', t:`Tu precio: ${fmt(b)} €/mes`, mul:1, i:0, c:3, cpt:'valor-vs-coste', fb:'Tu precio, sin adornos. Correcto si lo defiendes con su número, no con tus horas.'},
      {id:'bajo', t:`Ir a lo seguro: ${fmt(round(b*0.78/10)*10)} €/mes`, mul:0.78, i:8, c:-6, cpt:'anclaje', fb:'Has abierto bajo por miedo. A partir de aquí solo se negocia hacia abajo: nadie sube desde tu ancla.'},
      {id:'tres', t:'Tres opciones: básico, el de en medio y uno grande', mul:1.18, i:6, c:8, cpt:'tres-opciones', fb:'Con una opción la pregunta es sí o no. Con tres, la pregunta es cuál. Sube el ticket medio si la de arriba es real.', req:{attr:'ventas', v:5}}
    ].filter(o=>!o.req || S.attrs[o.req.attr]>=o.req.v)};
  }
  if(neg.fase==='objeciones'){
    const o=neg.objActual;
    const res=o.res.filter(r=>!r.req || neg.reveal[r.req]).filter(r=>!r.reqRef || S.clientes.length>=2);
    const bloq=o.res.filter(r=>r.req && !neg.reveal[r.req]).map(r=>({t:r.t, why:'Necesitas saber '+etiqueta(r.req)}));
    return {tipo:'objecion', obj:o, txt:interpolar(pick(o.txt), lead, neg), tell:o.tell, ops:res, bloq};
  }
  if(neg.fase==='cierre'){
    const ops=G.CIERRES.filter(c=>!c.req || neg.reveal[c.req]);
    return {tipo:'cierre', txt:'Momento de pedir el sí.', ops};
  }
};
function etiqueta(k){return {dolor:'su problema real', coste:'cuánto le cuesta el problema', presupuesto:'su presupuesto', decisor:'quién decide', urgencia:'por qué ahora', alternativa:'con quién compite', riesgo:'qué le preocupa', proceso:'cómo se decide'}[k]||k;}

G.jugar=function(neg, opId){
  const S=G.S, lead=S.leads.find(l=>l.id===neg.leadId);
  const ctx=G.opciones(neg);
  const op=(ctx.ops||[]).find(o=>(o.id||o.t)===opId) || (ctx.ops||[])[0];
  const arq=G.ARQUETIPOS.find(a=>a.id===neg.arq);
  let r={fb:op.fb, cpt:null, fin:null, extra:[]};

  let di=op.i||0, dc=op.c||0, dp=op.p||0;
  if(op.bonus){
    if(op.bonus.arq && op.bonus.arq===neg.arq){ di+=op.bonus.i||0; dc+=op.bonus.c||0; dp+=op.bonus.p||0; r.extra.push('Con '+arq.n.toLowerCase()+': '+arq.tip); }
    if(op.bonus.has && neg.reveal[op.bonus.has]){ di+=op.bonus.i||0; dc+=op.bonus.c||0; }
  }
  // tu habilidad de ventas modula lo que sale bien
  const skill=(S.attrs.ventas-5)*0.9;
  if(di>0) di+=skill; if(dc>0) dc+=skill*0.6;

  if(di>0) di*= (1-neg.interes/128);            // cada punto cuesta más que el anterior
  if(dc>0) dc*= (1-neg.confianza/128);
  neg.interes=clamp(neg.interes+di-1.0, 0, 100); // la atención se desgasta sola cada turno
  neg.confianza=clamp(neg.confianza+dc-0.4, 0, 100);
  neg.paciencia+=dp;
  if(op.cpt) r.cpt=G.aprender(op.cpt);
  neg.hist.push({t:op.t, i:di, c:dc});

  if(ctx.tipo==='apertura'){ neg.fase='descubrimiento'; }
  else if(ctx.tipo==='pregunta'){
    neg.usadas[op.id]=1;
    if(op.rev && !neg.reveal[op.rev]){ neg.reveal[op.rev]=lead.hidden[op.rev]; r.revelado={k:op.rev, v:lead.hidden[op.rev]};
      S.stats.maxReveal=Math.max(S.stats.maxReveal, Object.keys(neg.reveal).length); }
    if(neg.paciencia<=1) neg.fase='propuesta';
  }
  else if(ctx.tipo==='precio'){
    neg.precio=round(neg.precioBase*op.mul/10)*10; neg.ancla=op.id;
    neg.fase='objeciones'; neg.pool=construirPool(neg,lead,arq); neg.objActual=neg.pool.shift();
    if(!neg.objActual) neg.fase='cierre';
  }
  else if(ctx.tipo==='objecion'){
    if(op.price){ neg.precio=round(neg.precio*(1+op.price)/10)*10; if(op.price<0) neg.hizoDescuento=true; }
    if(op.plazo) neg.plazo=op.plazo;
    if(op.cobro) neg.plazoCobro=op.cobro;
    if(op.anticipo) neg.anticipo=op.anticipo;
    if(op.garantia) neg.garantia=true;
    if(op.prueba) neg.prueba=true;
    S.stats.objeciones++;
    marcarMaestria(neg.objActual.id, di+dc>10);
    if(op.end==='frio'){ return cerrarNeg(neg,'frio',r); }
    neg.hechas.push(neg.objActual.id);
    neg.objActual=neg.pool.shift();
    if(!neg.objActual || neg.paciencia<=0) neg.fase='cierre';
  }
  else if(ctx.tipo==='cierre'){
    if(op.id!=='no_cierro') S.stats.cierresPedidos++;
    const info=Object.keys(neg.reveal).length;
    const presu=lead.hidden.presupuesto, ratio=neg.precio/Math.max(presu,1);
    let muro=0, aviso=null;
    if(ratio>1.7){ muro=-70; aviso='No tenía ese dinero. Ni con la mejor conversación del mundo entraba.'; }
    else if(ratio>1.25){ muro=-24; aviso='Estabas por encima de su presupuesto. Se puede salvar, pero es cuesta arriba.'; }
    else if(ratio<0.7){ muro=6; aviso='Has entrado muy por debajo de lo que podía pagar. Cierras, y dejas dinero encima de la mesa.'; }
    if(lead.hidden.decisor===false) muro-=14;
    const score=neg.interes*0.60 + neg.confianza*0.36 + (S.attrs.ventas-5)*1.6 + info*1.6
                + (S.flags.nicho?4:0) + (S.flags.proceso?3:0) + (S.flags.cierreUp||0) + muro;
    r.aviso=aviso;
    r.score=round(score); r.umbral=op.umbral;
    if(op.prueba){ neg.prueba=true; neg.precio=round(neg.precio*0.55/10)*10; }
    if(op.price) neg.precio=round(neg.precio*(1+op.price)/10)*10;
    return cerrarNeg(neg, score>=op.umbral?'ganada':'perdida', r);
  }
  if(neg.paciencia<=0 && neg.fase!=='cierre'){ neg.fase='cierre'; r.extra.push('Se le ha acabado la paciencia. Toca cerrar ya o perderlo.'); }
  return r;
};

function marcarMaestria(objId, bien){
  const S=G.S; S.maestria[objId]=S.maestria[objId]||{int:0, ok:0};
  S.maestria[objId].int++; if(bien) S.maestria[objId].ok++;
}
G.nivelMaestria=function(id){ const m=G.S.maestria[id]; if(!m) return 0; return clamp(Math.floor(m.ok/3),0,5); };

function construirPool(neg, lead, arq){
  const d=G.dif(), pool=[];
  const cand=G.OBJECIONES.filter(o=>['precio','dilacion','confianza','competencia','cualificacion','contexto'].indexOf(o.cat)>=0);
  const pref=cand.filter(o=>arq.obj.indexOf(o.id)>=0);
  pref.forEach(o=>pool.push(o));
  // situacionales
  if(neg.precio > lead.hidden.presupuesto*1.15) push(pool, 'caro');
  if(!lead.hidden.decisor) push(pool,'no_decisor');
  if(lead.hidden.alternativa==='proveedor') push(pool,'competencia_mala');
  if(lead.hidden.urgencia<35) push(pool,'no_es_momento');
  if(lead.hidden.riesgo>65) push(pool,'riesgo');
  if(lead.tam>=3) push(pool,'pago');
  while(pool.length<2) push(pool, pick(cand).id);
  const n=clamp(Math.round(2 + (d-1)*1.6 + (lead.tam-1)*0.5), 2, 5);
  return mezclar(uniq(pool)).slice(0,n);
}
function push(pool,id){ const o=G.OBJECIONES.find(x=>x.id===id); if(o&&pool.indexOf(o)<0) pool.push(o); }
function uniq(a){ return a.filter((x,i)=>a.indexOf(x)===i); }
function mezclar(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

function cerrarNeg(neg, res, r){
  const S=G.S, i=S.leads.findIndex(l=>l.id===neg.leadId), lead=S.leads[i];
  r.fin=res;
  if(res==='ganada'){
    const cli=crearCliente({sector:G.SECTORES.find(s=>s.id===lead.sector), empresa:lead.empresa,
      mensual:neg.precio, plazo:neg.plazoCobro, anticipo:neg.anticipo, prueba:neg.prueba, garantia:neg.garantia}, neg.plazo||ri(6,18));
    const sob=G.carga()/Math.max(G.capacidad(),1);
    if(sob>1.25){ cli.satisf=round(clamp(70-(sob-1)*40,12,70));
      G.log(`Has cerrado sin capacidad para entregarlo. ${cli.empresa} arranca con la satisfacción por los suelos.`,'warn');
      G.aprender('coste-oportunidad'); }
    S.clientes.push(cli); S.leads.splice(i,1);
    if(neg.anticipo>0){ const ant=round(cli.mensual*neg.anticipo); S.caja+=ant;
      G.log(`Anticipo de ${fmt(ant)} € cobrado el mismo día.`,'ok'); }
    S.stats.cierres++;
    if(!neg.hizoDescuento) S.stats.cierresSinDescuento++;
    if(neg.ancla==='alto') S.stats.cierresAnclaAlta++;
    if(lead.fueFrio) S.stats.cierresFrios++;
    if(lead.origen==='referido') S.stats.referidos++; S.repu=clamp(S.repu+1,0,92);
    G.xp(26 + Math.round(neg.precio/70));
    G.log(`Cerrado: ${lead.empresa} · ${fmt(neg.precio)} €/mes.`, 'ok');
    r.cliente=cli;
  } else if(res==='frio'){
    lead.estado='frio'; lead.ultimo=S.dia; G.xp(6);
    G.log(`${lead.empresa} se enfría. Sigue vivo si haces seguimiento.`, 'warn');
  } else {
    S.stats.perdidas++; lead.estado='frio'; lead.ultimo=S.dia; lead.perdidoEn=S.dia; G.xp(10);
    G.log(`Perdido: ${lead.empresa}.`, 'bad');
  }
  S.pend=null;
  return r;
}

/* ---- seguimiento: el mecanismo que más dinero deja y menos gente usa ---- */
G.seguir=function(leadId){
  const S=G.S, lead=S.leads.find(l=>l.id===leadId);
  if(!lead) return {err:'Ese contacto ya no está'};
  lead.fueFrio=true;
  if(S.energia<1) return {err:'Sin energía'};
  S.energia--; lead.toques++; lead.ultimo=S.dia; S.stats.toques++;
  const t=lead.toques;
  // la curva real: el pico está entre el 5º y el 12º contacto
  S.stats.maxToques=Math.max(S.stats.maxToques, lead.toques+0);
  const p=clamp(0.06 + (t>=5? (t<=12? 0.10+(t-5)*0.035 : 0.16) : t*0.018) + (S.attrs.ventas-5)*0.015, 0.03, 0.62);
  G.xp(5);
  if(Math.random()<p){ lead.estado='nuevo'; G.log(`${lead.empresa} responde al toque nº ${t}.`,'ok');
    return {reabre:true, t, p, cpt:t>=5?G.aprender('seguimiento'):null}; }
  G.log(`Toque nº ${t} a ${lead.empresa}: nada.`);
  return {reabre:false, t, p, cpt:t===5?G.aprender('seguimiento'):null};
};

/* ================= CLIENTES ================= */
let CID=1;
function crearCliente(o, meses){
  const S=G.S;
  return {id:CID++, empresa:o.empresa, sector:o.sector.id, secN:o.sector.n,
    mensual:o.mensual, plazo:o.plazo||30, satisf:round(rnd(62,82)),
    meses:meses||12, alta:S.dia, carga:round(o.mensual*rnd(0.7,1.3)),
    prueba:!!o.prueba, garantia:!!o.garantia, cobrado:0};
}
G.capacidad=function(){
  const S=G.S;
  let cap=S.attrs.operaciones*850;                        // lo que puedes entregar tú, en € de facturación/mes
  S.equipo.forEach(e=>{ if(e.rol==='entrega') cap+= e.st.ejec*1150*(e.moral/70)*outMul(e); });
  let boost=1; S.equipo.forEach(e=>{ if(e.extra && e.extra.equipoBoost) boost+=e.extra.equipoBoost; });
  cap*=boost;
  if(S.flags.cuelloBotella) cap*=0.88;
  S.empresas.forEach(x=>cap+=x.cap||0);
  return round(cap);
};
G.carga=function(){ return G.S.clientes.reduce((a,c)=>a+c.carga,0); };
G.recurrente=function(){ return G.S.clientes.reduce((a,c)=>a+c.mensual,0) + G.S.empresas.reduce((a,e)=>a+(e.mensual||0),0); };
G.recurrenteReal=function(){ return G.S.clientes.reduce((a,c)=>a+ c.mensual*(c.satisf<45? 0.5+c.satisf/90 : 1),0)
  + G.S.empresas.reduce((a,e)=>a+(e.mensual||0),0); };

/* ================= EQUIPO ================= */
let EID=1;
G.candidatos=function(n){
  const S=G.S, out=[];
  const dis=G.CANDIDATOS.filter(c=>c.nivel<=S.nivel+1);
  mezclar(dis).slice(0,n||4).forEach(c=>{
    const rasgo=pick(G.RASGOS);
    out.push({id:'c'+(EID++), nombre:nombrePersona(), rol:c.rol, perfil:c.p, desc:c.desc,
      st:Object.assign({},c.st), bruto:c.bruto, comision:c.comision||0, porHora:c.porHora||0,
      rasgo:rasgo.id, extra:c, coste:round((c.bruto||0)*1.32)});
  });
  return out;
};
G.contratar=function(c){
  const S=G.S;
  const alta=round((c.bruto||0)*0.6+280);
  if(S.caja<alta) return {err:'No tienes ni para el alta'};
  S.caja-=alta;
  S.equipo.push({id:c.id, nombre:c.nombre, rol:c.rol, perfil:c.perfil, st:c.st,
    bruto:c.bruto, comision:c.comision, porHora:c.porHora, coste:c.coste,
    moral:round(rnd(64,84)), alta:S.dia, rasgo:c.rasgo, visto:false, extra:c.extra||{}});
  G.xp(25); G.aprender('coste-real-empleado');
  G.log(`Contratado ${c.nombre} (${c.perfil}). Bruto ${fmt(c.bruto)} €, coste real ${fmt(c.coste)} €.`,'ok');
  return {ok:true, alta};
};
function outMul(e){
  const S=G.S, r=G.RASGOS.find(x=>x.id===e.rasgo)||{ef:{}};
  let m=1;
  if(r.ef.outMul) m*=r.ef.outMul;
  if(r.ef.arranque && S.dia-e.alta < r.ef.arranque) m*=0.5;
  else if(r.ef.arranque) m*=1.2;
  return m;
}
G.indirecto=rol=>rol==='admin'||rol==='marketing';
G.aporta=function(e){
  if(e.rol==='admin') return '+1 energía al día y menos sustos con Hacienda';
  if(e.rol==='marketing') return 'sube la calidad de los contactos que entran';
  if(e.rol==='comercial') return 'trae y cierra ventas que no tocas tú';
  return 'capacidad para entregar sin que se te caigan clientes';
};
G.output=function(e){
  const S=G.S, r=G.RASGOS.find(x=>x.id===e.rasgo)||{ef:{}};
  let base=0;
  if(e.rol==='comercial') base=e.st.ventas*140*(1+(S.attrs.liderazgo-5)*0.04);
  else if(e.rol==='entrega') base=e.st.ejec*135;
  else if(e.rol==='admin') base=e.st.ejec*70;
  else base=e.st.ejec*95;
  base*= (e.moral/72) * outMul(e);
  if(r.ef.leadMul && e.rol==='comercial') base*=r.ef.leadMul;
  return round(base);
};
G.costeEmpleado=function(e){ const S=G.S; return round((e.coste||0) + (e.porHora? e.porHora*80:0) + (e.comision? G.recurrente()*e.comision*0.3:0)); };
G.indemnizacion=function(e){
  const S=G.S, dias=S.dia-e.alta, anios=dias/365;
  return round(Math.max(1, anios)*33*(e.bruto||1400)/30);
};
G.despedir=function(id){
  const S=G.S, i=S.equipo.findIndex(e=>e.id===id), e=S.equipo[i];
  const ind=G.indemnizacion(e);
  if(S.caja<ind) return {err:'No tienes para la indemnización: '+fmt(ind)+' €'};
  S.caja-=ind; S.equipo.splice(i,1); S.stats.despidos++;
  S.moral=clamp(S.moral-8-(S.equipo.length?0:4),0,100);
  const r=G.RASGOS.find(x=>x.id===e.rasgo)||{ef:{}};
  let roba=0;
  if(r.ef.robaCartera){ roba=Math.round(S.clientes.length*r.ef.robaCartera); for(let k=0;k<roba;k++){ const c=S.clientes.pop(); if(c) S.perdidos.push(c);} }
  const juicio=Math.random()<0.12;
  if(juicio) S.caja-=round(ind*0.8);
  G.aprender('despedir-tarde'); G.xp(12);
  G.log(`Despides a ${e.nombre}. Indemnización ${fmt(ind)} €.${roba?' Se lleva '+roba+' cliente(s).':''}${juicio?' Y te demanda.':''}`,'bad');
  return {ok:true, ind, roba, juicio};
};
G.formar=function(id){
  const S=G.S, e=S.equipo.find(x=>x.id===id), coste=round(420+ (e.bruto||1200)*0.25);
  if(S.caja<coste) return {err:'Sin caja'};
  if(S.energia<1) return {err:'Sin energía'};
  S.caja-=coste; S.energia--;
  const k=pick(['ejec','auto','ventas','act']); e.st[k]=clamp(e.st[k]+1,1,10); e.moral=clamp(e.moral+6,0,100);
  G.xp(16); G.log(`Formas a ${e.nombre}: +1 en ${k}.`,'ok');
  return {ok:true, k, coste};
};
G.subirSueldo=function(id, pct){
  const S=G.S, e=S.equipo.find(x=>x.id===id);
  e.bruto=round(e.bruto*(1+pct)); e.coste=round(e.bruto*1.32); e.moral=clamp(e.moral+pct*90,0,100);
  G.log(`Subes un ${Math.round(pct*100)}% a ${e.nombre}.`);
  return {ok:true};
};

/* ================= BANCO ================= */
G.rating=function(){
  const S=G.S, rec=G.recurrente(), gasto=G.gastoMensual();
  let p=40;
  p += clamp((S.caja/Math.max(gasto,1))*7, 0, 26);            // meses de aire
  p += clamp((rec-gasto)/Math.max(gasto,1)*22, -22, 22);      // rentabilidad
  p += clamp(S.dia/12, 0, 14);                                // antigüedad
  p -= clamp(S.deuda/Math.max(rec*12,1)*40, 0, 30);           // apalancamiento
  p -= (S.flags.impagado && S.dia-S.flags.impagado<120)?10:0;
  return clamp(round(p),0,100);
};
G.ofertaBanco=function(prod){
  const S=G.S, rat=G.rating(), rec=G.recurrente();
  if(prod.id==='factoring'){
    const pend=S.cobros.reduce((a,c)=>a+c.importe,0);
    return {max:round(pend), tin:0, com:prod.comision, ok:pend>500, motivo:pend>500?null:'No tienes facturas pendientes suficientes'};
  }
  const ok=rat>=42;
  const max=round(rec*12*prod.maxMul*(rat/100)*1.8/100)*100;
  const tin=round(prod.tinBase + (100-rat)/100*0.075 + (G.dif()-1)*0.012, 4);
  return {max, tin, ok:ok&&max>500, motivo:ok?(max>500?null:'Tu facturación no da para más'):'Rating '+rat+'/100. El banco presta paraguas cuando no llueve.'};
};
G.pedir=function(prodId, importe, plazo){
  const S=G.S, prod=G.BANCO.find(p=>p.id===prodId), of=G.ofertaBanco(prod);
  if(!of.ok) return {err:of.motivo};
  if(importe>of.max) return {err:'Máximo '+fmt(of.max)+' €'};
  if(prodId==='factoring'){
    const cobra=round(importe*(1-prod.comision));
    S.caja+=cobra; let resta=importe;
    S.cobros=S.cobros.filter(c=>{ if(resta<=0) return true; resta-=c.importe; return false; });
    G.aprender('periodo-cobro'); G.log(`Factoring: cobras ${fmt(cobra)} € hoy en vez de ${fmt(importe)} € a plazo.`,'warn');
    return {ok:true, cobra, coste:importe-cobra};
  }
  if(prodId==='linea'){ S.linea.limite+=importe; G.aprender('banco-paraguas'); G.log(`Línea de crédito de ${fmt(importe)} € concedida.`,'ok'); return {ok:true}; }
  plazo=plazo||36;
  const cuota=round(importe*(of.tin/12)/(1-Math.pow(1+of.tin/12,-plazo)));
  S.caja+=importe; S.deuda+=importe;
  S.prestamos.push({id:'p'+Date.now(), importe, cuota, restan:plazo, tin:of.tin, prod:prodId});
  G.aprender('banco-paraguas'); G.xp(15);
  G.log(`Préstamo de ${fmt(importe)} € al ${(of.tin*100).toFixed(1)}%. Cuota ${fmt(cuota)} €/mes durante ${plazo} meses.`,'warn');
  return {ok:true, cuota};
};

/* ================= COMPRAR EMPRESAS ================= */
function generarMercado(){
  const S=G.S;
  S.mercado=mezclar(G.TARGETS).slice(0,5).map((t,i)=>({
    key:t.n+'_'+i, n:t.n, sec:t.sec, pub:t.pub, pide:t.pide, oc:t.oc,
    precio:round(t.pub.ebitda*t.pide/1000)*1000, descubierto:[], estado:'mercado'
  }));
}
G.regenerarMercado=generarMercado;
G.dueDiligence=function(key, areaId){
  const S=G.S, t=S.mercado.find(x=>x.key===key), a=G.DD.find(x=>x.id===areaId);
  if(!t) return {err:'Esa empresa ya no está en venta'};
  const coste=round(t.precio*a.coste/100)*100;
  if(S.caja<coste) return {err:'Cuesta '+fmt(coste)+' €'};
  if(S.energia<1) return {err:'Sin energía'};
  S.caja-=coste; S.energia--;
  const hallados=t.oc.filter(o=>a.revela.indexOf(o.id)>=0 && t.descubierto.indexOf(o.id)<0);
  hallados.forEach(o=>t.descubierto.push(o.id)); S.stats.hallazgos+=hallados.length;
  G.aprender('due-diligence'); G.xp(18);
  G.log(`Due diligence ${a.n} sobre ${t.n}: ${hallados.length?hallados.length+' hallazgo(s)':'nada raro'}. ${fmt(coste)} €.`, hallados.length?'bad':'ok');
  return {ok:true, hallados, coste};
};
G.valorar=function(t){
  if(!t) return {justo:0, ajuste:1};
  let ajuste=1;
  t.descubierto.forEach(id=>{ const o=t.oc.find(x=>x.id===id); if(o) ajuste-= o.sev*0.12; });
  return {justo:round(t.pub.ebitda*Math.max(2.2, t.pide-1)*Math.max(0.35,ajuste)/1000)*1000, ajuste};
};
G.ofertar=function(key, importe, estructura){
  const S=G.S, t=S.mercado.find(x=>x.key===key);
  if(!t) return {ok:false, msg:'Esa empresa ya no está en venta'};
  const v=G.valorar(t), suelo=round(t.precio*0.68);
  if(importe<suelo) return {ok:false, rechazo:true, msg:`"${fmt(importe)} € no. Por debajo de ${fmt(suelo)} € no me siento ni a hablar."`};
  const entrada = estructura==='earnout'? round(importe*0.5) : estructura==='deuda'? 0 : importe;
  if(estructura!=='deuda' && S.caja<entrada) return {ok:false, msg:'No tienes '+fmt(entrada)+' € en caja.'};
  // ocultos NO descubiertos te explotan después
  const bomba=t.oc.filter(o=>t.descubierto.indexOf(o.id)<0);
  S.caja-=entrada;
  if(estructura==='deuda'){ S.deuda+=importe; S.prestamos.push({id:'m'+Date.now(), importe, cuota:round(importe*0.0095/(1-Math.pow(1.0095,-60))), restan:60, tin:0.114, prod:'adq'}); }
  if(estructura==='earnout') S.flags['earnout_'+t.key]={resta:round(importe*0.5), meses:18};
  let mensual=round(t.pub.fact/12*0.82), cap=round(t.pub.fact/12*0.9);
  bomba.forEach(o=>{
    if(o.ef.factMul) mensual=round(mensual*o.ef.factMul);
    if(o.ef.debt){ S.deuda+=o.ef.debt; }
    if(o.ef.cash) S.caja+=o.ef.cash;
    if(o.ef.fijos) S.fijos+=o.ef.fijos;
    if(o.ef.moral) S.moral=clamp(S.moral+o.ef.moral,0,100);
    G.log(`Sorpresa en ${t.n}: ${o.t}`,'bad');
    G.aprender(o.cpt);
  });
  S.empresas.push({n:t.n, mensual, cap, comprada:S.dia, precio:importe, integrada:false});
  S.mercado=S.mercado.filter(x=>x.key!==key);
  if(S.mercado.length<3) generarMercado();
  G.aprender('multiplo'); if(estructura==='earnout') G.aprender('earn-out');
  G.xp(120);
  G.log(`Compras ${t.n} por ${fmt(importe)} €. Suma ${fmt(mensual)} €/mes.`, 'ok');
  return {ok:true, bomba, mensual};
};

function apuntarCobro(importe, dia){
  const S=G.S, y=S.cobros.find(c=>c.dia===dia);
  if(y) y.importe=round(y.importe+importe); else S.cobros.push({importe:round(importe), dia});
}
G.apuntarCobro=apuntarCobro;

/* ================= TICK DIARIO ================= */
G.gastoMensual=function(){
  const S=G.S;
  let g=S.fijos;
  S.equipo.forEach(e=>g+=G.costeEmpleado(e));
  S.prestamos.forEach(p=>g+=p.cuota);
  return round(g);
};
G.beneficio=function(){ return round(G.recurrente()*G.S.margen - G.gastoMensual()); };
G.runway=function(){ const b=G.beneficio(); return b>=0? Infinity : round(G.S.caja/Math.abs(b),1); };

G.finDia=function(){
  const S=G.S, d=G.dif(); const ev=[];
  // 1. cobros que vencen
  let cobrado=0;
  S.cobros=S.cobros.filter(c=>{ if(c.dia<=S.dia){ S.caja+=c.importe; cobrado+=c.importe; return false;} return true; });
  // 2. facturación del día (se cobra a plazo)
  S.clientes.forEach(c=>{
    let dia=c.mensual/30;
    if(c.satisf<45) dia*= 0.5 + c.satisf/90;          // discute facturas, pide descuentos, retiene pagos
    dia=round(dia);
    apuntarCobro(dia, S.dia + c.plazo + (c.satisf<30?30:0));
    S.ivaAcum+=dia*0.21*S.margen;                      // IVA repercutido menos el soportado
    S.stats.facturado+=dia;
  });
  S.empresas.forEach(e=>{ S.caja+=round(e.mensual/30*0.8); });
  // 3. gastos del día
  const gd=round(G.gastoMensual()/30);
  S.caja-=gd;
  // 4. capacidad y satisfacción
  const cap=G.capacidad(), car=G.carga(), ratio=car/Math.max(cap,1);
  S.clientes.forEach(c=>{
    if(ratio>1) c.satisf=clamp(c.satisf-Math.min(6,(ratio-1)*3.5),0,100);
    else c.satisf=clamp(c.satisf+0.5,0,100);
    c.meses-=1/30;
  });
  if(ratio>1.15 && S.dia%7===0){ S.moral=clamp(S.moral-3,0,100); ev.push({t:'Vais desbordados. La moral baja.',k:'bad'}); }
  // 5. fuga
  S.clientes.slice().forEach(c=>{
    let p=Math.min(0.14, 0.0022*Math.sqrt(d)*(1+Math.pow(Math.max(0,75-c.satisf)/15,2)));
    if(c.meses<=0){
      if(c.satisf>=66){ c.meses=ri(9,18); c.mensual=round(c.mensual*1.03); G.aprender('nrr');
        ev.push({t:`${c.empresa} renueva y le subes un 3%.`,k:'ok'}); }
      else p+=0.09;
    }
    if(c.prueba && S.dia-c.alta>60) p+=0.1;
    if(Math.random()<p){
      S.clientes=S.clientes.filter(x=>x.id!==c.id); S.perdidos.push(c);
      ev.push({t:`Se va ${c.empresa} (${fmt(c.mensual)} €/mes). Satisfacción ${Math.round(c.satisf)}.`,k:'bad'});
      G.aprender('churn');
    }
  });
  // 6. equipo
  S.equipo.forEach(e=>{
    const r=G.RASGOS.find(x=>x.id===e.rasgo)||{ef:{}};
    if(!e.visto && S.dia-e.alta>=r.dias){ e.visto=true; ev.push({t:`Ya conoces a ${e.nombre}: ${r.n}. ${r.desc}`, k:r.bueno===true?'ok':r.bueno===false?'bad':'info'}); }
    if(S.dia%7===0){
      if(r.ef.moralDrip) e.moral=clamp(e.moral+r.ef.moralDrip,0,100);
      if(r.ef.teamMoral) S.moral=clamp(S.moral+r.ef.teamMoral,0,100);
      if(G.output(e) < G.costeEmpleado(e)) e.moral=clamp(e.moral-1,0,100);
    }
    if(e.moral<25 && Math.random()<0.05 && !(r.ef.noSeVa)){
      S.equipo=S.equipo.filter(x=>x.id!==e.id);
      ev.push({t:`${e.nombre} dimite. Moral ${Math.round(e.moral)}.`,k:'bad'}); G.aprender('coste-rotacion');
    }
  });
  // 7. comerciales traen leads
  S.equipo.filter(e=>e.rol==='comercial').forEach(e=>{
    const rr=G.RASGOS.find(x=>x.id===e.rasgo)||{ef:{}};
    const mul=(rr.ef.leadMul&&e.visto?rr.ef.leadMul:1)*(S.flags.leadsMul||1);
    if(Math.random() < 0.10*(e.st.ventas/6)*(e.moral/72)*mul) S.leads.push(generarLead(rnd(30,70)));
  });
  // 8. leads que se pudren
  S.leads.forEach(l=>{ if(S.dia-l.ultimo>18 && l.estado!=='frio'){ l.estado='frio'; } });
  S.leads=S.leads.filter(l=>!(S.dia-l.ultimo>45));
  if(S.leads.length>42){ S.leads.sort((a,b)=>(b.q+(b.estado!=='frio'?40:0))-(a.q+(a.estado!=='frio'?40:0))); S.leads.length=42; }
  // 9. IVA trimestral
  if(S.dia%90===0 && S.ivaAcum>0){
    const iva=round(S.ivaAcum); S.caja-=iva; S.ivaAcum=0;
    ev.push({t:`Liquidación de IVA: −${fmt(iva)} €. Ese dinero nunca fue tuyo.`,k:'warn'}); G.aprender('iva-no-es-tuyo');
  }
  // 9bis. earn-outs pendientes
  Object.keys(S.flags).forEach(k=>{
    if(k.indexOf('earnout_')!==0) return;
    const e=S.flags[k]; if(S.dia%30) return;
    e.meses--;
    if(e.meses<=0){ S.caja-=e.resta;
      ev.push({t:`Vence el earn-out: pagas los ${fmt(e.resta)} € que quedaban.`,k:'warn'});
      G.aprender('earn-out'); delete S.flags[k]; }
  });
  // 10. préstamos
  if(S.linea.usado>0){
    S.caja-=round(S.linea.usado*0.11/365);                       // la línea cuesta mientras la usas
    if(S.caja>G.gastoMensual()*1.5){ const dev=round(Math.min(S.linea.usado, S.caja-G.gastoMensual()*1.5));
      S.linea.usado-=dev; S.caja-=dev; if(dev>0) G.log('Devuelves '+fmt(dev)+' € de la línea de crédito.'); }
  }
  if(S.dia%30===0) S.prestamos.forEach(p=>{ p.restan--; S.deuda=Math.max(0,S.deuda-round(p.cuota*0.7)); });
  S.prestamos=S.prestamos.filter(p=>p.restan>0);
  // 11. evento aleatorio
  if(Math.random() < clamp(0.14+ (d-1)*0.08, 0.14, 0.42)){
    const e=elegirEvento(); if(e){ ev.push({t:'⚑ '+e.tit+' — '+e.txt, k:e.cat==='crisis'?'bad':'ok', ev:e}); aplicarEvento(e); }
  }
  // 12. dilema estratégico
  let dilema=null;
  if(S.dia>12 && S.dia%9===0){
    const cand=G.DILEMAS.filter(x=>x.min<=S.dia && !S.flags['dil_'+x.id]);
    if(cand.length){ dilema=pick(cand); S.flags['dil_'+dilema.id]=1; }
  }
  // 13. conflicto de equipo
  let conflicto=null;
  if(S.equipo.length && S.dia%11===0){
    const e=pick(S.equipo);
    const cand=G.CONFLICTOS.filter(c=>trigOK(c,e));
    if(cand.length) conflicto={def:pick(cand), emp:e};
  }
  // 14. quiebra / cierre
  if(S.caja<0){
    if(S.linea.limite - S.linea.usado > -S.caja){ S.linea.usado+= -S.caja; S.caja=0; ev.push({t:'Tiras de la línea de crédito para no quedarte en números rojos.',k:'warn'}); }
    else if(!S.flags.enRojo){ S.flags.enRojo=S.dia; S.quiebras++;
      ev.push({t:'CAJA EN NEGATIVO y sin crédito. Tienes 30 días para remontar antes de cerrar.',k:'bad'}); }
    else if(S.dia - S.flags.enRojo > 30){ S.flags.cerrada=1; ev.push({t:'Se acabó. Cierras la empresa.',k:'bad'}); }
  }
  if(S.caja>=0 && S.flags.cerrada) delete S.flags.cerrada;
  if(S.caja>=0 && S.flags.enRojo){ delete S.flags.enRojo; ev.push({t:'Caja otra vez en positivo. Has salido del pozo.',k:'ok'}); }
  // 15. cierre del día
  if(S.perdidos.length>60) S.perdidos.splice(0, S.perdidos.length-60);
  S.hist.push({d:S.dia, caja:round(S.caja), rec:round(G.recurrente()), cli:S.clientes.length, eq:S.equipo.length});
  if(S.hist.length>400) S.hist.shift();
  S.dia++; S.mes=Math.ceil(S.dia/30); S.trim=Math.ceil(S.dia/90);
  S.energia=S.energiaMax + S.equipo.filter(e=>{const r=G.RASGOS.find(x=>x.id===e.rasgo)||{ef:{}}; return r.ef.energia&&e.visto;}).length
            + S.equipo.filter(e=>e.rol==='admin').length;
  const objetivo = 76 - Math.min(22,Math.max(0,(car/Math.max(cap,1)-1)*14)) - (S.caja<0?15:0) - Math.min(10,S.stats.despidos*2);
  S.moral += clamp((objetivo-S.moral)*0.11, -1.5, 3.5);
  S.moral = clamp(S.moral,0,100);
  if(S.dia%10===0) S.repu=clamp(S.repu-0.6,0,92);
  if(S.dia%7===0){
    const mal=S.clientes.filter(c=>c.satisf<40).length, bien=S.clientes.filter(c=>c.satisf>75).length;
    if(mal) S.repu=clamp(S.repu - Math.min(6, mal*0.9), 0, 92);
    else if(bien) S.repu=clamp(S.repu + Math.min(2, bien*0.3), 0, 92);
  }
  G.xp(5);
  G.guardar();
  return {ev, cobrado, gd, dilema, conflicto, cap, car, ratio};
};
function trigOK(c,e){
  const S=G.S;
  if(c.trig==='always') return Math.random()<0.5;
  if(c.trig==='antiguedad>180') return S.dia-e.alta>180;
  if(c.trig==='equipo>=3') return S.equipo.length>=3;
  if(c.trig==='output<coste') return G.output(e)<G.costeEmpleado(e);
  if(c.trig==='moral<35') return e.moral<35;
  if(c.trig==='moral<55') return e.moral<55;
  if(c.trig==='nivel>=3') return S.nivel>=3;
  return false;
}
function elegirEvento(){
  const S=G.S, d=G.dif();
  const cand=G.EVENTOS.filter(e=>e.min<=S.dia).filter(e=>{
    if(e.ef.dimite||e.ef.baja||e.ef.robaCartera) return S.equipo.length>0;
    if(e.ef.bajaMayor||e.ef.impago||e.ef.satisfaccion||e.ef.upsell||e.ef.recupera) return S.clientes.length>0;
    return true;
  });
  if(!cand.length) return null;
  const pesos=cand.map(e=>e.p * (e.cat==='crisis'? d : 1/Math.max(d,0.5)));
  let t=pesos.reduce((a,b)=>a+b,0)*Math.random();
  for(let i=0;i<cand.length;i++){ t-=pesos[i]; if(t<=0) return cand[i]; }
  return cand[0];
}
function aplicarEvento(e){
  const S=G.S, f=e.ef;
  if(f.cash) S.caja+=f.cash;
  if(f.repu) S.repu=clamp(S.repu+f.repu,0,100);
  if(f.moral) S.moral=clamp(S.moral+f.moral,0,100);
  if(f.fijos) S.fijos+=f.fijos;
  if(f.fijosMul) S.fijos=round(S.fijos*f.fijosMul);
  if(f.lineaMul) S.linea.limite=round(S.linea.limite*f.lineaMul);
  if(f.bajaMayor && S.clientes.length){ S.clientes.sort((a,b)=>b.mensual-a.mensual); const c=S.clientes.shift(); S.perdidos.push(c); }
  if(f.impago && S.cobros.length){ const c=pick(S.cobros); c.dia+=74; S.flags.impagado=S.dia; }
  if(f.dimite && S.equipo.length){ const x=pick(S.equipo); S.equipo=S.equipo.filter(y=>y.id!==x.id); }
  if(f.satisfaccion && S.clientes.length){ pick(S.clientes).satisf+=f.satisfaccion; }
  if(f.leadCaliente) S.leads.push(generarLead(88));
  if(f.leadGrande){ const l=generarLead(80); l.ticket=round(l.ticket*3.4/10)*10; S.leads.push(l); }
  if(f.leadsBonus) for(let i=0;i<f.leadsBonus;i++) S.leads.push(generarLead(rnd(45,75)));
  if(f.recupera && S.perdidos.length){ const c=S.perdidos.pop(); c.satisf=65; S.clientes.push(c); }
  if(f.margen) S.margen=clamp(S.margen+f.margen,0.2,0.9);
  if(f.presionPrecio) S.clientes.forEach(c=>c.mensual=round(c.mensual*(1-f.presionPrecio/3)));
  if(f.subvencion) S.caja+=round(rnd(3000,9000)/100)*100;
  if(f.inspeccion){ const multa=round(Math.max(900, S.stats.facturado*0.035)/100)*100;
    const blindado=S.equipo.some(x=>x.extra&&x.extra.blindaHacienda);
    if(blindado){ G.log('Tu contable responde el requerimiento. Sin multa.','ok'); }
    else { S.caja-=multa; S.energia=Math.max(0,S.energia-2); G.log('Inspección: '+fmt(multa)+' € y dos días perdidos en papeles.','bad'); } }
  if(f.cacMul){ S.cacMul=(S.cacMul||1)*f.cacMul; }
  if(f.robaCartera && S.equipo.length && S.clientes.length){
    const x=pick(S.equipo); S.equipo=S.equipo.filter(y=>y.id!==x.id);
    const n=Math.max(1,Math.round(S.clientes.length*0.15));
    for(let i=0;i<n;i++){ const c=S.clientes.pop(); if(c) S.perdidos.push(c); } }
  if(f.candidatoTop) S.flags.candidatoTop=S.dia;
  if(f.concurso) S.flags.concurso={importe:round(rnd(9000,26000)/500)*500, hasta:S.dia+14};
  if(f.alianza){ S.flags.alianza=S.dia; for(let i=0;i<2;i++) S.leads.push(generarLead(rnd(55,85))); }
  if(f.upsell && S.clientes.length){ const c=pick(S.clientes);
    if(c.satisf>55){ const sube=round(c.mensual*0.28); c.mensual=round(c.mensual+sube);
      G.log(c.empresa+' amplía: +'+fmt(sube)+' €/mes.','ok'); G.aprender('upsell'); } }
  if(f.cptRef) G.aprender(f.cptRef);
  G.aprender(e.cpt);
}

/* ---- resolver dilema / conflicto ---- */
G.resolverDilema=function(dil, idx){
  const S=G.S, o=dil.op[idx], f=o.ef||{};
  if(f.moral) S.moral=clamp(S.moral+f.moral,0,100);
  if(f.repu) S.repu=clamp(S.repu+f.repu,0,100);
  if(f.energiaMax) S.energiaMax=Math.max(2,S.energiaMax+f.energiaMax);
  if(f.margen) S.margen=clamp(S.margen+f.margen,0.15,0.9);
  if(typeof f.cash==='number'){ S.caja += Math.abs(f.cash)>10 ? f.cash : f.cash*round(Math.max(2500,G.recurrente()*0.6)); }
  if(f.fijos) S.fijos+=900;
  if(f.satisfaccion) S.clientes.forEach(c=>c.satisf=clamp(c.satisf+f.satisfaccion,0,100));
  if(f.precioDown){ S.clientes.forEach(c=>c.mensual=round(c.mensual*(1-f.precioDown/2))); S.flags.guerraPrecios=1; }
  if(f.nuevaLinea){ S.flags.nuevaLinea=1; S.margen=clamp(S.margen-0.04,0.15,0.9); for(let i=0;i<2;i++) S.leads.push(generarLead(rnd(35,70))); }
  if(f.contrataYa){ S.flags.contrataYa=1; S.caja-=round(rnd(900,1600)); }
  if(f.capacidadRiesgo) S.flags.capacidadRiesgo=S.dia;
  if(f.freelance){ S.flags.freelance=1; S.fijos+=0; S.attrs.operaciones=clamp(S.attrs.operaciones+1,1,10); }
  if(f.aplaza){ const iva=round(S.ivaAcum); S.ivaAcum=0; S.deuda+=round(iva*1.05);
    S.prestamos.push({id:'h'+Date.now(), importe:round(iva*1.05), cuota:round(iva*1.05/12), restan:12, tin:0.0625, prod:'hacienda'});
    G.log('Aplazas '+fmt(iva)+' € de IVA a doce meses con recargo.','warn'); }
  if(f.tiraLinea){ const iva=round(S.ivaAcum), libre=S.linea.limite-S.linea.usado;
    if(libre<=0){ S.caja-=iva; S.ivaAcum=0; G.log('No tenías línea de la que tirar, así que sale de caja. Para eso se pide cuando vas bien.','bad'); }
    else { const usa=round(Math.min(libre, iva)); S.linea.usado+=usa; S.caja+=usa; S.caja-=iva; S.ivaAcum=0;
      G.log('Tiras '+fmt(usa)+' € de la línea y liquidas el IVA.','warn'); } }
  if(f.marca){ S.flags.marca=S.dia; }
  if(f.adsBoost){ S.flags.adsBoost=S.dia; for(let i=0;i<3;i++) S.leads.push(generarLead(rnd(25,55))); }
  if(f.leadsMul) S.flags.leadsMul=f.leadsMul;
  if(f.cierreUp) S.flags.cierreUp=f.cierreUp;
  if(f.deudaCliente){ S.flags.deudaCliente=round(Math.max(1500,G.recurrente()*0.7)); }
  if(f.planPago){ const imp=round(Math.max(1200,G.recurrente()*0.5)); apuntarCobro(imp, S.dia+45); G.log('Plan de pagos firmado: '+fmt(imp)+' € a 45 días.','ok'); }
  if(f.fichaDir){ const c=G.candidatos(6).filter(x=>x.rol==='comercial').sort((a,b)=>b.st.ventas-a.st.ventas)[0];
    if(c){ c.bruto=round(c.bruto*1.25); c.coste=round(c.bruto*1.32); const r=G.contratar(c); if(r.err) G.log('No tenías caja para el fichaje.','bad'); } }
  if(f.cuelloBotella) S.flags.cuelloBotella=1;
  if(f.referidos) for(let i=0;i<f.referidos;i++){ const l=generarLead(rnd(60,92)); l.origen='referido'; S.leads.push(l); }
  if(f.precioUp && S.clientes.length){ const c=S.clientes[0]; c.mensual=round(c.mensual*(1+f.precioUp)); }
  if(f.bajaEspecifica && S.clientes.length){ const c=S.clientes.shift(); S.perdidos.push(c); }
  if(f.riesgoBaja && S.clientes.length && Math.random()<f.riesgoBaja){ const c=S.clientes.shift(); S.perdidos.push(c); }
  if(f.capacidad) S.attrs.operaciones=clamp(S.attrs.operaciones+(f.capacidad>0?1:-1),1,10);
  if(f.nicho){ S.flags.nicho=1; }
  if(f.procesoVentas){ S.flags.proceso=1; S.attrs.ventas=clamp(S.attrs.ventas+1,1,10); }
  if(f.socio){ S.caja+=round(G.recurrente()*12*f.socio*1.4); S.flags.socio=f.socio; }
  const c=G.aprender(o.cpt); G.xp(30); G.guardar();
  return {fb:o.fb, cpt:c};
};
G.resolverConflicto=function(cf, emp, idx){
  const S=G.S, o=cf.res[idx];
  emp.moral=clamp(emp.moral+(o.m||0),0,100);
  if(o.teamMoral) S.moral=clamp(S.moral+o.teamMoral,0,100);
  if(o.coste){ emp.bruto=round(emp.bruto*(1+o.coste)); emp.coste=round(emp.bruto*1.32); }
  if(o.energia) S.energia=Math.max(0,S.energia+o.energia);
  if(o.despido) G.despedir(emp.id);
  if(o.riesgoFuga && Math.random()<o.riesgoFuga){
    S.equipo=S.equipo.filter(x=>x.id!==emp.id);
    G.log(`${emp.nombre} se va.`,'bad'); G.aprender('coste-rotacion');
  }
  const c=G.aprender(o.cpt); G.xp(22); G.guardar();
  return {fb:o.fb, cpt:c};
};

/* ---- interpolación de textos ---- */
function interpolar(t, lead, neg){
  const S=G.S;
  return t.replace(/\{(\w+)\}/g, (m,k)=>{
    if(k==='coste') return fmt(neg&&neg.reveal.coste||lead.hidden.coste);
    if(k==='precio') return fmt(neg?neg.precio:lead.ticket);
    if(k==='dolorSector') return lead.dolorSec;
    if(k==='referencia') return S.clientes.length?S.clientes[0].empresa:'un cliente nuestro';
    if(k==='motivo') return pick(['que nadie lo usó','que no había nadie responsable dentro','que se prometió más de lo que se podía']);
    if(k==='condicion') return pick(['de si tenéis a alguien dentro que lo empuje','de si el volumen os compensa','de si podéis esperar tres meses']);
    if(k==='prueba') return 'un piloto de un mes';
    return m;
  });
}
G.interpolar=interpolar;
function fmt(n){ return (Math.round(n)||0).toLocaleString('es-ES'); }
G.fmt=fmt;

})(window.IMP);
