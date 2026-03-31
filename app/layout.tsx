import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Oriplast",
  description: "Plásticos Injetados"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className="bg-gray-50 text-gray-800">
        {children}
      </body>
    </html>
  )
}