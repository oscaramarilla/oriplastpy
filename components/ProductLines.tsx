import Link from 'next/link';

export default function ProductLines() {
  // Los 12 componentes exactos cubiertos por la exclusividad de Metal Mad
  const catalogue = [
    { name: 'Tampo con Travesaño', category: 'Mesadas', desc: 'Superficie de alto impacto inyectada en polipropileno.' },
    { name: 'Asiento Nivel Inicial', category: 'Asientos', desc: 'Ergonomía adaptada para preescolar. Lavable y resistente.' },
    { name: 'Asiento 1er Ciclo', category: 'Asientos', desc: 'Tamaño estándar para primera etapa escolar.' },
    { name: 'Asiento 2do Ciclo', category: 'Asientos', desc: 'Estructura reforzada para uso intensivo diario.' },
    { name: 'Asiento 3er Ciclo', category: 'Asientos', desc: 'Dimensiones mayores para adolescentes.' },
    { name: 'Respaldo Nivel Inicial', category: 'Respaldos', desc: 'Diseño anatómico para educación inicial.' },
    { name: 'Respaldo 1er al 3er Ciclo', category: 'Respaldos', desc: 'Soporte lumbar inyectado, formato universal MEC.' },
    { name: 'Porta Libros', category: 'Accesorios', desc: 'Rejilla plástica inferior para guardado de útiles.' },
    { name: 'Puntera Superior', category: 'Accesorios / Terminaciones', desc: 'Cierre estético y seguro para estructuras de caño.' },
    { name: 'Puntera con Pino', category: 'Accesorios / Terminaciones', desc: 'Conector de ensamble para pupitres modulares.' },
    { name: 'Zapata Frontal', category: 'Accesorios / Terminaciones', desc: 'Apoyo antideslizante para la base de la estructura.' },
    { name: 'Zapata Posterior', category: 'Accesorios / Terminaciones', desc: 'Protección para el roce constante contra el piso.' },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Catálogo de Componentes</h2>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
            Materia prima inyectada lista para ensamblaje. Ideal para metalúrgicas y licitaciones del MEC.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogue.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-full">
                  {item.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>
              
              {/* Espacio reservado para futuras imágenes - gris por ahora para mantener el layout */}
              <div className="w-full h-32 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center mb-4">
                <span className="text-gray-400 text-sm italic">Sin imagen asignada</span>
              </div>
              
              <Link 
                href="/solicitar-muestra" 
                className="w-full text-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors"
              >
                Solicitar Muestra Física
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
