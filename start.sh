#!/bin/bash

# Folklore Globe - Quick Start Script
# Starts a local development server

echo "🪵 Folklore Globe - Starting local server..."
echo ""

# Check for Python 3
if command -v python3 &> /dev/null; then
    echo "✓ Python 3 found"
    echo "🌐 Starting server on http://localhost:8000"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000
# Check for Node.js
elif command -v node &> /dev/null; then
    echo "✓ Node.js found"
    echo "🌐 Starting server..."
    echo ""
    npx serve -l 8000
# Check for PHP
elif command -v php &> /dev/null; then
    echo "✓ PHP found"
    echo "🌐 Starting server on http://localhost:8000"
    echo ""
    php -S localhost:8000
else
    echo "❌ No suitable server found!"
    echo ""
    echo "Please install one of the following:"
    echo "  - Python 3: https://www.python.org/"
    echo "  - Node.js: https://nodejs.org/"
    echo "  - PHP: https://www.php.net/"
    echo ""
    echo "Or open index.html directly in a modern browser"
    exit 1
fi
