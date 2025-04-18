import os
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow cross‑origin requests

## Configure MongoDB URI
app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/mydb")

# Init Pymongo
mongo = PyMongo(app)

# Create products collection in mydb
products = mongo.db.products

@app.route("/products", methods=["GET"])
def list_products():
    output = []
    for doc in products.find():
        doc["_id"] = str(doc["_id"])
        output.append(doc)
    return jsonify(output), 200

@app.route("/products", methods=["POST"])
def add_product():
    data = request.get_json() or {}

    for field in ("price", "site", "rating"):
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    result = products.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return jsonify(data), 201


if __name__ == "__main__":
    # Running this way only applies if you do: python app.py
    app.run(host="0.0.0.0")