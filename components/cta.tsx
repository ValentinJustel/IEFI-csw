"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link"; // Asegúrate de importar Link

export function CTA() {
  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="p-12 lg:p-16 rounded-3xl bg-primary">
          <h2 className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-6 text-balance">
            Empieza a construir mejores hábitos hoy
          </h2>
          <p className="text-lg lg:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto text-pretty">
            Únete a más de 50,000 personas que ya están transformando sus vidas
            con Habitly. Tu mejor versión te está esperando.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Botón envuelto en Link para redirigir al registro */}
            <Link href="/register">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 gap-2 cursor-pointer"
              >
                Comenzar gratis
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            
          </div>
        </div>
      </div>
    </section>
  );
}