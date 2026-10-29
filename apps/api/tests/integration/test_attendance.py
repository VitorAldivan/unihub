from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_simulate_attendance_endpoint_success():
    # 1. Simula o celular enviando uma requisição válida
    payload = {
        "total_sessions": 60,
        "held_sessions": 20,
        "current_absences": 2,
        "additional_absences": 3,
        "min_attendance_pct": 75,
    }

    response = client.post("/api/v1/attendance/simulate", json=payload)

    # 2. Validações HTTP
    assert response.status_code == 200
    data = response.json()
    assert data["additional_absences"] == 3
    assert data["new_total_absences"] == 5
    assert data["new_remaining_absences"] == 10
    assert data["new_projected_attendance_pct"] == 91.67
    assert data["new_status"] == "SAFE"
    assert "10 faltas restantes" in data["message"]


def test_simulate_attendance_endpoint_exceeding_sessions_error():
    # 60 aulas, 55 já dadas -> restam só 5 aulas. Simular 6 deve devolver HTTP 400 Bad Request
    payload = {
        "total_sessions": 60,
        "held_sessions": 55,
        "current_absences": 2,
        "additional_absences": 6,
        "min_attendance_pct": 75,
    }

    response = client.post("/api/v1/attendance/simulate", json=payload)

    assert response.status_code == 400
    assert "restam apenas 5 aulas" in response.json()["detail"]


def test_simulate_attendance_endpoint_negative_absences_validation_error():
    # Enviar número negativo deve ser barrado pelo Pydantic com HTTP 422 Unprocessable Entity
    payload = {
        "total_sessions": 60,
        "held_sessions": 20,
        "current_absences": 2,
        "additional_absences": -3,
        "min_attendance_pct": 75,
    }

    response = client.post("/api/v1/attendance/simulate", json=payload)

    # HTTP 422 é o padrão do Pydantic para erro de validação de dados
    assert response.status_code == 422