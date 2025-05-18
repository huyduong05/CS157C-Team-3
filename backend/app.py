import os
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson import ObjectId
import re
import bcrypt
from datetime import datetime
from functools import wraps
from flask import g

import jwt
from datetime import datetime, timedelta

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")

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
orderHistory = mongo.db.orderHistory # order history

#wrapper for auth
def auth_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing token"}), 401
        token = auth_header.split(" ", 1)[1]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Bad token"}), 401

        g.user_id   = ObjectId(payload["user_id"])
        g.username  = payload["username"]
        return f(*args, **kwargs)
    return wrapper

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
    if not user or not bcrypt.checkpw(password.encode('utf-8'), user["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    payload = {
        "user_id": str(user["_id"]), # add this to authenticate useres
        "username": username,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return jsonify({
    "message": "Login successful",
    "token": token,
    "username": username 
    }), 200


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
@auth_required
def get_cart_items():
    items = []
    for doc in shoppingCart.find({"user_id": g.user_id}):
        doc["_id"] = str(doc["_id"])
        items.append(doc)
    return jsonify(items), 200

# POST a new item to cart
@app.route("/cart", methods=["POST"])
@auth_required
def add_item_to_cart():
    data = request.get_json() or {}

    required_fields = ["title", "price", "quantity", "from"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    data["user_id"] = g.user_id
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
@auth_required
def get_wishlist_items():
    items = []
    for doc in wishlist.find({"user_id": g.user_id}):
        doc["_id"] = str(doc["_id"])
        items.append(doc)
    return jsonify(items), 200

# POST a new item to wishlist
@app.route("/wishlist", methods=["POST"])
@auth_required
def add_item_to_wishlist():
    data = request.get_json() or {}
    required_fields = ["title", "price", "quantity", "from"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    data["user_id"] = g.user_id
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

#POST request to move all items in shopping cart to orderhistory
@app.route("/checkout", methods=["POST"])
@auth_required
def checkout():
    cart_items = list(shoppingCart.find({"user_id": g.user_id}))
    if not cart_items:
        return jsonify({"msg": "Cart is empty"}), 400

    order_id = ObjectId()
    now = datetime.utcnow()

    history_docs = [
        {
            **{k: v for k, v in item.items() if k != "_id"},
            "user_id": g.user_id,
            "order_id": order_id,
            "ordered_at": now
        }
        for item in cart_items
    ]

    orderHistory.insert_many(history_docs)
    shoppingCart.delete_many({"user_id": g.user_id})

    return jsonify({"order_id": str(order_id), "items_moved": len(history_docs)}), 201

# GET all items in orderhistory
@app.route("/orders", methods=["GET"])
@auth_required
def get_orderHistory():
    items = []
    for doc in orderHistory.find({"user_id": g.user_id}):
        doc["_id"] = str(doc["_id"])
        items.append(doc)
    return jsonify(items), 200

@app.route("/recs", methods=["GET"])
@auth_required
def get_recommendations():
    past_orders = list(orderHistory.find({"user_id": g.user_id}))
    print("Orders:", past_orders)

    if not past_orders:
        return jsonify({"recs": []}), 200

    purchased_ids = set(str(order.get("product_id", order.get("_id"))) for order in past_orders)
    categories = [order.get("category") for order in past_orders if order.get("category")]
    print("Categories:", categories)

    if not categories:
        return jsonify({"recs": []}), 200

    from collections import Counter
    category_counter = Counter(categories)
    top_categories = [cat for cat, _ in category_counter.most_common(2)]
    print("Top categories:", top_categories)

    # Query for products specfically in those top categories
    recommended_products = list(products.aggregate([
        {
            "$match": {
                "search_term": {"$in": top_categories}, #changed to search_term instead of category
                "_id": {"$nin": [ObjectId(pid) for pid in purchased_ids if ObjectId.is_valid(pid)]}
            }
        },
        { "$sample": { "size": 4 } }
    ]))
    print("Recommended:", recommended_products)

    response = [
        {
            "_id": str(product.get("_id")),
            "title": product.get("title"),
            "category": product.get("search_term"), #changed to search_term
            "price": safe_number(product.get("price")),
            "image_url": product.get("image_url"),
            "from": product.get("from"),
        }
        for product in recommended_products
    ]

    return jsonify({"recs": response}), 200



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
