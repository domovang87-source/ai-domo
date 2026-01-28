#!/bin/bash
# Deploy RAG system from ai-domo-dev to ai-domo (production)

set -e  # Exit on error

echo "🚀 Deploying RAG System to Production"
echo "======================================"
echo ""

DEV_DIR="/home/marek/Projects/ai-domo-dev"
PROD_DIR="/home/marek/Projects/ai-domo"

# Check directories exist
if [ ! -d "$DEV_DIR" ]; then
    echo "❌ Error: Dev directory not found: $DEV_DIR"
    exit 1
fi

if [ ! -d "$PROD_DIR" ]; then
    echo "❌ Error: Production directory not found: $PROD_DIR"
    exit 1
fi

echo "📂 Copying files from dev to production..."
echo ""

# Create lib directory if it doesn't exist
mkdir -p "$PROD_DIR/app/lib"

# Copy new library files
echo "  ✅ Copying app/lib/retrieval.ts"
cp "$DEV_DIR/app/lib/retrieval.ts" "$PROD_DIR/app/lib/"

echo "  ✅ Copying app/lib/messaging.ts"
cp "$DEV_DIR/app/lib/messaging.ts" "$PROD_DIR/app/lib/"

echo "  ✅ Copying app/lib/openers.ts"
cp "$DEV_DIR/app/lib/openers.ts" "$PROD_DIR/app/lib/"

# Copy modified API route
echo "  ✅ Copying app/api/chat-api/route.ts"
cp "$DEV_DIR/app/api/chat-api/route.ts" "$PROD_DIR/app/api/chat-api/"

# Copy documentation
echo "  ✅ Copying documentation files"
cp "$DEV_DIR/RAG_COMPLETE.md" "$PROD_DIR/"
cp "$DEV_DIR/DEPLOYMENT_GUIDE.md" "$PROD_DIR/"
cp "$DEV_DIR/GUIDE_FOR_CURSOR.md" "$PROD_DIR/"
cp "$DEV_DIR/supabase-embeddings-schema.sql" "$PROD_DIR/"
cp "$DEV_DIR/book_chunks.json" "$PROD_DIR/"

# Copy scripts folder
echo "  ✅ Copying scripts folder"
cp -r "$DEV_DIR/scripts" "$PROD_DIR/" 2>/dev/null || true

echo ""
echo "✅ Files copied successfully!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Set up production database (if not done yet):"
echo "   - Go to Supabase Dashboard"
echo "   - Run the SQL from: $PROD_DIR/supabase-embeddings-schema.sql"
echo ""
echo "2. Upload embeddings to production (if not done yet):"
echo "   cd $PROD_DIR"
echo "   npx ts-node scripts/generate_embeddings.ts"
echo ""
echo "3. Commit and push to GitHub:"
echo "   cd $PROD_DIR"
echo "   git add ."
echo "   git commit -m 'Add RAG system with The Domo Dating Playbook'"
echo "   git push origin main"
echo ""
echo "4. Vercel will auto-deploy (wait 2-3 minutes)"
echo ""
echo "5. Test production: https://ai-domo-domo-vangs-projects.vercel.app"
echo ""
