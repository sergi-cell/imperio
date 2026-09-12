/* IMPERIO — MUNDO: zonas, compras, crisis, dilemas, banco. */
window.IMP = window.IMP || {};

/* ============ ZONAS DEL MAPA ============ */
IMP.ZONAS = [
 {id:'despacho', n:'Tu despacho',        x:50, y:90, nivel:1,  ic:'desk',  desc:'Pipeline, números, decisiones. Aquí no entra dinero: aquí se decide de dónde va a entrar.'},
 {id:'calle',    n:'La calle',           x:20, y:73, nivel:1,  ic:'road',  desc:'Prospección. Listas, teléfono, correos y noes. Todo empieza aquí.'},
 {id:'sala',     n:'Sala de reuniones',  x:50, y:57, nivel:1,  ic:'chair', desc:'Donde se vende de verdad. Descubrir, proponer, aguantar objeciones y pedir el sí.'},
 {id:'taller',   n:'Entrega',            x:80, y:73, nivel:1,  ic:'gear',  desc:'Los clientes que ya tienes. Si no los atiendes, se van y no te enteras hasta el recibo.'},
 {id:'talento',  n:'Mercado de talento', x:20, y:41, nivel:3,  ic:'people',desc:'Contratar es apostar. La ficha nunca dice lo importante.'},
 {id:'banco',    n:'Banco',              x:80, y:41, nivel:4,  ic:'bank',  desc:'Préstamos, línea de crédito y factoring. Te dan cuando puedes demostrar que no lo necesitas.'},
 {id:'hacienda', n:'Hacienda',           x:50, y:26, nivel:5,  ic:'stamp', desc:'IVA trimestral, IRPF y la posibilidad de una inspección. Ineludible.'},
 {id:'puerto',   n:'El puerto',          x:20, y:11, nivel:9,  ic:'ship',  desc:'Comprar empresas. Se paga por múltiplo y se pierde por integración.'},
 {id:'cumbre',   n:'La cumbre',          x:80, y:11, nivel:16, ic:'crown', desc:'Los grandes. Ciclos de venta de meses y contratos que cambian la empresa.'}
];

