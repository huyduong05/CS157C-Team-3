import os
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv

# load env
load_dotenv()

# Configure mongo on docker
MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017/")
DB_NAME = "productDB"
COLLECTION_NAME = "products"

# === Connect to MongoDB ===
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Wipe existing data just to be sure
collection.delete_many({})
print("Cleared existing data in the collection.")

# Create Amz DF
amazon_df = pd.read_csv("azproducts3.csv")
amazon_df["From"] = "amazon"

# Create EB DF
ebay_df = pd.read_csv("eb_merged.csv")
ebay_df["From"] = "ebay"

# === Combine both ===
combined_df = pd.concat([amazon_df, ebay_df], ignore_index=True)

# === Insert into MongoDB ===
records = combined_df.to_dict(orient="records")
if records:
    collection.insert_many(records)
    print(f"Inserted {len(records)} records into MongoDB.")
else:
    print("No records to insert.")
