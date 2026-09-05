# TriajeOS — catálogo y reventa asistida por IA

Convierte fotos de ropa y objetos seleccionados en fichas de catálogo, valoraciones, packs y anuncios en neerlandés para Marktplaats y Vinted.

## Arranque inmediato

Haz doble clic en `INICIAR_TRIAJEOS.cmd`. Se abrirá `http://localhost:3000` y la ventana negra quedará abierta mientras funcione la app. Para detenerla, pulsa `Ctrl+C` en esa ventana.

Alternativa desde terminal:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3000
```

## Flujo recomendado

1. En **Capturar**, elige **Una prenda · varias vistas** para subir frontal, trasera, etiquetas, composición y defectos de una misma pieza. **Carga masiva** crea un artículo por foto.
2. La app intenta analizar con Gemini. Si no está disponible, usa automáticamente `gemma3:4b` en Ollama sobre la GPU NVIDIA local. Nunca usa el mock como sustituto silencioso de una ficha real.
3. En **Inventario**, abre una ficha y usa **Mejorar foto stock**. Gemini conserva el producto y los defectos; si no hay crédito, Sharp aplica una corrección local de rotación, luz, contraste, nitidez y lienzo 1600×1600. El original siempre se conserva.
4. Usa **Auditar mercado y precios** antes del anuncio. Con Gemini Search obtiene fuentes actuales; sin acceso web conserva la valoración interna con confianza baja y lo indica expresamente.
5. Genera el anuncio para Marktplaats o Vinted, comparte/copia el texto y pulsa **Abrir plataforma**. La app abre el formulario oficial; tú revisas y confirmas la publicación.
6. En **Lotes inteligentes**, genera un anuncio completo para cualquiera de los packs detectados.

## Motores y degradación segura

- Análisis principal: Gemini configurado en `.env.local`.
- Respaldo de visión y redacción: Ollama `gemma3:4b`, instalado localmente y ejecutado en la RTX 3060.
- Generación/edición fotográfica: Gemini Image.
- Corrección fotográfica sin nube: Sharp. No elimina fondos ni arrugas de forma generativa; se etiqueta como **Corrección local**.
- Búsqueda de mercado: Gemini con Google Search. Sin crédito no se inventan comparables ni fuentes.

Variables opcionales: consulta `.env.example`. Las claves permanecen en el servidor y no se envían al navegador.

## Privacidad y publicación

- El adaptador activo guarda fichas e imágenes en `.data` de este equipo.
- No hay remoto Git configurado y la app no ejecuta `git push` ni publica código.
- No se publican anuncios automáticamente. Vinted y Marktplaats requieren sesión, revisión humana y aceptación de sus condiciones.
- No expongas el servidor en la red local hasta añadir autenticación. La sincronización real entre móvil y PC sigue requiriendo Supabase/Auth o un backend equivalente.

## Calidad

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Documentación existente

- `docs/00_GUIA_DE_USO.md`
- `docs/01_PROPUESTA_Y_MOCKUP.md`
- `docs/02_COMO_LEER_EL_CODIGO.md`
- `docs/03_SEGURIDAD.md`
- `docs/04_SPECS_DELEGACION.md`
