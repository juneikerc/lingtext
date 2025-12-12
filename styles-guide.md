# LingText — Style Guide (UI)

Este documento define reglas prácticas para mantener un estilo **sobrio y profesional** en toda la UI.

## Principios

- **Neutros primero**: la mayoría de superficies deben ser grises/blancas (y sus equivalentes en dark mode).
- **Un solo color de acento**: usa **indigo** para acciones principales, enlaces y énfasis.
- **Gradientes: casi nunca**: evita `bg-gradient-*` y `bg-clip-text` con degradados en títulos/botones. Si necesitas “vida”, usa _blobs_ sutiles con opacidad baja.
- **Movimiento discreto**: evita `hover:scale-*` y transforms llamativos. Prefiere cambios de color, borde y sombra suave.
- **Accesibilidad por defecto**: estados `focus-visible`, contraste correcto y targets táctiles cómodos.

---

## Tokens recomendados (Tailwind)

### Fondo y secciones

- **Página / sección base**
  - `bg-white dark:bg-gray-950`
- **Sección alterna** (para separar bloques)
  - `bg-gray-50 dark:bg-gray-950`
- **Separadores entre secciones**
  - `border-b border-gray-200 dark:border-gray-800`

### Superficies (cards)

- **Card estándar**
  - `bg-white dark:bg-gray-900`
  - `border border-gray-200 dark:border-gray-800`
  - `shadow-sm`

### Texto

- **Titulares**
  - `text-gray-900 dark:text-gray-100`
- **Cuerpo**
  - `text-gray-600 dark:text-gray-400`
- **Texto secundario**
  - `text-gray-500 dark:text-gray-400`

### Acento de marca (indigo)

- **Texto acento**
  - `text-indigo-600 dark:text-indigo-400`
- **Fondo acento (CTA principal)**
  - `bg-indigo-600 hover:bg-indigo-700 text-white`
- **Focus ring (estándar)**
  - `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950`

### Colores semánticos (uso puntual)

- **Warning/acción sensible** (ej: Importar backup)
  - `bg-amber-600 hover:bg-amber-700 text-white`
  - Ring: `focus-visible:ring-amber-500`
- **Peligro** (eliminar, acciones destructivas)
  - `bg-red-600 hover:bg-red-700 text-white` o botones neutros con `text-red-700` + `bg-red-50`

---

## Patrones de componentes (clases base)

### Wrapper de sección

Recomendación (sección normal):

```txt
relative overflow-hidden py-16 sm:py-20 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800
```

Recomendación (sección alterna):

```txt
relative overflow-hidden py-16 sm:py-20 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800
```

### Blobs decorativos (opcional)

Solo como decoración sutil (opacidad baja):

```txt
absolute inset-0 pointer-events-none
```

```txt
bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-3xl
bg-sky-500/10 dark:bg-sky-400/5 rounded-full blur-3xl
```

Reglas:

- No usar más de 2 blobs por sección.
- Mantener opacidad baja (ej. `/10` o `/5` en dark).
- Evitar degradados en blobs.

### Card

```txt
bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm
hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition duration-200
```

### Badge / pill

```txt
inline-flex items-center px-4 py-2 text-sm font-medium
bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300
border border-gray-200 dark:border-gray-800 rounded-full
```

Con dot:

```txt
w-2 h-2 bg-indigo-500 rounded-full mr-2
```

### Botones

**Primario (CTA)**

```txt
inline-flex items-center justify-center
px-6 py-3 rounded-lg
bg-indigo-600 text-white font-medium
hover:bg-indigo-700 transition-colors duration-200
shadow-sm hover:shadow-md
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950
```

**Secundario (surface)**

```txt
inline-flex items-center justify-center
px-6 py-3 rounded-lg
bg-white dark:bg-gray-900
text-gray-700 dark:text-gray-200
border border-gray-300 dark:border-gray-700
hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950
```

**Icon button (solo icono)**

- Debe llevar `title` y/o `aria-label`.
- Usar superficie neutra:

```txt
p-3 rounded-xl bg-gray-50 dark:bg-gray-800
text-gray-700 dark:text-gray-200
hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200
```

---

## Formularios

### Input / textarea

```txt
w-full px-4 py-3 rounded-xl
border border-gray-300 dark:border-gray-700
bg-gray-50 dark:bg-gray-800
text-gray-900 dark:text-gray-100
placeholder-gray-500 dark:placeholder-gray-400
focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
transition-all duration-200
```

Notas:

- Evitar fondos translúcidos tipo `bg-white/80` salvo overlays.
- Evitar `backdrop-blur-*` salvo necesidad real (modales, glass muy puntual).

---

## Sombras, bordes y transiciones

- **Sombras**
  - Default: `shadow-sm`
  - Hover: `hover:shadow-md`
  - Evitar: `shadow-xl`, `shadow-2xl` en cards normales.

- **Transiciones**
  - Preferir: `transition-colors duration-200`
  - Si también cambia sombra/borde: `transition duration-200`
  - Evitar: `transform hover:scale-*` en botones/cards (si se usa, que sea excepcional).

---

## Dark mode

Reglas:

- Siempre acompañar:
  - Fondo: `bg-*` + `dark:bg-*`
  - Texto: `text-*` + `dark:text-*`
  - Bordes: `border-*` + `dark:border-*`

Objetivo:

- Mantener contraste suficiente (especialmente en textos secundarios).

---

## Accesibilidad (checklist)

- **Focus visible** en links/botones/inputs.
- **Botones con solo icono**: `aria-label`.
- **Targets**: botones con `py-3/py-4` cuando son acciones principales.
- **No depender solo del color** para transmitir estado (usar texto, icono o etiqueta).
- Considerar `motion-reduce:*` si se agregan animaciones.

---

## Checklist rápido antes de subir un cambio

- [ ] No introduje `bg-gradient-*` en superficies principales.
- [ ] Usé `indigo` como acento principal (y semánticos solo cuando aplica).
- [ ] Cards y secciones usan bordes/sombras suaves (no `shadow-xl`).
- [ ] No agregué `hover:scale-*` salvo necesidad justificada.
- [ ] Añadí `focus-visible` en elementos interactivos.
- [ ] Verifiqué dark mode (fondo, texto y bordes).
