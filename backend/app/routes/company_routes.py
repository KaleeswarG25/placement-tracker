from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from .. import models, schemas
from ..auth import get_current_user

router = APIRouter(
    prefix="/companies",
    tags=["Companies"]
)


@router.post("/", response_model=schemas.CompanyResponse)
def add_company(
    company: schemas.CompanyCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admin can add companies"
        )

    new_company = models.Company(
        company_name=company.company_name,
        role=company.role,
        package_lpa=company.package_lpa,
        required_cgpa=company.required_cgpa,
        eligible_departments=company.eligible_departments,
        required_skills=company.required_skills,
        location=company.location,
        application_deadline=company.application_deadline
    )

    db.add(new_company)
    db.commit()
    db.refresh(new_company)

    return new_company


@router.get("/", response_model=list[schemas.CompanyResponse])
def get_all_companies(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    companies = db.query(models.Company).order_by(
        models.Company.created_at.desc()
    ).all()

    return companies


@router.get("/{company_id}", response_model=schemas.CompanyResponse)
def get_company_by_id(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    company = db.query(models.Company).filter(
        models.Company.id == company_id
    ).first()

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found"
        )

    return company