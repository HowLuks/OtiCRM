import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

type Status = 'Novo' | 'Qualificação' | 'Proposta' | 'Negociação' | 'Fechado Ganho' | 'Fechado Perdido';

export interface Prospect {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: Status;
  leadScore: number | null;
  lastContact: string;
  value: number;
  avatar: ImagePlaceholder;
  interactionHistory: string;
}

const getAvatar = (id: string): ImagePlaceholder => {
  const avatar = PlaceHolderImages.find(img => img.id === id);
  if (!avatar) {
    return {
      id: 'default-avatar',
      description: 'Default avatar',
      imageUrl: 'https://picsum.photos/seed/default/40/40',
      imageHint: 'person avatar'
    }
  }
  return avatar;
}

export const prospects: Prospect[] = [
  { id: '1', name: 'Ana Silva', company: 'Inovatech Soluções', email: 'ana.silva@inovatech.com', phone: '(11) 98765-4321', status: 'Proposta', leadScore: 85, lastContact: '2024-07-15', value: 50000, avatar: getAvatar('avatar-1'), interactionHistory: "Visited pricing page 3 times. Downloaded e-book on 'Future of Tech'. Attended webinar on AI integration." },
  { id: '2', name: 'Bruno Costa', company: 'Alpha Co', email: 'bruno.costa@alpha.co', phone: '(21) 91234-5678', status: 'Qualificação', leadScore: 72, lastContact: '2024-07-20', value: 75000, avatar: getAvatar('avatar-2'), interactionHistory: "Opened 5 marketing emails. Clicked on a link to a case study. Filled out contact form." },
  { id: '3', name: 'Carla Dias', company: 'MarketBoost', email: 'carla.dias@marketboost.com', phone: '(31) 99887-6543', status: 'Novo', leadScore: null, lastContact: '2024-07-22', value: 30000, avatar: getAvatar('avatar-3'), interactionHistory: "New lead from website form." },
  { id: '4', name: 'Daniel Martins', company: 'Conecta Redes', email: 'daniel.martins@conecta.net', phone: '(41) 98765-1234', status: 'Negociação', leadScore: 92, lastContact: '2024-07-18', value: 120000, avatar: getAvatar('avatar-4'), interactionHistory: "Multiple meetings with sales team. Positive feedback on demo. Requested a custom proposal." },
  { id: '5', name: 'Eduarda Ferreira', company: 'Global Transportes', email: 'eduarda.f@globaltrans.com', phone: '(51) 91234-8765', status: 'Fechado Ganho', leadScore: 98, lastContact: '2024-06-30', value: 95000, avatar: getAvatar('avatar-5'), interactionHistory: "Long negotiation cycle. Signed contract last month." },
  { id: '6', name: 'Fábio Souza', company: 'Beta Corp', email: 'fabio.souza@betacorp.com', phone: '(61) 99887-4321', status: 'Fechado Perdido', leadScore: 65, lastContact: '2024-07-05', value: 45000, avatar: getAvatar('avatar-6'), interactionHistory: "Lost to competitor due to pricing." },
  { id: '7', name: 'Gabriela Lima', company: 'Inovatech Soluções', email: 'gabriela.lima@inovatech.com', phone: '(11) 98765-4322', status: 'Qualificação', leadScore: 78, lastContact: '2024-07-21', value: 62000, avatar: getAvatar('avatar-7'), interactionHistory: "Engaged on social media posts. Asked a question via chat." },
  { id: '8', name: 'Henrique Alves', company: 'Omega Inc.', email: 'henrique.alves@omega.com', phone: '(71) 91234-5679', status: 'Proposta', leadScore: 88, lastContact: '2024-07-19', value: 88000, avatar: getAvatar('avatar-8'), interactionHistory: "Strong interest shown during product demo. Proposal sent." },
];

export const funnelStages: Status[] = ['Novo', 'Qualificação', 'Proposta', 'Negociação', 'Fechado Ganho', 'Fechado Perdido'];

export const salesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Fev', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Abr', sales: 4500 },
  { month: 'Mai', sales: 6000 },
  { month: 'Jun', sales: 5500 },
  { month: 'Jul', sales: 7000 },
];

export const leadSourceData = [
    { source: 'Website', value: 45, fill: 'var(--color-chart-1)' },
    { source: 'Indicação', value: 25, fill: 'var(--color-chart-2)' },
    { source: 'Feiras', value: 15, fill: 'var(--color-chart-3)' },
    { source: 'Anúncios', value: 10, fill: 'var(--color-chart-4)' },
    { source: 'Outros', value: 5, fill: 'var(--color-chart-5)' },
];
