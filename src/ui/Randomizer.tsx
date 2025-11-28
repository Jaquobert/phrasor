import { useLexiconStore } from '../store/lexiconStore'
import { usePropositionStore } from '../store/propositionStore'

interface RandomizerProps {
  propositionId: string
}

export default function Randomizer({ propositionId }: RandomizerProps) {
  const { randomizeUnlocked } = usePropositionStore()
  const { wordsByType } = useLexiconStore()

  return (
    <button className="button" type="button" onClick={() => randomizeUnlocked(propositionId, wordsByType)}>
      Hasard contrôlé
    </button>
  )
}
