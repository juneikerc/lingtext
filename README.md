# LingText: Aprende inglés leyendo, con traducción instantánea, TTS y repaso espaciado

LingText es una aplicación web full‑stack enfocada en aprender inglés a través de la lectura activa. Combina biblioteca de textos, traducción de palabras o selecciones al español, Text‑to‑Speech (TTS), gestión de vocabulario con repetición espaciada, y exportación/importación de tu base de datos SQLite.

Su objetivo es ayudar a construir vocabulario en contexto, minimizando fricción: seleccionas o haces click sobre palabras mientras lees, escuchas la pronunciación, guardas lo desconocido y lo repasas con un algoritmo de repetición espaciada.

—

## Características principales

- **Lectura centrada en el aprendizaje**: biblioteca de textos locales o por URL, con soporte de audio adjunto y formato Markdown.
- **Traducción 100% local**: sistema de traducción tiered que corre completamente en el navegador usando Chrome AI, WebGPU (web-llm) o CPU (transformers.js). Sin API keys, sin envío de datos.
- **TTS (Text‑to‑Speech)**: pronuncia palabras al instante con la Web Speech API y configura voz, idioma y velocidad.
- **Gestión de vocabulario**: marca palabras y frases como "desconocidas", guárdalas con repetición espaciada integrada.
- **Base de datos SQLite local**: todos tus datos se almacenan en SQLite WASM con persistencia en OPFS (Origin Private File System).
- **Exportar/Importar datos**: descarga tu base de datos `.sqlite` a tu PC o impórtala desde otro dispositivo. Tus datos, tu control.
- **Repetición espaciada**: algoritmo SM-2 integrado para repasar vocabulario de forma óptima.
- **Audio**: reproduce audio adjunto (URL o archivo local vía File System Access API) con control de velocidad.
- **SSR + HMR**: renderizado en servidor con React Router v7 y DX moderna con Vite.

## Público objetivo y filosofía

- **Autoestudio guiado**: pensado para estudiantes autodidactas que quieren leer y construir vocabulario con mínimo contexto técnico.
- **Local‑first con propiedad de datos**: todos los textos, audio y palabras se guardan en SQLite dentro de tu navegador (OPFS). Puedes exportar tu base de datos completa como archivo `.sqlite` y llevarla a otro dispositivo.
- **Privacidad total**: TODA la traducción corre localmente en tu navegador. Nunca se envían datos a servidores externos.
- **Cero coste**: aprovecha modelos de IA locales (Chrome AI, Qwen, Llama, Gemma) sin necesidad de API keys ni suscripciones.

—

## Demo rápida

1. Crea o importa un texto en la Biblioteca.
2. Abre el lector y haz click en una palabra: verás su traducción y podrás marcarla como desconocida o escucharla.
3. Selecciona un fragmento para traducir y guardar múltiples palabras.
4. Ve a “Palabras” para repasar, escuchar y exportar a CSV.

—

## Stack técnico

- **Framework**: `react-router` 7 (SSR) + `vite` 6 + `react` 19 + `tailwindcss` 4.
- **Estado global**: `zustand` (`app/context/translatorSelector.ts`).
- **Base de datos**: SQLite WASM (`@sqlite.org/sqlite-wasm`) con persistencia en OPFS (`app/services/db.ts`).
- **TTS**: Web Speech API (`app/utils/tts.ts`).
- **Traducción local**: Sistema tiered con Chrome AI (Tier 0), Transformers.js/CPU (Tier 1), WebLLM/GPU (Tiers 2-4).
- **Workers de IA**: `app/workers/cpu.worker.ts` (Qwen 0.5B) y `app/workers/gpu.worker.ts` (Qwen 1.5B, Llama 3.1 8B, Gemma 2 9B).
- **Backup/Restore**: File System Access API para exportar/importar archivos `.sqlite`.

—

## Estructura de carpetas (extracto)

- `app/`
  - `components/`
    - `Reader.tsx`, `reader/` (UI de lectura, popups, audio)
    - `TranslatorSelector.tsx` (selector de modelos de IA local)
    - `UnknownWordsSection.tsx` (listado y acciones)
  - `routes/`
    - `home.tsx`, `texts/text.tsx`, `words.tsx`, `review.tsx`
  - `services/`
    - `db.ts` (SQLite WASM con OPFS)
  - `hooks/`
    - `useTranslationEngine.ts` (motor de traducción local tiered)
  - `workers/`
    - `cpu.worker.ts` (Transformers.js para CPU)
    - `gpu.worker.ts` (WebLLM para GPU)
  - `context/translatorSelector.ts` (zustand)
  - `utils/` (`translate.ts`, `tts.ts`, `tokenize.ts`, `anki.ts`, `fs.ts`, `scheduler.ts`, `spaced-repetition.ts`)
- `public/` (assets y textos de ejemplo)
- `workers/app.ts` (Cloudflare Worker con headers COOP/COEP)

—

## Rutas

- `/` → `app/routes/home.tsx`: portada y biblioteca (`app/components/Libary.tsx`) con botones de exportar/importar DB.
- `/texts/:id` → `app/routes/texts/text.tsx`: lector, audio y popups de traducción.
- `/words` → listado de palabras desconocidas con estadísticas de repaso.
- `/review` → sesión de repaso con repetición espaciada.

—

## Flujo funcional

1. **Biblioteca** (`app/components/Libary.tsx`)
   - Crea textos con título y contenido (texto plano o Markdown), importa `.txt`, adjunta audio por URL o archivo local.
   - Persiste en SQLite WASM (OPFS) con `addText()`.
   - Exporta/importa tu base de datos completa como archivo `.sqlite`.
