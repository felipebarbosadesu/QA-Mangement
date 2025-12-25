import React from 'react';
import { Users } from 'lucide-react';

interface AssigneeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  savedUsers: string[];
  disabled?: boolean;
}

export const AssigneeSelector: React.FC<AssigneeSelectorProps> = ({
  value,
  onChange,
  savedUsers,
  disabled = false,
}) => {
  return (
    <div className="relative group">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full text-xs py-1.5 px-2 pr-6 rounded border border-gray-300 bg-white appearance-none focus:ring-1 focus:ring-[#BC8F2E] outline-none ${
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:border-[#BC8F2E]'
        } ${value ? 'text-gray-800 font-medium' : 'text-gray-400'}`}
      >
        <option value="">Não atribuído</option>
        {savedUsers.map((user, idx) => (
          <option key={idx} value={user}>
            {user}
          </option>
        ))}
      </select>
      <Users className="absolute right-2 top-1.5 w-3 h-3 text-gray-400 pointer-events-none" />
    </div>
  );
};
