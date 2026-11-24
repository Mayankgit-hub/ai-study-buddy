import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';
export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Primary models ordered by current active availability
export const CANDIDATE_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-2.5-flash'
];

export async function generateContentWithFallback(options: {
  contents: string;
  config?: any;
}) {
  if (!ai) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }

  let lastError: any = null;

  // Try each model, retrying up to 2 times on temporary 503 high demand spikes
  for (const model of CANDIDATE_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: options.contents,
          ...(options.config ? { config: options.config } : {})
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const isUnavailable = err.message && (err.message.includes('503') || err.message.includes('high demand'));
        if (isUnavailable && attempt === 0) {
          // Wait briefly for transient spike to clear
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }
        break; // Try next model candidate
      }
    }
  }

  throw lastError;
}
