// Core Types
export type StatusType = 'Pass' | 'Falha' | 'Bloqueado' | 'Não Iniciado';
export type UserRole = 'QA-Admin' | 'QA' | 'Time' | 'Cliente';
export type IssueType = 'bug' | 'melhoria' | 'risco';

export interface TestScenario {
  id: string;           // Ex: REG-001
  modulo: string;       // Ex: 7. PDP
  cenario: string;      // Descrição curta do teste
  esperado: string;     // Resultado esperado
  android: StatusType;  // Status do teste no Android
  ios: StatusType;      // Status do teste no iOS
  versao: string;       // v2.5.0
  perfil?: string;      // Vendedor, Gerente, etc.
  tabelaVenda?: string; // Tabela de venda
  observacoes?: string; // Observações do teste
  updatedAt: Date;
  createdAt: Date;
}

export interface DashboardSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  blockedTests: number;
  notStartedTests: number;
  successRate: number;
  criticalFailures: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: Date;
}

export interface Issue {
  id: string;
  type: IssueType;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  impacto?: string;
  linkedScenarios: string[];
  externalLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Backwards-compat alias
export type Bug = Issue;

export interface ProjectInfo {
  name: string;
  version: string;
  description: string;
  scope: string;
  qualityRules: string[];
}
