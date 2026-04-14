import Link from 'next/link'

const productos = [
  { nombre: "Tampo con Travesaño", desc: "Mesada de alta resistencia para pupitres escolares." },
  { nombre: "Asiento Nivel Inicial", desc: "Ergonomía certificada para los más pequeños." },
  { nombre: "Asiento 1er Ciclo", desc: "Dimensiones estándar para educación escolar básica." },
  { nombre: "Asiento 2do Ciclo", desc: "Resistencia superior para uso intensivo." },
  { nombre: "Asiento 3er Ciclo", desc: "Formato ergonómico para jóvenes y adultos." },
  { nombre: "Respaldo Nivel Inicial", desc: "Soporte lumbar adaptado a nivel inicial." },
  { nombre: "Respaldo 1er al 3er Ciclo", desc: "Pieza universal inyectada en polipropileno." },
  { nombre: "Porta Libros", desc: "Accesorio esencial para pupitres modulares." },
  { nombre: "Puntera Superior", desc: "Terminación estética y de seguridad para caños." },
  { nombre: "Puntera con Pino", desc: "Componente de ensamble estructural." },
  { nombre: "Zapata Frontal", desc: "Base antideslizante de larga duración." },
  { nombre: "Zapata Posterior", desc: "Protección reforzada contra el roce del piso." },
]

export default function ProductLines() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-black text-gray-900">Línea Escolar Homologada</h2>
          <p className="text-gray-500 mt-2 font-medium">Insumos listos para su integración en fábrica.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productos.map((p, i) => (
            <div key={i} className="group bg-gray-50 p-6 rounded-3xl border border-transparent hover:border-lime-100/50 hover:bg-white hover:shadow-2xl hover:shadow-lime-100/30 transition-all">
              <div className="w-12 h-12 bg-lime-500 rounded-2xl flex items-center justify-center text-slate-950 font-bold mb-4 group-hover:scale-110 transition-transform">
                {i + 1}
              </div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">{p.nombre}</h3>
              <p className="text-sm text-gray-500 mt-2 mb-6">{p.desc}</p>
              <Link 
                href="/solicitar-muestra" 
                className="text-sm font-bold text-lime-500 flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Solicitar pieza <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
