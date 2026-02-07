#!/bin/bash

# =============================================================================
# START ALL SERVICES FOR ANGINA DETECTION APP
# =============================================================================
# 
# This script starts both the ML API service and the Laravel web app.
# 
# REQUIREMENTS:
#   - Model must be trained first (run: cd ml && python model.py)
#   - Both Python and PHP environments must be set up
#
# USAGE:
#   ./start-services.sh
#
# =============================================================================

set -e

echo "🫀 Starting Angina Pektoris Detection Services"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if model file exists
if [ ! -f "ml/angina_model.pkl" ]; then
    echo "❌ ERROR: Model file not found!"
    echo ""
    echo "Please train the model first:"
    echo "  cd ml"
    echo "  source .venv/bin/activate"
    echo "  python model.py"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓${NC} Model file found (ml/angina_model.pkl)"
echo ""

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $ML_PID $WEB_PID 2>/dev/null || true
    exit 0
}

trap cleanup INT TERM

# =============================================================================
# START ML API SERVICE
# =============================================================================
echo -e "${BLUE}▶${NC} Starting ML API Service on port 8000..."
cd ml
source .venv/bin/activate
uvicorn api:app --host 0.0.0.0 --port 8000 &
ML_PID=$!
cd ..

# Wait for ML service to be ready
echo "  Waiting for ML service to start..."
sleep 3

# Check if ML service is running
if curl -s http://localhost:8000/health > /dev/null; then
    echo -e "  ${GREEN}✓${NC} ML API is ready!"
else
    echo -e "  ${YELLOW}⚠${NC} ML API might still be starting..."
fi

echo ""

# =============================================================================
# START LARAVEL WEB APP
# =============================================================================
echo -e "${BLUE}▶${NC} Starting Laravel Web App on port 8001..."
cd web
php artisan serve --host 0.0.0.0 --port 8001 &
WEB_PID=$!
cd ..

echo "  Waiting for web server to start..."
sleep 2

echo ""
echo "================================================"
echo -e "${GREEN}✓ All services started!${NC}"
echo ""
echo "Access your application:"
echo "  🌐 Web App:     http://localhost:8001"
echo "  🔬 ML API:      http://localhost:8000"
echo "  📚 API Docs:    http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"
echo "================================================"
echo ""

# Keep script running
wait
