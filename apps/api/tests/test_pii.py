from app.ai.local import LocalAIService

def test_resume_ai_contract_accepts_career_text_only():
 result=LocalAIService().extract_resume('Python Selenium QA Engineer')
 assert 'skills' in result
 assert 'email' not in result
