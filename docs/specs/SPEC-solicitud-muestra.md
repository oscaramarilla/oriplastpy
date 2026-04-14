# SPEC: Solicitud de muestra física de producto

> **Estado:** Aprobada
> **Cliente / Proyecto:** Oriplast Paraguay (oriplastpy.com)
> **Autor:** Oscar Amarilla — AYCweb
> **Fecha:** 2026-04-14
> **Versión:** 1.0

---

## 1. Contexto

Oriplast fabrica mobiliario plástico escolar para el mercado sudamericano. Hoy los compradores B2B que quieren ver y tocar el producto antes de hacer una compra grande envían solicitudes por WhatsApp manual, sin estructura. Esto genera conversaciones caóticas y pérdida de la información. Necesitan un formulario simple que capture datos básicos del interesado y envíe la solicitud a Oriplast por WhatsApp, pre-formateada y lista para que el equipo comercial atienda.

## 2. Objetivo

Permitir que un comprador B2B complete un formulario simple solicitando muestras de productos, y envíe la solicitud a Oriplast por WhatsApp con un solo click, sin perder los datos en el proceso.

## 3. Casos de uso

- **Un gerente de compras** completa el formulario solicitando muestras de sillas escolares y envía a Oriplast por WhatsApp, para que el equipo comercial lo contacte con presupuesto.
- **Un distribuidor mayorista** indica en el formulario que quiere muestras de 3 productos y envía por WhatsApp, para reservar antes de una reunión de presentación.
- **Un director de institución educativa** rellena el formulario con los datos del colegio y sus productos de interés, y lo envía a Oriplast directamente desde la web.

## 4. Reglas de negocio

- El formulario captura datos mínimos: nombre, empresa, email, teléfono, departamento, producto(s) de interés con cantidad estimada por cada uno.
- El empresa es obligatorio (señal de que es B2B).
- El usuario puede seleccionar UNO O VARIOS productos del catálogo. Cada producto seleccionado tiene su propio campo de cantidad.
- El catálogo se organiza en 4 categorías: TAMPOS, ASIENTOS POR NIVEL, RESPALDOS POR NIVEL, ACCESORIOS.
- La geografía es solo Paraguay; el campo de ubicación es "departamento" (Central, Alto Paraná, Itapúa, Caaguazú, etc.), texto libre obligatorio.
- El mensaje de WhatsApp debe incluir todos los datos del solicitante, los productos solicitados con sus cantidades, y el departamento.
- No hay seguimiento automático — la solicitud no se guarda en base de datos, solo se envía a WhatsApp.

## 5. Entradas y salidas

**Entradas:**
- Nombre completo del solicitante
- Empresa / Organización
- Email
- Teléfono
- Departamento de Paraguay (texto libre obligatorio)
- Productos de interés: array de items seleccionados, cada uno con cantidad estimada (mínimo 1 producto)

**Salidas:**
- Resumen en pantalla con los datos ingresados
- Link de WhatsApp pre-formateado con el mensaje listo para enviar al equipo comercial

## 6. Fuera de alcance

- No guarda datos en base de datos.
- No envía confirmación por email.
- No genera ID de solicitud.
- No integra con CRM ni sistema externo.
- No detecta si el cliente es existente o nuevo.
- No crea dashboard de seguimiento.
- No registra auditoría ni IP del cliente.
- No incluye la migración del cotizador existente (app/mm/page.tsx) al nuevo `lib/services/whatsapp.ts`. Esa migración será una spec de refactor separada, posterior a la implementación de esta feature.

## 7. Mapeo al Principio Rector

| Capa | Responsabilidad en esta feature |
|---|---|
| **Configuración define** | `lib/config/solicitud-muestra.ts` — catálogo de productos (4 categorías: TAMPOS, ASIENTOS POR NIVEL, RESPALDOS POR NIVEL, ACCESORIOS con items específicos), número de WhatsApp comercial de Oriplast (`595982451828`), lista de departamentos válidos |
| **Dominio decide** | `lib/domain/solicitud-muestra.ts` — validación de campos, construcción del objeto de solicitud |
| **Servicios ejecutan** | `lib/services/whatsapp.ts` — formateo del mensaje y construcción del link `wa.me/...` |
| **Presentación muestra** | `app/solicitar-muestra/page.tsx` — formulario, resumen, botón de WhatsApp |

**⚠️ Nota importante:** Esta feature inaugura la estructura `lib/` en el proyecto. Las tareas de Fase 1 deben incluir como primer paso la creación inicial de las carpetas `lib/config`, `lib/domain` y `lib/services` en la raíz del proyecto.

## 8. Criterios de aceptación

