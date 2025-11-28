import { useEffect, useState } from 'react'
import { usePropositionStore } from '../store/propositionStore'
import { useLexiconStore } from '../store/lexiconStore'

export default function FinalRenderer() {
  const { propositions, sign, buildSign } = usePropositionStore()
  const { wordsByType } = useLexiconStore()
  const connectors = wordsByType['C'] || []
  const [selectedConnectors, setSelectedConnectors] = useState<string[]>([])

  useEffect(() => {
    setSelectedConnectors((prev) => {
      if (prev.length >= propositions.length) return prev.slice(0, propositions.length - 1)
      const defaults = Array.from({ length: Math.max(propositions.length - 1, 0) }, (_, idx) => prev[idx] || connectors[0]?.id || '')
      return defaults
    })
  }, [propositions.length, connectors])

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Signe propositionnel</h2>
        <button
          className="button"
          type="button"
          disabled={!propositions.length}
          onClick={() => buildSign(selectedConnectors.map((id) => connectors.find((c) => c.id === id)?.lemma || ''))}
        >
          Assembler
        </button>
      </div>
      {propositions.length === 0 && <p className="text-sm text-slate-400">Ajoutez au moins une proposition pour composer un SP.</p>}
      {propositions.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-slate-300">Connecteurs entre les PE (issus du lexique)</p>
          <div className="flex flex-wrap gap-2">
            {propositions.slice(0, -1).map((proposition, index) => (
              <div key={proposition.id} className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Entre #{index + 1} et #{index + 2}</span>
                <select
                  className="input"
                  value={selectedConnectors[index] || ''}
                  onChange={(e) =>
                    setSelectedConnectors((current) => {
                      const copy = [...current]
                      copy[index] = e.target.value
                      return copy
                    })
                  }
                >
                  {connectors.map((connector) => (
                    <option key={connector.id} value={connector.id}>
                      {connector.lemma}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <div className="border border-slate-800 rounded-lg p-3 bg-slate-900/60">
            <p className="text-xs text-slate-400">Texte final</p>
            <p className="text-xl font-bold text-indigo-200">{sign?.renderedText || propositions.map((p) => p.renderedText).join(' ')}</p>
          </div>
        </div>
      )}
    </div>
  )
}
