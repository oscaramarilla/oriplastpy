import Link from 'next/link'

// Reestructuramos la data en las 3 grandes categorías
const categorias = [
  {
    titulo: "Tampos y Mesadas",
    desc: "Superficies de trabajo de alta resistencia.",
    icono: "1",
    productos: [
      { nombre: "Tampo con Travesaño", desc: "Superficie inyectada para pupitres escolares." }
    ]
  },
  {
    titulo: "Asientos y Respaldos",
    desc: "Ergonomía y soporte para todos los ciclos.",
    icono: "2",
    productos: [
      { nombre: "Conjunto Nivel Inicial", desc: "Asiento y Respaldo adaptado para preescolar." },
      { nombre: "Conjunto 1er al 3er Ciclo", desc: "Asiento y Respaldo universal." },
      { nombre: "Asiento 2do/3er Ciclo", desc: "Resistencia superior para uso intensivo." }
    ]
  },
  {
    titulo: "Accesorios Estructurales",
    desc: "Terminaciones y bases para el ensamblaje completo.",
    icono: "3",
    productos: [
      { nombre: "Kit Accesorios Mesa", desc: "Incluye: 2 Zapatas Frontales, 2 Zapatas Posteriores, 2 Punteras y 1 Porta Libros." },
      { nombre: "Kit Accesorios Silla", desc: "Incluye: 4 Conteras con Pino." }
    ]
  }
]

export default function ProductLines() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-3xl font-black text-gray-900">Línea Escolar Homologada</h2>
          <p className="text-gray-500 mt-2 font-medium">Insumos estructurados para su fácil integración en fábrica.</p>
        </div>
        
        <div className="space-y-12">
          {categorias.map((cat, i) => (
            <div key={i} className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
                 <div className="w-12 h-12 bg-lime-500 rounded-2xl flex items-center justify-center text-slate-950 font-black text-xl">
                  {cat.icono}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{cat.titulo}</h3>
                  <p className="text-gray-500">{cat.desc}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.productos.map((p, j) => (
                  <div key={j} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-lime-200 hover:shadow-lg transition-all group">
                    <h4 className="font-bold text-gray-900 mb-2">{p.nombre}</h4>
                    <p className="text-sm text-gray-500 mb-4">{p.desc}</p>
                    <Link 
                      href={`/cotizar?producto=${p.nombre.toLowerCase().replace(/ /g, '-')}`} 
                      className="text-sm font-bold text-lime-600 flex items-center gap-2 group-hover:gap-3 transition-all"
                    >
                      Cotizar lote <span>→</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
