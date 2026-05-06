from app.database import engine, Base
from app.models import User, StudentProfile, CompanyProfile, JobOpening, Application, Announcement

print("Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("Creating all tables...")
Base.metadata.create_all(bind=engine)
print("Database reset complete.")
