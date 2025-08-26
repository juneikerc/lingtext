# LingText: Aprende inglés leyendo, con traducción instantánea, TTS y repaso

LingText es una aplicación web full‑stack enfocada en aprender inglés a través de la lectura activa. Combina biblioteca de textos, traducción de palabras o selecciones al español, Text‑to‑Speech (TTS), gestión de “palabras desconocidas” y exportación a CSV para Anki.

Su objetivo es ayudar a construir vocabulario en contexto, minimizando fricción: seleccionas o haces click sobre palabras mientras lees, escuchas la pronunciación, guardas lo desconocido y lo repasas después.

—

## Características principales

- __Lectura centrada en el aprendizaje__: biblioteca de textos locales o por URL, con soporte de audio adjunto.
- __Traducción instantánea__: usa la API de Traducción local de Chrome si está disponible; si no, hace fallback automático a un endpoint remoto basado en OpenRouter (requiere clave).
- __TTS (Text‑to‑Speech)__: pronuncia palabras al instante con la Web Speech API y configura voz, idioma y velocidad.
- __Gestión de vocabulario__: marca palabras como “desconocidas”, guárdalas en IndexedDB y expórtalas a CSV compatible con Anki.
- __Audio__: reproduce audio adjunto (URL o archivo local vía File System Access API) con control de velocidad y re‑autorización de permisos cuando sea necesario.
- __SSR + HMR__: renderizado en servidor con React Router v7 y DX moderna con Vite.

## Público objetivo y filosofía

- __Autoestudio guiado__: pensado para estudiantes autodidactas que quieren leer y construir vocabulario con mínimo contexto técnico.
- __Privacidad por defecto__: todos los textos, audio y palabras se guardan localmente en el navegador (IndexedDB). La traducción remota solo envía la palabra o selección al servidor cuando se usa el fallback.
- __Bajo coste__: aprovecha capacidades locales (Chrome Translator, TTS) y solo usa modelos remotos cuando es necesario.

—

## Demo rápida

1. Crea o importa un texto en la Biblioteca.
2. Abre el lector y haz click en una palabra: verás su traducción y podrás marcarla como desconocida o escucharla.
3. Selecciona un fragmento para traducir y guardar múltiples palabras.
4. Ve a “Palabras” para repasar, escuchar y exportar a CSV.

—

## Stack técnico

- __Framework__: `react-router` 7 (SSR) + `vite` 6 + `react` 19 + `tailwindcss` 4.
- __Estado global__: `zustand` (`app/context/translatorSelector.ts`).
- __Persistencia local__: IndexedDB nativa (`app/db.ts`).
- __TTS__: Web Speech API (`app/utils/tts.ts`).
- __Traducción__: Chrome Translator local si existe (`app/utils/translate.ts`) y endpoint remoto con OpenRouter (`app/routes/translate.tsx`).

—

## Estructura de carpetas (extracto)

- `app/`
  - `components/`
    - `Reader.tsx`, `reader/` (UI de lectura, popups, audio)
    - `UnknownWordsSection.tsx` (listado y acciones)
  - `routes/`
    - `home.tsx`, `texts/text.tsx`, `translate.tsx`
  - `context/translatorSelector.ts` (zustand)
  - `utils/` (`translate.ts`, `tts.ts`, `tokenize.ts`, `anki.ts`, `fs.ts`)
  - `db.ts` (IndexedDB)
- `public/` (assets y textos de ejemplo)

—

## Rutas

- `/` → `app/routes/home.tsx`: portada y biblioteca (`app/components/Libary.tsx`).
- `/texts/:id` → `app/routes/texts/text.tsx`: lector, audio y popups de traducción.
- `/words` → listado de palabras desconocidas.
- `/translate/:text` → endpoint JSON para traducción remota.

—

## Flujo funcional

1. __Biblioteca__ (`app/components/Libary.tsx`)
   - Crea textos con título y contenido, importa `.txt`, adjunta audio por URL o archivo local.
   - Persiste en IndexedDB con `addText()`.
2. __Lector__ (`app/components/Reader.tsx`)
   - Tokeniza texto y permite click/selección.
   - `WordPopup` y `SelectionPopup` traducen usando `translateTerm()` con fallback automático.
   - Marca palabras como desconocidas (`putUnknownWord`) y permite TTS por palabra.
