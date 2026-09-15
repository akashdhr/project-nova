from app.services.normalization import normalize_title

def test_title_variants():
 assert normalize_title('QA Automation Engineer II')=='QA Automation Engineer'
 assert normalize_title('QA Automation Engineer - L2')=='QA Automation Engineer'
 assert normalize_title('QA Automation Engineer 2')=='QA Automation Engineer'
