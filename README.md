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
- **Language**: Python 3.10+
- **ML Libraries**:
  - `sentence-transformers` (for vector embeddings)
  - `scikit-learn` (for cosine similarity)
  - `pdfplumber` (for PDF text extraction)
  - `numpy`
- **Database**: MySQL

### Infrastructure
- **Containerization**: Docker & Docker Compose

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

- **Database (MySQL)**: Stores user metadata and analysis history (optional depending on configuration).

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop** (for containerized setup)
- **Node.js** (v16 or higher)
- **Python** (v3.10 or higher)
- **MySQL Server** (if running locally without Docker)

## 🚀 Installation & Setup

### Method 1: Docker (Recommended)

This method sets up the database, backend, and frontend automatically.

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Co-vengers/ATS-Optimizer
   cd ATS-Optimizer
   ```

2. **Create `.env` file** in the root:
   (See [Configuration](#-configuration) section for details).

3. **Build and Run**:
   ```bash
   docker-compose up --build
   ```

4. **Access the App**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Method 2: Manual Setup (Local)

#### 1. Database Setup

Ensure your local MySQL server is running and create a database:

```sql
CREATE DATABASE ats;
```

#### 2. Backend Setup

```bash
cd Backend

# Create Virtual Environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt

# Run Migrations
python manage.py makemigrations
python manage.py migrate

# Start Server
python manage.py runserver
```

#### 3. Frontend Setup

```bash
cd frontend

# Install Dependencies
npm install

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
5. Add **Authorized Origins**: `http://localhost:3000`
6. Copy the **Client ID** and paste it into `src/App.js` or your `.env` file.

### Environment Variables

Create a `.env` file in the `Backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ats
DB_PORT=3306

# Django Configuration
SECRET_KEY=your_secret_key_here
DEBUG=True
```

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

### `Access denied for user 'root'@'localhost'`

**Cause**: Django cannot connect to MySQL with the provided credentials.

**Fix**: Verify the `DB_PASSWORD` in your `.env` file matches your local MySQL password. If using Docker, ensure the `docker-compose.yml` credentials match.

---

### `npm error: npm ci can only install packages...`

**Cause**: `package-lock.json` is out of sync with `package.json`.

**Fix**: Run `npm install` instead of `npm ci`, or delete `package-lock.json` and run `npm install` again.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request for any features or bug fixes.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
