'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// --- DATOS REESTRUCTURADOS (Solo como ejemplo, usa tus imágenes reales) ---
const productsData = [
  // MESA ESCOLAR
  { id: 'mesa-tampo', category: 'mesa', name: 'Mesada / Tampo Inyectado', src: '/images/spec-detalle-mesada-escolar-pp.webp' },
  { id: 'mesa-porta-libros', category: 'mesa', name: 'Porta libros de Acero', src: '/images/spec-detalle-Porta-Libros-Reforzado.webp' },
  
  // SILLA ESCOLAR
  { id: 'silla-asiento', category: 'silla', name: 'Asiento Escolar', src: '/images/thumb-silla-escolar-abs.webp' }, // Reemplazar con foto real de asiento solo
  { id: 'silla-respaldo', category: 'silla', name: 'Respaldo Escolar', src: '/images/spec-detalle-asiento-y-respaldo.webp' }, // Reemplazar con foto real de respaldo solo
  
  // KITS ACCESORIOS
  { id: 'kit-mesa', category: 'kits', name: 'Kit Accesorios Mesa', src: '/images/spec-detalle-zapata-frontal-mayor.webp', desc: '2 Zapatas Mayores, 2 Zapatas Menores, 2 Punteras, 1 Porta libros' },
  { id: 'kit-silla', category: 'kits', name: 'Kit Accesorios Silla', src: '/images/spec-detalle-regaton-pino.webp', desc: '4 Pinos y Conteras' },
];

