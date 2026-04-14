# Solicitud de muestra física

Este módulo implementa la página de solicitud de muestras físicas para Oriplast.

## Qué hace

- Muestra un formulario donde el cliente ingresa nombre, empresa, email, teléfono y departamento.
- Permite seleccionar uno o varios productos del catálogo con cantidad por item.
- Genera un resumen en pantalla y abre WhatsApp con un mensaje pre-formateado al número comercial.

## Archivos principales

- `app/solicitar-muestra/page.tsx` — componente de presentación y formulario interactivo.
- `lib/config/solicitud-muestra.ts` — configuración del catálogo de productos y número de WhatsApp.
- `lib/domain/solicitud-muestra.ts` — validación de formulario y construcción del resumen de solicitud.
- `lib/services/whatsapp.ts` — construcción del mensaje y link de WhatsApp.
- `lib/domain/solicitud-muestra.test.ts` — tests unitarios para la lógica de validación y resumen.

## Cómo editar el catálogo

1. Abrir `lib/config/solicitud-muestra.ts`.
2. Modificar o agregar elementos en `PRODUCT_CATALOG`.
3. Cada producto debe tener un `id`, `category` y `label`.
4. Las categorías actuales son:
   - `TAMPOS`
   - `ASIENTOS POR NIVEL`
   - `RESPALDOS POR NIVEL`
   - `ACCESORIOS`

## Número de WhatsApp

El número configurado para el envío es `595982451828`.

## Nota

Esta feature no guarda datos en base de datos ni envía emails; solo genera un link de WhatsApp con el mensaje listo para enviar.