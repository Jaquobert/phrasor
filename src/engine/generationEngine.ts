import { Formula } from '../types/Formula'
import { Proposition } from '../types/Proposition'
import { Slot } from '../types/Slot'
import { Word } from '../types/Word'
import { emptySlotsFromTokens } from './validationEngine'
import { renderProposition } from './grammarEngine'

export function randomChoice<T>(arr: T[]): T | undefined {
  if (!arr.length) return undefined
  return arr[Math.floor(Math.random() * arr.length)]
}

export function fillSlot(slot: Slot, words: Word[]): Slot {
  const choice = randomChoice(words)
  return {
    ...slot,
    selectedWordId: choice?.id,
  }
}

export function generateProposition(formula: Formula, lexicon: Partial<Record<string, Word[]>>): Proposition {
  const slots = emptySlotsFromTokens(formula.tokens).map((slot) => {
    const words = lexicon[slot.type] || []
    return fillSlot(slot, words)
  })

  const renderedText = renderProposition(slots, lexicon)

  return {
    id: crypto.randomUUID(),
    formulaId: formula.id,
    slots,
    renderedText,
  }
}

export function regenerateSlot(
  proposition: Proposition,
  slotId: string,
  lexicon: Partial<Record<string, Word[]>>,
): Proposition {
  const slots = proposition.slots.map((slot) => {
    if (slot.id !== slotId || slot.locked) return slot
    const words = lexicon[slot.type] || []
    return fillSlot(slot, words)
  })

  return {
    ...proposition,
    slots,
    renderedText: renderProposition(slots, lexicon),
  }
}
