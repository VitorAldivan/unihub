import pytest
from app.modules.attendance.domain.calculator import (
    AttendanceStatus,
    AttendanceSummary,
    SimulationResult,
    calculate_absence_limit,
    calculate_attendance_summary,
    determine_attendance_status,
    simulate_future_absences,
) 

def test_calculate_absence_limit_exact():
    assert calculate_absence_limit(total_sessions=60, min_attendance_pct=75) == 15

def test_calculate_absence_limit_rounds_down():
    assert calculate_absence_limit(total_sessions=59, min_attendance_pct=75) == 14

def test_calculate_absence_limit_zero_sessions():
    assert calculate_absence_limit(total_sessions=0, min_attendance_pct=75) == 0

def test_status_safe_when_low_absences():
    assert determine_attendance_status(absences=0, absence_limit=15) == AttendanceStatus.SAFE


def test_status_warning_at_eighty_percent():
    assert determine_attendance_status(absences=12, absence_limit=15) == AttendanceStatus.WARNING


def test_status_risk_at_limit():
    assert determine_attendance_status(absences=15, absence_limit=15) == AttendanceStatus.RISK


def test_status_failed_when_exceeds_limit():
    assert determine_attendance_status(absences=16, absence_limit=15) == AttendanceStatus.FAILED


def test_status_edge_case_zero_limit():
    assert determine_attendance_status(absences=0, absence_limit=0) == AttendanceStatus.RISK
    assert determine_attendance_status(absences=1, absence_limit=0) == AttendanceStatus.FAILED

def test_attendance_summary_normal_flow():
    # Cenário: Semestre de 60 aulas (limite 15).
    # 20 aulas já aconteceram e o aluno teve 2 faltas.
    summary = calculate_attendance_summary(
        total_sessions=60,
        held_sessions=20,
        absences=2,
        min_attendance_pct=75,
    )
    assert summary.absence_limit == 15
    assert summary.absences == 2
    assert summary.remaining_absences == 13  # 15 - 2 = 13
    # Frequência atual: (20 - 2) / 20 = 18/20 = 90.0%
    assert summary.current_attendance_pct == 90.0
    # Frequência projetada: (60 - 2) / 60 = 58/60 = 96.67%
    assert round(summary.projected_attendance_pct, 2) == 96.67
    assert summary.status == AttendanceStatus.SAFE
def test_attendance_summary_no_sessions_held_yet():
    # Cenário: Começo do semestre (0 aulas dadas ainda).
    summary = calculate_attendance_summary(
        total_sessions=60,
        held_sessions=0,
        absences=0,
        min_attendance_pct=75,
    )
    # Não houve aulas ainda, então a frequência é 100% (sem divisão por zero!)
    assert summary.current_attendance_pct == 100.0
    assert summary.remaining_absences == 15
    assert summary.status == AttendanceStatus.SAFE

def test_simulate_future_absences_safe():
    # Semestre de 60 aulas, 20 já dadas, 2 faltas.
    # Limite = 15. Restam 13 faltas.
    # Aluno quer simular: "e se eu faltar nas próximas 3 aulas?"
    result = simulate_future_absences(
        total_sessions=60,
        held_sessions=20,
        current_absences=2,
        additional_absences=3,
        min_attendance_pct=75,
    )

    assert result.additional_absences == 3
    assert result.new_total_absences == 5  # 2 + 3 = 5 faltas
    assert result.new_remaining_absences == 10  # 15 - 5 = 10
    # Nova frequência projetada: (60 - 5) / 60 = 55/60 = 91.67%
    assert round(result.new_projected_attendance_pct, 2) == 91.67
    assert result.new_status == AttendanceStatus.SAFE
    assert "10 faltas restantes" in result.message


def test_simulate_future_absences_exceeding_remaining_sessions():
    # Semestre de 60 aulas, 55 já aconteceram (restam apenas 5 aulas no semestre).
    # Tentar simular faltar 6 aulas deve dar erro de validação (ValueError)
    with pytest.raises(ValueError, match="restam apenas 5 aulas"):
        simulate_future_absences(
            total_sessions=60,
            held_sessions=55,
            current_absences=2,
            additional_absences=6,
            min_attendance_pct=75,
        )


def test_simulate_negative_absences_fails():
    # Não existe simular faltas negativas
    with pytest.raises(ValueError, match="não pode ser negativo"):
        simulate_future_absences(
            total_sessions=60,
            held_sessions=20,
            current_absences=2,
            additional_absences=-1,
            min_attendance_pct=75,
        )