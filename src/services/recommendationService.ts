import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const recommendationService = {
  getRecommendations: async (favoriteGenres: string[], recentlyWatched: string[]) => {
    try {
      const prompt = `Actúa como un experto crítico de cine para Llanera TV+. 
      Basado en estos géneros favoritos: ${favoriteGenres.join(", ")} 
      y estas películas vistas recientemente: ${recentlyWatched.join(", ")},
      recomienda 5 películas que podrían gustarle al usuario.
      Devuelve la respuesta en formato JSON con un array de objetos que tengan 'title' y 'reason'.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini recommendation error:", error);
      return [];
    }
  }
};
