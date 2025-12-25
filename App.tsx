import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, CheckCircle2, XCircle, Ban, 
  PieChart, Bug, 
  User, LogOut, Users, Server, GitBranch, X, 
  FileText, ExternalLink, Save, PlayCircle, Plus, 
  Trash2, Upload, Lock, Activity, 
  AlertCircle, ChevronRight, LogOut as LogOutIcon,
  Monitor, TrendingUp, ChevronDown, 
  Tv, Download, Edit
} from 'lucide-react';
import { LoginScreenStyled } from './components/login/LoginScreenStyled';
import { AssigneeSelector } from './components/tests/AssigneeSelector';
import { useSavedUsers } from './hooks/usePersistedData';

// --- TYPES ---
type StatusType = 'Pass' | 'Falha' | 'Skipped' | 'Bloqueado' | 'Não Disponível' | 'Não Iniciado';
type RoleType = 'QA Lead' | 'Tester' | 'Viewer';

interface TestCase {
  id: string;
  grupo: string;
  modulo: string;  
  cenario: string;
  resultado_esperado: string;
  status_android: StatusType;
  status_ios: StatusType;
  tester_android: string; 
  tester_ios: string;     
  data_execucao: string;
  versao_executada: string; 
  ambiente_executado: string; 
  jira_obs: string;
  assigned_to?: string; 
  is_locked?: boolean;
}

interface VersionData {
    name: string;
    status: 'active' | 'archived';
    createdAt: string;
    testCases: TestCase[];
    environment: 'QA' | 'Beta';
}

interface UserSession {
  name: string;
  team: string; 
  environment: string; 
  appVersion: string;
  role: RoleType;
  lastSeen?: number;
}

const COLORS = {
  marigold: '#BC8F2E',
  mineShaft: '#333333',
  white: '#FFFFFF',
  bgLight: '#F5F5F5',
  success: '#10B981',
  error: '#EF4444'
};

const JIRA_BOARD_URL = "https://qualitydigital.atlassian.net/jira/software/c/projects/FSEA/boards/1591";

// Template base para novos testes
const TEMPLATE_DB: TestCase[] = [
  { id: "CT-001", grupo: "Geral", modulo: "Performance", cenario: "Performance: Validar tempo de carregamento inicial do app (< 5s).", resultado_esperado: "Tela inicial carregada em tempo aceitável.", status_android: "Não Iniciado", status_ios: "Não Iniciado", tester_android: "", tester_ios: "", data_execucao: "", versao_executada: "", ambiente_executado: "", jira_obs: "" },
  { id: "CT-002", grupo: "Geral", modulo: "Performance", cenario: "Performance: Carregamento máximo das telas críticas (PLP).", resultado_esperado: "PLP carrega em tempo aceitável (< 5s).", status_android: "Não Iniciado", status_ios: "Não Iniciado", tester_android: "", tester_ios: "", data_execucao: "", versao_executada: "", ambiente_executado: "", jira_obs: "" },
  { id: "CT-003", grupo: "Cadastro", modulo: "Cadastro Usuário", cenario: "Cadastro o cliente com CEP generico", resultado_esperado: "Usuário logado e vínculado a uma organização", status_android: "Não Iniciado", status_ios: "Não Iniciado", tester_android: "", tester_ios: "", data_execucao: "", versao_executada: "", ambiente_executado: "", jira_obs: "" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pass': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Falha': return 'bg-red-100 text-red-800 border-red-200 font-bold';
    case 'Bloqueado': return 'bg-slate-800 text-white border-slate-700';
    case 'Skipped': return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'Não Disponível': return 'bg-gray-100 text-gray-500 border-gray-200 italic';
    case 'Não Iniciado': return 'bg-white text-gray-400 border-gray-200 dashed border';
    default: return 'bg-white text-gray-500 border-gray-200';
  }
};

// --- LOGIN SCREEN ---
// Movido para /components/login/LoginScreenStyled.tsx (com cores dinâmicas por perfil e ambiente)

