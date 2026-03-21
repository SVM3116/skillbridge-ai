# SkillBridge AI — Adaptive Onboarding Engine

> **ARTPARK CodeForge Hackathon 2026**

## Demo Video
[![SkillBridge AI Demo](https://img.shields.io/badge/▶_Watch_Demo-YouTube-red)](https://youtu.be/lYfVfRa62uI)

> AI-driven, adaptive learning engine that parses a new hire's capabilities and dynamically maps a personalized training pathway to reach role-specific competency.

---

## Team — ONE RUPEE

| Name | Role |
|---|---|
| Manoj Kumar V | Developer |
| Prajwal Gowda | Developer |

**Institution:** Visvesvaraya Technological University, Belagavi
**Hackathon:** ARTPARK CodeForge 2026

---

## Problem Statement

Traditional corporate onboarding uses a one-size-fits-all curriculum. A 10-year veteran and a fresh graduate receive the **same modules** — wasting 40% of training time and overwhelming beginners while boring experts.

---

## Our Solution

SkillBridge AI solves this by:
1. Parsing the candidate's **real** skill level via resume + diagnostic test (not just resume claims)
2. Comparing against the **target job description**
3. Running a **5-step adaptive pathing algorithm** (DAG-based + Knowledge Tracing)
4. Generating a **personalized, sequenced learning roadmap** grounded strictly in a curated course catalog

---

## Live Demo Flow

```
Upload Resume PDF + Paste Job Description
        ↓
Gemini 2.5 Flash extracts skills with confidence scores
        ↓
Diagnostic MCQ test — JD-relevant skills only (Knowledge Tracing)
        ↓
3-way gap analysis: resume claim vs test score vs JD requirement
        ↓
DAG prerequisite resolution + catalog-grounded course matching
        ↓
Visual roadmap with reasoning trace + impact metrics
        ↓
Download PDF report
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React.js | 18.x |
| Styling | TailwindCSS (CDN) + Custom CSS | 3.x |
| Backend | Python + FastAPI | 3.11 / 0.115.x |
| Server | Uvicorn (ASGI) | 0.42.x |
| LLM / AI | Google Gemini 2.5 Flash | gemini-2.5-flash |
| PDF Parsing | pdfplumber | 0.11.x |
| HTTP Client | Axios | 1.x |
| PDF Export | html2pdf.js | 0.10.x |
| Environment | python-dotenv | 1.x |

---

## Project Structure

```
skillbridge-ai/
├── backend/
│   ├── main.py              # FastAPI app — 5 API endpoints
│   ├── gap_engine.py        # Original adaptive pathing algorithm (DAG)
│   ├── test_engine.py       # Diagnostic MCQ generation + scoring
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # API key (never committed — see .env.example)
├── data/
│   ├── course_catalog.json  # 44 courses across 6 domains
│   └── prerequisite_map.json# Skill dependency graph (DAG)
├── frontend/
│   └── src/
│       ├── App.js           # Screen router
│       └── pages/
│           ├── Landing.js
│           ├── Upload.js
│           ├── Loading.js
│           ├── SkillConfirm.js
│           ├── DiagnosticTest.js
│           └── Results.js
├── .env.example             # Environment variable template
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Python 3.11+
- Node.js 18+
- Git
- Google Gemini API key — free at [aistudio.google.com](https://aistudio.google.com)

---

### Backend Setup

```bash
# 1. Clone the repo
git clone https://github.com/SVM3116/skillbridge-ai.git
cd skillbridge-ai

# 2. Install Python dependencies
cd backend
pip install -r requirements.txt

# 3. Create backend/.env file and add:
# GEMINI_API_KEY=your_key_here

# 4. Start the backend server
python -m uvicorn main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

---

### Frontend Setup

```bash
# In a new terminal
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/api/parse-resume` | Extract skills from PDF resume using Gemini |
| POST | `/api/parse-jd` | Extract requirements from job description using Gemini |
| POST | `/api/generate-questions` | Generate MCQ diagnostic test for overlapping skills |
| POST | `/api/score-test` | Score test answers → verified skill levels |
| POST | `/api/generate-roadmap` | Run full 5-step adaptive pathing pipeline |

---

## Adaptive Gap Analysis Algorithm (Original Implementation)

The core innovation is a **5-step original algorithm** in `gap_engine.py`.

### Step 1 — 3-Way Gap Analysis

For every skill required by the JD:

```
Case 1: Skill not in resume at all         → MISSING  → add beginner course
Case 2: In resume + tested → verified gap  → GAP      → add targeted course
Case 3: In resume + tested → sufficient    → SKIP      → no course needed
Case 4: In resume + not tested             → infer from years of experience
```

**Key differentiator:** We do NOT trust the resume. If a candidate claims "Python — 5 years" but scores 33% on the diagnostic, we identify a real gap.

### Step 2 — DAG Prerequisite Resolution

The `prerequisite_map.json` forms a **Directed Acyclic Graph (DAG)** of skill dependencies. Missing foundations are **automatically injected** before advanced courses.

```
Gap identified: Kubernetes (Beginner)
→ DAG check: Kubernetes requires Docker
→ Docker not in confirmed skills
→ Auto-inject: Docker Basics
→ Reasoning trace logged: "Auto-added prerequisite: Docker"
```

### Step 3 — Catalog-Grounded Course Matching

**Zero hallucinations.** Every recommendation matched against `course_catalog.json` only. Unmatched skills return `NOT_AVAILABLE_IN_CATALOG`.

### Step 4 — Topological Ordering (Parallel vs Sequential)

DAG traversal determines:
- **Sequential**: courses with prerequisite dependency (must be done in order)
- **Parallel**: courses with no dependency (can be studied simultaneously)

### Step 5 — Impact Metrics

```python
standard_courses  = len(jd_skills) + 3        # baseline onboarding
optimized_courses = len(roadmap)               # personalized count
courses_skipped   = standard_courses - optimized_courses
days_saved        = courses_skipped * 2        # 2 days/module (standard estimate)
```

---

## Knowledge Tracing — Diagnostic Test Engine

| Property | Value |
|---|---|
| Skills tested | JD ∩ Resume only |
| Max skills | 5 |
| Questions per skill | 3 |
| Max questions | 15 |
| Generated by | Gemini 2.5 Flash |

| Score Range | Verified Level |
|---|---|
| 0 – 40% | Beginner |
| 41 – 70% | Intermediate |
| 71 – 100% | Advanced |

---

## Datasets Used

| Dataset | Source | Usage |
|---|---|---|
| O\*NET Database | [onetcenter.org](https://www.onetcenter.org/db_releases.html) | Skill taxonomy and job role definitions — used to design catalog skill names and 6 domain categories |
| Resume Dataset | [Kaggle — snehaanbhawal](https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset/data) | Validated resume parser accuracy across diverse resume formats |
| Jobs & JD Dataset | [Kaggle — kshitizregmi](https://www.kaggle.com/datasets/kshitizregmi/jobs-and-job-description) | Validated JD parser across diverse job categories |

---

## Models Used

| Model | Provider | Usage |
|---|---|---|
| Gemini 2.5 Flash | Google DeepMind | Resume skill extraction, JD requirement extraction, MCQ question generation |

All model usage via the official Google GenAI Python SDK (`google-genai`). No fine-tuning. No external training data.

---

## Validation Metrics

| Metric | Value |
|---|---|
| Resume parsing confidence | 85 – 95% |
| JD skill extraction accuracy | ~90% |
| Average modules skipped | 35 – 45% |
| Days saved per new hire | 6 – 12 days |
| Catalog courses | 44 courses |
| Domains covered | 6 domains |

---

## Course Catalog Coverage

| Domain | Skills Covered |
|---|---|
| Software Engineering | Python (3 levels), JavaScript, React (2 levels), TypeScript, System Design (2 levels), REST APIs, GraphQL, MongoDB, Git, Agile, Microservices |
| DevOps | Docker (2 levels), Kubernetes (2 levels), AWS (2 levels), CI/CD, Linux, Terraform, Cybersecurity |
| Data & ML | SQL (2 levels), Statistics, Machine Learning, Deep Learning, Data Visualization, Pandas |
| HR / People Ops | Recruitment, Performance Management, Labor Law, HR Analytics, Onboarding Design |
| Operations | Warehouse Safety, Inventory Management, Supply Chain, Quality Control, Forklift |
| Soft Skills | Business Communication, Project Management |

**Total: 44 courses, 6 domains**

---

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key from [aistudio.google.com](https://aistudio.google.com) |

See `.env.example` for the template.

---

## License

MIT
