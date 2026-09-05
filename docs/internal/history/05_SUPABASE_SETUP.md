# lean ai · Conectar Supabase (sync móvil + backup)

Esto activa: **sincronización en tiempo real** móvil↔escritorio, **backup en la nube** y
**multiusuario** con seguridad por fila (RLS). Hoy la app va con datos locales; al terminar
esto, se cambia con variables de entorno, **sin tocar el resto del código**.

> Tú haces los pasos 1-3 (crear proyecto). Yo construyo el adaptador (paso 4) en cuanto me
> pases las claves, para entregarlo **probado** y no a ciegas.

## 1. Crear el proyecto (5 min)

1. Entra en **supabase.com** → *New project*.
2. Región: **Frankfurt (eu-central-1)** o **West EU** (cercanía + datos en UE).
3. Guarda la contraseña de la base de datos.

## 2. Cargar el esquema (2 min)

1. En el proyecto: **SQL Editor → New query**.
2. Pega el contenido de `supabase/schema.sql` y pulsa **Run**.
3. Crea tablas, RLS, Realtime y el bucket privado `items`. Sin errores = listo.

## 3. Copiar las claves (1 min)

En **Project Settings → API**:

| Clave | Dónde va | Visibilidad |
|---|---|---|
| Project URL | `.env.local` → `NEXT_PUBLIC_SUPABASE_URL` | Pública (ok) |
| `anon` public | `.env.local` → `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Pública (ok, protegida por RLS) |
| `service_role` | `.env.local` → `SUPABASE_SERVICE_ROLE_KEY` | **SECRETA** — solo servidor |

> La `service_role` salta el RLS: **jamás** con prefijo `NEXT_PUBLIC_`, jamás en el cliente,
> jamás en git. `.env.local` ya está ignorado.

## 4. Activar (lo hago yo, contigo)

Cuando tengas el paso 2 hecho y las claves a mano, dímelo. Yo:

1. Instalo `@supabase/supabase-js` y `@supabase/ssr`.
2. Creo `src/lib/db/supabase-store.ts` que implementa la **misma interfaz** `ItemRepository`
   (las fotos van a Storage, los datos a Postgres).
3. Enchufo el factory `src/lib/db/index.ts`: si hay claves Supabase → usa Supabase; si no → local.
4. Cambio el polling por **Supabase Realtime** (sync instantánea).
5. Probamos: subes una foto desde el móvil y aparece sola en el escritorio.

## Por qué es seguro (resumen)

- **RLS activado**: aunque alguien tenga la `anon key` (es pública por diseño), no ve ni una
  fila ajena. La seguridad vive en la base de datos.
- **Storage privado** + acceso solo a tu carpeta `<tu-id>/...` + URLs firmadas temporales.
- **Backup**: Supabase replica Postgres y Storage. Tu stock deja de vivir solo en tu portátil.
