
import { GoogleGenAI } from "@google/genai";
import type { EnergyPricePoint } from '../types';

export const getEnergyAnalysis = async (data: EnergyPricePoint[]): Promise<string> => {
  // The API key is expected to be in the environment variables.
  // The GoogleGenAI constructor will use it.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const simplifiedData = data.map(p => ({
    date: p.timestamp.toISOString().slice(0, 10),
    hour: p.timestamp.getHours(),
    price: p.price.toFixed(4)
  }));

  const prompt = `
    You are an expert energy cost analyst. Your task is to provide a clear, concise, and actionable summary based on the provided hourly electricity price data for the last 7 days. The price is in $/kWh.

    Analyze the following data:
    ${JSON.stringify(simplifiedData.slice(-168), null, 2)}

    Based on this data, provide the following in your response:
    1.  **Executive Summary:** A brief, 1-2 sentence overview of the price trends.
    2.  **Cheapest Times:** Identify the general time windows (e.g., "early morning hours between 2 AM and 5 AM") when electricity is consistently cheapest.
    3.  **Most Expensive Times:** Identify the general time windows (e.g., "late afternoon and evening from 4 PM to 8 PM") when electricity is most expensive.
    4.  **Actionable Tip:** Offer one practical, easy-to-implement tip for a homeowner to save money based on these patterns (e.g., "Consider running your dishwasher or charging your EV during the low-cost overnight hours.").

    Keep the tone helpful, friendly, and easy for a non-expert to understand. Do not just repeat the data; provide insights.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("An error occurred while analyzing the energy data. The AI analysis is currently unavailable.");
  }
};
