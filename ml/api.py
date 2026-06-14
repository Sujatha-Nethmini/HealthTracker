from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
import torch.nn as nn
import tensorflow as tf
import numpy as np
import pickle

app = FastAPI()

# Allow React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load PyTorch calorie model ──────────────────────────
class CaloriePredictor(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(3, 32), nn.ReLU(),
            nn.Linear(32, 16), nn.ReLU(),
            nn.Linear(16, 1)
        )
    def forward(self, x):
        return self.net(x)

calorie_model = CaloriePredictor()
import os
BASE = os.path.dirname(os.path.abspath(__file__))

calorie_model.load_state_dict(torch.load(os.path.join(BASE, "calorie_model.pth"), weights_only=True))

with open(os.path.join(BASE, "scaler_X.pkl"), "rb") as f: scaler_X = pickle.load(f)
with open(os.path.join(BASE, "scaler_y.pkl"), "rb") as f: scaler_y = pickle.load(f)

sleep_model = tf.keras.models.load_model(os.path.join(BASE, "sleep_model.keras"))
with open(os.path.join(BASE, "scaler_sleep.pkl"), "rb") as f: scaler_sleep = pickle.load(f)

ACTIVITY_MAP   = {"running": 0, "cycling": 1, "swimming": 2, "gym": 3, "walking": 4}
QUALITY_LABELS = ["poor", "fair", "good"]

# ── Request schemas ─────────────────────────────────────
class WorkoutInput(BaseModel):
    duration_minutes: float
    heart_rate_avg:   float
    activity:         str

class SleepInput(BaseModel):
    duration_hours: float

# ── Endpoints ───────────────────────────────────────────
@app.get("/")
def root():
    return {"message": "✅ ML API is running"}

@app.post("/predict/calories")
def predict_calories(data: WorkoutInput):
    activity_code = ACTIVITY_MAP.get(data.activity.lower(), 0)
    features = scaler_X.transform([[data.duration_minutes, data.heart_rate_avg, activity_code]])
    tensor   = torch.FloatTensor(features)
    with torch.no_grad():
        pred_scaled = calorie_model(tensor).numpy()
    calories = scaler_y.inverse_transform(pred_scaled)[0][0]
    return {"predicted_calories": round(float(calories), 1)}

@app.post("/predict/sleep-quality")
def predict_sleep(data: SleepInput):
    scaled = scaler_sleep.transform([[data.duration_hours]])
    pred   = sleep_model.predict(scaled, verbose=0)
    idx    = int(np.argmax(pred))
    return {
        "predicted_quality":   QUALITY_LABELS[idx],
        "confidence_percent":  round(float(pred[0][idx]) * 100, 1)
    }