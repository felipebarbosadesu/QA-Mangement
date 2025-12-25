import React from 'react';
import { LayoutDashboard, FileCheck, AlertTriangle, Users, Info, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tests', label: 'Casos de Testes', icon: FileCheck },
    { id: 'issues', label: 'Bugs & Melhorias', icon: AlertTriangle },
    { id: 'users', label: 'Usuários', icon: Users, adminOnly: true },
    { id: 'about', label: 'Sobre o Projeto', icon: Info }
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (item.adminOnly) {
      return user?.role === 'QA-Admin';
    }
    return true;
  });

  return (
    <div className="w-64 bg-[#1A1A1A] min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-[#BC8F2E] tracking-wider">QUALITY HUB</h1>
        <p className="text-gray-400 mt-1">App Vendedor</p>
      </div>

      <nav className="flex-1 px-3 py-4">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${
                isActive
                  ? 'bg-[#BC8F2E] text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};
