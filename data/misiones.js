/* IMPERIO — Misiones. El tutorial va en orden; los objetivos se cumplen cuando toque. */
window.IMP = window.IMP || {};

IMP.TUTORIAL = [
 {id:'t1', t:'Mira tus números', d:'Entra en tu mesa y mira de qué vas.', pista:'Toca TU MESA, dentro de la oficina.',
  ir:'despacho', xp:20, check:S=>S.flags.visto_despacho,
  hecho:'Ese es tu cuadro de mandos. El número que importa hoy no es la caja: es el punto muerto, lo que tienes que facturar para no perder dinero.'},

 {id:'t2', t:'Sal a la calle', d:'Haz una ronda de prospección. La que sea.', pista:'Sal por la puerta → LA CALLE → elige un canal.',
  ir:'calle', xp:25, check:S=>S.stats.prospecciones>=1,
  hecho:'Has visto más noes que síes. Es la tasa, no eres tú. Lo raro sería lo contrario.'},

 {id:'t3', t:'Mira lo que ha entrado', d:'Abre el pipeline y mira a quién tienes.', pista:'Botón PIPELINE, abajo.',
  ir:'pipeline', xp:15, check:S=>S.flags.visto_pipeline,
  hecho:'Fíjate en la previsión ponderada, no en la suma. Sumar todo lo abierto como si fuera a entrar es cómo se arruina la gente optimista.'},

 {id:'t4', t:'Tu primera llamada', d:'Coge a alguien del pipeline y trabájatelo.', pista:'En el pipeline, LLAMAR Y TRABAJARLO.',
  ir:'pipeline', xp:25, check:S=>S.stats.negociaciones>=1,
  hecho:'Eso es una conversación de venta: interés, confianza y paciencia. Cuando la paciencia llega a cero, se acabó.'},

 {id:'t5', t:'Pregunta antes de vender', d:'Saca tres datos a un cliente en la misma conversación.', pista:'En la fase de descubrimiento, las preguntas abiertas revelan lo que esconde.',
  ir:'pipeline', xp:40, check:S=>S.stats.maxReveal>=3,
  hecho:'Eso es lo que separa vender de discutir. Sin esos datos, las mejores respuestas te salen bloqueadas.'},

 {id:'t6', t:'Aguanta una pega', d:'Responde a una objeción sin salir corriendo.', pista:'Después del precio te va a poner pegas. Contesta.',
  ir:'pipeline', xp:30, check:S=>S.stats.objeciones>=1,
  hecho:'Una objeción concreta es interés. El que no piensa comprar asiente y desaparece.'},

 {id:'t7', t:'Pide el sí', d:'Llega hasta el final de una conversación y pide el cierre.', pista:'En el cierre, cualquier opción menos la última.',
  ir:'pipeline', xp:35, check:S=>S.stats.cierresPedidos>=1,
  hecho:'Muchas propuestas no se pierden: nadie pidió el sí. Preguntar no es agresivo, es respetar el tiempo de los dos.'},

 {id:'t8', t:'Cierra el día', d:'Termina el día y mira qué ha pasado.', pista:'Botón naranja, abajo a la derecha.',
  ir:null, xp:20, check:S=>S.dia>=2,
  hecho:'Cada día cobras lo que vencía y pagas lo que toca. Vender y cobrar son dos cosas distintas y pasan en meses distintos.'},

 {id:'t9', t:'Tu primer cliente', d:'Cierra una venta de verdad.', pista:'Descubre primero, no bajes el precio a la primera y pide el sí. Si te dicen que no, hay más gente.',
  ir:'pipeline', xp:80, cash:0, check:S=>S.stats.cierres>=1,
  hecho:'Ahí lo tienes. Fíjate en el plazo de cobro: ese dinero no está en tu cuenta todavía.'},

 {id:'t10', t:'No abandones a los enfriados', d:'Haz cinco toques a un mismo contacto enfriado.', pista:'En el pipeline, abajo del todo. HACER SEGUIMIENTO, cinco veces al mismo.',
  ir:'pipeline', xp:60, check:S=>S.stats.maxToques>=5,
  hecho:'Acabas de entrar en la franja donde se cierra la mayoría de las ventas. Casi todo el mundo lo deja en el segundo intento.'},

 {id:'t11', t:'Cuida a los que ya tienes', d:'Abre tu cartera y mira cómo están.', pista:'Botón CARTERA.',
  ir:'cartera', xp:20, check:S=>S.flags.visto_cartera,
  hecho:'Retener cuesta una fracción de captar. Y un cliente por debajo de 45 de satisfacción ya se está yendo.'},

 {id:'t12', t:'Llega a nivel 3', d:'Sube hasta nivel 3 para poder contratar.', pista:'Todo lo que haces da experiencia. Prospectar, negociar, cerrar y equivocarte.',
  ir:null, xp:40, check:S=>S.nivel>=3,
  hecho:'Ya puedes contratar. Ojo: la ficha de un candidato nunca dice lo importante.'},

 {id:'t13', t:'Contrata a alguien', d:'Ficha a tu primera persona.', pista:'En la ciudad → MERCADO DE TALENTO.',
  ir:'talento', xp:50, check:S=>S.equipo.length>=1,
  hecho:'Su coste real es el bruto por 1,32. Y tiene un rasgo oculto que vas a tardar días en descubrir.'},

 {id:'t14', t:'Mira si te sale a cuenta', d:'Abre EQUIPO y mira el neto de tu gente.', pista:'Botón EQUIPO. Busca la línea "Neto".',
  ir:'equipo', xp:25, check:S=>S.flags.visto_equipo,
  hecho:'Si el neto está en rojo, no es que rinda poco: es que pagas por perder dinero, todos los meses, en silencio.'},

 {id:'t15', t:'Ya sabes jugar', d:'Desbloquea 10 conceptos del Códex.', pista:'Se desbloquean solos, viviéndolos.',
  ir:'codex', xp:60, check:S=>Object.keys(S.codex).length>=10,
  hecho:'A partir de aquí vas solo. Los objetivos siguen abajo: son largos a propósito.'}
];

