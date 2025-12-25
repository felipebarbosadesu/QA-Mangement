import type { TestScenario, Issue, User, ProjectInfo } from '../types';

export const mockTests: TestScenario[] = [
  {
    id: 'REG-001',
    modulo: '1. Login',
    cenario: 'Login com credenciais válidas',
    esperado: 'Usuário deve ser autenticado e redirecionado para o dashboard',
    android: 'Pass',
    ios: 'Pass',
    versao: 'v2.5.0',
    perfil: 'Vendedor',
    tabelaVenda: 'Tabela A',
    observacoes: 'Teste executado com sucesso',
    updatedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'REG-002',
    modulo: '1. Login',
    cenario: 'Login com credenciais inválidas',
    esperado: 'Sistema deve exibir mensagem de erro',
    android: 'Pass',
    ios: 'Falha',
    versao: 'v2.5.0',
    perfil: 'Vendedor',
    tabelaVenda: 'Tabela A',
    observacoes: 'iOS apresenta crash intermitente',
    updatedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'REG-003',
    modulo: '2. Catálogo',
    cenario: 'Buscar produto por nome',
    esperado: 'Lista de produtos correspondentes deve ser exibida',
    android: 'Pass',
    ios: 'Pass',
    versao: 'v2.5.0',
    perfil: 'Vendedor',
    tabelaVenda: 'Tabela A',
    updatedAt: new Date('2024-01-16'),
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'REG-004',
    modulo: '2. Catálogo',
    cenario: 'Filtrar produtos por categoria',
    esperado: 'Apenas produtos da categoria selecionada devem aparecer',
    android: 'Bloqueado',
    ios: 'Não Iniciado',
    versao: 'v2.5.0',
    perfil: 'Vendedor',
    tabelaVenda: 'Tabela B',
    observacoes: 'Dependência do bug BUG-004',
    updatedAt: new Date('2024-01-16'),
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'REG-005',
    modulo: '3. Carrinho',
    cenario: 'Adicionar produto ao carrinho',
    esperado: 'Produto deve aparecer na lista do carrinho',
    android: 'Pass',
    ios: 'Pass',
    versao: 'v2.5.0',
    perfil: 'Vendedor',
    tabelaVenda: 'Tabela A',
    updatedAt: new Date('2024-01-17'),
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'REG-006',
    modulo: '3. Carrinho',
    cenario: 'Remover produto do carrinho',
    esperado: 'Produto deve ser removido e total recalculado',
    android: 'Pass',
    ios: 'Falha',
    versao: 'v2.5.0',
    perfil: 'Vendedor',
    tabelaVenda: 'Tabela A',
    observacoes: 'Total não atualiza no iOS',
    updatedAt: new Date('2024-01-17'),
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'REG-007',
    modulo: '4. Checkout',
    cenario: 'Finalizar compra com cartão de crédito',
    esperado: 'Pedido deve ser criado com sucesso',
    android: 'Falha',
    ios: 'Falha',
    versao: 'v2.5.0',
    perfil: 'Vendedor',
    tabelaVenda: 'Tabela A',
    observacoes: 'CRÍTICO: App crasha ao processar pagamento',
    updatedAt: new Date('2024-01-18'),
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'REG-008',
    modulo: '5. Pedidos',
    cenario: 'Visualizar lista de pedidos',
    esperado: 'Lista completa de pedidos do vendedor deve ser exibida',
    android: 'Pass',
    ios: 'Pass',
    versao: 'v2.5.0',
    perfil: 'Vendedor',
    tabelaVenda: 'Todas',
    updatedAt: new Date('2024-01-18'),
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'REG-009',
    modulo: '6. Relatórios',
    cenario: 'Gerar relatório de vendas',
    esperado: 'Relatório com dados consolidados deve ser gerado',
    android: 'Não Iniciado',
    ios: 'Não Iniciado',
    versao: 'v2.5.0',
    perfil: 'Gerente',
    tabelaVenda: 'Todas',
    updatedAt: new Date('2024-01-19'),
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'REG-010',
    modulo: '7. PDP',
    cenario: 'Exibir detalhes do produto',
    esperado: 'Todas as informações do produto devem ser exibidas corretamente',
    android: 'Pass',
    ios: 'Bloqueado',
    versao: 'v2.5.0',
    perfil: 'Vendedor',
    tabelaVenda: 'Tabela A',
    observacoes: 'Imagens não carregam no iOS',
    updatedAt: new Date('2024-01-19'),
    createdAt: new Date('2024-01-10')
  }
];

