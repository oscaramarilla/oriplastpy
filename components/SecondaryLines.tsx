export default function SecondaryLines() {
  const lines = [
    { name: 'Línea Practice', desc: 'Mobiliario auxiliar' },
    { name: 'Línea Vidriería', desc: 'Accesorios técnicos' },
    { name: 'Línea Oriplast General', desc: 'Inyectados varios' },
  ];

  return (
    <section className="py-8 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 text-center">
          Otras Líneas Disponibles
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {lines.map((line) => (
            <div key={line.name} className="bg-white p-4 rounded-lg border border-gray-200 opacity-70 hover:opacity-100 transition-opacity">
              <h4 className="text-sm font-bold text-gray-800">{line.name}</h4>
              <p className="text-xs text-gray-500">{line.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
