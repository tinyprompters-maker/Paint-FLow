
import { GoogleGenAI, Type } from "@google/genai";
import { Lead } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateLeadSummary(lead: Partial<Lead>): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Analyze this painting lead for a contractor. Provide a 2-sentence professional summary and an estimated "Complexity Level" (Low/Medium/High).
        
        Details:
        - Project: ${lead.projectType}
        - Size: ${lead.size}
        - Zip: ${lead.zip}
        - Extra Info: ${lead.details}
      `,
      config: {
        temperature: 0.7,
        maxOutputTokens: 200,
      }
    });

    return response.text || "No AI analysis available.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to analyze lead automatically.";
  }
}
