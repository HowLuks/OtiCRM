'use server';

import { leadScoring, type LeadScoringOutput } from '@/ai/flows/lead-scoring';
import { personalizeMessage, type PersonalizeMessageOutput } from '@/ai/flows/personalize-message';
import type { Prospect } from '@/lib/data';

export async function scoreLeadAction(prospect: Prospect): Promise<LeadScoringOutput> {
  const leadDataString = `
    Nome do Lead: ${prospect.name}
    Empresa: ${prospect.company}
    Status Atual no Funil: ${prospect.status}
    Valor do Negócio: R$ ${prospect.value.toLocaleString('pt-BR')}
    Último contato: ${new Date(prospect.lastContact).toLocaleDateString('pt-BR')}
    Histórico de Interação: ${prospect.interactionHistory}
    ---
    Informações Adicionais:
    - O lead está no setor de ${prospect.company.includes('Inovatech') ? 'Tecnologia' : 'Serviços'}.
    - O histórico de interação mostra engajamento com conteúdo de marketing.
  `;

  try {
    const result = await leadScoring({ leadData: leadDataString });
    return result;
  } catch (error) {
    console.error("Error scoring lead:", error);
    // In a real app, you'd want more robust error handling.
    // For this example, we'll return a default error state.
    throw new Error("Falha ao pontuar o lead com IA. Tente novamente mais tarde.");
  }
}

export async function personalizeMessageAction(messageTemplate: string, prospect: Prospect): Promise<PersonalizeMessageOutput> {
  const prospectDataString = `
- Nome: ${prospect.name}
- Email: ${prospect.email}
- Empresa: ${prospect.company}
- Cargo: (não disponível)
- Status no Funil: ${prospect.status}
- Valor do Negócio: R$${prospect.value.toLocaleString('pt-BR')}
- Último contato: ${new Date(prospect.lastContact).toLocaleDateString('pt-BR')}
`;

  try {
    const result = await personalizeMessage({ messageTemplate, prospectData: prospectDataString });
    return result;
  } catch (error) {
    console.error("Error personalizing message for prospect:", prospect.id, error);
    throw new Error(`Falha ao personalizar a mensagem para ${prospect.name}.`);
  }
}
