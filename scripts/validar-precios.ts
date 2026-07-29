/**
 * Validador de listas de precio. Corre antes del build.
 *
 *   node --experimental-strip-types scripts/validar-precios.ts
 *
 * Requiere Node 22.6+. No agrega dependencias al proyecto.
 * En package.json:
 *   "precios:validar": "node --experimental-strip-types scripts/validar-precios.ts",
 *   "prebuild": "npm run precios:validar"
 *
 * Si una lista está mal, el build falla acá y no en producción.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { validarListaPrecios, validarVigencias } from "../lib/domain/lista-precios.ts";
import type { ListaPrecios } from "../lib/domain/lista-precios.ts";
import {
  CONJUNTOS_COTIZABLES,
  EQUIVALENCIAS,
  equivalenciasPendientes,
} from "../lib/config/equivalencias-catalogo.ts";

const RAIZ = join(process.cwd(), "data", "proveedores");

function cargarTodas(): ListaPrecios[] {
  const listas: ListaPrecios[] = [];
  for (const proveedor of readdirSync(RAIZ, { withFileTypes: true })) {
    if (!proveedor.isDirectory()) continue;
    const dir = join(RAIZ, proveedor.name);
    for (const archivo of readdirSync(dir)) {
      if (!archivo.endsWith(".json")) continue;
      listas.push(JSON.parse(readFileSync(join(dir, archivo), "utf8")) as ListaPrecios);
    }
  }
  return listas;
}

const listas = cargarTodas();
const errores: string[] = [];

for (const lista of listas) {
  const r = validarListaPrecios(lista);
  if (!r.valido) errores.push(...r.errores);
}

const porProveedor = new Map<string, ListaPrecios[]>();
for (const l of listas) {
  const k = l.proveedor.nombre;
  porProveedor.set(k, [...(porProveedor.get(k) ?? []), l]);
}
for (const [, grupo] of porProveedor) {
  const r = validarVigencias(grupo);
  if (!r.valido) errores.push(...r.errores);
}

const codigosDisponibles = new Set(
  listas.flatMap((lista) => lista.items.map((item) => item.codigo)),
);

for (const conjunto of CONJUNTOS_COTIZABLES) {
  for (const pieza of conjunto.piezas) {
    if (!codigosDisponibles.has(pieza.codigo_oriplast)) {
      errores.push(
        `[${conjunto.id}] el código ${pieza.codigo_oriplast} no existe en ninguna lista`,
      );
    }
    if (!Number.isInteger(pieza.cantidad) || pieza.cantidad <= 0) {
      errores.push(
        `[${conjunto.id}] ${pieza.codigo_oriplast} tiene una cantidad inválida`,
      );
    }
  }
}

for (const equivalencia of EQUIVALENCIAS) {
  for (const codigo of equivalencia.codigos_oriplast) {
    if (!codigosDisponibles.has(codigo)) {
      errores.push(
        `[${equivalencia.id_catalogo}] el código ${codigo} no existe en ninguna lista`,
      );
    }
  }
}

const pendientes = equivalenciasPendientes();
if (pendientes.length > 0) {
  errores.push(`Equivalencias pendientes: ${pendientes.join(", ")}`);
}

/**
 * Guard contra precios copiados a TypeScript. Se buscan los decimales exactos
 * de las listas; los enteros se omiten para no confundir cantidades, fechas o
 * clases de Tailwind con precios.
 */
function fuentesEn(directorio: string): string[] {
  const fuentes: string[] = [];
  for (const entrada of readdirSync(directorio, { withFileTypes: true })) {
    const ruta = join(directorio, entrada.name);
    if (entrada.isDirectory()) {
      fuentes.push(...fuentesEn(ruta));
    } else if (entrada.name.endsWith(".ts") || entrada.name.endsWith(".tsx")) {
      fuentes.push(ruta);
    }
  }
  return fuentes;
}

const preciosDecimales = new Set(
  listas
    .flatMap((lista) => lista.items.map((item) => String(item.precio_unit)))
    .filter((precio) => precio.includes(".")),
);
const archivosFuente = ["app", "components", "lib"].flatMap((directorio) =>
  fuentesEn(join(process.cwd(), directorio)),
);

for (const archivo of archivosFuente) {
  const contenido = readFileSync(archivo, "utf8");
  for (const precio of preciosDecimales) {
    const escapado = precio.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const patron = new RegExp(`(^|[^\\d.])${escapado}([^\\d.]|$)`);
    if (patron.test(contenido)) {
      errores.push(
        `Precio hardcodeado fuera de data/: ${precio} encontrado en ${archivo}`,
      );
    }
  }
}

if (errores.length > 0) {
  console.error(`\n✗ ${errores.length} problema(s) en las listas de precio:\n`);
  errores.forEach((e) => console.error("  " + e));
  console.error("");
  process.exit(1);
}

const items = listas.reduce((a, l) => a + l.items.length, 0);
console.log(
  `✓ ${listas.length} lista(s), ${items} ítems, ` +
    `${CONJUNTOS_COTIZABLES.length} conjuntos y ${EQUIVALENCIAS.length} equivalencias, sin errores.`,
);
