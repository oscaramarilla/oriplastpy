import "./globals.css"
import type { Metadata, Viewport } from "next"
import Script from "next/script"

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
      <head>
        {/* Google Analytics */}
        <Script 
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" 
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
      </head>
      <body className="bg-gray-50 text-gray-800 antialiased selection:bg-lime-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  )
}
