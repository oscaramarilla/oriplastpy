/**
 * CONFIGURACIÓN DEFINE.
 *
 * Puente auditable entre:
 *   - el vocabulario comercial del catálogo paraguayo;
 *   - los tamaños normalizados FNDE;
 *   - los códigos de la lista de Oriplast.
 *
 * Regla: los ciclos son una orientación comercial. La elección definitiva
 * del CJA se hace por estatura, porque los rangos normalizados se solapan.
 */

export type IdConjunto =
  | "cja-01"
  | "cja-03"
  | "cja-04"
  | "cja-05"
  | "cja-06"
  | "cjp-01";

export interface PiezaConjunto {
  codigo_oriplast: string;
  cantidad: number;
  funcion: string;
}

export interface ConjuntoCotizable {
  id: IdConjunto;
  nombre: string;
  uso_referencial: string;
  estatura_desde_cm: number | null;
  estatura_hasta_cm: number | null;
  color: string;
  color_hex: string;
  piezas: readonly PiezaConjunto[];
}

const despiece = (
  codigoAsientoRespaldo: string,
  codigoTampo: string,
): readonly PiezaConjunto[] => [
  {
    codigo_oriplast: codigoAsientoRespaldo,
    cantidad: 1,
    funcion: "Juego de asiento y respaldo",
  },
  {
    codigo_oriplast: codigoTampo,
    cantidad: 1,
    funcion: "Tampo escolar inyectado",
  },
  {
    codigo_oriplast: "SAPATA-MAIOR",
    cantidad: 2,
    funcion: "Zapatas mayores",
  },
  {
    codigo_oriplast: "SAPATA-MENOR",
    cantidad: 2,
    funcion: "Zapatas menores",
  },
  {
    codigo_oriplast: "1360",
    cantidad: 1,
    funcion: "Traba estructural del tampo",
  },
  {
    codigo_oriplast: "2627",
    cantidad: 1,
    funcion: "Tapa de tubo del conjunto",
  },
];

/**
 * Despieces cerrados sobre la lista Oriplast 2026-07.
 *
 * El perfil CJA-04 reproduce el caso de control entregado: 8 componentes por
 * conjunto y, para 330 conjuntos, el subtotal BRL esperado antes de descuento.
 * No se duplican asiento y respaldo: Oriplast los vende como un único juego.
 */
export const CONJUNTOS_COTIZABLES: readonly ConjuntoCotizable[] = [
  {
    id: "cja-01",
    nombre: "CJA 01 · Maternal",
    uso_referencial: "Primera infancia",
    estatura_desde_cm: null,
    estatura_hasta_cm: null,
    color: "Naranja",
    color_hex: "#f97316",
    piezas: despiece("2249", "561544"),
  },
  {
    id: "cja-03",
    nombre: "CJA 03 · Infantil",
    uso_referencial: "Nivel inicial y primer ciclo",
    estatura_desde_cm: 119,
    estatura_hasta_cm: 142,
    color: "Amarillo",
    color_hex: "#facc15",
    piezas: despiece("2162", "636511"),
  },
  {
    id: "cja-04",
    nombre: "CJA 04 · Infanto juvenil",
    uso_referencial: "Primer y segundo ciclo",
    estatura_desde_cm: 133,
    estatura_hasta_cm: 159,
    color: "Rojo",
    color_hex: "#ef4444",
    piezas: despiece("2161", "764926"),
  },
  {
    id: "cja-05",
    nombre: "CJA 05 · Juvenil",
    uso_referencial: "Segundo y tercer ciclo",
    estatura_desde_cm: 146,
    estatura_hasta_cm: 176,
    color: "Verde",
    color_hex: "#16a34a",
    piezas: despiece("2581", "420361"),
  },
  {
    id: "cja-06",
    nombre: "CJA 06 · Adulto",
    uso_referencial: "Tercer ciclo y nivel medio",
    estatura_desde_cm: 159,
    estatura_hasta_cm: 188,
    color: "Azul",
    color_hex: "#2563eb",
    piezas: despiece("646505", "278848"),
  },
  {
    id: "cjp-01",
    nombre: "CJP 01 · Profesor",
    uso_referencial: "Docentes y sala de profesores",
    estatura_desde_cm: null,
    estatura_hasta_cm: null,
    color: "Gris",
    color_hex: "#64748b",
    piezas: despiece("2526", "480626"),
  },
] as const;

export interface Equivalencia {
  id_catalogo: string;
  /** Puede haber variantes por tamaño o color. Nunca implica sumar todos. */
  codigos_oriplast: readonly string[];
  criterio: string;
}

/**
 * El proveedor vende asiento y respaldo como un juego. Por eso ambos
 * conceptos públicos apuntan al mismo SKU, pero el cotizador lo agrega una
 * sola vez mediante el despiece del conjunto.
 */
export const EQUIVALENCIAS: readonly Equivalencia[] = [
  {
    id_catalogo: "tampo-con-travesano",
    codigos_oriplast: ["561544", "636511", "764926", "420361", "278848", "480626", "1360"],
    criterio: "Tampo FNDE por color más la traba estructural compatible.",
  },
  {
    id_catalogo: "asiento-nivel-inicial",
    codigos_oriplast: ["2249", "2162"],
    criterio: "CJA 01 maternal o CJA 03 infantil; se define por estatura.",
  },
  {
    id_catalogo: "asiento-1er-ciclo",
    codigos_oriplast: ["2162", "2161"],
    criterio: "CJA 03 o CJA 04; los rangos de estatura FNDE se solapan.",
  },
  {
    id_catalogo: "asiento-2do-ciclo",
    codigos_oriplast: ["2161", "2581"],
    criterio: "CJA 04 o CJA 05; la selección final se hace por estatura.",
  },
  {
    id_catalogo: "asiento-3er-ciclo",
    codigos_oriplast: ["2581", "646505"],
    criterio: "CJA 05 o CJA 06; la selección final se hace por estatura.",
  },
  {
    id_catalogo: "respaldo-nivel-inicial",
    codigos_oriplast: ["2249", "2162"],
    criterio: "Oriplast entrega respaldo junto con el asiento del mismo CJA.",
  },
  {
    id_catalogo: "respaldo-1er-3er-ciclo",
    codigos_oriplast: ["2162", "2161", "2581", "646505"],
    criterio: "Juego asiento/respaldo según el tamaño CJA elegido por estatura.",
  },
  {
    id_catalogo: "porta-libros",
    codigos_oriplast: ["2473", "2414"],
    criterio: "Variantes negra y gris del porta libros FNDE.",
  },
  {
    id_catalogo: "puntera-superior",
    codigos_oriplast: ["2102"],
    criterio: "Puntera de mesa de una pulgada declarada en la lista Oriplast.",
  },
] as const;

export function buscarConjunto(id: IdConjunto): ConjuntoCotizable {
  const conjunto = CONJUNTOS_COTIZABLES.find((item) => item.id === id);
  if (!conjunto) throw new Error(`No existe el conjunto ${id}.`);
  return conjunto;
}

/** Queda como guard de build: una equivalencia sin códigos bloquea el deploy. */
export function equivalenciasPendientes(): string[] {
  return EQUIVALENCIAS
    .filter((equivalencia) => equivalencia.codigos_oriplast.length === 0)
    .map((equivalencia) => equivalencia.id_catalogo);
}