- [ ] El formulario captura: nombre, empresa, email, teléfono, departamento, productos con cantidad individual por cada uno.
- [ ] El campo de empresa es obligatorio (no se puede enviar sin llenarlo).
- [ ] El campo de departamento es obligatorio y texto libre.
- [ ] El email valida formato básico (contiene @ y .).
- [ ] El usuario debe seleccionar al menos 1 producto con cantidad > 0 para poder enviar.
- [ ] El formulario permite seleccionar UNO O VARIOS productos del catálogo usando checkboxes. Cada producto tiene su propio campo de cantidad.
- [ ] Al hacer click en "Enviar a WhatsApp", se muestra un resumen en pantalla con los datos ingresados.
- [ ] El botón abre `wa.me/595982451828?text=<mensaje>` con el mensaje pre-llenado que incluye: nombre, empresa, departamento, email, teléfono, lista de productos seleccionados con cantidades.
- [ ] El mensaje es legible y está formateado para leer en conversación de WhatsApp (saltos de línea, estructura clara).
- [ ] Si faltan campos obligatorios o no hay productos seleccionados, el botón está deshabilitado y se muestra mensaje de error.
- [ ] El catálogo de productos (4 categorías y sus items) se configura editando solo `lib/config/solicitud-muestra.ts`.
- [ ] La feature respeta el Principio Rector (revisión manual).
- [ ] README mínimo en `app/solicitar-muestra/` explicando el catálogo y cómo modificarlo.

## 9. Decisiones técnicas (se llena en fase Plan)

- Decisión: Mantener Next.js App Router + TypeScript + Tailwind en esta feature — Razón: ese es el stack ya establecido del proyecto y garantiza consistencia visual y de patrones con `app/mm/page.tsx`.
- Decisión: Inaugurar la estructura `lib/` en el proyecto con `lib/config`, `lib/domain` y `lib/services` — Razón: separa configuración, lógica de negocio y efectos en capas claras según el Principio Rector.
- Decisión: Crear `lib/config/solicitud-muestra.ts` para definir el catálogo de productos y el número de WhatsApp — Razón: los valores de configuración deben ser editables sin tocar la lógica o la UI.
- Decisión: Implementar `lib/domain/solicitud-muestra.ts` como módulo de validación pura y modelo de solicitud — Razón: mantiene la lógica de negocio fuera del componente de presentación.
- Decisión: Implementar `lib/services/whatsapp.ts` para construir el texto y el link de WhatsApp — Razón: aísla el servicio de mensajería y facilita una futura migración del cotizador existente.
- Decisión: Usar `useState` en `app/solicitar-muestra/page.tsx` para manejar el formulario y la selección múltiple — Razón: con 6-8 entradas, el estado local es más ligero que librerías de formularios externas.
- Decisión: No añadir librerías nuevas para validación o envío de mensajes — Razón: reduce el peso del bundle y evita mantenimiento adicional en un proyecto estático en Vercel.
- Decisión: Usar `node:assert` en TypeScript para los tests unitarios del dominio en lugar de instalar Vitest o Jest — Razón: el proyecto no tiene test runner configurado y agregar uno suma dependencias y configuración fuera del alcance de esta feature. Los tests quedan listos para migrar a Vitest cuando se decida adoptarlo a nivel proyecto.

## 10. Tareas (se llena en fase Tasks)

- [ ] T1: Crear las carpetas `lib/config`, `lib/domain` y `lib/services` en la raíz del proyecto para inaugurar la nueva estructura de capas.
- [ ] T2: Crear `lib/config/solicitud-muestra.ts` con el catálogo de productos en 4 categorías y el número de WhatsApp comercial.
- [ ] T3: Crear `lib/domain/solicitud-muestra.ts` con tipos y funciones de validación de formulario para nombre, empresa, email, teléfono, departamento y productos seleccionados.
- [ ] T4: Crear `lib/services/whatsapp.ts` con funciones para formatear el mensaje y generar el link `wa.me/595982451828`.
- [ ] T5: Crear `app/solicitar-muestra/page.tsx` con el formulario de selección múltiple, el resumen y el botón de WhatsApp.
- [ ] T6: Crear `lib/domain/solicitud-muestra.test.ts` con tests unitarios que cubran la validación de campos y la lógica de productos seleccionados.
- [ ] T7: Crear `app/solicitar-muestra/README.md` con instrucciones de uso y de edición del catálogo de productos.

## 11. Notas / Open questions

✅ **TODAS RESUELTAS:**

- **✅ Catálogo de productos:** 4 categorías — TAMPOS: "Tampo con travesaño" | ASIENTOS POR NIVEL: "Asiento Nivel Inicial", "Asiento 1er ciclo", "Asiento 2do ciclo", "Asiento 3er ciclo" | RESPALDOS POR NIVEL: "Respaldo Nivel Inicial", "Respaldo 1er-3er ciclo" | ACCESORIOS: "Porta libros", "Puntera superior", "Puntera con pino", "Zapata frontal", "Zapata posterior". El usuario selecciona UNO O VARIOS con cantidad por item.
- **✅ Número de WhatsApp del equipo comercial:** `595982451828`
- **✅ Geografía:** Solo Paraguay. Campo "departamento" (texto libre obligatorio, no select fijo). Sin validación contra lista predefinida de departamentos.
- **✅ Validaciones:** Validaciones blandas solamente — empresa obligatoria, email con formato válido, teléfono con dígitos mínimos, al menos 1 producto seleccionado. Sin blacklist.
