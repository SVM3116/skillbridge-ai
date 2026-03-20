import json
import os

# Load course catalog and prerequisite map
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_catalog():
    return json.load(open(os.path.join(BASE_DIR, "data", "course_catalog.json"), encoding="utf-8"))

def load_prereq_map():
    return json.load(open(os.path.join(BASE_DIR, "data", "prerequisite_map.json"), encoding="utf-8"))

CATALOG    = load_catalog()
PREREQ_MAP = load_prereq_map()

# ─────────────────────────────────────────
# STEP 1: GAP ANALYSIS — 3-way comparison
# ─────────────────────────────────────────
def analyze_gaps(resume_skills, test_scores, jd_skills):
    """
    Compare resume claim vs test score vs JD requirement.
    Returns gaps list and reasoning trace.
    """
    gaps           = []
    reasoning      = []

    resume_map = {s["name"].lower(): s for s in resume_skills}
    test_map   = {s["skill"].lower(): s for s in test_scores}
    levels     = ["Beginner", "Intermediate", "Advanced"]

    for jd_skill in jd_skills:
        name         = jd_skill["name"]
        name_lower   = name.lower()
        needed_level = jd_skill.get("level", "Intermediate")
        in_resume    = name_lower in resume_map
        test_data    = test_map.get(name_lower)

        # CASE 1: Not in resume at all → full gap
        if not in_resume:
            gaps.append({
                "skill":        name,
                "type":         "MISSING",
                "needed_level": needed_level,
                "auto_added":   False
            })
            reasoning.append(
                f"{name}: Not found in resume. "
                f"JD requires {needed_level}. Full gap identified."
            )

        # CASE 2: In resume, tested → compare levels
        elif test_data:
            verified_level = test_data["level"]
            test_score     = test_data["score"]
            verified_idx   = levels.index(verified_level) if verified_level in levels else 0
            needed_idx     = levels.index(needed_level)   if needed_level   in levels else 1

            if verified_idx >= needed_idx:
                # Strong — no gap
                reasoning.append(
                    f"{name}: Resume claimed skill. "
                    f"Test score {test_score}% ({verified_level}). "
                    f"JD needs {needed_level}. Sufficient — SKIP."
                )
            else:
                # Gap — needs improvement
                gaps.append({
                    "skill":           name,
                    "type":            "GAP",
                    "current_level":   verified_level,
                    "needed_level":    needed_level,
                    "test_score":      test_score,
                    "auto_added":      False
                })
                reasoning.append(
                    f"{name}: Resume claimed skill. "
                    f"Test proved {test_score}% ({verified_level}). "
                    f"JD needs {needed_level}. Real gap found!"
                )

        # CASE 3: In resume, not tested → check experience
        else:
            resume_years = resume_map[name_lower].get("years", 0)
            needed_idx   = levels.index(needed_level) if needed_level in levels else 1

            if resume_years >= 3 and needed_idx <= 1:
                reasoning.append(
                    f"{name}: Resume shows {resume_years} years. "
                    f"JD needs {needed_level}. Accepting without test."
                )
            else:
                gaps.append({
                    "skill":        name,
                    "type":         "GAP",
                    "needed_level": needed_level,
                    "auto_added":   False
                })
                reasoning.append(
                    f"{name}: Resume shows {resume_years} years. "
                    f"JD needs {needed_level}. Gap identified."
                )

    return {"gaps": gaps, "reasoning": reasoning}


# ─────────────────────────────────────────
# STEP 2: PREREQUISITE CHECKER
# ─────────────────────────────────────────
def add_prerequisites(gaps, resume_skills):
    """
    For each gap, check if prerequisites are missing.
    Auto-insert missing prerequisites before the main course.
    """
    resume_lower  = {s["name"].lower() for s in resume_skills}
    final_gaps    = []
    added_prereqs = []
    existing      = [g["skill"] for g in gaps]

    for gap in gaps:
        skill   = gap["skill"]
        prereqs = PREREQ_MAP.get(skill, [])

        for prereq in prereqs:
            if prereq.lower() not in resume_lower and prereq not in existing:
                final_gaps.append({
                    "skill":        prereq,
                    "type":         "PREREQUISITE",
                    "needed_level": "Beginner",
                    "auto_added":   True,
                    "reason":       f"Auto-added: required before {skill}"
                })
                added_prereqs.append(prereq)
                existing.append(prereq)

        final_gaps.append(gap)

    return final_gaps, added_prereqs


