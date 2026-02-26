import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional


@dataclass
class Doc:
    id: str
    text: str
    meta: Dict[str, Any]


def _collapse_ws(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def _strip_jsx_tags(s: str) -> str:
    s = re.sub(r"<[^>]*>", " ", s)
    s = s.replace("&nbsp;", " ").replace("&amp;", "&")
    return _collapse_ws(s)


def _slice_const_array(source: str, const_name: str) -> Optional[str]:
    start = source.find(f"const {const_name} = [")
    if start == -1:
        return None
    tail = source[start:]
    end = tail.find("\n];")
    if end == -1:
        return None
    return tail[: end + len("\n];")]


def _extract_about(source: str) -> Optional[str]:
    m = re.search(r'<p\s+className="about-text-full[^\"]*">([\s\S]*?)</p>', source)
    if not m:
        return None
    return _strip_jsx_tags(m.group(1))


def _extract_contact(source: str) -> Dict[str, Optional[str]]:
    email = re.search(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", source)
    phone = re.search(r"\+91\s*\d{10}", source)
    location = re.search(r"Coimbatore,\s*Tamil Nadu,\s*India", source)
    return {
        "email": email.group(0) if email else None,
        "phone": _collapse_ws(phone.group(0)) if phone else None,
        "location": location.group(0) if location else None,
    }


def _extract_quoted_strings(block: str) -> List[str]:
    # Handles "..." strings inside JSX/JS
    out: List[str] = []
    for m in re.finditer(r'"([^"\\]*(?:\\.[^"\\]*)*)"', block):
        out.append(m.group(1).replace('\\"', '"'))
    return out


def _extract_projects(source: str) -> List[Doc]:
    block = _slice_const_array(source, "projects")
    if not block:
        return []

    docs: List[Doc] = []
    chunks = re.split(r"\n\s*\},\s*\n\s*\{", block)
    for ch in chunks:
        title = re.search(r'title:\s*"([^"]+)"', ch)
        subtitle = re.search(r'subtitle:\s*"([^"]+)"', ch)

        desc = re.search(r'description:\s*(?:"([\s\S]*?)"|\n\s*"([\s\S]*?)")\s*,', ch)
        desc_text = None
        if desc:
            desc_text = desc.group(1) or desc.group(2)

        tech_m = re.search(r"tech:\s*\[([\s\S]*?)\]", ch)
        tech = _extract_quoted_strings(tech_m.group(1)) if tech_m else []

        highlights_m = re.search(r"highlights:\s*\[([\s\S]*?)\]", ch)
        highlights = _extract_quoted_strings(highlights_m.group(1)) if highlights_m else []

        impact = re.search(r'impact:\s*(?:"([\s\S]*?)"|\n\s*"([\s\S]*?)")\s*,?', ch)
        impact_text = None
        if impact:
            impact_text = impact.group(1) or impact.group(2)

        github = re.search(r'github:\s*"([^"]+)"', ch)

        if not (title or desc_text):
            continue

        parts: List[str] = []
        if title:
            parts.append(f"Project: {title.group(1)}")
        if subtitle:
            parts.append(f"Subtitle: {subtitle.group(1)}")
        if desc_text:
            parts.append(f"Description: {_collapse_ws(desc_text)}")
        if tech:
            parts.append(f"Tech: {', '.join(tech)}")
        if highlights:
            parts.append(f"Highlights: {'; '.join(highlights)}")
        if impact_text:
            parts.append(f"Impact: {_collapse_ws(impact_text)}")
        if github:
            parts.append(f"GitHub: {github.group(1)}")

        doc_id = f"project:{title.group(1) if title else 'unknown'}"
        docs.append(Doc(id=doc_id, text="\n".join(parts), meta={"type": "project", "title": title.group(1) if title else None}))

    return docs


def _extract_object_array(source: str, const_name: str, label: str) -> List[Doc]:
    block = _slice_const_array(source, const_name)
    if not block:
        return []

    docs: List[Doc] = []
    chunks = re.split(r"\n\s*\},\s*\n\s*\{", block)
    for ch in chunks:
        title = re.search(r'title:\s*"([^"]+)"', ch)
        subtitle = re.search(r'subtitle:\s*"([^"]+)"', ch)
        description = re.search(r'description:\s*(?:"([\s\S]*?)"|\n\s*"([\s\S]*?)")\s*,?', ch)
        duration = re.search(r'duration:\s*"([^"]+)"', ch)
        organization = re.search(r'organization:\s*"([^"]+)"', ch)
        badge = re.search(r'badge:\s*"([^"]+)"', ch)

        desc_text = None
        if description:
            desc_text = description.group(1) or description.group(2)

        if not (title or desc_text):
            continue

        parts: List[str] = []
        if title:
            parts.append(f"{label}: {title.group(1)}")
        if subtitle:
            parts.append(f"Subtitle: {subtitle.group(1)}")
        if organization:
            parts.append(f"Organization: {organization.group(1)}")
        if duration:
            parts.append(f"Duration: {duration.group(1)}")
        if badge:
            parts.append(f"Badge: {badge.group(1)}")
        if desc_text:
            parts.append(f"Description: {_collapse_ws(desc_text)}")

        doc_id = f"{label.lower()}:{title.group(1) if title else 'unknown'}"
        docs.append(Doc(id=doc_id, text="\n".join(parts), meta={"type": label.lower(), "title": title.group(1) if title else None}))

    return docs


def _extract_skills(source: str) -> List[Doc]:
    block = _slice_const_array(source, "skillCategories")
    if not block:
        return []

    skills = re.findall(r'\{\s*name:\s*"([^"]+)"', block)
    skills = [s for s in skills if s]
    if not skills:
        return []

    return [Doc(id="skills:all", text=f"Skills: {', '.join(skills)}", meta={"type": "skills"})]


def load_portfolio_docs(portfolio_jsx_path: Path) -> List[Doc]:
    source = portfolio_jsx_path.read_text(encoding="utf-8")

    docs: List[Doc] = []

    about = _extract_about(source)
    if about:
        docs.append(Doc(id="about:paragraph", text=f"About: {about}", meta={"type": "about"}))

    contact = _extract_contact(source)
    c_parts: List[str] = []
    if contact.get("email"):
        c_parts.append(f"Email: {contact['email']}")
    if contact.get("phone"):
        c_parts.append(f"Phone: {contact['phone']}")
    if contact.get("location"):
        c_parts.append(f"Location: {contact['location']}")
    if c_parts:
        docs.append(Doc(id="contact:info", text="\n".join(c_parts), meta={"type": "contact"}))

    docs.extend(_extract_projects(source))
    docs.extend(_extract_object_array(source, "services", "Service"))
    docs.extend(_extract_object_array(source, "achievements", "Achievement"))
    docs.extend(_extract_object_array(source, "coCurricularActivities", "Activity"))
    docs.extend(_extract_skills(source))

    return docs
