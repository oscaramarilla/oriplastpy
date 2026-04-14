import type { ProductItem } from "../config/solicitud-muestra";
import { WHATSAPP_NUMBER } from "../config/solicitud-muestra";
import type { SolicitudMuestra } from "../domain/solicitud-muestra";

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
