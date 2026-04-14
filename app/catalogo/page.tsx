'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// 1. Datos del Catálogo (Estructurados para Vender)
const productsData = [
  // MUEBLES COMPLETOS
  {
    id: 'silla-abs',
    category: 'muebles',
    name: 'Silla Pedagógica Premium (Modelo AB)',
    src: '/images/thumb-silla-escolar-abs.webp',
    tag: 'La Más Vendida',
    sellingPoints: [
      'Ergonomía FNDE certificada: Comodidad total para el alumno.',
      'Plástico ABS Inyectado: Soporta impactos y uso severo.',
      'Estructura con Fosfatizado: Blindaje total contra el óxido.',
    ]
  },
  {
    id: 'mesa-pp',
    category: 'muebles',
    name: 'Mesa Pedagógica (Estructura Reforzada)',
    src: '/images/thumb-mesa-pedagogica-pp.webp',
    tag: 'Alta Durabilidad',
    sellingPoints: [
      'Tapa de Polipropileno de Alta Densidad: Superficie anti-rayas.',
      'Pintura Epoxi-Poliéster: Acabado industrial de lujo y larga vida.',
      'Soldadura MIG Robotizada: Estabilidad total, cero tambaleo.',
    ]
  },
  // COMPONENTES
  {
    id: 'kit-asiento',
    category: 'repuestos',
    name: 'Kit Renovación Asiento y Respaldo',
    src: '/images/thumb-conjunto-asiento-respaldo.webp',
    tag: 'Ahorro Inteligente',
    sellingPoints: [
      'Renueva tus sillas viejas por una fracción del costo.',
      'Inyección de polímero virgen: Colores vibrantes y duraderos.',
      'Bordes redondeados de seguridad (Norma FNDE).',
    ]
  },
  {
    id: 'porta-libros',
    category: 'repuestos',
    name: 'Porta Libros de Acero Reforzado',
    src: '/images/thumb-porta-libros-reforzado.webp',
    tag: 'Accesorio Extra',
    sellingPoints: [
      'Acero SAE 1010: No se dobla con el peso de los libros.',
      'Integración perfecta a la estructura de la mesa.',
      'Acabado en pintura epoxi gris.',
    ]
  },
  {
    id: 'regaton',
    category: 'accesorios',
    name: 'Regatón Antideslizante Pino',
    src: '/images/thumb-regaton-pino.webp',
    sellingPoints: [
      'Protección total del piso: Evita rayones en cerámicas.',
      'Silencioso: Reduce el ruido en el aula al mover muebles.',
      'Polipropileno virgen de alto impacto.',
    ]
  },
  {
    id: 'zapata',
    category: 'accesorios',
    name: 'Zapata Frontal Estabilidad',
    src: '/images/thumb-zapata-frontal.webp',
    sellingPoints: [
      'Diseño exclusivo para mayor base de apoyo en mesas.',
      'Evita el vuelco accidental.',
      'Instalación rápida y segura.',
    ]
  },
];

const categories = [
  { id: 'todos', label: 'Todo el Catálogo' },
  { id: 'muebles', label: 'Muebles Completos' },
  { id: 'repuestos', label: 'Kits de Renovación' },
  { id: 'accesorios', label: 'Componentes y Regatones' },
];

export default function CatalogoPage() {
  const [filter, setFilter] = useState('todos');

  const filteredProducts = productsData.filter(
    (p) => filter === 'todos' || p.category === filter
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header Industrial */}
      <header className="bg-black p-6 border-b-4 border-lime-400 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/images/logo-metal-mad.webp" alt="Metal Mad Logo" width={150} height={50} className="object-contain" />
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
              <span className="text-lime-400">Catálogo</span> Industrial 2024
            </h1>
          </div>
          <Link href="/mm" className="bg-lime-400 text-black px-5 py-2 rounded-full font-bold hover:bg-white transition flex items-center gap-2">
            📄 Volver al Cotizador
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <p className="text-xl text-gray-700 mb-10 max-w-3xl">
          Fabricamos mobiliario escolar bajo estrictas normas de ergonomía y durabilidad.
          <strong className="text-black"> Inversión garantizada para instituciones exigentes.</strong>
        </p>

        {/* Filtros de Categoría */}
        <div className="flex flex-wrap gap-3 mb-12 bg-white p-3 rounded-2xl shadow-inner border border-gray-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${
                filter === cat.id
                  ? 'bg-black text-lime-400 shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grilla de Productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col hover:border-lime-200 hover:shadow-2xl transition-all duration-300">
              {product.tag && (
                <span className="absolute top-4 right-4 bg-lime-400 text-black px-3 py-1 rounded-full text-xs font-black uppercase z-10">
                  {product.tag}
                </span>
              )}
              
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 mb-6">
                <Image
                  src={product.src}
                  alt={product.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <h3 className="text-xl font-black text-gray-900 tracking-tight mb-4 flex-grow">
                {product.name}
                <span className="block text-sm font-bold text-gray-400 mt-1 uppercase">ID: {product.id}</span>
              </h3>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 shadow-inner">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Beneficios Clave (Datos PDF):</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  {product.sellingPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-lime-500 mt-0.5">✔</span> {point}
                    </li>
                   ))}
                </ul>
              </div>

              <Link href="/mm" className="block w-full text-center bg-black text-white font-bold py-4 rounded-xl hover:bg-lime-400 hover:text-black transition flex items-center justify-center gap-2">
                ➕ Agregar a Cotización
              </Link>
            </div>
          ))}
        </div>

        {/* CTA Final */}
        <footer className="mt-20 bg-white p-10 rounded-3xl border border-gray-100 text-center shadow-lg">
            <h2 className="text-2xl font-black mb-4">¿Necesitas un proyecto personalizado?</h2>
            <p className="text-gray-600 mb-6">Contáctanos directamente para licitaciones o pedidos especiales.</p>
            <a href="https://wa.me/TUNUMEROWHATSAPP" className="inline-block bg-green-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-green-600">
              Hablar por WhatsApp
            </a>
        </footer>
      </main>
    </div>
  );
}
