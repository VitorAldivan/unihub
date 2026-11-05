import json
from pydantic import BaseModel, ConfigDict, Field
from app.modules.attendance.domain.calculator import AttendanceStatus


class CourseCreate(BaseModel):
    user_email: str = Field(default="demo@unihub.app", description="E-mail do estudante")
    name: str = Field(..., min_length=2, max_length=100, description="Nome da disciplina")
    teacher: str | None = Field(None, max_length=100, description="Nome do professor")
    room: str | None = Field(None, max_length=100, description="Sala de aula")
    semester: str = Field(default="2026.1", max_length=20, description="Semestre")
    weekdays: list[int] = Field(default_factory=list, description="Dias da semana (0=Dom...6=Sab)")
    start_time: str = Field(default="", max_length=10, description="Horário inicial")
    end_time: str = Field(default="", max_length=10, description="Horário final")
    workload_hours: int = Field(default=60, gt=0, description="Carga horária total")
    total_classes: int | None = Field(default=None, description="Total de aulas previstas")
    min_attendance_pct: int = Field(default=75, ge=0, le=100, description="Presença mínima")
    color: str = Field(default="#0EA5E9", description="Cor do card")


class CourseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_email: str
    name: str
    teacher: str | None
    room: str | None
    semester: str
    weekdays: list[int]
    start_time: str
    end_time: str
    workload_hours: int
    total_classes: int | None
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
    status: str = Field(..., pattern="^(present|absent|justified|cancelled)$", description="Status")
    note: str | None = Field(None, max_length=255, description="Anotação opcional")
