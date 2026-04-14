# SPEC: Cotizador B2B de mobiliario escolar — Oriplast

> **Estado:** Aprobada
> **Cliente / Proyecto:** Oriplast Paraguay (oriplastpy.com)
> **Autor:** Oscar Amarilla — AYCweb
> **Fecha:** 2026-04-14
> **Versión:** 1.0

---

## 1. Contexto

Oriplast vende mobiliario plástico escolar (mesas y sillas) a instituciones educativas y mayoristas en Paraguay y la región. Hoy las cotizaciones se hacen manualmente por WhatsApp, lo que genera demoras, errores de cálculo y pérdida de leads cuando el vendedor no está disponible. Necesitan que el cliente pueda autocotizar 24/7 desde la web.

## 2. Objetivo

Permitir que un comprador B2B configure cantidades de mesas y sillas, vea el precio total en su moneda preferida con descuentos por volumen aplicados automáticamente, y envíe el presupuesto a Oriplast por WhatsApp en un solo click.

## 3. Casos de uso

- **Un director de escuela quiere** cotizar 30 mesas y 60 sillas **para** presentar el presupuesto al consejo administrativo.
- **Un mayorista brasileño quiere** ver el precio en BRL con o sin IVA **para** comparar con proveedores locales.
- **Un comprador apurado quiere** enviar la cotización a Oriplast por WhatsApp **para** acelerar el cierre sin tener que escribir el detalle a mano.
- **El equipo de ventas de Oriplast quiere** recibir la cotización pre-formateada por WhatsApp **para** responder al lead con el contexto ya armado.

## 4. Reglas de negocio

- Los precios base se definen en PYG. USD y BRL se calculan con tipo de cambio configurable.
- Existen tramos de descuento por volumen escalonados (ej: 0–10 unidades sin descuento, 11–50 con X%, 51+ con Y%). Cada producto puede tener su propia escala.
- El IVA paraguayo (10%) se muestra como toggle: el cliente decide si lo ve incluido o discriminado.
- Si el cliente elige BRL o USD, el IVA paraguayo no aplica (export).
- El total nunca puede ser cero ni negativo: si no hay cantidades, el botón de WhatsApp queda deshabilitado.
- El mensaje de WhatsApp debe incluir: ítems, cantidades, precio unitario, subtotal, descuento aplicado, total, moneda, y fecha.

## 5. Entradas y salidas

**Entradas:**
- Cantidad de mesas (input numérico)
- Cantidad de sillas (input numérico)
- Moneda seleccionada (PYG | USD | BRL)
- Toggle de IVA (on | off, solo si moneda = PYG)

**Salidas:**
- Subtotal por producto (UI)
- Descuento aplicado por tramo (UI)
- Total general en moneda seleccionada (UI)
- Link de WhatsApp con mensaje pre-formateado (acción)

## 6. Fuera de alcance

- No procesa pagos.
- No genera PDF (eso es una spec aparte si Oriplast lo pide).
- No guarda las cotizaciones en base de datos (no hay backend en esta fase).
- No hace login ni cuenta de usuario.
- No envía email — solo WhatsApp.

## 7. Mapeo al Principio Rector

| Capa | Responsabilidad en esta feature |
|---|---|
| **Configuración define** | `lib/config/oriplast.ts` — precios base PYG, tipos de cambio USD/BRL, escalas de descuento por producto, número de WhatsApp de Oriplast, IVA % |
| **Dominio decide** | `lib/domain/cotizador.ts` — cálculo de subtotal, aplicación de tramo de descuento, conversión de moneda, cálculo de IVA, validación de inputs |
| **Servicios ejecutan** | `lib/services/whatsapp.ts` — formateo del mensaje y construcción del link `wa.me/...` |
| **Presentación muestra** | `app/cotizador/page.tsx` — inputs, totales, toggle de moneda, botón de WhatsApp |

## 8. Criterios de aceptación

- [ ] Al cambiar la cantidad de mesas o sillas, los subtotales y total se recalculan sin recargar la página.
- [ ] Al cambiar la moneda, todos los precios se actualizan al tipo de cambio configurado.
- [ ] El descuento por volumen se aplica automáticamente al cruzar cada umbral del tramo.
- [ ] El toggle de IVA solo está visible cuando la moneda es PYG.
- [ ] El botón de WhatsApp está deshabilitado si el total es cero.
- [ ] El mensaje de WhatsApp se abre en `wa.me/<numero-config>` con texto pre-llenado y formateado legible.
- [ ] Los precios, descuentos y tipos de cambio se cambian editando solo `lib/config/oriplast.ts`, sin tocar dominio ni UI.
- [ ] La feature respeta el Principio Rector (revisión manual).
- [ ] README mínimo en `app/cotizador/` explicando cómo actualizar precios.

## 9. Decisiones técnicas

- **Next.js App Router + Client Component** — El cotizador es interactivo en tiempo real, no necesita SSR. Razón: simplicidad y reactividad inmediata.
- **Estado local con `useState`** — No hay backend ni persistencia, no se justifica Zustand ni Context. Razón: YAGNI.
- **Sin librería de formularios** — Son 4 inputs, react-hook-form es overkill. Razón: peso de bundle.
- **Tipos de cambio hardcoded en config** — No hay API de cambio en esta fase. Razón: Oriplast los ajusta semanalmente, no necesita tiempo real.
- **Tailwind CSS** — Stack estándar de AYCweb.

## 10. Tareas

- [ ] T1: Crear `lib/config/oriplast.ts` con precios, tipos de cambio, escalas de descuento y número de WhatsApp.
- [ ] T2: Crear `lib/domain/cotizador.ts` con funciones puras: `calcularSubtotal`, `aplicarDescuento`, `convertirMoneda`, `calcularIVA`, `calcularTotal`.
- [ ] T3: Escribir tests unitarios del dominio (cubrir tramos de descuento, conversiones, edge cases).
- [ ] T4: Crear `lib/services/whatsapp.ts` con `construirMensajeCotizacion` y `generarLinkWhatsapp`.
- [ ] T5: Crear `app/cotizador/page.tsx` con UI: inputs, selector de moneda, toggle IVA, totales, botón WhatsApp.
- [ ] T6: Validar contra criterios de aceptación uno por uno.
- [ ] T7: README del módulo.

## 11. Notas / Open questions

- Confirmar con Oriplast los tramos exactos de descuento (esperando planilla por WhatsApp).
- Confirmar el número de WhatsApp comercial oficial (¿es el mismo que figura en la home?).
- Decidir si se loguea algún evento de "cotización generada" para analytics — fuera de scope por ahora pero anotar para v2.
