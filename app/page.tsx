import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import ProductLines from "@/components/ProductLines"
import SecondaryLines from "@/components/SecondaryLines" // <-- Agregaste esta línea
import Footer from "@/components/Footer"
import FloatingWhatsApp from "@/components/FloatingWhatsApp"


export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative bg-gray-50 pb-20 md:pb-0 scroll-smooth selection:bg-lime-400 selection:text-slate-950">
      
      <Navbar />
      
      <Hero />
      
      {/* Contenedor principal B2B con margen para scroll */}
      <div id="productos" className="flex-grow scroll-mt-20 w-full">
        {/* Catálogo Principal MEC - Alta Jerarquía */}
        <ProductLines />
        
        {/* Catálogo Complementario - Baja Jerarquía */}
        <SecondaryLines />
      </div>
      
      <Footer />
      
      {/* Herramienta de Cierre B2B Móvil */}
      <FloatingWhatsApp />
      
    </main>
  )
}
