/* IMPERIO — EQUIPO: candidatos, rasgos ocultos y discusiones. */
window.IMP = window.IMP || {};

/* ROLES: comercial genera y cierra · entrega da capacidad · admin libera energía · marketing sube calidad de lead */
IMP.ROLES = {
 comercial:{n:'Comercial',  color:'#F2A93B', desc:'Trae leads y cierra ventas que no tocas tú.'},
 entrega:  {n:'Entrega',    color:'#35D0A5', desc:'Da capacidad. Sin capacidad, los clientes se van.'},
 admin:    {n:'Administración', color:'#8FA3C8', desc:'Te devuelve energía cada día. Papeles, cobros, IVA.'},
 marketing:{n:'Marketing',  color:'#7C6BFF', desc:'Sube la calidad de los leads que entran.'}
};

/* ============ RASGOS OCULTOS ============ */
/* Se descubren tras `dias` días en plantilla. Es lo que hace que contratar sea una apuesta. */
IMP.RASGOS = [
 {id:'crack_frio', n:'Crack en frío', bueno:true, dias:14, desc:'Aguanta el teléfono como nadie. Sube un 40% los leads que trae.', ef:{leadMul:1.4}},
 {id:'cierra', n:'Cerrador', bueno:true, dias:21, desc:'Cuando le pasas un lead caliente, lo cierra. +12 a interés en sus tratos.', ef:{cierre:12}},
 {id:'autonomo', n:'No hay que decirle nada', bueno:true, dias:10, desc:'Trabaja solo. Te devuelve 1 de energía al día.', ef:{energia:1}},
 {id:'formador', n:'Enseña al resto', bueno:true, dias:30, desc:'El equipo entero gana un 8% de producción.', ef:{teamMul:1.08}},
 {id:'aguanta', n:'Aguanta la presión', bueno:true, dias:25, desc:'No pierde moral en las crisis.', ef:{moralFloor:true}},
 {id:'barato_caro', n:'El barato que sale caro', bueno:false, dias:12, desc:'Produce un 35% menos de lo que su ficha decía.', ef:{outMul:0.65}},
 {id:'quema', n:'Se quema rápido', bueno:false, dias:20, desc:'Pierde 3 de moral cada semana si no le subes el sueldo o le formas.', ef:{moralDrip:-3}},
 {id:'toxico', n:'Envenena', bueno:false, dias:16, desc:'Resta 2 de moral al equipo cada semana. Y no se nota hasta que se van dos.', ef:{teamMoral:-2}},
 {id:'cartera', n:'Los clientes son suyos', bueno:false, dias:35, desc:'Si se va o le echas, se lleva un 25% de la cartera.', ef:{robaCartera:0.25}},
 {id:'mercenario', n:'Mercenario', bueno:false, dias:18, desc:'Pide subida cada 60 días o amenaza con irse.', ef:{pideSubida:60}},
 {id:'lento', n:'Arranca lento', bueno:null, dias:8, desc:'Los primeros 60 días rinde la mitad. Después, un 20% más de lo normal.', ef:{arranque:60}},
 {id:'ni_fu', n:'Ni fu ni fa', bueno:null, dias:15, desc:'Exactamente lo que ponía en su ficha. Ni una sorpresa.', ef:{}},
 {id:'estrella', n:'Estrella con carácter', bueno:null, dias:22, desc:'Produce un 30% más y baja 1 de moral al equipo cada semana.', ef:{outMul:1.3, teamMoral:-1}},
 {id:'leal', n:'Leal', bueno:true, dias:40, desc:'No se va nunca aunque la moral esté por los suelos.', ef:{noSeVa:true}}
];

