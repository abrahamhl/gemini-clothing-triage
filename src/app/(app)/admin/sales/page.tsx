export default function SalesAdminDashboard() {
  // Mock data for the view
  const summary = {
    total: 120,
    priority: 45,
    audited: 80,
    consentPending: 12,
    demoReady: 8,
    draftReady: 5
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">B2B Sales Engine (Local CRM View)</h1>
      <p className="text-muted-foreground mb-8">This view displays aggregate data. Real leads are stored exclusively in the local CRM directory (not in Git/Vercel) to maintain compliance with data boundaries.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Object.entries(summary).map(([key, value]) => (
          <div key={key} className="bg-slate-100 p-4 rounded-xl border border-slate-200 text-center">
            <p className="text-sm text-slate-500 uppercase tracking-wider">{key}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-medium text-slate-500">Business</th>
              <th className="p-4 font-medium text-slate-500">Score</th>
              <th className="p-4 font-medium text-slate-500">Opportunity</th>
              <th className="p-4 font-medium text-slate-500">Consent</th>
              <th className="p-4 font-medium text-slate-500">Next Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="p-4 font-medium">Froufrou's</td>
              <td className="p-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">95 (PRIORITY)</span></td>
              <td className="p-4">Manual metadata entry detected</td>
              <td className="p-4">CONSENT_PENDING</td>
              <td className="p-4">Verify Visit Notes</td>
            </tr>
            <tr>
              <td className="p-4 font-medium">Appel & Ei</td>
              <td className="p-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">88 (PRIORITY)</span></td>
              <td className="p-4">High inventory rotation</td>
              <td className="p-4">CONSENTED</td>
              <td className="p-4">Generate Email Draft</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
