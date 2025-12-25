import React from 'react';
import { TestScenario } from '../types';
import { calculateDashboardSummary } from '../../../utils/calculations';
import { StatCard } from '../../components/common/StatCard';
import { MetricsChart } from '../../components/dashboard/MetricsChart';
import { PlatformComparison } from '../../components/dashboard/PlatformComparison';
import { CheckCircle, XCircle, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

interface DashboardProps {
  tests: TestScenario[];
}

export const Dashboard: React.FC<DashboardProps> = ({ tests }) => {
  const summary = calculateDashboardSummary(tests);
  const androidSummary = calculateDashboardSummary(tests, 'android');
  const iosSummary = calculateDashboardSummary(tests, 'ios');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total de Cenários"
          value={summary.totalTests}
          icon={TrendingUp}
          color="text-blue-600"
          subtitle="Testes cadastrados"
        />
        <StatCard
          title="Taxa de Sucesso"
          value={`${summary.successRate.toFixed(1)}%`}
          icon={CheckCircle}
          color="text-green-600"
          subtitle={`${summary.passedTests} passou`}
        />
        <StatCard
          title="Falhas"
          value={summary.failedTests}
          icon={XCircle}
          color="text-red-600"
          subtitle={`${summary.criticalFailures} críticas`}
        />
        <StatCard
          title="Bloqueados"
          value={summary.blockedTests}
          icon={AlertTriangle}
          color="text-orange-600"
          subtitle="Aguardando correção"
        />
        <StatCard
          title="Não Iniciados"
          value={summary.notStartedTests}
          icon={Clock}
          color="text-gray-600"
          subtitle="Pendentes"
        />
      </div>

      {summary.criticalFailures > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <div>
              <h4 className="text-red-800">⚠️ Atenção: {summary.criticalFailures} Falha(s) Crítica(s) Detectada(s)</h4>
              <p className="text-red-700">
                Cenários críticos (Login, Checkout, Carrinho) estão falhando. Ação imediata necessária.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-white mb-4">📱 Android</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Taxa de Sucesso:</span>
              <span>{androidSummary.successRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Pass:</span>
              <span>{androidSummary.passedTests} / {androidSummary.totalTests}</span>
            </div>
            <div className="flex justify-between">
              <span>Falhas:</span>
              <span>{androidSummary.failedTests}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-white mb-4">🍎 iOS</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Taxa de Sucesso:</span>
              <span>{iosSummary.successRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Pass:</span>
              <span>{iosSummary.passedTests} / {iosSummary.totalTests}</span>
            </div>
            <div className="flex justify-between">
              <span>Falhas:</span>
              <span>{iosSummary.failedTests}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricsChart summary={summary} />
        <PlatformComparison tests={tests} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-gray-800 mb-4">Resumo por Módulo</h3>
        <div className="space-y-3">
          {Array.from(new Set(tests.map(t => t.modulo))).map((modulo) => {
            const moduleTests = tests.filter(t => t.modulo === modulo);
            const moduleSummary = calculateDashboardSummary(moduleTests);
            
            return (
              <div key={modulo} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <p className="text-gray-800">{modulo}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-gray-600">{moduleTests.length} testes</span>
                    <span className="text-green-600">{moduleSummary.successRate.toFixed(0)}% sucesso</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">{moduleSummary.passedTests}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-700">{moduleSummary.failedTests}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-700">{moduleSummary.blockedTests}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};