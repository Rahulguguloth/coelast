from sqlalchemy import Column, Integer, String, Float, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, '..', 'data', 'medical_claims.db')}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    ClaimID = Column(String, unique=True, index=True)
    ProviderID = Column(String, index=True)
    PhysicianID = Column(String)
    ClaimAmount = Column(Float)
    PatientAge = Column(Integer)
    DiagnosisCode = Column(String)
    ClaimStartDate = Column(DateTime)
    ClaimEndDate = Column(DateTime)
    ClaimDuration = Column(Integer)
    IsFraud = Column(Integer)  # 0 or 1

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
