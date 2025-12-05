import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Tone, GroundingResult, GroundingSource } from '../types';

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction for the chat assistant
const CHAT_SYSTEM_INSTRUCTION = "You are a helpful, concise, and intelligent Chrome Extension assistant. Keep your answers brief and to the point, suitable for a small popup window.";

/**
 * Creates a chat session and returns it.
 */
export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: CHAT_SYSTEM_INSTRUCTION,
    },
  });
};

/**
 * Sends a message to the chat model and yields chunks of text.
 */
export async function* streamChatMessage(chat: Chat, message: string): AsyncGenerator<string, void, unknown> {
  try {
    const responseStream = await chat.sendMessageStream({ message });
    
    for await (const chunk of responseStream) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        yield c.text;
      }
    }
  } catch (error) {
    console.error("Error in streamChatMessage:", error);
    throw error;
  }
}

/**
 * Summarizes the provided text.
 */
export const summarizeText = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following text concisely in 3-5 bullet points:\n\n${text}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster simple tasks
      }
    });
    return response.text || "No summary generated.";
  } catch (error) {
    console.error("Error summarizing text:", error);
    throw new Error("Failed to summarize text.");
  }
};

/**
 * Rewrites text based on a selected tone.
 */
export const rewriteText = async (text: string, tone: Tone): Promise<string> => {
  try {
    const prompt = `Rewrite the following text to sound ${tone}. Keep the meaning the same but change the style:\n\n"${text}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No rewrite generated.";
  } catch (error) {
    console.error("Error rewriting text:", error);
    throw new Error("Failed to rewrite text.");
  }
};

/**
 * Searches the web using Google Search grounding.
 */
export const searchWeb = async (query: string): Promise<GroundingResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Web Source",
            uri: chunk.web.uri,
          });
        }
      });
    }

    return {
      text: response.text || "No results found.",
      sources: sources
    };
  } catch (error) {
    console.error("Error searching web:", error);
    throw new Error("Failed to perform search.");
  }
};

/**
 * Finds places using Google Maps grounding.
 */
export const findPlaces = async (query: string, userLocation?: { lat: number; lng: number }): Promise<GroundingResult> => {
  try {
    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (userLocation) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: userLocation.lat,
            longitude: userLocation.lng
          }
        }
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: config,
    });

    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    if (chunks) {
      chunks.forEach((chunk: any) => {
        // Handle direct map URIs or place answer sources
        if (chunk.maps?.uri) {
          sources.push({
            title: chunk.maps.title || "Google Maps",
            uri: chunk.maps.uri,
          });
        }
      });
    }

    return {
      text: response.text || "No places found.",
      sources: sources
    };
  } catch (error) {
    console.error("Error finding places:", error);
    throw new Error("Failed to find places.");
  }
};

/**
 * Translates text to the target language.
 */
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const prompt = `Translate the following text into ${targetLanguage}. Only provide the translation, no introductory text:\n\n"${text}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Translation failed.";
  } catch (error) {
    console.error("Error translating text:", error);
    throw new Error("Failed to translate text.");
  }
};
