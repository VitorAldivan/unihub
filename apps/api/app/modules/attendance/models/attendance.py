import datetime
from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    teacher: Mapped[str | None] = mapped_column(String(100), nullable=True)
    workload_hours: Mapped[int] = mapped_column(Integer, default=60, nullable=False)
    min_attendance_pct: Mapped[int] = mapped_column(
        Integer, default=75, nullable=False
    )
    color: Mapped[str] = mapped_column(String(20), default="#3B82F6", nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc)
    )

    sessions: Mapped[list["ClassSession"]] = relationship(
        "ClassSession", back_populates="course", cascade="all, delete-orphan"
    )

    __table_args__ = (
        CheckConstraint(
            "min_attendance_pct >= 0 AND min_attendance_pct <= 100",
            name="check_min_attendance_pct",
        ),
    )


class ClassSession(Base):
    __tablename__ = "class_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    course_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False
    )
    date: Mapped[datetime.date] = mapped_column(nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="scheduled", nullable=False)
    cancel_reason: Mapped[str | None] = mapped_column(String(200), nullable=True)

    course: Mapped["Course"] = relationship("Course", back_populates="sessions")
    attendance: Mapped["AttendanceRecord | None"] = relationship(
        "AttendanceRecord",
        back_populates="session",
        uselist=False,
        cascade="all, delete-orphan",
    )


class AttendanceRecord(Base):
    __tablename__ = "attendance_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    session_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("class_sessions.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    note: Mapped[str | None] = mapped_column(String(255), nullable=True)
    marked_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc)
    )

    session: Mapped["ClassSession"] = relationship(
        "ClassSession", back_populates="attendance"
    )