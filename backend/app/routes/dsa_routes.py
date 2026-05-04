from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from ..database import get_db
from .. import models, schemas
from ..auth import get_current_user

router = APIRouter(
    prefix="/dsa",
    tags=["DSA Progress"]
)


@router.post("/", response_model=schemas.DSAProgressResponse)
def add_or_update_dsa_progress(
    progress: schemas.DSAProgressCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can update DSA progress"
        )

    if progress.solved_questions > progress.total_questions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solved questions cannot be greater than total questions"
        )

    existing_progress = db.query(models.DSAProgress).filter(
        models.DSAProgress.student_id == current_user.id,
        models.DSAProgress.topic.ilike(progress.topic)
    ).first()

    if existing_progress:
        existing_progress.total_questions = progress.total_questions
        existing_progress.solved_questions = progress.solved_questions
        existing_progress.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(existing_progress)

        return existing_progress

    new_progress = models.DSAProgress(
        student_id=current_user.id,
        topic=progress.topic,
        total_questions=progress.total_questions,
        solved_questions=progress.solved_questions
    )

    db.add(new_progress)
    db.commit()
    db.refresh(new_progress)

    return new_progress


@router.get("/my", response_model=list[schemas.DSAProgressResponse])
def get_my_dsa_progress(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can view DSA progress"
        )

    progress = db.query(models.DSAProgress).filter(
        models.DSAProgress.student_id == current_user.id
    ).order_by(models.DSAProgress.topic.asc()).all()

    return progress


@router.put("/{progress_id}", response_model=schemas.DSAProgressResponse)
def update_dsa_progress_by_id(
    progress_id: int,
    progress_update: schemas.DSAProgressUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can update DSA progress"
        )

    if progress_update.solved_questions > progress_update.total_questions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solved questions cannot be greater than total questions"
        )

    progress = db.query(models.DSAProgress).filter(
        models.DSAProgress.id == progress_id,
        models.DSAProgress.student_id == current_user.id
    ).first()

    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DSA progress not found"
        )

    progress.total_questions = progress_update.total_questions
    progress.solved_questions = progress_update.solved_questions
    progress.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(progress)

    return progress


@router.delete("/{progress_id}")
def delete_dsa_progress(
    progress_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can delete DSA progress"
        )

    progress = db.query(models.DSAProgress).filter(
        models.DSAProgress.id == progress_id,
        models.DSAProgress.student_id == current_user.id
    ).first()

    if not progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DSA progress not found"
        )

    db.delete(progress)
    db.commit()

    return {
        "message": "DSA progress deleted successfully"
    }