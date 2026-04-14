import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import ProductLines from "@/components/ProductLines"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <div id="productos">
        <ProductLines />
      </div>
      <Footer />
    </main>
  )
}
