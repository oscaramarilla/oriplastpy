import type { ProductItem } from "../config/solicitud-muestra";
import { WHATSAPP_NUMBER } from "../config/solicitud-muestra";
import type { SolicitudMuestra } from "../domain/solicitud-muestra";
import type { DatosPerfiladoB2B } from "../domain/perfilado-b2b";
import type { CodigoISO } from "../domain/lista-precios";

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

export interface LineaMensajeCotizacion {
  codigo: string;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface DatosMensajeCotizacion {
  conjunto: string;
  cantidad_conjuntos: number;
  moneda: CodigoISO;
  lineas: readonly LineaMensajeCotizacion[];
  subtotal: number;
  descuento: number;
  iva: number;
  total: number;
  lista_id: string;
  tipo_cambio: number;
  fecha_iso: string;
}

const decimales = (moneda: CodigoISO) => (moneda === "PYG" ? 0 : 2);

export function formatearMoneda(valor: number, moneda: CodigoISO): string {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: moneda,
    minimumFractionDigits: decimales(moneda),
    maximumFractionDigits: decimales(moneda),
  }).format(valor);
}

export function construirMensajeCotizacion(
  datos: DatosMensajeCotizacion,
): string {
  const detalle = datos.lineas
    .map(
      (linea) =>
        `• ${linea.descripcion} (${linea.codigo})\n` +
        `  ${linea.cantidad} un. × ${formatearMoneda(linea.precio_unitario, datos.moneda)} = ` +
        formatearMoneda(linea.subtotal, datos.moneda),
    )
    .join("\n");

  const resumen = [
    `Subtotal: ${formatearMoneda(datos.subtotal, datos.moneda)}`,
    datos.descuento > 0
      ? `Descuento por pago anticipado: −${formatearMoneda(datos.descuento, datos.moneda)}`
      : null,
    datos.iva > 0
      ? `IVA 10%: ${formatearMoneda(datos.iva, datos.moneda)}`
      : null,
    `*TOTAL ESTIMADO: ${formatearMoneda(datos.total, datos.moneda)}*`,
  ]
    .filter(Boolean)
    .join("\n");

  return [
    "Hola, quiero validar esta cotización B2B:",
    "",
    `*${datos.conjunto}*`,
    `${datos.cantidad_conjuntos} conjuntos`,
    "",
    "*Despiece de componentes*",
    detalle,
    "",
    resumen,
    "",
    `Lista congelada: ${datos.lista_id}`,
    `TC congelado: 1 BRL = ${datos.tipo_cambio.toLocaleString("es-PY", {
      maximumFractionDigits: 4,
    })} ${datos.moneda}`,
    `Fecha: ${datos.fecha_iso}`,
    "",
    "Solicito confirmación de disponibilidad, plazo de entrega y flete.",
  ].join("\n");
}

export function generarLinkWhatsapp(numero: string, mensaje: string): string {
  const soloDigitos = numero.replace(/\D/g, "");
  return `https://wa.me/${soloDigitos}?text=${encodeURIComponent(mensaje)}`;
}