/* ============ EMPRESAS COMPRABLES ============ */
/* pub = lo que te enseñan · oc = lo que solo sale con due diligence */
IMP.TARGETS = [
 {n:'Mecanizados Bellver', sec:'metal', pub:{fact:420000, ebitda:64000, emp:6, ant:18},  pide:3.6,
  oc:[{id:'conc', sev:3, t:'El 62% de la facturación es un solo cliente, y su contrato vence en 5 meses.', ef:{factMul:0.55, risk:0.5}, cpt:'concentracion'}]},
 {n:'Fincas Otero', sec:'inmo', pub:{fact:260000, ebitda:52000, emp:4, ant:11}, pide:4.2,
  oc:[{id:'fund', sev:3, t:'Todos los clientes son del dueño. Se va en cuanto cobre.', ef:{factMul:0.5}, cpt:'dependencia-fundador'}]},
 {n:'Clínica Dental Vera', sec:'clinica', pub:{fact:510000, ebitda:98000, emp:7, ant:14}, pide:4.0,
  oc:[{id:'equipo', sev:2, t:'El equipamiento está amortizado y hay que renovarlo: 85.000 € el año que viene.', ef:{cash:-85000}, cpt:'due-diligence'}]},
 {n:'Transportes Quintana', sec:'log', pub:{fact:880000, ebitda:71000, emp:12, ant:22}, pide:3.2,
  oc:[{id:'deuda', sev:3, t:'Deuda con proveedores no declarada: 120.000 €.', ef:{debt:120000}, cpt:'due-diligence'},
      {id:'flota', sev:1, t:'Dos camiones pasan ITV en marzo y no la pasan.', ef:{cash:-24000}, cpt:'due-diligence'}]},
 {n:'Asesoría Mena', sec:'asesoria', pub:{fact:340000, ebitda:88000, emp:5, ant:26}, pide:4.5,
  oc:[{id:'edad', sev:2, t:'La cartera es de clientes de 60+ años que se están jubilando: -8% al año.', ef:{decay:0.08}, cpt:'churn'}]},
 {n:'Agencia Rueda', sec:'agencia', pub:{fact:295000, ebitda:41000, emp:6, ant:7}, pide:3.0,
  oc:[{id:'churn', sev:3, t:'Fuga del 7% mensual. Están captando solo para tapar bajas.', ef:{decay:0.25}, cpt:'churn'}]},
 {n:'Reformas Villar', sec:'const', pub:{fact:1250000, ebitda:112000, emp:14, ant:19}, pide:3.4,
  oc:[{id:'pleito', sev:3, t:'Litigio abierto con una comunidad de vecinos: 180.000 € de riesgo.', ef:{riesgoLegal:180000}, cpt:'due-diligence'}]},
 {n:'Sabaté Systems', sec:'soft', pub:{fact:640000, ebitda:145000, emp:8, ant:9}, pide:5.2,
  oc:[{id:'tech', sev:2, t:'El producto está construido sobre tecnología que nadie mantiene ya.', ef:{cash:-95000}, cpt:'due-diligence'}]},
 {n:'Academia Puig', sec:'academia', pub:{fact:210000, ebitda:38000, emp:5, ant:12}, pide:3.1, oc:[]},
 {n:'Fisio Badía', sec:'salud', pub:{fact:180000, ebitda:44000, emp:4, ant:8}, pide:3.5,
  oc:[{id:'local', sev:2, t:'El alquiler sube un 40% al renovar en 9 meses.', ef:{fijos:900}, cpt:'due-diligence'}]},
 {n:'Grupo Peris Restauración', sec:'hosteler', pub:{fact:1450000, ebitda:96000, emp:28, ant:16}, pide:2.8,
  oc:[{id:'plantilla', sev:3, t:'Rotación del 90% anual. Nadie dura tres meses.', ef:{moral:-25}, cpt:'coste-rotacion'}]},
 {n:'Directo Store', sec:'ecom', pub:{fact:720000, ebitda:58000, emp:5, ant:6}, pide:3.8,
  oc:[{id:'cac', sev:3, t:'El coste por venta se ha doblado en 18 meses y sigue subiendo.', ef:{decay:0.15, fijos:2200}, cpt:'ltv-cac'}]},
 {n:'Calderería Beltrán', sec:'metal', pub:{fact:990000, ebitda:134000, emp:15, ant:31}, pide:4.1,
  oc:[{id:'clave', sev:2, t:'Un solo soldador sabe hacer la pieza que da el 40% del margen. Tiene 63 años.', ef:{risk:0.35}, cpt:'dependencia-fundador'}]},
 {n:'Distribuciones Cortés', sec:'log', pub:{fact:2100000, ebitda:168000, emp:22, ant:24}, pide:3.9,
  oc:[{id:'cobro', sev:2, t:'Cobran a 120 días de media. Necesita 250.000 € de circulante.', ef:{cash:-250000}, cpt:'periodo-cobro'}]},
 {n:'Escudero Media', sec:'agencia', pub:{fact:480000, ebitda:92000, emp:7, ant:11}, pide:4.4, oc:[]},
 {n:'Gestoría Lozano', sec:'asesoria', pub:{fact:760000, ebitda:171000, emp:11, ant:29}, pide:5.0,
  oc:[{id:'software', sev:1, t:'Trabajan con un programa de 2009. Migrar cuesta 40.000 € y seis meses.', ef:{cash:-40000}, cpt:'integracion'}]}
];

