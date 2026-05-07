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
Service	Purpose
Amazon S3	Hosts the React frontend as a static website
Amazon EC2	Runs the FastAPI backend Docker container
Amazon RDS	Managed PostgreSQL database
Amazon ECR	Stores backend Docker images
IAM	Manages access for GitHub Actions and AWS resources
Security Groups	Controls network access between services

Default Admin
Email: admin@example.com
Password: admin123

For production use, the admin password should be changed immediately.


