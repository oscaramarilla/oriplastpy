import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cotizador B2B | Oriplast Paraguay",
  description:
    "Cotizá conjuntos y componentes plásticos para mobiliario escolar con despiece, moneda y tipo de cambio auditables.",
};

export default function CotizadorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
