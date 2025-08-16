
import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedPrompts } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

const promptSchema = {
  type: Type.OBJECT,
  properties: {
    english_prompt: {
      type: Type.STRING,
      description: 'The detailed animation prompt in English. It should describe subtle, natural movements to bring the image to life.'
    },
    vietnamese_prompt: {
      type: Type.STRING,
      description: 'The detailed animation prompt in Vietnamese, translating the English version accurately.'
    },
  },
  required: ['english_prompt', 'vietnamese_prompt']
};

export const generateVideoPromptsFromImage = async (imageBase64: string): Promise<GeneratedPrompts> => {
  const systemInstruction = `You are a creative assistant specializing in generating prompts for text-to-video AI models. Your task is to analyze an image and write a detailed prompt that describes how to animate it into a short, looping video with natural, subtle movements. The goal is to make the static image come alive.

Your output must be a JSON object that strictly follows the provided schema.

For the prompts:
- Describe the overall scene and mood.
- Detail the specific movements of main subjects (e.g., a person breathing gently, eyes blinking slowly, hair swaying slightly).
- Detail movements in the environment (e.g., leaves rustling in a light breeze, water rippling, clouds drifting across the sky, light and shadows shifting subtly).
- The animation should be calm and realistic. Avoid exaggerated or fast movements.
- The final video should feel like a living photograph.`;
  
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg', // Assuming JPEG, but can be dynamic if needed
      data: imageBase64,
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { text: "Analyze this image and generate the video animation prompts." },
          imagePart,
        ],
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: promptSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);

    // Validate the parsed object has the required keys
    if (parsedJson.english_prompt && parsedJson.vietnamese_prompt) {
      return parsedJson as GeneratedPrompts;
    } else {
      throw new Error("API response did not match the expected format.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate prompts: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while communicating with the Gemini API.");
  }
};
