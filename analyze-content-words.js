#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Palabras funcionales básicas a excluir (artículos, preposiciones, pronombres, verbos auxiliares, etc.)
const functionWords = new Set([
  // Artículos
  "the",
  "a",
  "an",
  // Preposiciones
  "to",
  "of",
  "in",
  "for",
  "on",
  "at",
  "by",
  "with",
  "from",
  "as",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "between",
  "under",
  "over",
  "within",
  "without",
  "about",
  "against",
  "among",
  "around",
  "behind",
  "beyond",
  "despite",
  "except",
  "inside",
  "outside",
  "since",
  "toward",
  "upon",
  "via",
  "within",
  "throughout",
  "beneath",
  "beside",
  "concerning",
  // Pronombres
  "it",
  "my",
  "we",
  "you",
  "that",
  "he",
  "she",
  "they",
  "them",
  "their",
  "his",
  "her",
  "its",
  "our",
  "us",
  "me",
  "him",
  "this",
  "these",
  "those",
  "i",
  "mine",
  "yours",
  "ours",
  "theirs",
  "himself",
  "herself",
  "itself",
  "themselves",
  "ourselves",
  "yourselves",
  "myself",
  "oneself",
  "who",
  "what",
  "which",
  "whom",
  "whose",
  "whoever",
  "whatever",
  "whichever",
  // Conjunciones
  "and",
  "but",
  "or",
  "yet",
  "so",
  "for",
  "nor",
  "if",
  "than",
  "when",
  "while",
  "although",
  "because",
  "before",
  "after",
  "though",
  "unless",
  "until",
  "whether",
  "once",
  "since",
  "where",
  "wherever",
  "whenever",
  "because",
  "although",
  "though",
  "whereas",
  "while",
  "whilst",
  // Verbos auxiliares y modales comunes
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "must",
  "can",
  "shall",
  "ought",
  "need",
  "dare",
  "used",
  "get",
  "got",
  "getting",
  "am",
  "s",
  "ve",
  "ll",
  "re",
  "m",
  "d",
  "t",
  // Adverbios comunes de tiempo/manera/lugar
  "not",
  "no",
  "yes",
  "very",
  "too",
  "also",
  "then",
  "so",
  "just",
  "only",
  "even",
  "still",
  "already",
  "yet",
  "soon",
  "now",
  "here",
  "there",
  "where",
  "when",
  "how",
  "why",
  "up",
  "down",
  "out",
  "off",
  "away",
  "back",
  "on",
  "over",
  "off",
  "again",
  "once",
  "twice",
  // Determinantes y cuantificadores
  "some",
  "any",
  "all",
  "both",
  "each",
  "every",
  "either",
  "neither",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "first",
  "second",
  "last",
  "next",
  "other",
  "another",
  "such",
  "what",
  "whatever",
  "which",
  "whichever",
  "whose",
  // Contracciones comunes
  "don",
  "doesn",
  "didn",
  "won",
  "wouldn",
  "couldn",
  "shouldn",
  "can",
  "isn",
  "aren",
  "wasn",
  "weren",
  "haven",
  "hasn",
  "hadn",
  "ll",
  "re",
  "ve",
  "s",
  "d",
  "m",
]);

// Nombres propios comunes a excluir (serán filtrados si comienzan con mayúscula)
const commonNames = new Set([
  "laura",
  "anna",
  "mark",
  "daniel",
  "tom",
  "julian",
  "michael",
  "john",
  "david",
  "james",
  "robert",
  "mary",
  "patricia",
  "jennifer",
  "elizabeth",
  "sarah",
  "jessica",
  "ashley",
  "emily",
  "samantha",
  "stephanie",
  "melissa",
  "nicole",
  "amanda",
  "rachel",
  "lauren",
  "megan",
  "kelly",
  "christina",
  "brittany",
  "victoria",
  "jasmine",
  "hannah",
  "alexis",
  "abigail",
  "olivia",
  "emma",
  "isabella",
  "sophia",
  "mia",
  "charlotte",
  "amelia",
  "harper",
  "evelyn",
  "abigail",
  "emily",
  "elizabeth",
  "sofia",
  "avery",
  "ella",
  "scarlett",
  "grace",
  "chloe",
  "victoria",
  "riley",
  "aria",
  "lily",
  "aubrey",
  "zoey",
  "penelope",
  "layla",
  "lillian",
  "addison",
  "natalie",
  "hannah",
  "brooklyn",
  "alexandra",
  "zoe",
  "audrey",
  "allison",
  "savannah",
  "claire",
  "brianna",
  "ariana",
  "gabriella",
  "kennedy",
  "skylar",
  "sarah",
  "hailey",
  "aaliyah",
  "kaylee",
  "kylie",
  "alexis",
  "lily",
  "madison",
  "peyton",
  "riley",
  "julia",
  "leah",
  "aubrey",
  "jasmine",
  "grace",
]);

