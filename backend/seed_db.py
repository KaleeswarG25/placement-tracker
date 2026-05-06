from app.database import SessionLocal, engine, Base
from app.models import User, CompanyProfile, StudentProfile, JobOpening, Application
from app.auth import get_password_hash
from datetime import datetime

db = SessionLocal()

def seed_data():
    # 1. Create Admin
    if not db.query(User).filter(User.email == "admin@example.com").first():
        admin = User(
            full_name="System Admin",
            email="admin@example.com",
            password=get_password_hash("admin123"),
            role="admin",
            status="active"
        )
        db.add(admin)

    # 2. Create Company
    if not db.query(User).filter(User.email == "google@example.com").first():
        company_user = User(
            full_name="Google HR",
            email="google@example.com",
            password=get_password_hash("google123"),
            role="company",
            status="active"
        )
        db.add(company_user)
        db.commit()
        db.refresh(company_user)
        
        company_profile = CompanyProfile(
            user_id=company_user.id,
            company_name="Google",
            hr_name="Sundar Pichai",
            website="https://google.com",
            location="Mountain View, CA",
            industry="Technology",
            description="Organize the world's information.",
            approved_at=datetime.utcnow()
        )
        db.add(company_profile)
        db.commit()
        db.refresh(company_profile)

        # 3. Create Job
        job = JobOpening(
            company_id=company_profile.id,
            title="Software Engineer Intern",
            description="Join the search team.",
            skills_required="Python, React, DSA",
            min_cgpa=8.0,
            eligible_departments="CSE, IT",
            ctc="30 LPA",
            job_type="Internship",
            vacancies=10,
            status="active"
        )
        db.add(job)

    # 4. Create Student
    if not db.query(User).filter(User.email == "student@example.com").first():
        student_user = User(
            full_name="John Doe",
            email="student@example.com",
            password=get_password_hash("student123"),
            role="student",
            status="active"
        )
        db.add(student_user)
        db.commit()
        db.refresh(student_user)

        student_profile = StudentProfile(
            user_id=student_user.id,
            rollno="CS202601",
            department="CSE",
            year=2026,
            cgpa=8.5,
            backlog_count=0,
            skills="React, Node",
            resume_path="https://example.com/resume.pdf"
        )
        db.add(student_profile)

    db.commit()
    print("Database seeded successfully with Admin, Company, and Student.")

if __name__ == "__main__":
    seed_data()
