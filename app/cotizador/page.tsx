"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  CONJUNTOS_COTIZABLES,
  buscarConjunto,
  type IdConjunto,
} from "@/lib/config/equivalencias-catalogo";
import {
  CONTACTO_COMERCIAL,
  COSTO_NACIONALIZACION_DEFAULT,
  IVA_PY,
  LISTAS_PRECIO,
  MARGEN_MINIMO,
  TC_REFERENCIA,
} from "@/lib/config/proveedores";
import {
  calcularCotizacion,
  congelarLinea,
  cotizacionEsValida,
} from "@/lib/domain/cotizador";
import {
  buscarItem,
  listaVigenteEn,
  type CodigoISO,
} from "@/lib/domain/lista-precios";
import {
  construirMensajeCotizacion,
  formatearMoneda,
  generarLinkWhatsapp,
} from "@/lib/services/whatsapp";

const MAX_CONJUNTOS = 100_000;

const limitarEntero = (valor: string): number => {
  if (valor === "") return 0;
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return 0;
  return Math.min(MAX_CONJUNTOS, Math.max(0, Math.trunc(numero)));
};

const redondearMoneda = (valor: number, moneda: CodigoISO): number => {
  const decimales = moneda === "PYG" ? 0 : 2;
  const factor = 10 ** decimales;
  return Math.round((valor + Number.EPSILON) * factor) / factor;
};

const formatearCantidad = (valor: number): string =>
  new Intl.NumberFormat("es-PY").format(valor);

const fechaIsoParaguay = (): string => {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Asuncion",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const valor = (tipo: Intl.DateTimeFormatPartTypes) =>
    partes.find((parte) => parte.type === tipo)?.value ?? "";

  return `${valor("year")}-${valor("month")}-${valor("day")}`;
};

