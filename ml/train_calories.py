import torch
import torch.nn as nn
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import pickle

# Load data
df = pd.read_csv("workout_data.csv")

# Features: duration, heart rate, activity code
X = df[["duration_minutes", "heart_rate_avg", "activity_code"]].values
y = df["calories_burned"].values.reshape(-1, 1)

# Scale features (very important for neural networks)
scaler_X = StandardScaler()
scaler_y = StandardScaler()
X = scaler_X.fit_transform(X)
y = scaler_y.fit_transform(y)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Convert to tensors
X_train = torch.FloatTensor(X_train)
X_test  = torch.FloatTensor(X_test)
y_train = torch.FloatTensor(y_train)
y_test  = torch.FloatTensor(y_test)

# Define the neural network
class CaloriePredictor(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(3, 32),
            nn.ReLU(),
            nn.Linear(32, 16),
            nn.ReLU(),
            nn.Linear(16, 1)
        )
    def forward(self, x):
        return self.net(x)

model     = CaloriePredictor()
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
loss_fn   = nn.MSELoss()

# Training loop
print("Training PyTorch calorie predictor...")
for epoch in range(500):
    model.train()
    optimizer.zero_grad()
    predictions = model(X_train)
    loss = loss_fn(predictions, y_train)
    loss.backward()
    optimizer.step()

    if (epoch + 1) % 100 == 0:
        model.eval()
        with torch.no_grad():
            test_pred = model(X_test)
            test_loss = loss_fn(test_pred, y_test)
        print(f"Epoch {epoch+1}/500 — Train Loss: {loss.item():.4f} | Test Loss: {test_loss.item():.4f}")

# Save model and scalers
torch.save(model.state_dict(), "calorie_model.pth")
with open("scaler_X.pkl", "wb") as f: pickle.dump(scaler_X, f)
with open("scaler_y.pkl", "wb") as f: pickle.dump(scaler_y, f)

print("\n✅ PyTorch model saved as calorie_model.pth")

# Quick test prediction
model.eval()
with torch.no_grad():
    # Predict: running, 30 mins, heart rate 150
    sample = scaler_X.transform([[30, 150, 0]])
    sample_tensor = torch.FloatTensor(sample)
    pred_scaled = model(sample_tensor)
    pred_calories = scaler_y.inverse_transform(pred_scaled.numpy())
    print(f"\nTest prediction — Running 30 mins, HR 150:")
    print(f"Predicted calories burned: {pred_calories[0][0]:.0f}")