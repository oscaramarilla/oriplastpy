import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  buscarConjunto,
  equivalenciasPendientes,
} from "../config/equivalencias-catalogo.ts";
import {
  calcularCotizacion,
  congelarLinea,
  cotizacionEsValida,
  tramoAplicable,
} from "./cotizador.ts";
import {
  buscarItem,
  resolverPrecio,
  validarListaPrecios,
  type ListaPrecios,
} from "./lista-precios.ts";

const lista = JSON.parse(
  readFileSync(
    join(process.cwd(), "data", "proveedores", "oriplast", "2026-07.json"),
    "utf8",
  ),
) as ListaPrecios;

const redondear = (valor: number, decimales = 2): number => {
  const factor = 10 ** decimales;
  return Math.round((valor + Number.EPSILON) * factor) / factor;
};

test("la lista de julio y las equivalencias están completas", () => {
  const resultado = validarListaPrecios(lista);
  assert.equal(resultado.valido, true, resultado.errores.join("\n"));
  assert.equal(lista.items.length, 92);
  assert.deepEqual(equivalenciasPendientes(), []);
});

test("el CJA 04 reproduce el caso de control de 330 conjuntos", () => {
  const conjunto = buscarConjunto("cja-04");
  const lineas = conjunto.piezas.map((pieza) => {
    const item = buscarItem(lista, pieza.codigo_oriplast);
    assert.ok(item, `Falta ${pieza.codigo_oriplast}`);
    return congelarLinea(item, pieza.cantidad, lista.id);
  });

  const cotizacion = calcularCotizacion(lineas, {
    conjuntos: 330,
    tipo_cambio: 1,
    moneda_destino: "BRL",
    descuento_pago_anticipado:
      lista.condiciones.descuento_pago_anticipado_max,
  });
  const unidadesPorConjunto = conjunto.piezas.reduce(
    (total, pieza) => total + pieza.cantidad,
    0,
  );
  const subtotalPorConjunto = conjunto.piezas.reduce((total, pieza) => {
    const item = buscarItem(lista, pieza.codigo_oriplast);
    assert.ok(item);
    return total + item.precio_unit * pieza.cantidad;
  }, 0);

  assert.equal(cotizacion.unidades, unidadesPorConjunto * 330);
  assert.equal(
    cotizacion.subtotal_origen,
    redondear(subtotalPorConjunto * 330),
  );
  assert.equal(
    cotizacion.descuento_origen,
    redondear(
      cotizacion.subtotal_origen *
        lista.condiciones.descuento_pago_anticipado_max,
    ),
  );
  assert.equal(cotizacion.items_distintos, conjunto.piezas.length);
  assert.ok(cotizacion.lineas.every((linea) => linea.lista_id === lista.id));
  assert.equal(
    cotizacion.lineas.reduce(
      (total, linea) => total + linea.subtotal_destino,
      0,
    ),
    cotizacion.subtotal_destino,
  );
  assert.ok(
    cotizacion.lineas.every(
      (linea) =>
        linea.subtotal_destino ===
        redondear(linea.precio_unit_destino * linea.cantidad_total),
    ),
  );
});

test("la cotización congela precio, lista y tipo de cambio", () => {
  const item = buscarItem(lista, "2161");
  assert.ok(item);
  const linea = congelarLinea(item, 1, lista.id);
  const cotizacion = calcularCotizacion([linea], {
    conjuntos: 2,
    tipo_cambio: 1200,
    moneda_destino: "PYG",
  });

  assert.equal(linea.precio_unit, item.precio_unit);
  assert.equal(linea.lista_id, lista.id);
  assert.equal(cotizacion.tipo_cambio, 1200);
  assert.equal(cotizacion.total_destino, item.precio_unit * 2 * 1200);
});

test("cero conjuntos produce una cotización inválida", () => {
  const item = buscarItem(lista, "2161");
  assert.ok(item);
  const cotizacion = calcularCotizacion([congelarLinea(item, 1)], {
    conjuntos: 0,
    tipo_cambio: 1,
    moneda_destino: "BRL",
  });

  assert.equal(cotizacion.unidades, 0);
  assert.equal(cotizacion.total_destino, 0);
  assert.equal(cotizacionEsValida(cotizacion), false);
});

test("resolverPrecio devuelve null fuera de vigencia", () => {
  assert.equal(resolverPrecio([lista], "2161", "2026-07-05"), null);
  assert.ok(resolverPrecio([lista], "2161", "2026-07-06"));
});

test("el mayor tramo aplicable gana y los rangos no dependen del orden", () => {
  const tramos = [
    { desde: 100, descuento: 0.05 },
    { desde: 10, descuento: 0.02 },
    { desde: 500, descuento: 0.08 },
  ];

  assert.equal(tramoAplicable(tramos, 9), 0);
  assert.equal(tramoAplicable(tramos, 100), 0.05);
  assert.equal(tramoAplicable(tramos, 900), 0.08);
});
