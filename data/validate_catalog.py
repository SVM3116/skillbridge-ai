import json

catalog = json.load(open('course_catalog.json', encoding='utf-8'))
prereqs = json.load(open('prerequisite_map.json', encoding='utf-8'))

titles = {c['title'] for c in catalog}
skills = {c['skill'] for c in catalog}

print(f"Total courses: {len(catalog)}")
print(f"Total skills covered: {len(skills)}")
print(f"Domains: {set(c['domain'] for c in catalog)}")
print("")

errors = []
for skill, reqs in prereqs.items():
    for r in reqs:
        if r not in titles:
            errors.append(f"Prereq not found in catalog: {r}")

if errors:
    print("ERRORS FOUND:")
    for e in errors:
        print(" ->", e)
else:
    print("Catalog valid! Zero errors.")