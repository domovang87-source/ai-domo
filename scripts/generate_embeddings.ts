#!/usr/bin/env node
/**
 * Generate embeddings for all book chunks and upload to Supabase.
 * Run: npx ts-node scripts/generate_embeddings.ts
 */

import fs from 'fs';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Chunk {
  chunk_id: number;
  content: string;
  section: string;
  subsection: string;
  word_count: number;
  metadata: any;
}

async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return response.data[0].embedding;
}

async function uploadChunksToSupabase(chunks: Chunk[]) {
  console.log(`📤 Uploading ${chunks.length} chunks to Supabase...`);

  let successCount = 0;
  let errorCount = 0;

  for (const chunk of chunks) {
    try {
      console.log(`Processing chunk ${chunk.chunk_id}/${chunks.length}...`);

      // Generate embedding
      const embedding = await generateEmbedding(chunk.content);

      // Insert into Supabase
      const { error } = await supabase
        .from('knowledge_base')
        .insert({
          content: chunk.content,
          embedding: embedding,
          metadata: {
            section: chunk.section,
            subsection: chunk.subsection,
            chunk_id: chunk.chunk_id,
            word_count: chunk.word_count,
            source: 'The Domo Dating Playbook'
          }
        });

      if (error) {
        console.error(`❌ Error uploading chunk ${chunk.chunk_id}:`, error.message);
        errorCount++;
      } else {
        successCount++;
      }

      // Rate limit: Wait 100ms between requests to avoid hitting OpenAI rate limits
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error: any) {
      console.error(`❌ Error processing chunk ${chunk.chunk_id}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n✅ Upload complete!`);
  console.log(`   Success: ${successCount}/${chunks.length}`);
  console.log(`   Errors: ${errorCount}`);
}

async function main() {
  // Load chunks
  const chunksPath = '/home/marek/Projects/ai-domo-dev/book_chunks.json';
  const chunksData = fs.readFileSync(chunksPath, 'utf-8');
  const chunks: Chunk[] = JSON.parse(chunksData);

  console.log(`📖 Loaded ${chunks.length} chunks from The Domo Dating Playbook`);
  console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`🔑 Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`🔑 Supabase Service Key: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing'}`);

  if (!process.env.OPENAI_API_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('\n❌ Missing required environment variables. Check your .env.local file.');
    process.exit(1);
  }

  console.log(`\n🚀 Starting embedding generation and upload...`);
  console.log(`⏱️  Estimated time: ~${Math.ceil(chunks.length * 0.2)} seconds\n`);

  await uploadChunksToSupabase(chunks);
}

main().catch(console.error);
