import hashlib, re
from app.ai.base import AIService

class LocalAIService(AIService):
    """Deterministic dev/test implementation with the same resume output contract as production."""
    def extract_resume(self, career_text):
        skills=re.findall(r"\b(Python|Java|Selenium|Playwright|SQL|AWS|Azure|Jenkins|Cypress|REST|API|Docker|Kubernetes)\b",career_text,re.I)
        years=None
        match=re.search(r"\b(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)\b",career_text,re.I)
        if match:
            years=float(match.group(1))
        current_role=None
        role_match=re.search(r"(?:current role|current position|role)\s*[:\-]\s*([^\n]+)",career_text,re.I)
        if role_match:
            current_role=role_match.group(1).strip()[:200]
        return {
            "professional_summary": None,
            "current_role": current_role,
            "current_company": None,
            "years_experience": years,
            "employment_history": [],
            "skills": sorted(set(s.lower() for s in skills)),
            "technologies": sorted(set(s.lower() for s in skills)),
            "education": [],
            "certifications": [],
        }
    def extract_job(self,job_text): return {"raw":"deterministic-dev","skills":re.findall(r"\b(Python|Java|Selenium|Playwright|SQL|AWS|Azure|Jenkins|Cypress|REST|API|Docker|Kubernetes)\b",job_text,re.I)}
    def generate_embedding(self,text):
        digest=hashlib.sha256(text.encode()).digest(); return [b/255 for b in digest[:16]]
    def assess_candidate_job_match(self,candidate,job): return {"semantic_similarity":0.0,"note":"semantic provider not configured"}
    def explain_match(self,match): return match.get("explanation","")
    def classify_feedback(self,text): return {"label":"unspecified","text":text}
