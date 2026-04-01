"use client";

import { useMemo, useState } from "react";

type ColorKey =
  | "naranja"
  | "amarillo"
  | "rojo"
  | "verde"
  | "azul"
  | "gris";

type ProductKind = "set" | "piece";

type Product = {
  sku: string;
  name: string;
  kind: ProductKind;
  priceUsd: number;
  fixedColor?: ColorKey;
  selectableColors?: ColorKey[];
};

type CartItem = {
  qty: number;
  color?: ColorKey;
};

const COLORS: Record<
  ColorKey,
  { label: string; hex: string; textClass: string; bgSoft: string }
> = {
  naranja: {
    label: "Naranja",
    hex: "#f97316",
    textClass: "text-orange-600",
    bgSoft: "bg-orange-100",
  },
  amarillo: {
    label: "Amarillo",
    hex: "#eab308",
    textClass: "text-yellow-600",
    bgSoft: "bg-yellow-100",
  },
  rojo: {
    label: "Rojo",
    hex: "#ef4444",
    textClass: "text-red-600",
    bgSoft: "bg-red-100",
  },
  verde: {
    label: "Verde",
    hex: "#22c55e",
    textClass: "text-green-600",
    bgSoft: "bg-green-100",
  },
  azul: {
    label: "Azul",
    hex: "#3b82f6",
    textClass: "text-blue-600",
    bgSoft: "bg-blue-100",
  },
  gris: {
    label: "Gris",
    hex: "#6b7280",
    textClass: "text-gray-600",
    bgSoft: "bg-gray-100",
  },
};

const GENERIC_COLORS: ColorKey[] = [
  "naranja",
  "amarillo",
  "rojo",
  "verde",
  "azul",
  "gris",
];

const PRODUCTS: Product[] = [
  // Conjuntos completos
  {
    sku: "CJA01",
    name: "Conjunto Completo CJA01 Maternal",
    kind: "set",
    priceUsd: 14.75,
    fixedColor: "naranja",
  },
  {
    sku: "CJA03",
    name: "Conjunto Completo CJA03 Infantil",
    kind: "set",
    priceUsd: 17.44,
    fixedColor: "amarillo",
  },
  {
    sku: "CJA04",
    name: "Conjunto Completo CJA04 Juvenil",
    kind: "set",
    priceUsd: 17.57,
    fixedColor: "rojo",
  },
  {
    sku: "CJA06",
    name: "Conjunto Completo CJA06 Adulto",
    kind: "set",
    priceUsd: 17.6,
    fixedColor: "azul",
  },

  // Piezas sueltas
  {
    sku: "ASIENTO-06",
    name: "Asiento 06",
    kind: "piece",
    priceUsd: 2.21,
    selectableColors: GENERIC_COLORS,
  },
  {
    sku: "ASIENTO-04",
    name: "Asiento 04",
    kind: "piece",
    priceUsd: 2.18,
    selectableColors: GENERIC_COLORS,
  },
  {
    sku: "ASIENTO-03",
    name: "Asiento 03",
    kind: "piece",
    priceUsd: 2.05,
    selectableColors: GENERIC_COLORS,
  },
  {
    sku: "ASIENTO-01",
    name: "Asiento 01",
    kind: "piece",
    priceUsd: 1.23,
    selectableColors: GENERIC_COLORS,
  },
  {
    sku: "PORTA-LIVROS",
    name: "Porta Livros",
    kind: "piece",
    priceUsd: 1.31,
    selectableColors: GENERIC_COLORS,
  },
  {
    sku: "ENCOSTO",
    name: "Encosto",
    kind: "piece",
    priceUsd: 1.79,
    selectableColors: GENERIC_COLORS,
  },
  {
    sku: "PONTEIRA-A",
    name: "Ponteira A",
    kind: "piece",
    priceUsd: 0.07,
    selectableColors: GENERIC_COLORS,
  },
  {
    sku: "PONTEIRA-B",
    name: "Ponteira B",
    kind: "piece",
    priceUsd: 0.05,
    selectableColors: GENERIC_COLORS,
  },
  {
    sku: "SAPATA-A",
    name: "Sapata A",
    kind: "piece",
    priceUsd: 0.33,
    selectableColors: GENERIC_COLORS,
  },
  {
    sku: "SAPATA-B",
    name: "Sapata B",
    kind: "piece",
    priceUsd: 0.18,
    selectableColors: GENERIC_COLORS,
  },
  {
    sku: "TAMPO-TRAVESSA",
    name: "Tampo con Travessa",
    kind: "piece",
    priceUsd: 10.93,
    selectableColors: GENERIC_COLORS,
  },
];

