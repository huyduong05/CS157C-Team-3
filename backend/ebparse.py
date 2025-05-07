from bs4 import BeautifulSoup
import pandas as pd
import os

for file in os.listdir():
    if file.endswith(".html"):
        keyword = file.replace(".html", "")
        with open(file, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f, "lxml")

        items = soup.select("li.s-item")
        results = []
        for item in items:
            title = item.select_one(".s-item__title")
            link = item.select_one(".s-item__link")
            price = item.select_one(".s-item__price")
            image = item.select_one(".s-item__image-img")
            if title and "Shop on eBay" not in title.text:
                results.append({
                    "search_term": keyword,
                    "title": title.text.strip(),
                    "url": link['href'] if link else None,
                    "price": price.text.strip() if price else None,
                    "image_url": image['src'] if image else None
                })

        pd.DataFrame(results).to_csv(f"{keyword}_parsed.csv", index=False)
        print(f"Saved {len(results)} items to {keyword}_parsed.csv")