/* ============ ÁREAS DE DUE DILIGENCE ============ */
IMP.DD = [
 {id:'fin', n:'Financiera', coste:0.012, desc:'Cuentas, deuda real, circulante.', revela:['deuda','cobro','local','equipo','software','tech']},
 {id:'com', n:'Comercial',  coste:0.010, desc:'Cartera, concentración, fuga.',    revela:['conc','churn','cac','edad','fund']},
 {id:'lab', n:'Laboral',    coste:0.008, desc:'Plantilla, rotación, contratos.',  revela:['plantilla','clave','flota']},
 {id:'leg', n:'Legal',      coste:0.009, desc:'Pleitos, contratos, licencias.',   revela:['pleito','riesgoLegal']}
];

/* ============ CRISIS Y EVENTOS ============ */
/* p = peso base · min = día mínimo · cat: crisis | oportunidad */
IMP.EVENTOS = [
 {id:'ev_fuga_grande', cat:'crisis', min:25, p:3, tit:'Se va el cliente grande',
  txt:'{cliente} no renueva. Era el {peso}% de lo que entra cada mes. Te enteras por un correo de dos líneas.', ef:{bajaMayor:true}, cpt:'concentracion'},
 {id:'ev_impago', cat:'crisis', min:15, p:4, tit:'Impago',
  txt:'{cliente} lleva 74 días sin pagar {importe} €. Su gestoría no coge el teléfono.', ef:{impago:true}, cpt:'periodo-cobro'},
 {id:'ev_dimite', cat:'crisis', min:30, p:3, tit:'Dimisión',
  txt:'{empleado} entrega la carta. Se va en 15 días.', ef:{dimite:true}, cpt:'coste-rotacion'},
 {id:'ev_baja', cat:'crisis', min:20, p:2, tit:'Baja médica',
  txt:'{empleado} está de baja seis semanas. Sigues pagando y no produce.', ef:{baja:42}, cpt:'coste-real-empleado'},
 {id:'ev_competidor', cat:'crisis', min:40, p:3, tit:'Entra un competidor a mitad de precio',
  txt:'Una empresa nueva está llamando a tus clientes con tu servicio a la mitad.', ef:{presionPrecio:0.12}, cpt:'propuesta-unica'},
 {id:'ev_inspeccion', cat:'crisis', min:60, p:2, tit:'Inspección de Hacienda',
  txt:'Carta certificada. Requerimiento de documentación de los dos últimos ejercicios.', ef:{inspeccion:true}, cpt:'iva-no-es-tuyo'},
 {id:'ev_subida_costes', cat:'crisis', min:35, p:2, tit:'Suben los costes fijos',
  txt:'Alquiler, luz y seguros. Un {pct}% más a partir de este mes.', ef:{fijosMul:1.08}, cpt:'punto-muerto'},
 {id:'ev_error_entrega', cat:'crisis', min:18, p:3, tit:'La habéis liado con un cliente',
  txt:'{cliente} está furioso. O lo arreglas o se va y lo cuenta.', ef:{satisfaccion:-30}, cpt:'churn'},
 {id:'ev_moroso_juicio', cat:'crisis', min:75, p:1, tit:'Reclamación judicial',
  txt:'Un impago tuyo de hace meses acaba en el juzgado. Abogado: 3.500 €.', ef:{cash:-3500}, cpt:'periodo-cobro'},
 {id:'ev_burnout', cat:'crisis', min:50, p:2, tit:'El equipo está reventado',
  txt:'Llevas tres meses al 100% de capacidad. La moral se hunde.', ef:{moral:-15}, cpt:'delegacion'},
 {id:'ev_robo_cartera', cat:'crisis', min:90, p:2, tit:'Se lleva clientes',
  txt:'{empleado} se ha ido y dos clientes se han ido con él.', ef:{robaCartera:true}, cpt:'concentracion'},
 {id:'ev_precio_lead', cat:'crisis', min:45, p:3, tit:'Sube el coste por lead',
  txt:'Los anuncios cuestan un {pct}% más que el trimestre pasado. Todo el sector igual.', ef:{cacMul:1.2}, cpt:'cac'},
 {id:'ev_banco_corta', cat:'crisis', min:80, p:1, tit:'El banco recorta la línea',
  txt:'Revisión anual: te bajan la línea de crédito a la mitad.', ef:{lineaMul:0.5}, cpt:'banco-paraguas'},
 {id:'ev_denuncia_lab', cat:'crisis', min:70, p:1, tit:'Demanda laboral',
  txt:'Un despido de hace meses acaba en el SMAC. Toca pagar la diferencia.', ef:{cash:-6000}, cpt:'despedir-tarde'},

 {id:'ev_referido', cat:'oportunidad', min:8, p:4, tit:'Referido caliente',
  txt:'{cliente} te ha recomendado. Te llaman ellos a ti.', ef:{leadCaliente:true}, cpt:'referido'},
 {id:'ev_upsell', cat:'oportunidad', min:20, p:3, tit:'Un cliente quiere más',
  txt:'{cliente} pregunta si podéis hacer también otra cosa.', ef:{upsell:true}, cpt:'upsell'},
 {id:'ev_prensa', cat:'oportunidad', min:55, p:2, tit:'Salís en prensa del sector',
  txt:'Un medio del sector os menciona. Entran leads solos durante dos semanas.', ef:{repu:8, leadsBonus:4}, cpt:'prueba-social'},
 {id:'ev_concurso', cat:'oportunidad', min:65, p:2, tit:'Concurso público',
  txt:'Sale un contrato menor de {importe} €. Presentarse cuesta tiempo y no garantiza nada.', ef:{concurso:true}, cpt:'pipeline-ponderado'},
 {id:'ev_talento', cat:'oportunidad', min:30, p:2, tit:'Candidato inesperado',
  txt:'Alguien bueno de la competencia te escribe. Está disponible esta semana.', ef:{candidatoTop:true}, cpt:'coste-rotacion'},
 {id:'ev_recuperado', cat:'oportunidad', min:60, p:2, tit:'Vuelve un cliente perdido',
  txt:'{cliente} se fue hace meses. Su nuevo proveedor la ha liado.', ef:{recupera:true}, cpt:'recuperar-perdido'},
 {id:'ev_venta_grande', cat:'oportunidad', min:85, p:2, tit:'Oportunidad grande',
  txt:'Una empresa de verdad quiere hablar contigo. Ticket cuatro veces tu media.', ef:{leadGrande:true}, cpt:'cualificacion'},
 {id:'ev_subvencion', cat:'oportunidad', min:40, p:1, tit:'Subvención',
  txt:'Sale una ayuda a la digitalización: {importe} € si presentas papeles.', ef:{subvencion:true}, cpt:'runway'},
 {id:'ev_proveedor', cat:'oportunidad', min:35, p:2, tit:'Tu proveedor te mejora precio',
  txt:'Por volumen, te bajan el coste un 6%. Tu margen sube sin vender más.', ef:{margen:0.06}, cpt:'margen-contribucion'},
 {id:'ev_alianza', cat:'oportunidad', min:70, p:1, tit:'Alianza',
  txt:'Una empresa complementaria propone pasarse clientes.', ef:{alianza:true}, cpt:'referido'}
];

