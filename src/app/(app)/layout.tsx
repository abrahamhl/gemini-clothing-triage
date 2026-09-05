import Link from "next/link";
import { Camera, Sparkles } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface/70 px-4 py-3 backdrop-blur md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="brand-gradient flex size-7 items-center justify-center rounded-lg text-white">
              <Sparkles className="size-3.5" />
            </span>
            <span className="font-semibold">lean ai</span>
          </Link>
          <Link
            href="/capturar"
            className="brand-gradient flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white"
          >
            <Camera className="size-4" /> Capturar
          </Link>
        </header>
        <main className="scroll-area flex-1 overflow-y-auto p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
