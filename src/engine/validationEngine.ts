import { Formula, FormulaToken } from '../types/Formula'
import { Slot } from '../types/Slot'

const allowedTokens: FormulaToken[] = ['D', 'N', 'V', 'A', 'ADV', 'P', 'C']

export function parseFormulaString(raw: string, name?: string): Formula {
  const tokens = raw
    .split(/\s|,/)
    .map((token) => token.trim().toUpperCase())
    .filter(Boolean) as FormulaToken[]

  tokens.forEach((token) => {
    if (!allowedTokens.includes(token)) {
      throw new Error(`Token invalide: ${token}`)
    }
  })

  return {
    id: crypto.randomUUID(),
    name,
    tokens,
  }
}

export function emptySlotsFromTokens(tokens: FormulaToken[]): Slot[] {
  return tokens.map((token) => ({
    id: crypto.randomUUID(),
    type: token,
    features: {},
    locked: false,
    autoAgreement: true,
  }))
}
