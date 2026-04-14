'use client';

import { ComponenteTecnico } from '@/lib/config/catalogo';

interface TechnicalCardProps {
  componente: ComponenteTecnico;
  onCotizar: (id: string, nombre: string) => void;
}

export default function TechnicalCard({ componente, onCotizar }: TechnicalCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-xl hover:border-lime-100/50 transition-all duration-300">
      {/* Header con Compatibilidad MEC */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">
            {componente.nombre}
          </h3>
          <p className="text-sm text-gray-600 font-medium">{componente.material}</p>
        </div>
        {componente.compatibilidadMEC && (
          <div className="flex-shrink-0">
            <span className="inline-flex items-center rounded-full bg-lime-50/50 px-3 py-1 text-xs font-bold text-lime-700 border border-lime-100/50">
              ✓ MEC
            </span>
          </div>
        )}
      </div>

      {/* Especificaciones técnicas */}
      <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
        {componente.especificaciones.espesor && (
          <div className="text-sm">
            <span className="font-semibold text-gray-900">Espesor:</span>
            <span className="text-gray-600 ml-2">{componente.especificaciones.espesor}</span>
          </div>
        )}
        {componente.especificaciones.textura && (
          <div className="text-sm">
            <span className="font-semibold text-gray-900">Textura:</span>
            <span className="text-gray-600 ml-2">{componente.especificaciones.textura}</span>
          </div>
        )}
        {componente.especificaciones.refuerzo && (
          <div className="text-sm">
            <span className="font-semibold text-gray-900">Refuerzo:</span>
            <span className="text-gray-600 ml-2">{componente.especificaciones.refuerzo}</span>
          </div>
        )}
        {componente.especificaciones.fijacion && (
          <div className="text-sm">
            <span className="font-semibold text-gray-900">Fijación:</span>
            <span className="text-gray-600 ml-2">{componente.especificaciones.fijacion}</span>
          </div>
        )}
        {componente.especificaciones.dimensiones && (
          <div className="text-sm">
            <span className="font-semibold text-gray-900">Dimensiones:</span>
            <span className="text-gray-600 ml-2">{componente.especificaciones.dimensiones}</span>
          </div>
        )}
        {componente.especificaciones.adicional && (
          <div className="text-sm">
            <span className="font-semibold text-gray-900">Adicional:</span>
            <span className="text-gray-600 ml-2">{componente.especificaciones.adicional}</span>
          </div>
        )}
      </div>

      {/* Normativas */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-2">
          Normativas
        </p>
        <div className="flex flex-wrap gap-2">
          {componente.normativa.map((norma) => (
            <span key={norma} className="text-xs bg-gray-50 text-gray-700 px-3 py-1 rounded-full border border-gray-200">
              {norma}
            </span>
          ))}
        </div>
      </div>

      {/* Colores Pantone */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">
          Colores disponibles (Pantone)
        </p>
        <div className="flex flex-wrap gap-3">
          {componente.coloresPantone.map((color) => (
            <div key={color.pantone} className="flex items-center gap-2 group">
              <div
                className="w-10 h-10 rounded-full shadow-sm border-2 border-gray-200 transition-transform group-hover:scale-110"
                style={{ backgroundColor: color.hex }}
                title={`${color.nivel} - Pantone ${color.pantone}`}
              />
              <div className="hidden group-hover:block absolute bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                {color.nivel}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Principal */}
      <button
        onClick={() => onCotizar(componente.id, componente.nombre)}
        className="w-full bg-lime-500 text-slate-950 font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(132,204,22,0.2)] hover:bg-lime-600 active:scale-95 transition-all duration-200 text-lg"
      >
        Cotizar Lote
      </button>
    </div>
  );
}
