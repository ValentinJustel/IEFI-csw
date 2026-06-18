"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 lg:px-8 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-foreground">
            Más de 50,000 usuarios activos
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight text-balance mb-6">
          Construye hábitos que{" "}
          <span className="text-accent">transforman</span> tu vida
        </h1>

        {/* Subtitle */}
        <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
          La forma más inteligente de crear rutinas duraderas. Seguimiento
          visual, recordatorios personalizados y estadísticas que te motivan.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="text-lg px-8 py-6 gap-2 cursor-pointer">
            Comenzar gratis
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 cursor-pointer"
          >
            Ver demostración
          </Button>
        </div>

        {/* Trust indicators */}
        <p className="mt-8 text-sm text-muted-foreground">
          Sin tarjeta de crédito · Configuración en 2 minutos · Cancela cuando
          quieras
        </p>
      </div>
    </section>
  );
}
