global.window=global; global.IMP={};
global.localStorage={_:{},getItem(k){return this._[k]||null},setItem(k,v){this._[k]=v},removeItem(k){delete this._[k]}};
const fs=require('fs');
['data/concepts.js','data/sales.js','data/people.js','data/world.js','engine.js'].forEach(f=>eval(fs.readFileSync(f,'utf8')));
const G=IMP, P=a=>a[Math.floor(Math.random()*a.length)];
G.nuevo();
const DIAS=+(process.argv[2]||90);
let negs=0, cierres=0, err=[];
for(let d=0; d<DIAS; d++){
  try{
    // gastar energía
    let guard=0;
    while(G.S.energia>0 && guard++<12){
      const r=Math.random();
      if(r<0.42){ const c=P(G.CANALES.filter(c=>!G.canalDisponible(c))); if(c) G.prospectar(c.id); else break; }
      else if(r<0.85){
        const l=P(G.S.leads.filter(l=>l.estado!=='frio'));
        if(l){ const neg=G.abrirNeg(l.id); if(neg&&!neg.err){ negs++;
            let g2=0;
            while(G.S.pend && g2++<25){
              const ctx=G.opciones(neg); if(!ctx||!ctx.ops||!ctx.ops.length) break;
              if(ctx.tipo==='pregunta' && Math.random()<0.35){ neg.fase='propuesta'; continue; }
              const op=P(ctx.ops); const res=G.jugar(neg, op.id||op.t);
              if(res.fin){ if(res.fin==='ganada') cierres++; break; }
            }
            G.S.pend=null;
        }} else break;
      }
      else { const l=P(G.S.leads.filter(l=>l.estado==='frio')); if(l) G.seguir(l.id); else break; }
    }
    // acciones sueltas
    if(d%14===0 && G.S.caja>6000){ const c=G.candidatos(3)[0]; if(c&&G.S.nivel>=2) G.contratar(c); }
    if(d===40) G.pedir('linea', 8000);
    const cajaAntes=G.S.caja;
    const fin=G.finDia();
    if(fin.dilema) G.resolverDilema(fin.dilema, Math.floor(Math.random()*fin.dilema.op.length));
    if(fin.conflicto) G.resolverConflicto(fin.conflicto.def, fin.conflicto.emp, Math.floor(Math.random()*fin.conflicto.def.res.length));
    if(!isFinite(G.S.caja)||isNaN(G.S.caja)) throw new Error('caja NaN día '+d);
  }catch(e){ err.push('día '+d+': '+e.message+'\n'+e.stack.split('\n')[1]); if(err.length>3) break; }
}
const S=G.S, f=G.fmt;
console.log('=== '+DIAS+' días ===');
console.log('nivel',S.nivel,G.rango().r,'| caja',f(S.caja),'| recurrente',f(G.recurrente()),'€/mes | benef',f(G.beneficio()),'| deuda',f(S.deuda));
console.log('clientes',S.clientes.length,'| perdidos',S.perdidos.length,'| leads',S.leads.length,'| equipo',S.equipo.length);
console.log('negociaciones',negs,'| cierres',cierres,'| ratio',(cierres/Math.max(negs,1)*100).toFixed(0)+'%');
console.log('códex',Object.keys(S.codex).length+'/'+G.CONCEPTS.length,'| toques',S.stats.toques,'| noes',S.stats.noes);
console.log('capacidad',f(G.capacidad()),'| carga',f(G.carga()),'| moral',Math.round(S.moral),'| repu',Math.round(S.repu),'| dif',G.dif().toFixed(2));
console.log('quiebras',S.quiebras,'| energía max',S.energiaMax);
if(err.length){ console.log('\n✗ ERRORES:'); err.forEach(e=>console.log(e)); process.exit(1); }
else console.log('\n✓ sin errores');