export default function HomeB2B() {
  const [filter, setFilter] = useState('mesa');

  const filteredProducts = productsData.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* 1. HERO B2B */}
      <header className="bg-black text-white p-8 md:p-16 border-b-4 border-lime-400">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <span className="text-lime-400 font-bold uppercase tracking-wider text-sm mb-2 block">Componentes Plásticos Industriales</span>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Abastecimiento B2B para Mobiliario Escolar MEC
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl">
              Proveedor técnico para metalúrgicas y empresas que necesitan fabricar, reponer o cotizar piezas inyectadas de alta resistencia para licitaciones nacionales.
            </p>
            <div className="flex gap-4">
              <a href="#catalogo" className="bg-lime-400 text-black px-6 py-3 rounded-full font-bold hover:bg-white transition">
                Ver Componentes
              </a>
              <a href="https://wa.me/TUSWAPP" className="bg-transparent border border-white text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition">
                Cotizar Proyecto
              </a>
            </div>
          </div>
          <div className="w-48 md:w-64">
            {/* Usa tu logo real de Oriplast o Metal Mad */}
             <Image src="/images/logo-metal-mad.webp" alt="Oriplast Logo" width={250} height={100} className="object-contain" />
          </div>
        </div>
      </header>

      {/* 2. BADGES DE CONFIANZA */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto py-4 px-6 flex flex-wrap justify-center md:justify-between gap-4 text-sm font-semibold text-gray-600 uppercase">
          <span className="flex items-center gap-2">✅ Representación Oficial</span>
          <span className="flex items-center gap-2">🏭 Enfoque Industrial</span>
          <span className="flex items-center gap-2">📍 Atención Local (Asunción/Lambaré)</span>
          <span className="flex items-center gap-2">⚙️ Repuestos Estandarizados</span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6 md:p-10 space-y-20">

        {/* 3. BLOQUE MAESTRO: CÓMO SE COMPONE (La clave del cambio) */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-4">Cómo se compone un conjunto escolar</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nuestra línea está organizada para que metalúrgicas y proveedores entiendan rápidamente qué piezas forman una mesa, una silla y cómo se estructura cada conjunto.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 relative">
             {/* Conector visual opcional */}
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-lime-400 font-black">+</div>

            {/* Columna Mesa */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">📐 Mesa Escolar</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                  <span className="font-semibold">Mesada / Tampo</span> <span className="bg-gray-200 text-xs px-2 py-1 rounded">1 Unidad</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Zapatas mayores</span> <span className="text-sm font-mono bg-gray-100 px-2 rounded">2 Unidades</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Zapatas menores</span> <span className="text-sm font-mono bg-gray-100 px-2 rounded">2 Unidades</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Punteras</span> <span className="text-sm font-mono bg-gray-100 px-2 rounded">2 Unidades</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Porta libros</span> <span className="text-sm font-mono bg-gray-100 px-2 rounded">1 Unidad</span>
                </li>
              </ul>
            </div>

            {/* Columna Silla */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">🪑 Silla Escolar</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                  <span className="font-semibold">Asiento</span> <span className="bg-gray-200 text-xs px-2 py-1 rounded">1 Unidad</span>
                </li>
                 <li className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                  <span className="font-semibold">Respaldo</span> <span className="bg-gray-200 text-xs px-2 py-1 rounded">1 Unidad</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Pinos y Conteras</span> <span className="text-sm font-mono bg-gray-100 px-2 rounded">4 Unidades</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-8 bg-black text-white p-4 rounded-xl font-bold">
            1 Conjunto de Alumno = 1 Mesa + 1 Silla
            <span className="block text-sm text-gray-400 font-normal mt-1">Una lógica pensada para facilitar fabricación, reposición y cotización.</span>
          </div>
        </section>

        {/* 4. SECCIÓN DE OFERTA REESTRUCTURADA */}
        <section id="catalogo">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black mb-2">Línea escolar organizada</h2>
            <p className="text-gray-600">En lugar de piezas aisladas, presentamos nuestra línea según la lógica de fabricación.</p>
          </div>

          {/* Navegación Interna */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button onClick={() => setFilter('mesa')} className={`px-6 py-2 rounded-full font-bold transition ${filter === 'mesa' ? 'bg-black text-lime-400' : 'bg-gray-200 hover:bg-gray-300'}`}>Mesa Escolar</button>
            <button onClick={() => setFilter('silla')} className={`px-6 py-2 rounded-full font-bold transition ${filter === 'silla' ? 'bg-black text-lime-400' : 'bg-gray-200 hover:bg-gray-300'}`}>Silla Escolar</button>
            <button onClick={() => setFilter('kits')} className={`px-6 py-2 rounded-full font-bold transition ${filter === 'kits' ? 'bg-black text-lime-400' : 'bg-gray-200 hover:bg-gray-300'}`}>Kits Accesorios</button>
          </div>

          {/* Grilla dinámica de productos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="relative h-48 mb-4 bg-gray-50 rounded-xl overflow-hidden">
                  <Image src={product.src} alt={product.name} fill className="object-contain p-4" />
                </div>
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                {product.desc && <p className="text-sm text-gray-600 mb-4">{product.desc}</p>}
                
                <button className="w-full mt-4 bg-gray-100 text-black py-2 rounded-lg font-semibold hover:bg-lime-400 transition">
                  {filter === 'kits' ? 'Ver detalle del Kit' : 'Consultar Componente'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 5 y 6. BLOQUES DE AUTORIDAD (Para quién y Por qué) */}
        <div className="grid md:grid-cols-2 gap-10">
          
          {/* Bloque: Para quién trabajamos */}
          <section className="bg-gray-100 p-8 rounded-3xl">
            <h2 className="text-2xl font-black mb-6 border-l-4 border-lime-400 pl-4">Pensado para empresas, no para compras aisladas</h2>
            <p className="text-gray-700 mb-6">
              Atendemos a empresas que necesitan componentes plásticos con una lógica clara de fabricación y cotización:
            </p>
            <ul className="space-y-4">
               <li className="flex gap-3">
                 <span className="text-xl">🏭</span>
                 <div><strong className="block">Metalúrgicas</strong> Abastecemos piezas compatibles para completar estructuras con precisión.</div>
               </li>
               <li className="flex gap-3">
                 <span className="text-xl">🏢</span>
                 <div><strong className="block">Proveedores del Estado</strong> Estructura clara para licitaciones.</div>
               </li>
               <li className="flex gap-3">
                 <span className="text-xl">🔨</span>
                 <div><strong className="block">Mueblerías Técnicas</strong> Reposición ordenada y técnica.</div>
               </li>
            </ul>
          </section>

          {/* Bloque: Por qué elegirnos */}
          <section className="bg-black text-white p-8 rounded-3xl">
            <h2 className="text-2xl font-black mb-6 border-l-4 border-lime-400 pl-4">La diferencia es la forma de abastecer</h2>
            <p className="text-gray-300 mb-6">
              Organizamos la línea escolar con una lógica útil para quienes necesitan trabajar con respaldo local.
            </p>
             <ul className="space-y-3">
               <li className="flex items-center gap-2"><span className="text-lime-400">✔</span> Representación oficial en Paraguay</li>
               <li className="flex items-center gap-2"><span className="text-lime-400">✔</span> Atención B2B local directa</li>
               <li className="flex items-center gap-2"><span className="text-lime-400">✔</span> Mejor estructura para cotización</li>
               <li className="flex items-center gap-2"><span className="text-lime-400">✔</span> Enfoque comercial para producción</li>
            </ul>
            <a href="https://wa.me/TUSWAPP" className="inline-block mt-8 bg-lime-400 text-black px-6 py-3 rounded-full font-bold hover:bg-white transition w-full text-center">
               Contactar Asesor B2B
            </a>
          </section>

        </div>

      </main>
    </div>
  );
}
