export interface DatosPerfiladoB2B {
  nombreCargo: string;
  empresa: string;
  rubro: 'metalurgica' | 'muebleria' | 'licitacion-mec' | 'otro';
  volumenEstimado: string;
  productoInteres?: string;
}

export interface ValidationResultPerfilado {
  valid: boolean;
  errors: {
    nombreCargo?: string;
    empresa?: string;
    rubro?: string;
    volumenEstimado?: string;
  };
}

const MIN_EMPRESA_LENGTH = 2;
const MIN_VOLUMEN_LENGTH = 1;

export function validatePerfiladoB2B(data: DatosPerfiladoB2B): ValidationResultPerfilado {
  const errors: Record<string, string> = {};

  if (!data.nombreCargo.trim()) {
    errors.nombreCargo = 'Requerido para venta mayorista';
  }

  if (data.empresa.trim().length < MIN_EMPRESA_LENGTH) {
    errors.empresa = 'Requerido para venta mayorista';
  }

  if (!data.rubro) {
    errors.rubro = 'Selecciona un rubro';
  }

  if (!data.volumenEstimado.trim()) {
    errors.volumenEstimado = 'Requerido para venta mayorista';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

export function buildPerfiladoSummary(data: DatosPerfiladoB2B): string {
  const rubroMap: Record<string, string> = {
    'metalurgica': 'Metalúrgica',
    'muebleria': 'Mueblería',
    'licitacion-mec': 'Licitación MEC',
    'otro': 'Otro'
  };

  return `
*DATOS DEL CLIENTE:*
Nombre/Cargo: ${data.nombreCargo}
Empresa: ${data.empresa}
Rubro: ${rubroMap[data.rubro] || data.rubro}
Volumen estimado: ${data.volumenEstimado}
${data.productoInteres ? `Producto de interés: ${data.productoInteres}` : ''}
  `.trim();
}
