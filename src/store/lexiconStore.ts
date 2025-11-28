import { create } from 'zustand'
import nounsCsv from '../data/lexicons/nouns.csv?raw'
import verbsCsv from '../data/lexicons/verbs.csv?raw'
import adjectivesCsv from '../data/lexicons/adjectives.csv?raw'
import determinersCsv from '../data/lexicons/determiners.csv?raw'
import connectorsCsv from '../data/lexicons/connectors.csv?raw'
import { Word } from '../types/Word'
import { FormulaToken } from '../types/Formula'
import db from './persistence'

const csvParsers: Record<FormulaToken, string> = {
  N: nounsCsv,
  V: verbsCsv,
  A: adjectivesCsv,
  D: determinersCsv,
  C: connectorsCsv,
  ADV: '',
  P: '',
}

function parseCsv(content: string, type: FormulaToken): Word[] {
  if (!content) return []
  const [header, ...lines] = content.trim().split(/\r?\n/)
  const headers = header.split(',')
  return lines.map((line) => {
    const cells = line.split(',')
    const row: Record<string, string> = {}
    headers.forEach((key, idx) => {
      row[key.trim()] = (cells[idx] || '').trim()
    })
    const metadata: Word['metadata'] = {
      gender: (row['gender'] as Word['metadata']['gender']) || undefined,
      transitivity: (row['transitivity'] as Word['metadata']['transitivity']) || undefined,
      semanticClass: row['semanticClass'] ? row['semanticClass'].split(';').map((v) => v.trim()) : undefined,
      human: row['human'] ? row['human'] === 'true' : undefined,
      abstract: row['abstract'] ? row['abstract'] === 'true' : undefined,
    }
    return {
      id: row['id'],
      lemma: row['lemma'],
      type,
      forms: {},
      metadata,
    }
  })
}

export interface LexiconState {
  words: Word[]
  wordsByType: Partial<Record<FormulaToken, Word[]>>
  loadDefaultLexicons: () => Promise<void>
  upsertWord: (word: Word) => Promise<void>
}

export const useLexiconStore = create<LexiconState>((set, get) => ({
  words: [],
  wordsByType: {},
  loadDefaultLexicons: async () => {
    const existing = await db.words.toArray()
    if (existing.length) {
      const grouped = groupByType(existing)
      set({ words: existing, wordsByType: grouped })
      return
    }

    const loaded: Word[] = []
    (Object.keys(csvParsers) as FormulaToken[]).forEach((token) => {
      const parsed = parseCsv(csvParsers[token], token)
      loaded.push(...parsed)
    })

    await db.words.bulkPut(loaded)
    set({ words: loaded, wordsByType: groupByType(loaded) })
  },
  upsertWord: async (word: Word) => {
    const { words } = get()
    const updated = [...words.filter((w) => w.id !== word.id), word]
    await db.words.put(word)
    set({ words: updated, wordsByType: groupByType(updated) })
  },
}))

function groupByType(words: Word[]): Partial<Record<FormulaToken, Word[]>> {
  return words.reduce<Partial<Record<FormulaToken, Word[]>>>((acc, word) => {
    if (!acc[word.type]) acc[word.type] = []
    acc[word.type]!.push(word)
    return acc
  }, {})
}
