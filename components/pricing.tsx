"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Gratis",
    price: "0",
    description: "Perfecto para comenzar tu viaje de hábitos.",
    features: [
      "Hasta 3 hábitos",
      "Seguimiento básico",
      "Recordatorios diarios",
      "Estadísticas semanales",
    ],
    cta: "Comenzar gratis",
    popular: false,
  },
  {
    name: "Pro",
    price: "9",
    description: "Para quienes van en serio con su desarrollo personal.",
    features: [
      "Hábitos ilimitados",
      "Estadísticas avanzadas",
      "Recordatorios personalizados",
      "Temas y personalización",
      "Sincronización en la nube",
      "Soporte prioritario",
    ],
    cta: "Comenzar prueba gratis",
    popular: true,
  },
  {
    name: "Equipos",
    price: "19",
    description: "Ideal para empresas y grupos de trabajo.",
    features: [
      "Todo de Pro",
      "Hasta 50 miembros",
      "Retos de equipo",
      "Panel de administración",
      "Reportes de equipo",
      "Integraciones API",
    ],
    cta: "Contactar ventas",
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 lg:px-8 bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Planes simples y transparentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Elige el plan que mejor se adapte a tus necesidades. Sin costos
            ocultos, sin sorpresas.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl border transition-shadow ${
                plan.popular
                  ? "bg-primary border-primary shadow-xl scale-105"
                  : "bg-card border-border hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-sm font-medium rounded-full">
                  Más popular
                </div>
              )}

              <div className="text-center mb-8">
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    plan.popular ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span
                    className={`text-5xl font-bold ${
                      plan.popular
                        ? "text-primary-foreground"
                        : "text-foreground"
                    }`}
                  >
                    €{plan.price}
                  </span>
                  <span
                    className={
                      plan.popular
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }
                  >
                    /mes
                  </span>
                </div>
                <p
                  className={
                    plan.popular
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.popular ? "bg-accent" : "bg-accent/10"
                      }`}
                    >
                      <Check
                        className={`w-3 h-3 ${
                          plan.popular ? "text-accent-foreground" : "text-accent"
                        }`}
                      />
                    </div>
                    <span
                      className={
                        plan.popular
                          ? "text-primary-foreground"
                          : "text-foreground"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full cursor-pointer ${
                  plan.popular
                    ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                    : ""
                }`}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
