import pandas as pd
import os

# Collect all *_parsed.csv files
csv_dir = "data"
csv_files = [os.path.join(csv_dir, f) for f in os.listdir(csv_dir) if f.endswith('_parsed.csv')]


# Read and combine
dfs = []
for file in csv_files:
    df = pd.read_csv(file)
    dfs.append(df)

# Concatenate all into one DataFrame
combined_df = pd.concat(dfs, ignore_index=True)

# Save merged CSV
combined_df.to_csv('eb_merged.csv', index=False)

print(f"Merged {len(csv_files)} files into eb_merged.csv with {len(combined_df)} rows.")
