# lean ai · Guía de uso

> Convierte fotos en decisiones rentables. La IA propone, tú validas.

## Arrancar la app

1. Abre una terminal en la carpeta `lean-ai`.
2. `npm run dev`
3. Abre **http://localhost:3007** en el navegador.

La app funciona **sin configurar nada**: usa un motor de IA simulado realista y guarda
los datos en tu propio equipo (`.data/`). Para activar IA real, ver §"Activar Gemini".

## El loop de trabajo (lo que harás cada día)

1. **Capturar** → botón morado *Analizar artículos* (Inventario) o pantalla *Capturar* en el móvil.
   - Arrastra fotos o pulsa para seleccionar. Cada foto = un artículo.
   - En móvil, *Tomar foto* abre la cámara directamente.
2. **La IA analiza sola** → extrae marca, modelo, estado, talla, material, color, demanda
   y calcula 4 precios + un **Índice de Oportunidad** (0-100).
3. **Revisa el inventario** → tabla tipo Excel. Cada fila es un artículo.
   - Oportunidad alta → fila destacada.
   - Descartado → fila atenuada.
4. **Abre la ficha** (clic en la fila) → ahí decides:
   - **Publicar** · **Conservar** · **Agrupar** · **Descartar**.
5. **Genera el anuncio** → pestaña *Marktplaats* o *Vinted* → *Copiar todo* → pégalo en la plataforma.

## Pantallas

| Sección | Para qué |
|---|---|
| **Dashboard** | Valor total, listos para vender, misiones recomendadas. |
| **Inventario** | Tu mesa de trabajo. Buscar, filtrar, abrir fichas, generar anuncios. |
| **Capturar** | Pensada para el móvil. Botón grande + feed de lo recién capturado. |
| **Configuración** | Estado de IA y datos (sin exponer claves). |
| Resto | Lotes ya implementado. Analytics / Estrategias / Integraciones = esqueleto (ComingSoon). |

## Móvil + escritorio a la vez

Abre la **misma URL** en el móvil (misma red): `http://<IP-de-tu-PC>:3007`.
Hoy la sincronización es por refresco automático cada pocos segundos. Al conectar
Supabase (siguiente fase) será **instantánea** y con backup en la nube.

## Los 4 precios (qué significan)

- **Liquidación**: para soltar ya. El suelo.
- **Venta rápida**: precio para vender en días.
- **Recomendado**: el equilibrio precio/tiempo. El que se publica por defecto.
- **Premium**: techo razonable si la pieza es rara y hay demanda.

## Índice de Oportunidad

Un número 0-100 que mezcla **margen × demanda × velocidad de venta × temporada**.
Úsalo como **cola de prioridades**: empieza por los más altos. Es lo que convierte
el inventario en una lista de acciones, no en un catálogo muerto.

## Activar Gemini real (opcional, cuando quieras)

1. Copia `.env.example` a `.env.local`.
2. Descomenta y rellena:
   ```
   AI_PROVIDER=gemini
   GEMINI_MODE=studio
   GEMINI_API_KEY=tu_api_key   # de aistudio.google.com
   ```
3. Reinicia (`npm run dev`). Configuración → "Proveedor activo: Gemini".

Para usar tus **créditos de Vertex** (€239 Free Trial, caducan 31-jul-2026):
cambia a `GEMINI_MODE=vertex` con tu proyecto de Google Cloud (ver §SEGURIDAD).

## Limpiar datos de prueba

Borra la carpeta `.data/` para empezar de cero. Se regenera sola.
