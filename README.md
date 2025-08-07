# Film Finder

A movie discovery application with streaming service availability.

## Features

- Browse and filter movies by genre, director, year, rating, and runtime
- Search movies by title
- View movie posters and details
- **NEW**: Check streaming service availability for movies

## Architecture

The application consists of two main components:

1. **Python Backend** (`app.py`): Dash-based web application with streaming service integration
2. **React Frontend** (`frontend/`): Modern React application with Material-UI components
3. **Streaming API** (`streaming_api.py`): Flask API that provides streaming service data to the frontend

## Streaming Service Integration

The application integrates with JustWatch API to provide real-time streaming availability for movies in Australia. The streaming data is served through a dedicated Flask API endpoint.

### API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/streaming/<title>` - Get streaming services for a movie title

### Response Format

```json
{
  "success": true,
  "title": "Movie Title",
  "services": [
    {
      "service_name": "Netflix",
      "icon_url": "https://...",
      "offer_url": "https://..."
    }
  ]
}
```

## Setup

### Backend Dependencies
```bash
pip install -r requirements.txt
```

### Frontend Dependencies
```bash
cd frontend
npm install
```

## Running the Application

### Python Backend (Dash)
```bash
python app.py
```

### Streaming API Server
```bash
python streaming_api.py
```

### React Frontend
```bash
cd frontend
npm start
```

## Environment Variables

- `REACT_APP_API_URL`: Base URL for the streaming API (default: http://localhost:5000)