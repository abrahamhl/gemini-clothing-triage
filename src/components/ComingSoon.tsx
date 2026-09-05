import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui";

export function ComingSoon({
  title,
  lead,
  points,
}: {
  title: string;
  lead: string;
  points: string[];
}) {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary">
          Próximamente
        </span>
      </div>
      <p className="mt-1 max-w-2xl text-sm text-muted">{lead}</p>

      <Card className="mt-5">
        <p className="text-sm font-medium">Qué incluirá este módulo</p>
        <ul className="mt-3 space-y-2.5">
          {points.map((p) => (
            <li key={p} className="flex gap-2 text-sm">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
