# 🚀 Deploying RAG System to Production

This guide will help you deploy the RAG-enhanced AI Domo to production on Vercel.

---

## Prerequisites Checklist

Before deploying, make sure you have:

- [x] Tested the RAG system locally (http://localhost:3002)
- [x] Verified advice quality is better than production
- [ ] Access to Supabase Dashboard (production database)
- [ ] Access to GitHub repository
- [ ] Access to Vercel dashboard

---

## Part 1: Set Up Production Database (15 minutes)

### Step 1: Enable pgvector in Production Supabase

1. Go to **production** Supabase Dashboard:
   https://supabase.com/dashboard/project/gyfkdtswvfkkjisnkqpz

2. Click **SQL Editor** → **New Query**

3. Copy and paste this SQL:

```sql
-- Enable pgvector extension for vector similarity search
create extension if not exists vector;

-- Create table for storing book chunks and their embeddings
create table if not exists knowledge_base (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  embedding vector(1536),
  metadata jsonb,
  created_at timestamp with time zone default now()
);

-- Create index for fast similarity search using cosine distance
create index on knowledge_base using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

-- Create function for semantic search
create or replace function search_knowledge(
  query_embedding vector(1536),
  match_count int default 5,
  similarity_threshold float default 0.5
)
returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    knowledge_base.id,
    knowledge_base.content,
    knowledge_base.metadata,
    1 - (knowledge_base.embedding <=> query_embedding) as similarity
  from knowledge_base
  where 1 - (knowledge_base.embedding <=> query_embedding) > similarity_threshold
  order by knowledge_base.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Grant access to authenticated users
grant select on knowledge_base to authenticated;
grant execute on function search_knowledge to authenticated;

-- Add comment for documentation
comment on table knowledge_base is 'Vector embeddings of The Domo Dating Playbook for RAG retrieval';
```

4. Click **Run** → Should see "Success. No rows returned"

### Step 2: Upload Book Embeddings to Production

**Important**: Make sure your `.env.local` has PRODUCTION credentials before running this!

```bash
cd /home/marek/Projects/ai-domo-dev
npx ts-node scripts/generate_embeddings.ts
```

You should see:
```
✅ Upload complete!
   Success: 51/51
   Errors: 0
```

### Step 3: Verify Upload

Go to Supabase Dashboard → **Table Editor** → Select `knowledge_base`

You should see **51 rows** with your book content and embeddings.

---

## Part 2: Deploy to GitHub & Vercel (10 minutes)

### Step 1: Copy Changes to Main Project

```bash
# Copy all improved files to the main project
cd /home/marek/Projects/ai-domo-dev

# Copy new files
cp app/lib/retrieval.ts /home/marek/Projects/ai-domo/app/lib/
cp app/lib/messaging.ts /home/marek/Projects/ai-domo/app/lib/
cp app/lib/openers.ts /home/marek/Projects/ai-domo/app/lib/

# Copy modified files
cp app/api/chat-api/route.ts /home/marek/Projects/ai-domo/app/api/chat-api/

# Copy documentation
cp RAG_COMPLETE.md /home/marek/Projects/ai-domo/
cp DEPLOYMENT_GUIDE.md /home/marek/Projects/ai-domo/
cp supabase-embeddings-schema.sql /home/marek/Projects/ai-domo/
cp book_chunks.json /home/marek/Projects/ai-domo/

# Copy scripts folder
cp -r scripts /home/marek/Projects/ai-domo/
```

### Step 2: Commit to GitHub

```bash
cd /home/marek/Projects/ai-domo

git add .

git commit -m "$(cat <<'EOF'
Add RAG system with The Domo Dating Playbook

Major improvements:
- RAG retrieval system using Supabase pgvector
- All 9,500 words of playbook now searchable
- Enhanced messaging frameworks from PDF
- Improved opener templates
- Better response quality and context awareness
- Increased max_tokens to 1500 for detailed advice
- Conditional output format (texting vs strategy)

Technical changes:
- New: app/lib/retrieval.ts (RAG search)
- New: app/lib/messaging.ts (messaging frameworks)
- New: app/lib/openers.ts (opener templates)
- Modified: app/api/chat-api/route.ts (RAG integration)
- New: Supabase knowledge_base table (51 book chunks)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"

git push origin main
```

### Step 3: Verify Vercel Deployment

1. Go to Vercel Dashboard:
   https://vercel.com/domo-vangs-projects/ai-domo

2. You should see a new deployment starting automatically

3. Wait for it to complete (~2-3 minutes)

4. Click the deployment URL to test

---

## Part 3: Test Production

Once deployed, test the production site:

**URL**: https://ai-domo-domo-vangs-projects.vercel.app

### Test These Queries:

1. "Give me a good first message to send on Hinge"
   - Should give ONE clean opener: "Hurry up and match me"

2. "How many messages before asking her out?"
   - Should mention "3 pairs of messages (6 total)"

3. "She suggested coffee for our first date"
   - Should recommend upgrading to better venue

4. "What photos should I use on my profile?"
   - Should give photo strategy (no forced text template)

### Check Server Logs in Vercel:

Go to Vercel → Your Deployment → **Runtime Logs**

You should see:
```
✅ Retrieved 5 relevant chunks from playbook
```

---

## Part 4: Troubleshooting

### "Error: relation 'knowledge_base' does not exist"
→ You didn't run the SQL in production Supabase (Part 1, Step 1)

### "No relevant knowledge found for query"
→ You didn't upload embeddings to production (Part 1, Step 2)

### Vercel deployment failed
→ Check Vercel logs for specific error
→ Make sure all new files were committed to GitHub

### Advice quality hasn't improved
→ Check Vercel runtime logs - make sure you see "Retrieved X relevant chunks"
→ Verify knowledge_base table has 51 rows in production Supabase

---

## Part 5: Cost Breakdown

### One-Time Setup:
- Generate 51 embeddings: **$0.05** ✅

### Ongoing Per User Query:
- Embedding generation: **~$0.00001** (fractions of a cent)
- 1,000 user queries = **$0.01** (one penny)
- OpenAI chat completion: **~$0.001** per response

**Total per conversation**: ~$0.001 (one-tenth of a cent)

---

## Summary Checklist

Before marking as complete, verify:

- [ ] SQL ran successfully in production Supabase
- [ ] 51 book chunks uploaded to production `knowledge_base` table
- [ ] All files copied from ai-domo-dev to ai-domo
- [ ] Changes committed and pushed to GitHub
- [ ] Vercel auto-deployed successfully
- [ ] Production site tested with sample queries
- [ ] RAG retrieval working (check Vercel logs)
- [ ] Advice quality improved vs old version

---

**When all checkboxes are complete, the RAG system is live in production! 🎉**