export const mockIssues: Issue[] = [
  {
    id: 'BUG-001',
    type: 'bug',
    title: 'Crash ao finalizar checkout com cartão',
    description: 'Aplicativo fecha inesperadamente ao processar pagamento com cartão de crédito em ambas plataformas',
    severity: 'critical',
    status: 'open',
    impacto: 'Bloqueio total de vendas via app',
    linkedScenarios: ['REG-007'],
    externalLink: 'https://jira.fastshop.com/APVEND-123',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: 'BUG-002',
    type: 'bug',
    title: 'Login falha com caracteres especiais na senha',
    description: 'Senhas contendo caracteres especiais (@, #, $) não são aceitas pelo sistema',
    severity: 'high',
    status: 'in-progress',
    impacto: 'Usuários com senhas complexas não conseguem acessar',
    linkedScenarios: ['REG-002'],
    externalLink: 'https://jira.fastshop.com/APVEND-124',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: 'BUG-003',
    type: 'bug',
    title: 'Remoção de produto do carrinho não atualiza total',
    description: 'Valor total permanece o mesmo após remover item do carrinho no iOS',
    severity: 'medium',
    status: 'open',
    impacto: 'Confusão no checkout, possível cobrança incorreta',
    linkedScenarios: ['REG-006'],
    externalLink: 'https://jira.fastshop.com/APVEND-125',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17')
  },
  {
    id: 'BUG-004',
    type: 'bug',
    title: 'Filtro de categorias não funciona',
    description: 'Ao selecionar categoria, todos os produtos continuam sendo exibidos',
    severity: 'medium',
    status: 'open',
    impacto: 'Dificuldade em encontrar produtos específicos',
    linkedScenarios: ['REG-004'],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: 'MEL-001',
    type: 'melhoria',
    title: 'Adicionar busca por código de barras',
    description: 'Permitir que vendedor busque produto escaneando código de barras',
    severity: 'medium',
    status: 'open',
    impacto: 'Agilidade no atendimento',
    linkedScenarios: [],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: 'MEL-002',
    type: 'melhoria',
    title: 'Dashboard de vendas do dia',
    description: 'Exibir resumo de vendas realizadas no dia atual',
    severity: 'low',
    status: 'in-progress',
    impacto: 'Visibilidade de performance',
    linkedScenarios: [],
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'RISK-001',
    type: 'risco',
    title: 'Performance degradada com catálogo grande',
    description: 'App apresenta lentidão quando catálogo tem mais de 10.000 produtos',
    severity: 'high',
    status: 'open',
    impacto: 'Lojas com catálogo extenso podem ter experiência ruim',
    linkedScenarios: ['REG-003'],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: 'RISK-002',
    type: 'risco',
    title: 'Dependência de API externa instável',
    description: 'API de pagamentos apresenta instabilidade em horários de pico',
    severity: 'critical',
    status: 'open',
    impacto: 'Possível perda de vendas em horários críticos',
    linkedScenarios: ['REG-007'],
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11')
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'QA Master',
    email: 'qa@fastshop.com',
    role: 'QA-Admin',
    active: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao.silva@fastshop.com',
    role: 'QA',
    active: true,
    createdAt: new Date('2024-01-05')
  },
  {
    id: '3',
    name: 'Maria Santos',
    email: 'maria.santos@fastshop.com',
    role: 'Time',
    active: true,
    createdAt: new Date('2024-01-08')
  },
  {
    id: '4',
    name: 'Cliente Externo',
    email: 'cliente@example.com',
    role: 'Cliente',
    active: true,
    createdAt: new Date('2024-01-10')
  }
];

export const mockProjectInfo: ProjectInfo = {
  name: 'App Vendedor Fast Shop',
  version: 'v2.5.0',
  description: 'Aplicativo mobile para vendedores da Fast Shop realizarem vendas, consultarem produtos e gerenciarem pedidos.',
  scope: 'Testes regressivos cobrindo módulos críticos: Login, Catálogo, Carrinho, Checkout, Pedidos, Relatórios e PDP.',
  qualityRules: [
    'Todos os cenários críticos devem ter 100% de pass antes do release',
    'Bugs críticos devem ser corrigidos imediatamente',
    'Testes devem ser executados em ambas plataformas (Android e iOS)',
    'Documentação de bugs deve incluir logs e evidências',
    'Versionamento segue padrão semântico (Major.Minor.Patch)'
  ]
};
