# LingText — Style Guide v2.1 (Modern Reading App)

Guía de estilos moderna para aplicaciones de lectura tipo LingQ, Readlang y apps de aprendizaje de idiomas contemporáneas.

**Color primario:** `#0F9EDA` (Ocean Blue)

---

## Principios de Diseño

### 1. **Minimalismo Funcional**

- Interfaz limpia que no compita con el contenido
- Espacios generosos y aire entre elementos
- Jerarquía visual clara mediante tamaño, peso y color

### 2. **Foco en la Lectura**

- Fondos de alto contraste pero suaves
- Tipografía optimizada para lectura prolongada
- Elementos UI que se desvanecen cuando no se usan

### 3. **Interacciones Fluidas**

- Transiciones suaves (200-300ms)
- Estados hover discretos pero informativos
- Feedback inmediato en acciones del usuario

### 4. **Paleta Restringida**

- Un color de acento dominante (`#0F9EDA`)
- Neutros sofisticados (grises)
- Uso moderado de colores semánticos

---

## Sistema de Colores

### Color Primario — Ocean Blue

```css
--primary-50: #e6f7fd;
--primary-100: #c0ebfa;
--primary-200: #96ddf6;
--primary-300: #6bcff2;
--primary-400: #3ac2ed;
--primary-500: #0f9eda; /* Principal */
--primary-600: #0d8ec4;
--primary-700: #0a7aab;
--primary-800: #086692;
--primary-900: #054d6e;
```

**Uso:**

- Botones primarios: `bg-[#0F9EDA] hover:bg-[#0D8EC4]`
- Enlaces activos / acentos: `text-[#0F9EDA]`
- Focus rings: `focus-visible:ring-[#0F9EDA]`
- Fondos sutiles: `bg-[#0F9EDA]/5`, `bg-[#0F9EDA]/10`
- Bordes sutiles: `border-[#0F9EDA]/20`, `border-[#0F9EDA]/30`
- Elementos de marca / badges: `bg-[#0F9EDA]/10 text-[#0F9EDA]`

### Neutros — Grises

```css
--gray-50: #f8fafc; /* Fondos muy claros */
--gray-100: #f1f5f9; /* Cards/fondos secundarios */
--gray-200: #e2e8f0; /* Bordes suaves */
--gray-300: #cbd5e1; /* Bordes estándar */
--gray-400: #94a3b8; /* Texto deshabilitado */
--gray-500: #64748b; /* Texto secundario */
--gray-600: #475569; /* Texto terciario */
--gray-700: #334155; /* Texto principal */
--gray-800: #1e293b; /* Títulos */
--gray-900: #0f172a; /* Texto máximo contraste */
```

### Colores Semánticos

```css
/* Éxito */
--success-50: #ecfdf5;
--success-500: #10b981;
--success-600: #059669;

/* Advertencia */
--warning-50: #fffbeb;
--warning-500: #f59e0b;
--warning-600: #d97706;

/* Error */
--error-50: #fef2f2;
--error-500: #ef4444;
--error-600: #dc2626;

/* Información */
--info-50: #eff6ff;
--info-500: #3b82f6;
--info-600: #2563eb;
```

---

## Tipografía

### Escala de Tamaños

| Nivel | Tamaño          | Peso | Uso                 |
| ----- | --------------- | ---- | ------------------- |
| Hero  | 3rem (48px)     | 700  | Títulos principales |
| H1    | 2.25rem (36px)  | 700  | Títulos de sección  |
| H2    | 1.875rem (30px) | 600  | Subtítulos          |
| H3    | 1.5rem (24px)   | 600  | Encabezados de card |
| H4    | 1.25rem (20px)  | 600  | Títulos menores     |
| Body  | 1rem (16px)     | 400  | Texto principal     |
| Small | 0.875rem (14px) | 400  | Texto secundario    |
| XS    | 0.75rem (12px)  | 500  | Etiquetas, badges   |

### Familia Tipográfica

```css
--font-sans:
  "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-reading: "Georgia", "Times New Roman", serif; /* Para modo lectura */
--font-mono: "JetBrains Mono", "Fira Code", monospace;
```

### Altura de Línea

- **Títulos:** 1.2 (agregar `tracking-tight` en títulos grandes)
- **Cuerpo:** 1.6
- **Lectura:** 1.8

---

## Espaciado

### Secciones

