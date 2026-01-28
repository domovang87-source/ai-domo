#!/usr/bin/env node
/**
 * Test the RAG retrieval system
 * Run: npx ts-node scripts/test_rag.ts
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Import after setting up env
const { retrieveRelevantKnowledge, formatRetrievedKnowledge } = await import('../app/lib/retrieval.js');

async function testRAG() {
  const testQueries = [
    "How do I handle coffee date requests?",
    "She's ghosting me after 3 dates",
    "What should my first message be on Hinge?",
    "How do I escalate physically on a first date?",
    "We're in a situationship for 2 months, what should I do?",
  ];

  console.log("🧪 Testing RAG Retrieval System\n");

  for (const query of testQueries) {
    console.log(`\n${"=".repeat(80)}`);
    console.log(`📝 Query: "${query}"`);
    console.log(`${"=".repeat(80)}`);

    const chunks = await retrieveRelevantKnowledge(query, 2, 0.5);

    if (chunks.length === 0) {
      console.log("❌ No relevant chunks found");
    } else {
      console.log(`✅ Found ${chunks.length} relevant chunks:\n`);

      chunks.forEach((chunk, i) => {
        console.log(`--- Chunk ${i + 1} (Similarity: ${chunk.similarity.toFixed(3)}) ---`);
        console.log(`Section: ${chunk.metadata.section}`);
        console.log(`Subsection: ${chunk.metadata.subsection}`);
        console.log(`Content: ${chunk.content.substring(0, 200)}...\n`);
      });
    }

    // Wait a bit to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log("\n✅ RAG testing complete!");
}

testRAG().catch(console.error);
