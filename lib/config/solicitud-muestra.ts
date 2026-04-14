export type ProductCategory =
  | "TAMPOS"
  | "ASIENTOS POR NIVEL"
  | "RESPALDOS POR NIVEL"
  | "ACCESORIOS";

export interface ProductItem {
  id: string;
  category: ProductCategory;
  label: string;
}

export const WHATSAPP_NUMBER = "595982451828";

export const PRODUCT_CATALOG: ProductItem[] = [
  {
    id: "tampo-con-travesano",
    category: "TAMPOS",
    label: "Tampo con travesaño",
  },
  {
    id: "asiento-nivel-inicial",
    category: "ASIENTOS POR NIVEL",
    label: "Asiento Nivel Inicial",
  },
  {
    id: "asiento-1er-ciclo",
    category: "ASIENTOS POR NIVEL",
    label: "Asiento 1er ciclo",
  },
  {
    id: "asiento-2do-ciclo",
    category: "ASIENTOS POR NIVEL",
    label: "Asiento 2do ciclo",
  },
  {
    id: "asiento-3er-ciclo",
    category: "ASIENTOS POR NIVEL",
    label: "Asiento 3er ciclo",
  },
  {
    id: "respaldo-nivel-inicial",
    category: "RESPALDOS POR NIVEL",
    label: "Respaldo Nivel Inicial",
  },
  {
    id: "respaldo-1er-3er-ciclo",
    category: "RESPALDOS POR NIVEL",
    label: "Respaldo 1er-3er ciclo",
  },
  {
    id: "porta-libros",
    category: "ACCESORIOS",
    label: "Porta libros",
  },
  {
    id: "puntera-superior",
    category: "ACCESORIOS",
    label: "Puntera superior",
  },
  {
    id: "puntera-con-pino",
    category: "ACCESORIOS",
    label: "Puntera con pino",
  },
  {
    id: "zapata-frontal",
    category: "ACCESORIOS",
    label: "Zapata frontal",
  },
  {
    id: "zapata-posterior",
    category: "ACCESORIOS",
    label: "Zapata posterior",
  },
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "TAMPOS",
  "ASIENTOS POR NIVEL",
  "RESPALDOS POR NIVEL",
  "ACCESORIOS",
];
