# SPEC: Embudo de Perfilado y Captura B2B

> **Estado:** Aprobada
> **Objetivo:** Filtrar leads no calificados y entregar al equipo comercial de Metal Mad mensajes de WhatsApp estructurados con contexto total del cliente (Empresa, Rubro, Volumen).

## 1. Contexto
Si dejamos un botón de WhatsApp suelto, llegarán mensajes como "precio" de consumidores finales. Necesitamos un paso intermedio (fricción positiva) donde el comprador institucional declare su intención antes de hablar con el asesor.

## 2. Objetivo
Construir un formulario de 3-4 campos clave que intercepte el clic hacia WhatsApp, construyendo un mensaje pre-formateado altamente profesional.

## 3. Casos de uso
- **Un comprador B2B quiere** cotizar 500 asientos **para** que Metal Mad le dé precio mayorista rápido.
- **El equipo comercial quiere** recibir mensajes que digan "Soy X de la Metalúrgica Y, necesito Z volumen" **para** priorizar leads reales.

## 4. Reglas de negocio
- Campos obligatorios: Nombre/Cargo, Empresa, Rubro (Select: Metalúrgica, Mueblería, Licitación MEC, Otro), Volumen estimado.
- Si viene de una ficha técnica (parámetro en URL), el producto de interés se pre-selecciona automáticamente.
- Botón final: "Generar Cotización por WhatsApp".

## 5. Entradas y salidas
**Entradas:** Text inputs y Selects del usuario.
**Salidas:** Redirección a `wa.me/...` con payload codificado en texto.

## 6. Fuera de alcance
- Guardar leads en Base de Datos (Firebase/Supabase). Todo vive y muere en la sesión del cliente hacia WhatsApp (Fase 1).
- Envío de emails de confirmación.

## 7. Mapeo al Principio Rector
- **Configuración:** Número de WhatsApp de destino.
- **Dominio:** Validación de campos obligatorios.
- **Servicios:** Generación del string para el link de WhatsApp.
- **Presentación:** Formulario limpio, inputs grandes (fácil de tapear en celular).

## 8. Criterios de aceptación
- [ ] El formulario valida que Empresa y Volumen no estén vacíos.
- [ ] Si faltan datos, muestra alertas en rojo ("Requerido para venta mayorista").
- [ ] Lee correctamente los parámetros de la URL si el usuario vino de un producto específico.
- [ ] El mensaje de WhatsApp sale formateado con negritas (ej. *Empresa:* Metalúrgica San José).

## 9. Decisiones técnicas
- **Estado con `useState`:** Al ser pocos campos, mantenemos la ligereza sin librerías de formularios externas (respetando la decisión de la spec del cotizador anterior).
- **UI Prime Tailwind:** Inputs con alto contraste (`bg-white`, `border-gray-300`, `focus:ring-blue-500`).

## 10. Tareas
- [ ] T1: Crear página `/solicitar-cotizacion`.
- [ ] T2: Programar componente de formulario con validaciones manuales.
- [ ] T3: Extender `lib/services/whatsapp.ts` para manejar este nuevo formato de mensaje de perfilado.
- [ ] T4: Testear lectura de `searchParams` en Next.js para autocompletar el producto.

## 11. Notas / Open questions
- Definir si el Select de "Volumen estimado" debe ser un rango (ej: 100-500, 500-1000) o un campo de texto libre para que el cliente escriba la cantidad exacta.
