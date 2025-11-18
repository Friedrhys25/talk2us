import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import joblib

# 1. Load dataset
df = pd.read_csv("complaints_training_data_large.csv")

# 2. Clean text & labels
df["message"] = df["message"].astype(str).str.lower().str.strip()
df["label"] = df["label"].astype(str).str.lower().str.strip()
df["type"] = df["type"].astype(str).str.lower().str.strip()

# 3. Features (X) and Labels (y)
X = df["message"]
y_label = df["label"]
y_type = df["type"]

# 4. Split once (keep alignment between label & type)
X_train, X_test, y_label_train, y_label_test, y_type_train, y_type_test = train_test_split(
    X, y_label, y_type, test_size=0.2, random_state=42, stratify=y_label
)

# 5. Build improved pipelines
label_clf = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1,2), min_df=2)),
    ('clf', LogisticRegression(max_iter=2000, class_weight="balanced", solver="liblinear"))
])

type_clf = Pipeline([
    ('tfidf', TfidfVectorizer(ngram_range=(1,2), min_df=2)),
    ('clf', LogisticRegression(max_iter=2000, class_weight="balanced", solver="liblinear"))
])

# 6. Train both models
label_clf.fit(X_train, y_label_train)
type_clf.fit(X_train, y_type_train)

# 7. Evaluate
print("Label Report")
print(classification_report(y_label_test, label_clf.predict(X_test)))

print("Type Report")
print(classification_report(y_type_test, type_clf.predict(X_test)))

# 8. Save models
joblib.dump(label_clf, "label_model.pkl")
joblib.dump(type_clf, "type_model.pkl")

print("✅ Models trained and saved successfully!")