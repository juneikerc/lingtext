# LingText: Aprende inglés leyendo, con traducción instantánea, TTS y repaso espaciado

[LingText](https://lingtext.org) es una aplicación web full‑stack enfocada en aprender inglés a través de la lectura activa. Combina biblioteca de textos, traducción de palabras o selecciones al español, Text‑to‑Speech (TTS), gestión de vocabulario con repetición espaciada, y exportación/importación de tu base de datos SQLite.

Su objetivo es ayudar a construir vocabulario en contexto, minimizando fricción: seleccionas o haces click sobre palabras mientras lees, escuchas la pronunciación, guardas lo desconocido y lo repasas con un algoritmo de repetición espaciada.

—

## Características principales

- **Lectura centrada en el aprendizaje**: biblioteca de textos locales o por URL, con soporte de audio adjunto y formato Markdown.
- **Traducción instantánea**: usa la API de Traducción local de Chrome si está disponible; si no, puede usar OpenRouter directamente desde el cliente con una API key configurada por el usuario.
- **TTS (Text‑to‑Speech)**: pronuncia palabras al instante con la Web Speech API y configura voz, idioma y velocidad.
- **Gestión de vocabulario**: marca palabras y frases como "desconocidas", guárdalas con repetición espaciada integrada.
- **Base de datos SQLite local**: todos tus datos se almacenan en SQLite WASM con persistencia en OPFS (Origin Private File System).
- **Exportar/Importar datos**: descarga tu base de datos `.sqlite` a tu PC o impórtala desde otro dispositivo. Tus datos, tu control.
- **Repetición espaciada**: algoritmo SM-2 integrado para repasar vocabulario de forma óptima.
- **Generador de historias**: crea textos personalizados (cuentos, artículos, conversaciones, blogs, emails) basados en tu vocabulario seleccionado, con nivel CEFR configurable (A2-C2) y palabras destacadas en bold para reforzar el aprendizaje en contexto.
- **Audio**: reproduce audio adjunto (URL o archivo local vía File System Access API) con control de velocidad.
- **SSR + HMR**: renderizado en servidor con React Router v7 y DX moderna con Vite.

## Público objetivo y filosofía

- **Autoestudio guiado**: pensado para estudiantes autodidactas que quieren leer y construir vocabulario con mínimo contexto técnico.
- **Local‑first con propiedad de datos**: todos los textos, audio y palabras se guardan en SQLite dentro de tu navegador (OPFS). Puedes exportar tu base de datos completa como archivo `.sqlite` y llevarla a otro dispositivo.
- **Privacidad por defecto**: la traducción remota solo envía la palabra o selección directamente a OpenRouter cuando eliges un modelo remoto. Nunca se envían tus textos completos ni tu vocabulario.
- **Bajo coste**: aprovecha capacidades locales (Chrome Translator, TTS, SQLite WASM) y solo usa modelos remotos cuando es necesario.

—

## Demo rápida

1. Crea o importa un texto en la Biblioteca.
2. Abre el lector y haz click en una palabra: verás su traducción y podrás marcarla como desconocida o escucharla.
3. Selecciona un fragmento para traducir y guardar múltiples palabras.
4. Ve a “Palabras” para repasar, escuchar y exportar a CSV.
5. Genera historias personalizadas: selecciona hasta 20 palabras de tu vocabulario, elige el tipo de texto (cuento, artículo, conversación, etc.), configura el nivel (A2-C2) y la IA creará textos que contengan tus palabras seleccionadas, reforzando el aprendizaje en contexto.

—

## Stack técnico

- **Framework**: `react-router` 7 (SSR) + `vite` 6 + `react` 19 + `tailwindcss` 4.
- **Estado global**: `zustand` (`app/context/translatorSelector.ts`).
- **Base de datos**: SQLite WASM (`@sqlite.org/sqlite-wasm`) con persistencia en OPFS (`app/services/db.ts`).
- **TTS**: Web Speech API (`app/utils/tts.ts`).
- **Traducción**: Chrome Translator local si existe (`app/utils/translate.ts`) y OpenRouter directo desde el cliente con clave almacenada localmente (`app/services/db/settings.ts`).
- **Backup/Restore**: File System Access API para exportar/importar archivos `.sqlite`.

—

## Estructura de carpetas (extracto)

- `app/`
  - `components/`
    - `Reader.tsx`, `reader/` (UI de lectura, popups, audio y hooks de interacción)
    - `UnknownWordsSection.tsx`, `study-library/` (listado, acciones y hooks de biblioteca de estudio)
    - `StoryGenerator.tsx` (modal para generar historias personalizadas)
    - `library/` (gestión de textos, backup, carpetas y tarjetas)
  - `routes/`
    - `home.tsx`, `texts/text.tsx`, `words.tsx`, `review.tsx`
  - `services/`
    - `db/` (SQLite WASM con OPFS)
  - `context/translatorSelector.ts` (zustand)
  - `utils/` (`translate.ts`, `tts.ts`, `anki.ts`, `fs.ts`, `scheduler.ts`, `spaced-repetition.ts`, `story-generator.ts` - lógica de generación de historias con IA)
  - `shared/` (tipos, tokenización, traducción y contratos de sync compartidos con la extensión)
  - `public/` (assets y textos de ejemplo)
  - `workers/app.ts` (Cloudflare Worker con headers COOP/COEP)

—

## Rutas

- `/` → `app/routes/home.tsx`: portada y biblioteca (`app/components/Libary.tsx`) con botones de exportar/importar DB.
- `/texts/:id` → `app/routes/texts/text.tsx`: lector, audio y popups de traducción.
- `/words` → listado de palabras desconocidas con estadísticas de repaso.
- `/review` → sesión de repaso con repetición espaciada.

## Flujo funcional

1. **Biblioteca** (`app/components/Libary.tsx`)
   - Crea textos con título y contenido (texto plano o Markdown), importa `.txt`, adjunta audio por URL o archivo local.
   - Persiste en SQLite WASM (OPFS) con `addText()`.
   - Exporta/importa tu base de datos completa como archivo `.sqlite`.
2. **Lector** (`app/components/Reader.tsx`)
   - Tokeniza texto y permite click/selección.
   - `WordPopup` y `SelectionPopup` traducen usando `translateTerm()` con Chrome local, MyMemory o OpenRouter según el método elegido.
   - Marca palabras como desconocidas (`putUnknownWord`) y permite TTS por palabra.
3. **Palabras** (`app/components/UnknownWordsSection.tsx`)
   - Lista, reproduce TTS, elimina y exporta CSV (`app/utils/anki.ts`).
   - Selecciona hasta 20 palabras y genera historias personalizadas con IA (`StoryGenerator.tsx`).
4. **Generador de historias** (`app/components/StoryGenerator.tsx`, `app/utils/story-generator.ts`)
   - Selecciona hasta 20 palabras de tu vocabulario.
   - Elige tipo de texto (cuento corto, artículo, conversación, blog post, email).
   - Configura tema personalizado (opcional) y nivel CEFR (A2-C2, default B1).
   - Genera 1-3 textos en lote que contienen las palabras seleccionadas en **bold**.
   - Textos se guardan en DB como markdown y se abren en el lector.
5. **Repaso** (`app/routes/review.tsx`)
   - Sesión de repaso con algoritmo de repetición espaciada (SM-2).
   - Límite diario configurable de nuevas tarjetas.

—

## Modelo de datos (SQLite WASM)

Base de datos SQLite almacenada en OPFS del navegador (`lingtext.sqlite3`):

- Tabla `texts` (`id`, `title`, `content`, `format`, `created_at`, `audio_ref`).
- Tabla `words` (`word_lower`, `word`, `translation`, `status`, `added_at`, `voice`, `sr_data`).
- Tabla `phrases` (`phrase_lower`, `phrase`, `translation`, `parts`, `added_at`, `sr_data`).
- Tabla `settings` (`key`, `value` - preferencias TTS, método de traducción y API key local).
- Tabla `stats` (`date`, `new_cards_studied` - estadísticas diarias).

—

## Traducción: local y remota

- **Local (Chrome)**: `translateFromChrome(term)` usa la API `Translator` si existe.
- **Remota (MyMemory)**: `translateWithMyMemory(term)` sirve como opción gratuita limitada.
- **Remota (OpenRouter)**: `translateWithOpenRouter(term, model)` llama directo a `https://openrouter.ai/api/v1/chat/completions` desde el cliente.
- **Unificación**: `translateTerm(term, selected)` usa el método escogido en la UI y aplica fallbacks cuando corresponde.
- **Clave API**: la API key de OpenRouter se configura en la app y se guarda en SQLite/OPFS dentro del navegador del usuario. La app no usa actualmente un endpoint `/translate` ni requiere `OPEN_ROUTER_API_KEY` en el servidor para traducir.

—

## Audio local, permisos y re‑autorización

- Si el audio está adjunto como archivo local (`FileSystemFileHandle`), el lector intenta materializar una URL temporal.
- En `clientLoader` (`app/routes/texts/text.tsx`) se captura el error de `getFile()` y se devuelve `audioUrl: null` si falta permiso.
- En `Reader` (`app/components/Reader.tsx`), si `audioRef.type === 'file'` y no hay `audioUrl`, se muestra un botón de “Reautorizar audio” que vuelve a solicitar permiso (`ensureReadPermission()` en `app/utils/fs.ts`).
- Se limpian los `ObjectURL` para evitar fugas de memoria.

—

## Instalación y ejecución

Requisitos: Node 20+ y un navegador moderno. Para usar OpenRouter, necesitarás una clave que configuras dentro de la app.

1. Instalar dependencias

```bash
npm install
```

2. Desarrollo (SSR con HMR)

```bash
npm run dev
# http://localhost:5173
```

3. Preview local de producción

```bash
npm run build
npm run preview
```

4. Deploy en Cloudflare Workers

```bash
npm run deploy
```

—

## Variables de entorno

- No necesitas definir `OPEN_ROUTER_API_KEY` para la traducción actual de la app.
- `wrangler.json` y `worker-configuration.d.ts` pueden seguir declarando secretos de Worker para otros flujos o despliegues futuros, pero la traducción interactiva del lector no depende de ellos hoy.

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
- **La traducción devuelve vacío**
  - Verifica que tu API key de OpenRouter esté guardada en la configuración de la app y que haya conectividad. Chrome Translator puede no estar disponible en tu navegador; en ese caso usa MyMemory o un modelo remoto configurado.
- **No aparece la opción de Chrome Translator**
  - La API `Translator` es experimental y solo está en algunas versiones de Chrome. Usa los modelos remotos.

—

## Roadmap

- ~~Listado por texto de palabras desconocidas y progreso~~ (implementado)
- ~~Generación de historias personalizadas~~ (implementado)
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
