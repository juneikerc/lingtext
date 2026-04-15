import type {
  DictationQuestion,
  LevelTestSummary,
  TestDefinition,
  TestLevel,
  TestLevelMeta,
  TestQuestion,
  TestResultBand,
  TestSkill,
  TestSkillMeta,
} from "./types";

export const TEST_LEVELS: TestLevelMeta[] = [
  {
    id: "a1",
    name: "A1",
    title: "Pruebas de ingles A1",
    description:
      "Tests cortos para validar bases de lectura, vocabulario, gramatica y dictado inicial.",
    focus: "frases simples, rutinas y vocabulario cotidiano",
  },
  {
    id: "a2",
    name: "A2",
    title: "Pruebas de ingles A2",
    description:
      "Ejercicios interactivos para consolidar situaciones comunes, pasado simple y comprension basica.",
    focus: "situaciones diarias, descripciones y narracion simple",
  },
  {
    id: "b1",
    name: "B1",
    title: "Pruebas de ingles B1",
    description:
      "Tests para medir autonomia en lectura, precision gramatical y escucha de frases mas naturales.",
    focus: "opiniones, experiencias y textos funcionales",
  },
  {
    id: "b2",
    name: "B2",
    title: "Pruebas de ingles B2",
    description:
      "Pruebas para usuarios que ya manejan ingles con soltura y quieren detectar puntos finos.",
    focus: "argumentos, matices y estructuras mas flexibles",
  },
  {
    id: "c1",
    name: "C1",
    title: "Pruebas de ingles C1",
    description:
      "Practica avanzada para trabajar interpretacion, colocationes y control formal del idioma.",
    focus: "analisis, registro y precision academica o profesional",
  },
  {
    id: "c2",
    name: "C2",
    title: "Pruebas de ingles C2",
    description:
      "Retos exigentes para usuarios con dominio alto que quieren medir fineza y comprension profunda.",
    focus: "matiz, inferencia y dominio experto del ingles",
  },
];

export const TEST_SKILLS: TestSkillMeta[] = [
  {
    id: "reading",
    name: "Reading",
    shortDescription: "Comprension lectora por nivel",
    longDescription:
      "Lee un texto breve y responde preguntas sobre idea principal, detalles e inferencias.",
    icon: "book",
  },
  {
    id: "grammar",
    name: "Grammar",
    shortDescription: "Gramatica en contexto",
    longDescription:
      "Resuelve huecos, orden de palabras y elecciones gramaticales comunes para tu nivel.",
    icon: "grammar",
  },
  {
    id: "vocabulary",
    name: "Vocabulary",
    shortDescription: "Vocabulario util y colocaciones",
    longDescription:
      "Practica significado en contexto, expresiones frecuentes y combinaciones naturales.",
    icon: "spark",
  },
  {
    id: "dictation",
    name: "Dictation",
    shortDescription: "Escucha y escribe lo que oyes",
    longDescription:
      "Escucha una frase, escríbela y desbloquea letras extra si necesitas mas intentos.",
    icon: "sound",
  },
];

const DEFAULT_RESULT_BANDS: TestResultBand[] = [
  {
    minScore: 85,
    label: "Fuerte",
    summary:
      "Mantienes buen control para este nivel. Ya puedes combinar este test con lectura real en LingText.",
  },
  {
    minScore: 60,
    label: "En progreso",
    summary:
      "Tienes base util, pero aun hay patrones que conviene reforzar con practica frecuente.",
  },
  {
    minScore: 0,
    label: "Por reforzar",
    summary:
      "Este nivel todavia exige apoyo. Te conviene alternar tests cortos con lecturas mas guiadas.",
  },
];

interface LevelFixture {
  readingIntro: string;
  readingQuestions: TestQuestion[];
  grammarQuestions: TestQuestion[];
  vocabularyQuestions: TestQuestion[];
  dictationQuestions: DictationQuestion[];
}

const TEST_COPY: Record<
  TestLevel,
  Record<
    TestSkill,
    {
      title: string;
      summary: string;
      intro: string;
    }
  >
