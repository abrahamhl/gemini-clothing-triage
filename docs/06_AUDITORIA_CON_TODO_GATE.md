# Auditoría lean-ai — Demostración con --todo-gate discipline

**Fecha**: 2026-06-02  
**Realizado por**: Grok 0.2.17 con `--todo-gate` enforcement simulado (turn-end TodoGate)  
**Proyecto**: C:\Users\2fabr\.claude\projects\0_App_Triaje_de_Ropa_Audio_Reventa\lean-ai

## Por qué este ejercicio

El flag `grok --todo-gate` activa el **runtime turn-end TodoGate**.

Este gate:
- Se ejecuta al final de cada turno del agente.
- Verifica que el número de ítems `in_progress` en la lista de TODOs no supere el número de "tareas vivas" que los respaldan (subagentes, trabajo real en curso, etc.).
- Si detecta TODOs "huérfanos" (in_progress sin backing), fuerza un nudge para que el agente corrija el estado antes de poder cerrar el turno.

En este caso, usé scaffolding estricto de TODOs (siguiendo el estilo recomendado en las skills de implement y pr-babysit) para simular exactamente el comportamiento que el gate exigiría.

## TODO Scaffold usado (IDs estables para correlación post-compaction)

- `setup`
- `read-docs`
- `inspect-structure`
- `review-key-modules`
- `check-roadmap`
- `findings`
- `recommendations`
- `report`
- `doc-update-lotes`
- `doc-update-guia`

**Regla seguida**: Solo un `in_progress` a la vez. Completar antes de pasar al siguiente. Nunca terminar un turno con fases in_progress sin acción real respaldándolas.

## Hallazgos principales

### Lo que está sólido (núcleo MVP)

- Arquitectura excelente: provider pattern (lib/ai) + repository pattern (lib/db) tal como describe `docs/02_COMO_LEER_EL_CODIGO.md`.
- Motor de valoración (`lib/valuation/`) es una función pura con baselines reales (incluyendo marcas de audio vintage: Marantz, Technics, Sansui, etc.). Esto es el verdadero moat.
- Lotes Inteligentes (`lib/lots/index.ts` + página) **ya está implementado** con lógica de bundling por categoría, talla, estilo y evento estacional (Koningsdag naranja).
- Flujo foto → análisis → valoración → inventario → anuncio funciona end-to-end.
- Datos locales en `.data/` + cliente tipado (`lib/client.ts`).
- Documentación interna del proyecto es de muy alta calidad (en español y muy accionable).

### Estado de la hoja de ruta (actualizado)

| Módulo                        | Estado real ahora                  | Notas |
|-------------------------------|------------------------------------|-------|
| Lotes Inteligentes            | ✅ Implementado                   | detectLots produce sugerencias accionables |
| Analytics                     | Esqueleto (ComingSoon)            | - |
| Estrategias IA                | Esqueleto (ComingSoon)            | - |
| Integraciones                 | Esqueleto (ComingSoon)            | - |

Se actualizaron los documentos para reflejar la realidad (antes decían "Esqueleto" para Lotes).

### Otras observaciones

- El código sigue la convención "sin comentarios de lógica de negocio" (buena decisión para un motor propietario).
- Configuración de IA ya está parcialmente visible en `/configuracion` (aunque solo del lado servidor en el render).
- Hay `.env.local` y `.env.example`.
- El proyecto tiene tanto AGENTS.md como CLAUDE.md (típico de usuarios que usan múltiples herramientas de IA).

## 3 Recomendaciones concretas (bajo esfuerzo / alto impacto)

1. **Actualización de docs (hecho en esta auditoría)**  
   Marcar Lotes como implementado y aclarar el estado real de los esqueletos.  
   Archivos tocados:
   - `docs/01_PROPUESTA_Y_MOCKUP.md`
   - `docs/00_GUIA_DE_USO.md`

2. **Exponer el proveedor IA activo en la UI de Configuración (fácil)**  
   Actualmente la detección de Gemini vs Mock vive en dos sitios (config page + lib/ai).  
   Sugerencia: crear un pequeño endpoint `/api/status` o usar un componente cliente que llame a un route handler que devuelva `{ provider: "gemini" | "mock", mode: "studio" | "vertex" }` y mostrarlo con el mismo estilo de "Row" que ya usa la página de configuración.  
   Esfuerzo: ~30-45 min. Visibilidad alta para el usuario final.

3. **Añadir una categoría nueva pequeña (ej. "vinilo" o "libros") para probar extensibilidad**  
   - Añadir a `ItemCategory` en `lib/types.ts`.
   - Añadir baseline en `lib/valuation/baselines.ts` (puedes copiar audio_vintage como punto de partida).
   - Actualizar `CATEGORY_LABEL` en `lib/ui.ts`.
   - (Opcional) Añadir un par de ejemplos en los datos seed si existen.
   Esto demuestra lo fácil que es extender el "moat" de valoración.

   Bonus: una vez hecho, Lotes automáticamente empezará a agrupar por la nueva categoría.

## Cómo lanzar este proyecto con el gate activado

Si quieres que **yo** (o cualquier agente) trabaje en este proyecto con la disciplina del TodoGate activada:

```powershell
cd "C:\Users\2fabr\.claude\projects\0_App_Triaje_de_Ropa_Audio_Reventa\lean-ai"
grok --todo-gate
```

O apuntando explícitamente:

```powershell
grok --cwd "C:\Users\2fabr\.claude\projects\0_App_Triaje_de_Ropa_Audio_Reventa\lean-ai" --todo-gate
```

Dentro de la sesión, el gate estará vigilando al final de cada turno que los TODOs estén bien respaldados.

## Conclusión

El proyecto está en muy buen estado. El núcleo es sólido y la arquitectura está pensada para crecer sin dolor. Lotes ya pasó de esqueleto a funcional (buen progreso).

El ejercicio de hoy demuestra cómo `--todo-gate` fuerza un tracking de tareas mucho más riguroso y "a prueba de compaction", que es exactamente para lo que sirve en tareas largas o cuando se usan skills como `/implement`.

¿Quieres que ahora sí implemente la recomendación #2 o #3 con el mismo nivel de disciplina de TODOs (y si es posible con el gate "real" en una nueva sesión)?

---

**Estado final de TODOs de esta auditoría**: todos completados.
