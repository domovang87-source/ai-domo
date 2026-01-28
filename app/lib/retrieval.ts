// app/lib/retrieval.ts
// RAG retrieval system for The Domo Dating Playbook

import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RetrievedChunk {
  content: string;
  metadata: {
    section: string;
    subsection: string;
    chunk_id: number;
    source: string;
  };
  similarity: number;
}

/**
 * Generate embedding for a text query using OpenAI
 */
async function generateQueryEmbedding(query: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  return response.data[0].embedding;
}

/**
 * Search the knowledge base for relevant chunks based on semantic similarity
 * @param query - User's question or message
 * @param matchCount - Number of chunks to retrieve (default: 3)
 * @param similarityThreshold - Minimum similarity score (default: 0.5)
 */
export async function retrieveRelevantKnowledge(
  query: string,
  matchCount: number = 3,
  similarityThreshold: number = 0.5
): Promise<RetrievedChunk[]> {
  try {
    // Generate embedding for the user's query
    const queryEmbedding = await generateQueryEmbedding(query);

    // Search Supabase knowledge base
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("search_knowledge", {
      query_embedding: queryEmbedding,
      match_count: matchCount,
      similarity_threshold: similarityThreshold,
    });

    if (error) {
      console.error("Error searching knowledge base:", error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log("No relevant knowledge found for query:", query);
      return [];
    }

    // Return formatted results
    return data.map((item: any) => ({
      content: item.content,
      metadata: item.metadata,
      similarity: item.similarity,
    }));
  } catch (error) {
    console.error("Error in retrieveRelevantKnowledge:", error);
    return [];
  }
}

/**
 * Format retrieved chunks for injection into system prompt
 */
export function formatRetrievedKnowledge(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) {
    return "";
  }

  const formattedChunks = chunks.map((chunk, index) => {
    return `
RELEVANT KNOWLEDGE FROM THE DOMO PLAYBOOK (${chunk.metadata.section}):
${chunk.content}
`;
  }).join("\n---\n");

  return `
CONTEXT FROM YOUR KNOWLEDGE BASE:
${formattedChunks}

Use the above knowledge to inform your response. Apply these exact frameworks and tactics.
`;
}
