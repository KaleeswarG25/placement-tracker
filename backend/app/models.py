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
    role = Column(String(20), default="student")
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("StudentProfile", back_populates="user", uselist=False)


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    department = Column(String(50), nullable=False)
    cgpa = Column(Float, nullable=False)
    skills = Column(String(255), nullable=True)
    backlog_count = Column(Integer, default=0)
    resume_url = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="profile")

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)

    company_name = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    package_lpa = Column(Float, nullable=False)

    required_cgpa = Column(Float, nullable=False)
    eligible_departments = Column(String(255), nullable=False)
    required_skills = Column(String(255), nullable=True)

    status = Column(String(20), default="pending")
    is_active = Column(Boolean, default=True)

    application_deadline = Column(String(50), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)

    status = Column(String(50), default="Applied")
    remarks = Column(String(255), nullable=True)

    applied_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User")
    company = relationship("Company")
class DSAProgress(Base):
    __tablename__ = "dsa_progress"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    topic = Column(String(100), nullable=False)
    total_questions = Column(Integer, nullable=False)
    solved_questions = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("User")