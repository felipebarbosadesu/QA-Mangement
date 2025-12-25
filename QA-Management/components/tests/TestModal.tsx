import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { TestScenario, StatusType } from '../../types';
import { Button } from '../common/Button';

interface TestModalProps {
  test?: TestScenario;
  isOpen: boolean;
  onClose: () => void;
  onSave: (test: Partial<TestScenario>) => void;
}

export const TestModal: React.FC<TestModalProps> = ({ test, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    modulo: '',
    cenario: '',
    esperado: '',
    android: 'Não Iniciado' as StatusType,
    ios: 'Não Iniciado' as StatusType,
    versao: 'v2.5.0',
    perfil: '',
    tabelaVenda: '',
    observacoes: ''
  });

  useEffect(() => {
    if (test) {
      setFormData({
        modulo: test.modulo,
        cenario: test.cenario,
        esperado: test.esperado,
        android: test.android,
        ios: test.ios,
        versao: test.versao,
        perfil: test.perfil || '',
        tabelaVenda: test.tabelaVenda || '',
        observacoes: test.observacoes || ''
      });
    }
  }, [test]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-gray-800">
            {test ? 'Editar Caso de Teste' : 'Novo Caso de Teste'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Módulo / Feature *</label>
              <input
                type="text"
                value={formData.modulo}
                onChange={(e) => handleChange('modulo', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BC8F2E]"
                placeholder="Ex: 1. Login"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Versão *</label>
              <input
                type="text"
                value={formData.versao}
                onChange={(e) => handleChange('versao', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BC8F2E]"
                placeholder="Ex: v2.5.0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Cenário de Teste *</label>
            <input
              type="text"
              value={formData.cenario}
              onChange={(e) => handleChange('cenario', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BC8F2E]"
              placeholder="Descreva o cenário de teste"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Resultado Esperado *</label>
            <textarea
              value={formData.esperado}
              onChange={(e) => handleChange('esperado', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BC8F2E]"
              placeholder="O que deve acontecer quando o teste passar"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Status Android *</label>
              <select
                value={formData.android}
                onChange={(e) => handleChange('android', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BC8F2E]"
              >
                <option value="Não Iniciado">Não Iniciado</option>
                <option value="Pass">Pass</option>
                <option value="Falha">Falha</option>
                <option value="Bloqueado">Bloqueado</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Status iOS *</label>
              <select
                value={formData.ios}
                onChange={(e) => handleChange('ios', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BC8F2E]"
              >
                <option value="Não Iniciado">Não Iniciado</option>
                <option value="Pass">Pass</option>
                <option value="Falha">Falha</option>
                <option value="Bloqueado">Bloqueado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Perfil</label>
              <input
                type="text"
                value={formData.perfil}
                onChange={(e) => handleChange('perfil', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BC8F2E]"
                placeholder="Ex: Vendedor, Gerente"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Tabela de Venda</label>
              <input
                type="text"
                value={formData.tabelaVenda}
                onChange={(e) => handleChange('tabelaVenda', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BC8F2E]"
                placeholder="Ex: Tabela A, Tabela B"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Observações</label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BC8F2E]"
              placeholder="Notas adicionais sobre o teste"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
