from google import genai
from dotenv import load_dotenv
from fastapi import HTTPException
import os
import json

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL  = "gemini-2.5-flash"


def filter_testable_skills(resume_skills, jd_skills, max_skills=5):
    """
    Find skills present in BOTH resume AND JD.
    Only test these skills — max 5 to keep test short.
    """
    resume_names = {s["name"].lower() for s in resume_skills}
    testable = []

    for jd_skill in jd_skills:
        if jd_skill["name"].lower() in resume_names:
            testable.append(jd_skill["name"])

    return testable[:max_skills]


def generate_questions_for_skill(skill_name):
    """
    Generate 3 MCQ questions for a given skill.
    Returns structured JSON with questions and answers.
    """
    prompt = f"""
    Generate exactly 3 multiple choice questions to test {skill_name} knowledge.
    Mix difficulty: 1 easy, 1 medium, 1 hard question.
    Return ONLY valid JSON, no explanation, no markdown.
    Format exactly like this:
    {{
        "skill": "{skill_name}",
        "questions": [
            {{
                "id": "q1",
                "question": "What is the correct way to create a list in Python?",
                "options": [
                    "A. list = (1, 2, 3)",
                    "B. list = [1, 2, 3]",
                    "C. list = {{1, 2, 3}}",
                    "D. list = <1, 2, 3>"
                ],
                "correct_answer": "B"
            }},
            {{
                "id": "q2",
                "question": "Second question here?",
                "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
                "correct_answer": "A"
            }},
            {{
                "id": "q3",
                "question": "Third question here?",
                "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
                "correct_answer": "C"
            }}
        ]
    }}
    """

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt
        )
        text = response.text.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        return json.loads(text)
    except Exception as e:
        print(f"Error generating questions for {skill_name}:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


def score_test(answers):
    """
    Score the test answers.
    
    Input: [
        {"skill": "Python", "question_id": "q1", 
         "selected": "B", "correct": "B"},
        ...
    ]
    
    Output: [
        {"skill": "Python", "score": 67, 
         "level": "Intermediate", "correct": 2, "total": 3}
    ]
    """
    skill_results = {}

    for answer in answers:
        skill = answer["skill"]
        if skill not in skill_results:
            skill_results[skill] = {"correct": 0, "total": 0}

        skill_results[skill]["total"] += 1
        if answer["selected"] == answer["correct"]:
            skill_results[skill]["correct"] += 1

    scores = []
    for skill, result in skill_results.items():
        percentage = (result["correct"] / result["total"]) * 100

        if percentage <= 40:
            level = "Beginner"
        elif percentage <= 70:
            level = "Intermediate"
        else:
            level = "Advanced"

        scores.append({
            "skill":   skill,
            "score":   round(percentage),
            "level":   level,
            "correct": result["correct"],
            "total":   result["total"]
        })

    return scores