import React from 'react';
import { Bug } from '../../types';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface BugsListProps {
  bugs: Bug[];
}

export const BugsList: React.FC<BugsListProps> = ({ bugs }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Aberto';
      case 'in-progress':
        return 'Em Progresso';
      case 'resolved':
        return 'Resolvido';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-gray-800">Bugs Ativos</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {bugs.map((bug) => (
          <div key={bug.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#BC8F2E]">{bug.id}</span>
                  <span className={`px-2.5 py-0.5 rounded-full ${getSeverityColor(bug.severity)}`}>
                    {bug.severity.toUpperCase()}
                  </span>
                </div>
                <h4 className="text-gray-800 mb-2">{bug.title}</h4>
                <div className="flex items-center gap-2 text-gray-600">
                  {getStatusIcon(bug.status)}
                  <span>{getStatusLabel(bug.status)}</span>
                </div>
              </div>
            </div>
            {bug.linkedScenarios.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-gray-600 mb-2">Cenários vinculados:</p>
                <div className="flex flex-wrap gap-2">
                  {bug.linkedScenarios.map((scenarioId) => (
                    <span
                      key={scenarioId}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded"
                    >
                      {scenarioId}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
