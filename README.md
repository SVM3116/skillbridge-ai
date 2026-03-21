# SkillBridge AI — Adaptive Onboarding Engine

> **ARTPARK CodeForge Hackathon 2026**
> AI-driven, adaptive learning engine that parses a new hire's capabilities and dynamically maps a personalized training pathway to reach role-specific competency.

---

## Value Proposition

Traditional corporate onboarding uses a one-size-fits-all curriculum. A 10-year veteran and a fresh graduate receive the **same modules** — wasting 40% of training time.

SkillBridge AI solves this by:
1. Parsing the candidate's **real** skill level (via resume + diagnostic test — not just resume claims)
2. Comparing against the **target job description**
3. Generating a **personalized, sequenced learning roadmap** grounded strictly in a curated course catalog

---

## Live Demo Flow

```
Upload Resume PDF + Paste JD
        ↓
AI extracts skills with confidence scores
        ↓
Diagnostic MCQ test (JD-relevant skills only)
        ↓
3-way gap analysis: resume claim vs test score vs JD requirement
        ↓
Prerequisite auto-injection + course matching (catalog-grounded only)
        ↓
Visual roadmap with reasoning trace + impact metrics
        ↓
Download PDF
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React.js | 18.x |
| Styling | TailwindCSS (CDN) + Custom CSS | 3.x |
| Backend | Python + FastAPI | 3.11 / 0.115.x |
| Server | Uvicorn | 0.42.x |
| AI / NLP | Google Gemini 2.5 Flash | gemini-2.5-flash |
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
│   ├── gap_engine.py        # Original adaptive pathing algorithm
│   ├── test_engine.py       # Diagnostic MCQ generation + scoring
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # API key (never committed)
├── data/
│   ├── course_catalog.json  # 40+ courses across 6 domains
│   └── prerequisite_map.json# Skill dependency graph
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
├── Dockerfile               # Backend container
├── docker-compose.yml       # Full stack
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Python 3.11+
- Node.js 18+
- Git
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

---

### Backend Setup

```bash
# 1. Clone the repo
git clone https://github.com/SVM3116/skillbridge-ai.git
cd skillbridge-ai

# 2. Install Python dependencies
cd backend
pip install -r requirements.txt

# 3. Set your Gemini API key
# Create backend/.env with:
echo "GEMINI_API_KEY=your_key_here" > .env

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

### Docker Setup

```bash
# Build and run everything
docker-compose up --build

# Backend: http://localhost:8000
# Frontend: http://localhost:3000
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| POST | `/api/parse-resume` | Extract skills from PDF resume |
| POST | `/api/parse-jd` | Extract requirements from job description |
| POST | `/api/generate-questions` | Generate MCQ diagnostic test |
| POST | `/api/score-test` | Score test answers → verified skill levels |
| POST | `/api/generate-roadmap` | Run full adaptive pathing pipeline |

---

## The Adaptive Gap Analysis Algorithm (Original Implementation)

The core innovation is a **5-step original algorithm** in `gap_engine.py`. This is NOT AI-generated — it is our original logic.

### Step 1 — 3-Way Gap Analysis

For every skill required by the JD, we perform a three-dimensional comparison:

```
Case 1: Skill not in resume at all         → MISSING  → add beginner course
Case 2: In resume + tested → verified gap  → GAP      → add targeted course
Case 3: In resume + tested → sufficient    → SKIP      → no course needed
Case 4: In resume + not tested             → infer from years of experience
```

The key differentiator: **we do not trust the resume**. If a candidate claims "Python — 5 years" but scores 33% on the Python diagnostic, we identify a real gap and add the appropriate course.

### Step 2 — Prerequisite Auto-Injection

Before adding any course, we check the prerequisite dependency graph (`prerequisite_map.json`). If a prerequisite is missing from the candidate's confirmed skills, it is **automatically inserted before the main course** with a logged explanation.

```
Gap: Kubernetes (Beginner)
→ Check prerequisites: requires Docker
→ Docker not in confirmed skills
→ Auto-inject: Docker Basics (before Kubernetes)
→ Reasoning trace: "Auto-added prerequisite: Docker"
```

### Step 3 — Catalog-Grounded Course Matching

**Zero hallucinations.** Every recommendation is matched against `course_catalog.json` using exact skill name matching. If no course exists for a skill gap, the system returns `NOT_AVAILABLE_IN_CATALOG` rather than inventing a course.

### Step 4 — Parallel vs Sequential Ordering

Courses are classified as sequential (must be done in order due to prerequisite dependency) or parallel (can be studied simultaneously). This is determined by checking whether the prerequisite map creates a dependency between courses.

### Step 5 — Impact Metrics

```python
standard_courses  = len(jd_skills) + 3   # baseline: all JD skills + buffer
optimized_courses = len(roadmap)          # actual personalized count
courses_skipped   = standard_courses - optimized_courses
days_saved        = courses_skipped * 2   # 2 days per skipped course
                                          # based on standard corporate onboarding
                                          # estimates (1-2 days per module average)
```

---

## Diagnostic Test Engine

The diagnostic is the unique differentiator of SkillBridge AI:

1. **Filter**: Only skills present in BOTH the resume AND the JD are tested (max 5 skills, 3 questions each = 15 questions max)
2. **Generate**: Gemini generates MCQ questions calibrated to the skill (mix of easy/medium/hard)
3. **Score**: Each skill is scored independently

| Score Range | Verified Level |
|---|---|
| 0 – 40% | Beginner |
| 41 – 70% | Intermediate |
| 71 – 100% | Advanced |

---

## Datasets Used

| Dataset | Source | Usage |
|---|---|---|
| O\*NET Database | [onetcenter.org](https://www.onetcenter.org/db_releases.html) | Skill taxonomy and job role definitions used to design course catalog skill names and domain categories |
| Resume Dataset | [Kaggle — snehaanbhawal](https://www.kaggle.com/datasets/snehaanbhawal/resume-dataset/data) | Used for testing resume parser accuracy across diverse resume formats |
| Jobs & JD Dataset | [Kaggle — kshitizregmi](https://www.kaggle.com/datasets/kshitizregmi/jobs-and-job-description) | Used for testing JD parser across diverse job categories |

---

## Models Used

| Model | Provider | Usage |
|---|---|---|
| Gemini 2.5 Flash | Google DeepMind | Resume skill extraction, JD requirement extraction, MCQ question generation |

All model usage is via the official Google GenAI Python SDK (`google-genai`).

---

## Course Catalog Coverage

| Domain | Courses |
|---|---|
| Software Engineering | Python (3 levels), JavaScript, React (2 levels), System Design (2 levels), REST APIs, Git, Agile |
| DevOps | Docker (2 levels), Kubernetes (2 levels), AWS, CI/CD, Linux |
| Data & ML | SQL (2 levels), Statistics, Machine Learning, Data Visualization |
| HR / People Ops | Recruitment, Performance Management, Labor Law |
| Operations | Warehouse Safety, Inventory Management, Supply Chain |
| Soft Skills | Business Communication |

**Total: 30 courses, 23 skills, 6 domains**

---

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key from [aistudio.google.com](https://aistudio.google.com) |

See `.env.example` for the template.

---

## Team - One Rupee

Built for ARTPARK CodeForge Hackathon 2026.

---


