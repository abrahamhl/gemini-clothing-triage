# Documentación Arquitectónica y de Seguridad (Categoría Senior)

## 1. Arquitectura del Proyecto (Serverless B2B)
Esta aplicación está diseñada bajo el patrón de arquitectura **Jamstack / Serverless**, ideal para aplicaciones modernas con alto tráfico intermitente.
- **Frontend (UI/UX):** HTML5, CSS3 Nativo (con variables CSS para Theming), y JavaScript Vanilla. Se evita deliberadamente el uso de frameworks pesados (React/Angular) para garantizar tiempos de carga < 500ms y máxima compatibilidad móvil (PWA-ready).
- **Backend (API):** Funciones Serverless de Node.js alojadas en **Vercel** (pi/analyze.js). Esto asegura un auto-escalado horizontal infinito sin necesidad de gestionar servidores.
- **Motor de IA (OSINT Deep Scan):** Integración con Google Cloud Vision API mediante abstracción de credenciales en backend. 

## 2. Prácticas de Seguridad Implementadas (Zero-Trust & Data Privacy)
Como la aplicación será distribuida y accedida por clientes potenciales en formato de demostración, se han implementado las siguientes barreras de seguridad:

### 2.1. Ocultación y Aislamiento de Credenciales (Vercel Edge Functions)
**Justificación:** Nunca se debe exponer un API Key o un JSON de Service Account en el lado del cliente (Frontend).
- **Implementación:** El Service Account de Google Cloud que habilita el escáner visual está **inyectado y cifrado exclusivamente en el entorno del Backend (Node.js)**. 
- **Resultado:** Cuando un usuario carga la demo, su navegador sólo ve llamadas genéricas al endpoint /api/analyze. Es imposible que un atacante haga ingeniería inversa para robar la cuota de facturación de Google Cloud.

### 2.2. Aislamiento de Repositorio (Private Vaulting)
**Justificación:** El código fuente contiene algoritmos propietarios de tasación y conexión B2B.
- **Implementación:** El repositorio de GitHub ha sido migrado a **Visibilidad Privada**. Vercel dispone de un token OAuth seguro que le permite leer el código y desplegarlo sin exponerlo a la red pública.

### 2.3. Sanitización de Payloads (Protección 413 Payload Too Large)
**Justificación:** Vercel impone un límite estricto de 4.5 MB por petición. Los usuarios podrían intentar subir fotos de cámaras DSLR de 20MB, lo que colapsaría el servidor (Denegación de Servicio - DoS accidental).
- **Implementación:** Se ha desarrollado un motor de compresión Canvas API en el Frontend que redimensiona y comprime (JPEG 80%) cualquier imagen localmente antes de la transmisión de datos.

### 2.4. White-Labeling (Marca Blanca) y Enmascaramiento de Proveedores
**Justificación:** Para mantener la ventaja competitiva B2B, no se debe revelar qué IA específica se está utilizando.
- **Implementación:** Se han purgado del Frontend y de las notificaciones todas las referencias a "Gemini" o "Google Vision". El sistema ahora se presenta ante el cliente bajo una arquitectura propietaria denominada **LEAN_OSINT_ENGINE**.

## 3. Motor de Tasación y OSINT
La lógica de pi/analyze.js ya no es un simple passthrough. Se ha desarrollado un motor heurístico que cruza los identificadores primarios (ej. *Motorcycle*, *Leather*, *Haute Couture*) y les aplica multiplicadores dinámicos de mercado, generando métricas simuladas del mercado Holandés (Marktplaats/Vinted) presentadas mediante Chart.js.