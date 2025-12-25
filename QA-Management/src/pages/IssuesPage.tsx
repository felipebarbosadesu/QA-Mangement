import React from 'react';
import { Issue } from '../types';
import { IssuesTabs } from '../../components/issues/IssuesTabs';

interface IssuesPageProps {
  issues: Issue[];
}

export const IssuesPage: React.FC<IssuesPageProps> = ({ issues }) => {
  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const openCount = issues.filter(i => i.status === 'open').length;
  const bugsCount = issues.filter(i => i.type === 'bug').length;
  const riscosCount = issues.filter(i => i.type === 'risco').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Total</p>
              <p className="text-gray-800">{issues.length}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg shadow-sm border border-red-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 mb-1">Críticos</p>
              <p className="text-red-700">{criticalCount}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600">🚨</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 mb-1">Abertos</p>
              <p className="text-yellow-700">{openCount}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg shadow-sm border border-purple-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 mb-1">Riscos</p>
              <p className="text-purple-700">{riscosCount}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600">⚠️</span>
            </div>
          </div>
        </div>
      </div>

      <IssuesTabs issues={issues} />
    </div>
  );
};
