# AWS Deployment & CI/CD Implementation Plan

**Goal:** Deploy the Placement Tracker application to a production-ready AWS environment with automated CI/CD.

**Architecture:** 
- **Backend**: FastAPI app running in **AWS App Runner** (Docker-based).
- **Frontend**: React/Vite app hosted on **AWS Amplify**.
- **Database**: **Amazon RDS** (PostgreSQL) for persistent data storage.
- **CI/CD**: **GitHub Actions** for backend image builds and ECR deployment; **AWS Amplify** for frontend builds.

**Tech Stack:** AWS (App Runner, ECR, RDS, Amplify), GitHub Actions, Docker, PostgreSQL.

---

### Phase 1: Infrastructure Preparation (Pre-requisites)

#### Task 1: Environment Variables Setup
**Files:**
- Create: `backend/.env.production`
- Create: `frontend/.env.production`

**Step 1: Create production environment variables for backend**
```env
DATABASE_URL=postgresql://<DB_USER>:<DB_PASSWORD>@<DB_ENDPOINT>:5432/placement_tracker
SECRET_KEY=yoursecretkeyhere
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

**Step 2: Create production environment variables for frontend**
```env
VITE_API_URL=https://<your-app-runner-url>.awsapprunner.com
```

#### Task 2: AWS Resource Creation Guide
*Note: This task involves manual steps in the AWS Console or using CLI.*
1. **RDS**: Create a PostgreSQL instance.
2. **ECR**: Create a private repository named `placement-tracker-backend`.
3. **App Runner**: Create a service linked to the ECR repo.

---

### Phase 2: CI/CD Pipeline (Backend)

#### Task 3: GitHub Actions Workflow for Backend
**Files:**
- Create: `.github/workflows/backend-deploy.yml`

**Step 1: Define the workflow to build and push to ECR**
```yaml
name: Backend Deploy to AWS

on:
  push:
    branches: [ main ]
    paths: [ 'backend/**' ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build, tag, and push image to Amazon ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: placement-tracker-backend
          IMAGE_TAG: latest
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG ./backend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
```

---

### Phase 3: Frontend Deployment

#### Task 4: Amplify Configuration
**Files:**
- Create: `amplify.yml` (optional, for build overrides)

**Step 1: Connect GitHub repo to AWS Amplify**
1. Select the `placement-tracker` repo.
2. Set build directory to `frontend/dist`.
3. Set base directory to `frontend`.

---

### Phase 4: Security & Networking

#### Task 5: Database Migration & Connection
1. Ensure RDS Security Group allows traffic from App Runner.
2. Run initial migrations (or use `Base.metadata.create_all` which is already in `main.py`).
