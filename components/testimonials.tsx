import { Star } from "lucide-react";

const testimonials = [
  {
    name: "María García",
    role: "Emprendedora",
    content:
      "Habitly cambió mi vida. Después de años intentando crear una rutina de ejercicio, finalmente lo logré. Llevo 90 días de racha y me siento increíble.",
    avatar: "MG",
    rating: 5,
  },
  {
    name: "Carlos Rodríguez",
    role: "Desarrollador",
    content:
      "Las estadísticas detalladas me ayudaron a identificar mis patrones. Ahora soy mucho más productivo y he eliminado hábitos negativos.",
    avatar: "CR",
    rating: 5,
  },
  {
    name: "Ana Martínez",
    role: "Estudiante",
    content:
      "La comunidad de Habitly es increíble. Los retos grupales me mantienen motivada y he conocido personas con objetivos similares a los míos.",
    avatar: "AM",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Miles de personas ya están transformando sus vidas con Habitly.
            Estas son algunas de sus historias.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground leading-relaxed mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-accent font-semibold">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
