from pymongo import MongoClient, ASCENDING
from datetime import datetime, timedelta, timezone
import random

client = MongoClient("mongodb+srv://sujathanethmini:Viha05@cluster0.wu8aye4.mongodb.net/")
# Drop and recreate fresh
client.drop_database("healthtracker")
db = client["healthtracker"]

# Create collections
db.create_collection("users")
db.create_collection("meal_logs")
db.create_collection("workout_logs")
db.create_collection("sleep_logs")
db.create_collection("daily_summaries")

# Indexes
db.users.create_index([("email", ASCENDING)], unique=True)
db.meal_logs.create_index([("user_id", ASCENDING), ("logged_at", ASCENDING)])
db.workout_logs.create_index([("user_id", ASCENDING), ("logged_at", ASCENDING)])
db.sleep_logs.create_index([("user_id", ASCENDING), ("date", ASCENDING)])
db.daily_summaries.create_index([("user_id", ASCENDING), ("date", ASCENDING)], unique=True)

# Create test user
user = {
    "name": "Test User",
    "email": "test@health.com",
    "password_hash": "placeholder",
    "age": 22,
    "weight_kg": 68,
    "height_cm": 172,
    "goal": "lose_weight",
    "created_at": datetime.now(timezone.utc)
}
user_id = db.users.insert_one(user).inserted_id
print(f"✅ Created user: {user_id}")

# Seed workout logs
activities = ["running", "cycling", "swimming", "gym", "walking"]
for i in range(30):
    date = datetime.now(timezone.utc) - timedelta(days=i)
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

# Seed sleep logs
for i in range(30):
    date = datetime.now(timezone.utc) - timedelta(days=i)
    hours = round(random.uniform(5.5, 9.0), 1)
    db.sleep_logs.insert_one({
        "user_id": user_id,
        "date": date.strftime("%Y-%m-%d"),
        "duration_hours": hours,
        "quality": "good" if hours >= 7 else "fair" if hours >= 6 else "poor"
    })
print("✅ Seeded 30 sleep logs")

# Seed meal logs
foods_db = [
    {"name": "Rice", "calories": 260, "protein_g": 5, "carbs_g": 57, "fat_g": 0.4},
    {"name": "Chicken curry", "calories": 210, "protein_g": 28, "carbs_g": 4, "fat_g": 9},
    {"name": "Egg", "calories": 70, "protein_g": 6, "carbs_g": 0, "fat_g": 5},
    {"name": "Bread", "calories": 80, "protein_g": 3, "carbs_g": 15, "fat_g": 1},
    {"name": "Banana", "calories": 90, "protein_g": 1, "carbs_g": 23, "fat_g": 0},
]
meal_types = ["breakfast", "lunch", "dinner", "snack"]
for i in range(30):
    date = datetime.now(timezone.utc) - timedelta(days=i)
    selected = random.sample(foods_db, random.randint(1, 3))
    db.meal_logs.insert_one({
        "user_id": user_id,
        "logged_at": date,
        "meal_type": random.choice(meal_types),
        "foods": selected,
        "total_calories": sum(f["calories"] for f in selected),
    })
print("✅ Seeded 30 meal logs")

# Seed daily summaries
for i in range(30):
    date = datetime.now(timezone.utc) - timedelta(days=i)
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

print("\n🎉 All done! Refresh Compass to see your data.")
client.close()