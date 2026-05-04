from fastapi import FastAPI
from .database import engine, Base
from . import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Placement Tracker API")

@app.get("/")
def home():
    return {
        "message": "Student Placement Tracker Backend is running",
        "database": "Connected successfully"
    }