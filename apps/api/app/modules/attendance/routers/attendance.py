from fastapi import APIRouter, HTTPException, status

from app.modules.attendance.domain.calculator import simulate_future_absences
from app.modules.attendance.schemas.attendance import (
    SimulateAbsenceRequest,
    SimulationResultResponse,
)

router = APIRouter(prefix="/api/v1/attendance", tags=["Frequência"])


@router.post(
    "/simulate",
    response_model=SimulationResultResponse,
    status_code=status.HTTP_200_OK,
    summary="Simular impacto de faltas futuras",
    description="Calcula a nova porcentagem de frequência projetada e o status resultante ao simular faltas adicionais.",
)
def simulate_attendance(payload: SimulateAbsenceRequest) -> SimulationResultResponse:
    try:
        result = simulate_future_absences(
            total_sessions=payload.total_sessions,
            held_sessions=payload.held_sessions,
            current_absences=payload.current_absences,
            additional_absences=payload.additional_absences,
            min_attendance_pct=payload.min_attendance_pct,
        )
        return SimulationResultResponse(
            additional_absences=result.additional_absences,
            new_total_absences=result.new_total_absences,
            new_remaining_absences=result.new_remaining_absences,
            new_projected_attendance_pct=result.new_projected_attendance_pct,
            new_status=result.new_status,
            message=result.message,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc