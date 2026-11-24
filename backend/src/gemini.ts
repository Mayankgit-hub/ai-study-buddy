import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

// Initialize the Google Gen AI client with the server-side API key
const apiKey = process.env.GEMINI_API_KEY || '';

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Primary model: gemini-3.5-flash-lite provides fast response times and high availability
export const GEMINI_MODEL = 'gemini-3.5-flash-lite';
export const CANDIDATE_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-3.5-flash'];

/**
 * Robust content generation with automatic model fallback and retries
 */
export async function generateContentWithFallback(options: {
  contents: string;
  config?: any;
}) {
  if (!ai) throw new Error('GEMINI_API_KEY is not configured on the backend.');

  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        ...(options.config ? { config: options.config } : {})
      });
      return response;
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} encountered notice:`, err.message || err);
      await new Promise(r => setTimeout(r, 400));
    }
  }

  throw lastError;
}
