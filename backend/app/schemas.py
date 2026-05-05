from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str = "student"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class StudentProfileCreate(BaseModel):
    department: str
    cgpa: float
    skills: str | None = None
    backlog_count: int = 0
    resume_url: str | None = None


class StudentProfileResponse(BaseModel):
    id: int
    user_id: int
    department: str
    cgpa: float
    skills: str | None = None
    backlog_count: int
    resume_url: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True
class CompanyCreate(BaseModel):
    company_name: str
    role: str
    package_lpa: float
    required_cgpa: float
    eligible_departments: str
    required_skills: str | None = None
    location: str | None = None
    application_deadline: str


class CompanyResponse(BaseModel):
    id: int
    company_name: str
    role: str
    package_lpa: float
    required_cgpa: float
    eligible_departments: str
    required_skills: str | None = None
    location: str | None = None
    application_deadline: str
    status: str = "pending"
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True

class EligibilityResponse(BaseModel):
    company_id: int
    company_name: str
    role: str
    required_cgpa: float
    student_cgpa: float
    eligible: bool
    reason: str
class ApplicationCreate(BaseModel):
    company_id: int


class ApplicationStatusUpdate(BaseModel):
    status: str
    remarks: str | None = None


class ApplicationResponse(BaseModel):
    id: int
    student_id: int
    student_name: str | None = None
    company_id: int
    company_name: str | None = None
    status: str
    remarks: str | None = None
    applied_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
class StudentDashboardResponse(BaseModel):
    total_companies: int
    eligible_companies: int
    total_applications: int
    shortlisted_count: int
    interview_count: int
    rejected_count: int
    selected_count: int

    total_dsa_topics: int
    total_dsa_questions: int
    solved_dsa_questions: int
    dsa_completion_percentage: float

class AdminDashboardResponse(BaseModel):
    total_students: int
    total_companies: int
    total_applications: int
    applied_count: int
    shortlisted_count: int
    interview_count: int
    rejected_count: int
    selected_count: int
class DSAProgressCreate(BaseModel):
    topic: str
    total_questions: int
    solved_questions: int = 0


class DSAProgressUpdate(BaseModel):
    total_questions: int
    solved_questions: int


class DSAProgressResponse(BaseModel):
    id: int
    student_id: int
    topic: str
    total_questions: int
    solved_questions: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True