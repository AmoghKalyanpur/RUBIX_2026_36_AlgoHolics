"use server";

import { financialQueryAssistance } from "@/ai/flows/financial-query-assistance";

export async function askFinBot(
  query: string
): Promise<{ answer?: string; error?: string }> {
  if (!query) {
    return { error: "Query cannot be empty." };
  }

  try {
    const response = await financialQueryAssistance({ query });
    return { answer: response.answer };
  } catch (error) {
    console.error("Error in financialQueryAssistance:", error);
    return { error: "Sorry, I encountered an error while processing your request." };
  }
}
