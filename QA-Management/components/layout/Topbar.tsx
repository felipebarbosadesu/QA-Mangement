import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface TopbarProps {
  projectName: string;
  currentVersion: string;
}

export const Topbar: React.FC<TopbarProps> = ({ projectName, currentVersion }) => {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div>
        <h2 className="text-gray-800">{projectName}</h2>
        <p className="text-gray-600">Versão: {currentVersion}</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-[#BC8F2E] flex items-center justify-center text-white">
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="text-gray-800">{user?.name}</p>
            <p className="text-gray-600">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
