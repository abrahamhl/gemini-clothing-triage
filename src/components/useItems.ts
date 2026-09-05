"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client";
import type { Item } from "@/lib/types";

export function useItems(pollMs = 4000) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setItems(await api.listItems());
    } catch {
      // El polling reintenta en el siguiente ciclo.
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function load() {
      await refresh();
      if (active) setLoading(false);
    }
    void load();
    const t = setInterval(refresh, pollMs);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, [refresh, pollMs]);

  return { items, loading, refresh, setItems };
}
