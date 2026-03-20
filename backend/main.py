from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from google import genai
import pdfplumber
import json
import os
import tempfile
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

API_KEY = os.getenv("GEMINI_API_KEY")
client  = genai.Client(api_key=API_KEY)
MODEL   = "gemini-2.5-flash"


def ask_gemini(prompt):
    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt
        )
        text = response.text.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        return json.loads(text)
    except Exception as e:
        print("GEMINI ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def home():
    return {"message": "SkillBridge AI Backend Running!"}


@app.post("/api/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        contents = await file.read()
        tmp.write(contents)
        tmp_path = tmp.name

    text = ""
    with pdfplumber.open(tmp_path) as pdf:
        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + " "

    os.unlink(tmp_path)

    prompt = f"""
    Extract skills from this resume text.
    Return ONLY valid JSON, no explanation, no markdown.
    Format exactly like this:
    {{
        "skills": [
            {{"name": "Python", "years": 3, "confidence": 0.95}},
            {{"name": "React", "years": 1, "confidence": 0.80}}
        ],
        "overall_confidence": 0.88,
        "education": "B.Tech Computer Science",
        "total_experience_years": 4
    }}
    Resume text: {text[:3000]}
    """

    result = ask_gemini(prompt)
    return result


@app.post("/api/parse-jd")
async def parse_jd(data: dict):
    jd_text = data.get("jd_text", "")

    prompt = f"""
    Extract job requirements from this Job Description.
    Return ONLY valid JSON, no explanation, no markdown.
    Format exactly like this:
    {{
        "required_skills": [
            {{"name": "Python", "level": "Advanced", "mandatory": true}},
            {{"name": "Docker", "level": "Intermediate", "mandatory": false}}
        ],
        "role_title": "Senior Backend Engineer",
        "role_category": "Software Engineering",
        "experience_years_required": 3
    }}
    JD text: {jd_text[:3000]}
    """

    result = ask_gemini(prompt)
    return result