import { Slot } from './Slot'

export interface Proposition {
  id: string
  formulaId: string
  slots: Slot[]
  renderedText: string
}

export interface SignPropositionnel {
  id: string
  propositionIds: string[]
  connectors: string[]
  renderedText: string
}
