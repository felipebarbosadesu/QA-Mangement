import React, { useEffect, useState } from 'react'
import './index.css'
import { mockTests, mockIssues } from './utils/mock-data'
import { Dashboard } from './pages/Dashboard'
import { Bugs } from './pages/Bugs'
import { IssuesPage } from './pages/IssuesPage'
import { Tests } from './pages/Tests'
import { UsersPage } from './pages/UsersPage'
import { AboutPage } from './pages/AboutPage'
import { Login } from './pages/Login'
import { Settings } from './pages/Settings'

const SLUGS: Record<string, { id: string; label: string }> = {
  home: { id: 'home', label: 'Home' },
  dashboard: { id: 'dashboard', label: 'Dashboard' },
  tests: { id: 'tests', label: 'Casos de Testes' },
  bugs: { id: 'bugs', label: 'Bugs' },
  issues: { id: 'issues', label: 'Bugs & Melhorias' },
  users: { id: 'users', label: 'Usuários' },
  about: { id: 'about', label: 'Sobre' },
  login: { id: 'login', label: 'Login' },
  settings: { id: 'settings', label: 'Configurações' },
}

function parseHash() {
  const h = (location.hash || '').replace(/^#\/?/, '')
  return h || 'home'
}

export default function App() {
  const [page, setPage] = useState<string>(parseHash())

  useEffect(() => {
    const onHash = () => setPage(parseHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (slug: string) => {
    location.hash = `/${slug}`
    setPage(slug)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">QA Management</h1>
        <nav className="flex gap-3">
          {Object.keys(SLUGS).map((s) => (
            <button key={s} onClick={() => navigate(s)} className={`px-3 py-1 rounded ${page === s ? 'bg-[#BC8F2E] text-white' : 'text-slate-700 hover:bg-slate-100'}`}>
              {SLUGS[s].label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto">
        {page === 'home' && (
          <div className="space-y-4 p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold">Páginas públicas</h2>
            <p className="text-sm text-gray-600">Links diretos para cada página (use #/slug):</p>
            <ul className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
              {Object.keys(SLUGS).filter(s => s !== 'home').map(s => (
                <li key={s} className="p-3 bg-slate-50 rounded">
                  <a href={`#/${s}`} className="text-blue-600 hover:underline">/{s}</a>
                  <div className="text-xs text-gray-500 mt-1">{SLUGS[s].label}</div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {page === 'dashboard' && <Dashboard tests={mockTests} />}
        {page === 'tests' && <Tests tests={mockTests} />}
        {page === 'bugs' && <Bugs bugs={mockIssues.filter(i => i.type === 'bug')} />}
        {page === 'issues' && <IssuesPage issues={mockIssues} />}
        {page === 'users' && <UsersPage users={[]} onCreateUser={() => {}} onUpdateUser={() => {}} />}
        {page === 'about' && <AboutPage projectInfo={{ name: 'QA Management', version: '0.0.0', description: 'Site público', scope: 'QA', qualityRules: [] }} />}
        {page === 'login' && <Login />}
        {page === 'settings' && <Settings />}
      </main>
    </div>
  )
}
