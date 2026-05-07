# 🎓 Student Placement Tracker

![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Container-Docker-blue?style=for-the-badge&logo=docker)
![AWS](https://img.shields.io/badge/Cloud-AWS-orange?style=for-the-badge&logo=amazonaws)
![GitHub Actions](https://img.shields.io/badge/CI/CD-GitHub_Actions-black?style=for-the-badge&logo=githubactions)

A full-stack **Student Placement Tracker** application deployed on AWS using modern DevOps practices.

This project demonstrates cloud deployment, containerization, CI/CD automation, database integration, and production-style environment configuration using **React, FastAPI, Docker, AWS EC2, S3, RDS, ECR, and GitHub Actions**.

---

## 📌 Project Overview

Student Placement Tracker is a web-based application designed to manage placement-related activities for students, companies, and administrators.

The platform supports:

- Student registration and login
- Company registration
- Admin authentication
- Company approval workflow
- Role-based access
- Backend API integration
- Cloud-hosted frontend and backend
- PostgreSQL database connectivity

---

## 🏗️ Architecture

```txt
                         ┌──────────────────────┐
                         │      User Browser     │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   AWS S3 Frontend     │
                         │   React Static Site   │
                         └──────────┬───────────┘
                                    │ API Requests
                                    ▼
                         ┌──────────────────────┐
                         │    AWS EC2 Instance   │
                         │ FastAPI Docker App    │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ AWS RDS PostgreSQL    │
                         │ Managed Database      │
                         └──────────────────────┘
```
🧰 Tech Stack
Frontend
->React
->Axios
->JavaScript
->AWS S3 Static Website Hosting
Backend
->FastAPI
->Python
->JWT Authentication
->Docker
->Database
DevOps & Cloud
->AWS EC2
->AWS S3
->AWS RDS
->AWS ECR
->Docker
->GitHub Actions

☁️ AWS Services Used

Amazon S3 -	Hosts the React frontend as a static website
Amazon EC2 - Runs the FastAPI backend Docker container
Amazon RDS - Managed PostgreSQL database
Amazon ECR - Stores backend Docker images


🔐 Environment Variables

Environment files are not committed to GitHub.

Backend Environment

Create this file on the EC2 server:

backend.env

Example:

DATABASE_URL=postgresql://postgres:<password>@<rds-endpoint>:5432/postgres
SECRET_KEY=<your-secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALLOWED_ORIGINS=http://resumestoragefordevops.s3-website-us-east-1.amazonaws.com
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=resumestoragefordevops
Frontend GitHub Secrets

Configured in:

GitHub Repository → Settings → Secrets and variables → Actions

Required secrets:

VITE_API_URL=http://<EC2_PUBLIC_IP>:8000
VITE_API_BASE_URL=http://<EC2_PUBLIC_IP>:8000
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
AWS_S3_BUCKET_NAME
AWS_CLOUDFRONT_ID

🐳 Backend Docker Deployment
Build Docker Image
cd backend
docker build -t placement-backend .
Run Backend Container
docker rm -f placement-backend 2>/dev/null || true

docker run -d \
  --name placement-backend \
  --restart unless-stopped \
  --env-file backend.env \
  -p 8000:8000 \
  placement-backend
Test Backend
curl http://localhost:8000

Expected response:

{
  "message": "Student Placement Tracker Backend is running",
  "database": "Connected successfully"
}
🌐 Frontend Deployment

The frontend is built with Vite and deployed to AWS S3.

Build Frontend
cd frontend
npm install
npm run build
Deploy to S3
aws s3 sync ./frontend/dist s3://resumestoragefordevops --delete
S3 Static Website Configuration

Set the following in the S3 bucket static website hosting
Default Admin
Email: admin@example.com
Password: admin123

For production use, the admin password should be changed immediately.


