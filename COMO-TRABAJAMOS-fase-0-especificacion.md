# Fase 0: Especificación

> **Principio:** Si no se puede escribir, no se puede construir.
> Toda feature nueva nace como spec antes que como código.

---

## Por qué existe esta fase

En AYCweb construimos sistemas operativos para clientes B2B, no demos descartables. Eso significa que cada línea de código tiene que poder defenderse contra una pregunta simple: *¿por qué existe?* La especificación es la respuesta a esa pregunta, escrita **antes** de que exista la línea.

Esta fase resuelve tres problemas concretos:

1. **Alinea expectativas con el cliente sin código de por medio.** El cliente valida lo que entiende, no lo que ve renderizado. Reduce el "no era esto lo que pedí".
2. **Hace que los agentes (Cline, Claude Code) rindan al máximo.** Un agente con spec clara es 3x más efectivo que un agente con instrucciones vagas. La spec es el prompt estructurado.
3. **Bloquea el scope creep desde el día uno.** Lo que está fuera de alcance está escrito. No se discute en medio de la implementación.

---

## Cuándo aplica

**Aplica siempre que:**
- Se arranca una feature nueva en un proyecto cliente.
- Se construye un módulo del Motor AYCweb.
- Se hace un refactor que cambia comportamiento (no solo estructura).

**No aplica para:**
- Bugfixes puntuales.
- Cambios de copy, estilos o assets.
- Refactors puramente estructurales que no cambian qué hace el sistema.

---

## El artefacto

Cada feature produce un archivo `docs/specs/SPEC-{nombre-corto}.md` en el repo del proyecto, basado en `docs/specs/_template.md`.

La spec tiene 11 secciones obligatorias:

1. **Contexto** — Por qué existe (lenguaje de negocio, sin tecnicismos).
2. **Objetivo** — Una sola frase. Si necesita más, partir la spec.
3. **Casos de uso** — Escenarios reales en formato `[Actor] quiere [acción] para [resultado]`.
4. **Reglas de negocio** — Las reglas inviolables del dominio.
5. **Entradas y salidas** — Qué entra, qué sale.
6. **Fuera de alcance** — Lo que NO hace. Tan importante como lo que sí hace.
7. **Mapeo al Principio Rector** — Qué vive en cada capa (Configuración / Dominio / Servicios / Presentación).
8. **Criterios de aceptación** — Lista verificable con sí/no, no opinable.
9. **Decisiones técnicas** — Stack y patrones, con la razón al lado.
10. **Tareas** — Descomposición atómica, cada tarea ejecutable en una pasada por el agente.
11. **Notas / Open questions** — Si quedan preguntas abiertas, no se codea.

La spec vive en el repo, versionada en Git. Cada cambio es un commit. Si la spec cambia después de implementada, el commit que la modifica explica por qué.

---

## El flujo

```
Idea
 ↓
[Fase 0] Especificación  ← acá vivís hasta que la spec está aprobada
 ↓
[Fase 1] Plan técnico (secciones 9 y 10 de la spec)
 ↓
[Fase 2] Implementación con agente (Cline / Claude Code)
 ↓
[Fase 3] Validación contra criterios de aceptación (sección 8)
 ↓
[Fase 4] Definition of Done (checklist global del proyecto)
```

**Ninguna fase puede saltarse.** Si Fase 0 no está completa, Fase 1 no arranca. Si la sección 11 tiene preguntas abiertas, la spec no está aprobada.

---

## Cómo se le pasa a un agente

El prompt para Cline o Claude Code siempre tiene esta estructura:

```
Leé docs/specs/SPEC-{nombre}.md completo.
Vas a ejecutar la tarea T{n} de la sección 10.
Respetá el Principio Rector definido en la sección 7:
  - Configuración define
  - Dominio decide
  - Servicios ejecutan
  - Presentación muestra
Cuando termines, validá contra los criterios de aceptación
de la sección 8 que apliquen a esta tarea.
```

Sin spec, no se le pasa nada al agente. Esa es la regla.

---

## Cómo se valida con el cliente

Para clientes B2B (Oriplast, clínicas, mayoristas) la spec se comparte en dos niveles:

- **Versión cliente** — Secciones 1, 2, 3, 4, 6 y 8. Lenguaje de negocio. Esto es lo que el cliente lee y aprueba por WhatsApp o email antes de que arranquemos.
- **Versión técnica completa** — Las 11 secciones. Vive en el repo. Es para nosotros y para el agente.

La aprobación del cliente sobre la versión cliente es lo que destraba Fase 1.

---

## Reglas inviolables de esta fase

1. **No se codea sin spec aprobada.** Cero excepciones.
2. **La spec es corta.** Si pasa de 3 páginas, está mal escrita o el alcance es muy grande.
3. **Open questions bloquean.** Si la sección 11 tiene algo, no avanza nada.
4. **El mapeo al Principio Rector es obligatorio.** Sin él, la spec no está completa.
5. **La spec se versiona en Git.** Nunca en Notion, Drive ni WhatsApp como fuente de verdad.
6. **Si la realidad cambia la spec, se commitea el cambio antes de cambiar el código.** La spec lidera, el código sigue.
