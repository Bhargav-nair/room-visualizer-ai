# FastAPI Backend Example for RoomGen MVP
# This file is for reference only - run separately from the React frontend

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import openai
import requests
import os
import json
from typing import List, Dict, Any

app = FastAPI(title="RoomGen API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for serving saved images
app.mount("/static", StaticFiles(directory="static"), name="static")

# Environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
RECRAFT_API_KEY = os.getenv("RECRAFT_API_KEY")

# Request/Response models
class MagicPromptRequest(BaseModel):
    prompt: str

class MagicPromptResponse(BaseModel):
    enhanced_prompt: str

class GenerateImageRequest(BaseModel):
    prompt: str
    style: str = "recraft-v3-raw"

class GenerateImageResponse(BaseModel):
    image_url: str
    image_id: str

class FloorPlanRoom(BaseModel):
    id: str
    name: str
    polygon: List[List[float]]
    height: float

class FloorPlan(BaseModel):
    units: str
    rooms: List[FloorPlanRoom]
    openings: List[Dict[str, Any]]
    furniture: List[Dict[str, Any]]

class LayoutSuggestion(BaseModel):
    type: str
    message: str

class OptimizeLayoutResponse(BaseModel):
    suggestions: List[LayoutSuggestion]

@app.get("/")
async def root():
    return {"message": "RoomGen API is running"}

@app.post("/magic-prompt", response_model=MagicPromptResponse)
async def magic_prompt(request: MagicPromptRequest):
    """Enhance user's style prompt using OpenAI GPT-4o-mini"""
    try:
        if not OPENAI_API_KEY:
            raise HTTPException(status_code=500, detail="OpenAI API key not configured")
        
        openai.api_key = OPENAI_API_KEY
        
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are an interior design expert. Enhance the user's room style prompt by improving grammar, clarity, and adding specific design details. Keep it concise but descriptive. Focus on lighting, materials, colors, and atmosphere."
                },
                {
                    "role": "user",
                    "content": f"Enhance this room style prompt: {request.prompt}"
                }
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        enhanced_prompt = response.choices[0].message.content.strip()
        return MagicPromptResponse(enhanced_prompt=enhanced_prompt)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error enhancing prompt: {str(e)}")

@app.post("/gen-image", response_model=GenerateImageResponse)
async def generate_image(request: GenerateImageRequest):
    """Generate top-view room image using Recraft AI"""
    try:
        if not RECRAFT_API_KEY:
            raise HTTPException(status_code=500, detail="Recraft API key not configured")
        
        headers = {
            "Authorization": f"Bearer {RECRAFT_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "prompt": f"Top-view architectural floor plan of {request.prompt}, clean lines, professional blueprint style, high contrast, 1024x1024",
            "style": request.style,
            "size": "1024x1024",
            "response_format": "url"
        }
        
        response = requests.post(
            "https://external.api.recraft.ai/v1/images/generations",
            headers=headers,
            json=payload
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Recraft API error")
        
        result = response.json()
        image_url = result["data"][0]["url"]
        image_id = result["data"][0]["revised_prompt"][:50].replace(" ", "_")
        
        return GenerateImageResponse(image_url=image_url, image_id=image_id)
        
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error generating image: {str(e)}")

@app.post("/optimize-layout", response_model=OptimizeLayoutResponse)
async def optimize_layout(floor_plan: FloorPlan):
    """Analyze floor plan and provide layout optimization suggestions"""
    try:
        suggestions = []
        
        for room in floor_plan.rooms:
            # Calculate room area
            polygon = room.polygon
            area = 0
            for i in range(len(polygon)):
                j = (i + 1) % len(polygon)
                area += polygon[i][0] * polygon[j][1]
                area -= polygon[j][0] * polygon[i][1]
            area = abs(area) / 2
            
            # Convert area based on units
            if floor_plan.units == "cm":
                area_sqm = area / 10000  # cm² to m²
            else:
                area_sqm = area  # assume meters
            
            # Rule-based suggestions
            if area_sqm < 10:
                suggestions.append(LayoutSuggestion(
                    type="warning",
                    message=f"{room.name} is quite small ({area_sqm:.1f}m²). Consider space-saving furniture."
                ))
            elif area_sqm > 50:
                suggestions.append(LayoutSuggestion(
                    type="info",
                    message=f"{room.name} is spacious ({area_sqm:.1f}m²). Consider creating distinct zones."
                ))
            else:
                suggestions.append(LayoutSuggestion(
                    type="success",
                    message=f"{room.name} has optimal size ({area_sqm:.1f}m²) for comfortable living."
                ))
            
            # Check room proportions
            min_x = min(point[0] for point in polygon)
            max_x = max(point[0] for point in polygon)
            min_y = min(point[1] for point in polygon)
            max_y = max(point[1] for point in polygon)
            
            width = abs(max_x - min_x)
            height = abs(max_y - min_y)
            
            if floor_plan.units == "cm":
                width_m = width / 100
                height_m = height / 100
            else:
                width_m = width
                height_m = height
            
            aspect_ratio = max(width_m, height_m) / min(width_m, height_m)
            
            if aspect_ratio > 3:
                suggestions.append(LayoutSuggestion(
                    type="warning",
                    message=f"{room.name} has an unusual aspect ratio. Consider furniture placement along the longer wall."
                ))
        
        return OptimizeLayoutResponse(suggestions=suggestions)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error optimizing layout: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)