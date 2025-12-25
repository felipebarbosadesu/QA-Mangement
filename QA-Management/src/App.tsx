import React from 'react'
import './index.css'

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-slate-900">
      <div className="max-w-xl p-8 text-center">
        <h1 className="text-4xl font-extrabold">QA Management</h1>
        <p className="mt-3 text-gray-600">Versão rápida pública — site no ar com conteúdo principal</p>

        <div className="mt-6 flex justify-center gap-4">
          <a href="/" className="text-blue-600 hover:underline">Ir para início</a>
          <a href="https://github.com/felipebarbosadesu/QA-Mangement" className="text-blue-600 hover:underline">Repositório</a>
        </div>

        <div className="mt-8 p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-500">Se precisar da versão completa, eu posso finalizar a restauração completa por trás dos bastidores.</p>
        </div>
      </div>
    </div>
  )
}
