import Link from "next/link";

export function HabitSyncLogo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <span className="text-primary-foreground font-bold text-lg">H</span>
      </div>
      <span className="font-bold text-xl text-foreground">HabitSync</span>
    </Link>
  );
}