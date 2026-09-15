from datetime import datetime, timezone
from app.db.session import SessionLocal
from app.models.entities import User, CandidateProfile, CareerPreferences
from app.services.ingestion import ingest_records
from app.connectors.mock import MockJobSourceConnector
from app.main import RawJobRecord

def main():
 db=SessionLocal();
 try:
  u=User(email='demo@example.com',name='Demo Candidate'); db.add(u); db.flush()
  db.add(CandidateProfile(user_id=u.id,current_role='QA Engineer',years_experience=5,skills=['Python','Selenium','API','Jenkins'],technologies=['Python','Selenium'],target_roles=['SDET Lead','QA Lead'],career_direction='Move toward QA leadership and SDET lead responsibilities'))
  db.add(CareerPreferences(user_id=u.id,target_roles=['SDET Lead','QA Lead'],locations=['Bengaluru'],work_modes=['hybrid','remote'],min_compensation=1800000,compensation_currency='INR',job_priorities=['career_growth','skill_fit']))
  db.commit(); now=datetime.now(timezone.utc)
  records=[RawJobRecord('mock','qa-1','QA Automation Engineer II','Acme Technologies','Build automation using Selenium, Python, API testing and Jenkins.',location=['Bengaluru'],work_mode='hybrid',skills=['Python','Selenium','API','Jenkins'],experience_min=3,experience_max=6,source_url='https://example.com/jobs/qa-1',application_url='https://example.com/apply/qa-1',posted_at=now),RawJobRecord('mock','sdet-1','SDET Lead','Fintech Labs','Lead quality engineering and automation strategy using Java, Playwright and CI/CD.',location=['Bengaluru','Remote'],work_mode='remote',skills=['Java','Playwright','CI/CD'],experience_min=5,experience_max=9,source_url='https://example.com/jobs/sdet-1',application_url='https://example.com/apply/sdet-1',posted_at=now)]
  ingest_records(db,MockJobSourceConnector(records),records)
  print(u.id)
 finally: db.close()
if __name__=='__main__': main()
