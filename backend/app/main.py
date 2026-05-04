from fastapi import FastAPI
from .database import engine, Base
from . import models
from .routes import user_routes, profile_routes, company_routes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Placement Tracker API")

app.include_router(user_routes.router)
app.include_router(profile_routes.router)
app.include_router(company_routes.router)

@app.get("/")
def home():
    return {
        "message": "Student Placement Tracker Backend is running",
        "database": "Connected successfully"
    }