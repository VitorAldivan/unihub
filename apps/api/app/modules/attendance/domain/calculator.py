import math
from dataclasses import dataclass
from enum import StrEnum

class AttendanceStatus(StrEnum):
    SAFE = "SAFE"
    WARNING = "WARNING"
    RISK = "RISK"
    FAILED = "FAILED"

@dataclass(frozen=True)
class AttendanceSummary:
    total_sessions: int
    held_sessions: int
    absences: int
    absence_limit: int
    remaining_absences: int
    current_attendance_pct: float
    projected_attendance_pct: float
    status: AttendanceStatus

@dataclass(frozen=True)
class SimulationResult:
    additional_absences: int
    new_total_absences: int
    new_remaining_absences: int
    new_projected_attendance_pct: float
    new_status: AttendanceStatus
    message: str





def calculate_absence_limit(total_sessions: int, min_attendance_pct: int = 75) -> int:
    """Calcula o limite máximo de faltas permitidas em uma disciplina."""
    if total_sessions <= 0:
        return 0

    max_absence_pct = 100 - min_attendance_pct
    return math.floor(total_sessions * max_absence_pct / 100)


def determine_attendance_status(absences: int, absence_limit: int) -> AttendanceStatus:
    """Classifica a situação de frequência do aluno segundo as regras de negócio."""
    # 1. Se as faltas ultrapassaram o limite, reprovou direto
    if absences > absence_limit:
        return AttendanceStatus.FAILED

    # 2. Caso de borda: disciplina com 0 faltas permitidas
    if absence_limit <= 0:
        return AttendanceStatus.RISK

    # 3. Cálculo do percentual de uso do limite de faltas
    usage_ratio = absences / absence_limit

    if usage_ratio < 0.8:
        return AttendanceStatus.SAFE
    elif usage_ratio < 0.9:
        return AttendanceStatus.WARNING
    else:
        return AttendanceStatus.RISK

def calculate_attendance_summary(
    total_sessions: int,
    held_sessions: int,
    absences: int,
    min_attendance_pct: int = 75,
) -> AttendanceSummary:
    """Calcula todas as métricas consolidadas de frequência de uma disciplina."""
    limit = calculate_absence_limit(total_sessions, min_attendance_pct)
    remaining = limit - absences

    # 1. Frequência atual (com base nas aulas que já aconteceram)
    if held_sessions <= 0:
        current_pct = 100.0
    else:
        attended = max(0, held_sessions - absences)
        current_pct = (attended / held_sessions) * 100.0

    # 2. Frequência projetada no final do semestre (se não faltar mais)
    if total_sessions <= 0:
        projected_pct = 100.0
    else:
        projected_attended = max(0, total_sessions - absences)
        projected_pct = (projected_attended / total_sessions) * 100.0

    # 3. Status segundo o semáforo
    status = determine_attendance_status(absences, limit)

    return AttendanceSummary(
        total_sessions=total_sessions,
        held_sessions=held_sessions,
        absences=absences,
        absence_limit=limit,
        remaining_absences=remaining,
        current_attendance_pct=round(current_pct, 2),
        projected_attendance_pct=round(projected_pct, 2),
        status=status,
    )

def simulate_future_absences(
    total_sessions: int,
    held_sessions: int,
    current_absences: int,
    additional_absences: int,
    min_attendance_pct: int = 75,
) -> SimulationResult:
    """Simula o impacto de faltas futuras na frequência projetada."""
    # 1. Blindagem: não aceitar faltas negativas
    if additional_absences < 0:
        raise ValueError("O número de faltas adicionais não pode ser negativo.")

    # 2. Blindagem: não permitir faltar mais do que as aulas restantes no semestre
    remaining_sessions = max(0, total_sessions - held_sessions)
    if additional_absences > remaining_sessions:
        raise ValueError(
            f"Não é possível simular {additional_absences} faltas: "
            f"restam apenas {remaining_sessions} aulas no semestre."
        )

    # 3. Novos cálculos simulados
    absence_limit = calculate_absence_limit(total_sessions, min_attendance_pct)
    new_total_absences = current_absences + additional_absences
    new_remaining = absence_limit - new_total_absences

    if total_sessions <= 0:
        new_projected_pct = 100.0
    else:
        projected_attended = max(0, total_sessions - new_total_absences)
        new_projected_pct = (projected_attended / total_sessions) * 100.0

    new_status = determine_attendance_status(new_total_absences, absence_limit)

    # 4. Mensagem amigável para o front-end exibir na tela
    message = (
        f"Se você faltar mais {additional_absences} aula(s), ficará com "
        f"{new_remaining} faltas restantes e {new_projected_pct:.2f}% de frequência projetada."
    )

    return SimulationResult(
        additional_absences=additional_absences,
        new_total_absences=new_total_absences,
        new_remaining_absences=new_remaining,
        new_projected_attendance_pct=round(new_projected_pct, 2),
        new_status=new_status,
        message=message,
    )