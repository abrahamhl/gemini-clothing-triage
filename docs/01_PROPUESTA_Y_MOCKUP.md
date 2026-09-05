# lean ai · Propuesta y mockup

## Qué es

**No es un inventario.** Es un **sistema operativo de decisiones comerciales asistido por IA**:
convierte fotos en decisiones de negocio rentables. Actúa como un empleado virtual
especializado en reventa.

El usuario no quiere catalogar; quiere **saber qué tiene, cuánto vale, qué vender,
cómo, cuándo, y si merece conservarlo** — maximizando beneficio y minimizando tiempo.

## Especializado en

Ropa y moda de marca · calzado · accesorios · **audio vintage · HiFi** · electrónica
seleccionada. El motor de valoración trae baselines semilla para estas categorías.

## Principios de diseño aplicados

- **Desktop-first** (1920×1080), responsive en móvil para captura.
- Menos clics. La IA propone, el usuario valida.
- Valor económico siempre visible.
- Sin formularios largos: el usuario no introduce lo que la IA puede detectar.
- Estética premium, minimalista, **cyberpunk pastel claro** (alineada al mockup elegido).

## Qué está construido HOY (MVP núcleo, funcional y testeado)

✅ Captura (drag&drop escritorio + cámara móvil) con análisis IA y progreso
✅ Motor de IA desacoplado (provider pattern): simulado realista → Gemini con una variable
✅ Motor de valoración: 4 precios + **Índice de Oportunidad** + estrategia recomendada
✅ Inventario tipo Excel con estados visuales (premium destacado, descarte atenuado)
✅ Ficha de artículo: atributos, valoración, confianza, acciones
✅ Generador de anuncios Marktplaats + Vinted con copiar/editar
✅ Dashboard con KPIs, distribución por categoría y "misiones recomendadas"
✅ PWA instalable + responsive móvil con feed en vivo
✅ Capa de datos desacoplada (local hoy → Supabase mañana, sin reescribir)

## Hoja de ruta (esqueleto navegable, listo para construir encima)

| Módulo | Estado | Quién |
|---|---|---|
| Lotes Inteligentes | ✅ Implementado (detectLots + UI) | - |
| Analytics | Esqueleto (ComingSoon) | Delegable (M-B) |
| Estrategias IA | Esqueleto (ComingSoon) | Delegable (M-C) |
| Integraciones (WP/Shopify/escaparate) | Esqueleto (ComingSoon) | Delegable (M-D) |
| Asistente conversacional / búsqueda semántica | Futuro | Encaja con crédito GenAI App Builder |
| Imagen "modelo con la ropa" / simulación tienda | Futuro | Gemini image |

## Las 3 decisiones de ingeniería que cerramos

1. **Sincronización móvil** → una sola PWA + Supabase Realtime. Sin app nativa, sin
   motor de sync propio. El móvil alimenta, el escritorio decide.
2. **Proveedor IA** → SDK `@google/genai`. El mismo código vale para AI Studio (simple)
   y Vertex (tus créditos). Detrás de un provider intercambiable.
3. **Alcance realista** → loop núcleo perfecto + resto como esqueleto, en vez de todo a medias.

## El "moat" (por qué no es fácilmente replicable)

- La UI se copia; **el motor de valoración no** (baselines + factores propios, solo en servidor).
- **Los datos** de tus ventas reales afinan los baselines con el tiempo: cuanto más lo usas,
  mejor valora y menos replicable es.
- El **Índice de Oportunidad** es el valor diferencial: convierte stock en cola de acciones.
