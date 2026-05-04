from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas
from ..auth import get_current_user

router = APIRouter(
    prefix="/profile",
    tags=["Student Profile"]
)


@router.post("/", response_model=schemas.StudentProfileResponse)
def create_or_update_profile(
    profile: schemas.StudentProfileCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can create profile"
        )

    existing_profile = db.query(models.StudentProfile).filter(
        models.StudentProfile.user_id == current_user.id
    ).first()

    if existing_profile:
        existing_profile.department = profile.department
        existing_profile.cgpa = profile.cgpa
        existing_profile.skills = profile.skills
        existing_profile.backlog_count = profile.backlog_count
        existing_profile.resume_url = profile.resume_url

        db.commit()
        db.refresh(existing_profile)

        return existing_profile

    new_profile = models.StudentProfile(
        user_id=current_user.id,
        department=profile.department,
        cgpa=profile.cgpa,
        skills=profile.skills,
        backlog_count=profile.backlog_count,
        resume_url=profile.resume_url
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return new_profile


@router.get("/me", response_model=schemas.StudentProfileResponse)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    profile = db.query(models.StudentProfile).filter(
        models.StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    return profile