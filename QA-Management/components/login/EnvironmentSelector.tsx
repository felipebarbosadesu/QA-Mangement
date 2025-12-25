import React, { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';

interface EnvironmentSelectorProps {
  value: string;
  onChange: (value: string) => void;
  savedEnvironments: string[];
  onAddEnvironment: (envName: string) => boolean;
  isQALead: boolean;
}

export const EnvironmentSelector: React.FC<EnvironmentSelectorProps> = ({
  value,
  onChange,
  savedEnvironments,
  onAddEnvironment,
  isQALead,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newEnvName, setNewEnvName] = useState('');

  const handleAdd = () => {
    if (onAddEnvironment(newEnvName)) {
      onChange(newEnvName.trim());
      setNewEnvName('');
      setIsAddingNew(false);
    }
  };

  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
        Ambiente {!isQALead && <span className="text-[8px] text-gray-400">(definido pelo QA Lead)</span>}
      </label>

      {isAddingNew && isQALead ? (
        <div className="flex gap-1">
          <input
            type="text"
            value={newEnvName}
            onChange={(e) => setNewEnvName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
            placeholder="Nome do ambiente"
            className="flex-1 p-2 border border-[#BC8F2E] rounded text-xs focus:ring-1 focus:ring-[#BC8F2E] outline-none"
            autoFocus
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-2 bg-[#BC8F2E] text-white rounded hover:bg-[#a37a25] transition"
            title="Adicionar"
          >
            <Save size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAddingNew(false);
              setNewEnvName('');
            }}
            className="px-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            title="Cancelar"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={!isQALead}
            className={`w-full p-2.5 border border-gray-300 rounded bg-white text-sm outline-none ${
              !isQALead ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
            }`}
          >
            {savedEnvironments.map((env) => (
              <option key={env} value={env}>
                {env}
              </option>
            ))}
          </select>
          {isQALead && (
            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="absolute right-2 top-2 text-[#BC8F2E] hover:text-[#a37a25]"
              title="Adicionar novo ambiente"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
