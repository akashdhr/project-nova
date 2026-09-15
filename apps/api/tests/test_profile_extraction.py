import pytest
from app.services.profile_extraction import sanitize_for_ai, validate_extraction, profile_to_candidate_fields

def test_sanitize_for_ai_removes_direct_identifiers():
    text='Jane Doe\nEmail: jane@example.com\nPhone: +49 171 1234567\nAddress: 12 Main Street\nSenior Engineer'
    clean=sanitize_for_ai(text)
    assert 'jane@example.com' not in clean; assert '1234567' not in clean; assert '12 Main Street' not in clean; assert 'Senior Engineer' in clean

def test_validate_extraction_preserves_missing_information():
    profile=validate_extraction({'current_role':'Engineer','skills':['Python']})
    assert profile.current_role=='Engineer'; assert profile.years_experience is None; assert profile.employment_history==[]; assert profile.education==[]

def test_invalid_extraction_is_rejected():
    with pytest.raises(ValueError): validate_extraction({'years_experience':100})

def test_profile_mapping_contains_only_supported_fields():
    profile=validate_extraction({'current_role':'Engineer','current_company':'Acme','employment_history':[{'job_title':'QA Engineer','company':'OldCo'}]})
    fields=profile_to_candidate_fields(profile)
    assert fields['current_role']=='Engineer'; assert fields['current_company']=='Acme'; assert fields['companies']==['Acme','OldCo']; assert fields['previous_roles'][0]['job_title']=='QA Engineer'