2. **Lector** (`app/components/Reader.tsx`)
   - Tokeniza texto y permite click/selección.
   - `WordPopup` y `SelectionPopup` traducen usando `translateTerm()` con fallback automático.
   - Marca palabras como desconocidas (`putUnknownWord`) y permite TTS por palabra.
3. **Palabras** (`app/components/UnknownWordsSection.tsx`)
   - Lista, reproduce TTS, elimina y exporta CSV (`app/utils/anki.ts`).
4. **Repaso** (`app/routes/review.tsx`)
   - Sesión de repaso con algoritmo de repetición espaciada (SM-2).
   - Límite diario configurable de nuevas tarjetas.

—

## Modelo de datos (SQLite WASM)

Base de datos SQLite almacenada en OPFS del navegador (`lingtext.sqlite3`):

- Tabla `texts` (`id`, `title`, `content`, `format`, `created_at`, `audio_ref`).
- Tabla `words` (`word_lower`, `word`, `translation`, `status`, `added_at`, `voice`, `sr_data`).
- Tabla `phrases` (`phrase_lower`, `phrase`, `translation`, `parts`, `added_at`, `sr_data`).
- Tabla `settings` (`key`, `value` - preferencias TTS y otras).
- Tabla `stats` (`date`, `new_cards_studied` - estadísticas diarias).

—

## Sistema de Traducción Local (Tiered)

LingText usa un sistema de traducción 100% local con múltiples niveles según el hardware disponible:

| Tier | Modelo       | Tecnología             | Requisitos      | Descarga |
| ---- | ------------ | ---------------------- | --------------- | -------- |
| 0    | Chrome AI    | window.ai/Translator   | Chrome 121+     | 0 MB     |
| 1    | Qwen 0.5B    | Transformers.js (WASM) | Cualquier CPU   | ~400 MB  |
| 2    | Qwen 1.5B    | WebLLM (WebGPU)        | GPU ~1.8GB VRAM | ~1.1 GB  |
| 3    | Llama 3.1 8B | WebLLM (WebGPU)        | GPU ~6GB VRAM   | ~5.0 GB  |
| 4    | Gemma 2 9B   | WebLLM (WebGPU)        | GPU ~8GB VRAM   | ~6.0 GB  |

- **Detección automática**: La app detecta WebGPU y Chrome AI al cargar.
- **Descarga bajo demanda**: Los modelos se descargan solo cuando el usuario los selecciona.
- **Caché persistente**: Los modelos se guardan en la Cache API del navegador.
- **Workers separados**: CPU y GPU corren en Web Workers para no bloquear la UI.

—

## Audio local, permisos y re‑autorización

- Si el audio está adjunto como archivo local (`FileSystemFileHandle`), el lector intenta materializar una URL temporal.
- En `clientLoader` (`app/routes/texts/text.tsx`) se captura el error de `getFile()` y se devuelve `audioUrl: null` si falta permiso.
- En `Reader` (`app/components/Reader.tsx`), si `audioRef.type === 'file'` y no hay `audioUrl`, se muestra un botón de “Reautorizar audio” que vuelve a solicitar permiso (`ensureReadPermission()` en `app/utils/fs.ts`).
- Se limpian los `ObjectURL` para evitar fugas de memoria.

—

## Instalación y ejecución

Requisitos: Node 20+ y un navegador moderno con soporte para SharedArrayBuffer (Chrome, Edge, Firefox).

1. Instalar dependencias

```bash
npm install
```

2. Desarrollo (SSR con HMR)

```bash
npm run dev
# http://localhost:5173
```

3. Producción

```bash
npm run build
npm run start
# Servirá ./build/server/index.js
```

4. Docker

```bash
docker build -t lingtext .
docker run -p 3000:3000 lingtext
```

—

## Variables de entorno

No se requieren variables de entorno para la funcionalidad principal. La traducción es 100% local.

—

## Accesibilidad y privacidad

- **Accesibilidad**: componentes con `aria-label` en iconos, controles de velocidad de audio, contraste en tema oscuro. Se recomienda revisar con Lighthouse/Axe.
- **Privacidad**: textos, audio (handles) y palabras viven en SQLite WASM dentro del navegador (OPFS). La traducción remota solo envía el término a traducir.
- **Propiedad de datos**: puedes exportar toda tu base de datos como archivo `.sqlite` y llevarla a otro dispositivo o hacer backup en tu PC.

—

## Solución de problemas (FAQ)

- **No se reproduce el audio local**
  - Usa Chrome/Edge en `localhost` o sitio HTTPS (requisito de File System Access API).
  - Si ves “Reautorizar audio”, pulsa y concede permiso. Si falla, re‑adjunta el archivo desde la biblioteca.
- **La traducción devuelve vacío o es lenta**
  - Asegúrate de que el modelo esté descargado (verás una barra de progreso).
  - Los modelos GPU requieren WebGPU. Verifica en `chrome://gpu` que esté habilitado.
  - El modelo CPU (Tier 1) funciona en cualquier dispositivo pero es más lento.
- **No aparece la opción de Chrome AI**
  - La API `Translator` es experimental y solo está en Chrome 121+. Usa los modelos locales de IA.
- **Los modelos GPU no aparecen**
  - Tu navegador no soporta WebGPU. Usa Chrome/Edge actualizado o el modelo CPU.

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
