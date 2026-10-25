from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_liveness():
    response = client.get("/health/live")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "unihub-api"}


def test_readiness():
    response = client.get("/health/ready")
    assert response.status_code == 200
    assert response.json() == {"status": "ready", "service": "unihub-api"}


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "UniHub API"
    assert data["docs_url"] == "/docs"
