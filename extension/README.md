# LingText Chrome Extension

Extensión de Chrome para aprender inglés con subtítulos de YouTube, sincronizada con tu vocabulario de LingText.

## Características

- **Subtítulos interactivos**: Haz clic en cualquier palabra de los subtítulos de YouTube para traducirla
- **Vocabulario sincronizado**: Tu lista de palabras conocidas/desconocidas se sincroniza con la app web de LingText
- **Traducción local**: Usa Chrome AI (Translator API) cuando está disponible
- **Detección de frases**: Las frases guardadas se subrayan automáticamente

## Desarrollo

### Requisitos

- Node.js 18+
- npm o pnpm

### Instalación

```bash
cd extension
npm install
```

### Desarrollo

```bash
npm run dev
```

Esto genera la extensión en modo desarrollo. Para cargarla en Chrome:

1. Abre `chrome://extensions/`
2. Activa "Modo desarrollador"
3. Clic en "Cargar descomprimida"
4. Selecciona la carpeta `extension/dist`

### Build

```bash
npm run build
```

## Estructura

```
extension/
├── src/
│   ├── background/     # Service Worker
│   │   ├── index.ts    # Punto de entrada
│   │   └── db.ts       # Almacenamiento (chrome.storage)
│   ├── content/
│   │   ├── youtube.tsx # Content script para YouTube
│   │   ├── youtube.css # Estilos del overlay
│   │   └── bridge.ts   # Sync con lingtext.org
│   ├── popup/          # UI del popup
│   ├── components/     # Componentes React compartidos
│   ├── utils/          # Utilidades (tokenize, translate)
│   └── types/          # TypeScript types
├── manifest.json       # Manifest V3
└── vite.config.ts      # Configuración de Vite + CRXJS
```

## Sincronización

La extensión mantiene su propia copia de los datos (palabras, frases) usando `chrome.storage.local`.

Para sincronizar con la app web:

1. Abre lingtext.org
2. El content script `bridge.ts` detecta la extensión
3. Los datos se intercambian via `postMessage`

## Notas técnicas

- Usamos `chrome.storage.local` en lugar de SQLite WASM porque los Service Workers de extensiones tienen limitaciones con OPFS
- Los estilos del overlay usan Shadow DOM para evitar conflictos con YouTube
- La traducción usa Chrome AI (Translator API) cuando está disponible, con fallback a OpenRouter
