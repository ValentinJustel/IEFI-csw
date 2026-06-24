"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";;
import Link from "next/link";
import { motion, Variants } from "framer-motion";

export function Hero() {
  // Configuración de la animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } // Usar array de bezier o 'as any' para forzar
  }
};

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-6 lg:px-8 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <motion.div 
        className="max-w-5xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-foreground">
            Más de 50,000 usuarios activos
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight text-balance mb-6">
          Construye hábitos que{" "}
          <span className="text-accent">transforman</span> tu vida
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-pretty">
          La forma más inteligente de crear rutinas duraderas. Seguimiento
          visual, recordatorios personalizados y estadísticas que te motivan.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="text-lg px-8 py-6 gap-2 cursor-pointer">
            <Link href="/register">
              Comenzar gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 cursor-pointer"
          >
            Ver demostración
          </Button>
        </motion.div>

        {/* Trust indicators */}
        <motion.p variants={itemVariants} className="mt-8 text-sm text-muted-foreground">
          Sin tarjeta de crédito · Configuración en 2 minutos · Cancela cuando
          quieras
        </motion.p>
      </motion.div>
    </section>
  );
}