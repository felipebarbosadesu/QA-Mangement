import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { DashboardSummary } from '../../types';

interface MetricsChartProps {
  summary: DashboardSummary;
}

export const MetricsChart: React.FC<MetricsChartProps> = ({ summary }) => {
  const data = [
    { name: 'Pass', value: summary.passedTests, color: '#16a34a' },
    { name: 'Falha', value: summary.failedTests, color: '#dc2626' },
    { name: 'Bloqueado', value: summary.blockedTests, color: '#6b7280' },
    { name: 'Não Iniciado', value: summary.notStartedTests, color: '#ca8a04' }
  ].filter(item => item.value > 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-gray-800 mb-4">Distribuição de Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
