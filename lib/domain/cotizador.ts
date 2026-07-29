/**
 * DOMINIO DECIDE.
 *
 * Motor de cotización. Corresponde a la tarea T2 del SPEC aprobado
 * (SPEC-cotizador-oriplast.md), con una corrección de fondo:
 *
 *   El SPEC dice "los precios base se definen en PYG".
 *   El proveedor publica en BRL y actualiza mensualmente.
 *   Definir el precio base en PYG obliga a reconvertir a mano toda la lista
 *   cada vez que se mueve el cambio. La moneda base es la del proveedor,
 *   y la conversión ocurre acá, en el dominio.
 *
 * Todas las funciones son puras. No hacen fetch ni leen configuración.
 */

import type { CodigoISO, ItemPrecio } from "./lista-precios.ts";

export interface LineaCotizacion {
  codigo: string;
  cantidad: number;
  /** Precio unitario en moneda del proveedor, congelado al cotizar. */
  precio_unit: number;
  /** Lista de origen congelada para poder auditar la cotización. */
  lista_id?: string;
}

export interface TramoDescuento {
  /** Unidades a partir de las cuales aplica. */
  desde: number;
  /** Fracción, no porcentaje: 0.05 = 5%. */
  descuento: number;
}

export interface ParametrosCotizacion {
  /** BRL → PYG, por ejemplo 1200. Se congela junto con la cotización. */
  tipo_cambio: number;
  moneda_destino: CodigoISO;
  /** Fracción. Tope real: condiciones.descuento_pago_anticipado_max de la lista. */
  descuento_pago_anticipado?: number;
  /** Fracción sobre FOB: flete internacional, despacho, gastos de frontera. */
  costo_nacionalizacion?: number;
  /** Fracción de margen sobre el costo puesto en Paraguay. */
  margen?: number;
  /** Solo aplica en PYG. En BRL/USD es exportación y no corresponde. */
  incluir_iva?: boolean;
  iva?: number;
  /** Multiplica todas las cantidades. Sirve para cotizar N conjuntos idénticos. */
  conjuntos?: number;
}

export interface DetalleLinea extends LineaCotizacion {
  cantidad_total: number;
  subtotal_origen: number;
  /** Precio de venta unitario ya convertido y redondeado para mostrar. */
  precio_unit_destino: number;
  /** Cantidad × precio unitario mostrado. Siempre reconcilia con el resumen. */
  subtotal_destino: number;
}

export interface Cotizacion {
  lineas: DetalleLinea[];
  conjuntos: number;
  unidades: number;
  items_distintos: number;
  /** Todos estos montos están en la moneda del proveedor (BRL). */
  subtotal_origen: number;
  descuento_origen: number;
  nacionalizacion_origen: number;
  costo_origen: number;
  margen_origen: number;
  /** Convertido a moneda_destino. */
  subtotal_destino: number;
  descuento_destino: number;
  neto_destino: number;
  iva_destino: number;
  total_destino: number;
  costo_unitario_destino: number;
  total_por_conjunto_destino: number;
  moneda_destino: CodigoISO;
  tipo_cambio: number;
}

const redondear = (n: number, dec = 2): number =>
  Math.round((n + Number.EPSILON) * 10 ** dec) / 10 ** dec;

/* ------------------------------------------------------------------ */

export function calcularSubtotal(linea: LineaCotizacion, conjuntos = 1): number {
  const cantidad = Math.max(0, Math.trunc(linea.cantidad)) * Math.max(1, Math.trunc(conjuntos));
  return redondear(cantidad * linea.precio_unit);
}

/** Tramo de descuento por volumen. Devuelve la fracción aplicable. */
export function tramoAplicable(tramos: TramoDescuento[], unidades: number): number {
  return tramos
    .filter((t) => unidades >= t.desde)
    .reduce((mayor, t) => Math.max(mayor, t.descuento), 0);
}

export function aplicarDescuento(monto: number, fraccion: number): number {
  const f = Math.min(1, Math.max(0, fraccion));
  return redondear(monto * (1 - f));
}

export function convertirMoneda(monto: number, tipoCambio: number): number {
  if (!Number.isFinite(tipoCambio) || tipoCambio <= 0) {
    throw new Error("El tipo de cambio debe ser un número mayor a cero.");
  }
  return monto * tipoCambio;
}

export function calcularIVA(monto: number, iva: number): number {
  return redondear(monto * Math.max(0, iva), 0);
}

