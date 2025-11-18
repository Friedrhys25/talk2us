# merge_data.py
import pandas as pd

# 📄 Load the 3 datasets
df1 = pd.read_csv("complaints_dataset_multilang_2100.csv")
df2 = pd.read_csv("complaints_training_data_large.csv")
df3 = pd.read_csv("complaints_dataset_unique_2500.csv")

# 🧩 Merge & clean
combined = pd.concat([df1, df2, df3], ignore_index=True).drop_duplicates()

# 💾 Save combined file
combined.to_csv("combined_training_data.csv", index=False)
print(f"✅ Combined dataset created! Total rows: {len(combined)}")
