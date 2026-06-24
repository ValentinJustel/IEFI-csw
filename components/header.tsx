"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
// 💎 IMPORTANTE: Asegurate de cambiar esta ruta según dónde guardaste el componente del logo
import { HabitlyLogo } from "@/components/HabitlyLogo";

const navLinks = [
  { label: "Características", href: "#features" },
  { label: "Cómo funciona", href: "#how-it-works" },
  { label: "Testimonios", href: "#testimonials" },
  { label: "Precios", href: "#pricing" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo orgánico y dinámico */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <HabitlyLogo size={32} className="transition-transform group-hover:scale-105 duration-200" />
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
              Habitly
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="cursor-pointer">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="cursor-pointer">Comenzar gratis</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Link href="/login">
                  <Button variant="ghost" className="w-full justify-start cursor-pointer">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full cursor-pointer">Comenzar gratis</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}