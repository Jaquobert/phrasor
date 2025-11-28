import { useMemo } from 'react'
import { useFormulaStore } from '../store/formulaStore'
import { useLexiconStore } from '../store/lexiconStore'
import { usePropositionStore } from '../store/propositionStore'
import SlotSelector from './SlotSelector'
import Randomizer from './Randomizer'

export default function PropositionEditor() {
  const { selectedFormulaId, formulas } = useFormulaStore()
  const { wordsByType } = useLexiconStore()
  const { propositions, createFromFormula } = usePropositionStore()

  const selectedFormula = useMemo(
    () => formulas.find((f) => f.id === selectedFormulaId),
    [formulas, selectedFormulaId],
  )

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Propositions élémentaires</h2>
        <button
          className="button"
          type="button"
          disabled={!selectedFormula}
          onClick={() => selectedFormula && createFromFormula(selectedFormula, wordsByType)}
        >
          Générer une PE
        </button>
      </div>
      {!selectedFormula && <p className="text-sm text-slate-400">Choisissez une formule pour commencer.</p>}
      <div className="space-y-4">
        {propositions.map((proposition) => (
          <div key={proposition.id} className="border border-slate-800 rounded-lg p-3 space-y-3 bg-slate-900/60">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Formule</p>
                <p className="font-semibold text-slate-100">{proposition.slots.map((s) => s.type).join(' · ')}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Texte rendu</p>
                <p className="font-semibold text-indigo-200">{proposition.renderedText || '—'}</p>
                <div className="mt-2 flex justify-end">
                  <Randomizer propositionId={proposition.id} />
                </div>
              </div>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {proposition.slots.map((slot) => (
                <SlotSelector
                  key={slot.id}
                  propositionId={proposition.id}
                  slot={slot}
                  words={wordsByType[slot.type] || []}
                  lexicon={wordsByType}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
