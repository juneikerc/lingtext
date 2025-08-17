import { normalizeWord } from './tokenize'

// Very small built-in bilingual dictionary (en -> es). Can be extended by the user later.
const DICT: Record<string, string[]> = {
  'the': ['el', 'la', 'los', 'las'],
  'be': ['ser', 'estar'],
  'to': ['a', 'para'],
  'of': ['de'],
  'and': ['y'],
  'a': ['un', 'una'],
  'in': ['en'],
  'that': ['que', 'ese', 'esa'],
  'have': ['tener'],
  'it': ['eso', 'lo'],
  'i': ['yo'],
  'you': ['tú', 'usted', 'ustedes'],
  'he': ['él'],
  'she': ['ella'],
  'we': ['nosotros', 'nosotras'],
  'they': ['ellos', 'ellas'],
  'do': ['hacer'],
  'say': ['decir'],
  'go': ['ir'],
  'can': ['poder'],
  'get': ['obtener', 'conseguir'],
  'make': ['hacer'],
  'know': ['saber', 'conocer'],
  'think': ['pensar'],
  'see': ['ver'],
  'come': ['venir'],
  'want': ['querer'],
  'look': ['mirar'],
  'use': ['usar'],
  'find': ['encontrar'],
  'give': ['dar'],
  'tell': ['decir', 'contar'],
  'work': ['trabajar'],
  'call': ['llamar'],
  'good': ['bueno'],
  'new': ['nuevo'],
  'first': ['primero'],
  'last': ['último'],
  'long': ['largo'],
  'great': ['genial', 'gran'],
  'little': ['pequeño', 'poco'],
  'own': ['propio'],
  'other': ['otro'],
  'old': ['viejo'],
  'right': ['derecho', 'correcto'],
  'big': ['grande'],
  'high': ['alto'],
  'different': ['diferente'],
  'small': ['pequeño'],
  'study': ['estudiar'],
  'read': ['leer'],
  'book': ['libro'],
  'text': ['texto'],
  'word': ['palabra'],
  'listen': ['escuchar'],
  'speak': ['hablar'],
  'english': ['inglés'],
}

function stem(word: string): string[] {
  // naive morphological guesses
  const w = word
  const forms = new Set<string>([w])
  if (w.endsWith('s') && w.length > 3) forms.add(w.slice(0, -1))
  if (w.endsWith('es') && w.length > 4) forms.add(w.slice(0, -2))
  if (w.endsWith('ed') && w.length > 4) forms.add(w.slice(0, -2))
  if (w.endsWith('ing') && w.length > 5) forms.add(w.slice(0, -3))
  if (w.endsWith("'s")) forms.add(w.slice(0, -2))
  return Array.from(forms)
}

export async function translate(term: string): Promise<string[]> {
  const low = normalizeWord(term)
  if (!low) return []
  const variants = stem(low)
  const seen = new Set<string>()
  const result: string[] = []
  for (const v of variants) {
    const arr = DICT[v]
    if (arr) {
      for (const t of arr) {
        if (!seen.has(t)) {
          seen.add(t)
          result.push(t)
        }
      }
    }
  }
  return result
}
