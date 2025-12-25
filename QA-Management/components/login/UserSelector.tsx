import React, { useState } from 'react';
import { User } from 'lucide-react';

interface UserSelectorProps {
  value: string;
  onChange: (value: string) => void;
  savedUsers: string[];
}

export const UserSelector: React.FC<UserSelectorProps> = ({ value, onChange, savedUsers }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const selectUser = (userName: string) => {
    onChange(userName);
    setShowDropdown(false);
  };

  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
        Quem é você?
      </label>
      <div className="relative">
        <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => savedUsers.length > 0 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className="pl-9 w-full p-2.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-[#BC8F2E] outline-none"
          placeholder="Nome Sobrenome"
        />

        {/* Dropdown de usuários salvos */}
        {showDropdown && savedUsers.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-40 overflow-y-auto">
            <div className="p-2 bg-gray-50 border-b border-gray-200">
              <p className="text-[9px] text-gray-500 uppercase font-bold">
                Usuários Salvos ({savedUsers.length})
              </p>
            </div>
            {savedUsers.map((user, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectUser(user)}
                className="w-full text-left px-3 py-2 hover:bg-[#BC8F2E] hover:text-white text-sm transition-colors flex items-center gap-2"
              >
                <User size={14} />
                {user}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
