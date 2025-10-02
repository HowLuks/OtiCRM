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

export const funnelStages: Status[] = ['Novo', 'Qualificação', 'Proposta', 'Negociação', 'Fechado Ganho', 'Fechado Perdido'];
