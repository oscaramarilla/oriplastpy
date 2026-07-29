/**
 * DOMINIO DECIDE.
 *
 * Tipos y reglas de la fuente única de precios. Funciones puras: no hacen
 * fetch, no leen archivos, no tocan Supabase. Se les pasa la lista y deciden.
 *
 * Validación sin dependencias externas (no zod), coherente con la regla de
 * COMO-TRABAJAMOS-ORIPLAST: sin dependencias innecesarias.
 */

export type CodigoISO = "BRL" | "PYG" | "USD";

export type TipoItem =
  | "asiento-respaldo"
  | "tampo"
  | "tablero"
  | "accesorio";

export interface ColorItem {
  /** Nombre tal cual figura en la tabla del proveedor. Se usa para la orden de compra. */
  pt: string;
  /** Nombre para el cliente paraguayo. Se usa en la web y en la cotización. */
  es: string;
  /** Muestra de color. null cuando el ítem se fabrica en varios colores. */
  hex: string | null;
}

export interface ItemPrecio {
  /** Código del proveedor. Es la clave real del ítem. */
  codigo: string;
  linea: string;
  tipo: TipoItem;
  descripcion_pt: string;
  descripcion_es: string;
  color: ColorItem;
  medidas_mm: string | null;
  unidad: "UN";
  precio_unit: number;
}

export interface ListaPrecios {
  id: string;
  proveedor: {
    nombre: string;
    cnpj?: string;
    pais: string;
    planta?: string;
    email?: string;
    telefono?: string;
    whatsapp?: string;
  };
  moneda: CodigoISO;
  incoterm: string;
  emitida: string;
  vigencia_desde: string;
  /** null = lista abierta. Se cierra al cargar la siguiente. */
  vigencia_hasta: string | null;
  origen: {
    tipo: string;
    titulo: string;
    recibido: string;
    transcripcion: string;
  };
  condiciones: {
    descuento_pago_anticipado_max: number;
    nota_pt?: string;
  };
  lineas: Record<string, { pt: string; es: string }>;
  items: ItemPrecio[];
  hash_items?: string;
}

/* ------------------------------------------------------------------ */
/* Validación                                                          */
/* ------------------------------------------------------------------ */

export interface ResultadoValidacion {
  valido: boolean;
  errores: string[];
}

const FECHA = /^\d{4}-\d{2}-\d{2}$/;

export function validarListaPrecios(lista: ListaPrecios): ResultadoValidacion {
  const errores: string[] = [];
  const en = (m: string) => errores.push(`[${lista?.id ?? "sin-id"}] ${m}`);

  if (!lista?.id) en("falta id");
  if (!["BRL", "PYG", "USD"].includes(lista?.moneda)) en("moneda inválida");
  if (!FECHA.test(lista?.vigencia_desde ?? "")) en("vigencia_desde debe ser AAAA-MM-DD");
  if (lista?.vigencia_hasta !== null && !FECHA.test(lista?.vigencia_hasta ?? "")) {
    en("vigencia_hasta debe ser AAAA-MM-DD o null");
  }
  if (lista?.vigencia_hasta && lista.vigencia_hasta < lista.vigencia_desde) {
    en("vigencia_hasta es anterior a vigencia_desde");
  }

  const d = lista?.condiciones?.descuento_pago_anticipado_max;
  if (typeof d !== "number" || d < 0 || d > 1) {
    en("descuento_pago_anticipado_max debe estar entre 0 y 1");
  }

  if (!Array.isArray(lista?.items) || lista.items.length === 0) {
    en("la lista no tiene ítems");
    return { valido: false, errores };
  }

  const vistos = new Set<string>();
  lista.items.forEach((it, i) => {
    const ref = it.codigo || `#${i}`;
    if (!it.codigo) en(`ítem ${i}: falta código`);
    if (vistos.has(it.codigo)) en(`código duplicado: ${it.codigo}`);
    vistos.add(it.codigo);

    if (typeof it.precio_unit !== "number" || !Number.isFinite(it.precio_unit)) {
      en(`${ref}: precio_unit no es un número`);
    } else if (it.precio_unit <= 0) {
      en(`${ref}: precio_unit debe ser mayor a cero`);
    }

    if (!it.descripcion_es) en(`${ref}: falta descripcion_es (la web es 100% castellano)`);
    if (!it.descripcion_pt) en(`${ref}: falta descripcion_pt (se necesita para la orden de compra)`);
    if (!lista.lineas?.[it.linea]) en(`${ref}: línea "${it.linea}" no está declarada en lineas`);
  });

  return { valido: errores.length === 0, errores };
}

/** Detecta solapamientos de vigencia entre listas del mismo proveedor. */
export function validarVigencias(listas: ListaPrecios[]): ResultadoValidacion {
  const errores: string[] = [];
  const abiertas = listas.filter((l) => l.vigencia_hasta === null);
  if (abiertas.length > 1) {
    errores.push(
      `Hay ${abiertas.length} listas abiertas a la vez: ${abiertas.map((l) => l.id).join(", ")}. ` +
      `Cerrá la anterior con vigencia_hasta antes de abrir la nueva.`
    );
  }
  return { valido: errores.length === 0, errores };
}

/* ------------------------------------------------------------------ */
/* Resolución                                                          */
/* ------------------------------------------------------------------ */

export function listaVigenteEn(listas: ListaPrecios[], fechaISO: string): ListaPrecios | null {
  const candidatas = listas.filter(
    (l) => l.vigencia_desde <= fechaISO && (l.vigencia_hasta === null || l.vigencia_hasta >= fechaISO)
  );
  if (candidatas.length === 0) return null;
  return candidatas.sort((a, b) => b.vigencia_desde.localeCompare(a.vigencia_desde))[0];
}

export function buscarItem(lista: ListaPrecios, codigo: string): ItemPrecio | null {
  return lista.items.find((i) => i.codigo === codigo) ?? null;
}

/**
 * Precio de un código a una fecha dada.
 * Devuelve también el id de la lista para que la cotización lo congele:
 * sin esa referencia no se puede auditar una cotización vieja.
 */
export function resolverPrecio(
  listas: ListaPrecios[],
  codigo: string,
  fechaISO: string
): { precio: number; moneda: CodigoISO; lista_id: string; item: ItemPrecio } | null {
  const lista = listaVigenteEn(listas, fechaISO);
  if (!lista) return null;
  const item = buscarItem(lista, codigo);
  if (!item) return null;
  return { precio: item.precio_unit, moneda: lista.moneda, lista_id: lista.id, item };
}

export function itemsPorLinea(lista: ListaPrecios, linea: string): ItemPrecio[] {
  return lista.items.filter((i) => i.linea === linea);
}

export function buscarPorTexto(lista: ListaPrecios, texto: string): ItemPrecio[] {
  const t = texto.trim().toLowerCase();
  if (!t) return lista.items;
  const terminos = t.split(/\s+/);
  return lista.items.filter((i) => {
    const heno = `${i.codigo} ${i.descripcion_es} ${i.descripcion_pt} ${i.color.es} ${i.color.pt}`.toLowerCase();
    return terminos.every((term) => heno.includes(term));
  });
}
