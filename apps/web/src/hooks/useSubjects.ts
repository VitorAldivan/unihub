"use client";

import { useCallback, useEffect, useMemo } from "react";
import type { AttendanceRecord, AttendanceStatus, NewSubjectInput, Subject } from "@/types";
import { averageFrequency, getSubjectStats } from "@/lib/attendance";
import { getSemesterLabel } from "@/lib/calendar";
import { normalizeSubjects } from "@/lib/migrate";
import { listSemesters } from "@/lib/semester";
import { DEMO_SEMESTER, DEMO_SUBJECTS } from "@/data/demo";
import { api } from "@/lib/api";
import { usePersistentState } from "./usePersistentState";

/**
 * Disciplinas + registros de presença + semestre selecionado.
 * Conectado à API com estratégia Offline-First (localStorage + sincronização de fundo).
 */
export function useSubjects(scope: string) {
  const [allSubjects, setSubjects, subjectsReady] = usePersistentState<Subject[]>(
    `unihub:${scope}:subjects`,
    [],
    normalizeSubjects,
  );
  const [records, setRecords, recordsReady] = usePersistentState<AttendanceRecord[]>(
    `unihub:${scope}:records`,
    [],
  );
  const [semester, setSemester, semesterReady] = usePersistentState<string>(
    `unihub:${scope}:semester`,
    getSemesterLabel(new Date()),
  );

  // Sincroniza disciplinas do backend ao carregar
  useEffect(() => {
    if (!scope) return;
    api.courses.list(scope).then((remoteCourses) => {
      if (!remoteCourses || remoteCourses.length === 0) return;
      setSubjects((prev) => {
        const remoteMapped: Subject[] = remoteCourses.map((c) => ({
          id: String(c.id),
          name: c.name,
          teacher: c.teacher || "",
          room: c.room || "",
          semester: c.semester,
          weekdays: c.weekdays || [],
          startTime: c.start_time,
          endTime: c.end_time,
          totalClasses: c.total_classes,
          baseline: { held: c.held_sessions, absences: c.absences },
          absenceLimit: c.absence_limit,
        }));
        // Junta remotas com locais evitando duplicatas
        const existingIds = new Set(prev.map((s) => s.id));
        const newOnes = remoteMapped.filter((s) => !existingIds.has(s.id));
        return [...prev, ...newOnes];
      });
    });
  }, [scope, setSubjects]);

  const stats = useMemo(
    () => Object.fromEntries(allSubjects.map((s) => [s.id, getSubjectStats(s, records)])),
    [allSubjects, records],
  );
  const subjects = useMemo(() => allSubjects.filter((s) => s.semester === semester), [allSubjects, semester]);
  const semesters = useMemo(
    () => listSemesters(allSubjects, semester, new Date()),
    [allSubjects, semester],
  );
  const overallFrequency = useMemo(
    () => averageFrequency(subjects.map((s) => stats[s.id])),
    [subjects, stats],
  );

  const addSubject = useCallback(
    (input: NewSubjectInput) => {
      const subject: Subject = {
        id: crypto.randomUUID(),
        name: input.name,
        teacher: input.teacher,
        room: input.room,
        semester: input.semester,
        weekdays: input.weekdays,
        startTime: input.startTime,
        endTime: input.endTime,
        totalClasses: input.totalClasses,
        baseline: { held: input.heldClasses, absences: input.absences },
        absenceLimit: input.absenceLimit,
      };

      // 1. Atualiza estado local imediatamente (UI instantânea)
      setSubjects((prev) => [subject, ...prev]);
      setSemester(input.semester);

      // 2. Envia para o backend em segundo plano
      api.courses.create({
        user_email: scope,
        name: input.name,
        teacher: input.teacher,
        room: input.room,
        semester: input.semester,
        weekdays: input.weekdays,
        start_time: input.startTime,
        end_time: input.endTime,
        total_classes: input.totalClasses,
        workload_hours: input.totalClasses || 60,
      });
    },
    [scope, setSubjects, setSemester],
  );

  const removeSubject = useCallback(
    (id: string) => {
      setSubjects((prev) => prev.filter((s) => s.id !== id));
      setRecords((prev) => prev.filter((r) => r.subjectId !== id));
    },
    [setSubjects, setRecords],
  );

  /** Tocar de novo no mesmo status desfaz o registro. */
  const markAttendance = useCallback(
    (subjectId: string, date: string, status: AttendanceStatus) => {
      setRecords((prev) => {
        const existing = prev.find((r) => r.subjectId === subjectId && r.date === date);
        const rest = prev.filter((r) => r !== existing);
        if (existing?.status === status) return rest;
        return [...rest, { subjectId, date, status }];
      });
    },
    [setRecords],
  );

  const getAttendanceStatus = useCallback(
    (subjectId: string, date: string): AttendanceStatus | undefined =>
      records.find((r) => r.subjectId === subjectId && r.date === date)?.status,
    [records],
  );

  const loadDemoData = useCallback(() => {
    setSubjects((prev) => [
      ...DEMO_SUBJECTS,
      ...prev.filter((s) => !DEMO_SUBJECTS.some((d) => d.id === s.id)),
    ]);
    setSemester(DEMO_SEMESTER);
  }, [setSubjects, setSemester]);

  return {
    subjects,
    hasAnySubjects: allSubjects.length > 0,
    semester,
    semesters,
    setSemester,
    stats,
    overallFrequency,
    hydrated: subjectsReady && recordsReady && semesterReady,
    addSubject,
    removeSubject,
    markAttendance,
    getAttendanceStatus,
    loadDemoData,
  };
}
