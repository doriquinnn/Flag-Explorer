
import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getFlagExplanation = async (countryName: string): Promise<string> => {
  try {
    const prompt = `Explain the meaning of the colors and symbols on the flag of ${countryName}. Be concise and structure your response with headings for "Colors" and "Symbols". Respond in markdown format.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching flag explanation:", error);
    return "Could not retrieve flag explanation. Please try again later.";
  }
};

export const generateQuizQuestions = async (): Promise<QuizQuestion[]> => {
  const prompt = `Generate a 10-question multiple-choice quiz about world flags. For each question, select a country, and provide three other plausible but incorrect country options, preferably from the same continent or a similar region. Provide the country's two-letter ISO code (e.g., 'us' for United States). The question should implicitly be "Which country does this flag belong to?".`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              description: 'An array of 10 quiz questions.',
              items: {
                type: Type.OBJECT,
                properties: {
                  countryName: {
                    type: Type.STRING,
                    description: 'The name of the country for the flag shown.',
                  },
                  countryCode: {
                    type: Type.STRING,
                    description: 'The two-letter ISO code for the country (lowercase).',
                  },
                  options: {
                    type: Type.ARRAY,
                    description: 'An array of 4 country names, one of which is the correct answer.',
                    items: { type: Type.STRING },
                  },
                  correctAnswer: {
                    type: Type.STRING,
                    description: 'The correct country name from the options.',
                  },
                },
                required: ['countryName', 'countryCode', 'options', 'correctAnswer'],
              },
            },
          },
          required: ['questions'],
        },
      },
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Shuffle options for each question to ensure randomness
    return result.questions.map((q: QuizQuestion) => ({
      ...q,
      options: [...q.options].sort(() => Math.random() - 0.5)
    }));
  } catch (error) {
    console.error("Error generating quiz questions:", error);
    throw new Error("Failed to generate the quiz. Please try again.");
  }
};