const etiquetaRango = (
  desde: number | null,
  hasta: number | null,
): string => {
  if (desde === null || hasta === null) return "Uso institucional";
  const metros = (centimetros: number) =>
    (centimetros / 100).toLocaleString("es-PY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  return `${metros(desde)} a ${metros(hasta)} m de estatura`;
};

export default function CotizadorPage() {
  const [conjuntoId, setConjuntoId] = useState<IdConjunto>("cja-04");
  const [cantidad, setCantidad] = useState(330);
  const [moneda, setMoneda] = useState<CodigoISO>("PYG");
  const [incluyeIva, setIncluyeIva] = useState(true);
  const [pagoAnticipado, setPagoAnticipado] = useState(true);
  const [tcPyg, setTcPyg] = useState(TC_REFERENCIA.BRL_PYG);
  const [fechaIso] = useState(fechaIsoParaguay);

  const lista = useMemo(
    () => listaVigenteEn(LISTAS_PRECIO, fechaIso) ?? LISTAS_PRECIO[0],
    [fechaIso],
  );
  const conjunto = buscarConjunto(conjuntoId);

  const tipoCambio =
    moneda === "BRL"
      ? 1
      : moneda === "PYG"
        ? tcPyg
        : tcPyg / TC_REFERENCIA.USD_PYG;

  const lineasBase = useMemo(
    () =>
      conjunto.piezas.map((pieza) => {
        const item = buscarItem(lista, pieza.codigo_oriplast);
        if (!item) {
          throw new Error(
            `El código ${pieza.codigo_oriplast} no existe en ${lista.id}.`,
          );
        }
        return congelarLinea(item, pieza.cantidad, lista.id);
      }),
    [conjunto, lista],
  );

  const descuento = pagoAnticipado
    ? lista.condiciones.descuento_pago_anticipado_max
    : 0;

  const cotizacion = calcularCotizacion(lineasBase, {
    conjuntos: cantidad,
    tipo_cambio: tipoCambio,
    moneda_destino: moneda,
    descuento_pago_anticipado: descuento,
    costo_nacionalizacion: COSTO_NACIONALIZACION_DEFAULT,
    margen: MARGEN_MINIMO,
    incluir_iva: incluyeIva,
    iva: IVA_PY,
  });

  const factorVenta =
    (1 + COSTO_NACIONALIZACION_DEFAULT) *
    (1 + MARGEN_MINIMO) *
    tipoCambio;

  const detalleVisible = conjunto.piezas.map((pieza) => {
    const item = buscarItem(lista, pieza.codigo_oriplast);
    if (!item) throw new Error(`Falta ${pieza.codigo_oriplast} en ${lista.id}.`);
    const precioUnitario = redondearMoneda(
      item.precio_unit * factorVenta,
      moneda,
    );
    const cantidadTotal = pieza.cantidad * cantidad;

    return {
      ...pieza,
      item,
      cantidadTotal,
      precioUnitario,
      subtotal: redondearMoneda(precioUnitario * cantidadTotal, moneda),
    };
  });

  const subtotalVenta = cotizacion.subtotal_destino;
  const descuentoVenta = cotizacion.descuento_destino;

  const mensaje = construirMensajeCotizacion({
    conjunto: conjunto.nombre,
    cantidad_conjuntos: cantidad,
    moneda,
    lineas: detalleVisible.map((linea) => ({
      codigo: linea.codigo_oriplast,
      descripcion: linea.item.descripcion_es,
      cantidad: linea.cantidadTotal,
      precio_unitario: linea.precioUnitario,
      subtotal: linea.subtotal,
    })),
    subtotal: subtotalVenta,
    descuento: descuentoVenta,
    iva: cotizacion.iva_destino,
    total: cotizacion.total_destino,
    lista_id: lista.id,
    tipo_cambio: tipoCambio,
    fecha_iso: fechaIso,
  });
  const linkWhatsapp = generarLinkWhatsapp(
    CONTACTO_COMERCIAL.whatsapp,
    mensaje,
  );
  const puedeEnviar = cotizacionEsValida(cotizacion);

  return (
    <main className="min-h-screen bg-[#f4f6f1] text-slate-950">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-xl font-black tracking-[-0.04em] text-slate-950"
          >
            ORIPLAST<span className="text-lime-600">.PY</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver al catálogo
          </Link>
        </div>
      </nav>

      <header className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-lime-400 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-950">
              Cotizador técnico B2B
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              Lista {lista.id.replace("oriplast-", "")} · Base BRL
            </span>
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Costeá cada componente.
                <span className="block text-lime-400">
                  Defendé cada guaraní.
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Elegí el tamaño normalizado, indicá la cantidad y obtené un
                despiece auditable para tu compra, fabricación o licitación.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-700 text-sm">
              <div className="bg-slate-900 px-5 py-4">
                <span className="block text-xs uppercase tracking-wider text-slate-500">
                  Ítems de lista
                </span>
                <strong className="mt-1 block text-xl">
                  {lista.items.length}
                </strong>
              </div>
              <div className="bg-slate-900 px-5 py-4">
                <span className="block text-xs uppercase tracking-wider text-slate-500">
                  Despiece
                </span>
                <strong className="mt-1 block text-xl">
                  {conjunto.piezas.reduce(
                    (total, pieza) => total + pieza.cantidad,
                    0,
                  )}{" "}
                  un.
                </strong>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-6 sm:py-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:px-8">
        <section className="min-w-0 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-lime-400">
                01
              </span>
              <div>
                <h2 className="text-xl font-black tracking-tight">
                  Elegí el conjunto
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  El nivel es orientativo. Para especificaciones técnicas,
                  seleccioná por estatura.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {CONJUNTOS_COTIZABLES.map((item) => {
                const activo = item.id === conjuntoId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={activo}
                    onClick={() => setConjuntoId(item.id)}
                    className={`relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                      activo
                        ? "border-slate-950 bg-slate-950 text-white shadow-lg"
                        : "border-slate-200 bg-white hover:border-slate-400"
                    }`}
                  >
                    <span
                      className="absolute inset-y-0 left-0 w-1.5"
                      style={{ backgroundColor: item.color_hex }}
                    />
                    <span className="block text-base font-black">
                      {item.nombre}
                    </span>
                    <span
                      className={`mt-1 block text-xs font-semibold ${
                        activo ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {etiquetaRango(
                        item.estatura_desde_cm,
                        item.estatura_hasta_cm,
                      )}
                    </span>
                    <span
                      className={`mt-3 block text-xs ${
                        activo ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {item.uso_referencial}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-start gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-lime-400">
                02
              </span>
              <div>
                <h2 className="text-xl font-black tracking-tight">
                  Definí la operación
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Cantidad, moneda y condiciones que quedarán congeladas al
                  enviar.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2">
              <label className="block min-w-0">
                <span className="mb-2 block text-sm font-bold">
                  Cantidad de conjuntos
                </span>
                <div className="flex h-14 overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:border-slate-950 focus-within:ring-2 focus-within:ring-lime-300">
                  <button
                    type="button"
                    onClick={() => setCantidad((actual) => Math.max(0, actual - 1))}
                    className="w-12 text-xl font-bold text-slate-500 hover:bg-slate-100"
                    aria-label="Restar un conjunto"
                  >
                    −
                  </button>
                  <input
                    inputMode="numeric"
                    min="0"
                    max={MAX_CONJUNTOS}
                    value={cantidad || ""}
                    onChange={(event) =>
                      setCantidad(limitarEntero(event.target.value))
                    }
                    placeholder="0"
                    className="min-w-0 flex-1 border-x border-slate-200 text-center text-xl font-black outline-none"
                    aria-label="Cantidad de conjuntos"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setCantidad((actual) =>
                        Math.min(MAX_CONJUNTOS, actual + 1),
                      )
                    }
                    className="w-12 text-xl font-bold text-slate-500 hover:bg-slate-100"
                    aria-label="Sumar un conjunto"
                  >
                    +
                  </button>
                </div>
              </label>

              <fieldset className="min-w-0">
                <legend className="mb-2 text-sm font-bold">Moneda</legend>
                <div className="grid h-14 grid-cols-3 rounded-xl bg-slate-100 p-1">
                  {(["PYG", "BRL", "USD"] as const).map((codigo) => (
                    <button
                      key={codigo}
                      type="button"
                      onClick={() => setMoneda(codigo)}
                      className={`rounded-lg text-sm font-black transition ${
                        moneda === codigo
                          ? "bg-white text-slate-950 shadow-sm"
                          : "text-slate-500 hover:text-slate-950"
                      }`}
                    >
                      {codigo}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            {moneda !== "BRL" && (
              <label className="mt-5 block rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <span className="flex items-center justify-between gap-3">
                  <span>
                    <span className="block text-sm font-bold">
                      Tipo de cambio de trabajo
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      1 BRL en guaraníes. Queda registrado en el mensaje.
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="decimal"
                      min="1"
                      value={tcPyg}
                      onChange={(event) =>
                        setTcPyg(Math.max(1, Number(event.target.value) || 1))
                      }
                      className="w-28 rounded-lg border border-slate-300 bg-white px-3 py-2 text-right font-black outline-none focus:border-slate-950 focus:ring-2 focus:ring-lime-300"
                      aria-label="Tipo de cambio BRL a PYG"
                    />
                    <span className="text-sm font-bold text-slate-500">PYG</span>
                  </span>
                </span>
                {moneda === "USD" && (
                  <span className="mt-3 block border-t border-slate-200 pt-3 text-xs font-semibold text-slate-600">
                    Cruce aplicado: 1 BRL ={" "}
                    {tipoCambio.toLocaleString("es-PY", {
                      maximumFractionDigits: 4,
                    })}{" "}
                    USD
                  </span>
                )}
              </label>
            )}

            <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  checked={pagoAnticipado}
                  onChange={(event) => setPagoAnticipado(event.target.checked)}
                  className="mt-0.5 h-5 w-5 accent-lime-500"
                />
                <span>
                  <span className="block text-sm font-bold">
                    Pago anticipado
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    Aplica el máximo de{" "}
                    {(
                      lista.condiciones.descuento_pago_anticipado_max * 100
                    ).toLocaleString("es-PY")}
                    % de la lista.
                  </span>
                </span>
              </label>

              {moneda === "PYG" && (
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4">
                  <input
                    type="checkbox"
                    checked={incluyeIva}
                    onChange={(event) => setIncluyeIva(event.target.checked)}
                    className="mt-0.5 h-5 w-5 accent-lime-500"
                  />
                  <span>
                    <span className="block text-sm font-bold">Incluir IVA</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      IVA paraguayo discriminado en el total.
                    </span>
                  </span>
                </label>
              )}
            </div>
          </div>

          <aside className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            <strong className="block font-black">Criterio dimensional</strong>
            Los tamaños CJA se asignan por estatura, no solamente por grado.
            Cuando una institución no cuenta con relevamiento antropométrico,
            el asesor comercial debe validar la combinación antes de emitir la
            oferta definitiva.
          </aside>
        </section>

        <aside className="min-w-0 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 text-white shadow-2xl lg:sticky lg:top-6">
          <div className="border-b border-slate-800 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-lime-400">
                  Resumen de costeo
                </span>
                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  {conjunto.nombre}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {formatearCantidad(cantidad)} conjuntos · {conjunto.color}
                </p>
              </div>
              <span
                className="mt-1 h-6 w-6 shrink-0 rounded-full ring-4 ring-white/10"
                style={{ backgroundColor: conjunto.color_hex }}
                aria-label={`Color ${conjunto.color}`}
              />
            </div>
          </div>

          <div className="max-h-[360px] overflow-y-auto border-b border-slate-800">
            {detalleVisible.map((linea) => (
              <div
                key={linea.codigo_oriplast}
                className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-slate-800/70 px-5 py-4 last:border-0 sm:px-6"
              >
                <div className="min-w-0">
                  <span className="block truncate text-sm font-bold text-slate-100">
                    {linea.funcion}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {linea.codigo_oriplast} · {linea.cantidad} por conjunto
                  </span>
                  <span className="mt-1 block text-xs text-slate-400">
                    {formatearCantidad(linea.cantidadTotal)} ×{" "}
                    {formatearMoneda(linea.precioUnitario, moneda)}
                  </span>
                </div>
                <strong className="text-right text-sm text-slate-200">
                  {formatearMoneda(linea.subtotal, moneda)}
                </strong>
              </div>
            ))}
          </div>

          <div className="space-y-3 p-5 sm:p-6">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Subtotal</span>
              <span>{formatearMoneda(subtotalVenta, moneda)}</span>
            </div>
            {descuentoVenta > 0 && (
              <div className="flex items-center justify-between text-sm text-lime-400">
                <span>Descuento anticipado</span>
                <span>−{formatearMoneda(descuentoVenta, moneda)}</span>
              </div>
            )}
            {cotizacion.iva_destino > 0 && (
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>IVA</span>
                <span>
                  {formatearMoneda(cotizacion.iva_destino, moneda)}
                </span>
              </div>
            )}

            <div className="border-t border-slate-700 pt-4">
              <div className="flex items-end justify-between gap-4">
                <span className="text-sm font-bold">Total estimado</span>
                <strong className="text-right text-3xl font-black tracking-tight text-lime-400">
                  {formatearMoneda(cotizacion.total_destino, moneda)}
                </strong>
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>Por conjunto</span>
                <span>
                  {formatearMoneda(
                    cotizacion.total_por_conjunto_destino,
                    moneda,
                  )}
                </span>
              </div>
            </div>

            {puedeEnviar ? (
              <a
                href={linkWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-lime-400 px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-white active:scale-[0.99]"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35ZM12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26A9.9 9.9 0 0 1 12.05 2c2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.88 9.89Z" />
                </svg>
                Enviar para validación
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="mt-5 min-h-14 w-full cursor-not-allowed rounded-xl bg-slate-800 px-5 py-3 text-sm font-black text-slate-500"
              >
                Ingresá una cantidad para continuar
              </button>
            )}

            <p className="pt-1 text-center text-[11px] leading-5 text-slate-500">
              Estimación sin compromiso. Disponibilidad, flete y plazo se
              confirman con {CONTACTO_COMERCIAL.razon_social}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px bg-slate-800 text-[11px] text-slate-500">
            <div className="bg-slate-900 px-5 py-3">
              <span className="block uppercase tracking-wider">Lista</span>
              <strong className="mt-1 block text-slate-300">{lista.id}</strong>
            </div>
            <div className="bg-slate-900 px-5 py-3">
              <span className="block uppercase tracking-wider">TC congelado</span>
              <strong className="mt-1 block text-slate-300">
                1 BRL ={" "}
                {tipoCambio.toLocaleString("es-PY", {
                  maximumFractionDigits: 4,
                })}{" "}
                {moneda}
              </strong>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
