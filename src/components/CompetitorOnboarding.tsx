"use client";
import React, { useState } from "react";
import { Search, MapPin, Target, Eye, Store, ArrowRight, ShieldCheck } from "lucide-react";

export function CompetitorOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [storeName, setStoreName] = useState("");
  const [searching, setSearching] = useState(false);
  const [competitors, setCompetitors] = useState<{name: string, selected: boolean}[]>([]);

  const handleSearch = () => {
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      
      const ALL_STORES = [
        "Kringloopwinkel De 2e Ronde (Velp)",
        "Van Bamboe (Apeldoorn)",
        "Stijlparadijs (Apeldoorn)",
        "Kringloopwinkel Onderdak (Apeldoorn)",
        "Feeën & Feeksen (Apeldoorn)",
        "Appel & Ei (Apeldoorn)",
        "'t Maatje (Apeldoorn)"
      ];
      
      // Select 3 random competitors that are NOT the storeName itself
      const filtered = ALL_STORES.filter(s => !s.toLowerCase().includes(storeName.toLowerCase()));
      const selectedStores = filtered.sort(() => 0.5 - Math.random()).slice(0, 3);
      
      setCompetitors(selectedStores.map((name, idx) => ({ name, selected: idx < 2 })));
      setStep(2);
    }, 1200);
  };

  const toggleCompetitor = (i: number) => {
    const newC = [...competitors];
    newC[i].selected = !newC[i].selected;
    setCompetitors(newC);
  };

  const handleFinish = () => {
    const selected = competitors.filter(c => c.selected).map(c => c.name);
    localStorage.setItem("competitors", JSON.stringify(selected));
    localStorage.setItem("storeName", storeName);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex justify-center mb-2">
              <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center">
                <Store className="h-8 w-8" />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Welkom bij Market Intelligence</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Om onze engine af te stemmen op uw lokale markt, moeten we uw winkel lokaliseren.
              </p>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Wat is de naam van uw winkel?</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Bijv. Appel & Ei Apeldoorn..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
            <button 
              onClick={handleSearch}
              disabled={!storeName || searching}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
            >
              {searching ? "Ecosysteem lokaliseren..." : "Volgende stap"} <ArrowRight className="h-4 w-4" />
            </button>
            <p className="flex items-center justify-center gap-2 text-xs text-slate-400">
               <ShieldCheck className="h-3 w-3" /> Beveiligde verbinding (AuxDesign B2B)
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Concurrentie Scanner</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                We hebben {competitors.length} vergelijkbare concurrenten gevonden. Selecteer welke u wilt monitoren op Marktplaats en Vinted.
              </p>
            </div>
            
            <div className="space-y-3">
              {competitors.map((c, i) => (
                <div 
                  key={i} 
                  onClick={() => toggleCompetitor(i)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${c.selected ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${c.selected ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${c.selected ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300'}`}>{c.name}</p>
                      <p className="text-xs text-slate-500"><MapPin className="inline h-3 w-3 mr-1"/> Binnen 5km radius</p>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${c.selected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                    {c.selected && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleFinish}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800"
            >
              <Eye className="h-4 w-4" /> Start Market Intelligence
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
