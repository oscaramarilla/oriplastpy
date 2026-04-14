import "./globals.css"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Oriplast Paraguay | Mobiliario Escolar Inyectado",
  description: "Fábrica de plásticos inyectados. Representante exclusivo en Paraguay: Metal Mad EAS. Cotizá sillas, mesas y accesorios escolares al por mayor."
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-800 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  )
}
