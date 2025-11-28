import { create } from 'zustand'
import db from './persistence'
import { Proposition, SignPropositionnel } from '../types/Proposition'
import { Formula } from '../types/Formula'
import { Word } from '../types/Word'
import { applyLock, renderProposition, toggleAutoAgreement } from '../engine/grammarEngine'
import { fillSlot, generateProposition, regenerateSlot } from '../engine/generationEngine'

export interface PropositionState {
  propositions: Proposition[]
  sign?: SignPropositionnel
  loadPropositions: () => Promise<void>
  createFromFormula: (formula: Formula, lexicon: Partial<Record<string, Word[]>>) => Promise<Proposition>
  regenerateSlot: (id: string, slotId: string, lexicon: Partial<Record<string, Word[]>>) => Promise<void>
  randomizeUnlocked: (id: string, lexicon: Partial<Record<string, Word[]>>) => Promise<void>
  setSlotWord: (
    id: string,
    slotId: string,
    wordId: string,
    lexicon: Partial<Record<string, Word[]>>,
  ) => Promise<void>
  toggleLock: (id: string, slotId: string) => Promise<void>
  toggleAutoAgreement: (id: string, slotId: string, lexicon: Partial<Record<string, Word[]>>) => Promise<void>
  refreshRender: (id: string, lexicon: Partial<Record<string, Word[]>>) => Promise<void>
  buildSign: (connectors: string[]) => Promise<void>
}

export const usePropositionStore = create<PropositionState>((set, get) => ({
  propositions: [],
  sign: undefined,
  loadPropositions: async () => {
    const propositions = await db.propositions.toArray()
    set({ propositions })
  },
  createFromFormula: async (formula, lexicon) => {
    const proposition = generateProposition(formula, lexicon)
    await db.propositions.put(proposition)
    set({ propositions: [...get().propositions, proposition] })
    return proposition
  },
  regenerateSlot: async (id, slotId, lexicon) => {
    const proposition = get().propositions.find((p) => p.id === id)
    if (!proposition) return
    const updated = regenerateSlot(proposition, slotId, lexicon)
    await db.propositions.put(updated)
    set({ propositions: get().propositions.map((p) => (p.id === id ? updated : p)) })
  },
  randomizeUnlocked: async (id, lexicon) => {
    const proposition = get().propositions.find((p) => p.id === id)
    if (!proposition) return
    const slots = proposition.slots.map((slot) => {
      if (slot.locked) return slot
      const words = lexicon[slot.type] || []
      return fillSlot(slot, words)
    })
    const renderedText = renderProposition(slots, lexicon)
    const updated = { ...proposition, slots, renderedText }
    await db.propositions.put(updated)
    set({ propositions: get().propositions.map((p) => (p.id === id ? updated : p)) })
  },
  setSlotWord: async (id, slotId, wordId, lexicon) => {
    const proposition = get().propositions.find((p) => p.id === id)
    if (!proposition) return
    const slots = proposition.slots.map((slot) =>
      slot.id === slotId ? { ...slot, selectedWordId: wordId } : slot,
    )
    const renderedText = renderProposition(slots, lexicon)
    const updated = { ...proposition, slots, renderedText }
    await db.propositions.put(updated)
    set({ propositions: get().propositions.map((p) => (p.id === id ? updated : p)) })
  },
  toggleLock: async (id, slotId) => {
    const proposition = get().propositions.find((p) => p.id === id)
    if (!proposition) return
    const updated = applyLock(proposition, slotId, !proposition.slots.find((s) => s.id === slotId)?.locked)
    await db.propositions.put(updated)
    set({ propositions: get().propositions.map((p) => (p.id === id ? updated : p)) })
  },
  toggleAutoAgreement: async (id, slotId, lexicon) => {
    const proposition = get().propositions.find((p) => p.id === id)
    if (!proposition) return
    const updated = toggleAutoAgreement(proposition, slotId)
    updated.renderedText = renderProposition(updated.slots, lexicon)
    await db.propositions.put(updated)
    set({ propositions: get().propositions.map((p) => (p.id === id ? updated : p)) })
  },
  refreshRender: async (id, lexicon) => {
    const proposition = get().propositions.find((p) => p.id === id)
    if (!proposition) return
    const renderedText = renderProposition(proposition.slots, lexicon)
    const updated = { ...proposition, renderedText }
    await db.propositions.put(updated)
    set({ propositions: get().propositions.map((p) => (p.id === id ? updated : p)) })
  },
  buildSign: async (connectors) => {
    const propositions = get().propositions
    const renderedPieces = propositions.map((p, idx) => {
      const connector = connectors[idx] || ''
      return connector ? `${p.renderedText} ${connector}` : p.renderedText
    })

    const renderedText = renderedPieces.join(' ')
    const sign: SignPropositionnel = {
      id: crypto.randomUUID(),
      propositionIds: propositions.map((p) => p.id),
      connectors,
      renderedText,
    }
    await db.signs.put(sign)
    set({ sign })
  },
}))
