'use server';

/**
 * @fileOverview Provides financial query assistance using a GenAI model.
 *
 * - financialQueryAssistance - A function that takes a financial query and returns an answer.
 * - FinancialQueryAssistanceInput - The input type for the financialQueryAssistance function.
 * - FinancialQueryAssistanceOutput - The return type for the financialQueryAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialQueryAssistanceInputSchema = z.object({
  query: z.string().describe('The financial query from the user.'),
});
export type FinancialQueryAssistanceInput = z.infer<
  typeof FinancialQueryAssistanceInputSchema
>;

const FinancialQueryAssistanceOutputSchema = z.object({
  answer: z.string().describe('The answer to the financial query.'),
});
export type FinancialQueryAssistanceOutput = z.infer<
  typeof FinancialQueryAssistanceOutputSchema
>;

export async function financialQueryAssistance(
  input: FinancialQueryAssistanceInput
): Promise<FinancialQueryAssistanceOutput> {
  return financialQueryAssistanceFlow(input);
}

const financialQueryAssistancePrompt = ai.definePrompt({
  name: 'financialQueryAssistancePrompt',
  input: {schema: FinancialQueryAssistanceInputSchema},
  output: {schema: FinancialQueryAssistanceOutputSchema},
  prompt: `You are a financial assistant bot. Your goal is to answer financial questions to the best of your ability. Use outside sources if needed.

  Question: {{{query}}}`,
});

const financialQueryAssistanceFlow = ai.defineFlow(
  {
    name: 'financialQueryAssistanceFlow',
    inputSchema: FinancialQueryAssistanceInputSchema,
    outputSchema: FinancialQueryAssistanceOutputSchema,
  },
  async input => {
    const {output} = await financialQueryAssistancePrompt(input);
    return output!;
  }
);