/* ============ DILEMAS ESTRATÉGICOS ============ */
/* Los A/B/C, pero con consecuencias que duran meses. */
IMP.DILEMAS = [
 {id:'d_cliente_toxico', min:20, tit:'El cliente que te come',
  txt:'{cliente} te paga {importe} €/mes y te ocupa el 40% del equipo. Discute cada factura y llama los domingos.',
  op:[{t:'Aguantarlo. Es dinero.', ef:{moral:-8, capacidad:-0.15}, cpt:'coste-oportunidad', fb:'Ese cliente no te cuesta cero: te cuesta el bueno que no puedes atender. Y tu equipo lo sabe antes que tú.'},
      {t:'Subirle un 40% el precio. Que decida él.', ef:{riesgoBaja:0.5, precioUp:0.4}, cpt:'valor-vs-coste', fb:'La jugada limpia: o pasa a ser rentable, o se va y liberas capacidad. Las dos salidas son buenas.'},
      {t:'Echarlo yo.', ef:{bajaEspecifica:true, moral:8, capacidad:0.15}, cpt:'coste-oportunidad', fb:'Duele en la facturación de este mes y arregla los seis siguientes. Casi nadie se atreve.'}]},
 {id:'d_bajar_precios', min:30, tit:'La guerra de precios',
  txt:'El competidor nuevo está a mitad de precio. Tres clientes ya lo han mencionado.',
  op:[{t:'Igualar precios para no perder a nadie.', ef:{precioDown:0.35, margen:-0.3}, cpt:'descuento-margen', fb:'Has entrado en una guerra que gana el que más aguante perdiendo. Con tu estructura, no eres tú.'},
      {t:'Mantener precio y explicar la diferencia uno a uno.', ef:{riesgoBaja:0.2, repu:5}, cpt:'propuesta-unica', fb:'Vas a perder a los que solo compraban precio. Son justo los que más te costaba atender.'},
      {t:'Sacar una versión más barata y recortada.', ef:{nuevaLinea:true, capacidad:-0.1}, cpt:'tres-opciones', fb:'Segmentar en vez de rebajar. Funciona si de verdad recortas el alcance, no si es lo mismo más barato.'}]},
 {id:'d_contratar_o_no', min:25, tit:'¿Contratar ya?',
  txt:'Estás al 95% de capacidad. Un comercial cuesta {coste} €/mes y tarda 3 meses en producir.',
  op:[{t:'Contratar ahora, antes de necesitarlo.', ef:{contrataYa:true}, cpt:'runway', fb:'Lo correcto si tienes caja para tres meses de rampa. Si no la tienes, es cómo se muere una empresa que iba bien.'},
      {t:'Esperar a cerrar dos clientes más.', ef:{capacidadRiesgo:true}, cpt:'coste-oportunidad', fb:'Prudente y lento. El problema: cuando lo necesites de verdad, tardará tres meses en servir.'},
      {t:'Meter un freelance por horas.', ef:{freelance:true}, cpt:'margen-contribucion', fb:'Coste variable en vez de fijo. Más caro por hora y muchísimo menos peligroso.'}]},
 {id:'d_iva', min:45, tit:'El trimestre',
  txt:'Toca pagar {importe} € de IVA. En la cuenta hay justo para eso o para las nóminas, no para las dos cosas.',
  op:[{t:'Pagar el IVA y aplazar nóminas unos días.', ef:{moral:-20, cash:-1}, cpt:'iva-no-es-tuyo', fb:'Con Hacienda no se juega, pero retrasar una nómina rompe algo que no se arregla con una transferencia.'},
      {t:'Pedir aplazamiento a Hacienda.', ef:{aplaza:true}, cpt:'iva-no-es-tuyo', fb:'Se puede y es lo sensato. Tiene intereses y te marca, pero es infinitamente mejor que no pagar.'},
      {t:'Tirar de la línea de crédito.', ef:{tiraLinea:true}, cpt:'banco-paraguas', fb:'Para esto está. Si la línea la pediste cuando ibas bien, hoy te salva el mes.'}]},
 {id:'d_socio', min:70, tit:'Te ofrecen un socio',
  txt:'Un inversor pone {importe} € por el 25%. Con eso contratas tres comerciales de golpe.',
  op:[{t:'Aceptar. El dinero acelera.', ef:{socio:0.25}, cpt:'ltv-cac', fb:'Meter dinero en un motor de ventas que no funciona solo hace que pierdas dinero más rápido. Antes de escalar, mide.'},
      {t:'Rechazar y crecer con lo que entra.', ef:{repu:3}, cpt:'runway', fb:'Más lento y todo tuyo. Es una decisión de vida, no solo de negocio.'},
      {t:'Negociar: menos dinero, menos porcentaje.', ef:{socio:0.12}, cpt:'multiplo', fb:'Casi siempre se puede. El primer número que te dan nunca es el último.'}]},
 {id:'d_delegar_ventas', min:55, tit:'Soltar las ventas',
  txt:'Cierras tú el 80% de lo que entra. No puedes hacer nada más.',
  op:[{t:'Seguir cerrando yo, nadie lo hace igual.', ef:{energiaMax:-1, cuelloBotella:true}, cpt:'delegacion', fb:'Es verdad que nadie lo hace igual. Y por eso la empresa no puede crecer más que tú.'},
      {t:'Grabarme, montar un guion y entrenarlos.', ef:{procesoVentas:true, energia:-2}, cpt:'delegacion', fb:'Tres semanas de dolor y el techo desaparece. Es la decisión que separa un autoempleo de una empresa.'},
      {t:'Fichar un director comercial caro.', ef:{fichaDir:true}, cpt:'coste-rotacion', fb:'Puede funcionar. Pero si tú no tienes el proceso escrito, él tampoco lo va a encontrar.'}]},
 {id:'d_calidad', min:35, tit:'Entregar tarde o entregar mal',
  txt:'Dos entregas chocan la misma semana. No dan los números.',
  op:[{t:'Avisar y renegociar el plazo con uno.', ef:{repu:-2, satisfaccion:-5}, cpt:'riesgo-percibido', fb:'Avisar antes duele mucho menos que fallar después. Casi siempre lo entienden.'},
      {t:'Entregar las dos como sea.', ef:{satisfaccion:-20, moral:-10}, cpt:'churn', fb:'Dos clientes medio contentos y un equipo quemado. El coste de la mala calidad se paga en la renovación.'},
      {t:'Meter un freelance de urgencia.', ef:{cash:-2200, satisfaccion:2}, cpt:'margen-contribucion', fb:'Te comes el margen de esa entrega y salvas la relación. Suele salir a cuenta.'}]},
 {id:'d_marca', min:50, tit:'Invertir en marca',
  txt:'Puedes meter {importe} € en contenido y marca. No dará nada durante tres meses.',
  op:[{t:'Meterlo. Los leads de marca cierran mejor.', ef:{marca:true, cash:-1}, cpt:'canal-vs-mensaje', fb:'Lo caro es que tarda. Si tienes menos de tres meses de aire, no es el momento por muy bueno que sea.'},
      {t:'Meterlo en anuncios, que dan hoy.', ef:{adsBoost:true}, cpt:'cac', fb:'Ingresos hoy, coste por lead subiendo cada trimestre. Es alquilar clientes, no tenerlos.'},
      {t:'Ni una cosa ni otra: llamar más.', ef:{energiaMax:1}, cpt:'ley-numeros', fb:'Nunca es la respuesta equivocada cuando la caja está justa.'}]},
 {id:'d_nicho', min:40, tit:'Cerrar el foco',
  txt:'El 70% de tu margen viene de un solo sector. El resto te da guerra.',
  op:[{t:'Especializarme solo en ese sector.', ef:{nicho:true, repu:10, leadsMul:0.8, cierreUp:15}, cpt:'propuesta-unica', fb:'Menos leads y muchísimo mejores. La especialización sube el precio y baja el ciclo de venta.'},
      {t:'Seguir con todos, no vaya a ser.', ef:{}, cpt:'propuesta-unica', fb:'El que vale para todos no vale para nadie. Y compites siempre por precio.'},
      {t:'Dos líneas separadas con marcas distintas.', ef:{energiaMax:-1}, cpt:'coste-oportunidad', fb:'El doble de trabajo con la misma cabeza. Solo funciona con equipo de verdad.'}]},
 {id:'d_impago_grande', min:60, tit:'No te pagan',
  txt:'{cliente} te debe {importe} € y te pide seguir trabajando mientras "arregla la tesorería".',
  op:[{t:'Parar el trabajo hasta cobrar.', ef:{riesgoBaja:0.4, repu:-2}, cpt:'periodo-cobro', fb:'Lo correcto. Seguir trabajando para quien no paga es aumentar la pérdida, no salvarla.'},
      {t:'Seguir. Es un buen cliente y se arreglará.', ef:{deudaCliente:true}, cpt:'coste-hundido', fb:'"Llevo mucho invertido" es la trampa del coste hundido. El dinero de ayer no debe decidir lo de mañana.'},
      {t:'Plan de pagos firmado y seguimos a medias.', ef:{planPago:true}, cpt:'periodo-cobro', fb:'El punto medio razonable. Con papel firmado y con el trabajo proporcional a lo cobrado.'}]},
 {id:'d_oficina', min:65, tit:'Local nuevo',
  txt:'Sois ocho en un sitio para cinco. Un local decente son {importe} €/mes más.',
  op:[{t:'Alquilar el local.', ef:{fijos:1, moral:10}, cpt:'punto-muerto', fb:'La moral sube y tu punto muerto también. Cada fijo nuevo es facturación obligatoria todos los meses.'},
      {t:'Aguantar apretados un año más.', ef:{moral:-6}, cpt:'punto-muerto', fb:'Barato y tiene un límite. La gente aguanta el sitio si ve que va a algún lado.'},
      {t:'Media plantilla en remoto.', ef:{moral:4, capacidad:-0.05}, cpt:'delegacion', fb:'Casi gratis. Funciona si mides resultados; si no, se disuelve.'}]},
 {id:'d_producto_nuevo', min:80, tit:'Línea nueva',
  txt:'Un cliente te pide algo que no haces. Si lo montas, se abre un mercado.',
  op:[{t:'Montarlo a medida para él y cobrarlo.', ef:{cash:1, capacidad:-0.2}, cpt:'coste-oportunidad', fb:'Cobras el desarrollo, que es lo mínimo. Ojo: los proyectos a medida se comen el equipo.'},
      {t:'Montarlo como producto para vender a más.', ef:{nuevaLinea:true, energia:-3}, cpt:'propuesta-unica', fb:'La jugada grande. También la que más empresas ha hundido por hacerla antes de tiempo.'},
      {t:'Decir que no y recomendarle a alguien.', ef:{repu:6, referidos:1}, cpt:'referido', fb:'Decir que no bien construye más relación que decir que sí mal.'}]}
];

