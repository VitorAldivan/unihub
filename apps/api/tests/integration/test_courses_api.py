from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_create_and_list_courses():
    # 1. Cria uma disciplina com 60 horas
    payload = {
        "name": "Bioquímica",
        "teacher": "Dr. Fernando",
        "workload_hours": 60,
        "min_attendance_pct": 75,
        "color": "#10B981",
    }
    response = client.post("/api/v1/courses/", json=payload)
    assert response.status_code == 201
    course_data = response.json()
    assert course_data["name"] == "Bioquímica"
    assert course_data["absence_limit"] == 15
    assert course_data["remaining_absences"] == 15
    assert course_data["status"] == "SAFE"

    # 2. Lista as disciplinas cadastradas
    list_response = client.get("/api/v1/courses/")
    assert list_response.status_code == 200
    courses = list_response.json()
    assert len(courses) >= 1
    assert any(c["name"] == "Bioquímica" for c in courses)


def test_mark_attendance():
    # 1. Cria uma disciplina
    payload = {"name": "Fisiologia", "workload_hours": 40, "min_attendance_pct": 75}
    res = client.post("/api/v1/courses/", json=payload)
    course_id = res.json()["id"]

    # 2. Marca falta na primeira aula (aula id 1)
    mark_payload = {
        "session_id": 1,
        "status": "absent",
        "note": "Gripe forte",
    }
    mark_res = client.post("/api/v1/courses/attendance", json=mark_payload)
    assert mark_res.status_code == 200
    assert mark_res.json()["status"] == "absent"