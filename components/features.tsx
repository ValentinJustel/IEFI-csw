import {
  Target,
  BarChart3,
  Bell,
  Users,
  Zap,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Seguimiento visual",
    description:
      "Visualiza tu progreso con calendarios de racha y gráficos intuitivos que te mantienen motivado.",
  },
  {
    icon: Bell,
    title: "Recordatorios inteligentes",
    description:
      "Recibe notificaciones en el momento perfecto, adaptadas a tu rutina y preferencias personales.",
  },
  {
    icon: BarChart3,
    title: "Estadísticas detalladas",
    description:
      "Analiza tu rendimiento con métricas completas y descubre patrones para optimizar tu productividad.",
  },
  {
    icon: Users,
    title: "Comunidad de apoyo",
    description:
      "Conecta con otros usuarios, comparte logros y mantén la motivación con retos grupales.",
  },
  {
    icon: Zap,
    title: "Automatizaciones",
    description:
      "Configura hábitos encadenados y rutinas automáticas para maximizar tu eficiencia diaria.",
  },
  {
    icon: Shield,
    title: "Privacidad garantizada",
    description:
      "Tus datos están seguros. Encriptación de extremo a extremo y sin venta de información personal.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Todo lo que necesitas para{" "}
            <span className="text-accent">crear hábitos</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Herramientas poderosas diseñadas para ayudarte a construir la mejor
            versión de ti mismo.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
