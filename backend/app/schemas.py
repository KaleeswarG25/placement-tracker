from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str = "student"
    phone: Optional[str] = None
    rollno: Optional[str] = None
    
    # For company specific registration
    company_name: Optional[str] = None
    hr_name: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class StudentProfileCreate(BaseModel):
    department: Optional[str] = None
    year: Optional[int] = None
    cgpa: Optional[float] = 0.0
    backlog_count: Optional[int] = 0
    phone: Optional[str] = None
    skills: Optional[str] = None
    projects: Optional[str] = None
    address: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None

class StudentProfileResponse(BaseModel):
    id: int
    user_id: int
    rollno: Optional[str] = None
    department: Optional[str] = None
    year: Optional[int] = None
    cgpa: Optional[float] = None
    backlog_count: Optional[int] = 0
    skills: Optional[str] = None
    projects: Optional[str] = None
    address: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    resume_path: Optional[str] = None

    class Config:
        from_attributes = True

class CompanyProfileResponse(BaseModel):
    id: int
    user_id: int
    company_name: str
    hr_name: Optional[str] = None
    website: Optional[str] = None
    location: Optional[str] = None
    industry: Optional[str] = None
    description: Optional[str] = None
    linkedin: Optional[str] = None
    logo_path: Optional[str] = None
    approved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class JobOpeningCreate(BaseModel):
    title: str
    description: Optional[str] = None
    skills_required: Optional[str] = None
    min_cgpa: Optional[float] = 0.0
    eligible_departments: str
    batch_year: Optional[str] = None
    location: Optional[str] = None
    ctc: Optional[str] = None
    job_type: Optional[str] = None
    vacancies: Optional[int] = None
    selection_process: Optional[str] = None
    last_date: Optional[datetime] = None

class JobOpeningResponse(BaseModel):
    id: int
    company_id: int
    title: str
    description: Optional[str] = None
    skills_required: Optional[str] = None
    min_cgpa: Optional[float] = None
    eligible_departments: str
    batch_year: Optional[str] = None
    location: Optional[str] = None
    ctc: Optional[str] = None
    job_type: Optional[str] = None
    vacancies: Optional[int] = None
    selection_process: Optional[str] = None
    last_date: Optional[datetime] = None
    status: str
    created_at: datetime
    company: Optional[CompanyProfileResponse] = None

    class Config:
        from_attributes = True

class ApplicationCreate(BaseModel):
    job_id: int

class ApplicationStatusUpdate(BaseModel):
    status: str

class ApplicationResponse(BaseModel):
    id: int
    student_id: int
    job_id: int
    company_id: int
    resume_path: Optional[str] = None
    status: str
    applied_at: datetime
    updated_at: datetime
    student: Optional[UserResponse] = None
    job: Optional[JobOpeningResponse] = None

    class Config:
        from_attributes = True

class AnnouncementCreate(BaseModel):
    title: str
    message: str
    target_audience: str = "all"

class AnnouncementResponse(BaseModel):
    id: int
    title: str
    message: str
    target_audience: str
    created_at: datetime

    class Config:
        from_attributes = True

class StudentDashboardResponse(BaseModel):
    eligible_openings: int
    applied_openings: int
    shortlisted_applications: int
    rejected_applications: int

class CompanyDashboardResponse(BaseModel):
    total_openings: int
    total_applications: int
    shortlisted_candidates: int
    pending_applications: int

class AdminDashboardResponse(BaseModel):
    total_students: int
    total_companies: int
    pending_approvals: int
    total_jobs: int
    total_applications: int
    banned_students: int
    approved_companies: int