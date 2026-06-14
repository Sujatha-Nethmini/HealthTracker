import tensorflow as tf
from tensorflow import keras
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import pickle

# Load data
df = pd.read_csv("sleep_data.csv")

X = df[["duration_hours"]].values
y = df["quality_code"].values  # 0=poor, 1=fair, 2=good

# Scale features
scaler_sleep = StandardScaler()
X = scaler_sleep.fit_transform(X)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Build Keras model
model = keras.Sequential([
    keras.layers.Dense(16, activation="relu", input_shape=(1,)),
    keras.layers.Dense(8,  activation="relu"),
    keras.layers.Dense(3,  activation="softmax")  # 3 classes: poor, fair, good
])

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

print("Training TensorFlow sleep quality classifier...")
model.fit(X_train, y_train,
          epochs=100,
          batch_size=8,
          validation_data=(X_test, y_test),
          verbose=1)

# Evaluate
loss, accuracy = model.evaluate(X_test, y_test, verbose=0)
print(f"\n✅ Test accuracy: {accuracy*100:.1f}%")

# Save model and scaler
model.save("sleep_model.keras")
with open("scaler_sleep.pkl", "wb") as f: pickle.dump(scaler_sleep, f)
print("✅ TensorFlow model saved as sleep_model.keras")

# Quick test prediction
quality_labels = ["poor", "fair", "good"]
test_hours = [[7.5]]
test_scaled = scaler_sleep.transform(test_hours)
pred = model.predict(test_scaled, verbose=0)
predicted_class = np.argmax(pred)
print(f"\nTest prediction — 7.5 hours sleep:")
print(f"Predicted quality: {quality_labels[predicted_class]} (confidence: {pred[0][predicted_class]*100:.1f}%)")