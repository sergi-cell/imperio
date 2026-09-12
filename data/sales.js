/* IMPERIO — Banco de VENTAS. Es el módulo grande a propósito: es donde cojeas. */
window.IMP = window.IMP || {};

/* ============ SECTORES ============ */
IMP.SECTORES = [
 {id:'metal',   n:'Taller metalúrgico',      tick:[900,3200],  ciclo:[14,45], dolor:'presupuestos que tardan una semana en salir', pref:['Mecanizados','Talleres','Industrias','Calderería']},
 {id:'inmo',    n:'Inmobiliaria',            tick:[600,2400],  ciclo:[7,28],  dolor:'leads que se enfrían antes de la primera llamada', pref:['Fincas','Inmobiliaria','Grupo','Hogares']},
 {id:'clinica', n:'Clínica dental',          tick:[700,2600],  ciclo:[10,30], dolor:'huecos en agenda y pacientes que no vuelven', pref:['Clínica','Dental','Centro','Instituto']},
 {id:'hosteler',n:'Grupo de restauración',   tick:[500,2200],  ciclo:[7,21],  dolor:'rotación de personal y márgenes que se comen los proveedores', pref:['Grupo','Bar','Cocina','Casa']},
 {id:'asesoria',n:'Asesoría fiscal',         tick:[800,3000],  ciclo:[21,60], dolor:'200 clientes pequeños y cero tiempo', pref:['Asesoría','Gestoría','Consulting','Despacho']},
 {id:'ecom',    n:'E-commerce',              tick:[1000,4000], ciclo:[10,35], dolor:'coste por venta subiendo cada trimestre', pref:['Shop','Store','Market','Directo']},
 {id:'const',   n:'Constructora',            tick:[1500,6000], ciclo:[30,90], dolor:'obras que se desvían y nadie sabe cuánto se gana hasta el final', pref:['Construcciones','Obras','Reformas','Promociones']},
 {id:'log',     n:'Transporte y logística',  tick:[1200,4500], ciclo:[21,60], dolor:'rutas mal planificadas y clientes que pagan a 90', pref:['Transportes','Logística','Distribuciones','Fletes']},
 {id:'soft',    n:'Software a medida',       tick:[1800,7000], ciclo:[30,75], dolor:'proyectos que se alargan y se comen el margen', pref:['Systems','Lab','Digital','Factory']},
 {id:'agencia', n:'Agencia de marketing',    tick:[900,3500],  ciclo:[14,40], dolor:'clientes que se van a los seis meses', pref:['Agencia','Studio','Media','Creativa']},
 {id:'salud',   n:'Centro de fisioterapia',  tick:[400,1600],  ciclo:[7,21],  dolor:'depender del boca a boca y del hueco del lunes', pref:['Centro','Fisio','Clínica','Salud']},
 {id:'academia',n:'Academia de formación',   tick:[600,2400],  ciclo:[14,45], dolor:'matriculaciones que caen fuera de septiembre', pref:['Academia','Escuela','Instituto','Campus']}
];

/* ============ ARQUETIPOS DE COMPRADOR ============ */
IMP.ARQUETIPOS = [
 {id:'precio', n:'El regateador', desc:'Todo lo mide en euros. Si le hueles el miedo, te desangra.',
  pac:8, cFloor:20, obj:['caro','competencia_barata','descuento','presupuesto_cerrado'], w:1.0,
  tip:'Con este, bajar el precio es perder. Solo se gana subiendo el valor percibido.'},
 {id:'ocupado', n:'El que no tiene tiempo', desc:'Tres minutos. Si te enrollas, cuelga.',
  pac:5, cFloor:10, obj:['no_es_momento','mandame_info','sin_tiempo'], w:1.1,
  tip:'Frases cortas. Ir al grano gana confianza; el descubrimiento largo te mata.'},
 {id:'analitico', n:'El analítico', desc:'Quiere números, referencias y letra pequeña. Decide lento pero decide.',
  pac:11, cFloor:0, obj:['datos','riesgo','comparar','consultar'], w:1.15,
  tip:'Aquí la prueba social y los números concretos valen doble. La presión, cero.'},
 {id:'amable', n:'El simpático', desc:'Te dice que sí a todo. Es el que más tiempo te va a hacer perder.',
  pac:14, cFloor:0, obj:['consultar','lo_pensare','sin_urgencia'], w:0.85,
  tip:'El riesgo no es que te diga que no: es que no te diga nada nunca. Fuerza el compromiso.'},
 {id:'esceptico', n:'El escaldado', desc:'Ya le vendieron humo una vez y no lo ha olvidado.',
  pac:9, cFloor:0, obj:['ya_probe','riesgo','garantia','competencia_mala'], w:1.2,
  tip:'Reconocer lo que no puedes hacer sube más la confianza que cualquier argumento.'},
 {id:'jefe', n:'El dueño', desc:'Decide él, va directo y te va a exigir que tú también.',
  pac:7, cFloor:0, obj:['por_que_tu','caro','urgencia_falsa'], w:1.25,
  tip:'Odia el rodeo. Pide el cierre pronto o pierdes su respeto.'}
];

