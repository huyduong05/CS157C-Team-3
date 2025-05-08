import os
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId
import re
import bcrypt
from datetime import datetime

app = Flask(__name__)
CORS(app)  # allow cross‑origin requests

## Configure MongoDB URI
app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/mydb")

# Init Pymongo
mongo = PyMongo(app)

# Create collections in mydb
products = mongo.db.products  # product listings
shoppingCart = mongo.db.shoppingCart  # shopping cart items
wishlist = mongo.db.wishlist  # wishlist items
users = mongo.db.users  # user accounts

# --- Users CRUD operations ---

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json() or {}
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not all([username, email, password]):
        return jsonify({"error": "Missing required fields"}), 400

    if users.find_one({"username": username}):
        return jsonify({"error": "Username already exists"}), 409

    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    user = {
        "username": username,
        "email": email,
        "password": hashed_pw,
        "created_at": datetime.utcnow()
    }

    result = users.insert_one(user)
    return jsonify({"message": "User created", "user_id": str(result.inserted_id)}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")

    if not all([username, password]):
        return jsonify({"error": "Missing credentials"}), 400

    user = users.find_one({"username": username})
    if not user:
        return jsonify({"error": "User not found"}), 404

    if not bcrypt.checkpw(password.encode('utf-8'), user["password"]):
        return jsonify({"error": "Incorrect password"}), 401

    return jsonify({"message": "Login successful", "username": username}), 200

@app.route("/user/<string:username>", methods=["GET"])
def get_user(username):
    user = users.find_one({"username": username})
    if not user:
        return jsonify({"error": "User not found"}), 404

    created_raw = user.get("created_at")
    created_at = created_raw.strftime("%b %d, %Y") if created_raw else "Unknown"

    return jsonify({
        "username": user["username"],
        "email": user["email"],
        "created_at": created_at
    }), 200

@app.route("/user/<string:username>", methods=["PUT"])
def update_user(username):
    data = request.get_json() or {}
    new_username = data.get("username")
    new_email = data.get("email")

    if not new_username or not new_email:
        return jsonify({"error": "Missing username or email"}), 400

    if new_username != username and users.find_one({"username": new_username}):
        return jsonify({"error": "Username already exists"}), 409

    result = users.update_one(
        {"username": username},
        {"$set": {"username": new_username, "email": new_email}}
    )

    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404

    updated_user = users.find_one({"username": new_username})
    created_raw = updated_user.get("created_at")
    created_at = created_raw.strftime("%b %d, %Y") if created_raw else "Unknown"

    return jsonify({
        "message": "User updated",
        "username": updated_user["username"],
        "email": updated_user["email"],
        "created_at": created_at
    }), 200

# --- Product Listing CRUD operations ---
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

# --- Shopping Cart CRUD Operations ---

# GET all items in cart
@app.route("/cart", methods=["GET"])
def get_cart_items():
    items = []
    for doc in shoppingCart.find():
        doc["_id"] = str(doc["_id"])
        items.append(doc)
    return jsonify(items), 200

# POST a new item to cart
@app.route("/cart", methods=["POST"])
def add_item_to_cart():
    data = request.get_json() or {}

    required_fields = ["title", "price", "quantity", "from"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    # Validating  types if needed
    result = shoppingCart.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return jsonify(data), 201

# PUT: update item in cart
@app.route("/cart/<string:item_id>", methods=["PUT"])
def update_cart_item(item_id):
    data = request.get_json() or {}

    # Optional: restrict allowed fields to update
    allowed_fields = ["quantity"]
    update_data = {key: data[key] for key in data if key in allowed_fields}

    if not update_data:
        return jsonify({"error": "No valid fields to update"}), 400

    try:
        result = shoppingCart.update_one(
            {"_id": ObjectId(item_id)},
            {"$set": update_data}
        )
        if result.matched_count == 0:
            return jsonify({"error": "Item not found"}), 404
        return jsonify({"message": "Item updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# DELETE: remove item from cart
@app.route("/cart/<string:item_id>", methods=["DELETE"])
def delete_cart_item(item_id):
    try:
        result = shoppingCart.delete_one({"_id": ObjectId(item_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Item not found"}), 404
        return jsonify({"message": "Item deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# GET all wishlist items
@app.route("/wishlist", methods=["GET"])
def get_wishlist_items():
    items = []
    for doc in wishlist.find():
        doc["_id"] = str(doc["_id"])
        items.append(doc)
    return jsonify(items), 200

# POST a new item to wishlist
@app.route("/wishlist", methods=["POST"])
def add_item_to_wishlist():
    data = request.get_json() or {}
    required_fields = ["title", "price", "quantity", "from"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    result = wishlist.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return jsonify(data), 201

# DELETE an item from wishlist
@app.route("/wishlist/<string:item_id>", methods=["DELETE"])
def delete_wishlist_item(item_id):
    try:
        result = wishlist.delete_one({"_id": ObjectId(item_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Item not found"}), 404
        return jsonify({"message": "Item deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
#he;per method to convert data for React
def safe_number(value):
    if isinstance(value, dict) and "$numberDouble" in value:
        return float(value["$numberDouble"])
    return value

#GET a number of random products
@app.route("/random", methods=["GET"])
def get_random_products():
    products_collection = mongo.db.products

    pipeline = [{"$sample": {"size": 12}}]
    random_products = list(products_collection.aggregate(pipeline))

    response = []
    for product in random_products:
        response.append({
            "_id": str(product.get("_id")),
            "category": product.get("search_term"),
            "title": product.get("title"),
            "url": product.get("url"),
            "price": safe_number(product.get("price")),
            "rating": safe_number(product.get("rating")),
            "image_url": product.get("image_url"),
            "from": product.get("from")
        })

    return jsonify(response)

# GET products based on search parameters
@app.route("/search", methods=["GET"])
def search_products():
    raw_query = request.args.get("query", "").strip()
    if not raw_query:
        return jsonify({"products": []}), 200

    # Escape special regex characters to prevent malformed queries
    query = re.escape(raw_query)

    # Querying MongoDB Products Collection
    matching_products = products.find({
        "$or": [
            {"title": {"$regex": query, "$options": "i"}},
            {"search_term": {"$regex": query, "$options": "i"}}
        ]
    })

    response = []
    for product in matching_products:
        response.append({
            "_id": str(product.get("_id")),
            "category": product.get("search_term"),
            "title": product.get("title"),
            "url": product.get("url"),
            "price": safe_number(product.get("price")),
            "rating": safe_number(product.get("rating")),
            "image_url": product.get("image_url"),
            "from": product.get("from")
        })

    return jsonify({"products": response}), 200



if __name__ == "__main__":
    # Running this way only applies if you do: python app.py
    app.run(host="0.0.0.0", port=5001)