// --- KPI DASHBOARD ---
const KPIDashboard = ({ testCases, previousRate }: { testCases: TestCase[], previousRate?: number }) => {
    const stats = useMemo(() => {
      const total = testCases.length * 2; 
      const passed = testCases.reduce((acc, t) => acc + (t.status_android === 'Pass' ? 1 : 0) + (t.status_ios === 'Pass' ? 1 : 0), 0);
      const failed = testCases.reduce((acc, t) => acc + (t.status_android === 'Falha' ? 1 : 0) + (t.status_ios === 'Falha' ? 1 : 0), 0);
      const blocked = testCases.reduce((acc, t) => acc + (t.status_android === 'Bloqueado' ? 1 : 0) + (t.status_ios === 'Bloqueado' ? 1 : 0), 0);
      const rate = total > 0 ? Math.round((passed / total) * 100) : 0;
      return { total, passed, failed, blocked, rate };
    }, [testCases]);

    const diff = previousRate !== undefined ? stats.rate - previousRate : 0;
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between overflow-hidden relative">
             <div className="flex justify-between items-start z-10">
                <div>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Qualidade da Versão</p>
                    <h3 className="text-3xl font-black text-blue-600 mt-1">{stats.rate}%</h3>
                </div>
                <PieChart className="text-blue-100 w-10 h-10" />
            </div>
            {previousRate !== undefined && (
                <div className={`text-xs font-bold mt-2 flex items-center gap-1 z-10 ${diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {diff >= 0 ? <TrendingUp size={12}/> : <TrendingUp size={12} className="rotate-180"/>}
                    {diff > 0 ? '+' : ''}{diff}% vs anterior ({previousRate}%)
                </div>
            )}
        </div>
        
        <StatCard title="Impedimentos" value={stats.blocked} color="text-[#333333]" icon={Ban} />
        <StatCard title="Falhas" value={stats.failed} color="text-red-600" icon={Bug} />
        <StatCard title="Sucesso" value={stats.passed} color="text-[#BC8F2E]" icon={CheckCircle2} />
      </div>
    );
};

const StatCard = ({ title, value, color, icon: Icon }: any) => (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">{title}</p>
        <h3 className={`text-2xl font-black ${color}`}>{value}</h3>
      </div>
      <div className={`p-3 rounded-lg opacity-10 ${color.replace('text-', 'bg-')}`}><Icon className={`w-6 h-6 ${color}`} /></div>
    </div>
);

// --- IMPORT MODAL ---
const ImportModal = ({ isOpen, onClose, onImport }: any) => {
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleImport = () => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      
      // Skip header
      const dataLines = lines.slice(1);
      const imported: TestCase[] = [];
      
      dataLines.forEach(line => {
        const [id, grupo, modulo, cenario, esperado, android, ios, obs] = line.split(',').map(s => s.trim());
        if (id && cenario) {
          imported.push({
            id,
            grupo: grupo || 'Importado',
            modulo: modulo || 'Sem módulo',
            cenario,
            resultado_esperado: esperado || '',
            status_android: (android as StatusType) || 'Não Iniciado',
            status_ios: (ios as StatusType) || 'Não Iniciado',
            tester_android: '',
            tester_ios: '',
            data_execucao: '',
            versao_executada: '',
            ambiente_executado: '',
            jira_obs: obs || ''
          });
        }
      });
      
      onImport(imported);
      setFile(null);
      onClose();
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Importar Testes (CSV/TXT)</h3>
          <button onClick={onClose}><X size={20}/></button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Selecione o arquivo:</label>
            <input type="file" accept=".csv,.txt" onChange={handleFileChange} className="w-full border p-2 rounded" />
          </div>
          
          <div className="bg-blue-50 p-3 rounded text-xs">
            <p className="font-bold mb-1">Formato esperado (CSV):</p>
            <code className="text-xs">ID,Grupo,Modulo,Cenario,Esperado,Android,iOS,Obs</code>
          </div>

          {file && <p className="text-sm text-green-600">✓ {file.name}</p>}
          
          <div className="flex gap-2">
            <button onClick={handleImport} disabled={!file} className="flex-1 bg-[#BC8F2E] text-white py-2 rounded font-bold disabled:opacity-50">
              Importar
            </button>
            <button onClick={onClose} className="flex-1 bg-gray-200 py-2 rounded">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ADD TEST MODAL ---
const AddTestModal = ({ isOpen, onClose, onAdd, nextId }: any) => {
  const [formData, setFormData] = useState({
    grupo: '',
    modulo: '',
    cenario: '',
    resultado_esperado: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: nextId,
      status_android: 'Não Iniciado',
      status_ios: 'Não Iniciado',
      tester_android: '',
      tester_ios: '',
      data_execucao: '',
      versao_executada: '',
      ambiente_executado: '',
      jira_obs: ''
    });
    setFormData({ grupo: '', modulo: '', cenario: '', resultado_esperado: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">Adicionar Novo Caso de Teste</h3>
          <button onClick={onClose}><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Grupo *</label>
              <input required value={formData.grupo} onChange={e => setFormData({...formData, grupo: e.target.value})} className="w-full border p-2 rounded" placeholder="Ex: Geral, Cadastro..." />
            </div>
            <div>
              <label className="block text-sm mb-1">Módulo *</label>
              <input required value={formData.modulo} onChange={e => setFormData({...formData, modulo: e.target.value})} className="w-full border p-2 rounded" placeholder="Ex: Performance, Login..." />
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-1">Cenário de Teste *</label>
            <textarea required value={formData.cenario} onChange={e => setFormData({...formData, cenario: e.target.value})} className="w-full border p-2 rounded" rows={3} placeholder="Descreva o cenário..." />
          </div>
          
          <div>
            <label className="block text-sm mb-1">Resultado Esperado *</label>
            <textarea required value={formData.resultado_esperado} onChange={e => setFormData({...formData, resultado_esperado: e.target.value})} className="w-full border p-2 rounded" rows={2} placeholder="O que deve acontecer..." />
          </div>
          
          <div className="flex gap-2 pt-4">
            <button type="submit" className="flex-1 bg-[#BC8F2E] text-white py-2 rounded font-bold">Adicionar</button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 py-2 rounded">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- VERSIONS MANAGEMENT MODAL ---
const VersionsModal = ({ isOpen, onClose, versions, currentVersion, onDelete }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-xl">Gerenciar Versões</h3>
            <p className="text-sm text-gray-500 mt-1">Total: {versions.length} versões no sistema</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24}/>
          </button>
        </div>
        
        <div className="space-y-3">
          {versions.map((version: VersionData) => {
            const isCurrentVersion = version.name === currentVersion;
            const totalTests = version.testCases.length * 2;
            const passedTests = version.testCases.reduce((acc, t) => 
              acc + (t.status_android === 'Pass' ? 1 : 0) + (t.status_ios === 'Pass' ? 1 : 0), 0
            );
            const qualityRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

            return (
              <div 
                key={version.name} 
                className={`p-4 rounded-lg border-2 ${isCurrentVersion ? 'border-[#BC8F2E] bg-[#BC8F2E]/5' : 'border-gray-200 bg-gray-50'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <GitBranch className="text-[#BC8F2E]" size={18}/>
                        <span className="font-black text-lg">{version.name}</span>
                        {isCurrentVersion && (
                          <span className="bg-[#BC8F2E] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                            EM USO
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Server size={12}/>
                          {version.environment || 'QA'}
                        </span>
                        <span>•</span>
                        <span>{version.testCases.length} casos de teste</span>
                        <span>•</span>
                        <span>Criada em {new Date(version.createdAt).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-2xl font-black ${qualityRate >= 80 ? 'text-green-600' : qualityRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {qualityRate}%
                      </div>
                      <div className="text-xs text-gray-500">qualidade</div>
                    </div>

                    {!isCurrentVersion && (
                      <button
                        onClick={() => onDelete(version.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-all"
                        title="Excluir versão"
                      >
                        <Trash2 size={18}/>
                      </button>
                    )}
                    {isCurrentVersion && (
                      <div className="w-10 h-10 flex items-center justify-center">
                        <Lock className="text-gray-300" size={18}/>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0" size={20}/>
            <div className="text-sm text-blue-800">
              <p className="font-bold mb-1">Atenção:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Você não pode excluir a versão que está atualmente em uso</li>
                <li>É necessário manter pelo menos uma versão no sistema</li>
                <li>A exclusão de uma versão é <strong>irreversível</strong> e remove todos os testes associados</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 rounded-lg font-bold hover:bg-gray-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

// --- TEST TABLE ---
const TestTable = ({ testCases, updateTestCase, currentUser, onAssign, onDelete, readOnly, savedUsers = [] }: any) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead>
            <tr className="bg-gray-50/80">
              <th className="px-4 py-3 text-left w-10">#</th>
              <th className="px-4 py-3 text-left w-20 text-gray-500 font-semibold">ID</th>
              <th className="px-4 py-3 text-left w-32 text-gray-500 font-semibold">Módulo</th>
              <th className="px-4 py-3 text-left min-w-[280px] text-gray-500 font-semibold">Cenário</th>
              <th className="px-4 py-3 text-center w-24 text-gray-500 font-semibold">Resp.</th>
              <th className="px-4 py-3 text-center w-36 text-gray-500 font-semibold">Android</th>
              <th className="px-4 py-3 text-center w-24 text-gray-500 font-semibold text-[10px]">Exec. And.</th>
              <th className="px-4 py-3 text-center w-36 text-gray-500 font-semibold">iOS</th>
              <th className="px-4 py-3 text-center w-24 text-gray-500 font-semibold text-[10px]">Exec. iOS</th>
              <th className="px-4 py-3 text-left w-40 text-gray-500 font-semibold">Obs/Jira</th>
              {currentUser.role === 'QA Lead' && <th className="px-4 py-3 text-center w-16 text-gray-500 font-semibold">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {testCases.map((tc: TestCase) => {
              const isAssignedToMe = tc.assigned_to === currentUser.name;
              const isLockedByOther = tc.assigned_to && !isAssignedToMe;

              return (
              <tr key={tc.id} className={`hover:bg-[#BC8F2E]/5 transition-colors group ${isLockedByOther ? 'opacity-60 bg-gray-50' : ''}`}>
                <td className="px-4 py-2 text-center">
                    {!readOnly && (
                        isLockedByOther ? <Lock className="w-3 h-3 text-red-400" /> : 
                        isAssignedToMe ? <div className="w-2 h-2 rounded-full bg-green-500 mx-auto"></div> :
                        <button onClick={() => onAssign(tc.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#BC8F2E]"><PlayCircle className="w-4 h-4" /></button>
                    )}
                </td>
                <td className="px-4 py-2 font-mono text-xs font-medium text-gray-400">{tc.id}</td>
                <td className="px-4 py-2 text-xs font-bold text-gray-600">{tc.grupo}</td>
                <td className="px-4 py-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-800 font-medium">{tc.cenario}</span>
                    <span className="text-[10px] text-gray-400 italic">{tc.resultado_esperado}</span>
                  </div>
                </td>

                <td className="px-4 py-2">
                    {/* QA Lead pode delegar responsáveis */}
                    {currentUser.role === 'QA Lead' && !readOnly ? (
                      <AssigneeSelector
                        value={tc.assigned_to || ''}
                        onChange={(newAssignee) => updateTestCase(tc.id, 'assigned_to', newAssignee)}
                        savedUsers={savedUsers}
                        disabled={false}
                      />
                    ) : (
                      // Outros perfis apenas visualizam
                      <div className="text-center">
                        {tc.assigned_to ? (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isAssignedToMe ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                {tc.assigned_to.split(' ')[0]}
                            </span>
                        ) : <span className="text-xs text-gray-300">-</span>}
                      </div>
                    )}
                </td>
                
                <td className="px-2 py-2 border-l border-r border-gray-50 bg-gray-50/30">
                  <select
                    disabled={readOnly || isLockedByOther}
                    value={tc.status_android}
                    onChange={(e) => updateTestCase(tc.id, 'status_android', e.target.value)}
                    className={`w-full text-xs py-1 px-2 rounded border appearance-none text-center cursor-pointer font-bold focus:ring-1 focus:ring-[#BC8F2E] outline-none ${getStatusColor(tc.status_android)} ${readOnly ? 'opacity-80' : ''}`}
                  >
                    <option value="Não Iniciado">Pendente</option>
                    <option value="Pass">Pass</option>
                    <option value="Falha">Falha</option>
                    <option value="Bloqueado">Bloqueado</option>
                    <option value="Skipped">Skipped</option>
                    <option value="Não Disponível">N/A</option>
                  </select>
                </td>

                <td className="px-2 py-2 border-r border-gray-50 bg-gray-50/30">
                  {/* Executor Android - QA Lead pode editar */}
                  {currentUser.role === 'QA Lead' && !readOnly ? (
                    <AssigneeSelector
                      value={tc.tester_android || ''}
                      onChange={(newTester) => updateTestCase(tc.id, 'tester_android', newTester)}
                      savedUsers={savedUsers}
                      disabled={false}
                    />
                  ) : (
                    <div className="text-center text-[10px]">
                      {tc.tester_android ? (
                        <span className="text-gray-600">{tc.tester_android.split(' ')[0]}</span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </div>
                  )}
                </td>

                <td className="px-2 py-2 border-r border-gray-50 bg-gray-50/30">
                  <select
                    disabled={readOnly || isLockedByOther}
                    value={tc.status_ios}
                    onChange={(e) => updateTestCase(tc.id, 'status_ios', e.target.value)}
                    className={`w-full text-xs py-1 px-2 rounded border appearance-none text-center cursor-pointer font-bold focus:ring-1 focus:ring-[#BC8F2E] outline-none ${getStatusColor(tc.status_ios)} ${readOnly ? 'opacity-80' : ''}`}
                  >
                    <option value="Não Iniciado">Pendente</option>
                    <option value="Pass">Pass</option>
                    <option value="Falha">Falha</option>
                    <option value="Bloqueado">Bloqueado</option>
                    <option value="Skipped">Skipped</option>
                    <option value="Não Disponível">N/A</option>
                  </select>
                </td>

                <td className="px-2 py-2 border-r border-gray-50 bg-gray-50/30">
                  {/* Executor iOS - QA Lead pode editar */}
                  {currentUser.role === 'QA Lead' && !readOnly ? (
                    <AssigneeSelector
                      value={tc.tester_ios || ''}
                      onChange={(newTester) => updateTestCase(tc.id, 'tester_ios', newTester)}
                      savedUsers={savedUsers}
                      disabled={false}
                    />
                  ) : (
                    <div className="text-center text-[10px]">
                      {tc.tester_ios ? (
                        <span className="text-gray-600">{tc.tester_ios.split(' ')[0]}</span>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </div>
                  )}
                </td>

                <td className="px-4 py-2">
                  {readOnly ? (
                      <span className="text-xs text-gray-500 block truncate w-32">{tc.jira_obs || '-'}</span>
                  ) : (
                      <input 
                        disabled={isLockedByOther}
                        value={tc.jira_obs}
                        onChange={(e) => updateTestCase(tc.id, 'jira_obs', e.target.value)}
                        placeholder="Link Jira / Obs..."
                        className="w-full text-xs bg-transparent border-b border-dashed border-gray-300 focus:border-[#BC8F2E] focus:outline-none"
                      />
                  )}
                </td>

                {currentUser.role === 'QA Lead' && (
                  <td className="px-4 py-2 text-center">
                    <button 
                      onClick={() => onDelete(tc.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-all"
                      title="Excluir teste"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
  const [allVersionsData, setAllVersionsData] = useState<VersionData[]>([]);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<UserSession[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVersionsModal, setShowVersionsModal] = useState(false);
  
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteVersionConfirm, setDeleteVersionConfirm] = useState<string | null>(null);
  
  // Hook para carregar usuários salvos (para delegação)
  const { savedUsers } = useSavedUsers();
  
  const currentVersionData = useMemo(() => {
      if (!currentUser) return null;
      return allVersionsData.find(v => v.name === currentUser.appVersion);
  }, [allVersionsData, currentUser]);

  const previousVersionRate = useMemo(() => {
      if (!allVersionsData || allVersionsData.length < 2) return undefined;
      const prev = allVersionsData[allVersionsData.length - 2];
      if (!prev) return undefined;
      
      const total = prev.testCases.length * 2;
      const passed = prev.testCases.reduce((acc, t) => acc + (t.status_android === 'Pass' ? 1 : 0) + (t.status_ios === 'Pass' ? 1 : 0), 0);
      return total > 0 ? Math.round((passed / total) * 100) : 0;
  }, [allVersionsData]);

  // Init
  useEffect(() => {
    const saved = localStorage.getItem('qa_manager_db_v5');
    if (saved) {
        setAllVersionsData(JSON.parse(saved));
    } else {
        const seed: VersionData[] = [{
            name: 'v2.5.0',
            status: 'active',
            createdAt: new Date().toISOString(),
            testCases: JSON.parse(JSON.stringify(TEMPLATE_DB)),
            environment: 'QA' // Ambiente padrão
        }];
        setAllVersionsData(seed);
    }
    
    // Online users (mock)
    const savedUsers = localStorage.getItem('qa_manager_online');
    if (savedUsers) setOnlineUsers(JSON.parse(savedUsers));
  }, []);

  // Persistence
  useEffect(() => {
    if (allVersionsData.length > 0) {
        localStorage.setItem('qa_manager_db_v5', JSON.stringify(allVersionsData));
    }
  }, [allVersionsData]);

  // Online tracking
  useEffect(() => {
    if (currentUser) {
      const updateOnline = () => {
        const updated = { ...currentUser, lastSeen: Date.now() };
        
        setOnlineUsers(prev => {
          const others = prev.filter(u => u.name !== currentUser.name && Date.now() - (u.lastSeen || 0) < 60000);
          const newList = [...others, updated];
          localStorage.setItem('qa_manager_online', JSON.stringify(newList));
          return newList;
        });
      };
      
      const interval = setInterval(updateOnline, 30000);
      updateOnline();
      return () => clearInterval(interval);
    }
  }, [currentUser?.name]); // Only depend on name, not the whole object

  const handleLogin = (session: UserSession, isNewVersion?: boolean) => {
    if (isNewVersion) {
        const newVersion: VersionData = {
            name: session.appVersion,
            status: 'active',
            createdAt: new Date().toISOString(),
            testCases: JSON.parse(JSON.stringify(TEMPLATE_DB)),
            environment: session.environment as 'QA' | 'Beta' // Salvar ambiente definido pelo QA Lead
        };
        setAllVersionsData(prev => [...prev, newVersion]);
    } else {
        // Se estiver acessando versão existente como QA Lead, atualizar o ambiente
        if (session.role === 'QA Lead') {
            setAllVersionsData(prev => prev.map(v => 
                v.name === session.appVersion ? { ...v, environment: session.environment as 'QA' | 'Beta' } : v
            ));
        }
    }
    setCurrentUser(session);
  };

  const handleLogout = () => {
    if (currentUser) {
      setOnlineUsers(prev => prev.filter(u => u.name !== currentUser.name));
      localStorage.setItem('qa_manager_online', JSON.stringify(onlineUsers.filter(u => u.name !== currentUser.name)));
    }
    setCurrentUser(null);
  };

  const handleAssignTask = (id: string) => {
      if (!currentUser || !currentVersionData) return;
      
      const updatedTests = currentVersionData.testCases.map(t => {
          if (t.id === id) {
              if (t.assigned_to === currentUser.name) return { ...t, assigned_to: undefined };
              if (t.assigned_to) return t; 
              return { ...t, assigned_to: currentUser.name };
          }
          return t;
      });

      updateVersionData(updatedTests);
  };

  const updateTestCase = (id: string, field: keyof TestCase, value: string) => {
    if (!currentUser || !currentVersionData) return;

    const updatedTests = currentVersionData.testCases.map(tc => {
       if (tc.id === id) {
           const updated = { ...tc, [field]: value };
           if (!updated.assigned_to) updated.assigned_to = currentUser.name;
           
           if ((field === 'status_android' || field === 'status_ios')) {
                if (value !== 'Não Iniciado') {
                    if (field === 'status_android') updated.tester_android = currentUser.name;
                    if (field === 'status_ios') updated.tester_ios = currentUser.name;
                    updated.data_execucao = new Date().toISOString().split('T')[0];
                    updated.versao_executada = currentUser.appVersion;
                    updated.ambiente_executado = currentUser.environment;
                } else {
                    if (field === 'status_android') updated.tester_android = '';
                    if (field === 'status_ios') updated.tester_ios = '';
                }
           }
           return updated;
       }
       return tc;
    });

    updateVersionData(updatedTests);
  };

  const updateVersionData = (newTestCases: TestCase[]) => {
      setAllVersionsData(prev => prev.map(v => 
          v.name === currentUser?.appVersion ? { ...v, testCases: newTestCases } : v
      ));
  };

  const handleImport = (imported: TestCase[]) => {
    if (!currentVersionData) return;
    updateVersionData([...currentVersionData.testCases, ...imported]);
  };

  const handleAddTest = (newTest: TestCase) => {
    if (!currentVersionData) return;
    updateVersionData([...currentVersionData.testCases, newTest]);
  };

  const handleDeleteTest = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (!currentVersionData || !deleteConfirm) return;
    const updatedTests = currentVersionData.testCases.filter(t => t.id !== deleteConfirm);
    updateVersionData(updatedTests);
    setDeleteConfirm(null);
  };

  const handleExport = () => {
    if (!currentVersionData) return;
    const csv = [
      ['ID', 'Grupo', 'Modulo', 'Cenario', 'Resultado Esperado', 'Android', 'iOS', 'Observações'].join(','),
      ...filteredTestCases.map(t => [
        t.id, t.grupo, t.modulo, `"${t.cenario}"`, `"${t.resultado_esperado}"`, 
        t.status_android, t.status_ios, `"${t.jira_obs}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qa-export-${currentUser?.appVersion}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleDeleteVersion = (versionName: string) => {
    setDeleteVersionConfirm(versionName);
  };

  const confirmDeleteVersion = () => {
    if (!deleteVersionConfirm) return;
    setAllVersionsData(prev => prev.filter(v => v.name !== deleteVersionConfirm));
    setDeleteVersionConfirm(null);
  };

  if (!currentUser) return <LoginScreenStyled onLogin={handleLogin} existingVersions={allVersionsData} />;

  const testCases = currentVersionData ? currentVersionData.testCases : [];
  const filteredTestCases = testCases.filter(t => 
      (statusFilter === 'all' || t.status_android === statusFilter || t.status_ios === statusFilter) &&
      (moduleFilter === 'all' || t.modulo === moduleFilter || t.grupo === moduleFilter) &&
      (t.cenario.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const modules = Array.from(new Set(testCases.map(t => t.grupo))).sort();
  const nextId = `CT-${String(testCases.length + 1).padStart(3, '0')}`;

  // VIEWER MODE
  if (currentUser.role === 'Viewer') {
      return (
          <div className="min-h-screen bg-[#1A1A1A] text-white p-8 font-sans overflow-hidden">
               <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                  <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Monitor className="text-[#BC8F2E] animate-pulse" />
                        <h1 className="text-2xl font-black text-[#BC8F2E] tracking-widest uppercase">QA Command Center</h1>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="bg-[#BC8F2E] text-black px-5 py-2.5 rounded-lg font-black text-base flex items-center gap-2 shadow-lg">
                          <GitBranch size={18}/>
                          Versão: {currentUser.appVersion}
                        </div>
                        <div className={`${currentVersionData?.environment === 'Beta' ? 'bg-purple-600' : 'bg-blue-600'} text-white px-5 py-2.5 rounded-lg font-black text-base flex items-center gap-2 shadow-lg`}>
                          <Server size={18}/>
                          Ambiente: {currentVersionData?.environment || 'QA'}
                        </div>
                      </div>
                  </div>
                  <div className="flex items-center gap-4">
                      <span className="text-sm">Olá, <b>{currentUser.name}</b> <span className="text-[#BC8F2E]">({currentUser.role})</span></span>
                      <button onClick={handleLogout} className="bg-gray-800 p-2 rounded hover:bg-gray-700"><X /></button>
                  </div>
              </div>
              <KPIDashboard testCases={testCases} previousRate={previousVersionRate} />
              
              <div className="mt-8 grid grid-cols-2 gap-8 h-[60vh]">
                   <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur">
                       <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white"><Activity className="text-blue-400"/> Atividade Recente</h3>
                       <div className="space-y-2">
                           {testCases.filter(t => t.status_android !== 'Não Iniciado').slice(0,6).map(t => (
                               <div key={t.id} className="flex justify-between text-xs p-3 bg-black/40 rounded border-l-2 border-blue-500">
                                   <span className="text-gray-300">{t.id} - {t.modulo}</span>
                                   <div className="flex gap-2">
                                       <span className={t.status_android === 'Pass' ? 'text-green-400' : 'text-red-400'}>And: {t.status_android}</span>
                                       <span className="text-gray-600">|</span>
                                       <span className="text-gray-500">{t.tester_android}</span>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
                   <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 backdrop-blur">
                       <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-400"><AlertCircle/> Blockers & Falhas</h3>
                       <div className="space-y-2">
                           {testCases.filter(t => t.status_android === 'Falha' || t.status_ios === 'Falha').map(t => (
                               <div key={t.id} className="p-3 bg-red-900/10 border border-red-900/30 rounded text-xs">
                                   <p className="font-bold text-red-300">{t.cenario}</p>
                                   <p className="text-red-500/60 mt-1">Responsável: {t.tester_android || t.tester_ios}</p>
                               </div>
                           ))}
                           {testCases.filter(t => t.status_android === 'Falha' || t.status_ios === 'Falha').length === 0 && <div className="text-center text-gray-600 py-10">Sistema estável. Nenhuma falha crítica.</div>}
                       </div>
                   </div>
              </div>
              <footer className="text-center py-4 text-[8px] text-gray-400 border-t border-gray-700 mt-8">
                © 2026 Quality Hub • Desenvolvido por Felipe Vieira Barbosa
              </footer>
          </div>
      )
  }

  // TESTER / LEAD MODE
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-[#333333] flex">
       <aside className="w-16 bg-[#1A1A1A] text-white flex flex-col items-center py-4 border-r border-gray-800 z-50 shadow-2xl">
          <div className="bg-[#BC8F2E] p-1.5 rounded text-black font-black text-xs mb-8">FS</div>
          <button onClick={() => setCurrentUser({...currentUser, role: 'Viewer'})} className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded mb-2" title="Modo TV"><Tv size={20}/></button>
          <div className="mt-auto">
             <button onClick={handleLogout} className="p-3 text-red-400 hover:bg-red-900/20 rounded"><LogOutIcon size={20}/></button>
          </div>
       </aside>

      <div className="flex-1">
        <header className="sticky top-0 z-30 bg-[#333333] text-white shadow-lg border-b-4 border-[#BC8F2E]">
            <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <div>
                        <h1 className="text-lg font-bold flex items-center gap-2">Painel de Execução</h1>
                        <div className="flex gap-3 text-xs text-gray-400 mt-1">
                            <span className="flex items-center gap-1"><Users size={12}/> {onlineUsers.filter(u => Date.now() - (u.lastSeen || 0) < 60000).length} online</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-[#BC8F2E] text-black px-5 py-2.5 rounded-lg font-black text-base flex items-center gap-2 shadow-lg">
                            <GitBranch size={18}/>
                            {currentUser.appVersion}
                        </div>
                        <div className={`${currentVersionData?.environment === 'Beta' ? 'bg-purple-600' : 'bg-blue-600'} text-white px-5 py-2.5 rounded-lg font-black text-base flex items-center gap-2 shadow-lg`}>
                            <Server size={18}/>
                            {currentVersionData?.environment || 'QA'}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <span className="text-sm">Olá, <b>{currentUser.name}</b> <span className="text-[#BC8F2E]">({currentUser.role})</span></span>
                     <a href={JIRA_BOARD_URL} target="_blank" className="bg-[#0052CC] px-3 py-1.5 rounded text-xs font-bold hover:bg-[#0042A5] flex items-center gap-1">
                        <ExternalLink size={12}/> Jira
                     </a>
                </div>
            </div>
        </header>

        <main className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
            <KPIDashboard testCases={testCases} previousRate={previousVersionRate} />

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                        <input type="text" placeholder="Buscar..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#BC8F2E]" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} className="bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm outline-none">
                        <option value="all">Todos Grupos</option>
                        {modules.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                
                <div className="flex gap-2">
                    {currentUser.role === 'QA Lead' && (
                        <>
                            <button onClick={() => setShowImportModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-blue-700">
                                <Upload size={14}/> Importar
                            </button>
                            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-green-700">
                                <Plus size={14}/> Novo CT
                            </button>
                        </>
                    )}
                    <button onClick={handleExport} className="flex items-center gap-2 bg-[#BC8F2E] text-white px-3 py-2 rounded text-sm font-bold hover:bg-[#a37a25]">
                        <Download size={14}/> Exportar
                    </button>
                </div>
            </div>

            <TestTable 
                testCases={filteredTestCases} 
                updateTestCase={updateTestCase} 
                currentUser={currentUser} 
                onAssign={handleAssignTask}
                onDelete={handleDeleteTest}
                readOnly={false}
                savedUsers={savedUsers}
            />
        </main>
      </div>
      
      <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} onImport={handleImport} />
      <AddTestModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={handleAddTest} nextId={nextId} />
      <VersionsModal 
        isOpen={showVersionsModal} 
        onClose={() => setShowVersionsModal(false)} 
        versions={allVersionsData}
        currentVersion={currentUser.appVersion}
        onDelete={handleDeleteVersion}
      />
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Confirmar Exclusão</h3>
                <p className="text-sm text-gray-600">Esta ação não pode ser desfeita</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm">
                Você está prestes a excluir o teste <span className="font-bold text-red-600">{deleteConfirm}</span>.
              </p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2.5 rounded font-bold hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <Trash2 size={16} className="flex-shrink-0" />
                <span className="leading-none">Excluir Definitivamente</span>
              </button>
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-200 py-2.5 rounded hover:bg-gray-300 font-bold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Version Confirmation Modal */}
      {deleteVersionConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Excluir Versão?</h3>
                <p className="text-sm text-gray-600">Esta ação não pode ser desfeita</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
              <p className="text-sm text-red-800">
                Você está prestes a excluir a versão <span className="font-bold">{deleteVersionConfirm}</span> e 
                <strong> todos os {allVersionsData.find(v => v.name === deleteVersionConfirm)?.testCases.length || 0} casos de teste</strong> associados a ela.
              </p>
              <p className="text-sm text-red-800 mt-2 font-bold">
                ⚠️ Esta operação é irreversível!
              </p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={confirmDeleteVersion}
                className="flex-1 bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Excluir Versão
              </button>
              <button 
                onClick={() => setDeleteVersionConfirm(null)}
                className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;