from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os
import shap

app = FastAPI(title="Medical Fraud Detection API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model and Artifacts
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "..", "models")
DATA_DIR = os.path.join(BASE_DIR, "..", "data")

model = joblib.load(os.path.join(MODELS_DIR, "fraud_model.pkl"))
le = joblib.load(os.path.join(MODELS_DIR, "label_encoder.pkl"))
feature_names = joblib.load(os.path.join(MODELS_DIR, "feature_names.pkl"))

# Load training data statistics for real-time feature engineering
train_data = pd.read_csv(os.path.join(DATA_DIR, "claims_data.csv"))
provider_stats = train_data.groupby('ProviderID')['ClaimAmount'].agg(['mean', 'sum']).reset_index()
provider_stats.columns = ['ProviderID', 'ProvAvgAmount', 'ProvTotalAmount']

class ClaimRequest(BaseModel):
    ProviderID: str
    ClaimAmount: float
    PatientAge: int
    ClaimDuration: int
    DiagnosisCode: str

@app.get("/")
def read_root():
    return {"message": "Medical Fraud Detection API is running"}

@app.post("/predict")
def predict(request: ClaimRequest):
    try:
        # 1. Feature Engineering
        # Get provider stats or use defaults if provider is new
        p_stats = provider_stats[provider_stats['ProviderID'] == request.ProviderID]
        if not p_stats.empty:
            prov_avg = p_stats['ProvAvgAmount'].values[0]
            prov_total = p_stats['ProvTotalAmount'].values[0]
        else:
            prov_avg = train_data['ClaimAmount'].mean()
            prov_total = request.ClaimAmount

        anomaly_score = request.ClaimAmount / prov_avg

        # 2. Prepare Input
        # Encode DiagnosisCode
        try:
            diag_encoded = le.transform([request.DiagnosisCode])[0]
        except:
            diag_encoded = 0 # Default if unknown

        input_df = pd.DataFrame([{
            'ClaimAmount': request.ClaimAmount,
            'PatientAge': request.PatientAge,
            'ClaimDuration': request.ClaimDuration,
            'ProvTotalAmount': prov_total,
            'ProvAnomalyScore': anomaly_score,
            'DiagnosisCode': diag_encoded
        }])

        # 3. Prediction
        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0].tolist()

        # 4. SHAP Explanation (XAI)
        # We use a TreeExplainer for the Random Forest model
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(input_df)
        
        # Format explanation: which features contributed most to fraud?
        # For binary classification with RF, shap_values is often a list [class0, class1]
        # class1 is fraud
        if isinstance(shap_values, list):
            sv = shap_values[1][0]
        else:
            sv = shap_values[0]
            
        explanations = {}
        for i, feat in enumerate(input_df.columns):
            explanations[feat] = float(sv[i])

        return {
            "is_fraud": int(prediction),
            "confidence": max(probability),
            "explanation": explanations,
            "anomaly_score": float(anomaly_score)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
def get_stats():
    total_claims = len(train_data)
    fraud_count = len(train_data[train_data['IsFraud'] == 1])
    legit_count = total_claims - fraud_count
    
    # Top fraudulent providers (mock based on high anomaly scores in data)
    top_providers = provider_stats.sort_values(by='ProvAvgAmount', ascending=False).head(5).to_dict('records')
    
    return {
        "total_claims": total_claims,
        "fraud_distribution": [
            {"name": "Fraudulent", "value": fraud_count},
            {"name": "Legitimate", "value": legit_count}
        ],
        "top_providers": top_providers
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