- **Padding vertical secciones:** `py-16 sm:py-24` (64–96px)
- **Gap entre secciones:** `gap-6` o `gap-8`
- **Max-width contenido:** `max-w-7xl` (1280px) o `max-w-6xl` (1152px)

---

## Componentes Reutilizables

### SectionHeader (Encabezado de sección)

Patrón estándar para el título y subtítulo de cada sección de landing page.

```tsx
<div className="text-center mb-16">
  {/* Badge con dot */}
  <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-gray-700 bg-gray-50 rounded-full border border-gray-200">
    <span className="w-2 h-2 bg-[#0F9EDA] rounded-full mr-2.5"></span>
    Etiqueta del Badge
  </div>
  {/* Título con acento */}
  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
    Texto principal <span className="text-[#0F9EDA]">Acento</span>
  </h2>
  {/* Subtítulo */}
  <p className="text-xl leading-relaxed text-gray-600 max-w-3xl mx-auto">
    Descripción de la sección.
  </p>
</div>
```

**Reglas:**

- Badge: `bg-gray-50`, dot `bg-[#0F9EDA]`, separación `mr-2.5`
- Título: `font-bold` (no `font-extrabold`), `tracking-tight`
- Palabra acentuada: `<span className="text-[#0F9EDA]">`
- Subtítulo: `text-xl leading-relaxed text-gray-600 max-w-3xl mx-auto`

### FeatureGridCard (Card de características en grid)

Para grids de 2 o 4 columnas con icono, título, descripción y bullets.

```tsx
<div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-8">
  {/* Icono en badge */}
  <div className="w-12 h-12 bg-[#0F9EDA]/10 rounded-xl flex items-center justify-center mb-6 border border-[#0F9EDA]/20">
    <span className="text-xl">{icon}</span>
  </div>
  <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
  <p className="text-gray-600 leading-relaxed mb-6">{description}</p>
  {/* Bullets */}
  <div className="space-y-2.5">
    {bullets.map((b) => (
      <div key={b} className="flex items-center text-sm text-gray-700">
        <div className="w-1.5 h-1.5 bg-[#0F9EDA] rounded-full mr-3"></div>
        {b}
      </div>
    ))}
  </div>
</div>
```

**Reglas:**

- Icono: `w-12 h-12 bg-[#0F9EDA]/10 rounded-xl border border-[#0F9EDA]/20`
- Bullets: punto `w-1.5 h-1.5 bg-[#0F9EDA] rounded-full`, texto `text-sm text-gray-700`
- Hover: `hover:shadow-md transition-shadow duration-200`

### StepCard (Card de pasos / guía)

Para secciones tipo "guía de uso" con numeración, descripción y tip.

```tsx
<div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-8">
  <div className="flex items-start gap-6">
    {/* Número */}
    <div className="flex-shrink-0 w-12 h-12 bg-[#0F9EDA]/10 rounded-xl flex items-center justify-center text-[#0F9EDA] font-bold text-lg border border-[#0F9EDA]/20">
      {number}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center flex-wrap gap-2">
        <span>{title}</span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          {badge}
        </span>
      </h3>
      <p className="text-base text-gray-700 leading-relaxed mb-4">
        {description}
      </p>
      {/* Tip box */}
      <div className="bg-[#0F9EDA]/5 rounded-xl p-4 border border-[#0F9EDA]/10">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-[#0F9EDA]">{tipLabel}:</span>{" "}
          {tipText}
        </p>
      </div>
    </div>
  </div>
</div>
```

**Reglas:**

- Número: `bg-[#0F9EDA]/10 text-[#0F9EDA] border-[#0F9EDA]/20`
- Badge secundario: `bg-gray-100 text-gray-600`
- Badge primario: `bg-[#0F9EDA]/10 text-[#0F9EDA] border border-[#0F9EDA]/20`
- Tip box: `bg-[#0F9EDA]/5 border-[#0F9EDA]/10`, label en `text-[#0F9EDA] font-semibold`

### LevelCard (Card de nivel)

Para grids de niveles con icono/letra, título y descripción.

