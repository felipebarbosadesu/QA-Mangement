import React from 'react';
import { Button } from '../../components/common/Button';
import { Save } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-800 mb-4">Configurações Gerais</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Versão Atual</label>
            <input
              type="text"
              defaultValue="v2.5.0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BC8F2E]"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Jira Project Key</label>
            <input
              type="text"
              defaultValue="APVEND"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BC8F2E]"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Webhook Slack</label>
            <input
              type="text"
              placeholder="https://hooks.slack.com/services/..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BC8F2E]"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoSync"
              defaultChecked
              className="w-4 h-4 text-[#BC8F2E] focus:ring-[#BC8F2E]"
            />
            <label htmlFor="autoSync" className="text-gray-700">
              Sincronização automática com Jira a cada 5 minutos
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="notifications"
              defaultChecked
              className="w-4 h-4 text-[#BC8F2E] focus:ring-[#BC8F2E]"
            />
            <label htmlFor="notifications" className="text-gray-700">
              Notificações no Slack para mudanças de status
            </label>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-800 mb-4">Gestão de Dados</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p className="text-gray-800">Backup dos Dados</p>
              <p className="text-gray-600">Exportar todos os testes e configurações</p>
            </div>
            <Button variant="secondary">Fazer Backup</Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div>
              <p className="text-gray-800">Importar Dados</p>
              <p className="text-gray-600">Restaurar backup ou importar novos testes</p>
            </div>
            <Button variant="secondary">Importar</Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <p className="text-gray-800">Limpar Cache</p>
              <p className="text-gray-600">Remover dados temporários e cache local</p>
            </div>
            <Button variant="secondary">Limpar</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
