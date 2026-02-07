#!/bin/bash

echo "🫀 Angina Pektoris Web App - Setup Script"
echo "=========================================="

# Check if composer is installed
if ! command -v composer &> /dev/null; then
    echo "❌ Composer not found. Please install Composer first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js first."
    exit 1
fi

echo "📦 Installing PHP dependencies..."
composer install

echo "📦 Installing Node.js dependencies..."
npm install

echo "🔑 Generating application key..."
php artisan key:generate

echo "🗄️ Creating database..."
touch database/database.sqlite

echo "🔄 Running migrations..."
php artisan migrate --force

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Terminal 1: php artisan serve"
echo "2. Terminal 2: npm run dev"
echo "3. Terminal 3: Start FastAPI (cd ../ml && uvicorn api:app --reload)"
echo ""
echo "Access the app at: http://localhost:8000"
