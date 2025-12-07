# Plan de Desarrollo: Extensión de Chrome para LingText (YouTube Integration)

Este documento detalla el plan para crear una extensión de Chrome que lleve la funcionalidad de "Reader" de LingText a los videos de YouTube, sincronizando la base de datos local (SQLite WASM) para una experiencia de aprendizaje continua.

## 1. Arquitectura General

La extensión funcionará como un "compañero" de la aplicación web principal. Dado que el almacenamiento OPFS está aislado por origen, la extensión y la web app no pueden compartir los mismos datos directamente.

### Componentes Principales:

1.  **Extension Popup**: Interfaz rápida para configuración y estado de sincronización.
2.  **Content Script (YouTube)**:
    - Detecta videos y subtítulos.
    - Intercepta o descarga los subtítulos.
    - Renderiza una capa UI (Shadow DOM) que replica `ReaderText.tsx` sobre los subtítulos o en un panel lateral.
    - Maneja clics para traducción y marcado de palabras (conocido/desconocido).
3.  **Content Script (LingText Web)**:
    - Se inyecta solo en `lingtext.com` (o localhost).
    - Sirve como puente para sincronizar datos entre la web app y la extensión.
4.  **Background Worker**: Maneja la persistencia de datos (SQLite WASM dentro de la extensión) y la orquestación.

## 2. Estrategia de Datos y Sincronización

### Desafío

El OPFS de `lingtext.com` no es accesible desde `chrome-extension://...`.

### Solución: "Bridge Sync"

Implementaremos un mecanismo de sincronización que se activa cuando el usuario abre la web app.

1.  **Extensión DB**: La extensión tendrá su propia instancia de SQLite WASM con el mismo esquema (`words`, `phrases`, `settings`).
2.  **Protocolo de Sync**:
    - El usuario visita `lingtext.com/sync` (o cualquier página de la app).
    - El Content Script de la extensión solicita los datos a la página.
    - La página web (React App) expone una función o escucha eventos (via `window.postMessage`) para exportar las tablas `words` y `phrases`.
    - El Content Script recibe los datos y los envía al Background Worker para actualizar la DB local de la extensión.
    - **Bidireccional**: Los cambios hechos en YouTube (nuevas palabras aprendidas) se envían de vuelta a la web app de la misma manera.

## 3. Reutilización de Código (Shared Logic)

Para asegurar consistencia, copiaremos/adaptaremos los siguientes módulos clave de la web app a la extensión:

- **`app/utils/tokenize.ts`**: CRÍTICO. La tokenización debe ser idéntica para que el macheo de palabras funcione.
- **`app/services/db.ts`**: Adaptar para correr en el contexto de la extensión (Background Service Worker).
- **`app/components/reader/ReaderText.tsx`**: Adaptar para funcionar dentro de un Shadow DOM en YouTube.
- **`app/utils/translate.ts`**: Reutilizar la lógica de Chrome AI y OpenRouter.

## 4. Integración con YouTube

### Captura de Subtítulos

- **Método A (DOM Observer)**: Leer los subtítulos que YouTube renderiza (`.ytp-caption-segment`). Es frágil pero no requiere API key.
- **Método B (Network Intercept)**: Interceptar las peticiones de `timedtext` de YouTube para obtener el XML/JSON completo de los subtítulos.
- **Método C (Youtube Player API)**: Si es posible, usar la API oficial.

### UI Overlay

1.  Ocultar los subtítulos nativos de YouTube.
2.  Mostrar nuestro componente `ReaderText` personalizado en la misma posición.
3.  Sincronizar el texto mostrado con el `currentTime` del video.

## 5. Pasos de Implementación

### Fase 1: Setup del Proyecto

- [ ] Inicializar proyecto de extensión (Vite + React + CRXJS o similar).
- [ ] Configurar TypeScript y compartir tipos con la app principal.
- [ ] Configurar SQLite WASM en el entorno de la extensión (requiere configuraciones específicas de CSP y headers en el manifest).

### Fase 2: Base de Datos en Extensión

- [ ] Portar `app/services/db.ts` para que funcione en el Background Worker.
- [ ] Implementar el esquema de base de datos idéntico.

### Fase 3: Mecanismo de Sync

- [ ] Crear ruta oculta o botón en LingText Web para iniciar sync.
- [ ] Implementar `window.postMessage` handler en la Web App para exportar/importar datos.
- [ ] Implementar listener en Content Script para recibir datos y guardarlos.

### Fase 4: YouTube Reader

- [ ] Script para interceptar subtítulos de YouTube.
- [ ] Componente React flotante que reemplaza los subtítulos.
- [ ] Implementar lógica de `ReaderText` con el estado local de la extensión.
- [ ] Habilitar `onWordClick` para mostrar popup de traducción (reutilizar `WordPopup`).

### Fase 5: Traducción y TTS

- [ ] Integrar `translateTerm` (Chrome AI + OpenRouter).
- [ ] Integrar TTS (Web Speech API).

## 6. Estructura de Archivos Propuesta (Extensión)

```
extension/
  src/
    background/
      index.ts      # Worker principal, manejo de BD
      db.ts         # Adaptación de app/services/db.ts
    content/
      youtube.tsx   # Lógica para video player
      bridge.ts     # Lógica de sync con lingtext.com
    popup/
      Popup.tsx     # UI de configuración
    components/
      ReaderOverlay.tsx # Versión adaptada de ReaderText
    utils/
      tokenize.ts   # Copia exacta
      translate.ts  # Adaptado
```

## 7. Notas Técnicas Importantes

- **SQLite WASM en Extensiones**: Puede requerir `offscreen` documents o configuraciones específicas porque los Service Workers no tienen acceso a todas las APIs de almacenamiento de la misma manera que una web normal, aunque OPFS ya está soportado en Workers modernos.
- **Chrome AI**: La API `window.ai` o `window.Translator` debe estar disponible en el contexto donde se ejecute la traducción.
