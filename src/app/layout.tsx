import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900/60 sticky top-0 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-indigo-300">Phrasor</p>
            <h1 className="text-xl font-bold">Machine grammaticale logico-poétique</h1>
          </div>
          <div className="text-sm text-slate-300">Offline-first · IndexedDB</div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">{children}</main>
    </div>
  )
}
