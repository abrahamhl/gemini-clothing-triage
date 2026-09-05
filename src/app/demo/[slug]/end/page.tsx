import { CheckCircle2 } from 'lucide-react';

export default function DemoEndPage({ params }: { params: { slug: string } }) {
  // Mock data for ROI metrics
  const metrics = {
    itemsProcessed: 10,
    timeSpentAI: 1.5,
    estimatedManualTime: 45,
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Trial Complete</h1>
          <div className="bg-green-50 text-green-800 p-4 rounded-xl inline-block">
            During this demo, TriajeOS prepared {metrics.itemsProcessed} items in {metrics.timeSpentAI} minutes.<br/>
            (Estimated manual processing time: {metrics.estimatedManualTime} minutes)
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-slate-50 p-6 rounded-2xl border">
            <h2 className="text-xl font-bold text-slate-900 mb-4">€499 (One-Time Setup)</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" /> Initial environment setup</li>
              <li className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" /> Business and inventory configuration</li>
              <li className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" /> Custom listing templates</li>
              <li className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" /> Staff onboarding & product workflow</li>
            </ul>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border">
            <h2 className="text-xl font-bold text-slate-900 mb-4">€99 / Month</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" /> AI Engine access (Cloud Vision logic)</li>
              <li className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" /> Continuous platform maintenance</li>
              <li className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" /> Security updates and support</li>
            </ul>
          </div>
        </div>

        <button className="w-full bg-slate-900 text-white rounded-xl py-4 font-semibold hover:bg-slate-800 transition">
          ACTIVATE TRIAJEOS
        </button>
      </div>
    </div>
  );
}