/* ============ CANALES DE PROSPECCIÓN ============ */
IMP.CANALES = [
 {id:'frio_tel', n:'Llamada a puerta fría', desc:'La lista, el teléfono y la boca. Duele y funciona.',
  energia:1, coste:0, leads:[0,3], cal:[15,45], rech:0.72, nivel:1, attr:'ventas', cpt:'ley-numeros'},
 {id:'email', n:'Correo en frío', desc:'Volumen alto, respuesta baja. El asunto es el 80%.',
  energia:1, coste:40, leads:[0,4], cal:[10,40], rech:0.85, nivel:1, attr:'marketing', cpt:'canal-vs-mensaje'},
 {id:'linkedin', n:'LinkedIn a mano', desc:'Uno a uno, mirando el perfil. Lento y decente.',
  energia:1, coste:0, leads:[0,2], cal:[30,60], rech:0.65, nivel:1, attr:'marketing', cpt:'lista-antes-que-guion'},
 {id:'referidos', n:'Pedir referidos', desc:'Llamar a tus clientes y pedirles dos nombres. Da vergüenza. Es lo que mejor convierte.',
  energia:1, coste:0, leads:[0,2], cal:[55,90], rech:0.30, nivel:2, attr:'ventas', cpt:'referido', reqClientes:1},
 {id:'evento', n:'Feria del sector', desc:'Un día entero, coste fijo, y contactos calientes si trabajas la sala.',
  energia:3, coste:850, leads:[2,6], cal:[35,75], rech:0.40, nivel:4, attr:'ventas', cpt:'lista-antes-que-guion'},
 {id:'ads', n:'Campaña de anuncios', desc:'Pagas y entran solos. El coste por lead sube cada trimestre.',
  energia:1, coste:600, leads:[1,5], cal:[25,65], rech:0.50, nivel:5, attr:'marketing', cpt:'cac', escala:true},
 {id:'contenido', n:'Publicar contenido', desc:'No entra nadie hoy. Entran solos dentro de tres meses.',
  energia:1, coste:0, leads:[0,1], cal:[60,95], rech:0.20, nivel:3, attr:'marketing', cpt:'propuesta-unica', diferido:true},
 {id:'recuperar', n:'Llamar a clientes perdidos', desc:'Los que se fueron. Te conocen y ya sabes por qué se fueron.',
  energia:1, coste:0, leads:[0,2], cal:[45,80], rech:0.55, nivel:6, attr:'ventas', cpt:'recuperar-perdido', reqPerdidos:1}
];

/* ============ APERTURAS ============ */
IMP.APERTURAS = [
 {id:'pitch', t:'Le suelto lo que hacemos y nuestras ventajas.', i:2, c:-8, p:-1, cpt:'escucha-ratio',
  fb:'Has hablado tú los primeros noventa segundos. En las llamadas que cierran, habla más él. Acabas de gastar tu turno más valioso.'},
 {id:'permiso', t:'"Te llamo en frío. ¿Te doy treinta segundos y decides si sigo?"', i:4, c:10, p:0, cpt:'no-rapido',
  fb:'Reconocer que es en frío desarma. Y pedir permiso te da un sí pequeño antes del grande.',
  bonus:{arq:'ocupado', c:8}},
 {id:'dolor', t:'Le nombro el problema típico de su sector y me callo.', i:9, c:6, p:0, cpt:'preguntar-antes',
  fb:'Has abierto por su lado, no por el tuyo. Si el problema es el suyo, ya te está escuchando.',
  bonus:{arq:'jefe', i:6}},
 {id:'referencia', t:'Menciono a alguien de su sector con quien ya trabajo.', i:7, c:12, p:0, cpt:'prueba-social',
  fb:'Prestado de la confianza de otro. Con el escéptico y el analítico es lo que más pesa.',
  bonus:{arq:'esceptico', c:10}, reqRef:true},
 {id:'directo', t:'"Vendo X. Igual no te sirve. ¿Lo miramos en dos minutos?"', i:6, c:8, p:0, cpt:'no-rapido',
  fb:'Honestidad y salida fácil. Baja las defensas porque no pareces desesperado.',
  bonus:{arq:'precio', c:6}},
 {id:'halago', t:'Le hago la pelota un rato antes de entrar en materia.', i:1, c:-5, p:-1, cpt:null,
  fb:'Se nota a un kilómetro. El halago de manual baja la confianza en vez de subirla.'}
];

/* ============ DESCUBRIMIENTO — cada pregunta revela un dato oculto ============ */
IMP.PREGUNTAS = [
 {id:'q_dolor', rev:'dolor', t:'"¿Cómo lo estáis resolviendo hoy?"', i:4, c:6, p:-1, cpt:'preguntar-antes',
  fb:'Abierta y sin juicio. Te cuenta el proceso real, que casi nunca es el que te imaginabas.'},
 {id:'q_impacto', rev:'coste', t:'"¿Y eso en qué se os traduce a final de mes?"', i:8, c:5, p:-1, cpt:'pregunta-implicacion', req:'dolor',
  fb:'La pregunta que convierte un problema en un presupuesto. Sin esto, tu precio no tiene contra qué compararse.'},
 {id:'q_intento', rev:'alternativa', t:'"¿Habéis probado algo antes para esto?"', i:3, c:7, p:-1, cpt:'ya-tengo-proveedor',
  fb:'Te dice contra quién compites de verdad: otro proveedor, algo interno, o la inercia.'},
 {id:'q_presu', rev:'presupuesto', t:'"¿Tenéis una cifra en la cabeza para resolverlo?"', i:2, c:2, p:-1, cpt:'presupuesto-vs-precio',
  fb:'Incómoda y necesaria. Preguntarlo tarde es cómo se pierden tres semanas haciendo una propuesta que nunca iba a caber.'},
 {id:'q_decisor', rev:'decisor', t:'"Además de ti, ¿quién más tiene que decir que sí?"', i:2, c:6, p:-1, cpt:'decisor',
  fb:'Formulada así no ofende. Y te ahorra presentar la propuesta dos veces, la segunda sin ti delante.'},
 {id:'q_urgencia', rev:'urgencia', t:'"¿Por qué ahora y no en enero?"', i:6, c:4, p:-1, cpt:'cualificacion',
  fb:'Si no hay respuesta buena, no hay urgencia, y sin urgencia no hay venta: hay una conversación agradable.'},
 {id:'q_proceso', rev:'proceso', t:'"Si decidís que sí, ¿qué pasa después?"', i:5, c:5, p:-1, cpt:'siguiente-paso',
  fb:'Te dibuja el camino hasta la firma antes de recorrerlo. Ahí aparecen los frenos que nadie te iba a contar.'},
 {id:'q_riesgo', rev:'riesgo', t:'"¿Qué es lo que más te preocuparía de meterte en esto?"', i:4, c:11, p:-1, cpt:'riesgo-percibido',
  fb:'Le invitas a poner la objeción encima de la mesa antes de que la use para colgar. Sube muchísimo la confianza.'},
 {id:'q_cerrada1', rev:null, t:'"¿Estáis contentos con vuestro proveedor actual?"', i:0, c:-4, p:-1, cpt:'escucha-ratio',
  fb:'Pregunta cerrada: se responde con un sí y se acabó. Has gastado un turno para no saber nada.'},
 {id:'q_cerrada2', rev:null, t:'"¿Te interesaría ahorrar dinero?"', i:-2, c:-8, p:-1, cpt:null,
  fb:'Todo el mundo la ha oído mil veces. Suena a teleoperador y te coloca en esa carpeta mentalmente.'},
 {id:'q_futuro', rev:'urgencia', t:'"¿Dónde queréis estar dentro de un año?"', i:5, c:6, p:-2, cpt:'cualificacion',
  fb:'Buena pregunta, pero cara: se enrolla. Con el que no tiene tiempo te cuesta la llamada.',
  bonus:{arq:'ocupado', c:-10, p:-1}},
 {id:'q_numeros', rev:'coste', t:'"¿Cuántos os entran al mes y cuántos acabáis cerrando?"', i:7, c:4, p:-1, cpt:'dolor-cuantificado',
  fb:'Números concretos suyos. Es la munición con la que después defiendes el precio.',
  bonus:{arq:'analitico', c:8}},
 {id:'q_quien', rev:'decisor', t:'"¿Tú esto lo firmas o hay que subirlo?"', i:1, c:-2, p:-1, cpt:'decisor',
  fb:'Sirve, pero suena a interrogatorio. La misma información se saca sin que se ponga a la defensiva.'},
 {id:'q_consecuencia', rev:'coste', t:'"¿Y si dentro de seis meses seguís igual, qué pasa?"', i:9, c:3, p:-1, cpt:'coste-inaccion', req:'dolor',
  fb:'Tu competidor real es que no hagan nada. Esta pregunta le pone precio a esa opción.'}
];

