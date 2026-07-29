# SPEC-DELTA: fuente única de precios

> **Modifica:** SPEC-cotizador-oriplast.md v1.0 (Aprobada, 2026-04-14)
> **Motivo:** al cargar la tabla real del proveedor aparecieron cuatro supuestos del SPEC que no resisten los datos.
> **Estado:** propuesta — requiere tu aprobación antes de codear la UI.

---

## 0. Punto de partida

`lib/config/oriplast.ts` y `lib/domain/cotizador.ts` **no existen en el repo**. Las tareas T1, T2 y T3 del SPEC siguen sin tildar. El cotizador nunca se construyó: lo que está en producción es el flujo de solicitud de muestras y perfilado B2B, que no toca precios.

Eso es una buena noticia. No hay nada que migrar ni que romper. Se inserta la capa de datos ahora, antes de que exista código que dependa de la forma equivocada.

---

## 1. La moneda base no puede ser PYG

**SPEC §4:** «Los precios base se definen en PYG. USD y BRL se calculan con tipo de cambio configurable.»

**Realidad:** Oriplast publica en reales y reemite la tabla todos los meses. La que tenemos dice "TABELA DE PREÇOS 2026 – JULHO, 06/07/2026".

Si la base es PYG, cada movimiento del cambio obliga a reconvertir 92 precios a mano. Eso garantiza que en tres meses la lista esté desactualizada y nadie sepa cuál renglón se actualizó y cuál no.

**Decisión:** la moneda base es la del proveedor (BRL). La conversión ocurre en el dominio, en el momento de cotizar. `MONEDA_PROVEEDOR = "BRL"`, `MONEDA_VENTA = "PYG"`.

---

## 2. Dos inputs no alcanzan

**SPEC §5:** entradas = cantidad de mesas + cantidad de sillas.

**Realidad:** la tabla tiene **92 códigos en 6 líneas**, y Oriplast no vende mesas ni sillas: vende *componentes inyectados*. Un pupitre es asiento/respaldo + tampo + zapatas + punteras + pino y buje, cada uno con su código y su color.

Un input de "sillas" no puede expresar eso. Y el margen se pierde justamente ahí: en los accesorios que nadie cuenta.

**Decisión:** el ítem cotizable es el código del proveedor. Encima se construye el concepto de *conjunto* (una lista de códigos con cantidades) que se multiplica por N. El parámetro `conjuntos` de `calcularCotizacion` hace exactamente eso — cargás el despiece una vez y lo multiplicás por 330 o por 5.189.

**Pendiente tuyo:** el despiece real de cada conjunto. No lo inventé.

---

## 3. El tipo de cambio hay que congelarlo, no configurarlo

**SPEC §9:** «Tipos de cambio hardcoded en config.»

Está bien como valor de arranque. El problema es otro: si la cotización no guarda el TC y el precio con los que se calculó, una cotización emitida en julio deja de ser reproducible en agosto. Ante una licitación eso no es un detalle contable, es la diferencia entre poder defender tu oferta y no poder.

**Decisión:** `resolverPrecio()` devuelve el `lista_id` junto al precio, y `congelarLinea()` copia el `precio_unit` dentro de la línea de cotización. A partir de ahí la cotización deja de depender de la lista vigente.

**Costo de implementarlo:** cero. Ya está en el código adjunto.

---

## 4. El portugués no se borra, se separa

**COMO-TRABAJAMOS-ORIPLAST §1:** «Idioma Castellano 100%. Cero rastros de portugués.»

Correcto para el cliente. Pero el dato de origen está en portugués, y esa forma exacta es la que necesitás para emitir la orden de compra a Palotina. Si traducís y descartás el original, cada compra requiere retraducir a mano y ahí aparecen los errores de código.

**Decisión:** cada ítem lleva `descripcion_pt` y `descripcion_es`. La web **solo** renderiza `_es`. El `_pt` existe para la orden de compra y para cotejar contra la tabla del proveedor. Lo mismo con los colores.

---

## 5. Regla de inmutabilidad

Ninguna lista con `vigencia_hasta: null` que ya se haya usado para cotizar se edita. Cuando llega la tabla de agosto:

1. Se crea `data/proveedores/oriplast/2026-08.json`
2. Se le pone `vigencia_hasta: "2026-07-31"` a la de julio
3. Se registra la nueva en `lib/config/proveedores.ts`
4. `npm run precios:validar`

`validarVigencias()` falla el build si quedan dos listas abiertas a la vez.

---

## 6. Regla de repositorio

Igual que la regla que ya tenés para los números de WhatsApp:

> **Ningún literal numérico de precio fuera de `data/`.** Si aparece un `53.40` en un `.tsx`, es un bug, no una constante.

Sugerencia: agregar una regla de ESLint o un grep en el prebuild. Sin eso, en tres semanas hay un precio hardcodeado en un componente y volviste al problema que estás resolviendo hoy.

---

## 7. Lo que cambia en las tareas del SPEC

| Tarea original | Estado |
|---|---|
| T1 `lib/config/oriplast.ts` con precios | **Reemplazada** por `lib/config/proveedores.ts` (sin precios) + `data/proveedores/oriplast/2026-07.json` |
| T2 `lib/domain/cotizador.ts` | **Entregada** — incluye además nacionalización y margen, que el SPEC no contemplaba |
| T3 Tests unitarios del dominio | **Pendiente.** Node 22 trae `node:test` incorporado: se puede cubrir sin agregar una sola dependencia |

Criterio de aceptación §8 que hay que reescribir:

> ~~«Los precios se cambian editando solo `lib/config/oriplast.ts`»~~
> → «Los precios se cambian agregando un archivo nuevo en `data/proveedores/`. Ningún archivo `.ts` contiene precios.»

---

## 8. Dos cosas para verificar por fuera del código

1. **Rama de producción en Vercel.** El repo tiene default `master`. Confirmá que Vercel esté apuntando a `master` y no a `main` — ya te pasó una vez que los preview deploys se servían como producción.
2. **Vigencia comercial de la tabla.** El JSON dice `vigencia_hasta: null` porque Oriplast no declara fecha de corte. Preguntales si la tabla de julio tiene validez hasta fin de mes o hasta nuevo aviso. Cambia cómo cotizás una entrega a 60 días.

---

## 9. Lo que NO se incluye a propósito

`lib/config/equivalencias-catalogo.ts` está con todos los códigos en `null`.

Ese archivo une el catálogo público por nivel educativo ("asiento-1er-ciclo") con los conjuntos FNDE brasileños ("CJA 03", "CJA 04"). Esa correspondencia es una decisión de norma y comercial: no se deduce de la tabla de precios ni se adivina desde afuera.

Completarlo a ojo produciría un cotizador que devuelve números equivocados con toda la apariencia de estar bien. Lo dejé explícito y con una función `equivalenciasPendientes()` para que puedas bloquear el deploy del cotizador hasta confirmarlo.
