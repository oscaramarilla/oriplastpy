"use client";

import { useMemo, useState } from "react";
import {
  PRODUCT_CATALOG,
  PRODUCT_CATEGORIES,
} from "@/lib/config/solicitud-muestra";
import {
  buildSolicitudSummary,
  validateSolicitud,
  type SolicitudMuestra,
} from "@/lib/domain/solicitud-muestra";
import { buildWhatsappMessage, generateWhatsappLink } from "@/lib/services/whatsapp";

const initialProductQuantities = PRODUCT_CATALOG.reduce<Record<string, number>>(
  (acc, item) => ({
    ...acc,
    [item.id]: 0,
  }),
  {}
);

export default function SolicitudMuestraPage() {
  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>(initialProductQuantities);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const selectedProducts = useMemo(
    () =>
      PRODUCT_CATALOG.filter((item) => productQuantities[item.id] > 0).map((item) => ({
        id: item.id,
        quantity: productQuantities[item.id],
      })),
    [productQuantities]
  );

  const formData: Partial<SolicitudMuestra> = {
    nombre,
    empresa,
    email,
    telefono,
    departamento,
    productos: selectedProducts,
  };

  const validation = validateSolicitud(formData);
  const canSubmit = validation.valid;

  const message = useMemo(() => {
    if (!canSubmit) return "";

    const fullData: SolicitudMuestra = {
      nombre,
      empresa,
      email,
      telefono,
      departamento,
      productos: selectedProducts,
    };

    return buildWhatsappMessage(fullData, PRODUCT_CATALOG);
  }, [canSubmit, departamento, email, empresa, nombre, selectedProducts, telefono]);

  const summaryText = useMemo(() => {
    if (!showSummary || !canSubmit) return "";

    const fullData: SolicitudMuestra = {
      nombre,
      empresa,
      email,
      telefono,
      departamento,
      productos: selectedProducts,
    };

    return buildSolicitudSummary(fullData, PRODUCT_CATALOG);
  }, [canSubmit, departamento, email, empresa, nombre, selectedProducts, showSummary]);

  const handleQuantityChange = (id: string, value: number) => {
    setProductQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.floor(value)),
    }));
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setProductQuantities((prev) => ({
      ...prev,
      [id]: checked ? Math.max(1, prev[id] || 1) : 0,
    }));
  };

  const handleSendWhatsapp = () => {
    setAttemptedSubmit(true);
    setShowSummary(true);

    if (!canSubmit) return;

    const link = generateWhatsappLink(message);
    window.open(link, "_blank");
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-zinc-200">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Solicitud de muestra física</h1>
          <p className="mt-3 text-sm text-zinc-600">
            Completa los datos de tu empresa, selecciona los productos y envía la solicitud por WhatsApp al equipo comercial.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          <section className="space-y-6">
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-zinc-200">
              <h2 className="text-xl font-semibold text-zinc-900">Datos de contacto</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-zinc-700">Nombre</span>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    placeholder="Ej: María Pérez"
                  />
                  {attemptedSubmit && validation.errors.nombre ? (
                    <p className="text-sm text-red-600">{validation.errors.nombre}</p>
                  ) : null}
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-zinc-700">Empresa</span>
                  <input
                    type="text"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    placeholder="Ej: Colegio Nacional"
                  />
                  {attemptedSubmit && validation.errors.empresa ? (
                    <p className="text-sm text-red-600">{validation.errors.empresa}</p>
                  ) : null}
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-zinc-700">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    placeholder="Ej: contacto@colegio.com"
                  />
                  {attemptedSubmit && validation.errors.email ? (
                    <p className="text-sm text-red-600">{validation.errors.email}</p>
                  ) : null}
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-zinc-700">Teléfono</span>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    placeholder="Ej: +595 981 000 000"
                  />
                  {attemptedSubmit && validation.errors.telefono ? (
                    <p className="text-sm text-red-600">{validation.errors.telefono}</p>
                  ) : null}
                </label>

                <label className="sm:col-span-2 space-y-2">
                  <span className="text-sm font-medium text-zinc-700">Departamento</span>
                  <input
                    type="text"
                    value={departamento}
                    onChange={(e) => setDepartamento(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    placeholder="Ej: Central"
                  />
                  {attemptedSubmit && validation.errors.departamento ? (
                    <p className="text-sm text-red-600">{validation.errors.departamento}</p>
                  ) : null}
                </label>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-zinc-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-zinc-900">Productos solicitados</h2>
                <p className="text-sm text-zinc-500">Selecciona uno o varios y agrega cantidad.</p>
              </div>

              <div className="mt-6 space-y-6">
                {PRODUCT_CATEGORIES.map((category) => (
                  <div key={category} className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-600">{category}</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {PRODUCT_CATALOG.filter((item) => item.category === category).map((item) => {
                        const quantity = productQuantities[item.id] ?? 0;
                        return (
                          <label
                            key={item.id}
                            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition focus-within:border-green-500"
                          >
                            <div className="flex items-center justify-between gap-4">
                              <span className="font-semibold text-zinc-900">{item.label}</span>
                              <input
                                type="checkbox"
                                checked={quantity > 0}
                                onChange={(event) => handleCheckboxChange(item.id, event.target.checked)}
                                className="h-4 w-4 rounded border-zinc-300 text-green-600 focus:ring-green-500"
                              />
                            </div>
                            <div className="mt-4 flex items-center gap-3">
                              <span className="text-sm text-zinc-600">Cantidad</span>
                              <input
                                type="number"
                                min={0}
                                value={quantity}
                                onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                                className="w-24 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                                disabled={quantity === 0}
                              />
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {attemptedSubmit && validation.errors.productos ? (
                <p className="mt-4 text-sm text-red-600">{validation.errors.productos}</p>
              ) : null}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-zinc-200">
              <h2 className="text-xl font-semibold text-zinc-900">Resumen</h2>
              <p className="mt-2 text-sm text-zinc-600">El botón abre WhatsApp con la solicitud pre-formateada.</p>
              <div className="mt-6 space-y-4">
                <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                  <p className="text-sm text-zinc-700">Productos seleccionados:</p>
                  <ul className="mt-3 space-y-2 text-sm text-zinc-800">
                    {selectedProducts.length > 0 ? (
                      selectedProducts.map((product) => {
                        const item = PRODUCT_CATALOG.find((entry) => entry.id === product.id);
                        return (
                          <li key={product.id}>
                            {item?.label ?? product.id}: {product.quantity}
                          </li>
                        );
                      })
                    ) : (
                      <li className="text-zinc-500">No hay productos seleccionados.</li>
                    )}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleSendWhatsapp}
                  disabled={!canSubmit}
                  className={`inline-flex w-full items-center justify-center rounded-3xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition ${
                    canSubmit
                      ? "bg-green-600 hover:bg-green-700"
                      : "cursor-not-allowed bg-zinc-300 text-zinc-500"
                  }`}
                >
                  Enviar a WhatsApp
                </button>

                {attemptedSubmit && !canSubmit ? (
                  <p className="text-sm text-red-600">Corrige los campos obligatorios antes de enviar.</p>
                ) : null}
              </div>
            </div>

            {showSummary && canSubmit ? (
              <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-zinc-200">
                <h2 className="text-xl font-semibold text-zinc-900">Resumen de la solicitud</h2>
                <pre className="mt-4 whitespace-pre-wrap rounded-3xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-800">
                  {summaryText}
                </pre>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
}
