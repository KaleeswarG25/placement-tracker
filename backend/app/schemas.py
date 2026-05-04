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
    created_at: datetime

    class Config:
        from_attributes = True