import React, { useState } from 'react';
import { TestScenario, StatusType } from '../types';
import { TestsTable } from '../../components/tests/TestsTable';
import { TestModal } from '../../components/tests/TestModal';
import { ImportModal } from '../../components/tests/ImportModal';
import { Button } from '../../components/common/Button';
import { Plus, Download, Upload } from 'lucide-react';

interface TestsProps {
  tests: TestScenario[];
  onUpdateTest: (testId: string, platform: 'android' | 'ios', status: StatusType) => void;
  onCreateTest: (test: Partial<TestScenario>) => void;
  onEditTest: (testId: string, updates: Partial<TestScenario>) => void;
  onDeleteTest: (testId: string) => void;
}

export const Tests: React.FC<TestsProps> = ({ 
  tests, 
  onUpdateTest, 
  onCreateTest, 
  onEditTest,
  onDeleteTest 
}) => {
  const [filterModule, setFilterModule] = useState<string>('all');
  const [filterVersion, setFilterVersion] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<TestScenario | undefined>(undefined);

  const modules = Array.from(new Set(tests.map(t => t.modulo)));
  const versions = Array.from(new Set(tests.map(t => t.versao)));

  const filteredTests = tests.filter(test => {
    if (filterModule !== 'all' && test.modulo !== filterModule) return false;
    if (filterVersion !== 'all' && test.versao !== filterVersion) return false;
    if (filterStatus !== 'all') {
      const hasStatus = test.android === filterStatus || test.ios === filterStatus;
      if (!hasStatus) return false;
    }
    return true;
  });

  const handleExport = () => {
    const csv = [
      ['ID', 'Módulo', 'Cenário', 'Esperado', 'Android', 'iOS', 'Versão', 'Perfil', 'Tabela de Venda', 'Observações'].join(','),
      ...filteredTests.map(test => [
        test.id,
        test.modulo,
        `"${test.cenario}"`,
        `"${test.esperado}"`,
        test.android,
        test.ios,
        test.versao,
        test.perfil || '',
        test.tabelaVenda || '',
        test.observacoes ? `"${test.observacoes}"` : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `testes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleSaveTest = (testData: Partial<TestScenario>) => {
    if (editingTest) {
      onEditTest(editingTest.id, testData);
    } else {
      onCreateTest(testData);
    }
    setEditingTest(undefined);
  };

  const handleEditClick = (test: TestScenario) => {
    setEditingTest(test);
    setIsModalOpen(true);
  };

  const handleNewTest = () => {
    setEditingTest(undefined);
    setIsModalOpen(true);
  };

  const handleImport = (file: File) => {
    // Mock implementation - in production, parse CSV/Excel here
    console.log('Importing file:', file.name);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BC8F2E]"
          >
            <option value="all">Todos os Módulos</option>
            {modules.map(module => (
              <option key={module} value={module}>{module}</option>
            ))}
          </select>
          
          <select
            value={filterVersion}
            onChange={(e) => setFilterVersion(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BC8F2E]"
          >
            <option value="all">Todas as Versões</option>
            {versions.map(version => (
              <option key={version} value={version}>{version}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BC8F2E]"
          >
            <option value="all">Todos os Status</option>
            <option value="Pass">Pass</option>
            <option value="Falha">Falha</option>
            <option value="Bloqueado">Bloqueado</option>
            <option value="Não Iniciado">Não Iniciado</option>
          </select>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleExport} className="flex-1">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="secondary" onClick={() => setIsImportOpen(true)} className="flex-1">
              <Upload className="w-4 h-4" />
            </Button>
            <Button onClick={handleNewTest} className="flex-1">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="text-gray-700">
          Exibindo <span className="text-[#BC8F2E]">{filteredTests.length}</span> de {tests.length} testes
        </p>
      </div>

      <TestsTable 
        tests={filteredTests} 
        onUpdateTest={onUpdateTest}
        onEditTest={handleEditClick}
        onDeleteTest={onDeleteTest}
      />

      <TestModal
        test={editingTest}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTest(undefined);
        }}
        onSave={handleSaveTest}
      />

      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
};