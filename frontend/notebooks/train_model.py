import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from imblearn.over_sampling import SMOTE
import joblib
import os

def train_model():
    base_dir = os.path.dirname(__file__)
    data_path = os.path.join(base_dir, '..', 'data', 'claims_data.csv')
    if not os.path.exists(data_path):
        print("Data file not found. Run generate_data.py first.")
        return

    df = pd.read_csv(data_path)

    # 1. Feature Engineering (The "Secret Sauce")
    # Provider Total Reimbursed Amount
    provider_stats = df.groupby('ProviderID')['ClaimAmount'].agg(['mean', 'sum']).reset_index()
    provider_stats.columns = ['ProviderID', 'ProvAvgAmount', 'ProvTotalAmount']
    df = df.merge(provider_stats, on='ProviderID', how='left')

    # Provider Anomaly Score (Current claim vs Provider average)
    df['ProvAnomalyScore'] = df['ClaimAmount'] / df['ProvAvgAmount']

    # 2. Preprocessing
    # Drop IDs that won't help generalization (except ProviderID which we've aggregated)
    features = ['ClaimAmount', 'PatientAge', 'ClaimDuration', 'ProvTotalAmount', 'ProvAnomalyScore']
    cat_features = ['DiagnosisCode']

    # Encode Categorical
    le = LabelEncoder()
    for col in cat_features:
        df[col] = le.fit_transform(df[col])
    
    X = df[features + cat_features]
    y = df['IsFraud']

    # 3. Handle Imbalance with SMOTE
    smote = SMOTE(random_state=42)
    X_res, y_res = smote.fit_resample(X, y)

    # 4. Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(X_res, y_res, test_size=0.2, random_state=42)

    # 5. Model Training
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # 6. Save Model and Artifacts
    models_dir = os.path.join(base_dir, '..', 'models')
    if not os.path.exists(models_dir):
        os.makedirs(models_dir)

    joblib.dump(model, os.path.join(models_dir, 'fraud_model.pkl'))
    joblib.dump(le, os.path.join(models_dir, 'label_encoder.pkl'))
    # Save the columns to ensure consistent API input
    joblib.dump(features + cat_features, os.path.join(models_dir, 'feature_names.pkl'))
    
    print("Model trained and saved to /models/")
    print(f"Original shape: {X.shape}, Resampled shape: {X_res.shape}")

if __name__ == "__main__":
    train_model()
