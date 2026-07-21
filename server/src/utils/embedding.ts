import OpenAI from 'openai';
import { config } from '../config';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

/**
 * MongoDB Atlas Vector Search requires creating a vector index in Atlas dashboard:
 * - Field: "embedding"
 * - Dimensions: 384 (for mock)
 * - Similarity: "cosine"
 */

// Simple hash function for deterministic embeddings
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Deterministic mock embedding - same text always produces same embedding
const generateMockEmbedding = (text: string): number[] => {
  const embedding: number[] = [];
  const baseHash = simpleHash(text.toLowerCase());

  for (let i = 0; i < 384; i++) {
    // Create deterministic but varied values based on text
    const seed = baseHash + i * 7919;
    const value = Math.sin(seed) * 0.9;
    embedding.push(value);
  }

  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
};

export const generateEmbedding = async (text: string): Promise<number[]> => {
  if (!config.openaiApiKey || config.openaiApiKey === 'your_openai_api_key_here') {
    return generateMockEmbedding(text);
  }

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    return generateMockEmbedding(text);
  }
};
