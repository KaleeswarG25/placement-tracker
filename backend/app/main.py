from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from .routes.api import router
import os
from dotenv import load_dotenv

load_dotenv()

Base.metadata.create_all(bind=engine)

os.makedirs("uploads", exist_ok=True)

app = FastAPI(title="Student Placement Tracker API")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def home():
    return {
        "message": "Student Placement Tracker Backend is running",
        "database": "Connected successfully"
    }