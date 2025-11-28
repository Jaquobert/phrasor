import { Slot } from '../types/Slot'

interface LockToggleProps {
  slot: Slot
  onToggle: () => void
}

export default function LockToggle({ slot, onToggle }: LockToggleProps) {
  return (
    <button
      type="button"
      className={`button ${slot.locked ? 'bg-amber-600 hover:bg-amber-500' : ''}`}
      onClick={onToggle}
    >
      {slot.locked ? 'Déverrouiller' : 'Verrouiller'}
    </button>
  )
}
