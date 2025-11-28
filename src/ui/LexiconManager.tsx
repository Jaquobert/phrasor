import { useLexiconStore } from '../store/lexiconStore'
import { FormulaToken } from '../types/Formula'

const labels: Record<FormulaToken, string> = {
  D: 'Déterminants',
  N: 'Noms',
  V: 'Verbes',
  A: 'Adjectifs',
  ADV: 'Adverbes',
  P: 'Pronoms',
  C: 'Connecteurs',
}

export default function LexiconManager() {
  const { wordsByType } = useLexiconStore()

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Lexique local</h2>
        <p className="text-xs text-slate-400">CSV embarqués · pas de saisie libre</p>
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {(Object.keys(labels) as FormulaToken[]).map((token) => (
          <div key={token} className="border border-slate-800 rounded-md p-3 bg-slate-900/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">{labels[token]}</span>
              <span className="text-xs text-slate-400">{(wordsByType[token] || []).length} entrées</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-300">
              {(wordsByType[token] || []).map((word) => (
                <span key={word.id} className="px-2 py-1 bg-slate-800 rounded-full">
                  {word.lemma}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
