from pydantic import BaseModel, Field
from app.modules.attendance.domain.calculator import AttendanceStatus


class SimulateAbsenceRequest(BaseModel):
    total_sessions: int = Field(
        ...,
        gt=0,
        description="Total de aulas previstas no semestre (deve ser maior que zero)",
        examples=[60],
    )
    held_sessions: int = Field(
        ...,
        ge=0,
        description="Aulas já ocorridas até o momento",
        examples=[20],
    )
    current_absences: int = Field(
        ...,
        ge=0,
        description="Número de faltas já registradas",
        examples=[2],
    )
    additional_absences: int = Field(
        ...,
        ge=0,
        description="Quantidade de faltas adicionais que o aluno deseja simular",
        examples=[3],
    )
    min_attendance_pct: int = Field(
        default=75,
        ge=0,
        le=100,
        description="Porcentagem mínima de presença exigida (padrão 75%)",
        examples=[75],
    )


class SimulationResultResponse(BaseModel):
    additional_absences: int
    new_total_absences: int
    new_remaining_absences: int
    new_projected_attendance_pct: float
    new_status: AttendanceStatus
    message: str