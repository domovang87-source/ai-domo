-- Enable pgvector extension for vector similarity search
create extension if not exists vector;

-- Create table for storing book chunks and their embeddings
create table if not exists knowledge_base (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  embedding vector(1536),  -- OpenAI text-embedding-3-small produces 1536-dimensional vectors
  metadata jsonb,           -- Store section, topic, page, etc.
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