/* ============ PRODUCTOS DEL BANCO ============ */
IMP.BANCO = [
 {id:'prestamo', n:'Préstamo a plazo', desc:'Dinero ahora, cuota fija todos los meses.', maxMul:0.35, tinBase:0.072, plazoMin:12, plazoMax:60, cpt:'banco-paraguas'},
 {id:'linea', n:'Línea de crédito', desc:'Un colchón que solo pagas si lo usas. Se pide con la cuenta sana.', maxMul:0.18, tinBase:0.095, cpt:'banco-paraguas'},
 {id:'factoring', n:'Factoring', desc:'Cobras hoy las facturas pendientes. Te quedas un 3-5% por el camino.', comision:0.042, cpt:'periodo-cobro'},
 {id:'leasing', n:'Renting/leasing', desc:'Equipo sin tocar la caja. Cuota fija y va a fijos.', maxMul:0.12, tinBase:0.061, cpt:'punto-muerto'}
];

/* ============ RANGOS ============ */
IMP.RANGOS = [
 {r:'E', min:1,  n:'Autoempleado',        desc:'Si paras tú, para todo.'},
 {r:'D', min:6,  n:'Con ayuda',           desc:'Ya hay alguien más. Sigues siendo el cuello de botella.'},
 {r:'C', min:12, n:'Pequeña empresa',     desc:'Hay equipo y hay proceso. Empieza a funcionar sin ti unos días.'},
 {r:'B', min:20, n:'Empresa',             desc:'Vende gente que no eres tú. Ese es el salto de verdad.'},
 {r:'A', min:30, n:'Grupo',               desc:'Varias líneas, gente que dirige gente.'},
 {r:'S', min:42, n:'Holding',             desc:'Compras empresas y las integras. Ya no vendes: decides.'}
];