> = {
  a1: {
    reading: {
      title: "Rutinas cotidianas y detalles simples",
      summary:
        "Lee una escena diaria corta y detecta ideas basicas sin perderte en el texto.",
      intro:
        "Una prueba breve centrada en acciones del dia a dia, horarios y detalles faciles de localizar.",
    },
    grammar: {
      title: "Present simple y verb to be en accion",
      summary:
        "Practica estructuras esenciales para presentarte, describir personas y hablar de rutinas.",
      intro:
        "Esta sesion se centra en las piezas gramaticales que mas se repiten cuando todavia estas construyendo base.",
    },
    vocabulary: {
      title: "Palabras basicas para moverte en lo diario",
      summary:
        "Trabaja opuestos, objetos comunes y combinaciones faciles de reconocer.",
      intro:
        "La idea aqui es validar si ya manejas vocabulario basico de casa, comida, acciones y descripciones simples.",
    },
    dictation: {
      title: "Primer dictado con frases cortas y claras",
      summary:
        "Escucha frases sencillas y completa el dictado con ayuda progresiva cuando haga falta.",
      intro:
        "Un dictado pensado para afinar el oido principiante con oraciones cortas y vocabulario muy frecuente.",
    },
  },
  a2: {
    reading: {
      title: "Planes, mensajes y un fin de semana ocupado",
      summary:
        "Lee un mensaje simple y sigue planes, horarios y acciones futuras con mas autonomia.",
      intro:
        "Esta prueba gira alrededor de mensajes cotidianos, planes cercanos y detalles faciles pero ya mas variados.",
    },
    grammar: {
      title: "Pasado simple, comparativos y planes cercanos",
      summary:
        "Refuerza estructuras tipicas de A2 para contar experiencias y comparar cosas o personas.",
      intro:
        "Aqui pones a prueba si ya controlas tiempos y estructuras muy comunes cuando dejas el nivel inicial puro.",
    },
    vocabulary: {
      title: "Vida diaria, clima y collocations comunes",
      summary:
        "Practica vocabulario util para moverte en ciudad, estudio y conversaciones rutinarias.",
      intro:
        "La sesion mezcla palabras frecuentes con expresiones naturales que empiezan a sonar mas reales en A2.",
    },
    dictation: {
      title: "Dictado cotidiano con pasado y planes",
      summary:
        "Escucha frases mas largas y consolida ortografia, contracciones y estructuras comunes.",
      intro:
        "Este dictado sube un poco la dificultad con frases de planes, experiencias recientes y contexto diario.",
    },
  },
  b1: {
    reading: {
      title: "Habitos, trabajo remoto y decisiones personales",
      summary:
        "Lee un texto funcional y detecta cambios de rutina, causas y soluciones.",
      intro:
        "La prueba apunta a esa zona B1 en la que ya puedes seguir una idea completa y relacionar problema con respuesta.",
    },
    grammar: {
      title: "Condicionales, conectores y tiempo verbal util",
      summary:
        "Practica estructuras que te permiten opinar, matizar y conectar mejor las ideas.",
      intro:
        "Aqui medimos si ya puedes pasar de frases sueltas a estructuras que dan mas control y autonomia al discurso.",
    },
    vocabulary: {
      title: "Trabajo, decisiones y expresiones frecuentes",
      summary:
        "Entrena palabras utiles para estudio, trabajo y situaciones practicas del dia a dia.",
      intro:
        "Esta sesion combina significado en contexto con collocations que empiezan a sonar realmente naturales en B1.",
    },
    dictation: {
      title: "Dictado intermedio con frases naturales",
      summary:
        "Escucha oraciones mas fluidas y trabaja precision sin salir de un ingles todavia funcional.",
      intro:
        "El reto aqui ya no es solo oir palabras aisladas, sino seguir ritmo, orden y combinaciones frecuentes.",
    },
  },
  b2: {
    reading: {
      title: "Argumentos claros en contextos de trabajo real",
      summary:
        "Lee una opinion breve y distingue tesis, contraste y detalle de apoyo.",
      intro:
        "La prueba se apoya en un texto mas abstracto para validar si ya puedes seguir una linea argumental con claridad.",
    },
    grammar: {
      title: "Matices verbales, inversion ligera y linkers",
      summary:
        "Pon a prueba estructuras que marcan diferencia entre un ingles correcto y uno mas fino.",
      intro:
        "Aqui importa menos la mecanica basica y mas tu capacidad de elegir la estructura precisa para el contexto.",
    },
    vocabulary: {
      title: "Lenguaje abstracto y collocations de analisis",
      summary:
        "Practica vocabulario mas flexible para ideas, proyectos, cambios y argumentacion.",
      intro:
        "Esta sesion trabaja el salto hacia un vocabulario menos concreto y mas util para opiniones complejas.",
    },
    dictation: {
      title: "Dictado con estructura flexible y mas matiz",
      summary:
        "Escucha frases con modales, comparaciones y orden mas variable sin perder precision.",
      intro:
        "El foco esta en sostener comprension auditiva cuando la frase ya no sigue un patron tan simple.",
    },
  },
  c1: {
    reading: {
      title: "Innovacion, implementacion y lectura critica",
      summary:
        "Interpreta posicion, contraste y critica implicita dentro de un texto mas denso.",
      intro:
        "Esta prueba busca medir si ya puedes leer entre lineas y seguir una tesis con vocabulario mas exigente.",
    },
    grammar: {
      title: "Inversion, relativas y control formal del ingles",
      summary:
        "Refuerza estructuras avanzadas que suelen separar un C1 claro de uno todavia inestable.",
      intro:
        "Aqui aparecen formas menos frecuentes, pero muy utiles cuando buscas precision formal y flexibilidad real.",
    },
    vocabulary: {
      title: "Consenso, matiz y vocabulario de registro alto",
      summary:
        "Trabaja lenguaje mas abstracto, persuasivo y academico sin perder naturalidad.",
      intro:
        "La sesion se enfoca en ese vocabulario que no solo entiendes, sino que ya deberias poder reconocer con matiz.",
    },
    dictation: {
      title: "Dictado avanzado con registro formal",
      summary:
        "Escucha frases mas densas y valida precision en estructuras largas y tono elevado.",
      intro:
        "El dictado de C1 obliga a sostener detalle, ritmo y ortografia cuando la frase ya lleva mas carga informativa.",
    },
  },
  c2: {
    reading: {
      title: "Claridad, profundidad y discurso experto",
      summary:
        "Lee una reflexion compleja y detecta contraste conceptual, matiz y subtexto.",
      intro:
        "Esta prueba pone el foco en comprension fina: no solo entender ideas, sino como estan organizadas y matizadas.",
    },
    grammar: {
      title: "Inversion avanzada y estructuras poco frecuentes",
      summary:
        "Pon a prueba formas raras pero naturales en un ingles de alta precision.",
      intro:
        "El objetivo aqui es medir control sobre recursos sintacticos que ya no pertenecen al uso intermedio ni avanzado comun.",
    },
    vocabulary: {
      title: "Matiz fino y lenguaje analitico de alto nivel",
      summary:
        "Practica palabras que exigen distinciones sutiles, interpretacion y registro muy preciso.",
      intro:
        "La sesion trabaja el tipo de vocabulario que define un dominio experto mas alla de la simple correccion.",
    },
    dictation: {
      title: "Dictado de alta precision y discurso complejo",
      summary:
        "Escucha oraciones cargadas de matiz y manten exactitud aunque la estructura sea exigente.",
      intro:
        "Este dictado esta pensado para usuarios que quieren medir detalle real cuando el ingles ya opera a maxima densidad.",
    },
  },
};

