import { useEffect } from 'react'
import Layout from './layout'
import FormulaEditor from '../ui/FormulaEditor'
import PropositionEditor from '../ui/PropositionEditor'
import FinalRenderer from '../ui/FinalRenderer'
import LexiconManager from '../ui/LexiconManager'
import { useLexiconStore } from '../store/lexiconStore'
import { useFormulaStore } from '../store/formulaStore'
import { usePropositionStore } from '../store/propositionStore'

export default function App() {
  const { loadDefaultLexicons } = useLexiconStore()
  const { loadFormulas } = useFormulaStore()
  const { loadPropositions } = usePropositionStore()

  useEffect(() => {
    loadDefaultLexicons()
    loadFormulas()
    loadPropositions()
  }, [loadDefaultLexicons, loadFormulas, loadPropositions])

  return (
    <Layout>
      <div className="grid lg:grid-cols-2 gap-6">
        <FormulaEditor />
        <LexiconManager />
      </div>
      <PropositionEditor />
      <FinalRenderer />
    </Layout>
  )
}