# ─────────────────────────────────────────
# STEP 3: COURSE MATCHER
# ─────────────────────────────────────────
def match_courses(gaps):
    """
    Match each gap to a course from the catalog ONLY.
    Never recommend a course outside the catalog.
    """
    roadmap  = []
    skipped  = []

    for gap in gaps:
        skill        = gap["skill"].lower()
        needed_level = gap.get("needed_level", "Beginner")
        best         = None

        # Try exact skill + level match first
        for course in CATALOG:
            if course["skill"].lower() == skill and course["level"] == needed_level:
                best = course
                break

        # Fallback: any level match for that skill
        if not best:
            for course in CATALOG:
                if course["skill"].lower() == skill:
                    best = course
                    break

        if best:
            roadmap.append({
                **best,
                "gap_type":   gap["type"],
                "auto_added": gap.get("auto_added", False),
                "parallel":   False
            })
        else:
            skipped.append({
                "skill":  gap["skill"],
                "status": "NOT_AVAILABLE_IN_CATALOG"
            })

    return roadmap, skipped


# ─────────────────────────────────────────
# STEP 4: PARALLEL vs SEQUENTIAL
# ─────────────────────────────────────────
def assign_parallel_sequential(roadmap):
    """
    If a course has a prerequisite that appears
    earlier in the roadmap → SEQUENTIAL.
    Otherwise → can run in PARALLEL with others.
    """
    for i, course in enumerate(roadmap):
        prereqs      = PREREQ_MAP.get(course["skill"], [])
        prev_skills  = [c["skill"] for c in roadmap[:i]]
        has_dep      = any(p in prev_skills for p in prereqs)
        course["parallel"] = not has_dep and i > 0

    return roadmap


# ─────────────────────────────────────────
# STEP 5: IMPACT METRICS
# ─────────────────────────────────────────
def calculate_metrics(roadmap, jd_skills):
    """
    Calculate time saved vs standard onboarding.
    """
    standard_courses = len(jd_skills) + 3
    optimized        = len(roadmap)
    saved            = max(0, standard_courses - optimized)
    total_hours      = sum(c["duration_hours"] for c in roadmap)

    return {
        "standard_courses":  standard_courses,
        "optimized_courses": optimized,
        "courses_skipped":   saved,
        "total_hours":       total_hours,
        "days_saved":        saved * 2
    }


# ─────────────────────────────────────────
# MASTER FUNCTION
# ─────────────────────────────────────────
def generate_full_roadmap(resume_skills, test_scores, jd_skills):
    """
    Master function — runs all 5 steps in order.
    Returns complete roadmap with reasoning trace.
    """
    # Step 1: Gap analysis
    gap_result = analyze_gaps(resume_skills, test_scores, jd_skills)
    gaps       = gap_result["gaps"]
    reasoning  = gap_result["reasoning"]

    # Step 2: Add prerequisites
    gaps_with_prereqs, added = add_prerequisites(gaps, resume_skills)
    for prereq in added:
        reasoning.append(f"Auto-added prerequisite: {prereq}")

    # Step 3: Match courses from catalog
    roadmap, skipped = match_courses(gaps_with_prereqs)

    # Step 4: Assign parallel vs sequential
    roadmap = assign_parallel_sequential(roadmap)

    # Step 5: Calculate metrics
    metrics = calculate_metrics(roadmap, jd_skills)

    return {
        "roadmap":         roadmap,
        "gaps":            gaps,
        "reasoning_trace": reasoning,
        "skipped":         skipped,
        "metrics":         metrics
    }