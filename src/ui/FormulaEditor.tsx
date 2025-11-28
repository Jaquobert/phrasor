import { FormEvent, useState } from 'react'
import { useFormulaStore } from '../store/formulaStore'

export default function FormulaEditor() {
  const { formulas, selectedFormulaId, addFormula, removeFormula, selectFormula } = useFormulaStore()
  const [input, setInput] = useState('D N V D N')
  const [name, setName] = useState('Formule de base')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    try {
      const formula = await addFormula(input, name)
      selectFormula(formula.id)
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Zone Formule</h2>
        <p className="text-xs text-slate-400">Tokens autorisés : D N V A ADV P C</p>
      </div>
      <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-slate-300">Formule (séparée par des espaces)</label>
          <input
            className="input w-full"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder="D N V D N"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-300">Nom (optionnel)</label>
          <input className="input w-full" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="md:col-span-2 flex items-center gap-2">
          <button type="submit" className="button">
            Enregistrer la formule
          </button>
          {error && <span className="text-sm text-red-400">{error}</span>}
        </div>
      </form>
      <div className="space-y-2">
        <h3 className="font-semibold text-slate-200">Formules enregistrées</h3>
        {formulas.length === 0 && <p className="text-sm text-slate-400">Aucune formule pour le moment.</p>}
        <ul className="space-y-2">
          {formulas.map((formula) => (
            <li
              key={formula.id}
              className={`flex items-center justify-between rounded-md border px-3 py-2 text-sm ${
                formula.id === selectedFormulaId ? 'border-indigo-500/60 bg-indigo-500/10' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="font-semibold">{formula.name || 'Sans titre'}</div>
                <div className="text-xs text-slate-400">{formula.tokens.join(' · ')}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className="button" type="button" onClick={() => selectFormula(formula.id)}>
                  Sélectionner
                </button>
                <button
                  className="button bg-red-500 hover:bg-red-400"
                  type="button"
                  onClick={() => removeFormula(formula.id)}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
