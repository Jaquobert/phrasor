import { Slot } from '../types/Slot'
import { Word } from '../types/Word'
import { usePropositionStore } from '../store/propositionStore'

interface SlotSelectorProps {
  propositionId: string
  slot: Slot
  words: Word[]
  lexicon: Partial<Record<string, Word[]>>
}

export default function SlotSelector({ propositionId, slot, words, lexicon }: SlotSelectorProps) {
  const { regenerateSlot, toggleLock, toggleAutoAgreement, setSlotWord } = usePropositionStore()

  const selectedWord = words.find((w) => w.id === slot.selectedWordId)

  return (
    <div className="border border-slate-800 rounded-md p-3 bg-slate-900/60 flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <div>
          <p className="text-xs uppercase text-slate-400">{slot.type}</p>
          <p className="font-semibold">{selectedWord?.lemma || '—'}</p>
        </div>
        <div className="flex gap-2">
          <button
            className={`button ${slot.locked ? 'bg-amber-600 hover:bg-amber-500' : ''}`}
            type="button"
            onClick={() => toggleLock(propositionId, slot.id)}
          >
            {slot.locked ? 'Déverrouiller' : 'Verrouiller'}
          </button>
          <button
            className={`button ${slot.autoAgreement ? '' : 'bg-slate-600 hover:bg-slate-500'}`}
            type="button"
            onClick={() => toggleAutoAgreement(propositionId, slot.id, lexicon)}
          >
            {slot.autoAgreement ? 'Correction active' : 'Correction désactivée'}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 items-center text-sm">
        <label className="text-xs text-slate-400">Sélection</label>
        <select
          className="input"
          value={slot.selectedWordId}
          onChange={(e) => setSlotWord(propositionId, slot.id, e.target.value, lexicon)}
        >
          <option value="">—</option>
          {words.map((word) => (
            <option key={word.id} value={word.id}>
              {word.lemma}
            </option>
          ))}
        </select>
        <button
          className="button"
          type="button"
          onClick={() => regenerateSlot(propositionId, slot.id, lexicon)}
          disabled={slot.locked}
        >
          Hasard
        </button>
      </div>
    </div>
  )
}
