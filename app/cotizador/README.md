# Cotizador Oriplast

## Fuente de precios

Los precios unitarios viven únicamente en:

`data/proveedores/oriplast/<AAAA-MM>.json`

No se deben copiar precios a componentes, archivos de configuración ni
pruebas. La página consume la lista vigente desde
`lib/config/proveedores.ts`.

## Cargar una lista nueva

1. Copiar la nueva tabla a un JSON nuevo, sin modificar una lista ya usada.
2. Cerrar la lista anterior con `vigencia_hasta`.
3. Registrar la nueva lista en `lib/config/proveedores.ts`.
4. Ejecutar `npm run precios:validar`.
5. Ejecutar `npm test` y `npm run build`.

## Conjuntos y equivalencias

El despiece por CJA y el puente con el catálogo público viven en
`lib/config/equivalencias-catalogo.ts`.

La asignación de CJA se valida por estatura. Los ciclos educativos son una
orientación comercial porque los rangos FNDE se solapan.

## Auditoría

El mensaje de WhatsApp incluye la lista, la fecha y el tipo de cambio usados.
La línea de cotización congela el precio unitario y el identificador de lista;
una cotización emitida no debe recalcularse contra una lista futura.
