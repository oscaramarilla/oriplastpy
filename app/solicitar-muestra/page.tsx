'use client';

import { Suspense, useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// BASE DE PRECIOS (Preparada para la Fase 3 - Precios internos automáticos)
const PRECIOS_BASE = {
  tampo: 0, // Ej: 45000
  zapataFrontal: 0,
  zapataPosterior: 0,
  puntera: 0,
  portaLibros: 0,
  asiento: 0,
  respaldo: 0,
  contera: 0
};

function CotizacionForm() {
  // Pasos 1, 2, 3 y 4: Datos principales y cantidades macro
  const [formData, setFormData] = useState({
    nombre: '',
    color: 'Gris (3er Ciclo / Media)',
    cantMesas: '',
    cantSillas: '',
  });

  // Paso 5: Lista desglosada (BOM - Bill of Materials)
  const [desglose, setDesglose] = useState({
    tampo: 0,
    zapataFrontal: 0,
    zapataPosterior: 0,
    puntera: 0,
    portaLibros: 0,
    asiento: 0,
    respaldo: 0,
    contera: 0,
  });

  const [error, setError] = useState('');

  // MOTOR AUTOMÁTICO: Calcula el desglose cuando cambian las mesas o sillas
  useEffect(() => {
    const mesas = parseInt(formData.cantMesas) || 0;
    const sillas = parseInt(formData.cantSillas) || 0;

    setDesglose({
      // Regla de 1 Mesa = 1 Tampo, 2 Zapata F, 2 Zapata P, 2 Puntera, 1 Porta Libros
      tampo: mesas * 1,
      zapataFrontal: mesas * 2,
      zapataPosterior: mesas * 2,
      puntera: mesas * 2,
      portaLibros: mesas * 1,
      // Regla de 1 Silla = 1 Asiento, 1 Respaldo, 4 Conteras
      asiento: sillas * 1,
      respaldo: sillas * 1,
      contera: sillas * 4,
    });
  }, [formData.cantMesas, formData.cantSillas]);

  const handleMainChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Permite al usuario editar la cantidad desglosada manualmente (ej: pedir repuestos extra)
  const handleDesgloseChange = (item: keyof typeof desglose, value: string) => {
    const numValue = parseInt(value) || 0;
    setDesglose((prev) => ({ ...prev, [item]: numValue }));
  };

  const generarMensajeWhatsApp = () => {
    if (!formData.nombre.trim()) {
      setError('Por favor, ingresa tu Nombre o Empresa.');
      return;
    }

    const totalPiezas = Object.values(desglose).reduce((a, b) => a + b, 0);
    if (totalPiezas === 0) {
      setError('Debes ingresar al menos 1 mesa o 1 silla para cotizar.');
      return;
    }

    // Aquí a futuro se multiplicará desglose.item * PRECIOS_BASE.item para el total

    const mensaje = `*SOLICITUD DE COTIZACIÓN INDUSTRIAL B2B* 🏭

*1. Datos del Cliente:* ${formData.nombre}
*2. Color Homologado:* ${formData.color}

*Cantidades Base Solicitadas:*
- Mesas a ensamblar: ${formData.cantMesas || 0}
- Sillas a ensamblar: ${formData.cantSillas || 0}

*📋 LISTA DESGLOSADA DE COMPONENTES PLÁSTICOS:*
_Componentes para Mesas:_
- Tampos / Mesadas: ${desglose.tampo}
- Zapatas Frontales: ${desglose.zapataFrontal}
- Zapatas Posteriores: ${desglose.zapataPosterior}
- Punteras p/ Travesaño: ${desglose.puntera}
- Porta Libros: ${desglose.portaLibros}

_Componentes para Sillas:_
- Asientos: ${desglose.asiento}
- Respaldos: ${desglose.respaldo}
- Conteras con Pino: ${desglose.contera}

*Total de piezas a inyectar:* ${totalPiezas} unidades.
_Aguardando confirmación de disponibilidad y precios._`;

    // Reemplaza con tu número
    const numeroWA = "595981000000"; 
    const url = `https://wa.me/${numeroWA}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl max-w-3xl mx-auto w-full text-white">
      <h2 className="text-3xl font-black mb-2 uppercase italic tracking-tighter">Calculadora <span className="text-lime-400">BOM</span></h2>
      <p className="text-slate-400 mb-8 text-sm">Lista de Materiales (Bill of Materials) automática para ensamblaje.</p>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6 text-sm font-bold">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {/* BLOQUE 1: DATOS PRINCIPALES */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
          <h3 className="text-lime-400 font-bold mb-4 uppercase text-xs tracking-widest">1. Configuración Base</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">1. Nombre / Empresa *</label>
              <input 
                type="text" 
                name="nombre"
                value={formData.nombre}
                onChange={handleMainChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none"
                placeholder="Ej. Metalúrgica San José" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">2. Color Norma MEC</label>
              <select 
                name="color"
                value={formData.color}
                onChange={handleMainChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-lime-400 outline-none"
              >
                <option value="Naranja (Educación Inicial)">Naranja (Educación Inicial)</option>
                <option value="Amarillo (1er Ciclo)">Amarillo (1er Ciclo)</option>
                <option value="Rojo (2do Ciclo)">Rojo (2do Ciclo)</option>
                <option value="Gris (3er Ciclo / Media)">Gris (3er Ciclo / Media)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">3. Cantidad de Sillas</label>
              <input 
                type="number" 
                name="cantSillas"
                value={formData.cantSillas}
                onChange={handleMainChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none"
                placeholder="0" min="0"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">4. Cantidad de Mesas</label>
              <input 
                type="number" 
                name="cantMesas"
                value={formData.cantMesas}
                onChange={handleMainChange}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none"
                placeholder="0" min="0"
              />
            </div>
          </div>
        </div>

        {/* BLOQUE 2: DESGLOSE EDITABLE */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lime-400 font-bold uppercase text-xs tracking-widest">5. Lista Desglosada (Piezas a Inyectar)</h3>
            <span className="text-[10px] bg-slate-700 px-2 py-1 rounded text-slate-300">Cantidades Editables</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Columna Mesas */}
            <div className="space-y-3">
              <h4 className="text-slate-500 text-xs font-bold uppercase border-b border-slate-700 pb-2">Componentes de Mesa</h4>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tampo / Mesada</span>
                <input type="number" value={desglose.tampo} onChange={(e) => handleDesgloseChange('tampo', e.target.value)} className="w-20 bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-center outline-none focus:border-lime-400" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Zapata Frontal (Mayor)</span>
                <input type="number" value={desglose.zapataFrontal} onChange={(e) => handleDesgloseChange('zapataFrontal', e.target.value)} className="w-20 bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-center outline-none focus:border-lime-400" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Zapata Posterior (Menor)</span>
                <input type="number" value={desglose.zapataPosterior} onChange={(e) => handleDesgloseChange('zapataPosterior', e.target.value)} className="w-20 bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-center outline-none focus:border-lime-400" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Puntera Superior</span>
                <input type="number" value={desglose.puntera} onChange={(e) => handleDesgloseChange('puntera', e.target.value)} className="w-20 bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-center outline-none focus:border-lime-400" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Porta Libros</span>
                <input type="number" value={desglose.portaLibros} onChange={(e) => handleDesgloseChange('portaLibros', e.target.value)} className="w-20 bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-center outline-none focus:border-lime-400" />
              </div>
            </div>

            {/* Columna Sillas */}
            <div className="space-y-3">
              <h4 className="text-slate-500 text-xs font-bold uppercase border-b border-slate-700 pb-2">Componentes de Silla</h4>
              <div className="flex justify-between items-center">
                <span className="text-sm">Asiento</span>
                <input type="number" value={desglose.asiento} onChange={(e) => handleDesgloseChange('asiento', e.target.value)} className="w-20 bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-center outline-none focus:border-lime-400" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Respaldo</span>
                <input type="number" value={desglose.respaldo} onChange={(e) => handleDesgloseChange('respaldo', e.target.value)} className="w-20 bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-center outline-none focus:border-lime-400" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Contera con Pino</span>
                <input type="number" value={desglose.contera} onChange={(e) => handleDesgloseChange('contera', e.target.value)} className="w-20 bg-slate-900 border border-slate-600 rounded-lg px-2 py-1 text-center outline-none focus:border-lime-400" />
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={generarMensajeWhatsApp}
          className="w-full bg-lime-400 hover:bg-lime-300 text-black font-black py-4 rounded-xl transition-all active:scale-95 shadow-[0_4px_20px_rgba(163,230,53,0.2)] uppercase tracking-tight"
        >
          Enviar Desglose a Ventas (WhatsApp)
        </button>
      </div>
    </div>
  );
}

export default function CotizarPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6">
        <Suspense fallback={<div className="text-lime-400 font-bold animate-pulse">Cargando motor de cálculo...</div>}>
          <CotizacionForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
