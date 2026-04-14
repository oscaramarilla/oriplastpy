# SPEC: [Nombre de la feature o sistema]

> **Estado:** Draft | En revisión | Aprobada | Implementada
> **Cliente / Proyecto:** [nombre]
> **Autor:** Oscar Amarilla — AYCweb
> **Fecha:** YYYY-MM-DD
> **Versión:** 0.1

---

## 1. Contexto

Una o dos frases. ¿Por qué existe esto? ¿Qué problema de negocio resuelve?
Sin tecnicismos. Si el cliente lo lee, tiene que entenderlo.

## 2. Objetivo

Una sola frase. Qué hace este sistema cuando está terminado.
Si necesitás más de una frase, el alcance es muy grande — partilo en specs separadas.

## 3. Casos de uso

Lista de escenarios reales, en lenguaje de negocio. Formato:

- **[Actor] quiere [acción] para [resultado].**

Ejemplo:
- Un vendedor quiere generar un presupuesto en PDF para enviarlo por WhatsApp al cliente.
- Un cliente quiere ver el precio actualizado al cambiar la cantidad sin recargar la página.

## 4. Reglas de negocio

Las reglas inviolables. Lo que define el **dominio**.
No describir cómo se implementan, solo qué tienen que cumplir.

- Regla 1: …
- Regla 2: …
- Regla 3: …

## 5. Entradas y salidas

**Entradas:** qué datos entran al sistema (del usuario, de config, de APIs externas).
**Salidas:** qué produce el sistema (UI, archivos, mensajes, llamadas a otros servicios).

## 6. Fuera de alcance

Qué NO hace este sistema. Tan importante como qué sí hace.
Esto evita scope creep y mantiene a Cline (y a vos) enfocados.

- No hace …
- No incluye …

## 7. Mapeo al Principio Rector

| Capa | Responsabilidad en esta feature |
|---|---|
| **Configuración define** | Qué se parametriza (precios, monedas, textos, flags) |
| **Dominio decide** | Qué reglas/cálculos viven acá |
| **Servicios ejecutan** | Qué efectos colaterales hay (PDF, WhatsApp, email, DB) |
| **Presentación muestra** | Qué ve el usuario y cómo interactúa |

## 8. Criterios de aceptación (Definition of Done)

Lista verificable. Cada item tiene que ser comprobable con un sí/no, no opinable.

- [ ] Criterio 1 (ej: "Al cambiar la cantidad, el total se recalcula sin recargar")
- [ ] Criterio 2 (ej: "El PDF generado contiene logo, fecha, ítems y total en PYG")
- [ ] Criterio 3 (ej: "El botón de WhatsApp abre `wa.me/...` con el mensaje pre-llenado")
- [ ] La feature respeta el Principio Rector (revisión manual)
- [ ] Documentación mínima en el README del módulo

## 9. Decisiones técnicas (se llena en fase Plan)

Stack, librerías, patrones elegidos y **por qué**. Una línea por decisión.

- Decisión: … — Razón: …

## 10. Tareas (se llena en fase Tasks)

Descomposición atómica. Cada tarea es ejecutable por Cline en una sola pasada.

- [ ] T1: …
- [ ] T2: …
- [ ] T3: …

## 11. Notas / Open questions

Cosas a resolver antes de implementar. Si quedan abiertas, no se codea.
