# SPEC: Portada y Catálogo B2B para Proveedores MEC

> **Estado:** Lista para implementación
> **Objetivo:** Convertir `oriplastpy.com` en el portal exclusivo en Paraguay para que metalúrgicas y proveedores del MEC compren componentes plásticos inyectados al por mayor.

## 1. Contexto
Oriplast Brasil fabrica los plásticos; Metal Mad EAS los representa en Paraguay. Las metalúrgicas locales necesitan comprar los "tampos", asientos, respaldos y zapatas de polipropileno para armar los pupitres de caño que luego venden al MEC o colegios. Necesitan ver rápidamente qué piezas hay, su resistencia y pedir cotización por volumen.

## 2. Casos de Uso
- **El dueño de una metalúrgica quiere** ver el catálogo de componentes plásticos **para** armar 500 sillas para una licitación del MEC.
- **Un proveedor del Estado quiere** tocar el botón de WhatsApp **para** solicitar el precio por 1000 "tampos" con travesaño.

## 3. Reglas de Negocio y Presentación
- **Cero B2C:** No se muestran precios unitarios en la web. La venta es corporativa.
- **Idioma:** Todo texto, `alt` de imágenes y meta tags deben estar en español. 
- **Estética "Prime" Móvil:** - Tarjetas de producto grandes.
  - Botones de acción fijos (sticky) en la parte inferior de la pantalla en móviles.
  - Contraste alto: fondo gris claro (`bg-gray-50`), tarjetas blancas (`bg-white`), acentos en azul corporativo (`text-blue-700`).

## 4. Criterios de Aceptación
- [ ] El `<html lang="">` es estrictamente `"es"`.
- [ ] No existe ninguna cadena de texto en portugués (revisión de "Linha Pratice", "Nossas Linhas", etc.).
- [ ] El diseño en ancho menor a 768px (móvil) muestra los productos en 1 sola columna con imágenes amplias.
- [ ] Hay un botón flotante de WhatsApp siempre visible en la versión móvil.
