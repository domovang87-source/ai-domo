#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo ""
    echo "Please install Node.js first:"
    echo "1. Visit: https://nodejs.org/en/download/"
    echo "2. Download the macOS installer (.pkg file)"
    echo "3. Run the installer"
    echo "4. Open a new terminal and run this script again"
    echo ""
    echo "Or install via Homebrew:"
    echo "  brew install node"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local file not found!"
    echo "   The app needs OPENAI_API_KEY to work."
fi

echo ""
echo "🚀 Starting development server..."
echo "   The app will be available at: http://localhost:3000"
echo "   Press Ctrl+C to stop the server"
echo ""

npm run dev
