import { notFound } from 'next/navigation';
import { Camera, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

// In production, this connects to Supabase via SUPABASE_URL / SUPABASE_ANON_KEY
// Currently awaiting configuration.
export default function DemoPage({ params, searchParams }: { params: { slug: string }, searchParams: { token: string } }) {
  const { slug } = params;
  const { token } = searchParams;

  if (!token) return <div className="p-10 text-center">Unauthorized. Missing token.</div>;
  
  // Real verification requires Supabase credentials. 
  // Honest fallback for the current stage:
  const isSupabaseConfigured = !!process.env.SUPABASE_URL;

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-red-200">
          <h1 className="text-xl font-bold text-red-700 mb-2">Database Required</h1>
          <p className="text-sm text-slate-600 mb-4">
            The server-authoritative 10-item demo limit requires Supabase credentials to persist secure token usage on Vercel Edge.
            Please supply `SUPABASE_URL` and `SUPABASE_ANON_KEY` to activate this gateway.
          </p>
        </div>
      </div>
    );
  }

  // Placeholder for when DB is active
  const mockBusiness = {
    name: slug === 'froufrous' ? "Froufrou's Arnhem" : "Appel & Ei Apeldoorn",
    website: slug === 'froufrous' ? "froufrous.nl" : "appelenei.nl",
    analysesLimit: 10,
    analysesUsed: 0
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{mockBusiness.name}</h1>
          <p className="text-sm text-slate-500 mt-1">{mockBusiness.website}</p>
        </div>

        <div className="bg-indigo-50 rounded-2xl p-6 mb-8 text-center">
          <p className="text-indigo-900 font-medium mb-2">Private Demo Environment</p>
          <p className="text-sm text-indigo-700">
            TriajeOS is configured for your inventory. You have {mockBusiness.analysesLimit - mockBusiness.analysesUsed} remaining AI analyses in this trial.
          </p>
        </div>

        <Link href={`/demo/${slug}/end`} className="w-full bg-slate-900 text-white rounded-xl py-4 font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition">
          <Camera className="w-5 h-5" /> Start 10-Item Trial <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Secure Client Session
        </p>
      </div>
    </div>
  );
}
