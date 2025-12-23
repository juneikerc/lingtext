# LingText Chrome Extension

Extensión de Chrome (Manifest V3) para aprender inglés con subtítulos interactivos de YouTube. Se sincroniza bidireccionalmente con la web app de LingText.

## Arquitectura

```
extension/
├── src/
│   ├── background/
│   │   ├── index.ts      # Service Worker - maneja mensajes entre content scripts
│   │   └── db.ts         # CRUD con chrome.storage.local (palabras, frases, settings)
│   ├── content/
│   │   ├── youtube.tsx   # Content script para YouTube - overlay de subtítulos
│   │   └── bridge.ts     # Content script para lingtext.org - sincronización
│   ├── components/
│   │   ├── SubtitleOverlay.tsx  # Renderiza subtítulos tokenizados
│   │   ├── WordPopup.tsx        # Popup de traducción para palabras
│   │   └── SelectionPopup.tsx   # Popup para frases seleccionadas
│   ├── popup/
│   │   ├── Popup.tsx     # UI del popup de la extensión
│   │   ├── popup.css     # Estilos del popup
│   │   └── index.html    # Entry point del popup
│   ├── utils/
│   │   ├── translate.ts  # Funciones de traducción (Chrome AI, OpenRouter)
│   │   └── tokenize.ts   # Tokenización de texto (espejo de app/utils/tokenize.ts)
│   └── types/
│       └── index.ts      # Tipos compartidos (WordEntry, PhraseEntry, etc.)
├── manifest.json         # Configuración de la extensión MV3
├── vite.config.ts        # Configuración de Vite + CRXJS
└── package.json
```

## Stack Técnico

- **Build**: Vite + [@crxjs/vite-plugin](https://crxjs.dev/vite-plugin)
- **UI**: React 18 (renderizado en Shadow DOM para aislamiento CSS)
- **Storage**: `chrome.storage.local` (no SQLite - Service Workers no soportan OPFS)
- **Traducción**: Chrome AI (Translator API) con fallback a OpenRouter API

## Content Scripts

### `youtube.tsx` - Subtítulos Interactivos

Se inyecta en `https://www.youtube.com/*`. Funcionalidades:

1. **Observa subtítulos nativos** via MutationObserver en `.ytp-caption-segment`
2. **Carga transcript completo** para videos con subtítulos autogenerados (evita el efecto palabra-por-palabra)
3. **Renderiza overlay** con React en Shadow DOM, posicionado sobre el reproductor
4. **Maneja clicks** en palabras para traducción
5. **Soporta selección de frases** con `getSelection()` desde Shadow DOM

```typescript
// Métodos de carga de transcript (en orden de prioridad):
// 1. ytInitialPlayerResponse.captions.playerCaptionsTracklistRenderer.captionTracks
// 2. Regex en HTML: /"captionTracks":\s*(\[[\s\S]*?\])(?=,")/
// 3. URL directa de timedtext en el HTML
// 4. API directa: /api/timedtext?v={videoId}&lang=en&fmt=json3
```

### `bridge.ts` - Sincronización con Web App

Se inyecta en `https://lingtext.org/*` y `http://localhost:*/*`. Maneja la comunicación bidireccional:

```
Extension Popup          Bridge (content script)         Web App
      |                         |                           |
      |-- TRIGGER_SYNC -------->|                           |
      |                         |-- LINGTEXT_SYNC_REQUEST ->|
      |                         |<- LINGTEXT_SYNC_RESPONSE -|
      |                         |   (extension data)        |
      |                         |                    [Web hace merge]
      |                         |<- LINGTEXT_SYNC_COMPLETE -|
      |                         |   (merged data + apiKey)  |
      |                  [Extension reemplaza caché]        |
```

## Background Service Worker

Maneja mensajes de los content scripts:

| Mensaje            | Acción                                               |
| ------------------ | ---------------------------------------------------- |
| `GET_WORDS`        | Retorna todas las palabras de `chrome.storage.local` |
| `GET_PHRASES`      | Retorna todas las frases                             |
| `PUT_WORD`         | Guarda/actualiza una palabra                         |
| `DELETE_WORD`      | Elimina una palabra (marcar como conocida)           |
| `PUT_PHRASE`       | Guarda/actualiza una frase                           |
| `EXPORT_FOR_WEB`   | Exporta datos para sincronización                    |
| `REPLACE_ALL_DATA` | Reemplaza todos los datos (post-sync)                |
| `SYNC_FROM_WEB`    | Merge con datos de la web (legacy)                   |

## Sistema de Traducción

```typescript
enum TRANSLATORS {
  CHROME = "chrome", // Chrome AI (Translator API) - sin costo
  MEDIUM = "medium", // OpenRouter: google/gemini-2.5-flash-lite
  SMART = "smart", // OpenRouter: google/gemini-3-flash-preview
}
```

La configuración del traductor se guarda en `chrome.storage.local` y se sincroniza desde la web app.

## Sincronización de Datos

**Estrategia**: Web como fuente de verdad

1. La extensión envía sus datos a la web
2. La web hace merge (newer wins basado en `addedAt`)
3. La web guarda el resultado y lo devuelve
4. La extensión reemplaza completamente su caché

**Datos sincronizados**:

- `words`: Palabras desconocidas con traducción
- `phrases`: Frases guardadas
- `apiKey`: OpenRouter API key (de web a extensión)
- `translator`: Traductor seleccionado

## Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo con hot reload
npm run dev

# Build de producción
npm run build

# Type checking
npx tsc --noEmit
```

### Cargar en Chrome

1. Ir a `chrome://extensions/`
2. Activar "Modo desarrollador"
3. "Cargar descomprimida" → seleccionar `extension/dist`

### Debug

- **Content scripts**: DevTools de la página (F12)
- **Service Worker**: `chrome://extensions/` → "Inspeccionar vistas: service worker"
- **Popup**: Click derecho en el icono → "Inspeccionar ventana emergente"

## Integración con Web App

La web app (`app/`) incluye el hook `useExtensionSync` en `app/hooks/useExtensionSync.ts` que:

1. Escucha mensajes `postMessage` de la extensión
2. Hace merge de datos cuando recibe `LINGTEXT_SYNC_RESPONSE`
3. Envía `LINGTEXT_SYNC_COMPLETE` con el estado final

El hook se monta en `app/root.tsx` y se ejecuta solo en cliente.

## Limitaciones Conocidas

- **No OPFS en Service Workers**: Usamos `chrome.storage.local` en lugar de SQLite
- **Transcript no siempre disponible**: Algunos videos no exponen el transcript
- **Chrome AI experimental**: Requiere flags habilitados en Chrome Canary/Dev

## Publicación

1. **Chrome Web Store**: Crear cuenta ($5), subir ZIP de `dist/`, esperar revisión
2. **Manual**: Distribuir ZIP para instalación como "extensión descomprimida"
