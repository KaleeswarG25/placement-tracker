from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    role = Column(String(20), default="student") # student, company, admin
    phone = Column(String(20), nullable=True)
    status = Column(String(20), default="active") # active, banned, pending, approved, rejected, blocked
    created_at = Column(DateTime, default=datetime.utcnow)

    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)
    company_profile = relationship("CompanyProfile", back_populates="user", uselist=False)
    applications = relationship("Application", back_populates="student")

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    rollno = Column(String(50), nullable=True, unique=True)
    department = Column(String(50), nullable=True)
    year = Column(Integer, nullable=True)
    cgpa = Column(Float, nullable=True, default=0.0)
    backlog_count = Column(Integer, nullable=True, default=0)
    skills = Column(String(500), nullable=True)
    projects = Column(String(1000), nullable=True)
    address = Column(String(255), nullable=True)
    linkedin = Column(String(255), nullable=True)
    github = Column(String(255), nullable=True)
    portfolio = Column(String(255), nullable=True)
    resume_path = Column(String(255), nullable=True)
    
    user = relationship("User", back_populates="student_profile")

class CompanyProfile(Base):
    __tablename__ = "company_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    company_name = Column(String(100), nullable=False)
    hr_name = Column(String(100), nullable=True)
    website = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    industry = Column(String(100), nullable=True)
    description = Column(String(1000), nullable=True)
    linkedin = Column(String(255), nullable=True)
    logo_path = Column(String(255), nullable=True)
    approved_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="company_profile")
    jobs = relationship("JobOpening", back_populates="company")

class JobOpening(Base):
    __tablename__ = "job_openings"
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("company_profiles.id"), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(String(2000), nullable=True)
    skills_required = Column(String(500), nullable=True)
    min_cgpa = Column(Float, default=0.0)
    eligible_departments = Column(String(500), nullable=False)
    batch_year = Column(String(50), nullable=True)
    location = Column(String(255), nullable=True)
    ctc = Column(String(100), nullable=True)
    job_type = Column(String(50), nullable=True)
    vacancies = Column(Integer, nullable=True)
    selection_process = Column(String(500), nullable=True)
    last_date = Column(DateTime, nullable=True)
    status = Column(String(20), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("CompanyProfile", back_populates="jobs")
    applications = relationship("Application", back_populates="job")

class Application(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("job_openings.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("company_profiles.id"), nullable=False)
    resume_path = Column(String(255), nullable=True)
    status = Column(String(50), default="applied")
    applied_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    student = relationship("User", back_populates="applications")
    job = relationship("JobOpening", back_populates="applications")
    company = relationship("CompanyProfile")

class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    message = Column(String(2000), nullable=False)
    target_audience = Column(String(50), default="all")
    created_at = Column(DateTime, default=datetime.utcnow)