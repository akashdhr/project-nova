from app.connectors.mock import MockJobSourceConnector

def test_mock_source_contract():
 s=MockJobSourceConnector([]); assert s.health_check()['status']=='healthy'; assert s.fetch_jobs()[0]==[]
