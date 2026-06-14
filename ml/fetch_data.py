from pymongo import MongoClient
import pandas as pd

client = MongoClient("mongodb://localhost:27017/")
db = client["healthtracker"]

# Fetch workout logs
workouts = list(db.workout_logs.find({}, {"_id": 0, "activity": 1, "duration_minutes": 1, "heart_rate_avg": 1, "calories_burned": 1}))
workout_df = pd.DataFrame(workouts)

# Encode activity as a number
activity_map = {"running": 0, "cycling": 1, "swimming": 2, "gym": 3, "walking": 4}
workout_df["activity_code"] = workout_df["activity"].map(activity_map)
workout_df = workout_df.dropna()

# Fetch sleep logs
sleep = list(db.sleep_logs.find({}, {"_id": 0, "duration_hours": 1, "quality": 1}))
sleep_df = pd.DataFrame(sleep)
quality_map = {"good": 2, "fair": 1, "poor": 0}
sleep_df["quality_code"] = sleep_df["quality"].map(quality_map)
sleep_df = sleep_df.dropna()

# Save to CSV
workout_df.to_csv("workout_data.csv", index=False)
sleep_df.to_csv("sleep_data.csv", index=False)

print(f"✅ Saved {len(workout_df)} workout records")
print(f"✅ Saved {len(sleep_df)} sleep records")
print("\nWorkout data sample:")
print(workout_df.head())
print("\nSleep data sample:")
print(sleep_df.head())

client.close()