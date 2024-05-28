from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
from typing import List
import joblib
import pandas as pd
import uvicorn

load_dotenv()

app = FastAPI()
model = joblib.load('performance_model.joblib')

class PredictionRequest(BaseModel):
    player_id: str
    match_data: List[dict]

class PredictionResponse(BaseModel):
    win_rate_prediction: float
    recommendations: List[str]

def preprocess_gameplay_data(gameplay_data: List[dict]) -> pd.DataFrame:
    # Implement detailed preprocessing steps here
    # Example placeholder implementation
    return pd.DataFrame(gameplay_data)

@app.post("/predict", response_model=PredictionResponse)
async def predict_performance(data: PredictionRequest):
    player_data = preprocess_gameplay_data(data.match_data)
    prediction = model.predict(player_data)

    # Example recommendations based on prediction
    recommendations = [
        "Focus on improving your aim accuracy.",
        "Try playing as different agents to diversify your skill set."
    ]
    
    return PredictionResponse(
        win_rate_prediction=prediction[0],
        recommendations=recommendations
    )

@app.get("/login")
async def login():
    authorization_url = f"{os.getenv('RSO_BASE_URL')}/oauth2/authorize"
    response_type = os.getenv('RESPONSE_TYPE')
    client_id = os.getenv('RSO_CLIENT_ID')
    redirect_uri = f"{os.getenv('APP_BASE_URL')}{os.getenv('APP_CALLBACK_PATH')}"
    scope = os.getenv('SCOPE')

    return RedirectResponse(f"{authorization_url}?response_type={response_type}&client_id={client_id}&redirect_uri={redirect_uri}&scope={scope}")

@app.get(os.getenv('APP_CALLBACK_PATH'))
async def oauth_callback(request: Request):
    code = request.query_params.get('code')
    token_url = f"{os.getenv('RSO_BASE_URL')}/oauth2/token"
    client_id = os.getenv('RSO_CLIENT_ID')
    client_secret = os.getenv('RSO_CLIENT_SECRET')
    redirect_uri = f"{os.getenv('APP_BASE_URL')}{os.getenv('APP_CALLBACK_PATH')}"

    token_response = requests.post(token_url, data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri,
        'client_id': client_id,
        'client_secret': client_secret
    })

    token_json = token_response.json()
    access_token = token_json['access_token']

    return RedirectResponse(url=f"/dashboard?access_token={access_token}")

@app.get("/dashboard")
async def dashboard(access_token: str):
    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    user_info_response = requests.get(f"{os.getenv('RSO_BASE_URL')}/userinfo", headers=headers)
    user_info = user_info_response.json()

    return {"message": f"Welcome {user_info['preferred_username']}! Here are your performance predictions and recommendations."}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)
