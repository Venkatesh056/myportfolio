"""
Smart local formatter: converts retrieved RAG chunks into clean, readable answers
without requiring an LLM. Used as primary output when HF generation fails or is
not configured.
"""
from typing import List, Tuple
from .rag_extractor import Doc


def _fmt_achievements(hits: List[Tuple[Doc, float]]) -> str:
    items = [d for d, _ in hits if d.meta.get("type") == "achievement"]
    if not items:
        items = [d for d, _ in hits]
    lines = ["Here are my achievements:\n"]
    for d in items:
        for line in d.text.splitlines():
            if line.startswith("Achievement:"):
                lines.append(f"🏆 **{line.replace('Achievement:', '').strip()}**")
            elif line.startswith("Badge:"):
                lines.append(f"   Badge: {line.replace('Badge:', '').strip()}")
            elif line.startswith("Description:"):
                lines.append(f"   {line.replace('Description:', '').strip()}")
    return "\n".join(lines)


def _fmt_contact(hits: List[Tuple[Doc, float]]) -> str:
    for d, _ in hits:
        if d.meta.get("type") == "contact":
            parts = {"Email": None, "Phone": None, "Location": None}
            for line in d.text.splitlines():
                for key in parts:
                    if line.startswith(f"{key}:"):
                        parts[key] = line.split(":", 1)[1].strip()
            lines = ["You can reach me at:\n"]
            if parts["Email"]:
                lines.append(f"📧 Email: {parts['Email']}")
            if parts["Phone"]:
                lines.append(f"📞 Phone: {parts['Phone']}")
            if parts["Location"]:
                lines.append(f"📍 Location: {parts['Location']}")
            return "\n".join(lines)
    return "Contact info not found."


def _fmt_projects(hits: List[Tuple[Doc, float]]) -> str:
    items = [d for d, _ in hits if d.meta.get("type") == "project"]
    if not items:
        items = [d for d, _ in hits]
    lines = []
    for d in items:
        data: dict = {}
        for line in d.text.splitlines():
            if ":" in line:
                k, _, v = line.partition(":")
                data[k.strip()] = v.strip()
        title = data.get("Project", d.id)
        subtitle = data.get("Subtitle", "")
        desc = data.get("Description", "")
        tech = data.get("Tech", "")
        impact = data.get("Impact", "")
        github = data.get("GitHub", "")
        lines.append(f"🚀 **{title}**")
        if subtitle:
            lines.append(f"   {subtitle}")
        if desc:
            lines.append(f"   {desc}")
        if tech:
            lines.append(f"   Tech: {tech}")
        if impact:
            lines.append(f"   Impact: {impact}")
        if github:
            lines.append(f"   GitHub: {github}")
        lines.append("")
    return "\n".join(lines).strip()


def _fmt_skills(hits: List[Tuple[Doc, float]]) -> str:
    for d, _ in hits:
        if d.meta.get("type") == "skills":
            skills = d.text.replace("Skills:", "").strip()
            return f"My key skills include:\n\n{skills}"
    return "\n".join(d.text for d, _ in hits[:2])


def _fmt_about(hits: List[Tuple[Doc, float]]) -> str:
    for d, _ in hits:
        if d.meta.get("type") == "about":
            return d.text.replace("About:", "").strip()
    return "\n".join(d.text for d, _ in hits[:2])


def _fmt_activities(hits: List[Tuple[Doc, float]]) -> str:
    items = [d for d, _ in hits if d.meta.get("type") == "activity"]
    if not items:
        items = [d for d, _ in hits]
    lines = ["My co-curricular activities:\n"]
    for d in items:
        data: dict = {}
        for line in d.text.splitlines():
            if ":" in line:
                k, _, v = line.partition(":")
                data[k.strip()] = v.strip()
        title = data.get("Activity", "")
        org = data.get("Organization", "")
        dur = data.get("Duration", "")
        desc = data.get("Description", "")
        if title:
            lines.append(f"• **{title}**")
        if org:
            lines.append(f"  {org}" + (f" | {dur}" if dur else ""))
        if desc:
            lines.append(f"  {desc}")
        lines.append("")
    return "\n".join(lines).strip()


_INTENT_MAP = {
    "achievement": _fmt_achievements,
    "contact": _fmt_contact,
    "project": _fmt_projects,
    "skills": _fmt_skills,
    "about": _fmt_about,
    "service": _fmt_projects,
    "activity": _fmt_activities,
    "snapshot": _fmt_about,
}


def format_answer(question: str, hits: List[Tuple[Doc, float]]) -> str:
    """Format a clean, readable answer from retrieved chunks without an LLM."""
    # Detect dominant type from top hits
    type_counts: dict = {}
    for d, score in hits:
        t = d.meta.get("type", "")
        type_counts[t] = type_counts.get(t, 0) + score

    dominant_type = max(type_counts, key=type_counts.get) if type_counts else ""

    # Override with question intent keywords
    q = question.lower()
    if any(k in q for k in ["achiev", "award", "hack", "winner", "medal", "scout", "compete"]):
        dominant_type = "achievement"
    elif any(k in q for k in ["contact", "email", "phone", "reach", "touch", "whatsapp", "call"]):
        dominant_type = "contact"
    elif any(k in q for k in ["project", "built", "developed", "work", "system", "app", "netratax", "biometrix", "foodbridge", "medi", "mytho"]):
        dominant_type = "project"
    elif any(k in q for k in ["skill", "technology", "tech", "language", "framework", "tool", "know"]):
        dominant_type = "skills"
    elif any(k in q for k in ["about", "who are you", "yourself", "background", "introduce", "bio"]):
        dominant_type = "about"
    elif any(k in q for k in ["activity", "club", "volunteer", "rotaract", "strats", "committee"]):
        dominant_type = "activity"

    formatter = _INTENT_MAP.get(dominant_type)
    if formatter:
        result = formatter(hits)
        if result and len(result.strip()) > 20:
            return result

    # Generic fallback: clean up the raw chunk text
    parts = []
    seen = set()
    for d, _ in hits[:3]:
        cleaned = _clean_chunk(d.text)
        if cleaned not in seen:
            seen.add(cleaned)
            parts.append(cleaned)
    return "\n\n".join(parts)


def _clean_chunk(text: str) -> str:
    """Make a raw chunk text slightly more readable."""
    lines = []
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        # Bold the key
        if ":" in line:
            key, _, val = line.partition(":")
            lines.append(f"**{key.strip()}**: {val.strip()}")
        else:
            lines.append(line)
    return "\n".join(lines)
