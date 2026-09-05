"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  Camera,
  LayoutDashboard,
  Layers,
  Megaphone,
  Plug,
  Settings,
  Sparkles,
  Target,
} from "lucide-react";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inventario", label: "Inventario", icon: Boxes },
  { href: "/capturar", label: "Capturar", icon: Camera },
  { href: "/analisis", label: "Análisis IA", icon: Sparkles },
  { href: "/lotes", label: "Lotes Inteligentes", icon: Layers },
  { href: "/anuncios", label: "Anuncios", icon: Megaphone },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/estrategias", label: "Estrategias", icon: Target },
  { href: "/distribuidores", label: "B2B Leads", icon: Target },
  { href: "/integraciones", label: "Integraciones", icon: Plug },
  { href: "/configuracion", label: "Configuración", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface/60 px-4 py-5 md:flex">
      <Link href="/" className="mb-6 flex items-center gap-2.5 px-2">
        <span className="brand-gradient flex size-8 items-center justify-center rounded-xl text-white">
          <Sparkles className="size-4" />
        </span>
        <span className="text-lg font-semibold tracking-tight">lean ai</span>
      </Link>

      <nav className="scroll-area flex-1 space-y-1 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-primary-soft text-primary"
                  : "text-muted hover:bg-surface-2 hover:text-text",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <p className="px-3 pt-4 text-[11px] leading-relaxed text-muted">
        Convierte fotos en decisiones rentables.
      </p>
    </aside>
  );
}
