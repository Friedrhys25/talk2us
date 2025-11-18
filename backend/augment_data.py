# augment_data.py
import pandas as pd
import google.generativeai as genai
import time

# 🔑 Configure Gemini API
genai.configure(api_key="AIzaSyDg_EbxqAGrgiAAOBN1jZIoPVzjeeJaXvk")

# 📄 Load your base dataset
df = pd.read_csv("complaints_training_data_large.csv")

new_rows = []

# 🔁 Loop through every row and create variations
for _, row in df.iterrows():
    text = row["message"]
    label = row["label"]
    type_ = row["type"]

    prompt = f"""
    Generate 3 short, natural complaint variations in either English or Tagalog
    that mean roughly the same as: "{text}".
    Return only the new complaint sentences (no numbering, no explanations).
    """

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    # Split response into lines (each line = new message)
    lines = [line.strip("-• ") for line in response.text.split("\n") if line.strip()]
    for variant in lines:
        new_rows.append({"message": variant, "label": label, "type": type_})

    time.sleep(0.5)  # prevent hitting API rate limits

# 💾 Save new augmented data
augmented = pd.DataFrame(new_rows)
augmented.to_csv("augmented_complaints_data.csv", index=False)
print("✅ Augmented dataset saved as augmented_complaints_data.csv")
