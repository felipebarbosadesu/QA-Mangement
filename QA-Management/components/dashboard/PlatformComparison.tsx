import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TestScenario } from '../../types';

interface PlatformComparisonProps {
  tests: TestScenario[];
}

export const PlatformComparison: React.FC<PlatformComparisonProps> = ({ tests }) => {
  const androidStats = {
    pass: tests.filter(t => t.android === 'Pass').length,
    falha: tests.filter(t => t.android === 'Falha').length,
    bloqueado: tests.filter(t => t.android === 'Bloqueado').length,
    naoIniciado: tests.filter(t => t.android === 'Não Iniciado').length
  };

  const iosStats = {
    pass: tests.filter(t => t.ios === 'Pass').length,
    falha: tests.filter(t => t.ios === 'Falha').length,
    bloqueado: tests.filter(t => t.ios === 'Bloqueado').length,
    naoIniciado: tests.filter(t => t.ios === 'Não Iniciado').length
  };

  const data = [
    {
      name: 'Pass',
      Android: androidStats.pass,
      iOS: iosStats.pass
    },
    {
      name: 'Falha',
      Android: androidStats.falha,
      iOS: iosStats.falha
    },
    {
      name: 'Bloqueado',
      Android: androidStats.bloqueado,
      iOS: iosStats.bloqueado
    },
    {
      name: 'Não Iniciado',
      Android: androidStats.naoIniciado,
      iOS: iosStats.naoIniciado
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-gray-800 mb-4">Comparação Android vs iOS</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Android" fill="#3b82f6" />
          <Bar dataKey="iOS" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