```tsx
<Link className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#0F9EDA]/30 transition-all duration-200 p-8 flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50">
  <div className="flex items-center justify-between mb-4">
    <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#0F9EDA]/10 text-[#0F9EDA] text-xl font-bold border border-[#0F9EDA]/20 group-hover:bg-[#0F9EDA] group-hover:text-white group-hover:border-[#0F9EDA] transition-colors duration-200">
      {level}
    </span>
    <svg className="w-5 h-5 text-gray-300 group-hover:text-[#0F9EDA] transition-colors duration-200">
      {/* arrow icon */}
    </svg>
  </div>
  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0F9EDA] transition-colors duration-200">
    {title}
  </h3>
  <p className="text-gray-600 leading-relaxed">{description}</p>
</Link>
```

**Reglas:**

- Badge de nivel: `bg-[#0F9EDA]/10 text-[#0F9EDA] border-[#0F9EDA]/20`, hover `group-hover:bg-[#0F9EDA] group-hover:text-white`
- Hover border: `hover:border-[#0F9EDA]/30`
- Hover título: `group-hover:text-[#0F9EDA]`

### TrustBanner (Banner de confianza / CTA final)

Para secciones de cierre con mensaje de confianza y tags.

```tsx
<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-12 text-center">
  <div className="w-14 h-14 mx-auto mb-6 bg-[#0F9EDA]/10 rounded-2xl flex items-center justify-center border border-[#0F9EDA]/20">
    <span className="text-[#0F9EDA] text-2xl">{icon}</span>
  </div>
  <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
  <p className="text-base text-gray-600 mb-8 max-w-xl mx-auto">{description}</p>
  {/* Tags */}
  <div className="flex flex-wrap justify-center gap-3">
    {tags.map((tag) => (
      <span className="inline-flex items-center px-4 py-2 bg-[#0F9EDA]/5 text-[#0F9EDA] text-sm font-medium rounded-full border border-[#0F9EDA]/10">
        {tag}
      </span>
    ))}
  </div>
</div>
```

**Reglas:**

- Icono: `w-14 h-14 bg-[#0F9EDA]/10 rounded-2xl border-[#0F9EDA]/20`
- Tags: `bg-[#0F9EDA]/5 text-[#0F9EDA] border-[#0F9EDA]/10`

### CTASection (Sección de call-to-action)

Para secciones con botones primario/secundario.

```tsx
<div className="flex flex-col sm:flex-row gap-4 justify-center">
  <Link className="inline-flex items-center justify-center px-8 py-4 bg-[#0F9EDA] text-white font-semibold rounded-xl hover:bg-[#0D8EC4] transition-all duration-200 shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2">
    Primario
  </Link>
  <Link className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#0F9EDA] font-semibold rounded-xl border border-[#0F9EDA]/20 hover:border-[#0F9EDA]/40 hover:bg-[#0F9EDA]/5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2">
    Secundario
  </Link>
</div>
```

**Reglas:**

- Botón primario: `bg-[#0F9EDA] hover:bg-[#0D8EC4] text-white shadow-sm hover:shadow`
- Botón secundario: `bg-white text-[#0F9EDA] border-[#0F9EDA]/20 hover:border-[#0F9EDA]/40 hover:bg-[#0F9EDA]/5`

---

## Componentes Base

### Botones

**Primario**

```
bg-[#0F9EDA] hover:bg-[#0D8EC4]
text-white font-semibold
px-6 py-3 (o px-8 py-4 para CTAs grandes)
rounded-xl
shadow-sm hover:shadow
transition-all duration-200
focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2
```

**Secundario**

```
bg-white
border border-gray-200
text-gray-700
hover:border-[#0F9EDA] hover:text-[#0F9EDA]
px-6 py-3
rounded-xl
transition-colors duration-200
focus-visible:ring-2 focus-visible:ring-[#0F9EDA] focus-visible:ring-offset-2
```

**Ghost**

```
bg-transparent
text-gray-600
hover:bg-gray-100
hover:text-gray-900
px-4 py-2
rounded-lg
transition-colors duration-200
```

### Cards

**Estándar**

```
bg-white
rounded-2xl
border border-gray-200
shadow-sm hover:shadow-md
transition-shadow duration-200
p-6
```

### Badges

**Con dot (para secciones)**

```
inline-flex items-center
px-4 py-2
bg-gray-50
border border-gray-200
text-sm font-medium text-gray-700
rounded-full

/* Dot */
w-2 h-2
bg-[#0F9EDA] rounded-full
mr-2.5
```

**Primario (para tags inline)**

```
inline-flex items-center
px-3 py-1
bg-[#0F9EDA]/10
border border-[#0F9EDA]/20
text-sm font-medium text-[#0F9EDA]
rounded-full
```

