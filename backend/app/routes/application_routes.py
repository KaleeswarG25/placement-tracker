from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from ..database import get_db
from .. import models, schemas
from ..auth import get_current_user

router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)


@router.post("/apply", response_model=schemas.ApplicationResponse)
def apply_to_company(
    application: schemas.ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can apply to companies"
        )

    student_profile = db.query(models.StudentProfile).filter(
        models.StudentProfile.user_id == current_user.id
    ).first()

    if not student_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please create your student profile before applying"
        )

    company = db.query(models.Company).filter(
        models.Company.id == application.company_id
    ).first()

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )

    existing_application = db.query(models.Application).filter(
        models.Application.student_id == current_user.id,
        models.Application.company_id == application.company_id
    ).first()

    if existing_application:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied to this company"
        )

    new_application = models.Application(
        student_id=current_user.id,
        company_id=application.company_id,
        status="Applied"
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return new_application


@router.get("/my", response_model=list[schemas.ApplicationResponse])
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can view their applications"
        )

    applications = db.query(models.Application).filter(
        models.Application.student_id == current_user.id
    ).order_by(models.Application.applied_at.desc()).all()

    return applications


@router.get("/all", response_model=list[schemas.ApplicationResponse])
def get_all_applications(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can view all applications"
        )

    applications = db.query(models.Application).order_by(
        models.Application.applied_at.desc()
    ).all()

    return applications


@router.put("/{application_id}/status", response_model=schemas.ApplicationResponse)
def update_application_status(
    application_id: int,
    status_update: schemas.ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can update application status"
        )

    application = db.query(models.Application).filter(
        models.Application.id == application_id
    ).first()

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )

    allowed_status = [
        "Applied",
        "Shortlisted",
        "Interview Scheduled",
        "Rejected",
        "Selected"
    ]

    if status_update.status not in allowed_status:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Allowed status: {allowed_status}"
        )

    application.status = status_update.status
    application.remarks = status_update.remarks
    application.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(application)

    return application