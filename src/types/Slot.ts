import { FormulaToken } from './Formula'

export interface SlotFeatures {
  tense?: 'past' | 'present' | 'future'
  person?: 1 | 2 | 3
  number?: 'singular' | 'plural'
  gender?: 'masculine' | 'feminine'
}

export interface Slot {
  id: string
  type: FormulaToken
  features: SlotFeatures
  locked: boolean
  autoAgreement: boolean
  selectedWordId?: string
}