/* ============ CANDIDATOS ============ */
/* base: stats sobre 10 · coste = bruto mensual (el coste real es ×1,32) */
IMP.CANDIDATOS = [
 {rol:'comercial', p:'Junior sin experiencia', desc:'22 años, ganas y cero oficio. Barato.',           st:{ejec:4,auto:3,ventas:3,act:8}, bruto:1250, nivel:1},
 {rol:'comercial', p:'Teleoperador reconvertido', desc:'Ha comido mucho no por teléfono. Aguanta.',     st:{ejec:6,auto:5,ventas:5,act:6}, bruto:1550, nivel:1},
 {rol:'comercial', p:'Comercial de sector', desc:'Viene del mismo sector. Trae agenda... eso dice.',    st:{ejec:6,auto:7,ventas:7,act:5}, bruto:2100, nivel:3},
 {rol:'comercial', p:'Vendedor de coches', desc:'Cierra como una bestia, escucha regular.',             st:{ejec:7,auto:6,ventas:8,act:4}, bruto:2300, nivel:4},
 {rol:'comercial', p:'Director comercial en paro', desc:'Sabe montar el proceso, no quiere llamar.',    st:{ejec:5,auto:9,ventas:7,act:5}, bruto:3100, nivel:6},
 {rol:'comercial', p:'Autónomo a comisión', desc:'Sin fijo. Solo cobra si cierra.',                     st:{ejec:5,auto:8,ventas:6,act:6}, bruto:0, comision:0.22, nivel:2},
 {rol:'comercial', p:'La que viene de la competencia', desc:'Cara, buena y con contactos calientes.',   st:{ejec:8,auto:8,ventas:9,act:5}, bruto:3400, nivel:8},
 {rol:'entrega',   p:'Becario', desc:'Cuesta poco, produce poco, hay que explicárselo todo.',           st:{ejec:3,auto:2,ventas:1,act:9}, bruto:600, nivel:1},
 {rol:'entrega',   p:'Técnico con 5 años', desc:'Cumple. Ni brilla ni falla.',                          st:{ejec:7,auto:6,ventas:2,act:6}, bruto:1900, nivel:2},
 {rol:'entrega',   p:'Freelance de confianza', desc:'Sin nómina, por horas. Caro por hora, flexible.',  st:{ejec:8,auto:9,ventas:2,act:6}, bruto:0, porHora:42, nivel:2},
 {rol:'entrega',   p:'Manitas veterano', desc:'25 años de oficio. Lento con lo nuevo, sólido con todo.',st:{ejec:9,auto:8,ventas:3,act:5}, bruto:2600, nivel:5},
 {rol:'entrega',   p:'Recién titulado', desc:'Rápido aprendiendo, cero calle.',                         st:{ejec:5,auto:4,ventas:2,act:8}, bruto:1400, nivel:1},
 {rol:'entrega',   p:'Jefe de proyecto', desc:'Organiza al resto. Sube la capacidad de todos.',         st:{ejec:7,auto:9,ventas:3,act:6}, bruto:2900, nivel:6, equipoBoost:0.1},
 {rol:'admin',     p:'Administrativa a media jornada', desc:'20 horas. Te quita los papeles de encima.',st:{ejec:6,auto:6,ventas:1,act:7}, bruto:900, nivel:2},
 {rol:'admin',     p:'Contable con experiencia', desc:'Te ahorra sustos con Hacienda.',                 st:{ejec:8,auto:8,ventas:1,act:6}, bruto:2000, nivel:4, blindaHacienda:true},
 {rol:'admin',     p:'Asistente virtual', desc:'Remoto, por horas, sin contrato.',                      st:{ejec:5,auto:7,ventas:1,act:7}, bruto:0, porHora:14, nivel:1},
 {rol:'admin',     p:'Office manager', desc:'Lo lleva todo. Cuando falta, se nota en una semana.',      st:{ejec:8,auto:9,ventas:2,act:8}, bruto:2200, nivel:6},
 {rol:'marketing', p:'Community manager junior', desc:'Publica cosas. Los leads, ya veremos.',          st:{ejec:5,auto:4,ventas:2,act:8}, bruto:1300, nivel:2},
 {rol:'marketing', p:'Especialista en anuncios', desc:'Baja el coste por lead un 25%.',                 st:{ejec:7,auto:7,ventas:3,act:6}, bruto:2400, nivel:5, cacDown:0.25},
 {rol:'marketing', p:'Redactor', desc:'Escribe bien. Los efectos tardan tres meses en verse.',          st:{ejec:6,auto:8,ventas:2,act:7}, bruto:1800, nivel:4, diferido:true},
 {rol:'marketing', p:'Growth con datos', desc:'Caro. Mide todo y sube la calidad de lead un 30%.',      st:{ejec:8,auto:8,ventas:4,act:5}, bruto:3200, nivel:8, calidadUp:0.3},
 {rol:'comercial', p:'Tu cuñado', desc:'Te lo ha pedido tu familia. Complicado de echar.',              st:{ejec:4,auto:4,ventas:4,act:5}, bruto:1700, nivel:1, familia:true},
 {rol:'entrega',   p:'El que trabajó contigo hace años', desc:'Os conocéis. Sabes lo bueno y lo malo.', st:{ejec:7,auto:7,ventas:3,act:7}, bruto:2200, nivel:3, conocido:true},
 {rol:'comercial', p:'Perfil sobrecualificado', desc:'Viene de una grande. ¿Aguantará en una pyme?',    st:{ejec:8,auto:7,ventas:8,act:3}, bruto:3600, nivel:7}
];

