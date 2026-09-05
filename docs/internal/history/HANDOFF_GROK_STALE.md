# Handoff para Grok — continuar lean ai con seguridad

Lee esto entero antes de tocar nada. Trabajas sobre un proyecto en marcha.

## Dónde estás

- Proyecto: `C:\Users\2fabr\.claude\projects\0_App_Triaje_de_Ropa_Audio_Reventa\lean-ai`
- Arranque: `npm run dev` → http://localhost:3007
- Lee primero: `docs/02_COMO_LEER_EL_CODIGO.md` (mapa) y `docs/04_SPECS_DELEGACION.md` (reglas de módulos).
- Estado: MVP núcleo funcional y testeado. Loto foto→IA→valoración→inventario→anuncio. Gemini real activo
  (key en `.env.local`). Lotes y anuncios en neerlandés implementados. Baselines calibrados con mercado NL.

## Reglas innegociables (precaución y colaboración)

1. **Deja siempre rastro.** Cada tanda de cambios = un commit con mensaje claro + una línea en
   `docs/CHANGELOG.md` (créalo si no existe: fecha, qué tocaste, por qué).
2. **Backups por git.** Antes de cambios grandes: `git add -A && git commit` para tener punto de retorno.
   Nunca uses `git reset --hard`, `git clean -f` ni `git push --force` sin pedir permiso explícito.
3. **No toques el núcleo sin avisar:** `src/lib/ai/`, `src/lib/valuation/` (lógica), `src/lib/db/`,
   `src/lib/types.ts`, `supabase/schema.sql`. Si necesitas un dato nuevo, propónlo, no lo metas a la fuerza.
4. **Secretos:** jamás leas, imprimas, copies ni commitees `.env.local`. Ya está en `.gitignore`. Nunca
   uses prefijo `NEXT_PUBLIC_` para claves de servidor.
5. **Verifica antes de cerrar:** `npx tsc --noEmit` limpio y la pantalla afectada sin errores de consola.
   Si rompes el build, revierte tu último cambio, no acumules.
6. **Un módulo = una carpeta = un dueño.** No edites a la vez algo que Claude esté tocando. Trabaja por
   ramas si hay dudas: `git checkout -b grok/<tarea>`.
7. **Cuando solo te pidan explicar, explica. No modifiques disco.** (El flag `--todo-gate` te vuelve
   propenso a actuar: úsalo solo para tareas de implementación reales, no para charlar.)

## Dónde lo dejó Claude (punto exacto de continuación)

- Baselines calibrados en `src/lib/valuation/baselines.ts` con las marcas reales del stock
  (datos en `docs/valuation_market_data.json` y `docs/gemini-code-*.json`).
- Pendiente y priorizado:
  1. **Botón "Precio de mercado real" (market grounding)** en la ficha (`src/components/ItemPanel.tsx`):
     un route handler `src/app/api/items/[id]/reprice/route.ts` que use grounding (Gemini con Google
     Search, o API de búsqueda) para devolver un precio basado en comparables reales **bajo demanda**.
     Diseño: opt-in por clic, nunca automático (controla coste).
  2. **Importador de datos de mercado**: que el motor lea `docs/valuation_market_data.json` en vez de
     valores hardcodeados, para que actualizar precios sea soltar un JSON nuevo (no editar código).
     Requiere `resolveJsonModule` en `tsconfig.json`.
  3. **Adaptador Supabase** (`src/lib/db/supabase-store.ts`): implementa la interfaz `ItemRepository`
     de `src/lib/db/repository.ts`. Esquema ya listo en `supabase/schema.sql`. Necesita que el usuario
     cree el proyecto y dé las claves (ver `docs/05_SUPABASE_SETUP.md`). NO lo hagas a ciegas sin claves.
  4. **Exponer proveedor IA en `/configuracion`** en tiempo real vía un `GET /api/status`.

## Protocolo de colaboración Claude ↔ Grok

- Antes de empezar una tarea, mira `docs/CHANGELOG.md` para ver qué tocó el otro por última vez.
- Si una tarea toca el núcleo, hazla en rama y deja nota en el CHANGELOG pidiendo revisión.
- Formato de cada entrega: commit + entrada en CHANGELOG + (si es grande) un `.md` corto con qué y por qué.
- Ante la duda: para, deja el estado guardado, y pregunta. Mejor lento y seguro que rápido y roto.
