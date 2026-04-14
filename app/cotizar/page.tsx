'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { validatePerfiladoB2B, type DatosPerfiladoB2B } from '@/lib/domain/perfilado-b2b';
import { generarMensajePerfilado, generateWhatsappLink } from '@/lib/services/whatsapp';
import { CATALOGO_B2B } from '@/lib/config/catalogo';

export default function CotizarPage() {
  const searchParams = useSearchParams();
  const productoParam = searchParams?.get('producto');
  const nombreParam = searchParams?.get('nombre');

  const [formData, setFormData] = useState<DatosPerfiladoB2B>({
    nombreCargo: '',
    empresa: '',
    rubro: 'metalurgica',
    volumenEstimado: '',
    productoInteres: nombreParam || undefined
  });

  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const validation = validatePerfiladoB2B(formData);

  // Pre-cargar producto si viene de URL
  useEffect(() => {
    if (nombreParam && !formData.productoInteres) {
      setFormData((prev) => ({
        ...prev,
        productoInteres: nombreParam
      }));
    }
  }, [nombreParam]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof DatosPerfiladoB2B
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleGenerarCotizacion = () => {
    setAttemptedSubmit(true);

    if (!validation.valid) {
      return;
    }

    // Generar mensaje y redirigir a WhatsApp
    const mensaje = generarMensajePerfilado(formData);
    const link = generateWhatsappLink(mensaje);
    window.open(link, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            Solicita tu Cotización B2B
          </h1>
          <p className="text-lg text-gray-600">
            Completa estos datos y nos contactaremos en WhatsApp con tu presupuesto mayorista.
          </p>
          {formData.productoInteres && (
            <div className="mt-6 inline-block bg-lime-50/50 border border-lime-100/50 rounded-2xl px-4 py-3">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Producto seleccionado:</span> {formData.productoInteres}
              </p>
            </div>
          )}
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
          <div className="space-y-6">
            {/* Nombre/Cargo */}
            <div>
              <label htmlFor="nombreCargo" className="block text-sm font-semibold text-gray-900 mb-2">
                Nombre y Cargo <span className="text-red-600">*</span>
              </label>
              <input
                id="nombreCargo"
                type="text"
                placeholder="ej: Juan Pérez, Gerente de Compras"
                value={formData.nombreCargo}
                onChange={(e) => handleChange(e, 'nombreCargo')}
                className={`w-full px-4 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all text-lg ${
                  attemptedSubmit && validation.errors.nombreCargo
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-white'
                }`}
              />
              {attemptedSubmit && validation.errors.nombreCargo && (
                <p className="mt-2 text-sm text-red-600 font-semibold">{validation.errors.nombreCargo}</p>
              )}
            </div>

            {/* Empresa */}
            <div>
              <label htmlFor="empresa" className="block text-sm font-semibold text-gray-900 mb-2">
                Empresa <span className="text-red-600">*</span>
              </label>
              <input
                id="empresa"
                type="text"
                placeholder="ej: Metalúrgica San José"
                value={formData.empresa}
                onChange={(e) => handleChange(e, 'empresa')}
                className={`w-full px-4 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all text-lg ${
                  attemptedSubmit && validation.errors.empresa
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-white'
                }`}
              />
              {attemptedSubmit && validation.errors.empresa && (
                <p className="mt-2 text-sm text-red-600 font-semibold">{validation.errors.empresa}</p>
              )}
            </div>

            {/* Rubro */}
            <div>
              <label htmlFor="rubro" className="block text-sm font-semibold text-gray-900 mb-2">
                Rubro <span className="text-red-600">*</span>
              </label>
              <select
                id="rubro"
                value={formData.rubro}
                onChange={(e) => handleChange(e, 'rubro')}
                className={`w-full px-4 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all text-lg appearance-none bg-white ${
                  attemptedSubmit && validation.errors.rubro
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '16px 12px',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="metalurgica">Metalúrgica</option>
                <option value="muebleria">Mueblería</option>
                <option value="licitacion-mec">Licitación MEC</option>
                <option value="otro">Otro</option>
              </select>
              {attemptedSubmit && validation.errors.rubro && (
                <p className="mt-2 text-sm text-red-600 font-semibold">{validation.errors.rubro}</p>
              )}
            </div>

            {/* Volumen Estimado */}
            <div>
              <label htmlFor="volumenEstimado" className="block text-sm font-semibold text-gray-900 mb-2">
                Volumen Estimado <span className="text-red-600">*</span>
              </label>
              <input
                id="volumenEstimado"
                type="text"
                placeholder="ej: 500 unidades, 1000 asientos, etc"
                value={formData.volumenEstimado}
                onChange={(e) => handleChange(e, 'volumenEstimado')}
                className={`w-full px-4 py-4 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all text-lg ${
                  attemptedSubmit && validation.errors.volumenEstimado
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-white'
                }`}
              />
              {attemptedSubmit && validation.errors.volumenEstimado && (
                <p className="mt-2 text-sm text-red-600 font-semibold">{validation.errors.volumenEstimado}</p>
              )}
            </div>

            {/* Producto de interés (optional visual selection) */}
            {!formData.productoInteres && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Producto de Interés (Opcional)
                </label>
                <select
                  value={formData.productoInteres || ''}
                  onChange={(e) => setFormData((prev) => ({
                    ...prev,
                    productoInteres: e.target.value || undefined
                  }))}
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all text-lg appearance-none bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '16px 12px',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="">Selecciona un producto (opcional)</option>
                  {CATALOGO_B2B.map((producto) => (
                    <option key={producto.id} value={producto.nombre}>
                      {producto.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* CTA Principal */}
          <div className="mt-10">
            <button
              onClick={handleGenerarCotizacion}
              className="w-full bg-lime-500 text-slate-950 font-bold py-5 rounded-2xl shadow-[0_0_20px_rgba(132,204,22,0.2)] hover:bg-lime-600 active:scale-95 transition-all duration-200 text-xl"
            >
              Generar Cotización por WhatsApp
            </button>
            <p className="text-xs text-gray-500 text-center mt-4">
              Al hacer clic, se abrirá WhatsApp con tu mensaje preformateado.
            </p>
          </div>

          {/* Validación visual */}
          {attemptedSubmit && !validation.valid && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-sm text-red-700 font-semibold">
                ⚠️ Por favor completa todos los campos requeridos (marcados con *)
              </p>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-2">
            ¿Preguntas sobre nuestros productos?
          </p>
          <a
            href="/solicitar-muestra"
            className="text-lime-600 font-semibold hover:text-lime-700 transition-colors"
          >
            Solicita una muestra física →
          </a>
        </div>
      </div>
    </div>
  );
}