/* ============ DISCUSIONES CON EL EQUIPO ============ */
/* Mismo motor que las ventas: medidores moral / confianza / paciencia. */
IMP.CONFLICTOS = [
 {id:'subida', trig:'antiguedad>180', tit:'Pide subida',
  intro:'{nombre} cierra la puerta del despacho antes de sentarse.',
  txt:'"Llevo {meses} meses aquí y sigo cobrando lo mismo que el primer día. He estado mirando ofertas."',
  res:[
   {t:'"¿Cuánto pides?"', m:2, c:4, cpt:'salario-emocional', fb:'Directo. Pero has hecho que la conversación vaya solo de dinero, y casi nunca es solo dinero.'},
   {t:'"Antes de hablar de números: ¿qué te está pasando aquí?"', m:6, c:12, cpt:'salario-emocional', fb:'Casi nadie se va solo por dinero: se van por su jefe, por aburrimiento o por no ver adónde van. Esta pregunta te dice cuál de los tres es.'},
   {t:'"Ahora mismo no puedo. Lo hablamos en enero."', m:-12, c:-8, riesgoFuga:0.35, cpt:'coste-rotacion', fb:'Aplazar sin fecha ni motivo es la forma más rápida de que empiece a contestar mensajes de reclutadores. Reemplazarle cuesta entre seis meses y un año de su sueldo.'},
   {t:'Le subo un 12% sin preguntar nada más.', m:10, c:5, coste:0.12, cpt:'salario-emocional', fb:'Se queda tres meses más. Si el problema no era el dinero, has comprado tiempo, no lealtad.'},
   {t:'"Te subo un 8% ahora y otro 8% en seis meses si llegamos a {objetivo}."', m:8, c:14, coste:0.08, cpt:'salario-emocional', fb:'Ligar la subida a un resultado convierte un gasto en un acuerdo. Y le da adónde ir, que es lo que casi nunca tienen.'}
  ]},
 {id:'choque', trig:'equipo>=3', tit:'Dos que no se aguantan',
  intro:'{nombre} lleva una semana sin hablarle a {otro}.',
  txt:'"O él o yo. Así no puedo trabajar."',
  res:[
   {t:'"Sentaos los dos conmigo esta tarde."', m:5, c:11, cpt:'despedir-tarde', fb:'Lo correcto y lo incómodo. Los conflictos que no se ponen encima de la mesa no desaparecen: se reparten por todo el equipo.'},
   {t:'"Sois mayores, arregladlo entre vosotros."', m:-10, c:-12, teamMoral:-6, cpt:'despedir-tarde', fb:'El equipo entero acaba de aprender que aquí los problemas no se resuelven. Eso cuesta más que el conflicto.'},
   {t:'"Cuéntame qué ha pasado exactamente, con hechos."', m:4, c:9, cpt:'despedir-tarde', fb:'Pedir hechos y no adjetivos baja la temperatura y te deja ver si hay algo real o es solo roce.'},
   {t:'Reorganizo el trabajo para que no coincidan.', m:2, c:3, cpt:'delegacion', fb:'Parche razonable. Funciona hasta que el equipo crece y vuelven a chocar.'}
  ]},
 {id:'bajo_rendimiento', trig:'output<coste', tit:'No está rindiendo',
  intro:'Llevas dos meses viendo el número de {nombre} en rojo.',
  txt:'"Yo creo que estoy haciendo mi trabajo bien, ¿no?"',
  res:[
   {t:'Le enseño el número: coste {coste} €, produce {output} €.', m:-4, c:14, cpt:'coste-vs-output', fb:'Feedback con dato y sin adjetivos. Duele y es lo único que cambia comportamientos. Lo vago no corrige nada.'},
   {t:'"Sí, sí, todo bien."', m:3, c:-10, cpt:'despedir-tarde', fb:'Acabas de comprar tres meses más de lo mismo, y el resto del equipo lo está viendo.'},
   {t:'"Vamos a marcar un objetivo para 30 días y lo revisamos."', m:2, c:12, plan:30, cpt:'coste-vs-output', fb:'Un plan con fecha es lo justo para los dos: o remonta, o la decisión ya no es una sorpresa para nadie.'},
   {t:'Le despido hoy.', m:-8, teamMoral:-4, despido:true, cpt:'despedir-tarde', fb:'Rápido pero sin aviso. Cuando echas a alguien que no sabía que iba mal, el resto del equipo empieza a mirarse la espalda.'}
  ]},
 {id:'quemado', trig:'moral<35', tit:'Está quemado',
  intro:'{nombre} lleva dos semanas llegando justo a la hora y yéndose justo a la hora.',
  txt:'"No sé, es que ya no le veo mucho sentido a esto."',
  res:[
   {t:'"¿Qué te haría venir con ganas otra vez?"', m:9, c:12, cpt:'salario-emocional', fb:'La pregunta que casi ningún jefe hace. La respuesta casi nunca cuesta dinero.'},
   {t:'"Ponte las pilas que aquí hay mucho trabajo."', m:-14, c:-12, riesgoFuga:0.4, cpt:'coste-rotacion', fb:'Has confirmado exactamente lo que estaba pensando. Empieza a buscar esta noche.'},
   {t:'Le doy dos días libres.', m:8, c:6, cpt:'salario-emocional', fb:'Alivia el síntoma. Si la causa sigue, vuelve en un mes.'},
   {t:'Le cambio de tarea o le doy algo nuevo.', m:11, c:9, cpt:'salario-emocional', fb:'El aburrimiento se cura con reto, no con vacaciones. Suele ser lo que funciona.'}
  ]},
 {id:'error_grave', trig:'always', tit:'La ha liado',
  intro:'{nombre} ha metido la pata con un cliente. Cliente cabreado.',
  txt:'"Lo siento muchísimo, no volverá a pasar."',
  res:[
   {t:'"¿Qué falló en el proceso para que esto pudiera pasar?"', m:6, c:15, cpt:'delegacion', fb:'Atacar el proceso y no la persona. Es lo que hace que un error grave se convierta en un error que ya no puede repetirse.'},
   {t:'Le echo la bronca delante de todos.', m:-16, teamMoral:-8, c:-14, cpt:'despedir-tarde', fb:'La bronca en público te da la razón un minuto y te cuesta el equipo un año. A partir de hoy nadie te contará un problema pronto.'},
   {t:'"Tranquilo, ya lo arreglo yo."', m:4, c:-4, energia:-1, cpt:'delegacion', fb:'Te acabas de quedar el marrón y le has quitado el aprendizaje. Así es como el dueño se convierte en el cuello de botella.'},
   {t:'"Llámale tú y cuéntame cómo ha ido."', m:2, c:11, cpt:'delegacion', fb:'Que lo arregle quien lo rompió, con red pero sin sustituirle. Es delegar de verdad.'}
  ]},
 {id:'oferta_fuera', trig:'moral<55', tit:'Tiene otra oferta',
  intro:'{nombre} te lo suelta un viernes a las siete.',
  txt:'"Me han ofrecido {oferta} € en otro sitio. No me quiero ir, pero..."',
  res:[
   {t:'"¿Qué tendría que pasar aquí para que no te fueras?"', m:7, c:12, cpt:'salario-emocional', fb:'Le pides que te diga el precio real, que casi nunca es el número. A veces es un horario o un jefe.'},
   {t:'Igualo la oferta.', m:9, c:2, coste:0.15, cpt:'coste-rotacion', fb:'Se queda. Estadísticamente, la mayoría de los que aceptan una contraoferta se van igual antes de un año.'},
   {t:'"Pues enhorabuena, es una buena oferta."', m:-6, c:8, riesgoFuga:0.6, cpt:'coste-rotacion', fb:'Digno y arriesgado. Si se va, reemplazarle te va a costar mucho más que la diferencia.'},
   {t:'"No puedo igualarlo. Te puedo dar {alt} y esto otro."', m:5, c:13, coste:0.07, cpt:'salario-emocional', fb:'Competir con lo que tú sí tienes, en vez de con lo que no. Es la única contraoferta que aguanta.'}
  ]},
 {id:'pide_teletrabajo', trig:'always', tit:'Quiere teletrabajar',
  intro:'{nombre} lleva días rondando el tema.',
  txt:'"¿Podría trabajar desde casa dos días a la semana?"',
  res:[
   {t:'"Sí, probamos un mes y lo miramos con números."', m:9, c:11, cpt:'delegacion', fb:'Probar con criterio y con fecha. Si el rendimiento se mide, el sitio da igual.'},
   {t:'"No, aquí se viene a la oficina."', m:-9, c:-6, cpt:'salario-emocional', fb:'Puede ser tu decisión, pero sin explicar el porqué solo suena a desconfianza.'},
   {t:'"¿Qué necesitas que no tengas aquí?"', m:6, c:9, cpt:'salario-emocional', fb:'A veces no es teletrabajo: es el ruido, el jefe, o dos horas de coche al día.'}
  ]},
 {id:'quiere_mas', trig:'nivel>=3', tit:'Quiere crecer',
  intro:'{nombre} te pide cinco minutos.',
  txt:'"¿Yo aquí adónde puedo llegar?"',
  res:[
   {t:'"Ahora mismo no lo sé, la verdad."', m:-11, c:4, riesgoFuga:0.3, cpt:'salario-emocional', fb:'Honesto y carísimo. El que no ve adónde va, se va.'},
   {t:'Le dibujo el siguiente paso concreto y qué hace falta para llegar.', m:12, c:14, cpt:'salario-emocional', fb:'No hace falta tener organigrama: hace falta que sepa qué es lo siguiente y de qué depende.'},
   {t:'"Tú tranquilo, que aquí se te va a cuidar."', m:1, c:-5, cpt:'salario-emocional', fb:'Vaguedad amable. La ha oído antes y no significa nada.'}
  ]}
];
