# IMPERIO

Simulador de empresario en el móvil. Empresa ficticia, un día por turno, y un mapa por el que te mueves.

Está construido alrededor de **vender**, que es la parte difícil: prospección con rechazo real, descubrimiento,
precio, 26 objeciones con casi 100 respuestas distintas, cierre y seguimiento. Las finanzas son la consecuencia,
no el reto: empiezas con Finanzas 8 y Ventas 2.

- **Motor de conversación por turnos** reutilizado en cuatro sitios: vender, negociar con el banco, comprar una
  empresa y discutir con un empleado. Medidores de interés, confianza y paciencia.
- **Las respuestas buenas están bloqueadas** hasta que descubres el dato que las sostiene. Descubrir antes de rebatir.
- **59 conceptos de negocio** que se desbloquean viviéndolos, no leyéndolos, y dominio por objeción (hay que
  ganarla varias veces).
- Equipo con rasgos ocultos, coste real contra producción, indemnizaciones y demandas.
- Compra de empresas con due diligence: lo que no auditas te explota después de firmar.
- Dificultad que crece durante años de juego.

## Ampliarlo

Todo el contenido vive en `data/`. Para añadir sin romper partidas guardadas:

```js
IMP.pack({ id:'pack-02', n:'Nombre', OBJECIONES:[...], ZONAS:[...], TARGETS:[...] });
```

El guardado migra solo (`migrar()` en `engine.js`) y avisa al jugador de que hay ampliación.

## Equilibrio

`node sim-smart.js 365` y `node sim.js 365` simulan un año con jugador bueno y jugador al azar.
Referencia actual: cierre 32-45% jugando bien, 0-3% al azar.
