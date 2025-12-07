# Cómo configurar tu API Key de OpenRouter en LingText

LingText ofrece tres opciones de traducción para ayudarte a aprender inglés. En este tutorial te explicamos por qué recomendamos configurar OpenRouter y cómo hacerlo paso a paso.

## ¿Por qué necesito una API Key?

### El traductor de Chrome tiene limitaciones

El traductor nativo de Chrome (Chrome AI) es gratuito y rápido, pero tiene dos problemas importantes:

1. **Solo funciona en escritorio** - No está disponible en dispositivos móviles ni en todos los navegadores
2. **Traducciones básicas** - Ofrece una única traducción literal, sin contexto ni variaciones

### OpenRouter ofrece traducciones inteligentes

Con OpenRouter obtienes:

- ✅ **Múltiples significados** según el contexto
- ✅ **Ejemplos de uso** para entender mejor la palabra
- ✅ **Funciona en cualquier dispositivo** con navegador moderno
- ✅ **Modelos de IA avanzados** como Gemini y Claude

### Tu API Key está segura

**Importante**: Tu API Key se guarda únicamente en tu navegador (localStorage/chrome.storage). Nunca se envía a nuestros servidores. Las llamadas a OpenRouter se hacen directamente desde tu navegador.

---

## Paso 1: Crear cuenta en OpenRouter

1. Ve a [openrouter.ai](https://openrouter.ai)
2. Haz clic en **"Sign In"** (arriba a la derecha)
3. Puedes registrarte con Google, GitHub o email

![OpenRouter Sign In](https://openrouter.ai/images/og-image.png)

---

## Paso 2: Obtener tu API Key

1. Una vez dentro, ve a [openrouter.ai/keys](https://openrouter.ai/keys)
2. Haz clic en **"Create Key"**
3. Ponle un nombre descriptivo como "LingText"
4. Copia la key generada (empieza con `sk-or-...`)

> ⚠️ **Guarda esta key en un lugar seguro**. Solo se muestra una vez.

---

## Paso 3: Agregar créditos

OpenRouter funciona con créditos prepagados. Para agregar:

1. Ve a [openrouter.ai/credits](https://openrouter.ai/credits)
2. Haz clic en **"Add Credits"**
3. Selecciona el monto (mínimo $5)
4. Completa el pago con tarjeta

### ¿Cuánto duran los créditos?

Con **$5 USD** puedes hacer aproximadamente:

| Modelo            | Traducciones estimadas | Uso recomendado                  |
| ----------------- | ---------------------- | -------------------------------- |
| Gemini Flash Lite | ~50,000+               | Uso diario, traducciones rápidas |
| Claude 3.5 Sonnet | ~2,000                 | Cuando necesites más precisión   |

**Recomendación**: Usa el modelo intermedio (Gemini) para el 95% de tus traducciones. Solo cambia al modelo inteligente (Claude) cuando sientas que la traducción no tiene sentido o necesitas más contexto.

---

## Paso 4: Configurar en LingText

### En la Web App

1. Abre [lingtext.org](https://lingtext.org)
2. Ve a cualquier texto o al lector
3. Haz clic en el selector de traductor (arriba)
4. Selecciona **"🧠 Inteligente"** o **"🚀 Muy Inteligente"**
5. Pega tu API Key en el campo que aparece
6. ¡Listo! La key se guarda automáticamente

### En la Extensión de Chrome

1. Haz clic en el icono de LingText en la barra de extensiones
2. En la sección **"Traductor"**, selecciona el modelo deseado
3. Pega tu API Key en el campo que aparece
4. La key se guarda y sincroniza con la web

---

## Modelos disponibles

| Modelo               | Velocidad   | Calidad   | Costo por traducción |
| -------------------- | ----------- | --------- | -------------------- |
| ⚡ Chrome AI         | Instantáneo | Básica    | Gratis               |
| 🧠 Gemini Flash Lite | Rápido      | Buena     | ~$0.00001            |
| 🚀 Claude 3.5 Sonnet | Medio       | Excelente | ~$0.003              |

### ¿Cuál elegir?

- **Chrome AI**: Cuando solo necesitas una traducción rápida y básica
- **Gemini Flash Lite**: Para uso diario. Traducciones con contexto a costo casi nulo
- **Claude 3.5 Sonnet**: Para palabras difíciles, expresiones idiomáticas o cuando Gemini no te convence

---

## Estrategia recomendada

1. **Configura Gemini Flash Lite como predeterminado** - Es económico y suficiente para el 95% de los casos

2. **Cambia a Claude solo cuando sea necesario** - Si una traducción no tiene sentido o necesitas más ejemplos

3. **Revisa tu uso mensualmente** - En [openrouter.ai/activity](https://openrouter.ai/activity) puedes ver cuánto has gastado

4. **Recarga cuando llegues a $1 restante** - Así nunca te quedas sin créditos

---

## Preguntas frecuentes

### ¿Es seguro poner mi API Key?

Sí. Tu key se guarda localmente en tu navegador y nunca pasa por nuestros servidores. Las llamadas a OpenRouter se hacen directamente desde tu dispositivo.

### ¿Puedo usar la misma key en la web y la extensión?

Sí. De hecho, cuando sincronizas la extensión con la web, la API Key se copia automáticamente.

### ¿Qué pasa si se me acaban los créditos?

LingText intentará usar Chrome AI como fallback. Si no está disponible, verás un mensaje de error pidiendo que recargues créditos.

### ¿Puedo usar otros proveedores como OpenAI directamente?

Por ahora solo soportamos OpenRouter, que actúa como intermediario y te da acceso a múltiples modelos con una sola API Key.

---

## Resumen

1. Crea cuenta en [openrouter.ai](https://openrouter.ai)
2. Genera una API Key en [openrouter.ai/keys](https://openrouter.ai/keys)
3. Agrega créditos ($5 duran meses de uso normal)
4. Pega la key en LingText (web o extensión)
5. Usa Gemini para uso diario, Claude para casos difíciles

¡Ahora estás listo para aprender inglés con traducciones inteligentes! 🚀
