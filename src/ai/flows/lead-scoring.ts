'use server';
/**
 * @fileOverview AI-powered lead scoring flow.
 *
 * - leadScoring - A function that scores leads based on available data and interaction history.
 * - LeadScoringInput - The input type for the leadScoring function.
 * - LeadScoringOutput - The return type for the leadScoring function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LeadScoringInputSchema = z.object({
  leadData: z.string().describe('Comprehensive data about the lead, including contact information, company details, interaction history, and any other relevant information.'),
});
export type LeadScoringInput = z.infer<typeof LeadScoringInputSchema>;

const LeadScoringOutputSchema = z.object({
  score: z.number().describe('The score of the lead, ranging from 0 to 100, with higher scores indicating more promising prospects.'),
  reasoning: z.string().describe('Explanation of why the lead received the assigned score, highlighting key factors and data points considered.'),
  priority: z.enum(['High', 'Medium', 'Low']).describe('Suggested priority level for outreach based on the lead score.'),
});
export type LeadScoringOutput = z.infer<typeof LeadScoringOutputSchema>;

export async function leadScoring(input: LeadScoringInput): Promise<LeadScoringOutput> {
  return leadScoringFlow(input);
}

const leadScoringPrompt = ai.definePrompt({
  name: 'leadScoringPrompt',
  input: {schema: LeadScoringInputSchema},
  output: {schema: LeadScoringOutputSchema},
  prompt: `You are an AI assistant specialized in lead scoring for CRM systems. Your task is to analyze lead data and assign a score based on the likelihood of conversion.

  Analyze the following lead data:
  {{leadData}}

  Consider factors such as:
  - Job title and seniority
  - Company size and industry
  - Interaction history (e.g., website visits, email engagement)
  - Demographics and location
  - Any other relevant information provided

  Based on your analysis, provide:
  1. A score between 0 and 100, where higher scores indicate a more promising lead.
  2. A concise explanation of your reasoning, highlighting the key factors that influenced the score.
  3. A priority level (High, Medium, or Low) for outreach based on the score.

  Ensure that your output is well-structured and easy to understand.

  Output:
  Score: (0-100)
  Reasoning: [Explanation of the score]
  Priority: [High, Medium, or Low]`,
});

const leadScoringFlow = ai.defineFlow(
  {
    name: 'leadScoringFlow',
    inputSchema: LeadScoringInputSchema,
    outputSchema: LeadScoringOutputSchema,
  },
  async input => {
    const {output} = await leadScoringPrompt(input);
    return output!;
  }
);
