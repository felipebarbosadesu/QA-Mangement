import type { TestScenario, DashboardSummary, StatusType } from '../types';

export const calculateDashboardSummary = (
  tests: TestScenario[],
  platform?: 'android' | 'ios'
): DashboardSummary => {
  const getStatus = (test: TestScenario): StatusType => {
    if (!platform) {
      // Considera o pior status entre as duas plataformas
      const statuses: StatusType[] = [test.android, test.ios];
      if (statuses.includes('Falha')) return 'Falha';
      if (statuses.includes('Bloqueado')) return 'Bloqueado';
      if (statuses.includes('Não Iniciado')) return 'Não Iniciado';
      return 'Pass';
    }
    return test[platform];
  };

  const totalTests = tests.length;
  const passedTests = tests.filter(t => getStatus(t) === 'Pass').length;
  const failedTests = tests.filter(t => getStatus(t) === 'Falha').length;
  const blockedTests = tests.filter(t => getStatus(t) === 'Bloqueado').length;
  const notStartedTests = tests.filter(t => getStatus(t) === 'Não Iniciado').length;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
  
  // Identifica falhas críticas (checkout, pagamento, login)
  const criticalModules = ['4. Checkout', '1. Login', '3. Carrinho'];
  const criticalFailures = tests.filter(t => {
    const isCriticalModule = criticalModules.some(mod => t.modulo.includes(mod));
    const hasCriticalFailure = t.android === 'Falha' || t.ios === 'Falha';
    return isCriticalModule && hasCriticalFailure;
  }).length;

  return {
    totalTests,
    passedTests,
    failedTests,
    blockedTests,
    notStartedTests,
    successRate,
    criticalFailures
  };
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

export const getStatusColor = (status: StatusType): string => {
  switch (status) {
    case 'Pass':
      return 'text-green-600 bg-green-50';
    case 'Falha':
      return 'text-red-600 bg-red-50';
    case 'Bloqueado':
      return 'text-gray-600 bg-gray-100';
    case 'Não Iniciado':
      return 'text-yellow-600 bg-yellow-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};