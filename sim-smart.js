global.window=global; global.IMP={};
global.localStorage={_:{},getItem(k){return this._[k]||null},setItem(k,v){this._[k]=v},removeItem(k){delete this._[k]}};
const fs=require('fs');
['data/concepts.js','data/sales.js','data/people.js','data/world.js','data/misiones.js','engine.js'].forEach(f=>eval(fs.readFileSync(f,'utf8')));
const G=IMP, P=a=>a[Math.floor(Math.random()*a.length)];
const val=o=>(o.i||0)*0.62+(o.c||0)*0.38;
G.nuevo();
['despacho','pipeline','cartera','equipo','codex','taller','calle','sala'].forEach(k=>G.S.flags['visto_'+k]=1);
const DIAS=+(process.argv[2]||120); let negs=0,cierres=0,err=[];
for(let d=0;d<DIAS;d++){ try{
  let g=0;
  while(G.S.energia>0 && g++<14){
    const calientes=G.S.leads.filter(l=>l.estado!=='frio');
    if(calientes.length && Math.random()<0.62){
      const l=calientes.sort((a,b)=>b.q-a.q)[0]; const neg=G.abrirNeg(l.id);
      if(neg&&!neg.err){ negs++; let g2=0;
        while(G.S.pend&&g2++<28){
          const ctx=G.opciones(neg); if(!ctx||!ctx.ops||!ctx.ops.length) break;
          if(ctx.tipo==='pregunta' && (Object.keys(neg.reveal).length>=4||neg.paciencia<=3)){ neg.fase='propuesta'; continue; }
          let op;
          if(ctx.tipo==='cierre'){ const s=neg.interes*.62+neg.confianza*.38+Object.keys(neg.reveal).length*3.2;
            op=ctx.ops.filter(o=>o.umbral<=s).sort((a,b)=>b.umbral-a.umbral)[0]||ctx.ops.find(o=>o.id==='siguiente')||ctx.ops[0]; }
          else if(ctx.tipo==='precio') op=ctx.ops.find(o=>o.id==='tres')||ctx.ops.find(o=>o.id==='medio');
          else op=ctx.ops.slice().sort((a,b)=>val(b)-val(a))[0];
          const r=G.jugar(neg,op.id||op.t); if(r.fin){ if(r.fin==='ganada')cierres++; break; }
        } G.S.pend=null; }
    } else {
      const c=G.CANALES.filter(c=>!G.canalDisponible(c)).sort((a,b)=>(b.cal[1]-b.rech*50)-(a.cal[1]-a.rech*50))[0];
      if(c) G.prospectar(c.id);
      else { const l=P(G.S.leads.filter(l=>l.estado==='frio')); if(l) G.seguir(l.id); else break; }
    }
  }
  if(G.S.caja>9000 && G.S.equipo.length<Math.floor(G.S.nivel/3)){ const c=G.candidatos(4).sort((a,b)=>(b.st.ejec+b.st.ventas)-(a.st.ejec+a.st.ventas))[0]; if(c) G.contratar(c); }
  G.revisarMisiones();
  const fin=G.finDia();
  if(fin.dilema) G.resolverDilema(fin.dilema,0);
  if(fin.conflicto) G.resolverConflicto(fin.conflicto.def, fin.conflicto.emp, 0);
}catch(e){ err.push('día '+d+': '+e.message+' | '+e.stack.split('\n')[1]); if(err.length>2)break; } }
const S=G.S,f=G.fmt;
console.log('nivel',S.nivel,G.rango().r,'| caja',f(S.caja),'| recurrente',f(G.recurrente()),'| benef',f(G.beneficio()));
console.log('clientes',S.clientes.length,'| perdidos',S.perdidos.length,'| equipo',S.equipo.length,'| leads',S.leads.length);
console.log('cierre',(cierres/Math.max(negs,1)*100).toFixed(0)+'% ('+cierres+'/'+negs+') | códex',Object.keys(S.codex).length+'/'+G.CONCEPTS.length);
console.log('misiones',Object.keys(S.misiones).length+'/'+G.TUTORIAL.length,'| objetivos',Object.keys(S.objetivos).length+'/'+G.OBJETIVOS.length);
console.log('dif',G.dif().toFixed(2),'| moral',Math.round(S.moral),'| cerrada:',!!S.flags.cerrada,'| quiebras',S.quiebras);
if(err.length){console.log('✗',err.join('\n'));process.exit(1);}
