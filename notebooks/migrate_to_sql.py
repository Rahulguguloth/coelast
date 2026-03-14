import pandas as pd
from sqlalchemy.orm import Session
import sys
import os
from datetime import datetime

# Add root to path so we can import backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.database import SessionLocal, Claim, init_db, engine

def migrate():
    # 1. Initialize DB
    print("Initializing Database...")
    init_db()
    
    # 2. Read CSV
    csv_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'claims_data.csv')
    if not os.path.exists(csv_path):
        print("CSV file not found. Run generate_data.py first.")
        return
    
    df = pd.read_csv(csv_path)
    
    # Convert dates
    df['ClaimStartDate'] = pd.to_datetime(df['ClaimStartDate'])
    df['ClaimEndDate'] = pd.to_datetime(df['ClaimEndDate'])
    
    # 3. Load into SQL
    print(f"Migrating {len(df)} records to SQL...")
    
    # Clear existing data
    with engine.connect() as conn:
        conn.execute(Claim.__table__.delete())
        conn.commit()

    db = SessionLocal()
    try:
        # Batch insert using pandas for speed
        df.to_sql('claims', con=engine, if_exists='append', index=False)
        print("Migration Complete!")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    migrate()