IMP.OBJETIVOS = [
 {id:'o_rec3', t:'3.000 € al mes', d:'Llega a 3.000 € de facturación recurrente.', xp:120, check:(S,G)=>G.recurrente()>=3000},
 {id:'o_rec10', t:'Cinco cifras', d:'Llega a 10.000 € al mes.', xp:250, check:(S,G)=>G.recurrente()>=10000},
 {id:'o_rec30', t:'30.000 € al mes', d:'Una empresa de verdad.', xp:600, check:(S,G)=>G.recurrente()>=30000},
 {id:'o_5cli', t:'Cinco a la vez', d:'Ten cinco clientes activos al mismo tiempo.', xp:150, check:S=>S.clientes.length>=5},
 {id:'o_15cli', t:'Quince a la vez', d:'Quince clientes activos. Vas a necesitar equipo.', xp:400, check:S=>S.clientes.length>=15},
 {id:'o_benef', t:'Ganar dinero', d:'Cierra un mes con beneficio positivo.', xp:180, check:(S,G)=>G.beneficio()>0 && S.dia>30},
 {id:'o_iva', t:'Sobrevive al primer IVA', d:'Paga una liquidación trimestral sin quedarte en negativo.', xp:200, check:S=>S.dia>92 && S.caja>0},
 {id:'o_linea', t:'Pide el paraguas antes de que llueva', d:'Consigue una línea de crédito teniendo la caja sana.', xp:220,
  check:S=>S.linea.limite>0 && S.caja>0},
 {id:'o_nocaro', t:'Aguanta el precio', d:'Cierra una venta sin haber bajado el precio ni una vez.', xp:200, check:S=>S.stats.cierresSinDescuento>=1},
 {id:'o_ancla', t:'Ancla alto y cierra', d:'Cierra una venta habiendo anclado por encima de tu precio.', xp:260, check:S=>S.stats.cierresAnclaAlta>=1},
 {id:'o_maestria3', t:'Domina tres pegas', d:'Llega a tres estrellas en tres objeciones distintas.', xp:300,
  check:(S,G)=>Object.keys(S.maestria).filter(id=>G.nivelMaestria(id)>=3).length>=3},
 {id:'o_maestria8', t:'Domina ocho pegas', d:'Tres estrellas en ocho objeciones distintas.', xp:700,
  check:(S,G)=>Object.keys(S.maestria).filter(id=>G.nivelMaestria(id)>=3).length>=8},
 {id:'o_codex25', t:'Medio Códex', d:'Desbloquea 25 conceptos.', xp:250, check:S=>Object.keys(S.codex).length>=25},
 {id:'o_codex45', t:'Casi todo', d:'Desbloquea 45 conceptos.', xp:600, check:S=>Object.keys(S.codex).length>=45},
 {id:'o_equipo3', t:'Un equipo', d:'Ten tres personas a la vez.', xp:200, check:S=>S.equipo.length>=3},
 {id:'o_equipo8', t:'Una plantilla', d:'Ocho personas a la vez.', xp:500, check:S=>S.equipo.length>=8},
 {id:'o_moral', t:'Que estén bien', d:'Ten el equipo por encima de 80 de moral con al menos tres personas.', xp:280,
  check:S=>S.equipo.length>=3 && S.moral>=80},
 {id:'o_rasgo', t:'Descubre a alguien', d:'Descubre el rasgo oculto de tres empleados.', xp:200,
  check:S=>S.equipo.filter(e=>e.visto).length>=3},
 {id:'o_delegar', t:'Que venda otro', d:'Ten dos comerciales en plantilla a la vez.', xp:350,
  check:S=>S.equipo.filter(e=>e.rol==='comercial').length>=2},
 {id:'o_dd', t:'Mira debajo de la alfombra', d:'Encuentra un problema oculto en una due diligence.', xp:300, check:S=>S.stats.hallazgos>=1},
 {id:'o_compra', t:'Tu primera compra', d:'Compra una empresa.', xp:800, check:S=>S.empresas.length>=1},
 {id:'o_compra3', t:'Un grupo', d:'Ten tres empresas compradas.', xp:1500, check:S=>S.empresas.length>=3},
 {id:'o_rangoC', t:'Rango C', d:'Llega a nivel 12: pequeña empresa.', xp:300, check:S=>S.nivel>=12},
 {id:'o_rangoB', t:'Rango B', d:'Nivel 20. Vende gente que no eres tú.', xp:700, check:S=>S.nivel>=20},
 {id:'o_rangoA', t:'Rango A', d:'Nivel 30.', xp:1400, check:S=>S.nivel>=30},
 {id:'o_rangoS', t:'Rango S', d:'Nivel 42. Holding.', xp:3000, check:S=>S.nivel>=42},
 {id:'o_año', t:'Aguanta un año', d:'Llega al día 365 con la empresa abierta.', xp:500, check:S=>S.dia>=365},
 {id:'o_2años', t:'Dos años', d:'Día 730.', xp:1200, check:S=>S.dia>=730},
 {id:'o_100', t:'Cien noes', d:'Come cien noes en prospección. Es un logro, no un castigo.', xp:150, check:S=>S.stats.noes>=100},
 {id:'o_1000', t:'Mil noes', d:'Mil.', xp:600, check:S=>S.stats.noes>=1000},
 {id:'o_recupera', t:'Resucita a un muerto', d:'Cierra una venta con alguien que ya habías perdido.', xp:400, check:S=>S.stats.cierresFrios>=1},
 {id:'o_referido', t:'Pide la vergüenza', d:'Consigue clientes por referido tres veces.', xp:300, check:S=>S.stats.referidos>=3}
];

