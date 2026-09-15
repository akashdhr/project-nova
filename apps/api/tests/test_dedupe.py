from types import SimpleNamespace
from app.services.dedupe import stable_canonical_id

def test_same_core_same_id():
 a=SimpleNamespace(source_url=None,company='Acme Technologies',title='QA Automation Engineer',locations=['Bengaluru'])
 b=SimpleNamespace(source_url=None,company='Acme Technologies',title='QA Automation Engineer',locations=['Bengaluru'])
 assert stable_canonical_id(a)==stable_canonical_id(b)