/* ============ OBJECIONES ============ */
/* i=interés c=confianza p=paciencia · req=dato que tenías que haber descubierto · end='lost' mata el trato */
IMP.OBJECIONES = [

{id:'caro', cat:'precio', tell:'Puede ser precio de verdad, o que no ve el retorno. No son lo mismo.',
 txt:['"Uf, es más de lo que pensaba."','"Sinceramente, me parece caro."','"Por ese dinero me lo pienso mucho."'],
 res:[
  {t:'"¿Caro comparado con qué?"', i:4, c:9, p:-1, cpt:'objecion-cortina', fb:'La mejor respuesta a "es caro" es una pregunta. Ahora sabrás si te compara con otro proveedor, con su presupuesto o con no hacer nada.'},
  {t:'"Te lo dejo en un 15% menos y firmamos hoy."', i:7, c:-14, p:0, price:-0.15, cpt:'bajar-precio-rapido', fb:'Ha funcionado a medias y te ha costado un tercio del beneficio. Y le acabas de enseñar que tu precio era inventado: en la renovación empieza aquí.'},
  {t:'"Me decías que os cuesta {coste} € al mes. Esto son {precio} € una vez."', i:16, c:10, p:0, req:'coste', cpt:'valor-vs-coste', fb:'Esto es defender precio. No con tus horas: con su número, el que te ha dado él hace cinco minutos.'},
  {t:'"Es que lleva muchísimo trabajo detrás, son horas y horas."', i:-2, c:-6, p:-1, cpt:'valor-vs-coste', fb:'A nadie le importa lo que te cuesta hacerlo. Justificar el precio con tu esfuerzo lo convierte en un problema tuyo.'},
  {t:'Me callo y espero.', i:6, c:7, p:-1, cpt:'silencio', fb:'El primero que habla, negocia contra sí mismo. Aguantar el silencio es de las cosas más rentables que se pueden aprender.'}
 ]},

{id:'competencia_barata', cat:'precio', tell:'Comparar con el barato solo funciona si sabes qué NO incluye.',
 txt:['"Tengo otra oferta por la mitad."','"Me han pasado un presupuesto muy por debajo del tuyo."'],
 res:[
  {t:'"¿Puedo ver qué incluye? Igual te sale mejor la suya."', i:10, c:14, p:-1, cpt:'propuesta-unica', fb:'Te has puesto de su lado en vez de contra el otro. Y casi siempre encuentras lo que no incluye.'},
  {t:'"Ya, es que esa gente hace chapuzas."', i:-4, c:-12, p:-1, cpt:null, fb:'Hablar mal de la competencia te deja a ti peor. Si ya había hablado con ellos, acabas de insultar su criterio.'},
  {t:'"Igualo el precio."', i:9, c:-10, p:0, price:-0.35, cpt:'descuento-margen', fb:'Has entrado en una subasta que tú no puedes ganar. Y si tu margen era del 30%, este trabajo lo haces gratis o perdiendo.'},
  {t:'"Somos más caros, sí. Te cuento en qué y decides."', i:8, c:16, p:-1, cpt:'valor-vs-coste', fb:'Defender el precio sin pedir perdón. Al que decide por criterio le sube muchísimo el respeto.', bonus:{arq:'jefe', i:8}}
 ]},

{id:'descuento', cat:'precio', tell:'Pide descuento todo el mundo. Lo importante es qué pides tú a cambio.',
 txt:['"¿Me haces un precio mejor?"','"Si me lo ajustas un poco, cerramos."'],
 res:[
  {t:'"Puedo, si firmamos a doce meses en vez de a tres."', i:12, c:8, p:0, price:-0.08, plazo:12, cpt:'descuento-margen', fb:'Regla de oro: nunca bajes el precio gratis. Un descuento a cambio de plazo, de volumen o de pago por adelantado no es ceder, es negociar.'},
  {t:'"Vale."', i:8, c:-12, p:0, price:-0.12, cpt:'bajar-precio-rapido', fb:'Has cedido en el primer empujón. Ahora sabe que hay más y va a volver a empujar.'},
  {t:'"No. El precio es este."', i:-3, c:6, p:-1, cpt:'anclaje', fb:'Firme, pero seco. Aguantas margen y pierdes algo de interés. Con el regateador, funciona mejor de lo que parece.', bonus:{arq:'precio', i:8, c:6}},
  {t:'"Puedo quitar el módulo de informes y sale a {precio}."', i:10, c:11, p:0, price:-0.15, scope:-0.2, cpt:'tres-opciones', fb:'Menos precio por menos alcance. Es lo único que mantiene tu margen intacto: el precio baja porque baja el trabajo.'}
 ]},

{id:'presupuesto_cerrado', cat:'precio', tell:'A veces es verdad. El presupuesto anual existe.',
 txt:['"Este año ya no me queda presupuesto para esto."'],
 res:[
  {t:'"¿Cuándo se decide el del año que viene?"', i:6, c:8, p:-1, cpt:'ciclo-venta', fb:'Si es verdad, esto lo convierte en una venta con fecha en vez de en un no. Se anota y se vuelve.'},
  {t:'"¿Y de qué partida sale normalmente algo así?"', i:9, c:7, p:-1, cpt:'presupuesto-vs-precio', fb:'Muchas veces el dinero existe en otra partida. Preguntarlo abre una puerta que él no iba a abrir solo.'},
  {t:'"Podemos empezar con una prueba pequeña este mes."', i:13, c:9, p:0, price:-0.55, prueba:true, cpt:'riesgo-percibido', fb:'Un primer paso pequeño cabe en cualquier presupuesto. Cobras menos hoy y entras.'},
  {t:'"Bueno, pues nada, ya me dirás."', i:-8, c:0, p:-2, cpt:'cerrar-o-perder', fb:'Te has rendido en la primera. Esta objeción es la más fácil de convertir en fecha y la has tirado.'}
 ]},

{id:'mandame_info', cat:'dilacion', tell:'Es la forma educada de colgar. Casi nadie lee el correo.',
 txt:['"Mándame información por correo y lo miro."'],
 res:[
  {t:'"Te la mando. ¿Miramos juntos el jueves a las diez qué te ha parecido?"', i:11, c:8, p:0, cita:true, cpt:'siguiente-paso', fb:'Aceptas y le pones fecha. Sin fecha, ese correo se muere solo. Con fecha, sigue siendo una venta viva.'},
  {t:'"Claro, ahora te la mando."', i:-10, c:2, p:0, cpt:'seguimiento', end:'frio', fb:'Acabas de perderlo con educación. "Mándame info" sin siguiente paso es un no con buenos modales.'},
  {t:'"Te mando lo que quieras. ¿Qué es lo que querrías ver exactamente?"', i:8, c:10, p:-1, cpt:'objecion-cortina', fb:'Si no sabe qué quiere ver, es que no había interés. Si lo sabe, te acaba de decir qué le importa de verdad.'},
  {t:'"La información genérica no te va a servir. Dame dos minutos y te digo si esto es para ti o no."', i:9, c:9, p:-1, cpt:'no-rapido', fb:'Le devuelves el control ofreciéndole un no rápido. Al que no tiene tiempo le encanta.', bonus:{arq:'ocupado', i:8, c:6}}
 ]},

{id:'consultar', cat:'dilacion', tell:'O no decide él, o no se atreve. Averigua cuál.',
 txt:['"Lo tengo que consultar con mi socio."','"Déjame hablarlo internamente."'],
 res:[
  {t:'"Perfecto. ¿Qué crees que le va a chirriar a él?"', i:10, c:12, p:-1, cpt:'decisor', fb:'Le conviertes en tu vendedor dentro de la empresa y descubres la objeción real de rebote.'},
  {t:'"¿Y si lo vemos los tres juntos veinte minutos?"', i:12, c:8, p:-1, cita:true, cpt:'decisor', fb:'Lo correcto. Nadie defiende tu propuesta mejor que tú, y el socio nunca oye lo que tú has dicho.'},
  {t:'"Sin problema, ya me contarás."', i:-9, c:1, p:0, cpt:'siguiente-paso', end:'frio', fb:'Se acaba de convertir en un fantasma. Sin fecha ni acceso al que decide, esto no vuelve.'},
  {t:'"¿Tú qué le vas a decir?"', i:8, c:9, p:-1, cpt:'objecion-cortina', fb:'La respuesta te dice todo: si no sabe resumirlo, no lo ha comprado él tampoco.'}
 ]},

{id:'lo_pensare', cat:'dilacion', tell:'"Me lo pienso" casi siempre es un no que no se atreve.',
 txt:['"Déjame que lo piense."','"Necesito darle una vuelta."'],
 res:[
  {t:'"Claro. ¿Qué parte es la que hay que pensar?"', i:9, c:10, p:-1, cpt:'objecion-cortina', fb:'"Pensarlo" no es una objeción, es un envoltorio. Esta pregunta lo abre sin presionar.'},
  {t:'"¿Te digo algo la semana que viene?"', i:-4, c:2, p:0, cpt:'siguiente-paso', fb:'Blando. "Te digo algo" es la frase con la que mueren la mitad de las ventas.'},
  {t:'"Te lo pongo fácil: ¿qué tendría que pasar para que fuera un sí?"', i:13, c:9, p:-1, cpt:'cerrar-o-perder', fb:'Le pides que te dibuje el camino. O te lo dibuja, o descubres que no lo había.'},
  {t:'"Perfecto, pero te aviso: la semana que viene subo tarifas."', i:5, c:-9, p:-1, cpt:'riesgo-percibido', fb:'La urgencia inventada la huele todo el mundo. Con el escéptico es directamente el final.', bonus:{arq:'esceptico', c:-12, i:-8}}
 ]},

{id:'no_es_momento', cat:'dilacion', tell:'Sin urgencia no hay venta. Pero la urgencia se puede encontrar.',
 txt:['"Ahora mismo estamos liadísimos, mejor después de verano."'],
 res:[
  {t:'"¿Y qué cambia en septiembre?"', i:8, c:7, p:-1, cpt:'cualificacion', fb:'Casi nunca hay respuesta. Y cuando no la hay, los dos os dais cuenta a la vez.'},
  {t:'"Precisamente por eso: esto es para que dejéis de ir liados."', i:6, c:4, p:-1, cpt:'coste-inaccion', fb:'Buen giro, aunque un poco de manual. Funciona si antes has cuantificado el problema.', bonus:{has:'coste', i:9, c:6}},
  {t:'"Vale, te llamo en septiembre."', i:-6, c:3, p:0, cpt:'seguimiento', fb:'Legítimo si lo anotas de verdad. El problema es que la mayoría no llama en septiembre.'},
  {t:'"¿Cuánto os cuesta cada mes que pasa así?"', i:12, c:6, p:-1, req:'dolor', cpt:'coste-inaccion', fb:'Convertir el retraso en dinero perdido es la única forma honesta de crear urgencia.'}
 ]},

{id:'sin_tiempo', cat:'dilacion', tell:'Te está midiendo. Cada segundo cuenta.',
 txt:['"Tengo dos minutos, dime."'],
 res:[
  {t:'"Dos me sobran. Una pregunta: ¿{dolorSector}?"', i:11, c:10, p:0, cpt:'preguntar-antes', fb:'Respetas su tiempo y abres por su problema. Es lo máximo que se puede hacer en dos minutos.'},
  {t:'Le hago el resumen entero de la empresa lo más rápido que puedo.', i:-2, c:-9, p:-2, cpt:'escucha-ratio', fb:'Has hablado rápido para no decir nada. Rápido no es lo mismo que breve.'},
  {t:'"Entonces te llamo mejor en otro momento."', i:-5, c:4, p:0, cpt:null, fb:'Educado y perdedor. Te ha dado dos minutos: eso es interés, no un obstáculo.'},
  {t:'"En treinta segundos te digo si te interesa, y si no, cuelgo yo."', i:9, c:12, p:0, cpt:'no-rapido', fb:'Ofrecerle la salida es lo que hace que se quede. Nadie huye de quien no le persigue.'}
 ]},

{id:'ya_probe', cat:'confianza', tell:'Ya le vendieron humo. Tu problema es el de antes, no tú.',
 txt:['"Ya probamos algo parecido hace dos años y fue un desastre."'],
 res:[
  {t:'"Cuéntame qué pasó exactamente."', i:7, c:15, p:-1, cpt:'preguntar-antes', fb:'Dejarle desahogar el mal recuerdo es literalmente la venta. Y te da el mapa de lo que no debes prometer.'},
  {t:'"Nosotros no somos así, ya verás."', i:1, c:-8, p:-1, cpt:'riesgo-percibido', fb:'Eso mismo le dijeron los otros. Una promesa no se rebate con otra promesa.'},
  {t:'"Normal. La mayoría de estas cosas fallan por lo mismo: {motivo}. ¿Fue eso?"', i:12, c:14, p:-1, cpt:'riesgo-percibido', fb:'Demostrar que conoces cómo se rompe tu propio sector es lo que más credibilidad da con un escaldado.'},
  {t:'"¿Y si lo hacemos al revés: empezamos por lo pequeño y si no funciona lo dejamos?"', i:14, c:12, p:0, price:-0.4, prueba:true, cpt:'riesgo-percibido', fb:'El riesgo era el freno, no el precio. Bajar el riesgo abre puertas que bajar el precio no abre.'}
 ]},

{id:'riesgo', cat:'confianza', tell:'No duda de que funcione. Duda de quedar mal si no funciona.',
 txt:['"¿Y si no funciona? Me la juego yo."'],
 res:[
  {t:'"Si al segundo mes no ves resultado, lo dejamos y no pagas el resto."', i:15, c:16, p:0, garantia:true, cpt:'riesgo-percibido', fb:'Te has puesto el riesgo encima. Es caro si sale mal y es lo que cierra los tratos difíciles.'},
  {t:'"Funciona seguro, tranquilo."', i:0, c:-10, p:-1, cpt:'riesgo-percibido', fb:'La seguridad absoluta no tranquiliza: activa la alarma. Nadie se cree un cien por cien.'},
  {t:'"Mira lo que pasó con {referencia}, mismo sector y mismo tamaño."', i:12, c:13, p:-1, reqRef:true, cpt:'prueba-social', fb:'Un caso de su sector y su tamaño vale más que veinte argumentos. De otro sector, casi nada.'},
  {t:'"Puede no funcionar, sí. Te digo en qué casos no lo recomiendo."', i:9, c:18, p:-1, cpt:'riesgo-percibido', fb:'Decir cuándo NO comprarte es la jugada de confianza más fuerte que existe. Casi nadie se atreve.', bonus:{arq:'esceptico', c:12}}
 ]},

{id:'garantia', cat:'confianza', tell:'Quiere algo escrito.',
 txt:['"¿Eso me lo garantizas por contrato?"'],
 res:[
  {t:'"Te garantizo el trabajo y los plazos. El resultado depende también de vosotros, y te digo de qué."', i:10, c:15, p:-1, cpt:'riesgo-percibido', fb:'Honesto y concreto. Garantizar lo que no controlas es cómo se firman los pleitos.'},
  {t:'"Sí, todo garantizado."', i:8, c:-6, p:0, riesgoLegal:true, cpt:null, fb:'Acabas de firmar algo que no controlas. Si sale mal, la factura la pagas dos veces.'},
  {t:'"Nadie en el sector garantiza eso."', i:-3, c:-4, p:-1, cpt:null, fb:'Puede ser cierto y suena a excusa. "Los demás tampoco" nunca ha vendido nada.'}
 ]},

{id:'datos', cat:'confianza', tell:'El analítico compra números, no adjetivos.',
 txt:['"¿Tienes datos de esto? Números concretos."'],
 res:[
  {t:'Le doy tres cifras concretas de clientes reales, con el rango y lo que falló.', i:14, c:16, p:-1, cpt:'prueba-social', fb:'Dar el rango y lo que falló, en vez de solo el mejor caso, es lo que hace creíble el número.', bonus:{arq:'analitico', i:8, c:8}},
  {t:'"Nuestros clientes suelen mejorar mucho."', i:-2, c:-9, p:-1, cpt:null, fb:'"Mucho" no es un dato. Al analítico le acabas de confirmar que improvisas.'},
  {t:'"Te preparo un caso con vuestros números y lo vemos el jueves."', i:11, c:12, p:-1, cita:true, cpt:'siguiente-paso', fb:'Convierte la objeción en una segunda reunión con fecha. Casi siempre mejor que responder de memoria.'}
 ]},

{id:'comparar', cat:'competencia', tell:'Va a pedir tres presupuestos. Que el tuyo sea el que fija el criterio.',
 txt:['"Estoy mirando dos o tres opciones más."'],
 res:[
  {t:'"Lógico. ¿Qué vas a mirar para decidir?"', i:9, c:12, p:-1, cpt:'propuesta-unica', fb:'Si conoces su criterio, puedes construir la propuesta encima. Y si no lo tiene, se lo das tú.'},
  {t:'"¿Y si te digo yo en qué deberías fijarte para comparar?"', i:12, c:11, p:-1, cpt:'propuesta-unica', fb:'El que define el criterio de comparación gana la comparación. Es la jugada más infravalorada de las ventas.'},
  {t:'"Nosotros somos los mejores del mercado."', i:-2, c:-8, p:-1, cpt:null, fb:'Eso lo dicen los tres presupuestos. No te diferencia: te iguala.'},
  {t:'"Perfecto, avísame cuando decidas."', i:-7, c:2, p:0, cpt:'cerrar-o-perder', fb:'Le dejas la iniciativa al que menos interés tiene. Nunca sale bien.'}
 ]},

{id:'competencia_mala', cat:'competencia', tell:'Tiene proveedor y está regular con él.',
 txt:['"Ya trabajamos con una empresa, aunque no estamos del todo contentos."'],
 res:[
  {t:'"¿Qué es lo que no acaba de funcionar?"', i:12, c:11, p:-1, cpt:'ya-tengo-proveedor', fb:'Ahí está la venta entera. Solo tienes que dejarle hablar y no interrumpir.'},
  {t:'"Pues cámbiate y ya está."', i:2, c:-7, p:-1, cpt:'riesgo-percibido', fb:'Cambiar de proveedor da pereza y da miedo. Tratarlo como algo trivial le confirma que no lo entiendes.'},
  {t:'"No te pido que cambies. Déjame un trozo pequeño y compara."', i:14, c:13, p:0, price:-0.5, prueba:true, cpt:'riesgo-percibido', fb:'Entrar por la puerta pequeña es cómo se roba una cuenta: sin obligarle a una decisión grande.'},
  {t:'"Nosotros hacemos lo mismo pero mejor."', i:0, c:-6, p:-1, cpt:'propuesta-unica', fb:'"Lo mismo pero mejor" te mete en su misma casilla y ahí solo se decide por precio.'}
 ]},

{id:'por_que_tu', cat:'competencia', tell:'La pregunta más justa que existe. Y casi nadie la tiene contestada.',
 txt:['"¿Por qué tú y no cualquier otro?"'],
 res:[
  {t:'Le doy una razón concreta y estrecha: para quién SÍ soy la mejor opción y para quién no.', i:15, c:15, p:-1, cpt:'propuesta-unica', fb:'Un posicionamiento que excluye gente es el único que convence. El que vale para todos no vale para nadie.', bonus:{arq:'jefe', i:8}},
  {t:'"Por la experiencia, el trato cercano y la calidad."', i:-3, c:-7, p:-1, cpt:'propuesta-unica', fb:'Eso está en la web de todos tus competidores. Si tu respuesta sirve con otro logo, no es una respuesta.'},
  {t:'"Porque somos los más baratos."', i:6, c:-4, p:0, price:-0.2, cpt:'descuento-margen', fb:'Has ganado la conversación y perdido el negocio. Siempre habrá alguien más barato.'},
  {t:'"Sinceramente, para lo que necesitas igual hay opciones mejores. Depende de una cosa: {condicion}."', i:13, c:18, p:-1, cpt:'riesgo-percibido', fb:'Estar dispuesto a perder la venta es lo que la gana. Solo funciona si es verdad.'}
 ]},

{id:'sin_urgencia', cat:'cualificacion', tell:'El simpático te va a tener tres meses así.',
 txt:['"Me encanta, de verdad. Vamos hablando."'],
 res:[
  {t:'"Me encanta que te encante. ¿Lo hacemos o no lo hacemos?"', i:11, c:8, p:-1, cpt:'cerrar-o-perder', fb:'Directo y necesario. Con el simpático, la amabilidad infinita es una trampa para los dos.', bonus:{arq:'amable', i:10}},
  {t:'"Genial, pues te voy contando novedades."', i:-8, c:3, p:0, cpt:'siguiente-paso', end:'frio', fb:'Acabas de meterlo en una lista de espera que no existe. Nunca va a volver solo.'},
  {t:'"Si no lo hacemos ahora, ¿cuándo?"', i:9, c:6, p:-1, cpt:'siguiente-paso', fb:'Forzar la fecha es lo mínimo. Un sí sin fecha es un no lento.'},
  {t:'"¿Del uno al diez, cuánto de probable es que esto salga?"', i:10, c:9, p:-1, cpt:'pipeline-ponderado', fb:'Le pides que se moje con un número. Por debajo de siete, no es una oportunidad: es una conversación.'}
 ]},

{id:'urgencia_falsa', cat:'cualificacion', tell:'Dice que corre prisa. Comprueba si es verdad.',
 txt:['"Esto lo necesito para ya, ¿cuándo podéis empezar?"'],
 res:[
  {t:'"Podemos. ¿Qué pasa si no está para esa fecha?"', i:10, c:10, p:-1, cpt:'cualificacion', fb:'Si no pasa nada, la urgencia era decorativa. Y las prisas sin consecuencia acaban en impagos.'},
  {t:'"Empezamos mañana mismo."', i:8, c:4, p:0, capacidad:true, cpt:'coste-oportunidad', fb:'Has dicho que sí sin mirar tu capacidad. Ese sí lo van a pagar los clientes que ya tienes.'},
  {t:'"Podemos ir rápido, pero eso tiene un precio: un 20% más por urgencia."', i:9, c:12, p:0, price:0.2, cpt:'valor-vs-coste', fb:'La prisa es un valor y se cobra. El que la tiene de verdad la paga sin pestañear.', bonus:{arq:'jefe', c:8}}
 ]},

{id:'no_decisor', cat:'cualificacion', tell:'Está encantado pero no firma él.',
 txt:['"A mí me convence, pero esto lo decide dirección."'],
 res:[
  {t:'"¿Cómo le presentamos esto a dirección para que salga bien?"', i:12, c:13, p:-1, cpt:'decisor', fb:'Le conviertes en aliado y trabajáis juntos. La palabra clave es "presentamos".'},
  {t:'"¿Puedo hablar yo directamente con dirección?"', i:6, c:-5, p:-1, cpt:'decisor', fb:'Saltárselo le humilla. A veces hay que hacerlo, pero nunca en la primera y nunca así.'},
  {t:'"Vale, pásaselo y me dices."', i:-8, c:2, p:0, cpt:'decisor', end:'frio', fb:'Tu propuesta la va a defender alguien que no sabe defenderla, delante de alguien que no te ha oído.'},
  {t:'"Te preparo una página con los números para que la subas. ¿La vemos antes juntos?"', i:13, c:12, p:-1, cita:true, cpt:'decisor', fb:'Le das munición y te aseguras de que el mensaje llega entero. Es lo máximo que puedes controlar.'}
 ]},

{id:'crisis_sector', cat:'contexto', tell:'Contexto real. Nada personal.',
 txt:['"El sector está fatal este año, estamos recortando todo."'],
 res:[
  {t:'"¿Y en qué estáis recortando exactamente?"', i:7, c:9, p:-1, cpt:'preguntar-antes', fb:'Recortar no es dejar de gastar: es cambiar de prioridad. Necesitas saber cuál es la nueva.'},
  {t:'"Justo por eso: esto no es gasto, es lo que hace que entre más."', i:6, c:2, p:-1, cpt:'coste-inaccion', fb:'Todos los vendedores dicen esto en una crisis. Solo cuela con un número detrás.', bonus:{has:'coste', i:10, c:8}},
  {t:'"Lo entiendo. ¿Te llamo en tres meses o lo dejamos?"', i:4, c:11, p:0, cpt:'no-rapido', fb:'Aceptar el no con dignidad y dejar la puerta abierta es lo que hace que te cojan el teléfono el año que viene.'}
 ]},

{id:'implantacion', cat:'confianza', tell:'Miedo al lío interno, no al precio.',
 txt:['"¿Y esto quién lo va a llevar? Mi equipo no da más de sí."'],
 res:[
  {t:'"¿Cuánto tiempo tuyo y de tu equipo crees que puede costar esto al mes?"', i:9, c:11, p:-1, cpt:'preguntar-antes', fb:'Le dejas poner el miedo en horas. Casi siempre se lo imagina peor de lo que es.'},
  {t:'"Nada, cero. Lo hacemos nosotros todo."', i:7, c:-6, p:0, riesgoOps:true, cpt:'delegacion', fb:'Nunca es cero, y él lo sabe. Prometer cero esfuerzo suena a mentira y crea la primera bronca del mes dos.'},
  {t:'"Dos horas la primera semana y luego media al mes. Te digo exactamente de quién."', i:13, c:14, p:-1, cpt:'riesgo-percibido', fb:'Concreto y creíble. Poner un número honesto al esfuerzo vende más que decir que no hay ninguno.'}
 ]},

{id:'pago', cat:'precio', tell:'No discute el precio: discute cuándo lo suelta.',
 txt:['"Nosotros pagamos a 90 días, es nuestra política."'],
 res:[
  {t:'"A 90 no puedo. A 30, o 60 con un 3% más."', i:6, c:10, p:-1, cobro:30, cpt:'periodo-cobro', fb:'Cobrar a 90 es financiarle gratis con tu dinero y encima adelantando el IVA. Negociar el plazo es negociar tu caja.'},
  {t:'"Sin problema, 90 días."', i:8, c:3, p:0, cobro:90, cpt:'periodo-cobro', fb:'Has cerrado una venta que no vas a ver hasta dentro de tres meses. Las nóminas, mientras, salen todos los días 30.'},
  {t:'"50% al empezar y 50% a 30 días."', i:7, c:11, p:-1, cobro:30, anticipo:0.5, cpt:'caja-vs-beneficio', fb:'El anticipo es lo que separa vender de cobrar. Y quien no quiere adelantar nada, muchas veces tampoco iba a pagar.'}
 ]},

{id:'ghosting', cat:'seguimiento', tell:'Desapareció después de la propuesta. Es lo normal.',
 txt:['(Tres semanas sin respuesta después de mandar la propuesta.)'],
 res:[
  {t:'"¿Sigues ahí? Te reenvío la propuesta por si se perdió."', i:2, c:0, p:-1, cpt:'seguimiento', fb:'Contacto sin valor. Sirve poco, pero es mejor que no llamar. Cuenta como un toque.'},
  {t:'Le llamo por teléfono en vez de escribir.', i:10, c:6, p:-1, cpt:'seguimiento', fb:'El canal se agota, no el interés. Después de dos correos sin respuesta, el teléfono multiplica.'},
  {t:'"Entiendo que ha dejado de ser prioridad. ¿Cierro el tema?"', i:13, c:12, p:-1, cpt:'no-rapido', fb:'El correo de ruptura es el que más respuestas consigue de todos. La gente contesta para decir que no está muerta.'},
  {t:'Lo doy por perdido.', i:-15, c:0, p:0, end:'frio', cpt:'seguimiento', fb:'La mayoría de las ventas se cierran entre el quinto y el duodécimo contacto, y la mayoría de los vendedores lo dejan en el segundo. Acabas de ser la mayoría.'}
 ]},

{id:'renovacion', cat:'cartera', tell:'Toca renovar y se lo está pensando.',
 txt:['"Vamos a valorar si renovamos o no."'],
 res:[
  {t:'"¿Qué ha sido lo que más y lo que menos os ha servido este año?"', i:11, c:13, p:-1, cpt:'churn', fb:'La renovación se juega preguntando, no defendiendo. Y te llevas el mapa de por qué se van los demás.'},
  {t:'"Os mantengo el precio del año pasado."', i:7, c:2, p:0, cpt:'nrr', fb:'Congelar precio por miedo es perder margen contra la inflación cada año, en silencio.'},
  {t:'"Renovamos y además os propongo esto otro que os falta."', i:9, c:6, p:-1, upsell:true, cpt:'upsell', fb:'Atacar en la renovación funciona mucho mejor que defender. Vender más a quien ya te compra es el dinero más barato que hay.'},
  {t:'"¿Renovamos como está y ya?"', i:3, c:1, p:0, cpt:'nrr', fb:'Sobrevives un año más sin crecer. Con una fuga del 5% mensual, eso es encoger.'}
 ]},

{id:'ampliar', cat:'cartera', tell:'Cliente contento. Aquí está el dinero fácil que nadie coge.',
 txt:['"Estamos muy contentos con cómo va todo."'],
 res:[
  {t:'"Me alegro. ¿Te cuento qué es lo siguiente que suelen hacer los que están donde vosotros?"', i:14, c:10, p:-1, upsell:true, cpt:'upsell', fb:'Vender a un cliente actual cuesta una fracción y cierra mucho más. Es lo primero que se abandona cuando hay prisa.'},
  {t:'"Genial, gracias."', i:0, c:2, p:0, cpt:'upsell', fb:'Te acabas de dejar la venta más barata del mes encima de la mesa.'},
  {t:'"¿Conoces a alguien a quien le pueda servir esto?"', i:8, c:8, p:-1, referido:true, cpt:'referido', fb:'El mejor momento para pedir un referido es justo cuando dice que está contento. Y casi nadie lo pide.'}
 ]},

{id:'baja', cat:'cartera', tell:'Se quiere ir. Todavía se puede salvar, o al menos aprender.',
 txt:['"Hemos decidido no seguir el mes que viene."'],
 res:[
  {t:'"Respeto la decisión. ¿Me dices qué ha fallado, para no repetirlo?"', i:6, c:14, p:-1, aprende:true, cpt:'churn', fb:'Aunque no lo salves, te llevas el motivo real de fuga. Eso vale más que este cliente.'},
  {t:'"Te hago un 30% de descuento si te quedas."', i:9, c:-8, p:0, price:-0.3, cpt:'descuento-margen', fb:'Retener con precio te deja un cliente peor y le enseña a amenazar con irse cada año.'},
  {t:'"¿Ha pasado algo concreto o es una suma de cosas?"', i:10, c:11, p:-1, cpt:'churn', fb:'Si es algo concreto, se arregla. Si es una suma, se fue hace meses y no te enteraste.'}
 ]}
];

