import os
import requests
import pandas as pd
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv

load_dotenv()

USERNAME = os.getenv("OXYLABS_USERNAME")
PASSWORD = os.getenv("OXYLABS_PASSWORD")
SEARCH_TERMS = ['laptops', 'phones', 'monitors', 'keyboards', 'headphones']

BASE_URL = 'https://realtime.oxylabs.io/v1/queries'
GEO_LOCATION = '90210'  # ZIP code geo targeting

def extract_product_fields(product, search_term):
    return {
        'search_term': search_term,
        'title': product.get('title'),
        'url': "https://www.amazon.com" + product.get('url', ''),
        'asin': product.get('asin'),
        'price': product.get('price'),
        'price_strikethrough': product.get('price_strikethrough'),
        'currency': product.get('currency'),
        'rating': product.get('rating'),
        'reviews_count': product.get('reviews_count'),
        'image_url': product.get('url_image'),
        'sales_volume': product.get('sales_volume'),
        'is_amazons_choice': product.get('is_amazons_choice'),
        'is_sponsored': product.get('is_sponsored'),
        'shipping_information': product.get('shipping_information'),
    }

# Option A: combine all results into one DataFrame
combined_data = []

for term in SEARCH_TERMS:
    print(f"Scraping: {term}")
    payload = {
        "source": "amazon_search",
        "query": term,
        "domain": "com",
        "geo_location": GEO_LOCATION,
        "parse": True
    }

    response = requests.post(BASE_URL, auth=HTTPBasicAuth(USERNAME, PASSWORD), json=payload)
    print(f"{term} → Status {response.status_code}")
    
    if response.status_code != 200:
        print(response.text)
        continue

    data = response.json()
    results_obj = data.get('results', [])[0].get('content', {}).get('results', {})
    organic_products = results_obj.get('organic', [])[:60]

    if not organic_products:
        print(f"No organic results for {term}")
        continue

    # Option A: Append to master list
    combined_data.extend([extract_product_fields(p, term) for p in organic_products])

    '''
    # Option B: Save a CSV for this search term
    df = pd.DataFrame([extract_product_fields(p, term) for p in organic_products])
    df.to_csv(f"{term}_products.csv", index=False)
    print(f"Saved {len(df)} products to {term}_products.csv")
    '''
# Option A: Save one CSV with all results
if combined_data:
    pd.DataFrame(combined_data).to_csv("azproducts.csv", index=False)
    print(f"Saved total of {len(combined_data)} products to azproducts.csv")
