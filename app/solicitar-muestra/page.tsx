'use client';

import { Suspense, useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function CotizacionForm() {
  // NUEVO: Modo de cálculo (Conjuntos vs Separado)
  const [modoCalculo, setModoCalculo] = useState<'conjuntos' | 'separado'>('conjuntos');

  const [formData, setFormData] = useState({
    nombre: '',
    color: 'Gris (3er Ciclo / Media)',
    cantConjuntos: '', // Nueva variable para el modo conjunto
    cantMesas: '',
    cantSillas: '',
  });

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

  // MOTOR AUTOMÁTICO V2: Inteligencia según el modo elegido
  useEffect(() => {
    // Si es por conjunto, mesas y sillas valen lo mismo. Si es separado, toman sus valores individuales.
    const mesas = modoCalculo === 'conjuntos' ? (parseInt(formData.cantConjuntos) || 0) : (parseInt(formData.cantMesas) || 0);
    const sillas = modoCalculo === 'conjuntos' ? (parseInt(formData.cantConjuntos) || 0) : (parseInt(formData.cantSillas) || 0);

    setDesglose({
      tampo: mesas * 1,
      zapataFrontal: mesas * 2,
      zapataPosterior: mesas * 2,
      puntera: mesas * 2,
      portaLibros: mesas * 1,
      asiento: sillas * 1,
      respaldo: sillas * 1,
      contera: sillas * 4,
    });
  }, [formData.cantConjuntos, formData.cantMesas, formData.cantSillas, modoCalculo]);

  const handleMainChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

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
      setError('Debes ingresar cantidades válidas para cotizar.');
      return;
    }

    const mesasSolicitadas = modoCalculo === 'conjuntos' ? formData.cantConjuntos : formData.cantMesas;
    const sillasSolicitadas = modoCalculo === 'conjuntos' ? formData.cantConjuntos : formData.cantSillas;

    const mensaje = `*COTIZACIÓN INDUSTRIAL - BOM* 🏭

*Cliente:* ${formData.nombre}
*Color MEC:* ${formData.color}
*Modalidad:* ${modoCalculo === 'conjuntos' ? 'Por Conjuntos' : 'Piezas Separadas'}

*Cantidades Base:*
- Mesas a ensamblar: ${mesasSolicitadas || 0}
- Sillas a ensamblar: ${sillasSolicitadas || 0}

*📋 LISTA DE COMPONENTES A INYECTAR:*
_Mesa (5 piezas c/u):_
- Tampos: ${desglose.tampo}
- Zapatas Frontales: ${desglose.zapataFrontal}
- Zapatas Posteriores: ${desglose.zapataPosterior}
- Punteras: ${desglose.puntera}
- Porta Libros: ${desglose.portaLibros}

_Silla (3 piezas c/u):_
- Asientos: ${desglose.asiento}
- Respaldos: ${desglose.respaldo}
- Conteras: ${desglose.contera}

*TOTAL PIEZAS:* ${totalPiezas} unidades.`;

    const numeroWA = "595981000000"; // Tu número aquí
    const url = `https://wa.me/${numeroWA}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl max-w-4xl mx-auto w-full text-white">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-2">Calculadora <span className="text-lime-400">BOM Escolar</span></h2>
        <p className="text-slate-400 text-sm mb-4">Sistema automatizado de Lista de Materiales (Bill of Materials) para ensamblaje.</p>
        
        {/* LA REGLA VISIBLE */}
        <div className="bg-lime-400/10 border border-lime-400/20 p-4 rounded-xl text-sm text-lime-100 flex flex-col md:flex-row gap-4 md:items-center">
          <span className="font-bold text-lime-400 uppercase tracking-widest text-xs">Regla Estructural:</span>
          <div>
            <p><strong>1 Mesa =</strong> 1 Tampo + 2 Zapata F. + 2 Zapata P. + 2 Punteras + 1 Porta libros</p>
            <p><strong>1 Silla =</strong> 1 Asiento + 1 Respaldo + 4 Conteras con pino</p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl mb-6 text-sm font-bold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* COLUMNA IZQUIERDA: CONFIGURACIÓN */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">1. Nombre / Empresa *</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleMainChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none" placeholder="Ej. Metalúrgica San José" />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">2. Color Norma MEC</label>
              <select name="color" value={formData.color} onChange={handleMainChange} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-lime-400 outline-none">
                <option value="Naranja (Educación Inicial)">Naranja (Educación Inicial)</option>
                <option value="Amarillo (1er Ciclo)">Amarillo (1er Ciclo)</option>
                <option value="Rojo (2do Ciclo)">Rojo (2do Ciclo)</option>
                <option value="Gris (3er Ciclo / Media)">Gris (3er Ciclo / Media)</option>
              </select>
            </div>

            {/* SWITCH DE MODOS */}
            <div className="pt-4 border-t border-slate-700">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-3">3. Modo de Cálculo</label>
              <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-700">
                <button onClick={() => setModoCalculo('conjuntos')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${modoCalculo === 'conjuntos' ? 'bg-lime-400 text-black' : 'text-slate-400 hover:text-white'}`}>Por Conjuntos</button>
                <button onClick={() => setModoCalculo('separado')} className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${modoCalculo === 'separado' ? 'bg-lime-400 text-black' : 'text-slate-400 hover:text-white'}`}>Separado</button>
              </div>
            </div>

            {/* INPUTS DINÁMICOS SEGÚN EL MODO */}
            {modoCalculo === 'conjuntos' ? (
              <div>
                <label className="block text-xs font-bold text-lime-400 uppercase mb-2">Cantidad de Conjuntos</label>
                <input type="number" name="cantConjuntos" value={formData.cantConjuntos} onChange={handleMainChange} className="w-full bg-slate-900 border border-lime-400/50 rounded-xl px-4 py-3 text-white focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none" placeholder="0" min="0" />
                <p className="text-[10px] text-slate-500 mt-1">1 conjunto = 1 mesa + 1 silla</p>
              </div>
            ) : (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Sillas</label>
                  <input type="number" name="cantSillas" value={formData.cantSillas} onChange={handleMainChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-lime-400 outline-none" placeholder="0" min="0" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mesas</label>
                  <input type="number" name="cantMesas" value={formData.cantMesas} onChange={handleMainChange} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-lime-400 outline-none" placeholder="0" min="0" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: DESGLOSE Y BOTÓN */}
        <div className="lg:col-span-7 flex flex-col h-full">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex-grow mb-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
              <h3 className="text-lime-400 font-bold uppercase text-xs tracking-widest">Resumen Desglosado</h3>
              <span className="text-[10px] bg-slate-700 px-2 py-1 rounded text-slate-300">Editable p/ Repuestos</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-3">
                <h4 className="text-slate-500 text-xs font-bold uppercase">Componentes Mesa</h4>
                {['tampo', 'zapataFrontal', 'zapataPosterior', 'puntera', 'portaLibros'].map((item) => (
                  <div key={item} className="flex justify-between items-center bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-800 hover:border-slate-600 transition-colors">
                    <span className="text-sm text-slate-300 capitalize">{item.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <input type="number" value={desglose[item as keyof typeof desglose]} onChange={(e) => handleDesgloseChange(item as keyof typeof desglose, e.target.value)} className="w-16 bg-transparent text-right font-bold text-white outline-none" />
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="text-slate-500 text-xs font-bold uppercase">Componentes Silla</h4>
                {['asiento', 'respaldo', 'contera'].map((item) => (
                  <div key={item} className="flex justify-between items-center bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-800 hover:border-slate-600 transition-colors">
                    <span className="text-sm text-slate-300 capitalize">{item}</span>
                    <input type="number" value={desglose[item as keyof typeof desglose]} onChange={(e) => handleDesgloseChange(item as keyof typeof desglose, e.target.value)} className="w-16 bg-transparent text-right font-bold text-white outline-none" />
                  </div>
                ))}
                
                {/* TOTAL SUMMARY */}
                <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">Total Piezas:</span>
                  <span className="text-2xl font-black text-lime-400">{Object.values(desglose).reduce((a, b) => a + b, 0)}</span>
                </div>
              </div>
            </div>
          </div>

          <button onClick={generarMensajeWhatsApp} className="w-full bg-lime-400 hover:bg-lime-300 text-black font-black py-4 rounded-xl transition-all active:scale-95 shadow-[0_4px_20px_rgba(163,230,53,0.2)] uppercase tracking-tight">
            Enviar Pedido Corporativo
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CotizarPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6">
        <Suspense fallback={<div className="text-lime-400 font-bold animate-pulse">Cargando motor corporativo...</div>}>
          <CotizacionForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
