const stats = [
  { value: "50K+", label: "Usuarios activos" },
  { value: "2M+", label: "Hábitos completados" },
  { value: "95%", label: "Tasa de retención" },
  { value: "4.9", label: "Valoración App Store" },
];

export function Stats() {
  return (
    <section className="py-16 px-6 lg:px-8 border-y border-border bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl lg:text-5xl font-bold text-foreground mb-2">
                {stat.value}
              </p>
              <p className="text-muted-foreground font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
