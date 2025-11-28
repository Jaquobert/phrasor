import { create } from 'zustand'
import db from './persistence'
import { Formula } from '../types/Formula'
import { parseFormulaString } from '../engine/validationEngine'

export interface FormulaState {
  formulas: Formula[]
  selectedFormulaId?: string
  addFormula: (raw: string, name?: string) => Promise<Formula>
  removeFormula: (id: string) => Promise<void>
  selectFormula: (id?: string) => void
  loadFormulas: () => Promise<void>
}

export const useFormulaStore = create<FormulaState>((set, get) => ({
  formulas: [],
  selectedFormulaId: undefined,
  addFormula: async (raw, name) => {
    const formula = parseFormulaString(raw, name)
    const formulas = [...get().formulas, formula]
    set({ formulas })
    await db.formulas.put(formula)
    return formula
  },
  removeFormula: async (id) => {
    const formulas = get().formulas.filter((f) => f.id !== id)
    set({ formulas })
    await db.formulas.delete(id)
  },
  selectFormula: (id) => set({ selectedFormulaId: id }),
  loadFormulas: async () => {
    const formulas = await db.formulas.toArray()
    set({ formulas })
  },
}))
