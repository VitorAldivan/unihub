import datetime
from fastapi import APIRouter, Depends, HTTPException, status
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


@router.post(
    "/",
    response_model=CourseResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Cadastrar nova disciplina",
)
def create_course(payload: CourseCreate, db: Session = Depends(get_db)):
    course = Course(
        name=payload.name,
        teacher=payload.teacher,
        workload_hours=payload.workload_hours,
        min_attendance_pct=payload.min_attendance_pct,
        color=payload.color,
    )
    db.add(course)
    db.commit()
    db.refresh(course)

    # Gera as aulas previstas automaticamente com base na carga horária
    for i in range(payload.workload_hours):
        session = ClassSession(
            course_id=course.id,
            date=datetime.date.today() + datetime.timedelta(days=i * 2),
            status="scheduled",
        )
        db.add(session)
    db.commit()

    summary = calculate_attendance_summary(
        total_sessions=payload.workload_hours,
        held_sessions=0,
        absences=0,
        min_attendance_pct=payload.min_attendance_pct,
    )

    return CourseResponse(
        id=course.id,
        name=course.name,
        teacher=course.teacher,
        workload_hours=course.workload_hours,
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


@router.get(
    "/",
    response_model=list[CourseResponse],
    summary="Listar disciplinas com métricas calculadas",
)
def list_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    results = []

    for course in courses:
        total = len(course.sessions)
        held_sessions = [s for s in course.sessions if s.status == "held"]
        absences = sum(
            1
            for s in held_sessions
            if s.attendance and s.attendance.status == "absent"
        )

        summary = calculate_attendance_summary(
            total_sessions=total,
            held_sessions=len(held_sessions),
            absences=absences,
            min_attendance_pct=course.min_attendance_pct,
        )

        results.append(
            CourseResponse(
                id=course.id,
                name=course.name,
                teacher=course.teacher,
                workload_hours=course.workload_hours,
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
        )

    return results


@router.post(
    "/attendance",
    status_code=status.HTTP_200_OK,
    summary="Marcar presença em uma aula",
)
def mark_attendance(payload: MarkAttendanceRequest, db: Session = Depends(get_db)):
    session = (
        db.query(ClassSession).filter(ClassSession.id == payload.session_id).first()
    )
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Aula não encontrada."
        )

    session.status = "held"

    if session.attendance:
        session.attendance.status = payload.status
        session.attendance.note = payload.note
    else:
        record = AttendanceRecord(
            session_id=session.id, status=payload.status, note=payload.note
        )
        db.add(record)

    db.commit()
    return {"message": "Presença registrada com sucesso!", "status": payload.status}