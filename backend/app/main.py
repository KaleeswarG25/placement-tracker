from fastapi import FastAPI

app = FastAPI(title="Student Placement Tracker API")

@app.get("/")
def home():
    return {
        "message": "Student Placement Tracker Backend is running"
    }