/* Explicaciones la primera vez que entras en cada sitio */
IMP.PRIMERA = {
 despacho:{t:'Tu mesa', d:'Aquí no entra dinero: aquí decides de dónde va a entrar. Los tres números que tienes que mirar cada día son el <b>punto muerto</b> (lo que hay que facturar para no perder), los <b>meses de aire</b> (cuánto aguantas si no entra nada) y el <b>IVA acumulado</b>, que está en tu cuenta y no es tuyo.'},
 calle:{t:'La calle', d:'Prospección. Cada ronda te da unos cuantos noes y, con suerte, un contacto. La calidad del contacto importa más que la cantidad: un contacto de calidad 80 cierra solo, uno de 15 te hace perder la tarde. Los canales buenos se desbloquean con nivel.'},
 sala:{t:'Sala de reuniones', d:'Aquí se vende. Una conversación tiene cinco partes: cómo abres, qué descubres, qué precio dices, cómo aguantas las pegas y cómo pides el sí. <b>Las respuestas buenas están bloqueadas hasta que sabes con quién hablas.</b> Preguntar no es perder el tiempo: es lo que desbloquea la venta.'},
 taller:{t:'Entrega', d:'Los clientes que ya tienes. Cada uno consume capacidad. Si vendes más de lo que puedes entregar, la satisfacción baja, y por debajo de 45 se van. Y no te enteras hasta que llega el correo de dos líneas.'},
 talento:{t:'Mercado de talento', d:'Contratar es apostar. Ves sus habilidades y su coste, pero <b>no ves su rasgo oculto</b>, que tarda entre 8 y 40 días en aparecer. Puede ser un crack o puede llevarse tu cartera cuando se vaya. El coste real es el bruto por 1,32.'},
 banco:{t:'Banco', d:'Tu rating sale de los meses de aire, de si ganas dinero y de la antigüedad. Te dan cuando puedes demostrar que no lo necesitas, así que la línea de crédito se pide con la cuenta sana, no el mes que no llegas.'},
 hacienda:{t:'Hacienda', d:'El IVA que cobras entra en tu cuenta y parece tuyo. No lo es. Sale cada tres meses. Gastárselo es el error de caja más común que existe.'},
 puerto:{t:'El puerto', d:'Comprar empresas. Se paga por múltiplo del beneficio operativo. Antes de firmar puedes auditar cuatro áreas: cada una cuesta dinero y revela problemas distintos. <b>Lo que no auditas te explota después de firmar.</b>'},
 cumbre:{t:'La cumbre', d:'Cuentas grandes. Ticket cuatro veces tu media, ciclos largos y muchas veces quien te atiende no es quien firma.'},
 pipeline:{t:'Pipeline', d:'Todo lo que tienes abierto. Mira la <b>previsión ponderada</b>, no la suma: cada oportunidad vale su importe por su probabilidad. Y abajo están los enfriados, que es donde está el dinero que ya te has ganado.'},
 equipo:{t:'Equipo', d:'Cada persona produce un número al mes y te cuesta otro. La línea que importa es el <b>neto</b>. Formar sube habilidades, subir el sueldo sube la moral, y despedir cuesta indemnización, moral del resto y a veces un juicio.'},
 codex:{t:'Códex', d:'Los conceptos se desbloquean viviéndolos, no leyéndolos. Y cada objeción tiene <b>dominio</b>: hay que responderla bien tres veces por estrella.'}
};
