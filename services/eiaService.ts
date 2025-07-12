
import { GoogleGenAI, Type } from "@google/genai";
import type { EnergyPricePoint } from '../types';

// This service now uses the Gemini API to generate realistic energy price data.
class EnergyService {
  public async getWeeklyPriceData(): Promise<EnergyPricePoint[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const prompt = `
      You are a sophisticated energy market data simulator.
      Your task is to generate a realistic-looking dataset of hourly electricity prices in $/kWh for the last 7 days, starting from ${sevenDaysAgo.toISOString()} and ending now, ${now.toISOString()}.
      Generate one data point for each hour. There should be exactly 7 * 24 = 168 data points.

      The data should follow these patterns:
      1.  **Base Price:** The average price should be around $0.12/kWh.
      2.  **Peak Hours (4 PM - 8 PM / 16:00 - 20:00):** Prices should be significantly higher, ranging from $0.25 to $0.40/kWh.
      3.  **Off-Peak Hours (12 AM - 5 AM / 00:00 - 05:00):** Prices should be cheaper, ranging from $0.04 to $0.08/kWh.
      4.  **Shoulder Hours:** All other times should have moderate prices with slight fluctuations.
      5.  **Weekend Discount:** Prices on Saturday and Sunday should be roughly 20% lower on average than on weekdays.
      6.  **Realism:** Introduce slight, random variations to make the data look authentic. The price should never be negative.

      Return the data as a JSON array where each object has a 'timestamp' (as an ISO 8601 string) and a 'price' (as a number).
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timestamp: {
                  type: Type.STRING,
                  description: "The timestamp for the price data point in ISO 8601 format.",
                },
                price: {
                  type: Type.NUMBER,
                  description: "The electricity price in $/kWh.",
                },
              },
              required: ["timestamp", "price"],
            },
          },
        },
      });

      const jsonText = response.text.trim();
      const parsedData: { timestamp: string; price: number }[] = JSON.parse(jsonText);

      // Convert timestamp strings to Date objects and sort chronologically
      const formattedData: EnergyPricePoint[] = parsedData
        .map(p => ({
          timestamp: new Date(p.timestamp),
          price: p.price,
        }))
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()); 

      if (formattedData.length === 0) {
        throw new Error("API returned empty data array.");
      }

      return formattedData;

    } catch (error) {
      console.error("Error calling Gemini API for price data:", error);
      throw new Error("Failed to generate energy price data using the AI. Please check your API key and try again.");
    }
  }
}

export const energyService = new EnergyService();
