import datetime
import json
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.attendance.domain.calculator import calculate_attendance_summary
from app.modules.attendance.models.attendance import (
    AttendanceRecord,
    ClassSession,
    Course,
)
from app.modules.attendance.schemas.course import (
    CourseCreate,
    CourseResponse,
    MarkAttendanceRequest,
)

router = APIRouter(prefix="/api/v1/courses", tags=["Disciplinas"])


def _to_course_response(course: Course, db: Session) -> CourseResponse:
    total_sessions = len(course.sessions) if course.sessions else course.workload_hours
    held_sessions = sum(1 for s in course.sessions if s.attendance is not None)
    absences = sum(
        1 for s in course.sessions if s.attendance and s.attendance.status == "absent"
    )

    summary = calculate_attendance_summary(
        total_sessions=total_sessions,
        held_sessions=held_sessions,
        absences=absences,
        min_attendance_pct=course.min_attendance_pct,
    )

    try:
        parsed_weekdays = json.loads(course.weekdays) if course.weekdays else []
    except Exception:
        parsed_weekdays = []

    return CourseResponse(
        id=course.id,
        user_email=course.user_email,
        name=course.name,
        teacher=course.teacher,
        room=course.room,
        semester=course.semester,
        weekdays=parsed_weekdays,
        start_time=course.start_time,
        end_time=course.end_time,
        workload_hours=course.workload_hours,
        total_classes=course.total_classes,
        min_attendance_pct=course.min_attendance_pct,
        color=course.color,
        total_sessions=summary.total_sessions,
        held_sessions=summary.held_sessions,
        absences=summary.absences,
        absence_limit=summary.absence_limit,
        remaining_absences=summary.remaining_absences,
        current_attendance_pct=summary.current_attendance_pct,
        projected_attendance_pct=summary.projected_attendance_pct,
        status=summary.status,
    )


@router.post(
    "/",
    response_model=CourseResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Cadastrar nova disciplina",
)
def create_course(payload: CourseCreate, db: Session = Depends(get_db)):
    course = Course(
        user_email=payload.user_email,
        name=payload.name,
        teacher=payload.teacher,
        room=payload.room,
        semester=payload.semester,
        weekdays=json.dumps(payload.weekdays),
        start_time=payload.start_time,
        end_time=payload.end_time,
        workload_hours=payload.workload_hours,
        total_classes=payload.total_classes,
        min_attendance_pct=payload.min_attendance_pct,
        color=payload.color,
    )
    db.add(course)
    db.commit()
    db.refresh(course)

    # Gera as aulas previstas
    planned_sessions = payload.total_classes or payload.workload_hours
    for i in range(planned_sessions):
        session = ClassSession(
            course_id=course.id,
            date=datetime.date.today() + datetime.timedelta(days=i * 2),
            status="scheduled",
        )
        db.add(session)
    db.commit()
    db.refresh(course)

    return _to_course_response(course, db)


@router.get(
    "/",
    response_model=list[CourseResponse],
    summary="Listar disciplinas",
)
def list_courses(
    user_email: str | None = Query(None, description="Filtrar por estudante"),
    semester: str | None = Query(None, description="Filtrar por semestre"),
    db: Session = Depends(get_db),
):
    query = db.query(Course)
    if user_email:
        query = query.filter(Course.user_email == user_email)
    if semester:
        query = query.filter(Course.semester == semester)
    courses = query.order_by(Course.created_at.desc()).all()
    return [_to_course_response(c, db) for c in courses]


@router.post(
    "/attendance",
    summary="Registrar presença ou falta em uma aula",
)
def mark_attendance(payload: MarkAttendanceRequest, db: Session = Depends(get_db)):
    session = (
        db.query(ClassSession).filter(ClassSession.id == payload.session_id).first()
    )
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Aula com ID {payload.session_id} não encontrada.",
        )

    record = (
        db.query(AttendanceRecord)
        .filter(AttendanceRecord.session_id == payload.session_id)
        .first()
    )

    if record:
        record.status = payload.status
        record.note = payload.note
    else:
        record = AttendanceRecord(
            session_id=payload.session_id,
            status=payload.status,
            note=payload.note,
        )
        db.add(record)

    db.commit()

    return {
        "message": "Frequência registrada com sucesso.",
        "session_id": payload.session_id,
        "status": payload.status,
    }
