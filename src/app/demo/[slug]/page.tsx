import { notFound } from 'next/navigation';
import { Camera, ArrowRight, ShieldCheck } from 'lucide-react';

export default function DemoPage({ params, searchParams }: { params: { slug: string }, searchParams: { token: string } }) {
  const { slug } = params;
  const { token } = searchParams;

  // In production, this would query Supabase `public.business_demos`
  // Mocking the server-side DB validation for the architecture case:
  if (!token) return <div className="p-10 text-center">Unauthorized. Missing token.</div>;
  if (slug !== 'froufrous' && slug !== 'appel-en-ei') notFound();

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

        <button className="w-full bg-slate-900 text-white rounded-xl py-4 font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition">
          <Camera className="w-5 h-5" /> Start 10-Item Trial <ArrowRight className="w-4 h-4" />
        </button>

        <p className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Secure Client Session
        </p>
      </div>
    </div>
  );
}
