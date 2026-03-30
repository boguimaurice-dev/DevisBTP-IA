import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface DevisResult {
  totalAmount: number;
  currency: string;
  breakdown: {
    category: string;
    amount: number;
    description: string;
  }[];
  summary: string;
}

export async function generateQuote(projectDetails: {
  type: string;
  surface: number;
  standing: string;
  location: string;
  description: string;
}): Promise<DevisResult> {
  const prompt = `Génère un devis estimatif détaillé pour un projet de construction en Afrique (Sénégal/Côte d'Ivoire).
  Type de projet: ${projectDetails.type}
  Surface: ${projectDetails.surface} m²
  Standing: ${projectDetails.standing}
  Localisation: ${projectDetails.location}
  Description: ${projectDetails.description}
  
  Le devis doit être en FCFA. Inclus les corps de métier suivants si pertinent: Gros œuvre, Électricité, Plomberie, Menuiserie, Peinture, Carrelage.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          totalAmount: { type: Type.NUMBER },
          currency: { type: Type.STRING },
          breakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                amount: { type: Type.NUMBER },
                description: { type: Type.STRING }
              },
              required: ["category", "amount", "description"]
            }
          },
          summary: { type: Type.STRING }
        },
        required: ["totalAmount", "currency", "breakdown", "summary"]
      }
    }
  });

  return JSON.parse(response.text);
}
