"use client";

import { useMemo, useState } from "react";
import type { AttendanceStatus, ClassSession } from "@/types";
import { useAcademic } from "@/context/AcademicProvider";
import { useCurrentUser } from "@/context/SessionContext";
import { useNow } from "@/hooks/useNow";
import { useToast } from "@/hooks/useToast";
import { formatDayHeading, getGreeting } from "@/lib/calendar";
import { initialsFromEmail } from "@/lib/format";
import { buildSessionsForDate, getNextAssessment, pickFeatured } from "@/lib/schedule";
import { ClassDetailSheet } from "@/components/home/ClassDetailSheet";
import { ClassesSection } from "@/components/home/ClassesSection";
import { ExamReminder } from "@/components/home/ExamReminder";
import { FrequencySummary } from "@/components/home/FrequencySummary";
import { HomeHeader } from "@/components/home/HomeHeader";
import { STATUS_META } from "@/components/ui/attendance-status";
import { Toast } from "@/components/ui/Toast";

/** Tela "Hoje": saudação, frequência do semestre, aulas do dia e próxima avaliação. */
export default function HomePage() {
  const { user } = useCurrentUser();
  const { subjects, stats, semester, overallFrequency, reminders, getAttendanceStatus, markAttendance, loadDemoData } =
    useAcademic();
  const now = useNow();
  const { message, show } = useToast();
  const [detailId, setDetailId] = useState<string | null>(null);

  const sessions = useMemo(
    () => buildSessionsForDate(subjects, stats, getAttendanceStatus, now),
    [subjects, stats, getAttendanceStatus, now],
  );
  const featured = pickFeatured(sessions, now);
  const assessment = getNextAssessment(reminders, subjects, now);
  const detail = sessions.find((s) => s.id === detailId) ?? null;

  function handleMark(session: ClassSession, status: AttendanceStatus) {
    const removing = session.status === status;
    markAttendance(session.subjectId, session.date, status);
    show(
      removing
        ? `Registro removido: ${session.name}`
        : `${session.name}: ${STATUS_META[status].label}`,
    );
  }

  return (
    <div className="px-6 pb-8 pt-6">
      <HomeHeader
        name={user.name}
        initials={initialsFromEmail(user.email)}
        dateLabel={formatDayHeading(now)}
        greeting={getGreeting(now)}
      />

      <hr className="mt-6 border-line" />

      <FrequencySummary semester={semester} frequency={overallFrequency} />

      <ClassesSection
        sessions={sessions}
        featured={featured}
        hasSubjects={subjects.length > 0}
        onMark={handleMark}
        onOpenDetails={(s) => setDetailId(s.id)}
        onLoadDemo={loadDemoData}
      />

      {assessment && <ExamReminder title={assessment.title} detail={assessment.detail} />}

      <ClassDetailSheet
        session={detail}
        stats={detail ? stats[detail.subjectId] : undefined}
        onClose={() => setDetailId(null)}
        onMark={handleMark}
      />
      <Toast message={message} />
    </div>
  );
}
