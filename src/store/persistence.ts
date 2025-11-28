import Dexie, { Table } from 'dexie'
import { Formula } from '../types/Formula'
import { Proposition, SignPropositionnel } from '../types/Proposition'
import { Word } from '../types/Word'

class PhrasorDatabase extends Dexie {
  formulas!: Table<Formula, string>
  propositions!: Table<Proposition, string>
  signs!: Table<SignPropositionnel, string>
  words!: Table<Word, string>

  constructor() {
    super('phrasor-db')
    this.version(1).stores({
      formulas: 'id',
      propositions: 'id,formulaId',
      signs: 'id',
      words: 'id,type',
    })
  }
}

const db = new PhrasorDatabase()

export default db
