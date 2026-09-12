/* IMPERIO — la oficina dibujada. Crece contigo. */
window.IMP = window.IMP || {};
(function(G){
'use strict';

G.TIERS=[
 {min:1,  id:'garaje', n:'El garaje',  desc:'Una mesa plegable y una bombilla.'},
 {min:6,  id:'local',  n:'El local',   desc:'Un bajo con ventana. Ya no es el garaje.'},
 {min:12, id:'oficina',n:'La oficina', desc:'Sala de reuniones de verdad y café.'},
 {min:20, id:'planta', n:'La planta',  desc:'Ventanal a la ciudad y sitio para todos.'},
 {min:30, id:'sede',   n:'La sede',    desc:'Desde aquí ya no vendes: decides.'}
];
G.tier=function(){ let t=G.TIERS[0]; G.TIERS.forEach(x=>{ if(G.S.nivel>=x.min) t=x; }); return t; };

const P={ pared:'#141B27', pared2:'#0F141E', suelo:'#0C1017', suelo2:'#111826',
  mueble:'#1C2536', mueble2:'#243047', borde:'#33415C', oro:'#F2A93B', verde:'#35D0A5',
  rojo:'#FF5C5C', vio:'#7C6BFF', gente:'#7E8BA3', tela:'#2A3549' };

/* --- piezas --- */
function persona(x, y, esc, col, moral){
  const s=esc||1, c=col||P.gente;
  const inclina = moral!==undefined && moral<40 ? 3 : 0;
  return `<g transform="translate(${x},${y}) scale(${s})">
    <circle cx="0" cy="${-13+inclina}" r="4.4" fill="${c}"/>
    <path d="M-5.4 ${0+inclina} q0 -8 5.4 -8 q5.4 0 5.4 8 z" fill="${c}" opacity=".92"/>
  </g>`;
}
function mesa(x,y,w,h){
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${P.mueble}" stroke="${P.borde}" stroke-width=".7"/>
    <rect x="${x}" y="${y}" width="${w}" height="2.4" fill="${P.mueble2}"/>
    <rect x="${x+2}" y="${y+h}" width="2.6" height="9" fill="${P.mueble}"/>
    <rect x="${x+w-4.6}" y="${y+h}" width="2.6" height="9" fill="${P.mueble}"/>`;
}
function monitor(x,y,on){
  return `<rect x="${x}" y="${y-11}" width="15" height="10" rx="1" fill="#0A0E16" stroke="${P.borde}" stroke-width=".6"/>
    ${on?`<rect x="${x+1.4}" y="${y-9.6}" width="12.2" height="7.2" fill="${P.oro}" opacity=".16"/>`:''}
    <rect x="${x+6}" y="${y-1}" width="3" height="2" fill="${P.borde}"/>`;
}
function planta(x,y){
  return `<path d="M${x} ${y} l-3.4 -9 M${x} ${y} l3.6 -10 M${x} ${y} l0 -12" stroke="${P.verde}" stroke-width="1.5" fill="none" opacity=".55" stroke-linecap="round"/>
   <path d="M${x-4.4} ${y} h8.8 l-1.2 7 h-6.4 z" fill="${P.mueble2}"/>`;
}

/* --- escena --- */
G.oficinaSVG=function(){
  const S=G.S, t=G.tier(), lvl=S.nivel;
  const cal=S.leads.filter(l=>l.estado!=='frio').length;
  const malos=S.clientes.filter(c=>c.satisf<45).length;
  const car=G.carga(), cap=G.capacidad(), sobre=car>cap*1.02;
  const eq=S.equipo.slice(0,8), extra=Math.max(0,S.equipo.length-8);
  const W=400, H=560, SU=300;                 // suelo
  const grande=(t.id==='oficina'||t.id==='planta'||t.id==='sede');
  let o='';

  /* techo, pared, suelo */
  o+=`<rect x="0" y="0" width="${W}" height="${SU}" fill="${P.pared}"/>`;
  o+=`<rect x="0" y="0" width="${W}" height="20" fill="#090D15"/>`;
  o+=`<rect x="0" y="${SU}" width="${W}" height="${H-SU}" fill="${P.suelo}"/>`;
  o+=`<path d="M0 ${SU} H${W} V${SU+10} H0 Z" fill="${P.suelo2}"/>`;
  o+=`<rect x="0" y="${SU-10}" width="${W}" height="10" fill="${P.pared2}"/>`;
  if(t.id==='garaje'){
    for(let y=24;y<SU-12;y+=16) for(let x=((y/16)|0)%2?0:-14;x<W;x+=29)
      o+=`<rect x="${x}" y="${y}" width="27" height="14" fill="none" stroke="#1A2233" stroke-width=".6"/>`;
  } else o+=`<rect x="0" y="20" width="${W}" height="${SU-30}" fill="url(#gPared)"/>`;
  o+=`<rect x="0" y="${SU+10}" width="${W}" height="1" fill="#182031"/>`;
  

  /* lámpara */
  o+=`<line x1="129" y1="20" x2="129" y2="52" stroke="${P.borde}" stroke-width="1"/>
      <path d="M112 62 q17 -16 34 0 z" fill="${P.mueble2}"/>
      <circle cx="129" cy="64" r="4" fill="${P.oro}"/>
      <path d="M100 ${SU-6} q29 -84 58 0 z" fill="${P.oro}" opacity=".05"/>`;

  /* ventana */
  if(t.id!=='garaje'){
    const vw = t.id==='local'?96: t.id==='oficina'?120:148, vx=W-10-vw, vy=54, vh=(t.id==='planta'||t.id==='sede')?112:88;
    o+=`<rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="#080D16" stroke="${P.borde}" stroke-width="1.3"/>`;
    let sx=vx+3;
    while(sx<vx+vw-5){ const bw=5+Math.round((Math.sin(sx*1.7)+1)*6), bh=14+Math.round((Math.cos(sx*0.9)+1)*(vh*0.3));
      o+=`<rect x="${sx}" y="${vy+vh-bh}" width="${bw}" height="${bh}" fill="#141C2B"/>`;
      for(let wy=vy+vh-bh+5; wy<vy+vh-4; wy+=7) for(let wx=sx+1.6; wx<sx+bw-2.4; wx+=4.5)
        if((Math.round(wx)+Math.round(wy))%7<3) o+=`<rect x="${wx}" y="${wy}" width="1.8" height="2.6" fill="${P.oro}" opacity=".42"/>`;
      sx+=bw+2.4; }
    o+=`<line x1="${vx+vw/2}" y1="${vy}" x2="${vx+vw/2}" y2="${vy+vh}" stroke="${P.borde}" stroke-width="1.1"/>
        <line x1="${vx}" y1="${vy+vh/2}" x2="${vx+vw}" y2="${vy+vh/2}" stroke="${P.borde}" stroke-width=".8"/>`;
  }

  /* reloj */
  o+=`<circle cx="184" cy="86" r="17" fill="#0D1420" stroke="${P.borde}" stroke-width="1.1"/>
      <text x="184" y="83" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="7.6" fill="#5C6679">DÍA</text>
      <text x="184" y="95" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="11" font-weight="600" fill="${P.oro}">${S.dia}</text>`;

  /* PIZARRA */
  const mi=G.misionActual(), prog=Object.keys(S.misiones).length/G.TUTORIAL.length;
  o+=`<g class="hot" data-z="objetivos" tabindex="0" role="button" aria-label="Objetivos">
    <rect class="hl" x="18" y="48" width="146" height="102" fill="${P.oro}" opacity="0"/>
    <rect x="22" y="52" width="138" height="94" fill="#0D1420" stroke="${P.borde}" stroke-width="1.3"/>
    <rect x="22" y="52" width="138" height="10" fill="${P.mueble2}"/>
    <text x="31" y="80" fill="${P.oro}" font-family="IBM Plex Mono,monospace" font-size="8.6" letter-spacing="1.1">OBJETIVO</text>
    ${mi? envolver(mi.m.t, 31, 99, 19, 13, '#DCE3EF', 11.4) : `<text x="31" y="99" fill="${P.verde}" font-size="11.4" font-family="IBM Plex Sans,sans-serif">Todo hecho.</text>`}
    <rect x="31" y="133" width="120" height="2.6" fill="#1E2839"/>
    <rect x="31" y="133" width="${Math.max(2,120*prog)}" height="2.6" fill="${P.verde}"/>
  </g>`;

  /* PUERTA */
  o+=`<g class="hot" data-z="ciudad" tabindex="0" role="button" aria-label="Salir a la ciudad">
    <rect class="hl" x="8" y="172" width="74" height="136" fill="${P.oro}" opacity="0"/>
    <rect x="12" y="176" width="66" height="124" fill="${P.pared2}" stroke="${P.borde}" stroke-width="1.3"/>
    <rect x="18" y="182" width="54" height="118" fill="#0A0E16"/>
    <circle cx="66" cy="244" r="2.6" fill="${P.oro}"/>
    ${cal===0?`<circle cx="74" cy="184" r="6" fill="${P.oro}"><animate attributeName="opacity" values="1;.25;1" dur="1.8s" repeatCount="indefinite"/></circle>`:''}
    <text x="45" y="326" text-anchor="middle" fill="${P.oro}" font-family="IBM Plex Mono,monospace" font-size="10" letter-spacing="1.1">CALLE</text>
  </g>`;

  /* TU MESA */
  o+=`<g class="hot" data-z="despacho" tabindex="0" role="button" aria-label="Tu mesa">
    <rect class="hl" x="86" y="228" width="94" height="86" fill="${P.oro}" opacity="0"/>
    ${mesa(90,254,84,8)}
    ${monitor(110,254,true)}
    <rect x="138" y="248" width="22" height="6" fill="${P.mueble2}"/>
    ${persona(131,296,1.6,P.oro)}
    <text x="131" y="326" text-anchor="middle" fill="#8794AA" font-family="IBM Plex Mono,monospace" font-size="10" letter-spacing="1.1">TU MESA</text>
  </g>`;

  /* SALA DE REUNIONES */
  o+=`<g class="hot" data-z="sala" tabindex="0" role="button" aria-label="Sala de reuniones">
    <rect class="hl" x="184" y="196" width="108" height="118" fill="${P.oro}" opacity="0"/>
    ${grande?`<line x1="186" y1="196" x2="186" y2="${SU}" stroke="${P.borde}" stroke-width="1.1" opacity=".8"/>
              <line x1="288" y1="196" x2="288" y2="${SU}" stroke="${P.borde}" stroke-width="1.1" opacity=".8"/>
              <line x1="186" y1="196" x2="288" y2="196" stroke="${P.borde}" stroke-width="1.1" opacity=".8"/>
              <rect x="186" y="196" width="102" height="104" fill="#0E1622" opacity=".38"/>`:''}
    <ellipse cx="237" cy="268" rx="46" ry="11" fill="${P.mueble}" stroke="${P.borde}" stroke-width=".8"/>
    <ellipse cx="237" cy="265" rx="46" ry="11" fill="${P.mueble2}"/>
    <rect x="234" y="276" width="6" height="14" fill="${P.mueble}"/>
    ${persona(203,262,1.3)}${persona(271,262,1.3)}
    ${cal? `<circle cx="284" cy="206" r="11" fill="${P.oro}"/><text x="284" y="210" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="12" font-weight="600" fill="#12151C">${cal>9?'9+':cal}</text>`:''}
    <text x="237" y="326" text-anchor="middle" fill="#8794AA" font-family="IBM Plex Mono,monospace" font-size="10" letter-spacing="1.1">REUNIONES</text>
  </g>`;

  /* ENTREGA */
  o+=`<g class="hot" data-z="taller" tabindex="0" role="button" aria-label="Entrega">
    <rect class="hl" x="294" y="196" width="100" height="118" fill="${P.oro}" opacity="0"/>
    <rect x="300" y="216" width="88" height="5" fill="${P.mueble2}"/>
    ${[0,1,2,3,4].map(i=>`<rect x="${302+i*17.5}" y="${202}" width="13" height="14" fill="${i<Math.min(5,S.clientes.length)?P.mueble2:'#151C2A'}" stroke="${P.borde}" stroke-width=".5"/>`).join('')}
    ${mesa(300,254,40,7)}${mesa(348,254,40,7)}
    ${monitor(307,254,S.clientes.length>0)}${monitor(355,254,S.clientes.length>1)}
    ${eq.slice(0,2).map((e,i)=>persona(320+i*48,296,1.3,P.gente,e.moral)).join('')}
    ${sobre?`<g><rect x="330" y="228" width="42" height="16" fill="${P.rojo}"/><text x="351" y="240" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="10" fill="#12151C" font-weight="600">TOPE</text></g>`:''}
    ${malos?`<circle cx="303" cy="236" r="8" fill="${P.rojo}"><animate attributeName="opacity" values="1;.3;1" dur="1.4s" repeatCount="indefinite"/></circle>
             <text x="303" y="239.6" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="10" font-weight="600" fill="#12151C">${malos}</text>`:''}
    <text x="344" y="326" text-anchor="middle" fill="#8794AA" font-family="IBM Plex Mono,monospace" font-size="10" letter-spacing="1.1">ENTREGA</text>
  </g>`;

  /* EQUIPO: dos filas delante */
  o+=`<g class="hot" data-z="equipo" tabindex="0" role="button" aria-label="Equipo">
    <rect class="hl" x="12" y="340" width="376" height="210" fill="${P.oro}" opacity="0"/>`;
  if(eq.length){
    eq.forEach((e,i)=>{ const fila=i<4?0:1, col=i%4;
      const x=62+col*92, y=386+fila*94;
      o+=mesa(x-31,y,62,8)+monitor(x-18,y,true)+persona(x,y+36,1.55,P.gente,e.moral);
    });
    if(extra) o+=`<text x="360" y="500" fill="${P.oro}" font-family="IBM Plex Mono,monospace" font-size="15" font-weight="600">+${extra}</text>`;
  } else {
    o+=`<rect x="60" y="386" width="280" height="112" fill="none" stroke="#1D2534" stroke-width="1.4" stroke-dasharray="6 6"/>
        <text x="200" y="432" text-anchor="middle" fill="#66718A" font-family="IBM Plex Sans,sans-serif" font-size="14" font-style="italic">Aquí no hay nadie.</text>
        <text x="200" y="452" text-anchor="middle" fill="#66718A" font-family="IBM Plex Sans,sans-serif" font-size="14" font-style="italic">Estás tú solo.</text>
        <text x="200" y="478" text-anchor="middle" fill="#3E4759" font-family="IBM Plex Mono,monospace" font-size="9.6" letter-spacing="1">MESAS DEL EQUIPO</text>`;
  }
  o+=`</g>`;

  /* decoración */
  if(lvl>=6) o+=planta(86,SU);
  if(lvl>=12) o+=`<rect x="190" y="${SU-34}" width="16" height="34" fill="${P.mueble}" stroke="${P.borde}" stroke-width=".7"/>
                  <rect x="194" y="${SU-27}" width="8" height="6" fill="${P.oro}" opacity=".35"/>`;
  if(lvl>=20) o+=planta(392,SU);
  if(lvl>=30) o+=`<rect x="24" y="176" width="58" height="0" fill="none"/>`;

  return `<svg id="svgof" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Tu oficina">
    <defs><linearGradient id="gPared" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#18202E"/><stop offset="1" stop-color="#0F141E"/></linearGradient></defs>
    ${o}</svg>`;
};
function envolver(txt,x,y,max,lh,fill,fs){
  const pal=txt.split(' '); let l='', out='', n=0;
  pal.forEach(p=>{ if((l+' '+p).trim().length>max){ out+=`<text x="${x}" y="${y+n*lh}" fill="${fill}" font-family="IBM Plex Sans,sans-serif" font-size="${fs}">${esc(l)}</text>`; l=p; n++; } else l=(l+' '+p).trim(); });
  if(l) out+=`<text x="${x}" y="${y+n*lh}" fill="${fill}" font-family="IBM Plex Sans,sans-serif" font-size="${fs}">${esc(l)}</text>`;
  return out;
}
function esc(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
})(window.IMP);
