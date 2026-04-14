'use client';

import { useParams, useRouter } from 'next/navigation';
import TechnicalCard from '@/components/TechnicalCard';
import { CATALOGO_B2B } from '@/lib/config/catalogo';

const CATEGORIAS_INFO: Record<string, { titulo: string; descripcion: string }> = {
  tampos: {
    titulo: 'Tampos Escolares',
    descripcion: 'Superficies de trabajo de alta resistencia para pupitres modulares. Material inyectado en ABS o polipropileno con laminado melamina texturizado.'
  },
  asientos: {
    titulo: 'Asientos Escolares',
    descripcion: 'Asientos ergonómicos para todos los niveles educativos. Disponibles en colores MEC para educación inicial, ciclos 1-3 y media.'
  },
  respaldos: {
    titulo: 'Respaldos Escolares',
    descripcion: 'Soportes lumbares inyectados con aletas de refuerzo. Compatible con estructuras de caño estándar y pupitres modulares.'
  },
  accesorios: {
    titulo: 'Accesorios y Terminaciones',
    descripcion: 'Componentes complementarios: portalibros, punteras, zapatas frontales y posteriores. Sistemas de ensamble rápido y seguro.'
  }
};

export default function SolucionesPage() {
  const params = useParams();
  const router = useRouter();
  const categoriaParam = params.categoria as string;

  // Normalizar categoría (slug a nombre de familia)
  const categoria = categoriaParam?.toLowerCase() as 'tampos' | 'asientos' | 'respaldos' | 'accesorios' | undefined;

  // Validar categoría
  if (!categoria || !['tampos', 'asientos', 'respaldos', 'accesorios'].includes(categoria)) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Categoría no encontrada</h1>
          <p className="text-gray-600 mb-8">La categoría que buscas no existe.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-lime-500 text-slate-950 font-bold px-6 py-3 rounded-xl hover:bg-lime-600 transition-all"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Filtrar componentes por categoría
  const componentes = CATALOGO_B2B.filter((comp) => comp.familia === categoria);
  const info = CATEGORIAS_INFO[categoria];

  // Handler para "Cotizar Lote"
  const handleCotizar = (id: string, nombre: string) => {
    // Por ahora, navegar al formulario de cotización con el producto como parámetro
    router.push(`/cotizar?producto=${encodeURIComponent(id)}&nombre=${encodeURIComponent(nombre)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero / Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-lime-500/20 border border-lime-400/30 rounded-full">
            <span className="text-sm font-bold text-lime-300">Soluciones Técnicas B2B</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">{info.titulo}</h1>
          <p className="text-xl text-gray-300 max-w-3xl leading-relaxed">
            {info.descripcion}
          </p>
        </div>
      </div>

      {/* Grilla de componentes */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {componentes.length > 0 ? (
          <div>
            {/* Contador y filtros (accesible para futuras expansiones) */}
            <div className="mb-8 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-600">
                {componentes.length} {componentes.length === 1 ? 'componente' : 'componentes'} disponibles
              </p>
            </div>

            {/* Grid responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {componentes.map((componente) => (
                <TechnicalCard
                  key={componente.id}
                  componente={componente}
                  onCotizar={handleCotizar}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600 mb-8">
              No hay componentes disponibles en esta categoría.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-lime-500 text-slate-950 font-bold px-6 py-3 rounded-xl hover:bg-lime-600 transition-all"
            >
              Volver al inicio
            </button>
          </div>
        )}
      </div>

      {/* CTA Footer */}
      <div className="bg-white border-t border-gray-200 py-12 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Necesitas una solución personalizada?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Contacta con nuestro equipo técnico para consultas sobre compatibilidad, tiempos de entrega o volúmenes especiales.
          </p>
          <button
            onClick={() => router.push('/solicitar-muestra')}
            className="bg-lime-500 text-slate-950 font-bold px-8 py-4 rounded-2xl hover:bg-lime-600 transition-all shadow-[0_0_20px_rgba(132,204,22,0.2)] active:scale-95"
          >
            Contactar Ventas B2B
          </button>
        </div>
      </div>
    </div>
  );
}