**Secundario (para labels en cards)**

```
px-3 py-1
bg-gray-100
text-xs font-medium text-gray-600
rounded-full
```

### Inputs

```
w-full
px-4 py-3
bg-gray-50
border border-gray-200
rounded-xl
text-gray-900
placeholder:text-gray-400
focus:border-[#0F9EDA] focus:ring-2 focus:ring-[#0F9EDA]/20
transition-all duration-200
```

---

## Layouts

### Sección Hero

```
relative overflow-hidden
bg-gradient-to-b from-gray-50 to-white
py-20 md:py-28
border-b border-gray-200
```

### Sección Contenido (fondo blanco)

```
relative
bg-white
py-16 sm:py-24
border-b border-gray-200
```

### Sección Alterna (fondo gris)

```
relative
bg-gray-50
py-16 sm:py-24
border-b border-gray-200
```

### Container

```
max-w-7xl mx-auto  (o max-w-6xl, max-w-4xl)
px-4 sm:px-6 lg:px-8
```

### Decorative Blobs

```
absolute inset-0 pointer-events-none
bg-[#0F9EDA]/5
rounded-full blur-3xl
```

Usar máximo 2 blobs por sección, posiciones alternas (ej: `top-right` y `bottom-left`).

---

## Efectos Visuales

### Sombras

```css
shadow-sm: 0 1px 2px rgba(0,0,0,0.05)       /* Sutil */
shadow: 0 1px 3px rgba(0,0,0,0.1)            /* Estándar */
shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1)    /* Elevada */
shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1)  /* Destacada */
```

### Bordes Redondeados

```css
rounded-lg:  0.5rem  (8px)   — Botones pequeños, badges
rounded-xl:  0.75rem (12px)  — Botones, inputs, icon boxes
rounded-2xl: 1rem    (16px)  — Cards, contenedores
rounded-3xl: 1.5rem  (24px)  — Hero elements
rounded-full: 50%            — Badges pill
```

---

## Transiciones y Animaciones

### Duraciones

```css
--duration-fast: 150ms; /* Hover states */
--duration-normal: 200ms; /* UI interactions */
--duration-slow: 300ms; /* Page transitions */
```

### Patrones comunes

**Hover suave**

```css
transition-all duration-200
```

**Hover solo sombra**

```css
transition-shadow duration-200
```

**Focus ring**

```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-[#0F9EDA]
focus-visible:ring-offset-2
focus-visible:ring-offset-white
```

---

## Accesibilidad

### Contraste

- Texto normal: mínimo 4.5:1
- Texto grande: mínimo 3:1
- Botones e interactivos: mínimo 3:1

### Focus States

```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-[#0F9EDA]
focus-visible:ring-offset-2
focus-visible:ring-offset-white
```

### Targets táctiles

- Mínimo 44x44px para botones
- Espaciado mínimo 8px entre elementos táctiles
- Padding generoso en inputs (`py-3` mínimo)

---

## Ejemplos de Reemplazo

### v1 (indigo) → v2 (Ocean Blue)

| Antes                           | Después                        |
| ------------------------------- | ------------------------------ |
| `bg-indigo-600`                 | `bg-[#0F9EDA]`                 |
| `hover:bg-indigo-700`           | `hover:bg-[#0D8EC4]`           |
| `text-indigo-600`               | `text-[#0F9EDA]`               |
| `bg-indigo-50`                  | `bg-[#0F9EDA]/10`              |
| `text-indigo-500`               | `text-[#0F9EDA]`               |
| `border-indigo-100`             | `border-[#0F9EDA]/20`          |
| `border-indigo-200`             | `border-[#0F9EDA]/20`          |
| `focus-visible:ring-indigo-500` | `focus-visible:ring-[#0F9EDA]` |
| `bg-sky-500/10` (blobs)         | `bg-[#0F9EDA]/5`               |
| `bg-indigo-500/10` (blobs)      | `bg-[#0F9EDA]/5`               |
| `font-extrabold`                | `font-bold`                    |

---

## Recursos

- **Color primario:** `#0F9EDA` (Ocean Blue)
- **Hover primario:** `#0D8EC4`
- **Tailwind Config:** Colores definidos en `app.css` `@theme`
- **Prefers reduced motion:** Respetar `prefers-reduced-motion: reduce`
