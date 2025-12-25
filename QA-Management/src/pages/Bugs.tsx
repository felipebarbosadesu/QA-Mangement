import React from 'react';
import { Bug } from '../types';
import { BugsList } from '../../components/bugs/BugsList';
import { Button } from '../../components/common/Button';
import { Plus, RefreshCw } from 'lucide-react';

interface BugsProps {
  bugs: Bug[];
}

export const Bugs: React.FC<BugsProps> = ({ bugs }) => {
  const criticalBugs = bugs.filter(b => b.severity === 'critical').length;
  const openBugs = bugs.filter(b => b.status === 'open').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-red-600 mb-1">{criticalBugs}</p>
            <p className="text-red-700">Bugs Críticos</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
            <p className="text-yellow-600 mb-1">{openBugs}</p>
            <p className="text-yellow-700">Bugs Abertos</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Sincronizar Jira
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Bug
          </Button>
        </div>
      </div>

      <BugsList bugs={bugs} />
    </div>
  );
};
