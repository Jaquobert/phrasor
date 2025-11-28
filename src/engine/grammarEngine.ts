import nlp from 'compromise'
import { FormulaToken } from '../types/Formula'
import { Proposition } from '../types/Proposition'
import { Slot, SlotFeatures } from '../types/Slot'
import { Word } from '../types/Word'

const determinerForms: Record<string, { masculine: string; feminine: string; plural: string }> = {
  le: { masculine: 'le', feminine: 'la', plural: 'les' },
  un: { masculine: 'un', feminine: 'une', plural: 'des' },
  ce: { masculine: 'ce', feminine: 'cette', plural: 'ces' },
  mon: { masculine: 'mon', feminine: 'ma', plural: 'mes' },
}

function agreeDeterminer(lemma: string, gender: SlotFeatures['gender'], number: SlotFeatures['number']): string {
  const forms = determinerForms[lemma.toLowerCase()]
  if (!forms) return lemma
  if (number === 'plural') return forms.plural
  return gender === 'feminine' ? forms.feminine : forms.masculine
}

function agreeAdjective(base: string, gender: SlotFeatures['gender'], number: SlotFeatures['number']): string {
  let form = base
  if (gender === 'feminine' && !base.endsWith('e')) {
    form = `${base}e`
  }
  if (number === 'plural' && !form.endsWith('s')) {
    form = `${form}s`
  }
  return form
}

function conjugateVerb(lemma: string, features: SlotFeatures): string {
  const tense = features.tense || 'present'
  const person = features.person ?? 3
  const number = features.number || 'singular'

  if (tense === 'past') {
    return `${number === 'plural' ? 'ont' : 'a'} ${lemma}`
  }
  if (tense === 'future') {
    return `${number === 'plural' ? 'vont' : 'va'} ${lemma}`
  }

  // simple present using compromise as fallback for irregularities
  const doc = nlp(lemma)
  const conjugated = doc.verbs().conjugate()[0]
  if (conjugated) {
    if (number === 'plural') {
      if (person === 1) return conjugated.presentTense['we'] || conjugated.Present
      if (person === 2) return conjugated.presentTense['you'] || conjugated.Present
      return conjugated.presentTense['they'] || conjugated.Present
    }
    if (person === 1) return conjugated.presentTense['i'] || conjugated.Present
    if (person === 2) return conjugated.presentTense['you'] || conjugated.Present
    return conjugated.presentTense['he'] || conjugated.Present
  }

  const base = lemma.replace(/er$/i, '')
  const endings: Record<string, string> = {
    '1-singular': 'e',
    '2-singular': 'es',
    '3-singular': 'e',
    '1-plural': 'ons',
    '2-plural': 'ez',
    '3-plural': 'ent',
  }
  return `${base}${endings[`${person}-${number}`] || ''}`
}

function getNounFeatures(slot: Slot, word?: Word): SlotFeatures {
  return {
    gender: slot.features.gender || word?.metadata.gender,
    number: slot.features.number || 'singular',
    person: 3,
  }
}

function findNearest(slots: Slot[], startIndex: number, type: FormulaToken): Slot | undefined {
  return slots.slice(startIndex).find((s) => s.type === type && s.selectedWordId)
}

export function renderProposition(slots: Slot[], lexicon: Partial<Record<string, Word[]>>): string {
  const wordsById = new Map<string, Word>()
  Object.values(lexicon).forEach((words) => {
    words?.forEach((w) => wordsById.set(w.id, w))
  })

  const rendered: string[] = []
  let lastNounFeatures: SlotFeatures | undefined

  slots.forEach((slot, index) => {
    const word = slot.selectedWordId ? wordsById.get(slot.selectedWordId) : undefined
    if (!word) {
      rendered.push('')
      return
    }

    if (!slot.autoAgreement) {
      rendered.push(word.lemma)
      return
    }

    if (slot.type === 'D') {
      const nextNoun = findNearest(slots, index + 1, 'N')
      const nextWord = nextNoun?.selectedWordId ? wordsById.get(nextNoun.selectedWordId) : undefined
      const nounFeatures = getNounFeatures(nextNoun || slot, nextWord)
      rendered.push(agreeDeterminer(word.lemma, nounFeatures.gender, nounFeatures.number))
      return
    }

    if (slot.type === 'N') {
      const nounFeatures = getNounFeatures(slot, word)
      lastNounFeatures = nounFeatures
      let nounForm = word.lemma
      if (nounFeatures.number === 'plural' && !nounForm.endsWith('s')) {
        nounForm = `${nounForm}s`
      }
      rendered.push(nounForm)
      return
    }

    if (slot.type === 'V') {
      const features: SlotFeatures = {
        number: lastNounFeatures?.number || slot.features.number || 'singular',
        person: lastNounFeatures?.person || slot.features.person || 3,
        tense: slot.features.tense || 'present',
      }
      rendered.push(conjugateVerb(word.lemma, features))
      return
    }

    if (slot.type === 'A') {
      const gender = lastNounFeatures?.gender || slot.features.gender
      const number = lastNounFeatures?.number || slot.features.number
      rendered.push(agreeAdjective(word.lemma, gender, number))
      return
    }

    rendered.push(word.lemma)
  })

  return rendered.filter(Boolean).join(' ')
}

export function applyLock(proposition: Proposition, slotId: string, locked: boolean): Proposition {
  const slots = proposition.slots.map((slot) => (slot.id === slotId ? { ...slot, locked } : slot))
  return { ...proposition, slots }
}

export function toggleAutoAgreement(proposition: Proposition, slotId: string): Proposition {
  const slots = proposition.slots.map((slot) =>
    slot.id === slotId ? { ...slot, autoAgreement: !slot.autoAgreement } : slot,
  )
  return { ...proposition, slots }
}
