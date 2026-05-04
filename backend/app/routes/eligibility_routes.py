from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas
from ..auth import get_current_user

router = APIRouter(
    prefix="/eligibility",
    tags=["Eligibility Checker"]
)


def check_student_eligibility(student_profile, company):
    reasons = []

    student_department = student_profile.department.strip().lower()

    eligible_departments = [
        dept.strip().lower()
        for dept in company.eligible_departments.split(",")
    ]

    if student_profile.cgpa < company.required_cgpa:
        reasons.append(
            f"CGPA is less than required. Required: {company.required_cgpa}, Your CGPA: {student_profile.cgpa}"
        )

    if student_department not in eligible_departments:
        reasons.append(
            f"Department not eligible. Eligible departments: {company.eligible_departments}"
        )

    if student_profile.backlog_count > 0:
        reasons.append(
            f"You have {student_profile.backlog_count} backlog(s). Companies usually require no active backlogs."
        )

    if len(reasons) == 0:
        return True, "You are eligible for this company"

    return False, " | ".join(reasons)


@router.get("/company/{company_id}", response_model=schemas.EligibilityResponse)
def check_eligibility_for_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can check eligibility"
        )

    student_profile = db.query(models.StudentProfile).filter(
        models.StudentProfile.user_id == current_user.id
    ).first()

    if not student_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student profile not found. Please create your profile first."
        )

    company = db.query(models.Company).filter(
        models.Company.id == company_id
    ).first()

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )

    eligible, reason = check_student_eligibility(student_profile, company)

    return {
        "company_id": company.id,
        "company_name": company.company_name,
        "role": company.role,
        "required_cgpa": company.required_cgpa,
        "student_cgpa": student_profile.cgpa,
        "eligible": eligible,
        "reason": reason
    }


@router.get("/all", response_model=list[schemas.EligibilityResponse])
def check_eligibility_for_all_companies(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can check eligibility"
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

    result = []

    for company in companies:
        eligible, reason = check_student_eligibility(student_profile, company)

        result.append({
            "company_id": company.id,
            "company_name": company.company_name,
            "role": company.role,
            "required_cgpa": company.required_cgpa,
            "student_cgpa": student_profile.cgpa,
            "eligible": eligible,
            "reason": reason
        })

    return result