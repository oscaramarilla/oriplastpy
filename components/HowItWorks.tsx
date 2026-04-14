// components/HowItWorks.tsx
export default function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Selección Técnica",
      desc: "Explore las familias de productos y verifique medidas y compatibilidad con sus estructuras."
    },
    {
      id: "02",
      title: "Cotización B2B",
      desc: "Genere su presupuesto personalizado indicando volumen mensual y rubro industrial."
    },
    {
      id: "03",
      title: "Despacho de Fábrica",
      desc: "Confirmamos disponibilidad y coordinamos la entrega inmediata en su planta o depósito."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 uppercase">
            Proceso de Abastecimiento
          </h2>
          <p className="mt-2 text-slate-500">Simple, profesional y directo a su línea de producción.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          {/* Línea decorativa para desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-0"></div>
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center text-2xl font-black text-slate-950 shadow-[0_0_20px_rgba(163,230,53,0.4)] group-hover:scale-110 transition-transform mb-6">
                {step.id}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase italic tracking-tighter">
                {step.title}
              </h3>
              <p className="text-slate-500 text-sm max-w-xs">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
