import React, { useState } from 'react';
import { TestScenario, StatusType } from '../../types';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/calculations';
import { ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';

interface TestsTableProps {
  tests: TestScenario[];
  onUpdateTest?: (testId: string, platform: 'android' | 'ios', status: StatusType) => void;
  onEditTest?: (test: TestScenario) => void;
  onDeleteTest?: (testId: string) => void;
}

export const TestsTable: React.FC<TestsTableProps> = ({ tests, onUpdateTest, onEditTest, onDeleteTest }) => {
  const [sortField, setSortField] = useState<keyof TestScenario>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editingCell, setEditingCell] = useState<{ testId: string; platform: 'android' | 'ios' } | null>(null);

  const handleSort = (field: keyof TestScenario) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTests = [...tests].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ field }: { field: keyof TestScenario }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-[#BC8F2E]" /> : 
      <ChevronDown className="w-4 h-4 text-[#BC8F2E]" />;
  };

  const handleStatusChange = (testId: string, platform: 'android' | 'ios', newStatus: StatusType) => {
    if (onUpdateTest) {
      onUpdateTest(testId, platform, newStatus);
    }
    setEditingCell(null);
  };

  const StatusCell = ({ test, platform }: { test: TestScenario; platform: 'android' | 'ios' }) => {
    const isEditing = editingCell?.testId === test.id && editingCell?.platform === platform;
    const status = test[platform];

    if (isEditing) {
      return (
        <select
          value={status}
          onChange={(e) => handleStatusChange(test.id, platform, e.target.value as StatusType)}
          onBlur={() => setEditingCell(null)}
          autoFocus
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="Pass">Pass</option>
          <option value="Falha">Falha</option>
          <option value="Bloqueado">Bloqueado</option>
          <option value="Não Iniciado">Não Iniciado</option>
        </select>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Badge status={status} />
        <button
          onClick={() => setEditingCell({ testId: test.id, platform })}
          className="text-gray-400 hover:text-[#BC8F2E] transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600">
                <button
                  onClick={() => handleSort('id')}
                  className="flex items-center gap-2 hover:text-[#BC8F2E]"
                >
                  ID
                  <SortIcon field="id" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-gray-600">
                <button
                  onClick={() => handleSort('modulo')}
                  className="flex items-center gap-2 hover:text-[#BC8F2E]"
                >
                  Módulo
                  <SortIcon field="modulo" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-gray-600">Cenário</th>
              <th className="px-6 py-3 text-left text-gray-600">Android</th>
              <th className="px-6 py-3 text-left text-gray-600">iOS</th>
              <th className="px-6 py-3 text-left text-gray-600">Versão</th>
              <th className="px-6 py-3 text-left text-gray-600">Perfil</th>
              <th className="px-6 py-3 text-left text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedTests.map((test) => (
              <tr key={test.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-[#BC8F2E]">{test.id}</td>
                <td className="px-6 py-4 text-gray-700">{test.modulo}</td>
                <td className="px-6 py-4 text-gray-700 max-w-xs">
                  <div className="truncate">{test.cenario}</div>
                  {test.observacoes && (
                    <div className="text-gray-500 truncate mt-1">{test.observacoes}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <StatusCell test={test} platform="android" />
                </td>
                <td className="px-6 py-4">
                  <StatusCell test={test} platform="ios" />
                </td>
                <td className="px-6 py-4 text-gray-700">{test.versao}</td>
                <td className="px-6 py-4 text-gray-600">{test.perfil || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {onEditTest && (
                      <button
                        onClick={() => onEditTest(test)}
                        className="p-2 text-gray-400 hover:text-[#BC8F2E] hover:bg-[#BC8F2E]/10 rounded-lg transition-colors"
                        title="Editar teste"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onDeleteTest && (
                      <button
                        onClick={() => onDeleteTest(test.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir teste"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};