from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas
from ..auth import get_current_user
from .eligibility_routes import check_student_eligibility

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/student", response_model=schemas.StudentDashboardResponse)
def get_student_dashboard(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can view student dashboard"
        )

    student_profile = db.query(models.StudentProfile).filter(
        models.StudentProfile.user_id == current_user.id
    ).first()

    if not student_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found. Please create your profile first."
        )

    companies = db.query(models.Company).all()

    eligible_count = 0

    for company in companies:
        eligible, reason = check_student_eligibility(student_profile, company)
        if eligible:
            eligible_count += 1

    total_applications = db.query(models.Application).filter(
        models.Application.student_id == current_user.id
    ).count()

    shortlisted_count = db.query(models.Application).filter(
        models.Application.student_id == current_user.id,
        models.Application.status == "Shortlisted"
    ).count()

    interview_count = db.query(models.Application).filter(
        models.Application.student_id == current_user.id,
        models.Application.status == "Interview Scheduled"
    ).count()

    rejected_count = db.query(models.Application).filter(
        models.Application.student_id == current_user.id,
        models.Application.status == "Rejected"
    ).count()

    selected_count = db.query(models.Application).filter(
        models.Application.student_id == current_user.id,
        models.Application.status == "Selected"
    ).count()

    dsa_progress = db.query(models.DSAProgress).filter(
        models.DSAProgress.student_id == current_user.id
    ).all()

    total_dsa_topics = len(dsa_progress)

    total_dsa_questions = sum(
        progress.total_questions for progress in dsa_progress
    )

    solved_dsa_questions = sum(
        progress.solved_questions for progress in dsa_progress
    )

    if total_dsa_questions > 0:
        dsa_completion_percentage = round(
            (solved_dsa_questions / total_dsa_questions) * 100,
            2
        )
    else:
        dsa_completion_percentage = 0.0

    return {
        "total_companies": len(companies),
        "eligible_companies": eligible_count,
        "total_applications": total_applications,
        "shortlisted_count": shortlisted_count,
        "interview_count": interview_count,
        "rejected_count": rejected_count,
        "selected_count": selected_count,

        "total_dsa_topics": total_dsa_topics,
        "total_dsa_questions": total_dsa_questions,
        "solved_dsa_questions": solved_dsa_questions,
        "dsa_completion_percentage": dsa_completion_percentage
    }

@router.get("/admin", response_model=schemas.AdminDashboardResponse)
def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can view admin dashboard"
        )

    total_students = db.query(models.User).filter(
        models.User.role == "student"
    ).count()

    total_companies = db.query(models.Company).count()
    total_applications = db.query(models.Application).count()

    applied_count = db.query(models.Application).filter(
        models.Application.status == "Applied"
    ).count()

    shortlisted_count = db.query(models.Application).filter(
        models.Application.status == "Shortlisted"
    ).count()

    interview_count = db.query(models.Application).filter(
        models.Application.status == "Interview Scheduled"
    ).count()

    rejected_count = db.query(models.Application).filter(
        models.Application.status == "Rejected"
    ).count()

    selected_count = db.query(models.Application).filter(
        models.Application.status == "Selected"
    ).count()

    return {
        "total_students": total_students,
        "total_companies": total_companies,
        "total_applications": total_applications,
        "applied_count": applied_count,
        "shortlisted_count": shortlisted_count,
        "interview_count": interview_count,
        "rejected_count": rejected_count,
        "selected_count": selected_count
    }