const FIXTURES: Record<TestLevel, LevelFixture> = {
  a1: {
    readingIntro: "Rutinas basicas, familia y acciones del dia a dia.",
    readingQuestions: [
      {
        id: "a1-reading-1",
        type: "multiple-choice",
        prompt: "What is the text mainly about?",
        description: "Read the text and choose the best summary.",
        passage:
          "Tom wakes up at seven every day. He has bread and tea for breakfast, then he walks to the bus stop with his sister. After school, they play football in the park for thirty minutes.",
        choices: [
          { id: "a", text: "Tom's daily routine" },
          { id: "b", text: "Tom's summer vacation" },
          { id: "c", text: "Tom's favorite movie" },
          { id: "d", text: "Tom's trip to London" },
        ],
        correctChoiceId: "a",
        explanation:
          "The passage describes a normal day for Tom from morning to afternoon.",
        points: 25,
      },
      {
        id: "a1-reading-2",
        type: "multiple-choice",
        prompt: "What does Tom drink for breakfast?",
        passage:
          "Tom wakes up at seven every day. He has bread and tea for breakfast, then he walks to the bus stop with his sister. After school, they play football in the park for thirty minutes.",
        choices: [
          { id: "a", text: "Milk" },
          { id: "b", text: "Tea" },
          { id: "c", text: "Coffee" },
          { id: "d", text: "Juice" },
        ],
        correctChoiceId: "b",
        explanation: "The text says he has bread and tea for breakfast.",
        points: 25,
      },
      {
        id: "a1-reading-3",
        type: "cloze",
        prompt: "Complete the sentence from the text.",
        sentence: "After school, Tom and his sister play ___ in the park.",
        answers: ["football"],
        explanation: "The activity after school is football.",
        points: 25,
      },
      {
        id: "a1-reading-4",
        type: "reorder",
        prompt: "Put the words in the correct order.",
        clue: "Use the information from the text.",
        tokens: ["walks", "Tom", "to", "the", "bus", "stop"],
        answer: ["Tom", "walks", "to", "the", "bus", "stop"],
        explanation: "This is the sentence pattern used in the passage.",
        points: 25,
      },
    ],
    grammarQuestions: [
      {
        id: "a1-grammar-1",
        type: "multiple-choice",
        prompt: "Choose the correct option.",
        description: "She ___ from Chile.",
        choices: [
          { id: "a", text: "am" },
          { id: "b", text: "is" },
          { id: "c", text: "are" },
          { id: "d", text: "be" },
        ],
        correctChoiceId: "b",
        explanation: "For he, she and it in the present of 'to be', use 'is'.",
        points: 25,
      },
      {
        id: "a1-grammar-2",
        type: "cloze",
        prompt: "Write the missing verb.",
        sentence: "We ___ lunch at noon every day.",
        answers: ["have"],
        hint: "Use the base form in present simple.",
        explanation: "With 'we', the present simple uses the base form 'have'.",
        points: 25,
      },
      {
        id: "a1-grammar-3",
        type: "reorder",
        prompt: "Order the sentence correctly.",
        tokens: ["play", "I", "soccer", "after", "school"],
        answer: ["I", "play", "soccer", "after", "school"],
        explanation:
          "Simple present sentence order is subject + verb + complement.",
        points: 25,
      },
      {
        id: "a1-grammar-4",
        type: "multiple-choice",
        prompt: "Choose the correct option.",
        description: "There ___ two books on the table.",
        choices: [
          { id: "a", text: "is" },
          { id: "b", text: "am" },
          { id: "c", text: "are" },
          { id: "d", text: "be" },
        ],
        correctChoiceId: "c",
        explanation: "Use 'are' with plural nouns like 'two books'.",
        points: 25,
      },
    ],
    vocabularyQuestions: [
      {
        id: "a1-vocabulary-1",
        type: "multiple-choice",
        prompt: "Choose the correct meaning.",
        description: "'Quiet' means...",
        choices: [
          { id: "a", text: "without much noise" },
          { id: "b", text: "very expensive" },
          { id: "c", text: "full of people" },
          { id: "d", text: "very fast" },
        ],
        correctChoiceId: "a",
        explanation: "'Quiet' describes a place or person with little noise.",
        points: 25,
      },
      {
        id: "a1-vocabulary-2",
        type: "cloze",
        prompt: "Complete the sentence.",
        sentence: "I wear shoes on my ___.",
        answers: ["feet", "foot"],
        explanation: "The natural plural form is 'feet'.",
        points: 25,
      },
      {
        id: "a1-vocabulary-3",
        type: "reorder",
        prompt: "Build the common expression.",
        tokens: ["cup", "a", "of", "tea"],
        answer: ["a", "cup", "of", "tea"],
        explanation: "'A cup of tea' is the natural collocation.",
        points: 25,
      },
      {
        id: "a1-vocabulary-4",
        type: "multiple-choice",
        prompt: "Choose the best word for the sentence.",
        description: "The opposite of 'small' is...",
        choices: [
          { id: "a", text: "slow" },
          { id: "b", text: "big" },
          { id: "c", text: "short" },
          { id: "d", text: "low" },
        ],
        correctChoiceId: "b",
        explanation: "'Big' is the direct opposite of 'small'.",
        points: 25,
      },
    ],
    dictationQuestions: [
      {
        id: "a1-dictation-1",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "I like apples and bananas",
        maxAttempts: 5,
        hintLabel: "Daily food vocabulary",
        points: 25,
      },
      {
        id: "a1-dictation-2",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "My brother is at home",
        maxAttempts: 5,
        hintLabel: "Family and place",
        points: 25,
      },
      {
        id: "a1-dictation-3",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "We study English every day",
        maxAttempts: 5,
        hintLabel: "Simple routine",
        points: 25,
      },
      {
        id: "a1-dictation-4",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "The bus is very late",
        maxAttempts: 5,
        hintLabel: "Transport and time",
        points: 25,
      },
    ],
  },
  a2: {
    readingIntro: "Mensajes simples, experiencias recientes y planes cortos.",
    readingQuestions: [
      {
        id: "a2-reading-1",
        type: "multiple-choice",
        prompt: "What is Mia doing this weekend?",
        passage:
          "Mia sent a message to her friend Leo. She said that on Saturday she is visiting her aunt in Brighton and on Sunday she plans to clean her room and finish a short history project. She hopes to watch a film at night if she has time.",
        choices: [
          { id: "a", text: "Traveling to three cities" },
          { id: "b", text: "Studying and visiting family" },
          { id: "c", text: "Starting a new job" },
          { id: "d", text: "Going camping" },
        ],
        correctChoiceId: "b",
        explanation: "She is visiting her aunt and finishing a project.",
        points: 25,
      },
      {
        id: "a2-reading-2",
        type: "multiple-choice",
        prompt: "When does Mia want to watch a film?",
        passage:
          "Mia sent a message to her friend Leo. She said that on Saturday she is visiting her aunt in Brighton and on Sunday she plans to clean her room and finish a short history project. She hopes to watch a film at night if she has time.",
        choices: [
          { id: "a", text: "On Friday morning" },
          { id: "b", text: "On Saturday afternoon" },
          { id: "c", text: "At night" },
          { id: "d", text: "Before breakfast" },
        ],
        correctChoiceId: "c",
        explanation: "The text says she hopes to watch a film at night.",
        points: 25,
      },
      {
        id: "a2-reading-3",
        type: "cloze",
        prompt: "Complete the sentence from the message.",
        sentence:
          "On Sunday, Mia plans to clean her room and finish a short history ___.",
        answers: ["project"],
        explanation: "The missing word is 'project'.",
        points: 25,
      },
      {
        id: "a2-reading-4",
        type: "reorder",
        prompt: "Order the words to make a sentence.",
        clue: "Think about Mia's plan for Saturday.",
        tokens: ["is", "she", "her", "aunt", "visiting"],
        answer: ["she", "is", "visiting", "her", "aunt"],
        explanation: "This matches the weekend plan in the passage.",
        points: 25,
      },
    ],
    grammarQuestions: [
      {
        id: "a2-grammar-1",
        type: "multiple-choice",
        prompt: "Choose the correct form.",
        description: "Yesterday, we ___ a bus to the museum.",
        choices: [
          { id: "a", text: "take" },
          { id: "b", text: "took" },
          { id: "c", text: "taken" },
          { id: "d", text: "takes" },
        ],
        correctChoiceId: "b",
        explanation: "'Yesterday' signals past simple, so use 'took'.",
        points: 25,
      },
      {
        id: "a2-grammar-2",
        type: "cloze",
        prompt: "Write the missing word.",
        sentence: "There aren't ___ apples left in the basket.",
        answers: ["any"],
        explanation: "Use 'any' in negative sentences.",
        points: 25,
      },
      {
        id: "a2-grammar-3",
        type: "reorder",
        prompt: "Order the sentence.",
        tokens: ["going", "to", "are", "we", "cook", "tonight"],
        answer: ["we", "are", "going", "to", "cook", "tonight"],
        explanation: "Future plan with 'be going to'.",
        points: 25,
      },
      {
        id: "a2-grammar-4",
        type: "multiple-choice",
        prompt: "Choose the best option.",
        description: "My sister is ___ than me.",
        choices: [
          { id: "a", text: "tall" },
          { id: "b", text: "taller" },
          { id: "c", text: "more tall" },
          { id: "d", text: "the tallest" },
        ],
        correctChoiceId: "b",
        explanation: "The comparative form of 'tall' is 'taller'.",
        points: 25,
      },
    ],
    vocabularyQuestions: [
      {
        id: "a2-vocabulary-1",
        type: "multiple-choice",
        prompt: "Choose the closest meaning.",
        description: "'Crowded' means...",
        choices: [
          { id: "a", text: "full of people" },
          { id: "b", text: "very clean" },
          { id: "c", text: "easy to reach" },
          { id: "d", text: "quiet and empty" },
        ],
        correctChoiceId: "a",
        explanation: "A crowded place has many people in it.",
        points: 25,
      },
      {
        id: "a2-vocabulary-2",
        type: "cloze",
        prompt: "Complete the sentence.",
        sentence: "I forgot my umbrella, so I got very ___.",
        answers: ["wet"],
        explanation: "Without an umbrella in the rain, you get wet.",
        points: 25,
      },
      {
        id: "a2-vocabulary-3",
        type: "reorder",
        prompt: "Build the natural expression.",
        tokens: ["do", "homework", "your"],
        answer: ["do", "your", "homework"],
        explanation: "The correct collocation is 'do your homework'.",
        points: 25,
      },
      {
        id: "a2-vocabulary-4",
        type: "multiple-choice",
        prompt: "Choose the best word.",
        description: "A person who designs buildings is an...",
        choices: [
          { id: "a", text: "architect" },
          { id: "b", text: "actor" },
          { id: "c", text: "assistant" },
          { id: "d", text: "artist" },
        ],
        correctChoiceId: "a",
        explanation: "An architect designs buildings.",
        points: 25,
      },
    ],
    dictationQuestions: [
      {
        id: "a2-dictation-1",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "We took the train to the coast",
        maxAttempts: 5,
        hintLabel: "Past trip",
        points: 25,
      },
      {
        id: "a2-dictation-2",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "My cousin is cooking dinner tonight",
        maxAttempts: 5,
        hintLabel: "Plan for tonight",
        points: 25,
      },
      {
        id: "a2-dictation-3",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "There are some books on the chair",
        maxAttempts: 5,
        hintLabel: "Objects at home",
        points: 25,
      },
      {
        id: "a2-dictation-4",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "I didn't call you after lunch",
        maxAttempts: 5,
        hintLabel: "Negative sentence in the past",
        points: 25,
      },
    ],
  },
  b1: {
    readingIntro: "Textos funcionales, experiencias y decisiones personales.",
    readingQuestions: [
      {
        id: "b1-reading-1",
        type: "multiple-choice",
        prompt: "Why did Nora change her routine?",
        passage:
          "Last year, Nora started working from home three days a week. At first, she enjoyed the flexibility, but after a few months she noticed she was moving less and finishing work later than before. To solve that, she now goes for a short walk before breakfast and sets a clear time to shut down her laptop every evening.",
        choices: [
          { id: "a", text: "She wanted to save money on food" },
          { id: "b", text: "She was missing her morning bus" },
          { id: "c", text: "Her new routine was affecting her habits" },
          { id: "d", text: "She had to train for a race" },
        ],
        correctChoiceId: "c",
        explanation:
          "She changed it because working from home affected her movement and schedule.",
        points: 25,
      },
      {
        id: "b1-reading-2",
        type: "multiple-choice",
        prompt: "What does Nora do before breakfast?",
        passage:
          "Last year, Nora started working from home three days a week. At first, she enjoyed the flexibility, but after a few months she noticed she was moving less and finishing work later than before. To solve that, she now goes for a short walk before breakfast and sets a clear time to shut down her laptop every evening.",
        choices: [
          { id: "a", text: "Checks email" },
          { id: "b", text: "Goes for a walk" },
          { id: "c", text: "Calls her team" },
          { id: "d", text: "Washes the dishes" },
        ],
        correctChoiceId: "b",
        explanation:
          "The passage explicitly says she goes for a short walk before breakfast.",
        points: 25,
      },
      {
        id: "b1-reading-3",
        type: "cloze",
        prompt: "Complete the idea from the text.",
        sentence: "Nora sets a clear time to shut down her ___ every evening.",
        answers: ["laptop"],
        explanation: "The passage uses 'laptop'.",
        points: 25,
      },
      {
        id: "b1-reading-4",
        type: "reorder",
        prompt: "Order the words.",
        clue: "Use the problem Nora noticed.",
        tokens: ["was", "later", "she", "work", "finishing"],
        answer: ["she", "was", "finishing", "work", "later"],
        explanation: "This reflects the issue described in the text.",
        points: 25,
      },
    ],
    grammarQuestions: [
      {
        id: "b1-grammar-1",
        type: "multiple-choice",
        prompt: "Choose the best option.",
        description: "If I ___ more time, I'd join the course.",
        choices: [
          { id: "a", text: "have" },
          { id: "b", text: "had" },
          { id: "c", text: "will have" },
          { id: "d", text: "am having" },
        ],
        correctChoiceId: "b",
        explanation: "Second conditional uses past simple in the if-clause.",
        points: 25,
      },
      {
        id: "b1-grammar-2",
        type: "cloze",
        prompt: "Write the missing word.",
        sentence: "She has lived here ___ 2019.",
        answers: ["since"],
        explanation: "Use 'since' with a starting point in time.",
        points: 25,
      },
      {
        id: "b1-grammar-3",
        type: "reorder",
        prompt: "Order the words.",
        tokens: ["been", "have", "already", "they", "told"],
        answer: ["they", "have", "already", "been", "told"],
        explanation: "Present perfect passive structure.",
        points: 25,
      },
      {
        id: "b1-grammar-4",
        type: "multiple-choice",
        prompt: "Choose the correct option.",
        description: "I was tired, ___ I finished the report.",
        choices: [
          { id: "a", text: "because" },
          { id: "b", text: "so" },
          { id: "c", text: "but" },
          { id: "d", text: "although" },
        ],
        correctChoiceId: "c",
        explanation:
          "'But' shows contrast between being tired and finishing the report.",
        points: 25,
      },
    ],
    vocabularyQuestions: [
      {
        id: "b1-vocabulary-1",
        type: "multiple-choice",
        prompt: "Choose the closest meaning.",
        description: "'Reliable' means...",
        choices: [
          { id: "a", text: "easy to forget" },
          { id: "b", text: "can be trusted" },
          { id: "c", text: "hard to explain" },
          { id: "d", text: "full of surprises" },
        ],
        correctChoiceId: "b",
        explanation: "A reliable person or thing can be trusted.",
        points: 25,
      },
      {
        id: "b1-vocabulary-2",
        type: "cloze",
        prompt: "Complete the sentence.",
        sentence: "We need to ___ a decision before Friday.",
        answers: ["make"],
        explanation: "The correct collocation is 'make a decision'.",
        points: 25,
      },
      {
        id: "b1-vocabulary-3",
        type: "reorder",
        prompt: "Build the expression.",
        tokens: ["take", "responsibility", "for", "it"],
        answer: ["take", "responsibility", "for", "it"],
        explanation: "'Take responsibility for it' is the natural phrase.",
        points: 25,
      },
      {
        id: "b1-vocabulary-4",
        type: "multiple-choice",
        prompt: "Choose the best word.",
        description: "A 'deadline' is...",
        choices: [
          { id: "a", text: "the time limit for a task" },
          { id: "b", text: "a new employee" },
          { id: "c", text: "a type of contract" },
          { id: "d", text: "an annual bonus" },
        ],
        correctChoiceId: "a",
        explanation: "A deadline is the latest time to finish something.",
        points: 25,
      },
    ],
    dictationQuestions: [
      {
        id: "b1-dictation-1",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "I would rather stay home tonight",
        maxAttempts: 5,
        hintLabel: "Preference",
        points: 25,
      },
      {
        id: "b1-dictation-2",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "She has worked here since March",
        maxAttempts: 5,
        hintLabel: "Present perfect",
        points: 25,
      },
      {
        id: "b1-dictation-3",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "We need to make a quick decision",
        maxAttempts: 5,
        hintLabel: "Work context",
        points: 25,
      },
      {
        id: "b1-dictation-4",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "They were waiting outside the station",
        maxAttempts: 5,
        hintLabel: "Past continuous",
        points: 25,
      },
    ],
  },
  b2: {
    readingIntro: "Argumentos claros, comparaciones y conclusiones practicas.",
    readingQuestions: [
      {
        id: "b2-reading-1",
        type: "multiple-choice",
        prompt: "What is the writer's main point?",
        passage:
          "Many companies now offer remote work as a standard option, but the results are mixed. Employees often report fewer interruptions and better concentration at home, yet some teams struggle when communication becomes too informal or delayed. The most effective organizations seem to be the ones that define clear expectations instead of assuming flexibility alone will solve everything.",
        choices: [
          { id: "a", text: "Remote work always improves communication" },
          {
            id: "b",
            text: "Flexibility only works when teams set clear rules",
          },
          { id: "c", text: "Offices are no longer necessary" },
          { id: "d", text: "People should work alone more often" },
        ],
        correctChoiceId: "b",
        explanation:
          "The text argues that clarity matters more than flexibility by itself.",
        points: 25,
      },
      {
        id: "b2-reading-2",
        type: "multiple-choice",
        prompt: "What problem can teams have?",
        passage:
          "Many companies now offer remote work as a standard option, but the results are mixed. Employees often report fewer interruptions and better concentration at home, yet some teams struggle when communication becomes too informal or delayed. The most effective organizations seem to be the ones that define clear expectations instead of assuming flexibility alone will solve everything.",
        choices: [
          { id: "a", text: "Communication may become delayed" },
          { id: "b", text: "People forget how to type" },
          { id: "c", text: "Meetings disappear completely" },
          { id: "d", text: "Employees stop concentrating" },
        ],
        correctChoiceId: "a",
        explanation:
          "The passage explicitly mentions communication becoming informal or delayed.",
        points: 25,
      },
      {
        id: "b2-reading-3",
        type: "cloze",
        prompt: "Complete the idea.",
        sentence: "The most effective organizations define clear ___.",
        answers: ["expectations"],
        explanation: "That is the key word in the final sentence.",
        points: 25,
      },
      {
        id: "b2-reading-4",
        type: "reorder",
        prompt: "Order the words.",
        clue: "Use the key contrast from the text.",
        tokens: ["results", "mixed", "the", "are"],
        answer: ["the", "results", "are", "mixed"],
        explanation: "This phrase summarizes the author's position.",
        points: 25,
      },
    ],
    grammarQuestions: [
      {
        id: "b2-grammar-1",
        type: "multiple-choice",
        prompt: "Choose the best option.",
        description: "By the time we arrived, the film ___.",
        choices: [
          { id: "a", text: "already started" },
          { id: "b", text: "has already started" },
          { id: "c", text: "had already started" },
          { id: "d", text: "was already start" },
        ],
        correctChoiceId: "c",
        explanation: "Past perfect shows the film started before we arrived.",
        points: 25,
      },
      {
        id: "b2-grammar-2",
        type: "cloze",
        prompt: "Write the missing word.",
        sentence: "I wish I ___ more confident during interviews.",
        answers: ["were"],
        explanation:
          "After 'I wish' for unreal present situations, use 'were'.",
        points: 25,
      },
      {
        id: "b2-grammar-3",
        type: "reorder",
        prompt: "Order the sentence.",
        tokens: ["been", "might", "have", "they", "warned"],
        answer: ["they", "might", "have", "been", "warned"],
        explanation: "Modal perfect passive structure.",
        points: 25,
      },
      {
        id: "b2-grammar-4",
        type: "multiple-choice",
        prompt: "Choose the correct linker.",
        description:
          "The launch was delayed; ___, the team used the extra time to improve the design.",
        choices: [
          { id: "a", text: "however" },
          { id: "b", text: "therefore" },
          { id: "c", text: "as a result" },
          { id: "d", text: "in addition" },
        ],
        correctChoiceId: "a",
        explanation:
          "'However' signals the contrast between delay and positive use of time.",
        points: 25,
      },
    ],
    vocabularyQuestions: [
      {
        id: "b2-vocabulary-1",
        type: "multiple-choice",
        prompt: "Choose the closest meaning.",
        description: "'Convincing' means...",
        choices: [
          { id: "a", text: "hard to remember" },
          { id: "b", text: "able to make others believe" },
          { id: "c", text: "impossible to measure" },
          { id: "d", text: "easy to ignore" },
        ],
        correctChoiceId: "b",
        explanation: "A convincing argument makes people accept or believe it.",
        points: 25,
      },
      {
        id: "b2-vocabulary-2",
        type: "cloze",
        prompt: "Complete the sentence.",
        sentence: "The company plans to ___ its services abroad next year.",
        answers: ["expand"],
        explanation: "'Expand' fits the business context naturally.",
        points: 25,
      },
      {
        id: "b2-vocabulary-3",
        type: "reorder",
        prompt: "Build the collocation.",
        tokens: ["raise", "awareness", "about", "it"],
        answer: ["raise", "awareness", "about", "it"],
        explanation: "'Raise awareness' is the standard collocation.",
        points: 25,
      },
      {
        id: "b2-vocabulary-4",
        type: "multiple-choice",
        prompt: "Choose the best word.",
        description: "If something is 'temporary', it is...",
        choices: [
          { id: "a", text: "permanent" },
          { id: "b", text: "limited in time" },
          { id: "c", text: "fully predictable" },
          { id: "d", text: "extremely expensive" },
        ],
        correctChoiceId: "b",
        explanation: "Temporary things do not last forever.",
        points: 25,
      },
    ],
    dictationQuestions: [
      {
        id: "b2-dictation-1",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "The results were better than we expected",
        maxAttempts: 5,
        hintLabel: "Comparison and expectations",
        points: 25,
      },
      {
        id: "b2-dictation-2",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "She might have missed the earlier train",
        maxAttempts: 5,
        hintLabel: "Possibility in the past",
        points: 25,
      },
      {
        id: "b2-dictation-3",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "We need a clearer strategy for growth",
        maxAttempts: 5,
        hintLabel: "Business planning",
        points: 25,
      },
      {
        id: "b2-dictation-4",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "He rarely speaks unless it is necessary",
        maxAttempts: 5,
        hintLabel: "Habit and condition",
        points: 25,
      },
    ],
  },
  c1: {
    readingIntro: "Textos con posicion clara, matiz y lectura critica.",
    readingQuestions: [
      {
        id: "c1-reading-1",
        type: "multiple-choice",
        prompt: "What criticism does the writer make?",
        passage:
          "Some organizations celebrate innovation so enthusiastically that they forget the slower work required to make new ideas usable. A clever prototype may attract attention, but without documentation, training and support, it rarely changes everyday practice. The real challenge is not producing novelty; it is embedding it into routines people can actually maintain.",
        choices: [
          { id: "a", text: "People dislike new technology" },
          {
            id: "b",
            text: "Innovation is often praised without enough implementation work",
          },
          { id: "c", text: "Training is too expensive to matter" },
          { id: "d", text: "Routines should never change" },
        ],
        correctChoiceId: "b",
        explanation:
          "The writer argues that organizations focus on novelty more than implementation.",
        points: 25,
      },
      {
        id: "c1-reading-2",
        type: "multiple-choice",
        prompt: "What does 'embedding it into routines' imply?",
        passage:
          "Some organizations celebrate innovation so enthusiastically that they forget the slower work required to make new ideas usable. A clever prototype may attract attention, but without documentation, training and support, it rarely changes everyday practice. The real challenge is not producing novelty; it is embedding it into routines people can actually maintain.",
        choices: [
          { id: "a", text: "Hiding the idea from staff" },
          { id: "b", text: "Turning the idea into regular practice" },
          { id: "c", text: "Removing old systems immediately" },
          { id: "d", text: "Reducing the cost of the prototype" },
        ],
        correctChoiceId: "b",
        explanation: "Embedding means integrating it into normal workflows.",
        points: 25,
      },
      {
        id: "c1-reading-3",
        type: "cloze",
        prompt: "Complete the phrase.",
        sentence:
          "A clever prototype may attract attention, but without documentation, training and support, it rarely changes everyday ___.",
        answers: ["practice"],
        explanation: "The writer refers to everyday practice.",
        points: 25,
      },
      {
        id: "c1-reading-4",
        type: "reorder",
        prompt: "Order the words.",
        clue: "Use the final insight from the passage.",
        tokens: ["the", "real", "challenge", "is", "implementation"],
        answer: ["the", "real", "challenge", "is", "implementation"],
        explanation: "The text contrasts novelty with implementation.",
        points: 25,
      },
    ],
    grammarQuestions: [
      {
        id: "c1-grammar-1",
        type: "multiple-choice",
        prompt: "Choose the best option.",
        description: "Had the team reacted sooner, the issue ___ less serious.",
        choices: [
          { id: "a", text: "would be" },
          { id: "b", text: "had been" },
          { id: "c", text: "would have been" },
          { id: "d", text: "has been" },
        ],
        correctChoiceId: "c",
        explanation: "This is an inverted third conditional.",
        points: 25,
      },
      {
        id: "c1-grammar-2",
        type: "cloze",
        prompt: "Write the missing word.",
        sentence:
          "Not only ___ she meet the deadline, but she also improved the draft.",
        answers: ["did"],
        explanation:
          "Negative adverbial fronting takes inversion: 'did she meet'.",
        points: 25,
      },
      {
        id: "c1-grammar-3",
        type: "reorder",
        prompt: "Order the sentence.",
        tokens: ["no", "account", "take", "we", "of", "did"],
        answer: ["we", "did", "take", "no", "account", "of"],
        explanation: "This builds the fixed expression 'take no account of'.",
        points: 25,
      },
      {
        id: "c1-grammar-4",
        type: "multiple-choice",
        prompt: "Choose the best option.",
        description:
          "The proposal, ___ was revised twice, was finally approved.",
        choices: [
          { id: "a", text: "that" },
          { id: "b", text: "which" },
          { id: "c", text: "what" },
          { id: "d", text: "where" },
        ],
        correctChoiceId: "b",
        explanation: "Non-defining relative clauses use 'which'.",
        points: 25,
      },
    ],
    vocabularyQuestions: [
      {
        id: "c1-vocabulary-1",
        type: "multiple-choice",
        prompt: "Choose the closest meaning.",
        description: "'Feasible' means...",
        choices: [
          { id: "a", text: "possible and practical" },
          { id: "b", text: "highly creative" },
          { id: "c", text: "difficult to explain" },
          { id: "d", text: "dangerous by nature" },
        ],
        correctChoiceId: "a",
        explanation: "A feasible plan is one that can realistically be done.",
        points: 25,
      },
      {
        id: "c1-vocabulary-2",
        type: "cloze",
        prompt: "Complete the sentence.",
        sentence: "The committee reached a ___ after several hours of debate.",
        answers: ["consensus"],
        explanation: "'Reach a consensus' is the correct collocation.",
        points: 25,
      },
      {
        id: "c1-vocabulary-3",
        type: "reorder",
        prompt: "Build the expression.",
        tokens: ["draw", "attention", "to", "it"],
        answer: ["draw", "attention", "to", "it"],
        explanation: "'Draw attention to' is the standard expression.",
        points: 25,
      },
      {
        id: "c1-vocabulary-4",
        type: "multiple-choice",
        prompt: "Choose the best word.",
        description: "An argument that is 'compelling' is...",
        choices: [
          { id: "a", text: "hard to ignore because it is persuasive" },
          { id: "b", text: "too long to follow" },
          { id: "c", text: "based only on emotion" },
          { id: "d", text: "full of contradictions" },
        ],
        correctChoiceId: "a",
        explanation: "Compelling means strongly persuasive or convincing.",
        points: 25,
      },
    ],
    dictationQuestions: [
      {
        id: "c1-dictation-1",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "The proposal was revised in light of recent data",
        maxAttempts: 5,
        hintLabel: "Formal register",
        points: 25,
      },
      {
        id: "c1-dictation-2",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "Few people had anticipated such a rapid shift",
        maxAttempts: 5,
        hintLabel: "Prediction and change",
        points: 25,
      },
      {
        id: "c1-dictation-3",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "She rarely compromises unless the evidence is strong",
        maxAttempts: 5,
        hintLabel: "Condition and habit",
        points: 25,
      },
      {
        id: "c1-dictation-4",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "We should reassess the scope before moving ahead",
        maxAttempts: 5,
        hintLabel: "Project planning",
        points: 25,
      },
    ],
  },
  c2: {
    readingIntro: "Comprension fina, interpretacion y expresion de alto nivel.",
    readingQuestions: [
      {
        id: "c2-reading-1",
        type: "multiple-choice",
        prompt: "What tension does the writer highlight?",
        passage:
          "Public discussion often frames expertise and accessibility as if they were mutually exclusive. Yet the most insightful communicators do not simplify by stripping away complexity; they simplify by structuring it. What frustrates audiences is rarely depth itself, but the impression that depth is being used to exclude rather than illuminate.",
        choices: [
          { id: "a", text: "Experts should avoid complex ideas" },
          {
            id: "b",
            text: "Depth and clarity can coexist when ideas are structured well",
          },
          { id: "c", text: "Audiences prefer shallow explanations" },
          { id: "d", text: "Public discussion should be less ambitious" },
        ],
        correctChoiceId: "b",
        explanation:
          "The writer argues that complexity is not the problem; poor framing is.",
        points: 25,
      },
      {
        id: "c2-reading-2",
        type: "multiple-choice",
        prompt: "Why do audiences become frustrated, according to the text?",
        passage:
          "Public discussion often frames expertise and accessibility as if they were mutually exclusive. Yet the most insightful communicators do not simplify by stripping away complexity; they simplify by structuring it. What frustrates audiences is rarely depth itself, but the impression that depth is being used to exclude rather than illuminate.",
        choices: [
          { id: "a", text: "Because they reject experts completely" },
          { id: "b", text: "Because complexity is always boring" },
          { id: "c", text: "Because depth can feel exclusionary" },
          { id: "d", text: "Because structure makes ideas too rigid" },
        ],
        correctChoiceId: "c",
        explanation:
          "The passage says frustration comes from feeling excluded by complexity.",
        points: 25,
      },
      {
        id: "c2-reading-3",
        type: "cloze",
        prompt: "Complete the phrase.",
        sentence: "Insightful communicators simplify by ___ complexity.",
        answers: ["structuring"],
        explanation: "The text says they simplify by structuring complexity.",
        points: 25,
      },
      {
        id: "c2-reading-4",
        type: "reorder",
        prompt: "Order the words.",
        clue: "Use the key contrast from the final sentence.",
        tokens: ["depth", "can", "exclude", "or", "illuminate"],
        answer: ["depth", "can", "exclude", "or", "illuminate"],
        explanation: "This condenses the core contrast in the paragraph.",
        points: 25,
      },
    ],
    grammarQuestions: [
      {
        id: "c2-grammar-1",
        type: "multiple-choice",
        prompt: "Choose the best option.",
        description:
          "So intricate ___ the negotiation that even the lawyers requested more time.",
        choices: [
          { id: "a", text: "it was" },
          { id: "b", text: "was it" },
          { id: "c", text: "was" },
          { id: "d", text: "it is" },
        ],
        correctChoiceId: "b",
        explanation: "This is inversion after 'so + adjective'.",
        points: 25,
      },
      {
        id: "c2-grammar-2",
        type: "cloze",
        prompt: "Write the missing word.",
        sentence:
          "Were the figures to be confirmed, the board ___ reconsider its position.",
        answers: ["might"],
        explanation:
          "This uses an inverted conditional with a modal in the result clause.",
        points: 25,
      },
      {
        id: "c2-grammar-3",
        type: "reorder",
        prompt: "Order the sentence.",
        tokens: ["little", "did", "how", "realize", "they"],
        answer: ["little", "did", "they", "realize", "how"],
        explanation:
          "Inversion after negative adverbials is typical at this level.",
        points: 25,
      },
      {
        id: "c2-grammar-4",
        type: "multiple-choice",
        prompt: "Choose the best option.",
        description:
          "The report is thorough, ___ one minor inconsistency in the appendix.",
        choices: [
          { id: "a", text: "notwithstanding" },
          { id: "b", text: "albeit" },
          { id: "c", text: "save for" },
          { id: "d", text: "provided" },
        ],
        correctChoiceId: "c",
        explanation: "'Save for' means 'except for', which fits the sentence.",
        points: 25,
      },
    ],
    vocabularyQuestions: [
      {
        id: "c2-vocabulary-1",
        type: "multiple-choice",
        prompt: "Choose the closest meaning.",
        description: "'Nuanced' means...",
        choices: [
          { id: "a", text: "showing subtle differences" },
          { id: "b", text: "easy to repeat" },
          { id: "c", text: "based on guesswork" },
          { id: "d", text: "lacking structure" },
        ],
        correctChoiceId: "a",
        explanation: "Nuanced language captures subtle distinctions.",
        points: 25,
      },
      {
        id: "c2-vocabulary-2",
        type: "cloze",
        prompt: "Complete the sentence.",
        sentence:
          "Her remarks were so ___ that several listeners missed the criticism entirely.",
        answers: ["subtle"],
        explanation: "'Subtle' fits the idea of indirect criticism.",
        points: 25,
      },
      {
        id: "c2-vocabulary-3",
        type: "reorder",
        prompt: "Build the expression.",
        tokens: ["shed", "light", "on", "it"],
        answer: ["shed", "light", "on", "it"],
        explanation: "'Shed light on' means to clarify something.",
        points: 25,
      },
      {
        id: "c2-vocabulary-4",
        type: "multiple-choice",
        prompt: "Choose the best word.",
        description: "A 'plausible' explanation is...",
        choices: [
          { id: "a", text: "unnecessarily complicated" },
          { id: "b", text: "credible and believable" },
          { id: "c", text: "entirely emotional" },
          { id: "d", text: "open to only one interpretation" },
        ],
        correctChoiceId: "b",
        explanation: "Plausible means believable, even if not yet proven.",
        points: 25,
      },
    ],
    dictationQuestions: [
      {
        id: "c2-dictation-1",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "The conclusion was persuasive without being overstated",
        maxAttempts: 5,
        hintLabel: "Academic tone",
        points: 25,
      },
      {
        id: "c2-dictation-2",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript: "Few would dispute the breadth of her expertise",
        maxAttempts: 5,
        hintLabel: "Evaluation and stance",
        points: 25,
      },
      {
        id: "c2-dictation-3",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript:
          "Its apparent simplicity concealed several difficult trade offs",
        maxAttempts: 5,
        hintLabel: "Analytical register",
        points: 25,
      },
      {
        id: "c2-dictation-4",
        type: "dictation",
        prompt: "Listen and write the sentence.",
        transcript:
          "Had they intervened earlier the outcome might have differed",
        maxAttempts: 5,
        hintLabel: "Inverted conditional",
        points: 25,
      },
    ],
  },
};

