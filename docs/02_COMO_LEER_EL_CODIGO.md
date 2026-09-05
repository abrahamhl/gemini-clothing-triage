# lean ai · Cómo leer el código

Mapa para orientarte. La regla de oro: **un módulo = una carpeta = una responsabilidad**.

## Estructura

```
src/
  app/                      Rutas (Next.js App Router)
    layout.tsx              Raíz: fuentes, metadatos, PWA
    globals.css             Tema (cyberpunk pastel claro)
    manifest.ts             PWA
    (app)/                  Shell con sidebar (grupo de rutas)
      layout.tsx            Sidebar + cabecera móvil
      page.tsx              Dashboard
      inventario/           Inventario (orquesta el loop)
      capturar/             Captura móvil
      ...                   Resto de secciones
    api/                    Backend (route handlers)
      items/route.ts        Crear / listar artículos
      items/[id]/route.ts   Leer / actualizar uno
      items/[id]/analyze/   Disparar análisis IA + valoración
      items/[id]/listing/   Generar anuncio
      images/[id]/route.ts  Servir imágenes
  components/               UI (Sidebar, tabla, ficha, captura, primitivas)
  lib/                      Lógica (sin React)
    types.ts                Tipos del dominio
    ai/                     Motor IA (provider pattern)
    valuation/              Motor de valoración (el activo diferencial)
    db/                     Capa de datos (repository pattern)
    listing/                Generador de anuncios
    ui.ts                   Etiquetas, colores, formato €
    client.ts               Cliente API tipado (navegador → /api)
```

## El flujo de una foto (síguelo en este orden)

1. `components/CaptureModal.tsx` → sube la imagen con `lib/client.ts`.
2. `api/items/route.ts` (POST) → valida y guarda vía `lib/db`.
3. `api/items/[id]/analyze/route.ts` (POST) → llama a `lib/ai` y luego a `lib/valuation`.
4. `lib/ai/index.ts` → elige proveedor (mock o gemini). `mock.ts` / `gemini.ts` lo implementan.
5. `lib/valuation/index.ts` → función pura que calcula precios + oportunidad + estrategia.
6. `components/InventoryTable.tsx` → pinta la fila. `ItemPanel.tsx` → la ficha y el anuncio.

## Dos patrones que se repiten (entiéndelos una vez)

- **Provider pattern** (`lib/ai`): una interfaz (`AIProvider`) y varias implementaciones.
  El resto de la app solo conoce la interfaz. Cambiar de IA = añadir un fichero.
- **Repository pattern** (`lib/db`): una interfaz (`ItemRepository`) y un adaptador
  (`LocalStore` hoy, Supabase mañana). La app no sabe dónde viven los datos.

Ambos se eligen en su `index.ts` con una variable de entorno. Esa es toda la "magia".

## Convenciones

- **Servidor vs cliente**: los ficheros con `"use client"` arriba corren en el navegador.
  El resto, en el servidor. Las claves y la lógica sensible viven **solo en servidor**.
- Tipos primero: si dudas de la forma de un dato, mira `lib/types.ts`.
- Nada de comentarios que expliquen lógica de negocio en el código (a propósito).
