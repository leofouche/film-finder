# Film Finder - GitHub Copilot Developer Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the instructions here.

## Application Overview

Film Finder is a full-stack film discovery and recommendation application with two distinct interfaces:

1. **Python/Dash Backend** (`app.py`) - Dark-themed data table interface with streaming integration
2. **React/TypeScript Frontend** (`frontend/`) - Modern card-based UI with advanced filtering

Both applications share the same film database (`data/clean.csv`) containing 7,628+ films with IMDB ratings, genres, directors, and metadata.

![Dashboard Screenshot](https://github.com/user-attachments/assets/4040171d-f289-4667-b38d-8b53f0500320)

## Working Effectively

### CRITICAL: Build & Test Timing Requirements
- **NEVER CANCEL long-running commands** - Builds may take 45+ minutes. ALWAYS set timeouts ≥60 minutes for builds, ≥30 minutes for tests.
- **Python dependencies**: ~30 seconds with `pip install -r requirements.txt`
- **React dependencies**: ~7 minutes with `npm install` in `frontend/` directory
- **React build**: ~25 seconds with `npm run build`
- **React tests**: ~7 seconds with `npm test -- --coverage --watchAll=false`
- **Dash app startup**: ~5 seconds to serve on port 8050
- **React dev server**: ~30 seconds to serve on port 3000

### Quick Setup Commands
Bootstrap and run the complete application:

```bash
# Backend (Python/Dash) - NEVER CANCEL, timeout 60+ minutes
pip install -r requirements.txt  # ~30 seconds

# Frontend (React) - NEVER CANCEL, timeout 10+ minutes  
cd frontend && npm install  # ~7 minutes
npm run build               # ~25 seconds
npm test -- --coverage --watchAll=false  # ~7 seconds
```

### Running Applications

**Python/Dash Backend:**
```bash
python3 app.py
# Serves on http://127.0.0.1:8050
# Features: data table, pagination, streaming integration (Australia)
```

**React Frontend:**
```bash
cd frontend && npm start
# Serves on http://localhost:3000  
# Features: card UI, advanced filters, responsive design
```

## Network Limitations & Expected Failures

**IMPORTANT**: Several external APIs fail in sandboxed environments. These are EXPECTED failures:

- **JustWatch API** (streaming data): Network blocked - returns 500 errors in Dash app
- **OMDB API** (movie posters): Network blocked - shows "No poster available" in React app
- **Google Fonts**: Network blocked - fonts may not load properly

These failures do NOT prevent core functionality from working.

## Validation Requirements

### Manual Testing Scenarios
Always execute these complete user workflows after making changes:

**Dash Application (Backend):**
1. Start app with `python3 app.py` 
2. Navigate to http://127.0.0.1:8050
3. Verify film table loads with 10 films per page
4. Test search: Type "batman" in search box, verify filtering works
5. Test genre tabs: Click different genre tabs, verify filtering
6. Test row selection: Click radio button, verify director table populates
7. Test pagination: Click page 2, verify new films load
8. **Expected**: Streaming services show "No film selected" (API blocked)

**React Frontend:**
1. Start with `cd frontend && npm start`
2. Navigate to http://localhost:3000
3. Wait for CSV to load (~10 seconds)
4. Verify movie cards display with pagination
5. Test search: Type "batman", verify 12 Batman films show
6. Test filters: Use genre dropdown, year sliders, rating sliders
7. Test pagination: Navigate between pages
8. **Expected**: Posters show "No poster available" (API blocked)

### Build Validation
Always run these commands to ensure CI compatibility:

```bash
# Python (Backend)
pip install -r requirements.txt
python3 app.py &  # Test starts successfully
python3 utils.py  # Expected: Network failure (normal in sandbox)

# React (Frontend) 
cd frontend
npm install  # NEVER CANCEL - takes 7 minutes
npm run build  # Must complete successfully
npm test -- --coverage --watchAll=false  # Must pass all tests
```

## Development Patterns

### Code Style & Standards
- **Python**: Follow PEP 8, use type hints where helpful
- **React/TypeScript**: ESLint configuration enforced during build
- **CSS**: Material-UI components preferred, dark theme consistency

### Common Modification Points
- **Film data structure**: `data/clean.csv` (849KB, 7628+ films)
- **Backend filtering**: `app.py` lines 225-248 (filter_table callback)
- **Frontend filtering**: `frontend/src/utils/movieUtils.ts`
- **Styling**: 
  - Dash: `app.py` lines 82-92 (table_row_formatting)
  - React: `frontend/src/App.tsx` theme configuration

### Testing Strategy
- **Backend**: No formal test suite - validate manually via browser testing
- **Frontend**: Jest test suite with coverage reporting
- **Integration**: Run both apps simultaneously to test full stack

### Debugging Common Issues

**Build Failures:**
- React: Check for unused imports (enforced by CI=true)
- Python: Verify all dependencies in requirements.txt
- Network: External API failures are expected and normal

**Runtime Issues:**
- CSV loading: Check `data/clean.csv` exists and is readable
- Port conflicts: Backend uses 8050, frontend uses 3000
- Memory: Large dataset may take 5-10 seconds to load in React

## File Structure Reference

```
film-finder/
├── app.py                 # Dash application entry point
├── utils.py              # JustWatch API integration (network blocked)
├── data/clean.csv        # Film database (849KB, 7628+ films)
├── requirements.txt      # Python dependencies
├── pyproject.toml        # Python project metadata
├── Procfile             # Heroku deployment config
├── package.json         # Root npm scripts for GitHub Pages
└── frontend/            # React application
    ├── package.json     # React dependencies
    ├── src/
    │   ├── App.tsx      # Main application component
    │   ├── components/  # MovieCard, Filters components
    │   ├── utils/       # movieUtils.ts, omdbApi.ts
    │   └── types/       # TypeScript definitions
    ├── public/          # Static assets
    └── build/           # Production build output
```

## Deployment Information

- **Production Backend**: Configured for Heroku via Procfile
- **Production Frontend**: GitHub Pages via `npm run deploy`
- **Development**: Local servers for rapid iteration

Always test both interfaces and ensure core functionality works despite expected network API failures.