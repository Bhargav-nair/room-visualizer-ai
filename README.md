# RoomGen MVP - Floor Plan → Magic Prompt → 3D Room

A minimal full-stack MVP app that transforms floor plans into beautiful 3D room visualizations using AI-powered style prompts.

## Features

### Frontend (React + Tailwind + Three.js)
- **Left Panel:**
  - Textarea for user style prompt
  - Magic Prompt button (enhances grammar/clarity)
  - Generate Top View button (calls Recraft AI)
  - Preview of generated image
  - List of layout suggestions

- **Right Panel:**
  - 3D viewer (Three.js + OrbitControls)
  - Renders extruded 3D room from FloorPlanJSON
  - Interactive camera controls (rotate, zoom, pan)

### Backend (FastAPI)
- `/magic-prompt` → uses OpenAI GPT-4o-mini to clean/improve prompt
- `/gen-image` → calls Recraft AI Image Generation API (1024x1024, style recraft-v3-raw)
- `/optimize-layout` → rule-based checks (room size, proportions, etc.)
- `/static` → serve saved images

## Data Contract Example (FloorPlanJSON)

```json
{
  "units": "cm",
  "rooms": [
    {
      "id": "room-1",
      "name": "Living Room",
      "polygon": [[0,0], [500,0], [500,400], [0,400]],
      "height": 300
    }
  ],
  "openings": [],
  "furniture": []
}
```

## Environment Variables

```bash
OPENAI_API_KEY=your_openai_key_here
RECRAFT_API_KEY=your_recraft_key_here
```

## Quick Start

### Option 1: Frontend Only (Current Setup)
The frontend is ready to run and includes mock API responses:

```bash
npm install
npm run dev
```

### Option 2: Full Stack (Frontend + Backend)

**Backend:**
```bash
cd backend-example
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
npm install
npm run dev
```

## Technology Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Three.js, React Three Fiber
- **Backend:** FastAPI, OpenAI API, Recraft AI API
- **UI Components:** shadcn/ui with custom architectural design system

## Design System

The app features a modern architectural design with:
- Cool blue/gray palette for professional feel
- Smooth animations and transitions
- Card-based layouts with soft shadows
- Semantic color tokens for consistency
- Responsive split-panel layout

## API Integration

The frontend is currently set up with mock responses. To integrate with the actual backend:

1. Update the API calls in `ControlPanel.tsx` to point to your FastAPI server
2. Replace mock responses with actual fetch calls
3. Handle loading states and error responses

## Next Steps

- [ ] Integrate actual backend API calls
- [ ] Add file upload for custom floor plans
- [ ] Expand furniture placement features
- [ ] Add more room types and templates
- [ ] Implement user authentication
- [ ] Add export functionality for 3D models

## Note

This is a Lovable project that runs React + Vite + TypeScript. The FastAPI backend is provided as a reference implementation and needs to be run separately. For a fully integrated solution, consider using Supabase Edge Functions instead of FastAPI.