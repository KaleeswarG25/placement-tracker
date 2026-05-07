# 🎓 Student Placement Tracker

A full-stack placement management application deployed on AWS with Docker, CI/CD, monitoring, and centralized logging.

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloud-AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" />
  <img src="https://img.shields.io/badge/CI/CD-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" />
  <img src="https://img.shields.io/badge/Monitoring-Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white" />
</p>

---

## 🚀 Overview

Student Placement Tracker is a cloud-deployed web application for managing placement-related workflows between students, companies, and administrators.

The project focuses on practical DevOps implementation:

- AWS-based deployment
- Dockerized backend
- Automated CI/CD pipelines
- Managed PostgreSQL database
- Monitoring with Grafana and Prometheus
- Centralized logs with Loki and Promtail

---

## 🧱 Architecture


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
🛠️ Tech Stack

| Area             | Tools                                        |
| ---------------- | -------------------------------------------- |
| Frontend         | React, Vite, Axios                           |
| Backend          | FastAPI, Python, SQLAlchemy                  |
| Database         | PostgreSQL, AWS RDS                          |
| Cloud            | AWS S3, EC2, ECR, RDS                        |
| CI/CD            | GitHub Actions                               |
| Containerization | Docker                                       |
| Monitoring       | Prometheus, Grafana, Node Exporter, cAdvisor |
| Logging          | Loki, Promtail                               |

⚙️ CI/CD Pipeline
Frontend
GitHub Push → Build React App → Deploy to AWS S3
Backend
GitHub Push → Build Docker Image → Push to AWS ECR → SSH into EC2 → Pull Image → Restart Container

📊 Monitoring & Logging

The project includes a complete observability setup.
| Tool          | Purpose                                  |
| ------------- | ---------------------------------------- |
| Prometheus    | Collects metrics                         |
| Grafana       | Displays dashboards                      |
| Node Exporter | Monitors EC2 CPU, RAM, disk, and network |
| cAdvisor      | Monitors Docker containers               |
| Loki          | Stores logs                              |
| Promtail      | Collects Docker logs                     |

Grafana dashboards used:

1860  - Node Exporter Full
14282 - cAdvisor Docker Monitoring

Loki query:

{job="docker"}

🔐 Environment Variables

Backend environment on EC2
DATABASE_URL=postgresql://postgres:<password>@<rds-endpoint>:5432/postgres
SECRET_KEY=<secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ALLOWED_ORIGINS=<s3-bucket static hosting url>
AWS_REGION=<your-region>
AWS_S3_BUCKET_NAME=resumestoragefordevops<use-your-s3>

GitHub Secrets
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
AWS_S3_BUCKET_NAME
EC2_HOST
EC2_USER
EC2_SSH_KEY
VITE_API_URL-<s3-bucket static hosting url>
VITE_API_BASE_URL-<s3-bucket static hosting url>

🐳 Run Backend Container
cd backend
docker build -t placement-backend .

docker run -d \
  --name placement-backend \
  --restart unless-stopped \
  --env-file backend.env \
  -p 8000:8000 \
  placement-backend

🌐 Frontend Deployment
cd frontend
npm install
npm run build
aws s3 sync ./dist s3://resumestoragefordevops --delete
S3 static website enable

Default Admin credential
Email: admin@example.com
Password: admin123



