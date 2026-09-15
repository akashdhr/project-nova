from app.connectors.base import JobSourceConnector

class ConnectorRegistry:
    """Provider-neutral registry. Commercial clearance is an explicit deployment gate."""
    def __init__(self):
        self._connectors: dict[str, JobSourceConnector] = {}
        self._approved: set[str] = set()

    def register(self, connector: JobSourceConnector, commercially_cleared: bool = False):
        self._connectors[connector.source_name] = connector
        if commercially_cleared:
            self._approved.add(connector.source_name)

    def get(self, name: str) -> JobSourceConnector:
        if name not in self._connectors:
            raise KeyError(f"Unknown connector: {name}")
        if name != "mock" and name not in self._approved:
            raise PermissionError(f"Provider {name} is not commercially cleared")
        return self._connectors[name]

    def health(self):
        return {name: connector.health_check() for name, connector in self._connectors.items()}
