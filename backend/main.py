from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv
import uvicorn
import logging

load_dotenv()

app = FastAPI()
logging.basicConfig(level=logging.INFO)

developer_api_key = os.getenv('RIOT_API_KEY')

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/content")
async def get_valorant_content(locale: str = None):
    headers = {
        'X-Riot-Token': developer_api_key
    }
    params = {}
    if locale:
        params['locale'] = locale
    
    try:
        response = requests.get("https://na.api.riotgames.com/val/content/v1/contents", headers=headers, params=params)
        response.raise_for_status()
        content = response.json()
        logging.info("Content data fetched successfully.")
    except requests.exceptions.RequestException as e:
        logging.error(f"Error fetching Valorant content: {e}")
        raise HTTPException(status_code=response.status_code, detail="Error fetching Valorant content")
    
    return content

@app.get("/popularity")
async def get_popularity_data():
    # Mock popularity data. Replace with actual logic if available.
    popularity_data = {
        "agents": [
            {"name": "Jett", "popularity": 35},
            {"name": "Sage", "popularity": 30},
            {"name": "Phoenix", "popularity": 25},
            {"name": "Brimstone", "popularity": 10}
        ],
        "maps": [
            {"name": "Bind", "popularity": 40},
            {"name": "Haven", "popularity": 35},
            {"name": "Split", "popularity": 25}
        ]
    }
    logging.info("Popularity data fetched successfully.")
    return popularity_data

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)
