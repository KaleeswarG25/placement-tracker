from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
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

    location = Column(String(100), nullable=True)
    application_deadline = Column(String(50), nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)