// Leer el archivo 1000-words.json
const words1000Path = path.join(__dirname, "app/data/1000-words.json");
const words1000Data = JSON.parse(fs.readFileSync(words1000Path, "utf-8"));

// Extraer todas las palabras del vocabulario
const vocabWords = new Set();
words1000Data.forEach((entry) => {
  const wordField = entry.word.toLowerCase().trim();
  wordField.split(",").forEach((w) => {
    vocabWords.add(w.trim());
  });
});

console.log(`📚 Total palabras en 1000-words.json: ${vocabWords.size}`);

// Leer todos los archivos de texto
const textsDir = path.join(__dirname, "app/content/texts");
const textFiles = fs.readdirSync(textsDir).filter((f) => f.endsWith(".md"));

console.log(`📄 Total archivos de texto: ${textFiles.length}`);

// Función para extraer palabras de un texto
function extractWords(text) {
  // Eliminar frontmatter
  text = text.replace(/---[\s\S]*?---/, "");

  // Eliminar markdown
  text = text.replace(/[#*_`\[\](){}]/g, " ");
  text = text.replace(/https?:\/\/\S+/g, " ");
  text = text.replace(/[0-9.,;:!?"'()-]/g, " ");
  text = text.replace(/\s+/g, " ").trim();

  const words = text.toLowerCase().split(/\s+/);

  // Filtrar palabras: solo contenido sustancial, excluir nombres propios
  return words.filter((w) => {
    if (w.length < 3) return false;
    if (!/^[a-z]+$/.test(w)) return false;
    if (functionWords.has(w)) return false;
    if (commonNames.has(w)) return false;
    return true;
  });
}

const wordFreq = {};
let totalWords = 0;
let uniqueWords = new Set();

textFiles.forEach((file) => {
  const filePath = path.join(textsDir, file);
  const content = fs.readFileSync(filePath, "utf-8");
  const words = extractWords(content);

  totalWords += words.length;

  words.forEach((word) => {
    uniqueWords.add(word);
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
});

console.log(`\n📊 Estadísticas de vocabulario de contenido:`);
console.log(`   Total palabras procesadas: ${totalWords.toLocaleString()}`);
console.log(
  `   Palabras únicas encontradas: ${uniqueWords.size.toLocaleString()}`
);

// Encontrar palabras de contenido que NO están en 1000-words
const contentWordsNotInVocab = [];
uniqueWords.forEach((word) => {
  if (!vocabWords.has(word)) {
    contentWordsNotInVocab.push({
      word: word,
      frequency: wordFreq[word],
    });
  }
});

contentWordsNotInVocab.sort((a, b) => b.frequency - a.frequency);

console.log(
  `\n🔍 Palabras de contenido NO en 1000-words.json: ${contentWordsNotInVocab.length}`
);

// Mostrar TOP 150 palabras de contenido
console.log(`\n📈 TOP 150 PALABRAS DE CONTENIDO (no en vocabulario):`);
console.log("=".repeat(70));
console.log(
  "Rango | Palabra            | Frecuencia | % del texto | Prioridad"
);
console.log("-".repeat(70));

contentWordsNotInVocab.slice(0, 150).forEach((item, index) => {
  const percent = ((item.frequency / totalWords) * 100).toFixed(2);
  const rank = (index + 1).toString().padStart(3);
  const word = item.word.padEnd(18);
  const freq = item.frequency.toString().padStart(10);
  const pct = percent.padStart(11);

  // Prioridad basada en frecuencia
  let priority = "🟢 Baja";
  if (item.frequency >= 50) priority = "🔴 Alta";
  else if (item.frequency >= 20) priority = "🟡 Media";

  console.log(`${rank}   | ${word} | ${freq} | ${pct}% | ${priority}`);
});

// Categorizar por temas
console.log("\n" + "=".repeat(70));
console.log("📋 CATEGORIZACIÓN DE PALABRAS RECOMENDADAS:");
console.log("-".repeat(70));

const categories = {
  "Tiempo & Duración": [],
  "Lugar & Espacio": [],
  "Personas & Sociedad": [],
  "Emociones & Sensaciones": [],
  "Acciones & Actividades": [],
  "Descripción & Calidad": [],
  "Objetos & Cosas": [],
  "Conceptos Abstractos": [],
};

// Palabras clave por categoría (para clasificación simple)
const timeWords = [
  "years",
  "morning",
  "week",
  "month",
  "moment",
  "period",
  "century",
  "decade",
  "afternoon",
  "evening",
  "midnight",
  "lunch",
  "breakfast",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "annual",
  "recent",
  "ancient",
  "modern",
  "current",
];

const placeWords = [
  "city",
  "world",
  "home",
  "house",
  "building",
  "street",
  "road",
  "park",
  "school",
  "office",
  "room",
  "place",
  "area",
  "region",
  "country",
  "district",
  "neighborhood",
  "village",
  "town",
  "island",
  "mountain",
  "river",
  "ocean",
  "sea",
  "lake",
  "forest",
  "garden",
  "beach",
  "coast",
  "north",
  "south",
  "east",
  "west",
  "center",
  "downtown",
  "suburb",
  "rural",
  "urban",
];

const peopleWords = [
  "people",
  "family",
  "friend",
  "mother",
  "father",
  "parents",
  "children",
  "child",
  "kids",
  "son",
  "daughter",
  "brother",
  "sister",
  "wife",
  "husband",
  "couple",
  "group",
  "team",
  "community",
  "society",
  "population",
  "crowd",
  "audience",
  "class",
  "generation",
  "neighbor",
  "stranger",
  "visitor",
  "guest",
  "owner",
  "worker",
  "employee",
  "employer",
  "boss",
  "customer",
  "student",
  "teacher",
  "doctor",
  "patient",
  "leader",
  "member",
  "citizen",
];

const emotionWords = [
  "feel",
  "felt",
  "feeling",
  "happy",
  "sad",
  "angry",
  "tired",
  "excited",
  "bored",
  "nervous",
  "worried",
  "afraid",
  "scared",
  "surprised",
  "shocked",
  "pleased",
  "satisfied",
  "disappointed",
  "frustrated",
  "confused",
  "curious",
  "interested",
  "boring",
  "interesting",
  "amazing",
  "wonderful",
  "terrible",
  "awful",
  "beautiful",
  "ugly",
  "perfect",
  "awful",
  "nice",
  "lovely",
  "pleasant",
  "unpleasant",
  "comfortable",
  "uncomfortable",
];

const actionWords = [
  "work",
  "working",
  "worked",
  "talk",
  "talked",
  "talking",
  "walk",
  "walked",
  "walking",
  "look",
  "looked",
  "looking",
  "ask",
  "asked",
  "asking",
  "help",
  "helped",
  "helping",
  "start",
  "started",
  "starting",
  "stop",
  "stopped",
  "stopping",
  "begin",
  "began",
  "begun",
  "beginning",
  "end",
  "ended",
  "ending",
  "finish",
  "finished",
  "finishing",
  "continue",
  "continued",
  "continuing",
  "return",
  "returned",
  "returning",
  "arrive",
  "arrived",
  "arriving",
  "leave",
  "left",
  "leaving",
  "stay",
  "stayed",
  "staying",
  "visit",
  "visited",
  "visiting",
  "travel",
  "traveled",
  "traveling",
  "move",
  "moved",
  "moving",
  "live",
  "lived",
  "living",
  "die",
  "died",
  "dying",
  "born",
  "grow",
  "grew",
  "grown",
  "growing",
  "develop",
  "developed",
  "developing",
  "create",
  "created",
  "creating",
  "build",
  "built",
  "building",
  "make",
  "made",
  "making",
];

const descWords = [
  "small",
  "big",
  "large",
  "little",
  "tiny",
  "huge",
  "enormous",
  "giant",
  "short",
  "long",
  "tall",
  "high",
  "low",
  "deep",
  "shallow",
  "wide",
  "narrow",
  "thick",
  "thin",
  "fat",
  "heavy",
  "light",
  "strong",
  "weak",
  "hard",
  "soft",
  "smooth",
  "rough",
  "sharp",
  "blunt",
  "bright",
  "dark",
  "light",
  "heavy",
  "new",
  "old",
  "young",
  "ancient",
  "modern",
  "current",
  "past",
  "future",
  "recent",
  "early",
  "late",
  "quick",
  "slow",
  "fast",
  "rapid",
  "gradual",
  "sudden",
  "easy",
  "difficult",
  "simple",
  "complex",
  "complicated",
  "clear",
  "unclear",
  "obvious",
  "hidden",
  "visible",
  "invisible",
  "possible",
  "impossible",
  "certain",
  "uncertain",
];

const objectWords = [
  "car",
  "phone",
  "computer",
  "book",
  "paper",
  "letter",
  "message",
  "photo",
  "picture",
  "camera",
  "door",
  "window",
  "wall",
  "floor",
  "roof",
  "ceiling",
  "chair",
  "table",
  "desk",
  "bed",
  "sofa",
  "couch",
  "television",
  "tv",
  "radio",
  "machine",
  "tool",
  "toy",
  "game",
  "ball",
  "bag",
  "box",
  "bottle",
  "cup",
  "plate",
  "glass",
  "food",
  "meal",
  "drink",
  "water",
  "coffee",
  "tea",
  "bread",
  "fruit",
  "vegetable",
  "meat",
  "fish",
  "money",
  "cash",
  "card",
  "key",
  "lock",
  "light",
  "lamp",
  "fan",
  "clock",
  "watch",
  "shoes",
  "shirt",
  "dress",
  "pants",
  "hat",
  "coat",
  "jacket",
  "sweater",
  "umbrella",
];

const abstractWords = [
  "life",
  "death",
  "love",
  "hate",
  "peace",
  "war",
  "truth",
  "lie",
  "fact",
  "idea",
  "thought",
  "mind",
  "brain",
  "heart",
  "soul",
  "spirit",
  "body",
  "health",
  "sickness",
  "disease",
  "problem",
  "solution",
  "answer",
  "question",
  "reason",
  "cause",
  "effect",
  "result",
  "purpose",
  "goal",
  "aim",
  "plan",
  "project",
  "program",
  "system",
  "process",
  "method",
  "way",
  "means",
  "end",
  "beginning",
  "middle",
  "center",
  "edge",
  "side",
  "part",
  "piece",
  "section",
  "whole",
  "half",
  "quarter",
  "majority",
  "minority",
  "amount",
  "number",
  "quantity",
  "quality",
  "value",
  "worth",
  "price",
  "cost",
  "benefit",
  "advantage",
  "disadvantage",
  "risk",
  "danger",
  "safety",
  "security",
  "protection",
  "freedom",
  "liberty",
  "right",
  "wrong",
  "justice",
  "equality",
  "power",
  "strength",
  "force",
  "energy",
  "matter",
  "material",
  "substance",
  "nature",
  "culture",
  "society",
  "economy",
  "politics",
  "government",
  "law",
  "rule",
  "order",
  "chaos",
  "change",
  "progress",
  "development",
  "growth",
  "improvement",
  "success",
  "failure",
  "victory",
  "defeat",
  "win",
  "loss",
  "gain",
  "profit",
  "loss",
  "increase",
  "decrease",
  "rise",
  "fall",
  "growth",
  "decline",
  "expansion",
  "contraction",
];

contentWordsNotInVocab.slice(0, 300).forEach((item) => {
  const word = item.word;
  if (timeWords.includes(word)) categories["Tiempo & Duración"].push(item);
  else if (placeWords.includes(word)) categories["Lugar & Espacio"].push(item);
  else if (peopleWords.includes(word))
    categories["Personas & Sociedad"].push(item);
  else if (emotionWords.includes(word))
    categories["Emociones & Sensaciones"].push(item);
  else if (actionWords.includes(word))
    categories["Acciones & Actividades"].push(item);
  else if (descWords.includes(word))
    categories["Descripción & Calidad"].push(item);
  else if (objectWords.includes(word)) categories["Objetos & Cosas"].push(item);
  else if (abstractWords.includes(word))
    categories["Conceptos Abstractos"].push(item);
});

Object.entries(categories).forEach(([category, words]) => {
  if (words.length > 0) {
    console.log(`\n${category}:`);
    words.slice(0, 15).forEach((item) => {
      console.log(`  • ${item.word} (${item.frequency} veces)`);
    });
    if (words.length > 15) {
      console.log(`  ... y ${words.length - 15} más`);
    }
  }
});

// Top palabras más importantes para agregar
console.log("\n" + "=".repeat(70));
console.log("🎯 TOP 50 PALABRAS MÁS IMPORTANTES PARA AGREGAR AL VOCABULARIO:");
console.log("-".repeat(70));

const topImportant = contentWordsNotInVocab
  .filter((w) => w.frequency >= 10)
  .slice(0, 50);

topImportant.forEach((item, index) => {
  console.log(
    `${(index + 1).toString().padStart(2)}. ${item.word.padEnd(15)} - ${item.frequency.toString().padStart(3)} apariciones`
  );
});

// Guardar resultados
const outputData = {
  stats: {
    vocabWords: vocabWords.size,
    totalFiles: textFiles.length,
    totalContentWords: totalWords,
    uniqueContentWords: uniqueWords.size,
    notInVocab: contentWordsNotInVocab.length,
  },
  topContentWords: contentWordsNotInVocab.slice(0, 200),
  recommendedToAdd: contentWordsNotInVocab.filter((w) => w.frequency >= 10),
};

const outputPath = path.join(__dirname, "content-word-analysis.json");
fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
console.log(`\n💾 Resultados detallados guardados en: ${outputPath}`);