/**
 * Calcula la cotización completa.
 *
 * Orden de aplicación, que no es intercambiable:
 *   subtotal FOB → descuento por pago anticipado → nacionalización
 *   → margen → conversión a moneda destino → IVA
 *
 * El descuento va antes que la nacionalización porque el proveedor lo aplica
 * sobre el valor de factura. El margen va sobre el costo ya puesto en Paraguay,
 * no sobre el FOB: si se calcula sobre FOB, el flete se vende sin margen.
 */
export function calcularCotizacion(
  lineas: LineaCotizacion[],
  params: ParametrosCotizacion
): Cotizacion {
  const conjuntos = Math.max(0, Math.trunc(params.conjuntos ?? 1));
  const detalleOrigen = lineas
    .filter((l) => l.cantidad > 0 && conjuntos > 0)
    .map((l) => {
      const cantidad_total = Math.trunc(l.cantidad) * conjuntos;
      return { ...l, cantidad_total, subtotal_origen: redondear(cantidad_total * l.precio_unit) };
    });

  const unidades = detalleOrigen.reduce((a, l) => a + l.cantidad_total, 0);
  const subtotal_origen = redondear(
    detalleOrigen.reduce((a, l) => a + l.subtotal_origen, 0),
  );

  const fDesc = Math.min(1, Math.max(0, params.descuento_pago_anticipado ?? 0));
  const descuento_origen = redondear(subtotal_origen * fDesc);
  const neto = subtotal_origen - descuento_origen;

  const fNac = Math.max(0, params.costo_nacionalizacion ?? 0);
  const nacionalizacion_origen = redondear(neto * fNac);
  const costo_origen = redondear(neto + nacionalizacion_origen);

  const fMargen = Math.max(0, params.margen ?? 0);
  const margen_origen = redondear(costo_origen * fMargen);

  const decimalesDestino = params.moneda_destino === "PYG" ? 0 : 2;
  const factorVentaAntesDescuento = (1 + fNac) * (1 + fMargen);
  const detalle: DetalleLinea[] = detalleOrigen.map((linea) => {
    const precio_unit_destino = redondear(
      convertirMoneda(
        linea.precio_unit * factorVentaAntesDescuento,
        params.tipo_cambio,
      ),
      decimalesDestino,
    );
    return {
      ...linea,
      precio_unit_destino,
      subtotal_destino: redondear(
        precio_unit_destino * linea.cantidad_total,
        decimalesDestino,
      ),
    };
  });
  const subtotal_destino = redondear(
    detalle.reduce((total, linea) => total + linea.subtotal_destino, 0),
    decimalesDestino,
  );
  const descuento_destino = redondear(
    subtotal_destino * fDesc,
    decimalesDestino,
  );
  const neto_destino = subtotal_destino - descuento_destino;

  const aplicaIVA = params.moneda_destino === "PYG" && params.incluir_iva === true;
  const iva_destino = aplicaIVA ? calcularIVA(neto_destino, params.iva ?? 0.1) : 0;
  const total_destino = neto_destino + iva_destino;

  return {
    lineas: detalle,
    conjuntos,
    unidades,
    items_distintos: detalle.length,
    subtotal_origen,
    descuento_origen,
    nacionalizacion_origen,
    costo_origen,
    margen_origen,
    subtotal_destino,
    descuento_destino,
    neto_destino,
    iva_destino,
    total_destino,
    costo_unitario_destino:
      unidades > 0
        ? redondear(total_destino / unidades, decimalesDestino)
        : 0,
    total_por_conjunto_destino:
      conjuntos > 0
        ? redondear(total_destino / conjuntos, decimalesDestino)
        : 0,
    moneda_destino: params.moneda_destino,
    tipo_cambio: params.tipo_cambio,
  };
}

/** El SPEC exige que el botón de WhatsApp quede deshabilitado si el total es cero. */
export function cotizacionEsValida(c: Cotizacion): boolean {
  return c.unidades > 0 && c.total_destino > 0;
}

/**
 * Une un ítem de la lista con una cantidad. Congela el precio: a partir de
 * acá la cotización deja de depender de la lista vigente.
 */
export function congelarLinea(
  item: ItemPrecio,
  cantidad: number,
  listaId?: string,
): LineaCotizacion {
  return {
    codigo: item.codigo,
    cantidad,
    precio_unit: item.precio_unit,
    ...(listaId ? { lista_id: listaId } : {}),
  };
}