/* ============ CIERRES ============ */
IMP.CIERRES = [
 {id:'directo', t:'"¿Lo hacemos?"', umbral:64, i:0, c:4, cpt:'cerrar-o-perder',
  fb:'La pregunta más rentable que existe. Un porcentaje enorme de propuestas no se pierden: nadie pidió el sí.'},
 {id:'alternativa', t:'"¿Empezamos el día 1 o el 15?"', umbral:60, i:3, c:2, cpt:'tres-opciones',
  fb:'Cambias la pregunta de "sí o no" a "cuándo". Funciona si el interés ya estaba; si no, se nota el truco.'},
 {id:'resumen', t:'Le resumo con sus palabras lo que me ha dicho y pregunto si lo he entendido bien.', umbral:55, i:6, c:8, cpt:'preguntar-antes',
  fb:'Cerrar repitiendo su problema con sus palabras. El sí que sigue es suyo, no tuyo.', req:'dolor'},
 {id:'siguiente', t:'"Te propongo un primer paso: {prueba}. Si funciona, seguimos."', umbral:47, i:4, c:9, price:-0.45, prueba:true, cpt:'riesgo-percibido',
  fb:'Bajar el tamaño de la decisión en vez del precio. Entras, y el resto se vende solo desde dentro.'},
 {id:'presion', t:'"Necesito una respuesta hoy o pierdes el hueco."', umbral:76, i:8, c:-14, cpt:'riesgo-percibido',
  fb:'La presión funciona con quien ya iba a comprar y quema a todos los demás. Ratio malísimo.'},
 {id:'silencio_cierre', t:'Digo el precio, pregunto y me callo.', umbral:58, i:5, c:6, cpt:'silencio',
  fb:'Aguantar el silencio después de preguntar es donde se ganan los tratos que parecían perdidos.'},
 {id:'fecha', t:'"Cerramos aquí y quedamos el jueves para arrancar."', umbral:62, i:4, c:5, cita:true, cpt:'siguiente-paso',
  fb:'Cierre con calendario. Un sí sin fecha se enfría en cuarenta y ocho horas.'},
 {id:'no_cierro', t:'No pido el sí. Le digo que se lo piense con calma.', umbral:999, i:-12, c:2, cpt:'cerrar-o-perder',
  fb:'Has hecho todo el trabajo y no has pedido el pedido. Esto es, literalmente, lo que más dinero cuesta en ventas.'}
];

/* ============ NOMBRES ============ */
IMP.NOMBRES = ['Marc','Nuria','Javier','Álex','Rosa','Iván','Cristina','Tomás','Elena','Sergio','Paula','Ramón','Lucía','Óscar','Miriam','Andrés','Carla','Jordi','Beatriz','Rubén','Silvia','Gonzalo','Marta','Héctor','Alba','Fernando','Irene','Dani','Patricia','Guille'];
IMP.APELLIDOS = ['Colomer','Ferrer','Beltrán','Otero','Sanchís','Badía','Iglesias','Quintana','Herrero','Mena','Sabaté','Puig','Navarro','Gallego','Rueda','Cortés','Escudero','Villar','Domínguez','Lozano','Peris','Marín','Aguilar','Bermejo'];
IMP.CARGOS = ['gerente','dueño','director comercial','responsable de operaciones','socio fundador','director general','jefe de compras','administrador'];
