import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta

def generate_synthetic_data(n_samples=5000):
    np.random.seed(42)
    
    # Generate Base Features
    provider_ids = [f"PRV{i:05d}" for i in range(1, 101)]
    physician_ids = [f"PHY{i:05d}" for i in range(1, 201)]
    
    data = {
        'ClaimID': [f"CLM{i:06d}" for i in range(n_samples)],
        'ProviderID': np.random.choice(provider_ids, n_samples),
        'PhysicianID': np.random.choice(physician_ids, n_samples),
        'ClaimAmount': np.random.uniform(500, 15000, n_samples),
        'PatientAge': np.random.randint(18, 90, n_samples),
        'DiagnosisCode': np.random.choice(['D01', 'D02', 'D03', 'D04', 'D05'], n_samples),
    }
    
    df = pd.DataFrame(data)
    
    # Generate Dates for Duration
    base_date = datetime(2023, 1, 1)
    df['ClaimStartDate'] = [base_date + timedelta(days=np.random.randint(0, 365)) for _ in range(n_samples)]
    df['ClaimDuration'] = np.random.randint(1, 30, n_samples)
    df['ClaimEndDate'] = df.apply(lambda x: x['ClaimStartDate'] + timedelta(days=x['ClaimDuration']), axis=1)
    
    # Introduce Fraud Patterns (Secret Sauce logic)
    # High amount + short duration + specific provider = likely fraud
    df['IsFraud'] = 0
    
    # Pattern 1: High Claim Amount + Short Duration
    fraud_idx = df[(df['ClaimAmount'] > 12000) & (df['ClaimDuration'] < 3)].index
    df.loc[fraud_idx, 'IsFraud'] = 1
    
    # Pattern 2: Specific Provider Anomaly
    rogue_providers = provider_ids[:5]
    fraud_idx_2 = df[df['ProviderID'].isin(rogue_providers)].sample(frac=0.3, random_state=42).index
    df.loc[fraud_idx_2, 'IsFraud'] = 1
    
    # Ensure fraud remains rare (~5-10%)
    print(f"Fraud distribution:\n{df['IsFraud'].value_counts(normalize=True)}")
    
    # Save to data folder
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    output_path = os.path.join(output_dir, 'claims_data.csv')
    df.to_csv(output_path, index=False)
    print(f"Data saved to {output_path}")

if __name__ == "__main__":
    generate_synthetic_data()
