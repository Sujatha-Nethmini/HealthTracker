from pymongo import MongoClient
from datetime import datetime, timedelta
import random

client = MongoClient("mongodb://localhost:27017/")
db = client["healthtracker"]

# 1. Create a test user
user = {
    "name": "Test User",
    "email": "test@health.com",
    "password_hash": "placeholder",
    "age": 22,
    "weight_kg": 68,
    "height_cm": 172,
    "goal": "lose_weight",
    "created_at": datetime.utcnow()
}
user_id = db.users.insert_one(user).inserted_id
print(f"✅ Created user: {user_id}")

# 2. Seed 30 days of workout logs
activities = ["running", "cycling", "swimming", "gym", "walking"]
for i in range(30):
    date = datetime.utcnow() - timedelta(days=i)
    db.workout_logs.insert_one({
        "user_id": user_id,
        "logged_at": date,
        "type": "cardio",
        "activity": random.choice(activities),
        "duration_minutes": random.randint(20, 60),
        "calories_burned": random.randint(150, 500),
        "heart_rate_avg": random.randint(120, 165),
    })
print("✅ Seeded 30 workout logs")

# 3. Seed 30 days of sleep logs
for i in range(30):
    date = datetime.utcnow() - timedelta(days=i)
    hours = round(random.uniform(5.5, 9.0), 1)
    db.sleep_logs.insert_one({
        "user_id": user_id,
        "date": date.strftime("%Y-%m-%d"),
        "duration_hours": hours,
        "quality": "good" if hours >= 7 else "fair" if hours >= 6 else "poor"
    })
print("✅ Seeded 30 sleep logs")

# 4. Seed 30 days of meal logs
meals = ["breakfast", "lunch", "dinner", "snack"]
foods_db = [
    {"name": "Rice", "calories": 260, "protein_g": 5, "carbs_g": 57, "fat_g": 0.4},
    {"name": "Chicken curry", "calories": 210, "protein_g": 28, "carbs_g": 4, "fat_g": 9},
    {"name": "Egg", "calories": 70, "protein_g": 6, "carbs_g": 0, "fat_g": 5},
    {"name": "Bread", "calories": 80, "protein_g": 3, "carbs_g": 15, "fat_g": 1},
    {"name": "Banana", "calories": 90, "protein_g": 1, "carbs_g": 23, "fat_g": 0},
]
for i in range(30):
    date = datetime.utcnow() - timedelta(days=i)
    selected = random.sample(foods_db, random.randint(1, 3))
    total_cal = sum(f["calories"] for f in selected)
    db.meal_logs.insert_one({
        "user_id": user_id,
        "logged_at": date,
        "meal_type": random.choice(meals),
        "foods": selected,
        "total_calories": total_cal,
    })
print("✅ Seeded 30 meal logs")

# 5. Seed 30 daily summaries
for i in range(30):
    date = datetime.utcnow() - timedelta(days=i)
    db.daily_summaries.insert_one({
        "user_id": user_id,
        "date": date.strftime("%Y-%m-%d"),
        "total_calories_consumed": random.randint(1500, 2500),
        "total_calories_burned": random.randint(150, 500),
        "water_ml": random.randint(1500, 3000),
        "steps": random.randint(3000, 12000),
        "sleep_hours": round(random.uniform(5.5, 9.0), 1),
        "weight_kg": round(random.uniform(67.0, 69.0), 1)
    })
print("✅ Seeded 30 daily summaries")

print("\n🎉 All done! Open Compass and refresh to see your data.")
client.close()