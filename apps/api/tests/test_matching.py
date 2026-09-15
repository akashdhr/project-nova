from types import SimpleNamespace
from app.matching.engine import match_candidate_to_job

def test_hard_location_filter():
 c=SimpleNamespace(skills=['Python'],years_experience=5,target_roles=['SDET Lead'])
 p=SimpleNamespace(locations=['Bengaluru'],work_modes=['hybrid'],deal_breakers=[],target_roles=['SDET Lead'])
 j=SimpleNamespace(skills=['Python'],locations=['Mumbai'],work_mode='hybrid',experience_min=3,experience_max=8,title='SDET Lead',description='x')
 r=match_candidate_to_job(c,p,j); assert r.match_status=='filtered'; assert r.hard_filter_results['location'] is False

def test_skill_and_role_fit():
 c=SimpleNamespace(skills=['Python','Selenium'],years_experience=5,target_roles=['SDET Lead'])
 p=SimpleNamespace(locations=['Bengaluru'],work_modes=['hybrid'],deal_breakers=[],target_roles=['SDET Lead'])
 j=SimpleNamespace(skills=['Python','Selenium'],locations=['Bengaluru'],work_mode='hybrid',experience_min=3,experience_max=8,title='SDET Lead',description='automation')
 r=match_candidate_to_job(c,p,j); assert r.match_status=='strong'; assert r.matched_skills==['Python','Selenium']
