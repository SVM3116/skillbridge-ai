from fpdf import FPDF

pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", size=12)

resume_text = [
    "JOHN DOE",
    "Email: john.doe@email.com | Phone: +91 9876543210",
    "LinkedIn: linkedin.com/in/johndoe",
    "",
    "SUMMARY",
    "Software Engineer with 3 years of experience in backend development.",
    "Proficient in Python, React, and SQL. Experience with Docker and Git.",
    "",
    "SKILLS",
    "Programming: Python (3 years), JavaScript (2 years), SQL (2 years)",
    "Frameworks: React, FastAPI, Flask",
    "Tools: Docker, Git, Linux",
    "",
    "EXPERIENCE",
    "Backend Engineer - TechCorp (2021 - 2024)",
    "- Built REST APIs using Python and FastAPI",
    "- Worked with Docker containers for deployment",
    "- Managed SQL databases and wrote complex queries",
    "",
    "Junior Developer - StartupXYZ (2020 - 2021)",
    "- Developed frontend components using React",
    "- Collaborated using Git version control",
    "",
    "EDUCATION",
    "B.Tech Computer Science - Anna University (2020)",
    "CGPA: 8.2/10",
]

for line in resume_text:
    pdf.cell(200, 8, txt=line, ln=True)

pdf.output("test_resume.pdf")
print("test_resume.pdf created successfully!")