3. __Palabras__ (`app/components/UnknownWordsSection.tsx`)
   - Lista, reproduce TTS, elimina y exporta CSV (`app/utils/anki.ts`).

—

## Modelo de datos (IndexedDB)

- Store `texts` (`id`, `title`, `content`, `createdAt`, `audioRef?: { type: 'url' | 'file', ... }`).
- Store `words` (`wordLower`, `translation`, `status`, `addedAt`, `voice`).
- Store `settings` (preferencias TTS).

—

## Traducción: local y remota (fallback)

- __Local (Chrome)__: `translateFromChrome(term)` usa la API `Translator` si existe.
- __Remota (OpenRouter)__: `translateRemote(term, model)` consulta `/translate/:term`.
- __Unificación__: `translateTerm(term, selected)` prioriza Chrome y cae a remoto si no hay resultado válido — sin bloquear la UI.
- __Clave API__: define `OPEN_ROUTER_API_KEY` en el entorno del servidor para habilitar el endpoint remoto en desarrollo y producción.

—

## Audio local, permisos y re‑autorización

- Si el audio está adjunto como archivo local (`FileSystemFileHandle`), el lector intenta materializar una URL temporal.
- En `clientLoader` (`app/routes/texts/text.tsx`) se captura el error de `getFile()` y se devuelve `audioUrl: null` si falta permiso.
- En `Reader` (`app/components/Reader.tsx`), si `audioRef.type === 'file'` y no hay `audioUrl`, se muestra un botón de “Reautorizar audio” que vuelve a solicitar permiso (`ensureReadPermission()` en `app/utils/fs.ts`).
- Se limpian los `ObjectURL` para evitar fugas de memoria.

—

## Instalación y ejecución

Requisitos: Node 20+ y un navegador moderno. Para usar traducción remota, necesitarás una clave de OpenRouter.

1) Instalar dependencias

```bash
npm install
```

2) Desarrollo (SSR con HMR)

```bash
npm run dev
# http://localhost:5173
```

3) Producción

```bash
# Requiere variable: OPEN_ROUTER_API_KEY
npm run build
npm run start
# Servirá ./build/server/index.js
```

4) Docker

```bash
docker build -t lingtext .
docker run -e OPEN_ROUTER_API_KEY=sk-... -p 3000:3000 lingtext
```

—

## Variables de entorno

- `OPEN_ROUTER_API_KEY`: clave para `app/routes/translate.tsx`. Solo se usa en el servidor (SSR).

—

## Accesibilidad y privacidad

- __Accesibilidad__: componentes con `aria-label` en iconos, controles de velocidad de audio, contraste en tema oscuro. Se recomienda revisar con Lighthouse/Axe.
- __Privacidad__: textos, audio (handles) y palabras viven en IndexedDB del navegador. La traducción remota solo envía el término a traducir.

—

## Solución de problemas (FAQ)

- __No se reproduce el audio local__
  - Usa Chrome/Edge en `localhost` o sitio HTTPS (requisito de File System Access API).
  - Si ves “Reautorizar audio”, pulsa y concede permiso. Si falla, re‑adjunta el archivo desde la biblioteca.
- __La traducción devuelve vacío__
  - Verifica `OPEN_ROUTER_API_KEY` y conectividad. Chrome Translator puede no estar disponible en tu navegador; se hará fallback, pero sin API key el resultado será vacío.
- __No aparece la opción de Chrome Translator__
  - La API `Translator` es experimental y solo está en algunas versiones de Chrome. Usa los modelos remotos.

—

## Roadmap

- Listado por texto de palabras desconocidas y progreso.
- Sincronización opcional (autohosted) para múltiples dispositivos.
- Importación EPUB/PDF con extracción de texto.
- Decks Anki por texto/tema, tarjetas cloze.

—

## Contribuir

1. Haz un fork y crea una rama: `feat/mi-mejora`.
2. Ejecuta `npm run dev` y agrega tests/chequeos si aplica.
3. Envía un PR describiendo el objetivo y el impacto en UX.

—

## Licencia

Por definir. Si te interesa un esquema específico (MIT/BSD-3/Apache-2.0), abre un issue.

—

## Nota

`package.json` tiene `"name": ""`. Puedes cambiarlo a `"lingtext"` u otro nombre antes de publicar.

—

## Plantilla original (React Router)
## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
