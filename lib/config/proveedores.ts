/**
 * CONFIGURACIÓN DEFINE.
 *
 * Registro de listas de precio de proveedor. Único punto donde se declara
 * qué archivo de datos existe y desde cuándo rige.
 *
 * REGLA DURA: no existe ningún valor de precio en este archivo ni en ningún
 * otro archivo .ts del proyecto. Los precios viven exclusivamente en
 * data/proveedores/<proveedor>/<AAAA-MM>.json
 *
 * Para cargar una lista nueva:
 *   1. Agregar el JSON nuevo en data/proveedores/oriplast/
 *   2. Cerrar la lista anterior poniéndole "vigencia_hasta"
 *   3. Registrarla acá
 *   4. npm run precios:validar
 * NUNCA editar los precios de una lista ya usada para cotizar.
 */

import type { ListaPrecios } from "@/lib/domain/lista-precios";
import oriplast202607 from "@/data/proveedores/oriplast/2026-07.json";

export const LISTAS_PRECIO: ListaPrecios[] = [
  oriplast202607 as ListaPrecios,
];

/** Moneda en la que Oriplast publica su tabla. */
export const MONEDA_PROVEEDOR = "BRL" as const;

/** Moneda de venta al cliente paraguayo. */
export const MONEDA_VENTA = "PYG" as const;

/**
 * Tipo de cambio de referencia. Se sobrescribe por operación:
 * el TC que se usó queda congelado dentro de cada cotización.
 * Valor de arranque, no valor de verdad.
 */
export const TC_REFERENCIA: Record<string, number> = {
  "BRL_PYG": 1200,
  "USD_PYG": 7300,
};

/** IVA paraguayo. No aplica a operaciones en BRL/USD (exportación). */
export const IVA_PY = 0.10;

/**
 * Costo de nacionalización estimado sobre el valor FOB.
 * Cubre flete internacional, despacho y gastos de frontera.
 * Ajustar contra despachos reales, no contra estimaciones.
 */
export const COSTO_NACIONALIZACION_DEFAULT = 0.00;

/** Margen mínimo aceptable. Por debajo de esto el cotizador avisa. */
export const MARGEN_MINIMO = 0.15;

/** Canal comercial local. Los datos del proveedor brasileño quedan en el JSON. */
export const CONTACTO_COMERCIAL = {
  razon_social: "Metal Mad EAS",
  whatsapp: "595982451828",
  email: "ventas@oriplastpy.com",
} as const;
