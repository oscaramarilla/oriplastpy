import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-slate-700 pb-8">
          
          {/* Columna 1: Marca */}
          <div>
            <h3 className="text-2xl font-bold tracking-tight mb-2">Oriplast<span className="text-lime-500">.py</span></h3>
            <p className="text-slate-400 text-sm mb-4">
              Componentes plásticos inyectados de alta resistencia para la industria metalúrgica y licitaciones del Estado.
            </p>
            <div className="inline-block bg-lime-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Representante Exclusivo
            </div>
          </div>

          {/* Columna 2: Empresa */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-slate-200">Operaciones en Paraguay</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="font-medium text-white">Metal Mad EAS</li>
              <li>RUC: (80135751-9)</li>
              <li>Lambaré / Asunción, Paraguay</li>
            </ul>
          </div>

          {/* Columna 3: Contacto Rápido */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-slate-200">Ventas Corporativas</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                +595 (982451828)
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-lime-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                ventas@oriplastpy.com
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Metal Mad EAS. Todos los derechos reservados. Desarrollado por AYCweb.</p>
        </div>
      </div>
    </footer>
  );
}
