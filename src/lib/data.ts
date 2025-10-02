export type Status = 'Novo' | 'Qualificação' | 'Proposta' | 'Negociação' | 'Fechado Ganho' | 'Fechado Perdido';
export const leadSources = ['Website', 'Indicação', 'Feiras', 'Anúncios', 'Outros'] as const;
export type LeadSource = typeof leadSources[number];


export interface Prospect {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: Status;
  lastContact: string;
  value: number;
  interactionHistory: string;
  source: LeadSource;
}

export const initialProspectsData: Omit<Prospect, 'id'>[] = [
  { name: 'Ana Silva', company: 'Inovatech Soluções', email: 'ana.silva@inovatech.com', phone: '(11) 98765-4321', status: 'Proposta', lastContact: '2024-07-15', value: 50000, interactionHistory: "Visited pricing page 3 times. Downloaded e-book on 'Future of Tech'. Attended webinar on AI integration.", source: 'Website' },
  { name: 'Bruno Costa', company: 'Alpha Co', email: 'bruno.costa@alpha.co', phone: '(21) 91234-5678', status: 'Qualificação', lastContact: '2024-07-20', value: 75000, interactionHistory: "Opened 5 marketing emails. Clicked on a link to a case study. Filled out contact form.", source: 'Indicação' },
  { name: 'Carla Dias', company: 'MarketBoost', email: 'carla.dias@marketboost.com', phone: '(31) 99887-6543', status: 'Novo', lastContact: '2024-07-22', value: 30000, interactionHistory: "New lead from website form.", source: 'Anúncios' },
  { name: 'Daniel Martins', company: 'Conecta Redes', email: 'daniel.martins@conecta.net', phone: '(41) 98765-1234', status: 'Negociação', lastContact: '2024-07-18', value: 120000, interactionHistory: "Multiple meetings with sales team. Positive feedback on demo. Requested a custom proposal.", source: 'Feiras' },
  { name: 'Eduarda Ferreira', company: 'Global Transportes', email: 'eduarda.f@globaltrans.com', phone: '(51) 91234-8765', status: 'Fechado Ganho', lastContact: '2024-06-30', value: 95000, interactionHistory: "Long negotiation cycle. Signed contract last month.", source: 'Website' },
  { name: 'Fábio Souza', company: 'Beta Corp', email: 'fabio.souza@betacorp.com', phone: '(61) 99887-4321', status: 'Fechado Perdido', lastContact: '2024-07-05', value: 45000, interactionHistory: "Lost to competitor due to pricing.", source: 'Outros' },
  { name: 'Gabriela Lima', company: 'Inovatech Soluções', email: 'gabriela.lima@inovatech.com', phone: '(11) 98765-4322', status: 'Qualificação', lastContact: '2024-07-21', value: 62000, interactionHistory: "Engaged on social media posts. Asked a question via chat.", source: 'Website' },
  { name: 'Henrique Alves', company: 'Omega Inc.', email: 'henrique.alves@omega.com', phone: '(71) 91234-5679', status: 'Proposta', lastContact: '2024-07-19', value: 88000, interactionHistory: "Strong interest shown during product demo. Proposal sent.", source: 'Indicação' },
];

export const funnelStages: Status[] = ['Novo', 'Qualificação', 'Proposta', 'Negociação', 'Fechado Ganho', 'Fechado Perdido'];
