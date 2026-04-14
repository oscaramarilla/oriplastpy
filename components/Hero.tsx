import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-lime-50/30 text-lime-600 text-xs font-bold uppercase tracking-widest mb-4">
            Representante Exclusivo: Metal Mad EAS
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-tight">
            Componentes Plásticos para <br />
            <span className="text-lime-500">Mobiliario Escolar MEC</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Abastecemos a metalúrgicas y proveedores del Estado con piezas inyectadas en polipropileno de alta resistencia. Calidad garantizada para licitaciones nacionales.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="#productos"
              className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
            >
              Ver Catálogo B2B
            </Link>
            <Link 
              href="/solicitar-muestra"
              className="px-8 py-4 bg-white text-lime-500 border-2 border-lime-50 rounded-2xl font-bold text-lg hover:bg-lime-50 transition-all"
            >
              Hablar con un Asesor
            </Link>
          </div>
        </div>
      </div>
      {/* Elemento decorativo de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-lime-400/80 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>
    </section>
  )
}
