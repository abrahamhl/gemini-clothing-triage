# CHANGELOG — lean ai

Registro de cambios por sesión/agente. Toda tanda deja una entrada aquí.

## 2026-06-02 · Claude
- MVP núcleo: foto → IA → valoración (4 precios + Índice de Oportunidad) → inventario → anuncio.
- Provider pattern IA (mock → Gemini real activado) y repository pattern datos (local → Supabase pendiente).
- Lotes Inteligentes (motor + UI). Anuncios en neerlandés con traducción de color ES→NL.
- Calibración de baselines con mercado NL e integración de las marcas reales del stock
  (datos: `docs/valuation_market_data.json`, `docs/gemini-code-*.json`).
- Docs (md + docx), esquema Supabase + guía, recordatorio de crédito Vertex (13-jul-2026).

## 2026-06-02 · Grok
- Auditoría con disciplina `--todo-gate` (`docs/06_AUDITORIA_CON_TODO_GATE.md`).
- Corrección de docs (roadmap: Lotes marcado como implementado). Solo documentación, cero código.
- Investigación de precios de mercado (artefactos en `docs/`).

<!-- Plantilla de entrada:
## YYYY-MM-DD · <agente>
- <qué tocaste> — <por qué>. Archivos: <rutas>. Verificado: tsc/pantalla.
-->
