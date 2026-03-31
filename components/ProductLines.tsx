export default function ProductLines() {

  const lines = [
    { name: "Linha Escolar", img: "/images/desk-green.png" },
    { name: "Linha Pratice", img: "/images/pratice.png" },
    { name: "Linha Vidraçaria", img: "/images/vidracaria.png" },
    { name: "Linha Oriplast", img: "/images/oriplast.png" }
  ]

  return (

    <section className="py-24 bg-gray-50">

      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-4xl font-bold mb-16">
          Nossas Linhas
        </h2>

        <div className="grid md:grid-cols-4 gap-10">

          {lines.map((line, i) => (

            <div
              key={i}
              className="bg-white rounded-xl p-10 shadow hover:shadow-xl hover:-translate-y-2 transition"
            >

              <img src={line.img} className="w-20 mx-auto mb-6"/>

              <h3 className="font-semibold text-lg">
                {line.name}
              </h3>

            </div>

          ))}

        </div>

      </div>

    </section>
  )
}