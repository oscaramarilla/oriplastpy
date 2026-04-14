export interface Especificaciones {
  espesor?: string;
  textura?: string;
  refuerzo?: string;
  fijacion?: string;
  dimensiones?: string;
  adicional?: string;
}

export interface ColorNivel {
  nivel: string;
  pantone: string;
  hex: string;
}

export interface ComponenteTecnico {
  id: string;
  nombre: string;
  familia: 'asientos' | 'respaldos' | 'tampos' | 'accesorios';
  material: string;
  normativa: string[];
  especificaciones: Especificaciones;
  compatibilidadMEC: boolean;
  coloresPantone: ColorNivel[];
}

// Paleta de colores oficial MEC / ITAIPU
const COLORES_OFICIALES = {
  inicial: { nivel: 'Educación Inicial', pantone: '151 C', hex: '#FF8200' },
  ciclo1: { nivel: '1er Ciclo', pantone: '1235-C', hex: '#FFA300' },
  ciclo2: { nivel: '2do Ciclo', pantone: '193-C', hex: '#BF0D3E' },
  ciclo3Media: { nivel: '3er Ciclo / Media / Permanente', pantone: '425-C', hex: '#54585A' },
};

export const CATALOGO_B2B: ComponenteTecnico[] = [
  {
    id: 'tampo-travesano',
    nombre: 'Tampo Escolar con Travesaño',
    familia: 'tampos',
    material: 'ABS o Polipropileno (PP) virgen',
    normativa: ['ABNT NBR 14006/22', 'NBR 14535:2008'],
    especificaciones: {
      espesor: '22mm (± 2mm)',
      textura: 'Laminado melamina 0,8mm texturizado semimate antirreflejo',
      refuerzo: 'Aletas de refuerzo perimetral y central',
      fijacion: '6 tuercas de garra M6 coinyectadas'
    },
    compatibilidadMEC: true,
    coloresPantone: [COLORES_OFICIALES.ciclo3Media] // El laminado superior suele ser gris claro 428-C, base oscura
  },
  {
    id: 'asiento-universal',
    nombre: 'Asiento Escolar Anatómico',
    familia: 'asientos',
    material: 'Polipropileno (PP) virgen o ABS libre de cargas',
    normativa: ['ABNT NBR 14006/22', 'NM 300-3'],
    especificaciones: {
      textura: 'Reticulado antideslizante (máx. 45 micras)',
      refuerzo: 'Aletas de refuerzo en toda la superficie',
      fijacion: 'Mínimo 4 remaches Ø 4,8mm x 12mm'
    },
    compatibilidadMEC: true,
    coloresPantone: [
      COLORES_OFICIALES.inicial, 
      COLORES_OFICIALES.ciclo1, 
      COLORES_OFICIALES.ciclo2, 
      COLORES_OFICIALES.ciclo3Media
    ]
  },
  {
    id: 'respaldo-universal',
    nombre: 'Respaldo Escolar con Aletas',
    familia: 'respaldos',
    material: 'Polipropileno (PP) virgen o ABS libre de cargas',
    normativa: ['ABNT NBR 14006/22', 'NM 300-3'],
    especificaciones: {
      textura: 'Reticulado antideslizante (máx. 45 micras)',
      refuerzo: 'Aletas horizontales o mixtas',
      fijacion: 'Mínimo 4 remaches Ø 4,8mm x 12mm',
      adicional: 'Apto para tampografía y grabado láser'
    },
    compatibilidadMEC: true,
    coloresPantone: [
      COLORES_OFICIALES.inicial, 
      COLORES_OFICIALES.ciclo1, 
      COLORES_OFICIALES.ciclo2, 
      COLORES_OFICIALES.ciclo3Media
    ]
  },
  {
    id: 'portalibros-reciclado',
    nombre: 'Portalibros Inyectado',
    familia: 'accesorios',
    material: 'Polipropileno (preferentemente 100% reciclado)',
    normativa: ['ABNT NBR 14006/22'],
    especificaciones: {
      dimensiones: 'Aprox. 510mm x 310mm',
      textura: 'Acabado reticulado',
      refuerzo: 'Estrías de refuerzo en la parte inferior',
      fijacion: '4 remaches tipo resorte 4,0x10mm'
    },
    compatibilidadMEC: true,
    coloresPantone: [COLORES_OFICIALES.ciclo3Media] // Gris 425-C
  },
  {
    id: 'zapata-puntera',
    nombre: 'Zapatas y Punteras para Estructuras',
    familia: 'accesorios',
    material: 'Polipropileno (PP) virgen',
    normativa: ['ABNT NBR 14006/22'],
    especificaciones: {
      fijacion: 'Ajuste por encastre y remaches tipo resorte',
      adicional: 'Punteras anteriores requieren remache adicional (Ø 4,8mm)'
    },
    compatibilidadMEC: true,
    coloresPantone: [
      COLORES_OFICIALES.inicial, 
      COLORES_OFICIALES.ciclo1, 
      COLORES_OFICIALES.ciclo2, 
      COLORES_OFICIALES.ciclo3Media
    ]
  }
];
