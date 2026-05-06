from app.database import engine, Base
from sqlalchemy import text
from app.models import User, StudentProfile, CompanyProfile, JobOpening, Application, Announcement

print("Dropping all tables...")
with engine.connect() as con:
    con.execute(text("DROP SCHEMA public CASCADE;"))
    con.execute(text("CREATE SCHEMA public;"))
    con.commit()

print("Creating all tables...")
Base.metadata.create_all(bind=engine)
print("Database reset complete.")