// Tramos ejemplo. Ajusta esto a tu política comercial real.
// En este ejemplo el descuento se calcula sobre TOTAL DE UNIDADES del carrito.
const DISCOUNT_TIERS = [
  { minQty: 10, pct: 0.03 },
  { minQty: 25, pct: 0.05 },
  { minQty: 50, pct: 0.08 },
  { minQty: 100, pct: 0.12 },
  { minQty: 200, pct: 0.15 },
];

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function getDiscountPct(totalUnits: number) {
  let pct = 0;
  for (const tier of DISCOUNT_TIERS) {
    if (totalUnits >= tier.minQty) pct = tier.pct;
  }
  return pct;
}

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatBrl(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatPyg(value: number) {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function OriplastQuoteBuilder() {
  const [usdToPyg, setUsdToPyg] = useState<number>(6475);
  const [usdToBrl, setUsdToBrl] = useState<number>(5.0);
  const [ivaPct, setIvaPct] = useState<number>(10);
  const [includeIva, setIncludeIva] = useState<boolean>(true);

  const [cart, setCart] = useState<Record<string, CartItem>>(() => {
    const initial: Record<string, CartItem> = {};
    for (const p of PRODUCTS) {
      initial[p.sku] = {
        qty: 0,
        color: p.fixedColor ?? p.selectableColors?.[0],
      };
    }
    return initial;
  });

  function updateQty(sku: string, qty: number) {
    setCart((prev) => ({
      ...prev,
      [sku]: {
        ...prev[sku],
        qty: Math.max(0, Math.floor(Number.isFinite(qty) ? qty : 0)),
      },
    }));
  }

  function updateColor(sku: string, color: ColorKey) {
    setCart((prev) => ({
      ...prev,
      [sku]: {
        ...prev[sku],
        color,
      },
    }));
  }

  const selectedLines = useMemo(() => {
    return PRODUCTS.map((product) => {
      const line = cart[product.sku];
      const qty = line?.qty ?? 0;
      const color = product.fixedColor ?? line?.color;
      const grossUsd = round2(product.priceUsd * qty);

      return {
        ...product,
        qty,
        color,
        grossUsd,
      };
    }).filter((line) => line.qty > 0);
  }, [cart]);

  const totals = useMemo(() => {
    const totalUnits = selectedLines.reduce((acc, item) => acc + item.qty, 0);
    const grossUsd = round2(
      selectedLines.reduce((acc, item) => acc + item.grossUsd, 0)
    );

    const discountPct = getDiscountPct(totalUnits);
    const discountUsd = round2(grossUsd * discountPct);
    const subtotalUsd = round2(grossUsd - discountUsd);
    const ivaUsd = includeIva ? round2(subtotalUsd * (ivaPct / 100)) : 0;
    const totalUsd = round2(subtotalUsd + ivaUsd);

    return {
      totalUnits,
      grossUsd,
      discountPct,
      discountUsd,
      subtotalUsd,
      ivaUsd,
      totalUsd,
      grossBrl: round2(grossUsd * usdToBrl),
      discountBrl: round2(discountUsd * usdToBrl),
      subtotalBrl: round2(subtotalUsd * usdToBrl),
      ivaBrl: round2(ivaUsd * usdToBrl),
      totalBrl: round2(totalUsd * usdToBrl),
      grossPyg: Math.round(grossUsd * usdToPyg),
      discountPyg: Math.round(discountUsd * usdToPyg),
      subtotalPyg: Math.round(subtotalUsd * usdToPyg),
      ivaPyg: Math.round(ivaUsd * usdToPyg),
      totalPyg: Math.round(totalUsd * usdToPyg),
    };
  }, [selectedLines, includeIva, ivaPct, usdToPyg, usdToBrl]);

  const whatsappText = useMemo(() => {
    if (selectedLines.length === 0) {
      return encodeURIComponent(
        "Hola OriplastPy, quiero cotizar piezas plásticas inyectadas para Paraguay."
      );
    }

    const lines = selectedLines
      .map((item) => {
        const colorText = item.color
          ? ` | Color: ${COLORS[item.color].label}`
          : "";
        return `- ${item.name} (${item.sku}) x ${item.qty}${colorText} = ${formatUsd(
          item.grossUsd
        )}`;
      })
      .join("\n");

    const text = `Hola OriplastPy, solicito esta cotización:

${lines}

Resumen:
- Unidades totales: ${totals.totalUnits}
- Bruto: ${formatUsd(totals.grossUsd)}
- Descuento: ${(totals.discountPct * 100).toFixed(0)}%
- Subtotal: ${formatUsd(totals.subtotalUsd)}
- IVA: ${includeIva ? `${ivaPct}%` : "No aplicado"}
- Total USD: ${formatUsd(totals.totalUsd)}
- Total BRL: ${formatBrl(totals.totalBrl)}
- Total PYG: ${formatPyg(totals.totalPyg)}

Tipo de cambio:
1 USD = ${formatPyg(usdToPyg)}
1 USD = ${formatBrl(usdToBrl)}

Favor confirmar disponibilidad y plazo de entrega para Paraguay.`;

    return encodeURIComponent(text);
  }, [selectedLines, totals, includeIva, ivaPct, usdToPyg, usdToBrl]);

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                Representación exclusiva Paraguay
              </p>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Cotizador B2B · OriplastPy
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-zinc-600 md:text-base">
                Piezas plásticas inyectadas con lógica comercial real: precio
                base en USD, descuento automático por volumen, IVA configurable
                y total destacado en guaraníes.
              </p>
            </div>

            <a
              href={`https://wa.me/595982451828?text=${whatsappText}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
            >
              Enviar cotización por WhatsApp
            </a>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ConfigCard
            label="Tipo de cambio USD → PYG"
            value={usdToPyg}
            step={1}
            onChange={setUsdToPyg}
          />
          <ConfigCard
            label="Tipo de cambio USD → BRL"
            value={usdToBrl}
            step={0.01}
            onChange={setUsdToBrl}
          />
          <ConfigCard
            label="IVA (%)"
            value={ivaPct}
            step={1}
            onChange={setIvaPct}
          />

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
            <p className="text-sm font-semibold text-zinc-700">Aplicar IVA</p>
            <label className="mt-4 flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={includeIva}
                onChange={(e) => setIncludeIva(e.target.checked)}
                className="h-5 w-5 rounded border-zinc-300"
              />
              <span className="text-sm text-zinc-600">
                {includeIva ? "Sí, incluir IVA en el total" : "No incluir IVA"}
              </span>
            </label>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.4fr_0.9fr]">
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold">Productos</h2>
              <p className="text-sm text-zinc-600">
                Los conjuntos tienen color fijo por modelo. Las piezas sueltas
                permiten selección entre 6 colores.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {PRODUCTS.map((product) => {
                const current = cart[product.sku];
                const currentColor = product.fixedColor ?? current?.color;

                return (
                  <article
                    key={product.sku}
                    className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-zinc-200"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                          {product.sku}
                        </p>
                        <h3 className="text-lg font-bold leading-tight">
                          {product.name}
                        </h3>
                      </div>

                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                        {product.kind === "set"
                          ? "Conjunto"
                          : "Pieza suelta"}
                      </span>
                    </div>

                    <p className="mb-4 text-2xl font-bold">{formatUsd(product.priceUsd)}</p>

                    {product.fixedColor ? (
                      <div className="mb-4 rounded-2xl border border-zinc-200 p-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                          Color fijo
                        </p>
                        <div className="flex items-center gap-3">
                          <span
                            className="h-5 w-5 rounded-full ring-2 ring-white"
                            style={{ backgroundColor: COLORS[product.fixedColor].hex }}
                          />
                          <span className="text-sm font-medium text-zinc-700">
                            {COLORS[product.fixedColor].label}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                          Selección de color
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {product.selectableColors?.map((color) => {
                            const isActive = currentColor === color;
                            return (
                              <button
                                key={color}
                                type="button"
                                onClick={() => updateColor(product.sku, color)}
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                                  isActive
                                    ? "border-zinc-900 bg-zinc-900 text-white"
                                    : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400"
                                }`}
                              >
                                <span
                                  className="h-3 w-3 rounded-full"
                                  style={{ backgroundColor: COLORS[color].hex }}
                                />
                                {COLORS[color].label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1 block text-sm font-medium text-zinc-700">
                          Cantidad
                        </span>
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={current?.qty ?? 0}
                          onChange={(e) =>
                            updateQty(product.sku, Number(e.target.value))
                          }
                          className="w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none ring-0 transition focus:border-zinc-900"
                        />
                      </label>

                      <div className="block">
                        <span className="mb-1 block text-sm font-medium text-zinc-700">
                          Total línea
                        </span>
                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold">
                          {formatUsd(round2(product.priceUsd * (current?.qty ?? 0)))}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <aside className="h-fit rounded-3xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 xl:sticky xl:top-6">
            <h2 className="text-xl font-bold">Resumen comercial</h2>

            <div className="mt-5 rounded-3xl bg-zinc-900 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                Total principal en guaraníes
              </p>
              <p className="mt-2 text-4xl font-extrabold tracking-tight">
                {formatPyg(totals.totalPyg)}
              </p>
              <div className="mt-3 grid gap-1 text-sm text-zinc-300">
                <p>Total USD: {formatUsd(totals.totalUsd)}</p>
                <p>Total BRL: {formatBrl(totals.totalBrl)}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <SummaryRow
                label="Unidades totales"
                value={String(totals.totalUnits)}
              />
              <SummaryRow
                label="Bruto"
                value={`${formatUsd(totals.grossUsd)} · ${formatPyg(
                  totals.grossPyg
                )}`}
              />
              <SummaryRow
                label={`Descuento automático (${(totals.discountPct * 100).toFixed(
                  0
                )}%)`}
                value={`-${formatUsd(totals.discountUsd)} · -${formatPyg(
                  totals.discountPyg
                )}`}
              />
              <SummaryRow
                label="Subtotal"
                value={`${formatUsd(totals.subtotalUsd)} · ${formatPyg(
                  totals.subtotalPyg
                )}`}
              />
              <SummaryRow
                label={includeIva ? `IVA (${ivaPct}%)` : "IVA"}
                value={
                  includeIva
                    ? `${formatUsd(totals.ivaUsd)} · ${formatPyg(totals.ivaPyg)}`
                    : "No aplicado"
                }
              />
            </div>

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-500">
                Tramos de descuento
              </h3>
              <div className="grid gap-2">
                {DISCOUNT_TIERS.map((tier) => (
                  <div
                    key={tier.minQty}
                    className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 text-sm"
                  >
                    <span>Desde {tier.minQty} unidades</span>
                    <span className="font-bold">
                      {(tier.pct * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-500">
                Ítems seleccionados
              </h3>

              {selectedLines.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 px-4 py-6 text-sm text-zinc-500">
                  Todavía no agregaste productos al carrito.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedLines.map((item) => (
                    <div
                      key={item.sku}
                      className="rounded-2xl border border-zinc-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            {item.sku}
                          </p>
                          <p className="font-semibold">{item.name}</p>
                          <p className="mt-1 text-sm text-zinc-600">
                            Cantidad: {item.qty}
                            {item.color ? ` · Color: ${COLORS[item.color].label}` : ""}
                          </p>
                        </div>
                        <p className="font-bold">{formatUsd(item.grossUsd)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function ConfigCard({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step: number;
}) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
      <p className="mb-2 text-sm font-semibold text-zinc-700">{label}</p>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900"
      />
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-zinc-50 px-4 py-3">
      <span className="text-zinc-600">{label}</span>
      <span className="text-right font-semibold text-zinc-900">{value}</span>
    </div>
  );
}
