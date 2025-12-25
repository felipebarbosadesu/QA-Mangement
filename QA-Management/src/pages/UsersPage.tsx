import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Button } from '../../components/common/Button';
import { Plus, UserCheck, UserX, Edit } from 'lucide-react';

interface UsersPageProps {
  users: User[];
  onCreateUser?: (user: Partial<User>) => void;
  onUpdateUser?: (userId: string, updates: Partial<User>) => void;
}

export const UsersPage: React.FC<UsersPageProps> = ({ users, onCreateUser, onUpdateUser }) => {
  const getRoleBadge = (role: UserRole) => {
    const styles = {
      'QA-Admin': 'bg-purple-100 text-purple-700 border-purple-200',
      'QA': 'bg-blue-100 text-blue-700 border-blue-200',
      'Time': 'bg-green-100 text-green-700 border-green-200',
      'Cliente': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return styles[role] || styles['Cliente'];
  };

  const getRoleLabel = (role: UserRole) => {
    const labels = {
      'QA-Admin': 'QA Admin',
      'QA': 'QA Tester',
      'Time': 'Time Dev',
      'Cliente': 'Cliente'
    };
    return labels[role] || role;
  };

  const activeUsers = users.filter(u => u.active).length;
  const adminUsers = users.filter(u => u.role === 'QA-Admin').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Total de Usuários</p>
              <p className="text-gray-800">{users.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 mb-1">Ativos</p>
              <p className="text-green-700">{activeUsers}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg shadow-sm border border-purple-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 mb-1">Administradores</p>
              <p className="text-purple-700">{adminUsers}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-gray-800">Gestão de Usuários</h3>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600">Nome</th>
                <th className="px-6 py-3 text-left text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-gray-600">Perfil</th>
                <th className="px-6 py-3 text-left text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-gray-600">Criado em</th>
                <th className="px-6 py-3 text-left text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#BC8F2E] flex items-center justify-center text-white">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full border ${getRoleBadge(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.active ? (
                      <span className="flex items-center gap-2 text-green-600">
                        <UserCheck className="w-4 h-4" />
                        Ativo
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-gray-400">
                        <UserX className="w-4 h-4" />
                        Inativo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-gray-400 hover:text-[#BC8F2E] hover:bg-[#BC8F2E]/10 rounded-lg transition-colors"
                        title="Editar usuário"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onUpdateUser?.(user.id, { active: !user.active })}
                        className={`p-2 rounded-lg transition-colors ${
                          user.active
                            ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                        }`}
                        title={user.active ? 'Desativar' : 'Ativar'}
                      >
                        {user.active ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-yellow-800 mb-2">⚠️ Atenção</h4>
        <p className="text-yellow-700">
          Apenas usuários com perfil <strong>QA Admin</strong> podem gerenciar outros usuários.
          Clientes têm acesso somente leitura ao sistema.
        </p>
      </div>
    </div>
  );
};
