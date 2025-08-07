#!/bin/bash
# Script to start both the streaming API and React frontend

echo "🎬 Starting Film Finder application..."

# Start the streaming API in the background
echo "Starting streaming API server..."
cd /home/runner/work/film-finder/film-finder
python streaming_api.py &
API_PID=$!

# Wait a moment for the API to start
sleep 3

# Start the React frontend
echo "Starting React frontend..."
cd frontend

# Check if node_modules exists, if not run npm install
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

npm start &
FRONTEND_PID=$!

echo "✅ Both services started!"
echo "📡 API running on http://localhost:5000"
echo "🌐 Frontend running on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping services..."
    kill $API_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT

# Wait for either process to exit
wait