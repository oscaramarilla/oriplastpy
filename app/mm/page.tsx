"use client";

import { useEffect, useMemo, useState } from "react";

type ColorKey =
  | "naranja"
  | "amarillo"
  | "rojo"
  | "verde"
  | "azul"
  | "gris";

type LevelKey = "CJA01" | "CJA03" | "CJA04" | "CJA06";

type ItemKey =
  | "tampo"
  | "portaLivros"
  | "asientoRespaldo"
  | "zapataMayor"
  | "zapataMenor"
  | "puntera"
  | "regaton";

type QtyState = Record<ItemKey, number>;
type PriceState = Record<ItemKey, number>;

const COLORS: Record<ColorKey, { label: string; hex: string }> = {
  naranja: { label: "Naranja", hex: "#f97316" },
  amarillo: { label: "Amarillo", hex: "#eab308" },
  rojo: { label: "Rojo", hex: "#ef4444" },
  verde: { label: "Verde", hex: "#22c55e" },
  azul: { label: "Azul", hex: "#3b82f6" },
  gris: { label: "Gris", hex: "#6b7280" },
};

const LEVELS: Record<
  LevelKey,
  {
    code: LevelKey;
    label: string;
    description: string;
    asientoUsd: number;
  }
> = {
  CJA01: {
    code: "CJA01",
    label: "Nivel Inicial",
    description: "Conjunto escolar CJA01",
    asientoUsd: 1.23,
  },
  CJA03: {
    code: "CJA03",
    label: "Primer Ciclo",
    description: "Conjunto escolar CJA03",
    asientoUsd: 2.05,
  },
  CJA04: {
    code: "CJA04",
    label: "Segundo Ciclo",
    description: "Conjunto escolar CJA04",
    asientoUsd: 2.18,
  },
  CJA06: {
    code: "CJA06",
    label: "Tercer Ciclo y Secundaria",
    description: "Conjunto escolar CJA06",
    asientoUsd: 2.21,
  },
};

const BACKREST_USD = 1.79;

const DISCOUNT_TIERS = [
  { minQty: 10, pct: 0.03 },
  { minQty: 25, pct: 0.05 },
  { minQty: 50, pct: 0.08 },
  { minQty: 100, pct: 0.12 },
  { minQty: 200, pct: 0.15 },
];

