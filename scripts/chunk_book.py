#!/usr/bin/env python3
"""
Chunk The Domo Dating Playbook into semantic sections for RAG.
Each chunk is a complete thought/framework (~200-400 words).
"""

import json
import re
from typing import List, Dict

def parse_book_into_chunks(book_path: str) -> List[Dict]:
    """Parse the book into semantic chunks with metadata."""

    with open(book_path, 'r', encoding='utf-8') as f:
        content = f.read()

    chunks = []

    # Split by major sections (lines that are ALL CAPS or start with "PART")
    lines = content.split('\n')

    current_section = "Introduction"
    current_subsection = ""
    current_chunk = []
    word_count = 0

    for line in lines:
        line = line.strip()

        # Skip empty lines at chunk boundaries
        if not line:
            if current_chunk:
                current_chunk.append('')
            continue

        # Detect major section headers (PART 1, PART 2, etc.)
        if line.startswith('PART ') and ':' in line:
            # Save previous chunk
            if current_chunk:
                chunk_text = '\n'.join(current_chunk).strip()
                if chunk_text:
                    chunks.append({
                        'content': chunk_text,
                        'section': current_section,
                        'subsection': current_subsection,
                        'word_count': word_count
                    })

            current_section = line
            current_subsection = ""
            current_chunk = [line]
            word_count = len(line.split())
            continue

        # Detect subsection headers (lines that are questions or bold statements)
        if (line.endswith('?') and len(line.split()) < 15) or \
           (line[0].isupper() and not line.endswith('.') and len(line.split()) < 15):
            # This might be a subsection header
            if word_count > 150:  # Current chunk is big enough, save it
                chunk_text = '\n'.join(current_chunk).strip()
                if chunk_text:
                    chunks.append({
                        'content': chunk_text,
                        'section': current_section,
                        'subsection': current_subsection,
                        'word_count': word_count
                    })
                current_chunk = [line]
                current_subsection = line
                word_count = len(line.split())
            else:
                # Add to current chunk
                current_chunk.append(line)
                word_count += len(line.split())
                if not current_subsection:
                    current_subsection = line
        else:
            # Regular content line
            current_chunk.append(line)
            word_count += len(line.split())

            # If chunk is getting too large (>500 words), split it
            if word_count > 500:
                chunk_text = '\n'.join(current_chunk).strip()
                if chunk_text:
                    chunks.append({
                        'content': chunk_text,
                        'section': current_section,
                        'subsection': current_subsection,
                        'word_count': word_count
                    })
                current_chunk = []
                word_count = 0

    # Save final chunk
    if current_chunk:
        chunk_text = '\n'.join(current_chunk).strip()
        if chunk_text:
            chunks.append({
                'content': chunk_text,
                'section': current_section,
                'subsection': current_subsection,
                'word_count': word_count
            })

    # Filter out very small chunks (<50 words)
    chunks = [c for c in chunks if c['word_count'] >= 50]

    # Add IDs and clean up
    for i, chunk in enumerate(chunks):
        chunk['chunk_id'] = i + 1
        chunk['metadata'] = {
            'section': chunk['section'],
            'subsection': chunk['subsection'],
            'chunk_id': chunk['chunk_id'],
            'source': 'The Domo Dating Playbook'
        }

    return chunks

def save_chunks(chunks: List[Dict], output_path: str):
    """Save chunks to JSON file."""
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(chunks, f, indent=2, ensure_ascii=False)

    # Print summary
    total_words = sum(c['word_count'] for c in chunks)
    print(f"✅ Created {len(chunks)} chunks")
    print(f"📊 Total words: {total_words}")
    print(f"📏 Avg chunk size: {total_words // len(chunks)} words")
    print(f"💾 Saved to: {output_path}")

if __name__ == '__main__':
    book_path = '/tmp/domo_playbook_content.txt'
    output_path = '/home/marek/Projects/ai-domo-dev/book_chunks.json'

    print("📖 Parsing The Domo Dating Playbook...")
    chunks = parse_book_into_chunks(book_path)
    save_chunks(chunks, output_path)
