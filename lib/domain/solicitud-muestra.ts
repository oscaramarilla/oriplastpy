import type { ProductItem } from "@/lib/config/solicitud-muestra";

export interface SelectedProduct {
  id: string;
  quantity: number;
}

export interface SolicitudMuestra {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  departamento: string;
  productos: SelectedProduct[];
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_TELEFONO_DIGITS = 7;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function countDigits(value: string): number {
  return value.replace(/\D/g, "").length;
}

export function validateSelectedProducts(products: SelectedProduct[]): ValidationResult {
  const errors: Record<string, string> = {};

  if (!Array.isArray(products) || products.length === 0) {
    errors.productos = "Debes seleccionar al menos un producto.";
    return { valid: false, errors };
  }

  const invalidItem = products.find(
    (product) => !product.id || typeof product.quantity !== "number" || product.quantity <= 0
  );

  if (invalidItem) {
    errors.productos = "Cada producto debe tener una cantidad válida mayor a cero.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateSolicitud(data: Partial<SolicitudMuestra>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.nombre?.trim()) {
    errors.nombre = "El nombre es obligatorio.";
  }

  if (!data.empresa?.trim()) {
    errors.empresa = "La empresa es obligatoria.";
  }

  if (!data.email?.trim() || !isValidEmail(data.email)) {
    errors.email = "El email debe tener un formato válido.";
  }

  if (!data.telefono?.trim() || countDigits(data.telefono) < MIN_TELEFONO_DIGITS) {
    errors.telefono = `El teléfono debe tener al menos ${MIN_TELEFONO_DIGITS} dígitos.`;
  }

  if (!data.departamento?.trim()) {
    errors.departamento = "El departamento es obligatorio.";
  }

  const productsValidation = validateSelectedProducts(data.productos ?? []);
  if (!productsValidation.valid) {
    errors.productos = productsValidation.errors.productos;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function buildSolicitudSummary(data: SolicitudMuestra, catalog: ProductItem[]): string {
  const productLines = data.productos
    .map((product) => {
      const item = catalog.find((catalogItem) => catalogItem.id === product.id);
      const label = item?.label ?? product.id;
      return `- ${label}: ${product.quantity}`;
    })
    .join("\n");

  return `Nombre: ${data.nombre}\nEmpresa: ${data.empresa}\nEmail: ${data.email}\nTeléfono: ${data.telefono}\nDepartamento: ${data.departamento}\nProductos:\n${productLines}`;
}