const ITEM_META: Array<{
  key: ItemKey;
  order: number;
  label: string;
  note: string;
}> = [
  {
    key: "tampo",
    order: 1,
    label: "Mesada de PP / Tampo",
    note: "1 unidad por mesa",
  },
  {
    key: "portaLivros",
    order: 2,
    label: "Porta Librero / Porta Livros",
    note: "1 unidad por mesa",
  },
  {
    key: "asientoRespaldo",
    order: 3,
    label: "Asiento + Respaldo",
    note: "1 unidad por silla",
  },
  {
    key: "zapataMayor",
    order: 4,
    label: "Zapata Mayor / Sapata Maior",
    note: "2 unidades por mesa",
  },
  {
    key: "zapataMenor",
    order: 5,
    label: "Zapata Menor / Sapata Menor",
    note: "2 unidades por mesa",
  },
  {
    key: "puntera",
    order: 6,
    label: "Puntera / Ponteira",
    note: "2 unidades por mesa",
  },
  {
    key: "regaton",
    order: 7,
    label: "Regatón / Pino e Bucha da Cadeira",
    note: "4 unidades por silla",
  },
];

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function clampInt(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
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

function getDiscountPct(baseQty: number) {
  let pct = 0;
  for (const tier of DISCOUNT_TIERS) {
    if (baseQty >= tier.minQty) pct = tier.pct;
  }
  return pct;
}

function makeDefaultQtys(mesas: number, sillas: number): QtyState {
  return {
    tampo: clampInt(mesas),
    portaLivros: clampInt(mesas),
    asientoRespaldo: clampInt(sillas),
    zapataMayor: clampInt(mesas * 2),
    zapataMenor: clampInt(mesas * 2),
    puntera: clampInt(mesas * 2),
    regaton: clampInt(sillas * 4),
  };
}

function makeDefaultPrices(level: LevelKey): PriceState {
  return {
    tampo: 10.93,
    portaLivros: 1.31,
    asientoRespaldo: round2(LEVELS[level].asientoUsd + BACKREST_USD),
    zapataMayor: 0.33,
    zapataMenor: 0.18,
    puntera: 0.07,
    regaton: 0.05,
  };
}

export default function OriplastMMCalculator() {
  const [selectedColor, setSelectedColor] = useState<ColorKey>("naranja");
  const [selectedLevel, setSelectedLevel] = useState<LevelKey>("CJA01");

  const [mesas, setMesas] = useState<number>(10);
  const [sillas, setSillas] = useState<number>(10);

  const [usdToPyg, setUsdToPyg] = useState<number>(6475);
  const [usdToBrl, setUsdToBrl] = useState<number>(5.0);
  const [ivaPct, setIvaPct] = useState<number>(10);
  const [includeIva, setIncludeIva] = useState<boolean>(true);

  const [quantities, setQuantities] = useState<QtyState>(() =>
    makeDefaultQtys(10, 10)
  );

  const [unitPrices, setUnitPrices] = useState<PriceState>(() =>
    makeDefaultPrices("CJA01")
  );

  useEffect(() => {
    setQuantities(makeDefaultQtys(mesas, sillas));
  }, [mesas, sillas]);

  useEffect(() => {
    setUnitPrices((prev) => ({
      ...prev,
      asientoRespaldo: round2(LEVELS[selectedLevel].asientoUsd + BACKREST_USD),
    }));
  }, [selectedLevel]);

  const lines = useMemo(() => {
    return ITEM_META.map((item) => {
      const qty = quantities[item.key];
      const unitUsd = unitPrices[item.key];
      const subtotalUsd = round2(qty * unitUsd);

      return {
        ...item,
        qty,
        unitUsd,
        subtotalUsd,
      };
    });
  }, [quantities, unitPrices]);

  const volumeBase = Math.max(mesas, sillas);

  const totals = useMemo(() => {
    const grossUsd = round2(lines.reduce((acc, item) => acc + item.subtotalUsd, 0));
    const discountPct = getDiscountPct(volumeBase);
    const discountUsd = round2(grossUsd * discountPct);
    const subtotalUsd = round2(grossUsd - discountUsd);
    const ivaUsd = includeIva ? round2(subtotalUsd * (ivaPct / 100)) : 0;
    const totalUsd = round2(subtotalUsd + ivaUsd);

    return {
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
  }, [lines, volumeBase, includeIva, ivaPct, usdToPyg, usdToBrl]);

  const whatsappText = useMemo(() => {
    const lineText = lines
      .map(
        (item) =>
          `${item.order}. ${item.label} | Cantidad: ${item.qty} | Unit: ${formatUsd(
            item.unitUsd
          )} | Subtotal: ${formatUsd(item.subtotalUsd)}`
      )
      .join("\n");

    const text = `Hola OriplastPy, quiero cotizar este despiece:

Color: ${COLORS[selectedColor].label}
Nivel: ${LEVELS[selectedLevel].code} - ${LEVELS[selectedLevel].label}
Mesas: ${mesas}
Sillas: ${sillas}

Desglose:
${lineText}

Resumen:
Bruto USD: ${formatUsd(totals.grossUsd)}
Descuento: ${(totals.discountPct * 100).toFixed(0)}%
Subtotal USD: ${formatUsd(totals.subtotalUsd)}
IVA: ${includeIva ? `${ivaPct}%` : "No aplicado"}
Total USD: ${formatUsd(totals.totalUsd)}
Total BRL: ${formatBrl(totals.totalBrl)}
Total PYG: ${formatPyg(totals.totalPyg)}

Favor confirmar disponibilidad, stock y plazo para Paraguay.`;

    return encodeURIComponent(text);
  }, [
    lines,
    selectedColor,
    selectedLevel,
    mesas,
    sillas,
    totals,
    includeIva,
    ivaPct,
  ]);

  function updateQty(itemKey: ItemKey, value: number) {
    setQuantities((prev) => ({
      ...prev,
      [itemKey]: clampInt(value),
    }));
  }

  function updatePrice(itemKey: ItemKey, value: number) {
    setUnitPrices((prev) => ({
      ...prev,
      [itemKey]: Number.isFinite(value) ? Math.max(0, value) : 0,
    }));
  }

  function recalculateDefaults() {
    setQuantities(makeDefaultQtys(mesas, sillas));
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                OriplastPy · Cotizador desglosado
              </p>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Calculadora por color, nivel, mesas y sillas
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-zinc-600 md:text-base">
                El cliente elige color, nivel y cantidades base. El sistema
                precalcula los 7 ítems del despiece y luego permite editar cada
                cantidad manualmente.
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

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <p className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-500">
                Paso 1 · Elegir color
              </p>

              <div className="flex flex-wrap gap-3">
                {(Object.keys(COLORS) as ColorKey[]).map((color) => {
                  const active = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400"
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: COLORS[color].hex }}
                      />
                      {COLORS[color].label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <p className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-500">
                Paso 2 · Elegir nivel
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {(Object.keys(LEVELS) as LevelKey[]).map((levelKey) => {
                  const level = LEVELS[levelKey];
                  const active = selectedLevel === levelKey;

                  return (
                    <button
                      key={levelKey}
                      type="button"
                      onClick={() => setSelectedLevel(levelKey)}
                      className={`rounded-3xl border p-5 text-left transition ${
                        active
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400"
                      }`}
                    >
                      <p
                        className={`text-xs font-semibold uppercase tracking-wide ${
                          active ? "text-zinc-300" : "text-zinc-500"
                        }`}
                      >
                        {level.code}
                      </p>
                      <h2 className="mt-1 text-lg font-bold">{level.label}</h2>
                      <p
                        className={`mt-2 text-sm ${
                          active ? "text-zinc-300" : "text-zinc-600"
                        }`}
                      >
                        {level.description}
                      </p>
                      <p
                        className={`mt-3 text-sm font-semibold ${
                          active ? "text-zinc-100" : "text-zinc-800"
                        }`}
                      >
                        Asiento base: {formatUsd(level.asientoUsd)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <p className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-500">
                Paso 3 · Mesas y sillas
              </p>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-zinc-700">
                    ¿Cuántas mesas quiere?
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={mesas}
                    onChange={(e) => setMesas(clampInt(Number(e.target.value)))}
                    className="w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-zinc-700">
                    ¿Cuántas sillas quiere?
                  </span>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={sillas}
                    onChange={(e) => setSillas(clampInt(Number(e.target.value)))}
                    className="w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900"
                  />
                </label>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={recalculateDefaults}
                    className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
                  >
                    Recalcular cantidades base
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-4">
                <InfoChip label="Color" value={COLORS[selectedColor].label} />
                <InfoChip
                  label="Nivel"
                  value={`${LEVELS[selectedLevel].code} · ${LEVELS[selectedLevel].label}`}
                />
                <InfoChip label="Mesas" value={String(mesas)} />
                <InfoChip label="Sillas" value={String(sillas)} />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide text-zinc-500">
                    Despiece automático editable
                  </p>
                  <h2 className="mt-1 text-xl font-bold">
                    7 ítems en el orden comercial correcto
                  </h2>
                </div>
                <p className="text-sm text-zinc-600">
                  Si el cliente cambia cantidades base, puedes recalcular o
                  editar manualmente.
                </p>
              </div>

              <div className="mt-5 space-y-4">
                {lines.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="lg:min-w-[280px]">
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                          Ítem {item.order}
                        </p>
                        <h3 className="text-lg font-bold">{item.label}</h3>
                        <p className="mt-1 text-sm text-zinc-600">{item.note}</p>
                      </div>

                      <div className="grid flex-1 gap-3 md:grid-cols-3">
                        <label className="block">
                          <span className="mb-1 block text-sm font-medium text-zinc-700">
                            Cantidad
                          </span>
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={quantities[item.key]}
                            onChange={(e) =>
                              updateQty(item.key, Number(e.target.value))
                            }
                            className="w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-1 block text-sm font-medium text-zinc-700">
                            Precio unitario USD
                          </span>
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={unitPrices[item.key]}
                            onChange={(e) =>
                              updatePrice(item.key, Number(e.target.value))
                            }
                            className="w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900"
                          />
                        </label>

                        <div className="block">
                          <span className="mb-1 block text-sm font-medium text-zinc-700">
                            Subtotal
                          </span>
                          <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold">
                            {formatUsd(item.subtotalUsd)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
              <p className="mb-4 text-sm font-bold uppercase tracking-wide text-zinc-500">
                Parámetros comerciales
              </p>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <ParamInput
                  label="USD → PYG"
                  value={usdToPyg}
                  step={1}
                  onChange={setUsdToPyg}
                />
                <ParamInput
                  label="USD → BRL"
                  value={usdToBrl}
                  step={0.01}
                  onChange={setUsdToBrl}
                />
                <ParamInput
                  label="IVA (%)"
                  value={ivaPct}
                  step={1}
                  onChange={setIvaPct}
                />

                <div className="rounded-2xl border border-zinc-200 p-4">
                  <p className="mb-2 text-sm font-medium text-zinc-700">
                    Aplicar IVA
                  </p>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeIva}
                      onChange={(e) => setIncludeIva(e.target.checked)}
                      className="h-5 w-5 rounded border-zinc-300"
                    />
                    <span className="text-sm text-zinc-600">
                      {includeIva ? "Sí" : "No"}
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
                El precio de <strong>Asiento + Respaldo</strong> se ajusta
                automáticamente según el nivel elegido. Los demás valores quedan
                editables para que manejes tu lista comercial real.
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 xl:sticky xl:top-6">
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

            <div className="mt-5 space-y-3">
              <SummaryRow
                label="Bruto"
                value={`${formatUsd(totals.grossUsd)} · ${formatPyg(
                  totals.grossPyg
                )}`}
              />
              <SummaryRow
                label={`Descuento volumen (${(totals.discountPct * 100).toFixed(
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
                Descuento por volumen
              </h3>
              <div className="space-y-2">
                {DISCOUNT_TIERS.map((tier) => (
                  <div
                    key={tier.minQty}
                    className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 text-sm"
                  >
                    <span>Desde {tier.minQty} mesas/sillas base</span>
                    <span className="font-bold">
                      {(tier.pct * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-500">
                Estado actual
              </h3>
              <div className="space-y-3">
                <MiniInfo
                  label="Color"
                  value={COLORS[selectedColor].label}
                  dotColor={COLORS[selectedColor].hex}
                />
                <MiniInfo
                  label="Nivel"
                  value={`${LEVELS[selectedLevel].code} - ${LEVELS[selectedLevel].label}`}
                />
                <MiniInfo label="Mesas" value={String(mesas)} />
                <MiniInfo label="Sillas" value={String(sillas)} />
                <MiniInfo
                  label="Base descuento"
                  value={`${volumeBase} unidades`}
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-500">
                Subtotales por ítem
              </h3>
              <div className="space-y-3">
                {lines.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-2xl border border-zinc-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                          Ítem {item.order}
                        </p>
                        <p className="font-semibold">{item.label}</p>
                        <p className="mt-1 text-sm text-zinc-600">
                          Cantidad: {item.qty}
                        </p>
                      </div>
                      <p className="font-bold">{formatUsd(item.subtotalUsd)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function ParamInput({
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
    <label className="block rounded-2xl border border-zinc-200 p-4">
      <span className="mb-2 block text-sm font-medium text-zinc-700">
        {label}
      </span>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-2xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900"
      />
    </label>
  );
}

function InfoChip({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-zinc-100 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-zinc-900">{value}</p>
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
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-zinc-50 px-4 py-3 text-sm">
      <span className="text-zinc-600">{label}</span>
      <span className="text-right font-semibold text-zinc-900">{value}</span>
    </div>
  );
}

function MiniInfo({
  label,
  value,
  dotColor,
}: {
  label: string;
  value: string;
  dotColor?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-zinc-50 px-4 py-3 text-sm">
      <div className="flex items-center gap-2">
        {dotColor ? (
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
        ) : null}
        <span className="text-zinc-600">{label}</span>
      </div>
      <span className="text-right font-semibold text-zinc-900">{value}</span>
    </div>
  );
}
