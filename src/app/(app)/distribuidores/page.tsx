"use client";
import React, { useState } from "react";
import { Search, MapPin, Store, Mail } from "lucide-react";

type OverpassLead = {
  id?: number;
  lat?: number;
  lon?: number;
  tags?: Record<string, string>;
};

type OverpassResponse = {
  elements?: OverpassLead[];
};

export default function DistribuidoresPage() {
  const [radius, setRadius] = useState("100000");
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<OverpassLead[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function searchLeads() {
    setLoading(true);
    setError(null);
    setLeads([]);
    try {
      const lat = 51.9851;
      const lon = 5.8987;
      const overpassQuery = `
        [out:json];
        (
          node["shop"="clothes"](around:${radius},${lat},${lon});
          node["shop"="vintage"](around:${radius},${lat},${lon});
          node["shop"="second_hand"](around:${radius},${lat},${lon});
        );
        out 25;
      `;

      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: overpassQuery,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      if (!res.ok) {
        throw new Error(`Overpass request failed with status ${res.status}`);
      }

      const data = (await res.json()) as OverpassResponse;
      if (!data.elements || data.elements.length === 0) {
        setError("No se encontraron tiendas en este radio.");
      } else {
        setLeads(data.elements);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error desconocido al buscar distribuidores.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Distribuidores B2B</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Encuentra tiendas vintage y mayoristas locales en Países Bajos (Radio Arnhem).</p>
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
          >
            <option value="10000">Radio: 10 km</option>
            <option value="50000">Radio: 50 km</option>
            <option value="100000">Radio: 100 km</option>
            <option value="200000">Radio: 200 km (Toda NL)</option>
          </select>
          <button
            onClick={searchLeads}
            disabled={loading}
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            {loading ? "Buscando..." : "Buscar Competidores"}
          </button>
        </div>
      </header>

      {error && <div className="rounded-md bg-red-50 p-4 text-red-700 dark:bg-red-900/50 dark:text-red-200">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {leads.map((store, i) => {
          const tags = store.tags ?? {};
          const name = tags.name ?? "Tienda Vintage (Sin nombre)";
          const city = tags["addr:city"] ?? "Holanda (Alrededores Arnhem)";
          const street = tags["addr:street"] ?? "";
          const type = tags.shop === "clothes" && tags.second_hand === "only" ? "Vintage / Segunda Mano" : "Tienda Ropa";
          const hasCoordinates = typeof store.lat === "number" && typeof store.lon === "number";

          return (
            <div key={store.id ?? i} className="flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
              <div className="p-4 flex-1">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">{name}</h3>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-900/50">
                    B2B Lead
                  </span>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10 dark:bg-slate-800 dark:text-slate-300">
                    {city}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4"/> {street} {city}</p>
                  <p className="flex items-center gap-2"><Store className="h-4 w-4"/> {type}</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <button
                  onClick={() => {
                    if (hasCoordinates) {
                      window.open(`https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lon}`, "_blank");
                    }
                  }}
                  disabled={!hasCoordinates}
                  className="flex-1 flex justify-center items-center gap-1 rounded bg-slate-200 px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                >
                  <MapPin className="h-3 w-3"/> Mapa
                </button>
                <button
                  onClick={() => alert(`Preparando demo personalizada para ${name}.`)}
                  className="flex-1 flex justify-center items-center gap-1 rounded bg-indigo-600 px-2 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
                >
                  <Mail className="h-3 w-3"/> Pitch Demo
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
