# 🚀 AI-Powered ATS Resume Optimizer

A modern, full-stack web application that uses Artificial Intelligence to analyze resumes against job descriptions. It mimics Applicant Tracking Systems (ATS) used by major corporations, providing candidates with a match score and actionable feedback on missing keywords.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
  - [Method 1: Docker (Recommended)](#method-1-docker-recommended)
  - [Method 2: Manual Setup](#method-2-manual-setup-local)
- [Configuration](#-configuration)
  - [Google OAuth Setup](#google-oauth-setup)
  - [Environment Variables](#environment-variables)
- [Deployment](#-deployment)
- [Usage](#-usage)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 🔐 **Secure Authentication**: Seamless login via Google OAuth using `react-oauth/google`.
- 📄 **PDF Parsing**: Robust extraction of text from PDF resumes using `pdfplumber`.
- 🧠 **AI Scoring**: Uses Sentence-BERT (SBERT) to calculate semantic similarity between the resume and job description, not just keyword matching.
- 🔍 **Keyword Analysis**: Identifies critical hard skills and keywords missing from the resume.
- 🎨 **Modern UI/UX**: Responsive, glassmorphism-inspired interface built with React and Tailwind CSS.
- 💾 **Session Persistence**: Users stay logged in across page refreshes.
- 📊 **Visual Feedback**: Animated progress bars and color-coded score indicators.

## 🛠 Tech Stack

### Frontend
- **Framework**: React.js (v18+)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Auth**: Google OAuth 2.0
- **HTTP Client**: Axios

### Backend
- **Framework**: Django REST Framework (DRF)
- **Language**: Python 3.11+
- **ML Libraries**:
  - `sentence-transformers` (for vector embeddings)
  - `scikit-learn` (for cosine similarity)
  - `pdfplumber` (for PDF text extraction)
  - `numpy`
- **Database**: PostgreSQL 15+
- **Production Server**: Gunicorn with WhiteNoise

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Deployment**: Render, AWS, or any Docker-compatible platform

## 🏗 Architecture

The application follows a decoupled client-server architecture:

- **Frontend (React)**: Handles user interaction, file drag-and-drop, and displays results. It communicates with the backend via REST API.

- **Backend (Django)**:
  - Receives the PDF and Job Description.
  - Parses the PDF text.
  - Generates vector embeddings for both texts using a pre-trained Transformer model (`all-MiniLM-L6-v2`).
  - Calculates the cosine similarity score.
  - Extracts keywords and identifies gaps.
  - Returns JSON response to the frontend.

- **Database (PostgreSQL)**: Stores user metadata and analysis history with ACID compliance and advanced features.

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop** (for containerized setup) - Recommended
- **Node.js** (v16 or higher)
- **Python** (v3.11 or higher)
- **PostgreSQL** (v15 or higher) - if running locally without Docker

## 🚀 Installation & Setup

### Method 1: Docker (Recommended)

This method sets up the database, backend, and frontend automatically.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Co-vengers/ATS-Optimizer
   cd ATS-Optimizer
   ```

2. **Create `.env` file** in the `Backend` directory:
   ```env
   # Database Configuration
   DB_NAME=ats_db
   DB_USER=postgres
   DB_PASSWORD=your_secure_password
   DB_HOST=db
   DB_PORT=5432

   # Django Configuration
   SECRET_KEY=your_secret_key_here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   ```

3. **Build and Run**:
   ```bash
   docker-compose up --build
   ```

4. **Access the App**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Panel: http://localhost:8000/admin

### Method 2: Manual Setup (Local)

#### 1. Database Setup

Ensure your local PostgreSQL server is running and create a database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ats_db;

# Create user (optional)
CREATE USER ats_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ats_db TO ats_user;

# Exit
\q
```

#### 2. Backend Setup

```bash
cd Backend

# Create Virtual Environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
DB_NAME=ats_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your_secret_key_here
DEBUG=True
EOF

# Run Migrations
python manage.py makemigrations
python manage.py migrate

# Create Superuser (optional)
python manage.py createsuperuser

# Start Server
python manage.py runserver
```

#### 3. Frontend Setup

```bash
cd frontend

# Install Dependencies
npm install

# Create .env file (if needed)
echo "REACT_APP_API_URL=http://localhost:8000" > .env

# Start React App
npm start
```

## ⚙ Configuration

### Google OAuth Setup

To enable Google Login, you need a Client ID:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Navigate to **APIs & Services > Credentials**.
4. Create **OAuth Client ID** (Application Type: Web Application).
5. Add **Authorized JavaScript Origins**:
   - `http://localhost:3000` (for development)
   - Your production URL (for production)
6. Add **Authorized Redirect URIs**:
   - `http://localhost:3000`
   - Your production URL
7. Copy the **Client ID** and add it to your frontend configuration.

### Environment Variables

#### Backend (.env)

```env
# Database Configuration (PostgreSQL)
DB_NAME=ats_db
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432

# For Render or other platforms using DATABASE_URL
DATABASE_URL=postgresql://user:password@host:5432/database

# Django Configuration
SECRET_KEY=your_secret_key_here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://your-frontend-url.com,http://localhost:3000

# Security (Production only)
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

#### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## 🌐 Deployment

### Deploying to Render

1. **Create PostgreSQL Database on Render**:
   - Go to Render Dashboard → New → PostgreSQL
   - Name: `ats-postgres`
   - Plan: Free (or paid for production)
   - Note the Internal Database URL

2. **Deploy Backend**:
   - Push your code to GitHub
   - Go to Render Dashboard → New → Web Service
   - Connect your repository
   - Configure:
     - **Root Directory**: `Backend`
     - **Environment**: Docker
     - **Build Command**: `chmod +x build.sh && ./build.sh`
     - **Start Command**: `gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT`
   - Add environment variables (SECRET_KEY, DATABASE_URL, etc.)

3. **Deploy Frontend**:
   - Create a new Static Site on Render
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

### Deploying to Other Platforms

The application is containerized and can be deployed to:
- **AWS** (ECS, Elastic Beanstalk)
- **Google Cloud** (Cloud Run, App Engine)
- **Azure** (Container Instances, App Service)
- **DigitalOcean** (App Platform)
- **Heroku**

Refer to platform-specific documentation for deployment instructions.

## 📖 Usage

1. **Login**: Sign in using your Google Account.

2. **Input Data**:
   - Paste the **Job Description (JD)** into the text area.
   - Upload your **Resume** (PDF format only).

3. **Analyze**: Click "Analyze My Resume".

4. **Review Results**:
   - **Score**: See your match percentage (0-100%).
   - **Missing Keywords**: Review the list of skills found in the JD but missing from your resume.

5. **Optimize**: Update your resume with the missing keywords and re-upload to improve your score.

## 🔧 Troubleshooting

### `ModuleNotFoundError: No module named 'backend'`

**Cause**: Mismatch between folder names (e.g., `Backend` vs `backend`) or missing `__init__.py`.

**Fix**: Ensure your inner project folder is named `backend` (lowercase) and contains an `__init__.py` file. Check `manage.py` to ensure it points to `backend.settings`.

---

### `FATAL: password authentication failed for user "postgres"`

**Cause**: Django cannot connect to PostgreSQL with the provided credentials.

**Fix**: 
- Verify the `DB_PASSWORD` in your `.env` file matches your PostgreSQL password
- Check that `DB_HOST` and `DB_PORT` are correct
- For Docker: ensure `docker-compose.yml` credentials match your `.env`
- Test connection: `psql -U postgres -h localhost -d ats_db`

---

### `relation "table_name" does not exist`

**Cause**: Database migrations haven't been run.

**Fix**:
```bash
python manage.py makemigrations
python manage.py migrate
```

---

### `Could not install packages due to an OSError: [Errno 28] No space left on device`

**Cause**: Insufficient disk space during Docker build.

**Fix**:
```bash
# Clean up Docker resources
docker system prune -a --volumes

# Check disk space
df -h

# If needed, use CPU-only PyTorch (lighter)
# Update requirements.txt to use torch CPU version
```

---

### `npm error: npm ci can only install packages...`

**Cause**: `package-lock.json` is out of sync with `package.json`.

**Fix**: Run `npm install` instead of `npm ci`, or delete `package-lock.json` and run `npm install` again.

---

### Port Already in Use

**Cause**: Another service is using port 8000 or 3000.

**Fix**:
```bash
# Find and kill the process
# Linux/Mac:
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows PEP 8 (Python) and ESLint (JavaScript) standards
- All tests pass
- Documentation is updated

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Sentence-BERT for semantic similarity
- Django REST Framework for robust API development
- React community for excellent frontend tools
- All contributors and users of this project

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on [GitHub Issues](https://github.com/Co-vengers/ATS-Optimizer/issues)
- Contact the maintainers

---

Made with ❤️ by Co-vengers Team