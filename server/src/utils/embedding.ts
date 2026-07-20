import OpenAI from 'openai';
import { config } from '../config';

const openai = new OpenAI({
  apiKey: config.openaiApiKey,
});

/**
 * MongoDB Atlas Vector Search requires creating a vector index in Atlas dashboard:
 * - Field: "embedding"
 * - Dimensions: 1536 (for text-embedding-3-small) or 384 (for mock)
 * - Similarity: "cosine"
 */

// Mock embedding generator for when OpenAI API key is not available
const generateMockEmbedding = (): number[] => {
  const embedding: number[] = [];
  for (let i = 0; i < 384; i++) {
    embedding.push(Math.random() * 2 - 1);
  }
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
};

export const generateEmbedding = async (text: string): Promise<number[]> => {
  if (!config.openaiApiKey || config.openaiApiKey === 'your_openai_api_key_here') {
    return generateMockEmbedding();
  }

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    return generateMockEmbedding();
  }
};
