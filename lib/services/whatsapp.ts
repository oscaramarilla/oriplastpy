import type { ProductItem } from "../config/solicitud-muestra";
import { WHATSAPP_NUMBER } from "../config/solicitud-muestra";
import type { SolicitudMuestra } from "../domain/solicitud-muestra";
import type { DatosPerfiladoB2B } from "../domain/perfilado-b2b";

export function buildWhatsappMessage(data: SolicitudMuestra, catalog: ProductItem[]): string {
  const productLines = data.productos
    .map((product) => {
      const item = catalog.find((catalogItem) => catalogItem.id === product.id);
      const label = item?.label ?? product.id;
      return `- ${label}: ${product.quantity}`;
    })
    .join("\n");

  return `Hola OriplastPy,%0A%0AQuiero solicitar muestras de producto con estos datos:%0A%0ANombre: ${encodeURIComponent(data.nombre)}%0AEmpresa: ${encodeURIComponent(data.empresa)}%0AEmail: ${encodeURIComponent(data.email)}%0ATeléfono: ${encodeURIComponent(data.telefono)}%0ADepartamento: ${encodeURIComponent(data.departamento)}%0A%0AProductos:%0A${encodeURIComponent(productLines)}%0A%0AGracias.`;
}

export function generateWhatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

export function generarMensajePerfilado(datos: DatosPerfiladoB2B): string {
  const rubroMap: Record<string, string> = {
    'metalurgica': 'Metalúrgica',
    'muebleria': 'Mueblería',
    'licitacion-mec': 'Licitación MEC',
    'otro': 'Otro'
  };

  const mensajeStructurado = `
*COTIZACIÓN B2B - ORIPLAST/METAL MAD*

*DATOS DEL CLIENTE:*
*Nombre/Cargo:* ${datos.nombreCargo}
*Empresa:* ${datos.empresa}
*Rubro:* ${rubroMap[datos.rubro] || datos.rubro}
*Volumen estimado:* ${datos.volumenEstimado}
${datos.productoInteres ? `*Producto de interés:* ${datos.productoInteres}` : ''}

Solicito cotización para evaluar colaboración mayorista.
  `.trim();

  return encodeURIComponent(mensajeStructurado);
}

