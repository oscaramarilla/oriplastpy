export default function Navbar() {
  return (
    <header className="w-full bg-white shadow-sm">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <img src="/images/logo.png" className="h-10"/>

        <nav className="hidden md:flex gap-10 font-medium text-gray-700">

          <a className="hover:text-green-600 transition">Principal</a>
          <a className="hover:text-green-600 transition">Produtos</a>
          <a className="hover:text-green-600 transition">Empresa</a>
          <a className="hover:text-green-600 transition">Contato</a>

        </nav>

        <button className="md:hidden text-2xl">
          ☰
        </button>

      </div>

    </header>
  )
}