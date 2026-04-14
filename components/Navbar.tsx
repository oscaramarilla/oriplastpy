import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-black tracking-tighter text-lime-600">
              ORIPLAST<span className="text-gray-900">.PY</span>
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="#productos" className="text-sm font-semibold text-gray-600 hover:text-lime-500 transition-colors">Productos</Link>
            <div className="relative group">
              <button className="text-sm font-semibold text-gray-600 hover:text-lime-500 transition-colors">
                Soluciones B2B
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all origin-top-left">
                <Link href="/soluciones-tampos" className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-lime-50/50 hover:text-lime-600 first:rounded-t-2xl transition-colors">
                  Tampos Escolares
                </Link>
                <Link href="/soluciones-asientos" className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-lime-50/50 hover:text-lime-600 transition-colors">
                  Asientos Escolares
                </Link>
                <Link href="/soluciones-respaldos" className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-lime-50/50 hover:text-lime-600 transition-colors">
                  Respaldos Escolares
                </Link>
                <Link href="/soluciones-accesorios" className="block px-4 py-3 text-sm font-medium text-gray-900 hover:bg-lime-50/50 hover:text-lime-600 last:rounded-b-2xl transition-colors">
                  Accesorios
                </Link>
              </div>
            </div>
            <Link href="/solicitar-muestra" className="text-sm font-semibold text-gray-600 hover:text-lime-500 transition-colors">Muestras</Link>
          </div>
          <Link 
            href="/solicitar-muestra"
            className="bg-lime-500 text-slate-950 px-5 py-2.5 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(132,204,22,0.2)] hover:bg-lime-600 transition-all active:scale-95"
          >
            Pedir Muestra
          </Link>
        </div>
      </div>
    </nav>
  )
}
