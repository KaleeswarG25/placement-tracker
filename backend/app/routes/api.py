from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, StudentProfile, CompanyProfile, JobOpening, Application, Announcement
from ..schemas import *
from ..auth import get_password_hash, verify_password, create_access_token, get_current_user, get_current_active_user
from datetime import timedelta, datetime
import os

router = APIRouter()
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24))

# AUTHENTICATION
@router.post("/auth/register/student", response_model=UserResponse)
def register_student(user: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hashed_password,
        role="student",
        phone=user.phone,
        status="active"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create empty student profile with rollno
    profile = StudentProfile(user_id=new_user.id, rollno=user.rollno)
    db.add(profile)
    db.commit()
    
    return new_user

@router.post("/auth/register/company", response_model=UserResponse)
def register_company(user: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hashed_password,
        role="company",
        phone=user.phone,
        status="pending" # Company must be approved by admin
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create company profile
    profile = CompanyProfile(
        user_id=new_user.id,
        company_name=user.company_name or user.full_name,
        hr_name=user.hr_name,
        website=user.website,
        location=user.location,
        industry=user.industry,
        description=user.description
    )
    db.add(profile)
    db.commit()
    
    return new_user

@router.post("/auth/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if db_user.status == "banned":
        raise HTTPException(status_code=403, detail="Your account is banned.")
    if db_user.status == "blocked":
        raise HTTPException(status_code=403, detail="Your company account is blocked.")
    if db_user.role == "company" and db_user.status == "pending":
        raise HTTPException(status_code=403, detail="Your company registration is pending admin approval.")
    if db_user.role == "company" and db_user.status == "rejected":
        raise HTTPException(status_code=403, detail="Your company registration was rejected.")
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.id), "role": db_user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": db_user.role, "status": db_user.status}

@router.get("/auth/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

# ADMIN ROUTES
@router.get("/admin/dashboard-stats", response_model=AdminDashboardResponse)
def admin_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return {
        "total_students": db.query(User).filter(User.role == "student").count(),
        "total_companies": db.query(User).filter(User.role == "company").count(),
        "pending_approvals": db.query(User).filter(User.role == "company", User.status == "pending").count(),
        "total_jobs": db.query(JobOpening).count(),
        "total_applications": db.query(Application).count(),
        "banned_students": db.query(User).filter(User.role == "student", User.status == "banned").count(),
        "approved_companies": db.query(User).filter(User.role == "company", User.status == "active").count()
    }

@router.get("/admin/company-requests")
def get_company_requests(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    companies = db.query(User).filter(User.role == "company", User.status == "pending").all()
    res = []
    for c in companies:
        profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == c.id).first()
        res.append({
            "id": c.id,
            "company_name": profile.company_name if profile else "",
            "hr_name": profile.hr_name if profile else "",
            "email": c.email,
            "phone": c.phone,
            "location": profile.location if profile else "",
            "website": profile.website if profile else "",
            "status": c.status
        })
    return res

@router.put("/admin/company/{id}/approve")
def approve_company(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    company = db.query(User).filter(User.id == id, User.role == "company").first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    company.status = "active"
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == company.id).first()
    if profile:
        profile.approved_at = datetime.utcnow()
    db.commit()
    return {"message": "Company approved"}

@router.put("/admin/company/{id}/reject")
def reject_company(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    company = db.query(User).filter(User.id == id, User.role == "company").first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    company.status = "rejected"
    db.commit()
    return {"message": "Company rejected"}

@router.put("/admin/company/{id}/block")
def block_company(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    company = db.query(User).filter(User.id == id, User.role == "company").first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    company.status = "blocked"
    db.commit()
    return {"message": "Company blocked"}

@router.get("/admin/companies")
def get_all_companies(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    companies = db.query(User).filter(User.role == "company").all()
    res = []
    for c in companies:
        profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == c.id).first()
        res.append({
            "id": c.id,
            "company_name": profile.company_name if profile else "",
            "hr_name": profile.hr_name if profile else "",
            "email": c.email,
            "phone": c.phone,
            "location": profile.location if profile else "",
            "website": profile.website if profile else "",
            "status": c.status
        })
    return res

@router.get("/admin/students")
def get_all_students(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    students = db.query(User).filter(User.role == "student").all()
    res = []
    for s in students:
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == s.id).first()
        apps_count = db.query(Application).filter(Application.student_id == s.id).count()
        res.append({
            "id": s.id,
            "name": s.full_name,
            "email": s.email,
            "rollno": profile.rollno if profile else "",
            "department": profile.department if profile else "",
            "year": profile.year if profile else "",
            "cgpa": profile.cgpa if profile else 0.0,
            "status": s.status,
            "resume_status": "Uploaded" if (profile and profile.resume_path) else "Pending",
            "applications_count": apps_count
        })
    return res

@router.put("/admin/student/{id}/ban")
def ban_student(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    student = db.query(User).filter(User.id == id, User.role == "student").first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.status = "banned"
    db.commit()
    return {"message": "Student banned"}

@router.put("/admin/student/{id}/unban")
def unban_student(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    student = db.query(User).filter(User.id == id, User.role == "student").first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.status = "active"
    db.commit()
    return {"message": "Student unbanned"}

@router.delete("/admin/student/{id}")
def delete_student(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    student = db.query(User).filter(User.id == id, User.role == "student").first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Delete dependent records
    db.query(Application).filter(Application.student_id == id).delete()
    db.query(StudentProfile).filter(StudentProfile.user_id == id).delete()
    db.delete(student)
    db.commit()
    return {"message": "Student deleted"}

@router.get("/admin/jobs")
def get_all_jobs(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    jobs = db.query(JobOpening).all()
    res = []
    for j in jobs:
        company = db.query(CompanyProfile).filter(CompanyProfile.id == j.company_id).first()
        app_count = db.query(Application).filter(Application.job_id == j.id).count()
        res.append({
            "id": j.id,
            "title": j.title,
            "company_name": company.company_name if company else "Unknown",
            "vacancies": j.vacancies,
            "status": j.status,
            "applications_count": app_count,
            "created_at": j.created_at
        })
    return res

@router.get("/admin/applications")
def get_all_applications(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    apps = db.query(Application).all()
    res = []
    for a in apps:
        student = db.query(User).filter(User.id == a.student_id).first()
        job = db.query(JobOpening).filter(JobOpening.id == a.job_id).first()
        company = db.query(CompanyProfile).filter(CompanyProfile.id == a.company_id).first()
        res.append({
            "id": a.id,
            "student_name": student.full_name if student else "Unknown",
            "company_name": company.company_name if company else "Unknown",
            "job_title": job.title if job else "Unknown",
            "status": a.status,
            "applied_at": a.applied_at
        })
    return res

@router.post("/admin/announcements", response_model=AnnouncementResponse)
def create_announcement(data: AnnouncementCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    ann = Announcement(**data.dict())
    db.add(ann)
    db.commit()
    db.refresh(ann)
    return ann

# COMPANY ROUTES
@router.get("/company/dashboard-stats", response_model=CompanyDashboardResponse)
def company_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "company":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    return {
        "total_openings": db.query(JobOpening).filter(JobOpening.company_id == profile.id).count(),
        "total_applications": db.query(Application).filter(Application.company_id == profile.id).count(),
        "shortlisted_candidates": db.query(Application).filter(Application.company_id == profile.id, Application.status == "shortlisted").count(),
        "pending_applications": db.query(Application).filter(Application.company_id == profile.id, Application.status == "applied").count()
    }

@router.get("/company/profile", response_model=CompanyProfileResponse)
def get_company_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "company":
        raise HTTPException(status_code=403, detail="Not authorized")
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    return profile

@router.post("/company/jobs")
def create_job(job: JobOpeningCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "company":
        raise HTTPException(status_code=403, detail="Not authorized")
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    new_job = JobOpening(**job.dict(), company_id=profile.id)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@router.get("/company/jobs")
def get_company_jobs(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "company":
        raise HTTPException(status_code=403, detail="Not authorized")
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        return []
    jobs = db.query(JobOpening).filter(JobOpening.company_id == profile.id).all()
    res = []
    for j in jobs:
        app_count = db.query(Application).filter(Application.job_id == j.id).count()
        res.append({
            "id": j.id,
            "title": j.title,
            "ctc": j.ctc,
            "vacancies": j.vacancies,
            "status": j.status,
            "applications_count": app_count,
            "created_at": j.created_at
        })
    return res

@router.put("/company/jobs/{job_id}")
def update_job(job_id: int, job: JobOpeningCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "company":
        raise HTTPException(status_code=403, detail="Not authorized")
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    db_job = db.query(JobOpening).filter(JobOpening.id == job_id, JobOpening.company_id == profile.id).first()
    if not db_job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    for key, value in job.dict().items():
        setattr(db_job, key, value)
    db.commit()
    return {"message": "Job updated successfully"}

@router.get("/company/applications")
def get_company_applications(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "company":
        raise HTTPException(status_code=403, detail="Not authorized")
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    if not profile:
        return []
    
    apps = db.query(Application).filter(Application.company_id == profile.id).all()
    res = []
    for a in apps:
        student = db.query(User).filter(User.id == a.student_id).first()
        student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == a.student_id).first()
        job = db.query(JobOpening).filter(JobOpening.id == a.job_id).first()
        
        res.append({
            "id": a.id,
            "student_id": a.student_id,
            "student_name": student.full_name if student else "Unknown",
            "email": student.email if student else "",
            "phone": student.phone if student else "",
            "rollno": student_profile.rollno if student_profile else "",
            "department": student_profile.department if student_profile else "",
            "cgpa": student_profile.cgpa if student_profile else 0.0,
            "job_title": job.title if job else "Unknown",
            "status": a.status,
            "resume_path": a.resume_path
        })
    return res

@router.put("/company/applications/{id}/status")
def update_application_status(id: int, update: ApplicationStatusUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "company":
        raise HTTPException(status_code=403, detail="Not authorized")
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == current_user.id).first()
    app = db.query(Application).filter(Application.id == id, Application.company_id == profile.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    app.status = update.status
    db.commit()
    return {"message": f"Application status updated to {update.status}"}

# STUDENT ROUTES
@router.get("/student/dashboard-stats", response_model=StudentDashboardResponse)
def student_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    
    # Logic for eligible
    eligible = 0
    if profile and profile.cgpa and profile.department:
        jobs = db.query(JobOpening).filter(JobOpening.status == "active").all()
        for j in jobs:
            if profile.cgpa >= j.min_cgpa and profile.department in j.eligible_departments:
                eligible += 1
                
    return {
        "eligible_openings": eligible,
        "applied_openings": db.query(Application).filter(Application.student_id == current_user.id).count(),
        "shortlisted_applications": db.query(Application).filter(Application.student_id == current_user.id, Application.status == "shortlisted").count(),
        "rejected_applications": db.query(Application).filter(Application.student_id == current_user.id, Application.status == "rejected").count()
    }

@router.get("/student/profile", response_model=StudentProfileResponse)
def get_student_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Not authorized")
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    return profile

@router.put("/student/profile")
def update_student_profile(data: StudentProfileCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Not authorized")
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        
    for key, value in data.dict().items():
        if value is not None and key != "phone":
            setattr(profile, key, value)
            
    if data.phone is not None:
        current_user.phone = data.phone
            
    db.commit()
    return {"message": "Profile updated"}

@router.get("/student/jobs")
def get_student_jobs(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    jobs = db.query(JobOpening).filter(JobOpening.status == "active").all()
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    
    res = []
    for j in jobs:
        company = db.query(CompanyProfile).filter(CompanyProfile.id == j.company_id).first()
        is_eligible = False
        reason = "Profile incomplete"
        
        if profile and profile.cgpa and profile.department:
            if profile.cgpa >= j.min_cgpa and profile.department in j.eligible_departments:
                is_eligible = True
                reason = "Eligible"
            elif profile.cgpa < j.min_cgpa:
                reason = "CGPA too low"
            else:
                reason = "Department not eligible"
                
        # Check if already applied
        applied = db.query(Application).filter(Application.student_id == current_user.id, Application.job_id == j.id).first()
        if applied:
            is_eligible = False
            reason = "Already applied"
            
        res.append({
            "id": j.id,
            "company_name": company.company_name if company else "Unknown",
            "title": j.title,
            "ctc": j.ctc,
            "location": j.location,
            "min_cgpa": j.min_cgpa,
            "eligible_departments": j.eligible_departments,
            "last_date": j.last_date,
            "is_eligible": is_eligible,
            "reason": reason
        })
        
    return res

@router.post("/student/jobs/{job_id}/apply")
def apply_to_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    # Check profile and resume
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile or not profile.resume_path:
        raise HTTPException(status_code=400, detail="Please upload resume before applying.")
        
    job = db.query(JobOpening).filter(JobOpening.id == job_id, JobOpening.status == "active").first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found or not active")
        
    # Check eligibility
    if profile.cgpa < job.min_cgpa or profile.department not in job.eligible_departments:
        raise HTTPException(status_code=400, detail="Not eligible for this job")
        
    # Check duplicate
    existing = db.query(Application).filter(Application.student_id == current_user.id, Application.job_id == job_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied")
        
    application = Application(
        student_id=current_user.id,
        job_id=job_id,
        company_id=job.company_id,
        resume_path=profile.resume_path
    )
    db.add(application)
    db.commit()
    return {"message": "Application successful"}

@router.get("/student/applications")
def get_student_applications(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    apps = db.query(Application).filter(Application.student_id == current_user.id).all()
    res = []
    for a in apps:
        job = db.query(JobOpening).filter(JobOpening.id == a.job_id).first()
        company = db.query(CompanyProfile).filter(CompanyProfile.id == a.company_id).first()
        res.append({
            "id": a.id,
            "company_name": company.company_name if company else "Unknown",
            "job_title": job.title if job else "Unknown",
            "applied_at": a.applied_at,
            "status": a.status
        })
    return res

@router.get("/announcements")
def get_announcements(db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    anns = db.query(Announcement).filter(
        Announcement.target_audience.in_(["all", current_user.role])
    ).order_by(Announcement.created_at.desc()).all()
    return anns

import uuid
import shutil
import boto3
import os

@router.post("/student/upload-resume")
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    db_profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    file_extension = file.filename.split(".")[-1]
    filename = f"{current_user.id}_{uuid.uuid4().hex}.{file_extension}"
    
    # Check if S3 is configured
    s3_bucket = os.getenv("AWS_S3_BUCKET_NAME")
    if s3_bucket:
        try:
            s3_client = boto3.client(
                's3',
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                region_name=os.getenv("AWS_REGION", "us-east-1")
            )
            # Upload to S3
            s3_client.upload_fileobj(
                file.file, 
                s3_bucket, 
                f"resumes/{filename}",
                ExtraArgs={"ContentType": file.content_type, "ACL": "public-read"}
            )
            public_url = f"https://{s3_bucket}.s3.{os.getenv('AWS_REGION', 'us-east-1')}.amazonaws.com/resumes/{filename}"
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload to S3: {str(e)}")
    else:
        # Fallback to local storage for free-tier/local testing
        file_path = f"uploads/{filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        public_url = f"http://localhost:8000/uploads/{filename}"
        
    db_profile.resume_path = public_url
    db.commit()
    
    return {"resume_url": public_url, "message": "Resume uploaded successfully"}
