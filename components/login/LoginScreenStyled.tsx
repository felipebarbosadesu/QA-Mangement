import React, { useState, useEffect } from 'react';
import { 
  User, Server, GitBranch, Monitor, Plus, PlayCircle, ChevronDown, Save, X, Trash2, UserX, ServerOff 
} from 'lucide-react';
import { UserSelector } from './UserSelector';
import { useSavedUsers, useSavedEnvironments } from '../../hooks/usePersistedData';

type RoleType = 'QA Lead' | 'Tester' | 'Viewer';

interface VersionData {
  name: string;
  status: 'active' | 'archived';
  createdAt: string;
  testCases: any[];
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

interface LoginScreenStyledProps {
  onLogin: (session: UserSession, isNewVersion?: boolean) => void;
  existingVersions: VersionData[];
}

// Cores por perfil
const roleColors = {
  'QA Lead': {
    gradient: 'from-amber-500 to-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    text: 'text-yellow-600',
    button: 'bg-yellow-500 hover:bg-yellow-600',
  },
  'Tester': {
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-400',
    text: 'text-purple-600',
    button: 'bg-purple-500 hover:bg-purple-600',
  },
  'Viewer': {
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    text: 'text-blue-600',
    button: 'bg-blue-500 hover:bg-blue-600',
  }
};

export const LoginScreenStyled: React.FC<LoginScreenStyledProps> = ({ onLogin, existingVersions }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState<RoleType>('Tester');
  const [environment, setEnvironment] = useState('QA');
  const [selectedVersion, setSelectedVersion] = useState('');
  const [newVersion, setNewVersion] = useState('');
  const [isCreatingVersion, setIsCreatingVersion] = useState(false);
  const [isAddingEnvironment, setIsAddingEnvironment] = useState(false);
  const [newEnvironment, setNewEnvironment] = useState('');
  const [showManageUsers, setShowManageUsers] = useState(false);
  const [showManageEnvs, setShowManageEnvs] = useState(false);
  
  const { savedUsers, addUser, deleteUser } = useSavedUsers();
  const { savedEnvironments, addEnvironment, deleteEnvironment } = useSavedEnvironments();

  useEffect(() => {
    if (existingVersions.length > 0 && !selectedVersion) {
      setSelectedVersion(existingVersions[0].name);
      setEnvironment(existingVersions[0].environment || 'QA');
    }
  }, [existingVersions]);

  useEffect(() => {
    if (selectedVersion && role !== 'QA Lead') {
      const version = existingVersions.find(v => v.name === selectedVersion);
      if (version) {
        setEnvironment(version.environment || 'QA');
      }
    }
  }, [selectedVersion, role, existingVersions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const versionToUse = isCreatingVersion ? newVersion : selectedVersion;
    if (!versionToUse) return;

    addUser(name);
    if (environment && !savedEnvironments.includes(environment)) {
      addEnvironment(environment);
    }

    onLogin({ 
      name: name.trim(), 
      team: 'Time Quality', 
      environment, 
      appVersion: versionToUse, 
      role,
      lastSeen: Date.now()
    }, isCreatingVersion);
  };

  const handleAddEnvironment = () => {
    if (newEnvironment.trim() && !savedEnvironments.includes(newEnvironment.trim())) {
      addEnvironment(newEnvironment.trim());
      setEnvironment(newEnvironment.trim());
      setNewEnvironment('');
      setIsAddingEnvironment(false);
    }
  };

  const handleDeleteUser = (userName: string) => {
    if (confirm(`Excluir usuário "${userName}"?`)) {
      deleteUser(userName);
      if (name === userName) setName('');
    }
  };

  const handleDeleteEnvironment = (envName: string) => {
    if (envName === 'QA' || envName === 'Beta') {
      alert('Ambientes QA e Beta não podem ser excluídos (padrões do sistema)');
      return;
    }
    if (confirm(`Excluir ambiente "${envName}"?`)) {
      const success = deleteEnvironment(envName);
      if (success && environment === envName) {
        setEnvironment('QA');
      }
    }
  };

  const currentColors = roleColors[role];

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 font-sans transition-all duration-500 bg-gradient-to-br ${currentColors.gradient}`}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden relative">
        {/* Header decorativo */}
        <div className={`h-2 bg-gradient-to-r ${currentColors.gradient}`}></div>
        
        <div className="p-8">
          {/* Logo e título */}
          <div className="text-center mb-8">
            <div className="inline-flex flex-col items-center">
              <div className="flex items-baseline mb-2">
                <span className="font-black text-[#333333] text-4xl tracking-tighter italic mr-1" style={{fontFamily: 'Arial Black, sans-serif'}}>
                  QA
                </span>
                <span className="font-black text-[#BC8F2E] text-4xl tracking-tighter italic" style={{fontFamily: 'Arial Black, sans-serif'}}>
                  MANAGER
                </span>
              </div>
              <p className="text-[#BC8F2E] font-bold text-xs tracking-[0.3em] uppercase">
                Gestão de Testes & Qualidade
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo de usuário */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase">
                  Usuário
                </label>
                {role === 'QA Lead' && savedUsers.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowManageUsers(!showManageUsers)}
                    className="text-[10px] font-bold text-gray-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <UserX size={12} />
                    Gerenciar
                  </button>
                )}
              </div>
              <UserSelector 
                value={name}
                onChange={setName}
                savedUsers={savedUsers}
              />
              
              {/* Lista de usuários para excluir (QA Lead only) */}
              {role === 'QA Lead' && showManageUsers && savedUsers.length > 0 && (
                <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <p className="text-[9px] text-gray-500 uppercase font-bold mb-2">Usuários Salvos:</p>
                  <div className="space-y-1">
                    {savedUsers.map(user => (
                      <div key={user} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                        <span className="text-xs text-gray-700">{user}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition"
                          title="Excluir usuário"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Seleção de perfil */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">
                Perfil de Acesso
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['QA Lead', 'Tester', 'Viewer'] as RoleType[]).map((roleOption) => {
                  const colors = roleColors[roleOption];
                  const isSelected = role === roleOption;
                  
                  return (
                    <button
                      key={roleOption}
                      type="button"
                      onClick={() => setRole(roleOption)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        isSelected 
                          ? `${colors.bg} ${colors.border} shadow-md` 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`text-xs font-bold ${isSelected ? colors.text : 'text-gray-600'}`}>
                        {roleOption}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid: Ambiente e Versão */}
            <div className="grid grid-cols-2 gap-4">
              {/* Ambiente */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">
                    Ambiente {role !== 'QA Lead' && <span className="text-[8px] text-gray-400 normal-case">(QA Lead)</span>}
                  </label>
                  {role === 'QA Lead' && !isAddingEnvironment && (
                    <div className="flex gap-2">
                      {savedEnvironments.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setShowManageEnvs(!showManageEnvs)}
                          className="text-[10px] font-bold text-gray-500 hover:text-red-600 flex items-center gap-1"
                        >
                          <ServerOff size={10} />
                        </button>
                      )}
                      <button 
                        type="button"
                        onClick={() => setIsAddingEnvironment(true)}
                        className={`text-[10px] font-bold ${currentColors.text} hover:underline flex items-center gap-1`}
                      >
                        + Novo
                      </button>
                    </div>
                  )}
                </div>

                {isAddingEnvironment && role === 'QA Lead' ? (
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={newEnvironment}
                      onChange={(e) => setNewEnvironment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEnvironment())}
                      placeholder="Nome do ambiente"
                      className="flex-1 p-2.5 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddEnvironment}
                      className="px-3 bg-[#BC8F2E] text-white rounded-lg hover:bg-[#a37a25] transition"
                      title="Adicionar"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingEnvironment(false);
                        setNewEnvironment('');
                      }}
                      className="px-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                      title="Cancelar"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <select
                        value={environment}
                        onChange={(e) => setEnvironment(e.target.value)}
                        disabled={role !== 'QA Lead'}
                        className={`w-full p-2.5 border-2 border-gray-300 rounded-lg bg-white text-sm appearance-none outline-none focus:border-gray-400 ${
                          role !== 'QA Lead' ? 'opacity-60 cursor-not-allowed bg-gray-50' : 'cursor-pointer'
                        }`}
                      >
                        {savedEnvironments.map((env) => (
                          <option key={env} value={env}>
                            {env}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-3 text-gray-400 w-4 h-4 pointer-events-none"/>
                    </div>
                    
                    {/* Lista de ambientes para excluir */}
                    {role === 'QA Lead' && showManageEnvs && savedEnvironments.length > 2 && (
                      <div className="mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-[9px] text-gray-500 uppercase font-bold mb-2">Ambientes:</p>
                        <div className="space-y-1">
                          {savedEnvironments.map(env => (
                            <div key={env} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                              <span className="text-xs text-gray-700">{env}</span>
                              {env !== 'QA' && env !== 'Beta' ? (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteEnvironment(env)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition"
                                  title="Excluir ambiente"
                                >
                                  <Trash2 size={14} />
                                </button>
                              ) : (
                                <span className="text-[9px] text-gray-400 italic">Padrão</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Versão */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase">
                    Versão do App
                  </label>
                  {role === 'QA Lead' && (
                    <button 
                      type="button"
                      onClick={() => setIsCreatingVersion(!isCreatingVersion)}
                      className={`text-[10px] font-bold ${currentColors.text} hover:underline flex items-center gap-1`}
                    >
                      {isCreatingVersion ? "← Voltar" : "+ Nova"}
                    </button>
                  )}
                </div>

                {isCreatingVersion && role === 'QA Lead' ? (
                  <div>
                    <input 
                      type="text" 
                      required 
                      value={newVersion} 
                      onChange={(e) => setNewVersion(e.target.value)} 
                      className="w-full p-2.5 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 outline-none"
                      placeholder="Ex: v2.6.0" 
                      autoFocus
                    />
                    <p className="text-[9px] text-gray-500 mt-1">
                      Board limpo será criado
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <select 
                      value={selectedVersion} 
                      onChange={(e) => setSelectedVersion(e.target.value)} 
                      className="w-full p-2.5 border-2 border-gray-300 rounded-lg bg-white text-sm appearance-none outline-none focus:border-gray-400 cursor-pointer"
                      disabled={existingVersions.length === 0}
                    >
                      {existingVersions.length === 0 && <option value="">Nenhuma versão</option>}
                      {existingVersions.map(v => (
                        <option key={v.name} value={v.name}>
                          {v.name} ({v.testCases.length} CTs)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 text-gray-400 w-4 h-4 pointer-events-none"/>
                  </div>
                )}
              </div>
            </div>

            {/* Botão de submit */}
            <button 
              type="submit" 
              className={`w-full ${currentColors.button} text-white font-bold py-3.5 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 text-base`}
            >
              {role === 'Viewer' ? (
                <>
                  <Monitor size={20}/> 
                  Acessar Command Center
                </>
              ) : isCreatingVersion ? (
                <>
                  <Plus size={20}/> 
                  Criar Novo Board
                </>
              ) : (
                <>
                  <PlayCircle size={20}/> 
                  Acessar Painel
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-[9px] text-gray-400">
            © 2026 Desenvolvido por Felipe Vieira Barbosa
          </p>
        </div>
      </div>
    </div>
  );
};
