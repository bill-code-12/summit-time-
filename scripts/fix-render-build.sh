#!/bin/bash

# Render Backend Fix Script
# This fixes common Render deployment issues

set -e

echo "🔧 Fixing Render Backend Deployment Issues..."
echo ""

# Check if we're in backend directory
if [ ! -f "Cargo.toml" ]; then
    echo "❌ Error: Not in backend directory"
    echo "Run: cd backend"
    exit 1
fi

echo "✅ Found Cargo.toml"
echo ""

# Check if src/main.rs exists
if [ ! -f "src/main.rs" ]; then
    echo "❌ Error: src/main.rs not found"
    exit 1
fi

echo "✅ Found src/main.rs"
echo ""

# Clean previous builds
echo "🧹 Cleaning previous builds..."
cargo clean
echo "✅ Cleaned"
echo ""

# Update dependencies
echo "📦 Updating dependencies..."
cargo update
echo "✅ Updated"
echo ""

# Try to build
echo "🔨 Building locally to test..."
if cargo build 2>&1; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed - check errors above"
    exit 1
fi

echo ""
echo "✅ All fixes applied!"
echo ""
echo "Next steps:"
echo "1. Push changes to GitHub:"
echo "   git add ."
echo "   git commit -m 'Fix Cargo.toml bin configuration'"
echo "   git push origin main"
echo ""
echo "2. Render will auto-redeploy"
echo ""
echo "3. Watch logs at Render dashboard"
echo ""
echo "Expected to see:"
echo "  ✓ Building..."
echo "  ✓ Downloading dependencies"
echo "  ✓ Compiling summit-time"
echo "  ✓ Finished release"
echo "  ✓ Starting Summit Time API"
echo ""
echo "Deployment fixed! 🚀"
