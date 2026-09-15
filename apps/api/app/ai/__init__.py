from app.ai.local import LocalAIService
from app.core.config import settings

def get_ai_service():
    if settings.openai_api_key:
        from app.ai.openai_service import OpenAIService
        return OpenAIService()
    return LocalAIService()
