# Metodología de Trabajo: Oriplast Paraguay (Representación Metal Mad EAS)

> **Principio Rector:** Construimos herramientas de venta B2B, no folletos digitales. Cada vista debe convertir.

## 1. Pilares del Proyecto
- **Foco B2B Estricto:** Nuestros clientes son metalúrgicas, carpinterías y proveedores del MEC. No le hablamos al consumidor final. Le hablamos a directores de compras y dueños de fábricas.
- **Mobile-First "Prime":** El 95% de las interacciones iniciales (recepción del link) serán por WhatsApp móvil. La interfaz en celular debe verse impecable, rápida, con botones grandes y tipografía legible. El diseño de escritorio es secundario.
- **Idioma Castellano 100%:** Cero rastros de portugués. La representación es paraguaya (Metal Mad EAS). Todo el copy, metadatos y código de UI debe estar localizado para Paraguay.
- **Acción Directa (WhatsApp):** No hay formularios largos de contacto. Todo flujo termina en un mensaje estructurado de WhatsApp al equipo comercial.

## 2. Flujo de Desarrollo (Spec-Driven Development)
1. **Especificación (Fase 0):** Nada se programa sin una SPEC B2B aprobada que defina el caso de uso del cliente corporativo.
2. **UI/UX Móvil:** Se codea primero la versión móvil usando clases base de Tailwind. Solo después se añaden prefijos `md:` o `lg:` para pantallas grandes.
3. **Validación de Copy:** Revisión cruzada de que el lenguaje use terminología técnica correcta (polipropileno, inyección, tampos, matrices).

## 3. Stack Técnico Autorizado
- **Framework:** Next.js (App Router).
- **Estilos:** Tailwind CSS (uso extensivo de `flex`, `grid`, `gap`, `p-` y estilos de componentes limpios `bg-white`, `shadow-sm`, `rounded-xl`).
- **Estado:** React Hooks simples. Sin dependencias innecesarias para mantener la carga por debajo de 1 segundo en redes 4G.