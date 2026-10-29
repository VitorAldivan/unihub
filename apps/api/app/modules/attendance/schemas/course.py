from pydantic import BaseModel, ConfigDict, Field
from app.modules.attendance.domain.calculator import AttendanceStatus


class CourseCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="Nome da disciplina",
        examples=["Anatomia Humana"],
    )
    teacher: str | None = Field(
        None,
        max_length=100,
        description="Nome do professor",
        examples=["Dra. Cláudia"],
    )
    workload_hours: int = Field(
        default=60, gt=0, description="Carga horária total em horas", examples=[60]
    )
    min_attendance_pct: int = Field(
        default=75, ge=0, le=100, description="Presença mínima exigida", examples=[75]
    )
    color: str = Field(
        default="#3B82F6",
        description="Cor do card no front-end",
        examples=["#3B82F6"],
    )


class CourseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    teacher: str | None
    workload_hours: int
    min_attendance_pct: int
    color: str
    total_sessions: int
    held_sessions: int
    absences: int
    absence_limit: int
    remaining_absences: int
    current_attendance_pct: float
    projected_attendance_pct: float
    status: AttendanceStatus


class MarkAttendanceRequest(BaseModel):
    session_id: int = Field(..., gt=0, description="ID da aula")
    status: str = Field(
        ...,
        pattern="^(present|absent|justified)$",
        description="Status: present, absent ou justified",
        examples=["present"],
    )
    note: str | None = Field(None, max_length=255, description="Anotação opcional")