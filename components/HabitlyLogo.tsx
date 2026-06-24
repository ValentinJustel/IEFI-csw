import React from "react"

interface HabitlyLogoProps {
  className?: string
  size?: number
}

export function HabitlyLogo({ className = "", size = 32 }: HabitlyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Definición del degradado orgánico moderno */}
      <defs>
        <linearGradient id="habitlyGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" /> {/* Indigo base de tu app */}
          <stop offset="50%" stopColor="#8b5cf6" /> {/* Violeta intermedio */}
          <stop offset="100%" stopColor="#ec4899" /> {/* Toque coral/rosa orgánico */}
        </linearGradient>
      </defs>

      {/* Trazo izquierdo de la H (Curvo y redondeado) */}
      <path
        d="M25 20C25 14.4772 29.4772 10 35 10C40.5228 10 45 14.4772 45 20V45C45 45 35 45 30 50C25 55 25 65 25 80C25 85.5228 20.5228 90 15 90C9.47715 90 5 85.5228 5 80C5 55 15 20 25 20Z"
        fill="url(#habitlyGradient)"
        opacity="0.85"
      />

      {/* Trazo derecho de la H integrado con el bucle orgánico central */}
      <path
        d="M75 80C75 85.5228 70.5228 90 65 90C59.4772 90 55 85.5228 55 80V50C55 40 68 35 75 45C82 55 80 68 70 72C60 76 50 65 50 50V20C50 14.4772 54.4772 10 60 10C65.5228 10 70 14.4772 70 20C70 40 85 45 91 55C97 65 95 80 75 80Z"
        fill="url(#habitlyGradient)"
      />

      {/* Pequeño punto/brote de crecimiento en el espacio negativo superior */}
      <circle cx="50" cy="22" r="6" fill="#ec4899" className="animate-pulse" />
    </svg>
  )
}