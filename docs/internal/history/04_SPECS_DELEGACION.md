# lean ai · Specs de delegación (para Grok / Gemini)

Reglas para que otros agentes construyan **sin pisar el núcleo ni pisarse entre sí**.

## Reglas de oro (innegociables)

1. **Un módulo = una carpeta = un dueño.** Trabaja solo dentro de tu carpeta.
2. **Prohibido editar** `lib/ai`, `lib/valuation`, `lib/db`, `lib/types.ts`, ni el esquema.
   Si necesitas un dato nuevo, pídelo; no lo añadas por tu cuenta.
3. **Consume contratos tipados** desde `lib/`. No importes internals de otros módulos.
4. **Cero secretos en cliente.** Llamadas a IA/datos, siempre en route handler de tu carpeta.
5. Entrega con: typecheck limpio (`npx tsc --noEmit`) y la pantalla navegable sin errores de consola.

## M-A · Lotes Inteligentes  → `src/app/(app)/lotes/`

- **Entrada:** `Item[]` (de `/api/items`).
- **Salida:** sugerencias de lote `{ name, theme, itemIds[], estValueBundled, probSale }`.
- **Contrato a crear:** `lib/lots/index.ts` → `detectLots(items: Item[]): LotSuggestion[]` (función pura).
- **No toca:** captura, valoración, datos.
- **Hecho cuando:** detecta ≥1 lote temático (estilo/talla/temporada) y lo muestra con valor individual vs. agrupado.

## M-B · Analytics  → `src/app/(app)/analytics/`

- **Entrada:** `Item[]` (solo lectura). **Cero escritura.**
- **Salida:** componentes de KPIs: beneficio, rotación, tiempo medio de venta, top categorías/marcas, valor inmovilizado.
- **No toca:** nada fuera de su carpeta. Cálculos en `_lib` propio.

## M-C · Estrategias IA  → `src/app/(app)/estrategias/`

- **Entrada:** `Item[]`.
- **Salida:** recomendaciones con justificación (Gemini 2.5 Pro vía el provider existente).
- **Contrato:** crea `app/api/strategies/route.ts` que use `getAIProvider()` para texto.
  No instancies el SDK por tu cuenta: pasa por `lib/ai`.

## M-D · Integraciones  → `src/app/(app)/integraciones/`

- **Salida:** exportadores aislados (WordPress/WooCommerce, Shopify) + vista escaparate.
- **Contrato:** `lib/export/<target>.ts` con `export(items): Payload`. Sin publicar nada real todavía.

## Cómo encargar un módulo (plantilla de prompt)

> Construye **solo** el módulo M-X dentro de `src/app/(app)/<carpeta>/`. Lee `docs/02_COMO_LEER_EL_CODIGO.md`.
> Usa los tipos de `lib/types.ts` y el cliente `lib/client.ts`. **No** edites `lib/ai`,
> `lib/valuation`, `lib/db` ni el esquema. Entrega con `npx tsc --noEmit` limpio y la
> pantalla funcionando sin errores de consola. Estética: clases Tailwind como el resto.
