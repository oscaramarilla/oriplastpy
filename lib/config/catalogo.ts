// lib/config/catalogo.ts

export interface ComponenteTecnico {
  id: string;
  nombre: string;
  familia: 'asientos' | 'respaldos' | 'tampos' | 'accesorios';
  material: string;
  normativa: string[];
  especificaciones: {
    textura?: string;
    refuerzo?: string;
    fijacion?: string;
    dimensiones?: string;
  };
  compatibilidadMEC: boolean;
  coloresPantone: { [nivel: string]: string };
}

export const CATALOGO_B2B: ComponenteTecnico[] = [
  {
    id: 'asiento-universal',
    nombre: 'Asiento Escolar Inyectado',
    familia: 'asientos',
    material: 'Polipropileno (PP) virgen / ABS libre de cargas ',
    normativa: ['ABNT NBR 14006/22', 'NM 300-3 '],
    especificaciones: {
      textura: 'Antideslizante reticulado (máx. 45 micras) ',
      refuerzo: 'Aletas de fijación y refuerzo en toda la superficie ',
      fijacion: 'Mínimo 4 remaches (Ø 4,8mm x 12mm) '
    },
    compatibilidadMEC: true,
    coloresPantone: {
      'Inicial': '151 C',
      '1er Ciclo': '1235-C',
      '2do Ciclo': '193-C',
      '3er Ciclo/Media': '425-C'
    }
  },
  // Repetir para Respaldos, Tampos (22mm espesor ) y Portalibros (100% reciclado )
];
