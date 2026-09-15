from __future__ import annotations
import json
import re
from openai import OpenAI
from app.ai.base import AIService
from app.core.config import settings

class OpenAIService(AIService):
    """Production AI adapter. All OpenAI access stays behind AIService."""
    def __init__(self):
        if not settings.openai_api_key:
            raise RuntimeError("OPENAI_API_KEY is not configured")
        self.client=OpenAI(base_url=settings.openai_base_url, api_key=settings.openai_api_key, timeout=settings.openai_timeout_seconds, max_retries=2)

    def _json(self, system: str, user: str) -> dict:
        r=self.client.chat.completions.create(
            model=settings.openai_model,
            messages=[{"role":"system","content":system},{"role":"user","content":user}],
            temperature=0.0,
            extra_body={"chat_template_kwargs":{"enable_thinking":False},"reasoning_budget":16384}
        )
        content = r.choices[0].message.content or "{}"
        
        # Clean up markdown JSON block if present
        content = content.strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
            
        try:
            return json.loads(content.strip())
        except json.JSONDecodeError:
            # Fallback regex search for a JSON object
            match = re.search(r'\{.*\}', content.strip(), re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(0))
                except json.JSONDecodeError:
                    return {}
            return {}

    def extract_resume(self, career_text: str)->dict:
        system = '''Extract only factual career/professional information explicitly supported by the supplied resume text. Never infer missing facts, dates, seniority, years, skills, or employers. Do not return or reproduce email, phone, street/home address, account information, or other direct identifiers. Use null when a scalar is unavailable and [] when a list is unavailable. Return ONLY JSON with this shape: {"professional_summary": string|null, "current_role": string|null, "current_company": string|null, "years_experience": number|null, "employment_history": [{"job_title": string|null, "company": string|null, "start_date": string|null, "end_date": string|null, "responsibilities": string[], "achievements": string[]}], "skills": string[], "technologies": string[], "education": [{"degree": string|null, "institution": string|null, "field_of_study": string|null, "graduation_year": number|null}], "certifications": [{"certification": string|null, "issuer": string|null, "date": string|null}]}. The summary must be concise and factual, based only on the resume.'''
        return self._json(system, career_text)
    def extract_job(self, job_text: str)->dict:
        return self._json("Extract structured job requirements from the supplied job text. Return JSON.", job_text)
    def generate_embedding(self, text: str)->list[float]:
        # Keep OpenAI embeddings if the base URL isn't set for it, or assume the provider has embeddings
        r=self.client.embeddings.create(model=settings.openai_embedding_model,input=text)
        return r.data[0].embedding
    def assess_candidate_job_match(self,candidate:dict,job:dict)->dict:
        return self._json("Assess candidate/job fit using only supplied career/job data. Return JSON with semantic_similarity and concise rationale.", json.dumps({"candidate":candidate,"job":job}))
    def explain_match(self,match:dict)->str:
        return self._json("Explain the match for a job seeker. Avoid guarantees and unsupported claims. Return JSON with explanation and gaps.",json.dumps(match)).get("explanation","")
    def classify_feedback(self,text:str)->dict:
        return self._json("Classify recommendation feedback. Return JSON with label and reason.",text)
