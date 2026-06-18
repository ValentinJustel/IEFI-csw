const steps = [
  {
    number: "01",
    title: "Define tus hábitos",
    description:
      "Elige los hábitos que quieres desarrollar. Puedes empezar con nuestras plantillas o crear los tuyos propios.",
  },
  {
    number: "02",
    title: "Establece tu rutina",
    description:
      "Configura recordatorios, frecuencia y metas personalizadas para cada hábito según tu estilo de vida.",
  },
  {
    number: "03",
    title: "Registra tu progreso",
    description:
      "Marca tus hábitos completados cada día con un solo toque. Simple, rápido y satisfactorio.",
  },
  {
    number: "04",
    title: "Celebra tus logros",
    description:
      "Observa cómo crecen tus rachas, desbloquea insignias y conviértete en la mejor versión de ti mismo.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-6 lg:px-8 bg-secondary/50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Cómo funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Comenzar es más fácil de lo que piensas. En solo 4 pasos estarás
            construyendo hábitos que duran.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-border" />
              )}
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6 relative z-10">
                  <span className="text-primary-foreground font-bold text-lg">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
