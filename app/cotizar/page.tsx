'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CATALOGO_B2B } from '@/lib/config/catalogo';
import { generarMensajePerfilado } from '@/lib/services/whatsapp';

// 1. Separamos el formulario en un sub-componente
function CotizacionForm() {
  const searchParams = useSearchParams();
  const productoUrl = searchParams.get('producto');

  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    rubro: 'Metalúrgica',
    volumen: '',
    producto: productoUrl || '',
  });

  const [error, setError] = useState('');

  // Sincronizar el producto si cambia la URL (opcional, pero buena práctica)
  useEffect(() => {
    if (productoUrl) {
      setFormData((prev) => ({ ...prev, producto: productoUrl }));
    }
  }, [productoUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Limpiar error al escribir
  };

  const handleCotizar = () => {
    if (!formData.empresa.trim() || !formData.volumen.trim()) {
      setError('Por favor, completa los campos de Empresa y Volumen estimado.');
      return;
    }

    // Mapeamos el estado local a la interfaz estricta que espera el servicio
    const payload = {
      nombreCargo: formData.nombre,
      empresa: formData.empresa,
      // Hacemos el "casting" estricto para calmar a TypeScript
      rubro: formData.rubro as "metalurgica" | "muebleria" | "licitacion-mec" | "otro",
      volumenEstimado: formData.volumen,
      productoInteres: formData.producto // <-- El ajuste clave que detectó tu agente
    };

    const mensaje = generarMensajePerfilado(payload);
    window.open(mensaje, '_blank');
  };

  return (
    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-white mb-6">Datos de Cotización Industrial</h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Nombre / Cargo</label>
          <input 
            type="text" 
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-colors"
            placeholder="Ej. Juan Pérez - Gerente de Compras" 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Empresa *</label>
          <input 
            type="text" 
            name="empresa"
            value={formData.empresa}
            onChange={handleChange}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-colors"
            placeholder="Nombre de la Metalúrgica o Fábrica" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Rubro</label>
            <select 
              name="rubro"
              value={formData.rubro}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400 transition-colors appearance-none"
            >
              <option value="Metalúrgica">Metalúrgica</option>
              <option value="Mueblería">Mueblería</option>
              <option value="Licitación MEC">Proveedor Licitación MEC</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Volumen Mensual *</label>
            <input 
              type="text" 
              name="volumen"
              value={formData.volumen}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-colors"
              placeholder="Ej. 500 unidades" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Producto de Interés</label>
          <select 
              name="producto"
              value={formData.producto}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400 transition-colors appearance-none"
            >
              <option value="">Seleccionar del catálogo general...</option>
              {CATALOGO_B2B.map(prod => (
                <option key={prod.id} value={prod.id}>{prod.nombre}</option>
              ))}
            </select>
        </div>

        <button 
          onClick={handleCotizar}
          className="w-full bg-lime-400 hover:bg-lime-300 text-black font-black py-4 mt-4 rounded-xl transition-all active:scale-95 shadow-[0_4px_20px_rgba(163,230,53,0.2)] uppercase tracking-tight"
        >
          Generar Cotización vía WhatsApp
        </button>
      </div>
    </div>
  );
}

// 2. El Componente Principal Exportado envuelve al formulario en Suspense
export default function CotizarPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6">
        {/* Aquí está la magia: Suspense maneja la carga asíncrona de los parámetros de URL */}
        <Suspense fallback={<div className="text-lime-400 font-bold animate-pulse">Cargando cotizador industrial...</div>}>
          <CotizacionForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
