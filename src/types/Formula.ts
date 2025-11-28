export type FormulaToken = 'D' | 'N' | 'V' | 'A' | 'ADV' | 'P' | 'C'

export interface Formula {
  id: string
  name?: string
  tokens: FormulaToken[]
}
