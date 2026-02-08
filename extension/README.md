# LingText Chrome Extension (v0.2)

Extensión MV3 para YouTube con subtítulos interactivos estilo CC línea a línea,
traducción por palabra y sincronización con LingText Web.

## Cambios principales en v0.2

- Reescritura completa del content script de YouTube.
- Nuevo motor de subtítulos con estabilización de cues (evita crecimiento
  palabra a palabra en ASR).
- Render visual tipo subtítulo CC de línea completa, manteniendo click por
  palabra.
- Nuevo contrato interno de mensajes `LT2_*`.
- Nuevo almacenamiento namespaced `lt2_*`.
- Reset de datos locales al migrar a schema v2.

## Arquitectura

```
extension/src/
  background/
    index.ts      # entrypoint SW + seguridad origen + bootstrap store
    router.ts     # router de mensajes LT2_*
    store.ts      # persistencia v2 (chrome.storage.local)
  content/
    main.tsx              # bootstrap YouTube overlay en shadow DOM
    overlay-root.tsx      # estado principal UI/acciones
    caption-track-loader.ts # carga track inglés + fallback API
    caption-parser.ts     # parser json3/xml
    cue-stabilizer.ts     # fusión/estabilización de cues
    subtitle-engine.ts    # búsqueda binaria por tiempo
    player-observer.ts    # videoId SPA + rect del player
    native-cc.ts          # ocultar/restaurar CC nativo
    bridge.ts             # sync con web app via postMessage
    youtube.tsx           # entry de content script YouTube
  components/
    SubtitleOverlay.tsx
    WordPopup.tsx
    SelectionPopup.tsx
  popup/
    Popup.tsx
```

## Mensajes internos (runtime)

- `LT2_GET_WORDS`, `LT2_GET_WORD`, `LT2_PUT_WORD`, `LT2_DELETE_WORD`
- `LT2_GET_PHRASES`, `LT2_PUT_PHRASE`
- `LT2_GET_SETTINGS`, `LT2_SET_SETTINGS`
- `LT2_EXPORT_SYNC`, `LT2_IMPORT_SYNC`

## Storage keys v2

- `lt2_schema_version`
- `lt2_words`
- `lt2_phrases`
- `lt2_settings`
- `lt2_last_sync`

## Desarrollo

```bash
cd extension
npm run dev
npm run build
```

## Notas funcionales

- Política de idioma para captions: solo inglés (`en*`).
- Si falla transcript, usa fallback DOM captions.
- CC nativo se oculta solo cuando el overlay está mostrando subtítulo.
