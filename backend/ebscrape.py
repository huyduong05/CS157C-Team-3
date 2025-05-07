import os
import requests
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv

load_dotenv()

USERNAME = os.getenv("OXYLABS_USERNAME")
PASSWORD = os.getenv("OXYLABS_PASSWORD")

BASE_URL = "https://realtime.oxylabs.io/v1/queries"
GEO = "us"

with open("keywords.txt") as f:
    keywords = [line.strip() for line in f if line.strip()]

for keyword in keywords:
    print(f"Fetching HTML for: {keyword}")
    url = f"https://www.ebay.com/sch/i.html?_nkw={keyword}"
    payload = {
        "source": "universal",
        "url": url,
        "geo_location": GEO,
        "render": "html",
        "parse": False
    }

    res = requests.post(BASE_URL, json=payload, auth=HTTPBasicAuth(USERNAME, PASSWORD))
    job_id = res.json().get("job", {}).get("id")
    if not job_id:
        print(f"Failed to create job for {keyword}")
        continue

    # Wait a bit (or ideally poll for status)
    import time; time.sleep(10)

    content_url = f"https://data.oxylabs.io/v1/queries/{job_id}/results/1/content?type=raw"
    html = requests.get(content_url, auth=HTTPBasicAuth(USERNAME, PASSWORD)).text

    with open(f"{keyword}.html", "w", encoding="utf-8") as f:
        f.write(html)
