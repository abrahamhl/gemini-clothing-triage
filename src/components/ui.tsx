import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "soft" | "ghost" | "outline" | "danger";

const VARIANTS: Record<Variant, string> = {
  primary: "brand-gradient text-white hover:opacity-90 shadow-sm",
  soft: "bg-primary-soft text-primary hover:bg-primary-soft/70",
  ghost: "text-muted hover:bg-surface-2 hover:text-text",
  outline: "border border-border text-text hover:bg-surface-2",
  danger: "bg-[#fdecec] text-danger hover:bg-[#fbdcdc]",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("card p-5", className)}>{children}</div>;
}

export function Badge({
  tone,
  children,
}: {
  tone: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone,
      )}
    >
      {children}
    </span>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
    />
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className={cn("card p-5", accent && "brand-gradient text-white border-0")}>
      <p className={cn("text-xs font-medium", accent ? "text-white/80" : "text-muted")}>
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
      {hint && (
        <p className={cn("mt-1 text-xs", accent ? "text-white/70" : "text-muted")}>
          {hint}
        </p>
      )}
    </div>
  );
}
