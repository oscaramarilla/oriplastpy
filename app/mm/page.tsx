"use client";

import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import { toJpeg } from 'html-to-image';
import { track } from '@vercel/analytics'; 
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// 💰 BASE DE DATOS DE PRECIOS METAL MAD (Fase Interna)
const PRECIOS_INTERNOS = {
  tampo: 190000,
  asientoRespaldo: 75000, // El par
  portaLibros: 50000,
  contera: 1500,
  puntera: 1700,
  zapataFrontal: 7000,
  zapataPosterior: 4500
};

export default function PresupuestadorInterno() {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [cargando, setCargando] = useState(false);

  // Datos del Emisor (Metal Mad Único)
  const emisor = {
    nombre: "Metal Mad E.A.S.",
    ruc: "80135751-9",
    subtitulo: "Industria de Mobiliario Escolar Inyectado",
    siglas: "MM"
  };

  // Estado del Cliente
  const [cliente, setCliente] = useState({
    institucion: "",
    contacto: "",
    ruc: "",
    telefono: "",
    fecha: new Date().toLocaleDateString('es-PY'),
  });

  // Cantidades Macro (Lo que el vendedor ingresa)
  const [cantidadesBase, setCantidadesBase] = useState({
    mesas: 0,
    sillas: 0
  });

  // Estado de los items finales en el presupuesto (Desglosado)
  const [items, setItems] = useState<{ id: string; nombre: string; cantidad: number; precioUnitario: number }[]>([]);

  // 🪄 ÍTEM MÁGICO (Para extras)
  const [itemMagico, setItemMagico] = useState({ nombre: "", precio: "" });

  // 🔄 EFECTO: Sincronizar cantidades macro con el desglose oficial
  useEffect(() => {
    const mesas = cantidadesBase.mesas;
    const sillas = cantidadesBase.sillas;

    const desgloseOficial = [
      { id: "t1", nombre: "Tampo / Mesada Escolar ABS/PP", cantidad: mesas * 1, precioUnitario: PRECIOS_INTERNOS.tampo },
      { id: "ar1", nombre: "Conjunto Asiento y Respaldo Inyectado", cantidad: sillas * 1, precioUnitario: PRECIOS_INTERNOS.asientoRespaldo },
      { id: "pl1", nombre: "Porta-Libros Reforzado", cantidad: mesas * 1, precioUnitario: PRECIOS_INTERNOS.portaLibros },
      { id: "c1", nombre: "Contera con Pino (Regatón Silla)", cantidad: sillas * 4, precioUnitario: PRECIOS_INTERNOS.contera },
      { id: "p1", nombre: "Puntera Superior de Mesa", cantidad: mesas * 2, precioUnitario: PRECIOS_INTERNOS.puntera },
      { id: "zf1", nombre: "Zapata Frontal Mayor (Base Mesa)", cantidad: mesas * 2, precioUnitario: PRECIOS_INTERNOS.zapataFrontal },
      { id: "zp1", nombre: "Zapata Posterior Menor (Base Mesa)", cantidad: mesas * 2, precioUnitario: PRECIOS_INTERNOS.zapataPosterior },
    ].filter(item => item.cantidad > 0);

    setItems(desgloseOficial);
  }, [cantidadesBase]);

  const agregarItemPersonalizado = () => {
    if(itemMagico.nombre && itemMagico.precio) {
      setItems([...items, { 
        id: `custom-${Date.now()}`, 
        nombre: itemMagico.nombre, 
        cantidad: 1, 
        precioUnitario: Number(itemMagico.precio) 
      }]);
      setItemMagico({ nombre: "", precio: "" });
    }
  };

  const eliminarItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalPresupuesto = items.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0);

  const generarPDF = async () => {
    if (!pdfRef.current) return;
    setCargando(true);
    
    try {
      // Damos un respiro al celular
      await new Promise(resolve => setTimeout(resolve, 500));

      // El nuevo motor saca la foto perfecta sin trabarse con CSS moderno
      const dataUrl = await toJpeg(pdfRef.current, { 
        quality: 0.9, 
        backgroundColor: '#ffffff',
        pixelRatio: window.innerWidth < 768 ? 1.5 : 2 // Cuida la RAM en celulares
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      // Calculamos el alto perfecto según las dimensiones del div
      const pdfHeight = (pdfRef.current.offsetHeight * pdfWidth) / pdfRef.current.offsetWidth;

      pdf.addImage(dataUrl, "JPEG", 0, 0, pdfWidth, pdfHeight);
      
      const fileName = `Presupuesto_MetalMad_${cliente.institucion || 'Cliente'}.pdf`;

      // MAGIA MÓVIL: Compartir nativo
      if (navigator.canShare && navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
        const pdfBlob = pdf.output('blob');
        const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Presupuesto Metal Mad',
            text: 'Adjunto el presupuesto oficial de Metal Mad E.A.S.'
          });
        } else {
          pdf.save(fileName);
        }
      } else {
        pdf.save(fileName);
      }

      track('Cotizacion_Interna_Generada', { total: totalPresupuesto, cliente: cliente.institucion });
    } catch (error: any) {
      console.error("Error detallado:", error);
      alert(`Error técnico: ${error.message || 'Fallo al generar imagen'}. Intenta nuevamente.`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 pb-20">
      <Navbar />
      
      {/* 📄 VISTA PREVIA DEL PDF (OCULTA FUERA DE PANTALLA) */}
      <div className="absolute left-[-9999px] top-[-9999px]">
        <div id="pdf-wrapper" ref={pdfRef} className="bg-[#ffffff] p-[20mm] text-[#000000] w-[210mm] min-h-[297mm]">
            <div className="flex justify-between items-start border-b-4 border-[#1e3a8a] pb-8 mb-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-[#eff6ff] rounded-2xl flex items-center justify-center font-black text-5xl text-[#1e3a8a] border-2 border-[#bfdbfe] italic tracking-tighter">MM</div>
                <div>
                  <h1 className="text-4xl font-black text-[#172554] italic tracking-tighter">METAL MAD E.A.S.</h1>
                  <p className="text-sm font-bold text-[#3f3f46] uppercase tracking-widest">{emisor.subtitulo}</p>
                  <p className="text-xs text-[#71717a]">RUC: {emisor.ruc} | Lambaré, Paraguay</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-black text-[#d4d4d8] uppercase italic">Presupuesto</h2>
                <p className="font-bold text-xl mt-2 text-[#000000]">N° {Date.now().toString().slice(-6)}</p>
                <p className="text-sm text-[#000000]">Fecha: {cliente.fecha}</p>
              </div>
            </div>

            <div className="bg-[#fafafa] p-6 rounded-2xl border border-[#e4e4e7] mb-8 grid grid-cols-2 gap-4 text-sm text-[#000000]">
              <p><strong>Cliente:</strong> {cliente.institucion || "___________________"}</p>
              <p><strong>RUC:</strong> {cliente.ruc || "___________________"}</p>
              <p><strong>Atención:</strong> {cliente.contacto || "___________________"}</p>
              <p><strong>Teléfono:</strong> {cliente.telefono || "___________________"}</p>
            </div>

            <table className="w-full text-sm mb-12">
              <thead>
                <tr className="bg-[#172554] text-[#ffffff] text-left uppercase text-xs">
                  <th className="p-4 rounded-tl-xl text-center">Cant.</th>
                  <th className="p-4">Descripción de Componentes</th>
                  <th className="p-4 text-right">Precio Unit.</th>
                  <th className="p-4 text-right rounded-tr-xl">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-[#f4f4f5]">
                    <td className="p-4 text-center font-bold text-[#000000]">{item.cantidad}</td>
                    <td className="p-4 font-medium text-[#000000]">{item.nombre}</td>
                    <td className="p-4 text-right text-[#000000]">Gs. {item.precioUnitario.toLocaleString('es-PY')}</td>
                    <td className="p-4 text-right font-bold text-[#000000]">Gs. {(item.cantidad * item.precioUnitario).toLocaleString('es-PY')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mb-20">
              <div className="w-72 bg-[#18181b] text-[#ffffff] p-6 rounded-2xl text-right">
                <p className="text-xs uppercase font-bold text-[#a1a1aa] mb-1">Total IVA Incluido</p>
                <p className="text-3xl font-black text-[#a3e635] tracking-tighter">Gs. {totalPresupuesto.toLocaleString('es-PY')}</p>
              </div>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-10 text-[10px] text-[#71717a] border-t border-[#e4e4e7] pt-8">
              <div>
                <p className="font-black text-[#27272a] uppercase mb-2">Cuentas Bancarias:</p>
                <p><strong>Ueno Bank:</strong> Cta 20588348 (Metal Mad EAS)</p>
                <p><strong>Interfisa:</strong> Cta 259080186 (Metal Mad EAS)</p>
                <p className="mt-2"><strong>Condición:</strong> 50% anticipo, 50% contra entrega.</p>
              </div>
              <div className="text-right">
                <div className="inline-block w-48 border-t border-[#a1a1aa] pt-2 text-center">
                  <p className="font-bold text-[#27272a]">Dpto. Comercial</p>
                  <p>Metal Mad E.A.S.</p>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* 🎛️ TERMINAL DE CONTROL INTERNO */}
      <div className="max-w-4xl mx-auto pt-10 px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200">
          <div className="bg-zinc-900 p-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black italic tracking-tighter">Terminal de Ventas <span className="text-lime-400">Metal Mad</span></h2>
              <p className="text-xs text-zinc-400 uppercase font-bold tracking-widest">Generador de Presupuestos Oficiales</p>
            </div>
            <div className="text-right text-[10px] font-mono text-lime-400 bg-lime-400/10 px-3 py-1 rounded-full border border-lime-400/20 uppercase">
              Acceso Interno Autorizado
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Columna 1: Cliente */}
            <div className="space-y-4">
              <h3 className="font-black text-zinc-800 uppercase text-xs border-b pb-2 tracking-widest">1. Datos del Cliente</h3>
              <input type="text" placeholder="Institución / Empresa" className="w-full p-3 bg-zinc-50 border rounded-xl text-sm" value={cliente.institucion} onChange={e => setCliente({...cliente, institucion: e.target.value})} />
              <input type="text" placeholder="RUC" className="w-full p-3 bg-zinc-50 border rounded-xl text-sm" value={cliente.ruc} onChange={e => setCliente({...cliente, ruc: e.target.value})} />
              <div className="flex gap-2">
                <input type="text" placeholder="Contacto" className="w-1/2 p-3 bg-zinc-50 border rounded-xl text-sm" value={cliente.contacto} onChange={e => setCliente({...cliente, contacto: e.target.value})} />
                <input type="text" placeholder="Teléfono" className="w-1/2 p-3 bg-zinc-50 border rounded-xl text-sm" value={cliente.telefono} onChange={e => setCliente({...cliente, telefono: e.target.value})} />
              </div>
            </div>

            {/* Columna 2: Cantidades */}
            <div className="space-y-4">
              <h3 className="font-black text-zinc-800 uppercase text-xs border-b pb-2 tracking-widest">2. Cantidades a Cotizar</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <label className="block text-[10px] font-bold text-blue-600 uppercase mb-2">Total Mesas</label>
                  <input type="number" className="w-full bg-transparent text-2xl font-black text-blue-900 outline-none" value={cantidadesBase.mesas} onChange={e => setCantidadesBase({...cantidadesBase, mesas: Number(e.target.value)})} />
                </div>
                <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                  <label className="block text-[10px] font-bold text-green-600 uppercase mb-2">Total Sillas</label>
                  <input type="number" className="w-full bg-transparent text-2xl font-black text-green-900 outline-none" value={cantidadesBase.sillas} onChange={e => setCantidadesBase({...cantidadesBase, sillas: Number(e.target.value)})} />
                </div>
              </div>

              {/* Ítem Personalizado */}
              <div className="mt-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                <p className="text-[10px] font-bold text-zinc-500 uppercase mb-2">Añadir Extra (Flete, etc)</p>
                <div className="flex gap-2">
                  <input type="text" placeholder="Concepto" className="w-2/3 p-2 text-xs border rounded-lg" value={itemMagico.nombre} onChange={e => setItemMagico({...itemMagico, nombre: e.target.value})} />
                  <input type="number" placeholder="Gs." className="w-1/3 p-2 text-xs border rounded-lg" value={itemMagico.precio} onChange={e => setItemMagico({...itemMagico, precio: e.target.value})} />
                </div>
                <button onClick={agregarItemPersonalizado} className="w-full mt-2 bg-zinc-800 text-white text-[10px] font-bold py-2 rounded-lg uppercase">Añadir Ítem</button>
              </div>
            </div>
          </div>

          {/* Resumen Final */}
          <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-xs text-zinc-400 font-bold uppercase">Total del Presupuesto:</p>
              <h3 className="text-4xl font-black text-zinc-900 tracking-tighter">Gs. {totalPresupuesto.toLocaleString('es-PY')}</h3>
            </div>
            <button 
              onClick={generarPDF}
              disabled={cargando || totalPresupuesto === 0}
              className="px-10 py-5 bg-red-600 hover:bg-red-700 disabled:bg-zinc-300 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-3 uppercase tracking-tighter"
            >
              {cargando ? "Procesando..." : "📥 Descargar PDF Oficial"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