function buildTestDefinition(
  level: TestLevel,
  skill: TestSkill
): TestDefinition {
  const fixture = FIXTURES[level];
  const copy = TEST_COPY[level][skill];

  const questions =
    skill === "reading"
      ? fixture.readingQuestions
      : skill === "grammar"
        ? fixture.grammarQuestions
        : skill === "vocabulary"
          ? fixture.vocabularyQuestions
          : fixture.dictationQuestions;

  const instructions =
    skill === "dictation"
      ? "Escucha la frase, escribe exactamente lo que oyes y usa las pistas solo cuando las necesites."
      : "Responde cada pregunta y avanza para ver tu resultado final al terminar la sesion.";

  return {
    level,
    skill,
    title: copy.title,
    summary: copy.summary,
    intro:
      skill === "reading" ? copy.intro || fixture.readingIntro : copy.intro,
    instructions,
    durationMinutes: skill === "dictation" ? 6 : 5,
    questions,
    resultBands: DEFAULT_RESULT_BANDS,
  };
}

const TEST_CATALOG: TestDefinition[] = TEST_LEVELS.flatMap((level) =>
  TEST_SKILLS.map((skill) => buildTestDefinition(level.id, skill.id))
);

export function getTestLevelMeta(level: TestLevel): TestLevelMeta {
  return TEST_LEVELS.find((item) => item.id === level) ?? TEST_LEVELS[0];
}

export function getTestSkillMeta(skill: TestSkill): TestSkillMeta {
  return TEST_SKILLS.find((item) => item.id === skill) ?? TEST_SKILLS[0];
}

export function isTestLevel(value: string): value is TestLevel {
  return TEST_LEVELS.some((level) => level.id === value);
}

export function isTestSkill(value: string): value is TestSkill {
  return TEST_SKILLS.some((skill) => skill.id === value);
}

export function getLevelTestSummaries(level: TestLevel): LevelTestSummary[] {
  return TEST_CATALOG.filter((test) => test.level === level).map((test) => ({
    level: test.level,
    skill: test.skill,
    title: test.title,
    shortDescription: test.summary,
    summary: test.intro,
    durationMinutes: test.durationMinutes,
    questionCount: test.questions.length,
  }));
}

export function getAllTestLevels() {
  return TEST_LEVELS;
}

export function getAllTestSkills() {
  return TEST_SKILLS;
}

export function getTestDefinition(
  level: TestLevel,
  skill: TestSkill
): TestDefinition | undefined {
  return TEST_CATALOG.find(
    (test) => test.level === level && test.skill === skill
  );
}
