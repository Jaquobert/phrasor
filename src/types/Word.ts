import { FormulaToken } from './Formula'

export interface Word {
  id: string
  lemma: string
  type: FormulaToken
  forms?: {
    [key: string]: string
  }
  metadata: {
    gender?: 'masculine' | 'feminine'
    transitivity?: 'transitive' | 'intransitive'
    semanticClass?: string[]
    human?: boolean
    abstract?: boolean
    poeticLevel?: number
  }
}
