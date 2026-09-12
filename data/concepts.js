/* IMPERIO — El Códex. Cada concepto se desbloquea VIVIÉNDOLO, no leyéndolo. */
window.IMP = window.IMP || {}; IMP.CONCEPTS = [

/* ---------- VENTA: conseguir que te miren ---------- */
{id:'ley-numeros', a:'VENTA', n:'La ley de los números', d:'La prospección en frío es un embudo con fugas brutales: de 100 impactos salen ~20 respuestas, ~8 reuniones y ~2 clientes. No es que lo hagas mal: es la tasa. El error es medir el resultado de 10 intentos.', f:'Clientes = Impactos × Tasa respuesta × Tasa reunión × Tasa cierre'},
{id:'canal-vs-mensaje', a:'VENTA', n:'Canal contra mensaje', d:'Cuando no responden, casi todo el mundo cambia de canal. Casi siempre el problema es el mensaje. Un mensaje malo en LinkedIn sigue siendo malo por teléfono.', f:null},
{id:'no-rapido', a:'VENTA', n:'El no rápido vale dinero', d:'Un "no" en el minuto dos te devuelve dos horas. El caro es el "ya te diré", que te ocupa el pipeline y la cabeza durante meses.', f:null},
{id:'rechazo-personal', a:'VENTA', n:'El rechazo no es tuyo', d:'Rechazan el mensaje, el momento o el precio. Tratarlo como algo personal es lo que hace que dejes de llamar el jueves. La constancia es la habilidad, no el carisma.', f:null},
{id:'lista-antes-que-guion', a:'VENTA', n:'La lista antes que el guion', d:'Un guion mediocre a una lista buena vende. Un guion perfecto a una lista mala no vende nada. A quién llamas pesa más que qué dices.', f:null},
{id:'referido', a:'VENTA', n:'El referido', d:'Convierte 4-6 veces mejor que el frío y no cuesta dinero, solo la incomodidad de pedirlo. Casi nadie lo pide porque da vergüenza. Ahí está el margen.', f:null},

/* ---------- VENTA: cualificar ---------- */
{id:'cualificacion', a:'VENTA', n:'Cualificar', d:'Antes de contarle nada a nadie: ¿tiene el problema, tiene dinero, decide él y tiene prisa? Si falla uno, no es un cliente todavía. Es una conversación agradable.', f:'Dolor + Presupuesto + Decisión + Urgencia'},
{id:'decisor', a:'VENTA', n:'Decisor contra interlocutor', d:'La persona simpática que te atiende muchas veces no firma. Presentar la propuesta a quien no decide es hacer el trabajo dos veces, y la segunda sin ti delante.', f:null},
{id:'coste-inaccion', a:'VENTA', n:'El coste de no hacer nada', d:'Tu competidor no es la otra empresa: es que sigan igual. Si no pones número a lo que les cuesta el problema cada mes, tu precio no tiene contra qué compararse.', f:'Coste mensual del problema × meses'},
{id:'dolor-cuantificado', a:'VENTA', n:'Dolor con número', d:'"Perdemos tiempo" no cierra nada. "Se nos van 4.200 € al mes en repetir trabajo" cierra. El número no lo pones tú: se lo sacas preguntando y se lo repites con sus palabras.', f:null},
{id:'presupuesto-vs-precio', a:'VENTA', n:'Presupuesto contra precio', d:'"Es caro" casi nunca significa que valga demasiado. Significa que no tiene ese dinero asignado ahí, o que no ve el retorno. Son dos problemas distintos y se arreglan distinto.', f:null},

/* ---------- VENTA: descubrimiento ---------- */
{id:'preguntar-antes', a:'VENTA', n:'Descubrir antes de rebatir', d:'Una objeción que rebates sin información es una discusión. La misma objeción, con tres datos que te ha dado él, es una conversación que ya tiene respuesta.', f:null},
{id:'silencio', a:'VENTA', n:'El silencio después del precio', d:'Dices el precio y te callas. El primero que habla, negocia contra sí mismo. Casi todo el mundo rellena el silencio bajándose el pantalón.', f:null},
{id:'escucha-ratio', a:'VENTA', n:'La proporción de escucha', d:'En las llamadas que cierran, el cliente habla más de la mitad del tiempo. En las que no, hablas tú. Se puede medir y es de las pocas métricas de venta que no engañan.', f:null},
{id:'pregunta-implicacion', a:'VENTA', n:'La pregunta de implicación', d:'No preguntes solo qué pasa: pregunta qué provoca lo que pasa. "¿Y eso en qué se traduce a fin de mes?" Es la pregunta que convierte un problema en un presupuesto.', f:null},

/* ---------- VENTA: precio y propuesta ---------- */
{id:'anclaje', a:'VENTA', n:'El anclaje', d:'La primera cifra que se dice condiciona todas las demás. Si abres bajo por miedo, negocias hacia abajo desde ahí. Nadie sube desde tu ancla.', f:null},
{id:'descuento-margen', a:'VENTA', n:'Lo que se lleva un descuento', d:'Con un 30% de margen, un 10% de descuento no te quita un 10%: te quita un tercio del beneficio de ese trabajo. Y el trabajo lo haces igual de completo.', f:'Margen nuevo = Margen − Descuento'},
{id:'bajar-precio-rapido', a:'VENTA', n:'Bajar el precio demasiado rápido', d:'Si cedes en el primer empujón, acabas de contarle que el precio era inventado. El interés sube un poco, la confianza se cae, y en la renovación empiezas otra vez desde abajo.', f:null},
{id:'valor-vs-coste', a:'VENTA', n:'Precio contra valor', d:'El precio se defiende con el retorno, no con tus horas. A nadie le importa lo que te cuesta hacerlo. Le importa lo que le pasa si lo hace y lo que le pasa si no.', f:'ROI = (Beneficio − Precio) / Precio'},
{id:'propuesta-unica', a:'VENTA', n:'Por qué tú', d:'Si tu propuesta sirve igual con el logo de otro, el cliente solo puede elegir por precio. Lo has convertido tú en una subasta.', f:null},
{id:'tres-opciones', a:'VENTA', n:'Tres opciones, no una', d:'Con una opción la pregunta es sí o no. Con tres, la pregunta es cuál. Cambia la decisión y sube el ticket medio, siempre que la de arriba sea de verdad.', f:null},

/* ---------- VENTA: objeciones ---------- */
{id:'objecion-cortina', a:'VENTA', n:'La primera objeción es una cortina', d:'"Es caro" y "lo tengo que consultar" son lo que se dice para colgar. La de verdad está detrás y solo sale si preguntas sin ponerte a la defensiva.', f:null},
{id:'objecion-como-interes', a:'VENTA', n:'Objeción es interés', d:'El que no tiene ninguna intención no discute: asiente y desaparece. Una objeción concreta significa que se lo está imaginando.', f:null},
{id:'riesgo-percibido', a:'VENTA', n:'El riesgo percibido', d:'Muchas veces no dudan de que funcione: dudan de quedar mal si no funciona. Se baja con garantías, con un primer paso pequeño y con casos parecidos al suyo.', f:null},
{id:'ya-tengo-proveedor', a:'VENTA', n:'"Ya trabajo con otro"', d:'No es un no, es un momento. Casi nadie cambia de proveedor el día que se lo propones; cambian el día que el suyo la lía. Tu trabajo es estar en la cabeza ese día.', f:null},
{id:'prueba-social', a:'VENTA', n:'Prueba social', d:'Un caso de alguien de su sector y de su tamaño vale más que veinte argumentos. Uno de un sector que no es el suyo no vale casi nada.', f:null},

/* ---------- VENTA: cierre y seguimiento ---------- */
{id:'seguimiento', a:'VENTA', n:'El seguimiento', d:'La mayoría de las ventas se cierran entre el quinto y el duodécimo contacto, y la mayoría de los vendedores se caen en el segundo. No es un detalle: es dónde está el dinero que ya te has ganado.', f:null},
{id:'siguiente-paso', a:'VENTA', n:'Siempre con fecha', d:'Una reunión que acaba en "te digo algo" está muerta. Se sale con día, hora y qué pasa ese día. Si no acepta fecha, no había interés.', f:null},
{id:'cerrar-o-perder', a:'VENTA', n:'Cerrar es preguntar', d:'Un porcentaje enorme de propuestas no se pierden: nadie pidió el sí. Preguntar directamente no es agresivo, es respetar el tiempo de los dos.', f:null},
{id:'pipeline-ponderado', a:'VENTA', n:'Pipeline ponderado', d:'Sumar todas las propuestas abiertas como si fueran a entrar es cómo se arruina la gente optimista. Cada fase tiene su probabilidad real y se multiplica.', f:'Previsión = Σ (Importe × Probabilidad de fase)'},
{id:'ciclo-venta', a:'VENTA', n:'El ciclo de venta', d:'Lo que tardas desde el primer contacto hasta el cobro. Si es de 90 días, lo que vendas hoy lo cobras en tres meses: tu caja de hoy la decidiste en abril.', f:null},

/* ---------- VENTA: la cartera ---------- */
{id:'churn', a:'VENTA', n:'Fuga de clientes', d:'Con un 5% de fuga mensual pierdes casi la mitad de la cartera en un año. Puedes estar cerrando como un animal y no crecer nada.', f:'Fuga = Clientes perdidos / Clientes al inicio'},
{id:'nrr', a:'VENTA', n:'Crecer sin vender', d:'Los clientes que ya tienes pueden crecer solos si les subes precio o les vendes más. Cuando eso compensa las bajas, creces sin cerrar nada nuevo.', f:'(Recurrente inicial + Ampliaciones − Bajas) / Recurrente inicial'},
{id:'upsell', a:'VENTA', n:'Vender a quien ya te compra', d:'Venderle a un cliente actual cuesta una fracción de lo que cuesta uno nuevo y cierra mucho más. Es lo primero que se abandona cuando hay prisa.', f:null},
{id:'concentracion', a:'VENTA', n:'Concentración de clientes', d:'Si un cliente es más del 30% de tu facturación, no tienes un cliente: tienes un jefe. Y no lo sabes hasta que te pide algo que no quieres hacer.', f:'Peso = Facturación del cliente / Total'},
{id:'ltv', a:'VENTA', n:'Valor de vida del cliente', d:'Lo que te deja un cliente desde que entra hasta que se va. Sin este número no sabes cuánto puedes gastarte en conseguir uno.', f:'LTV = Ticket mensual × Margen × Meses que aguanta'},
{id:'cac', a:'VENTA', n:'Coste de adquisición', d:'Todo lo que te gastas en captar dividido entre los clientes que entran. Incluye tu tiempo, aunque no te lo cobres.', f:'CAC = (Marketing + Ventas) / Clientes nuevos'},
{id:'ltv-cac', a:'VENTA', n:'La relación que decide si escalas', d:'Si un cliente te deja menos de tres veces lo que cuesta traerlo, cada venta nueva te aprieta la caja en vez de aliviarla. Crecer así es acelerar hacia el muro.', f:'LTV / CAC ≥ 3'},
{id:'recuperar-perdido', a:'VENTA', n:'El cliente perdido', d:'Un cliente que se fue hace un año convierte mejor que un frío: te conoce y ya sabes por qué se fue. Casi nadie llama a los que se fueron.', f:null},

/* ---------- FINANZAS (donde ya sabes: aquí el juego te cobra los errores de venta) ---------- */
{id:'punto-muerto', a:'FINANZAS', n:'Punto muerto', d:'Lo que tienes que facturar para no perder dinero. Por debajo, cada día abierto te cuesta. Es el primer número que deberías saber de memoria.', f:'Fijos / % de margen'},
{id:'margen-contribucion', a:'FINANZAS', n:'Margen de contribución', d:'Lo que deja cada venta después de lo que cuesta entregarla. Es lo que paga los fijos. Facturar sin mirarlo es mover dinero, no ganarlo.', f:'Precio − Coste variable'},
{id:'caja-vs-beneficio', a:'FINANZAS', n:'Caja contra beneficio', d:'Se puede quebrar ganando dinero. El beneficio es una opinión contable; la caja es si mañana pagas las nóminas.', f:null},
{id:'periodo-cobro', a:'FINANZAS', n:'Periodo medio de cobro', d:'Lo que tardan en pagarte. A 90 días estás financiando gratis a tu cliente con tu dinero, y encima con IVA adelantado.', f:'(Clientes pendientes / Ventas) × 365'},
{id:'iva-no-es-tuyo', a:'FINANZAS', n:'El IVA no es tuyo', d:'Entra en tu cuenta y parece dinero. Es de Hacienda y sale el 20 del mes siguiente al trimestre. Gastárselo es el error de caja más común que existe.', f:null},
{id:'coste-hundido', a:'FINANZAS', n:'Coste hundido', d:'El dinero ya gastado no debe entrar en la decisión de mañana. "Llevo tres meses con este cliente" no es un motivo para seguir perdiendo dinero con él.', f:null},
{id:'coste-oportunidad', a:'FINANZAS', n:'Coste de oportunidad', d:'Lo que dejas de ganar por decir que sí a otra cosa. Un cliente de bajo margen que te ocupa las mañanas no cuesta cero: cuesta el bueno que no atendiste.', f:null},
{id:'runway', a:'FINANZAS', n:'Meses de aire', d:'Caja dividida entre lo que te vas dejando cada mes. Cuando baja de tres meses, las decisiones empiezan a tomarlas el miedo y el banco.', f:'Caja / Gasto mensual neto'},
{id:'banco-paraguas', a:'FINANZAS', n:'El banco presta paraguas', d:'Te da dinero cuando puedes demostrar que no lo necesitas. La línea de crédito se pide con la cuenta sana, no el mes que no llegas.', f:null},

/* ---------- EQUIPO ---------- */
{id:'coste-real-empleado', a:'EQUIPO', n:'Lo que cuesta de verdad un empleado', d:'El sueldo que ve él no es lo que sale de tu cuenta. Con Seguridad Social a cargo de la empresa, súmale en torno a un tercio más.', f:'Coste ≈ Bruto × 1,32'},
{id:'coste-rotacion', a:'EQUIPO', n:'Lo que cuesta que se vaya', d:'Selección, tiempo tuyo, meses de rendimiento a medio gas y lo que se lleva en la cabeza. Entre seis meses y un año de su sueldo.', f:null},
{id:'coste-vs-output', a:'EQUIPO', n:'Coste contra producción', d:'Cada persona genera un número al mes. Si su coste es mayor, no es que rinda poco: es que estás pagando por perder dinero, todos los meses, en silencio.', f:'Output mensual − Coste mensual'},
{id:'despedir-tarde', a:'EQUIPO', n:'Contratar despacio, despedir rápido', d:'La decisión que todo el mundo retrasa. El coste no es la indemnización: son los meses que el resto del equipo ve que no pasa nada.', f:null},
{id:'delegacion', a:'EQUIPO', n:'Delegar es soltar el resultado', d:'Si revisas cada cosa, no has delegado: has repartido el trabajo y te has quedado el cuello de botella. Delegar es aceptar un 80% hecho a su manera.', f:null},
{id:'salario-emocional', a:'EQUIPO', n:'Lo que retiene además del dinero', d:'Casi nadie se va solo por dinero: se van por su jefe, por aburrimiento o por no ver adónde van. Subir el sueldo a quien se aburre solo retrasa la salida.', f:null},

/* ---------- COMPRAR EMPRESAS ---------- */
{id:'multiplo', a:'COMPRAS', n:'El múltiplo', d:'Una pyme se paga a unas pocas veces su beneficio operativo. El múltiplo sube si los ingresos son recurrentes y baja si todo depende del dueño.', f:'Precio ≈ EBITDA × múltiplo'},
{id:'due-diligence', a:'COMPRAS', n:'Due diligence', d:'Mirar debajo de la alfombra antes de firmar. Cuesta dinero y siempre parece innecesaria justo hasta el día que descubres lo que no miraste.', f:null},
{id:'earn-out', a:'COMPRAS', n:'Earn-out', d:'Pagar una parte ahora y el resto solo si la empresa cumple. Reparte el riesgo y mantiene al vendedor remando. También es donde acaban casi todos los pleitos.', f:null},
{id:'dependencia-fundador', a:'COMPRAS', n:'La empresa era el dueño', d:'Si los clientes son suyos, el criterio es suyo y las decisiones son suyas, no estás comprando una empresa: estás comprando su agenda, y se va.', f:null},
{id:'integracion', a:'COMPRAS', n:'El riesgo está después de firmar', d:'La mayoría de las compras que salen mal no se pagaron caras: se integraron mal. Dos formas de trabajar chocando destruyen más valor que un múltiplo alto.', f:null}
];
