"""
NetPulse AI — Backend Integration & Unit Test Suite
Description: Validates REST API endpoints, AI diagnostic engine, and vendor config generation.
"""

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["service"] == "NetPulse AI Telemetry Engine"

def test_get_telemetry():
    response = client.get("/api/v1/telemetry")
    assert response.status_code == 200
    telemetry = response.json()
    assert "R1-HQ-CORE" in telemetry
    assert telemetry["R1-HQ-CORE"]["interface"] == "TenGigE0/0/1"

def test_ai_diagnosis():
    response = client.post("/api/v1/ai/diagnose?device_id=R1-HQ-CORE")
    assert response.status_code == 200
    report = response.json()
    assert report["severity"] == "CRITICAL"
    assert "BGP" in report["title"]

def test_generate_config():
    payload = {
        "vendor": "cisco_ios",
        "device_id": "R1-HQ-CORE",
        "scenario": "bgp_loop"
    }
    response = client.post("/api/v1/config/generate", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert "Cisco" in res["remediation_code"]
    assert "Rollback" in res["rollback_code"]
