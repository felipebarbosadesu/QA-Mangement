import React, { useState } from 'react';
import { Issue, IssueType } from '../../types';
import { AlertCircle, CheckCircle, Clock, XCircle, Plus } from 'lucide-react';

interface IssuesTabsProps {
  issues: Issue[];
}

export const IssuesTabs: React.FC<IssuesTabsProps> = ({ issues }) => {
  const [activeTab, setActiveTab] = useState<IssueType>('bug');

  const filteredIssues = issues.filter(issue => issue.type === activeTab);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
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
      case 'closed':
        return <XCircle className="w-5 h-5 text-gray-500" />;
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
      case 'closed':
        return 'Fechado';
      default:
        return status;
    }
  };

  const getTabLabel = (type: IssueType) => {
    switch (type) {
      case 'bug':
        return 'Bugs';
      case 'melhoria':
        return 'Melhorias';
      case 'risco':
        return 'Riscos';
    }
  };

  const tabs: IssueType[] = ['bug', 'melhoria', 'risco'];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const count = issues.filter(i => i.type === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 transition-colors ${
                  activeTab === tab
                    ? 'bg-white border-b-2 border-[#BC8F2E] text-[#BC8F2E]'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{getTabLabel(tab)}</span>
                <span className="ml-2 px-2 py-0.5 bg-gray-200 rounded-full">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-gray-800">
              {filteredIssues.length} {getTabLabel(activeTab).toLowerCase()}
            </h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#BC8F2E] text-white rounded-lg hover:bg-[#a37a26] transition-colors">
              <Plus className="w-4 h-4" />
              Novo {getTabLabel(activeTab).slice(0, -1)}
            </button>
          </div>

          {filteredIssues.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Nenhum {getTabLabel(activeTab).toLowerCase().slice(0, -1)} cadastrado
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[#BC8F2E]">{issue.id}</span>
                        <span className={`px-3 py-1 rounded-full border ${getSeverityColor(issue.severity)}`}>
                          {issue.severity.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-gray-800 mb-2">{issue.title}</h4>
                      <p className="text-gray-600 mb-3">{issue.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-gray-600">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(issue.status)}
                      <span>{getStatusLabel(issue.status)}</span>
                    </div>
                    {issue.impacto && (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-gray-700">Impacto: {issue.impacto}</span>
                      </div>
                    )}
                  </div>

                  {issue.linkedScenarios.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-600 mb-2">Cenários vinculados:</p>
                      <div className="flex flex-wrap gap-2">
                        {issue.linkedScenarios.map((scenarioId) => (
                          <span
                            key={scenarioId}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg"
                          >
                            {scenarioId}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {issue.externalLink && (
                    <div className="mt-3">
                      <a
                        href={issue.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#BC8F2E] hover:underline"
                      >
                        Ver no Jira →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
