"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAcademic } from "@/context/AcademicProvider";
import { useToast } from "@/hooks/useToast";
import { NewSubjectButton } from "@/components/subjects/NewSubjectButton";
import { SubjectDetailSheet } from "@/components/subjects/SubjectDetailSheet";
import { SubjectForm } from "@/components/subjects/SubjectForm";
import { SubjectList } from "@/components/subjects/SubjectList";
import { SubjectsHeader } from "@/components/subjects/SubjectsHeader";
import { SubjectsNote } from "@/components/subjects/SubjectsNote";
import { SubjectsSummary } from "@/components/subjects/SubjectsSummary";
import { Sheet } from "@/components/ui/Sheet";
import { Toast } from "@/components/ui/Toast";
import type { Subject } from "@/types";

/** Tela "Disciplinas": uma única rolagem (a da página) comporta qualquer quantidade de disciplinas. */
export default function SubjectsPage() {
  const { subjects, stats, semester, semesters, setSemester, hasAnySubjects, addSubject, updateSubject, removeSubject, loadDemoData } =
    useAcademic();
  const [formOpen, setFormOpen] = useState(false);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const { message, show } = useToast();
  const focusId = useSearchParams().get("foco");

  // Vindo de Hoje/Calendário ("Ver em Disciplinas"): rola até a disciplina escolhida.
  useEffect(() => {
    if (!focusId) return;
    document.getElementById(`subject-${focusId}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [focusId]);

  const detail = subjects.find((s) => s.id === detailId) ?? null;

  function buildInitialValues(s: Subject) {
    return {
      name: s.name,
      teacher: s.teacher,
      room: s.room,
      semester: s.semester,
      weekdays: s.weekdays,
      startTime: s.startTime,
      endTime: s.endTime,
      total: s.totalClasses != null ? String(s.totalClasses) : "",
      held: s.baseline.held != null ? String(s.baseline.held) : "",
      absences: s.baseline.absences != null ? String(s.baseline.absences) : "",
      limit: s.absenceLimit != null ? String(s.absenceLimit) : "",
    };
  }

  return (
    <div className="px-6 pb-10 pt-6">
      <SubjectsHeader />

      <div className="mt-6">
        <SubjectsSummary
          count={subjects.length}
          semester={semester}
          semesters={semesters}
          onSemesterChange={setSemester}
        />
      </div>

      <div className="mt-6">
        <NewSubjectButton onClick={() => setFormOpen(true)} />
      </div>

      <SubjectList
        subjects={subjects}
        stats={stats}
        focusId={focusId}
        hasAnySubjects={hasAnySubjects}
        onOpen={(s) => setDetailId(s.id)}
        onLoadDemo={loadDemoData}
      />

      <SubjectsNote />

      {/* Sheet: Nova disciplina */}
      <Sheet open={formOpen} onClose={() => setFormOpen(false)} title="Nova disciplina">
        <SubjectForm
          defaultSemester={semester}
          onCancel={() => setFormOpen(false)}
          onSubmit={(input) => {
            addSubject(input);
            setFormOpen(false);
            show(`Disciplina adicionada em ${input.semester}`);
          }}
        />
      </Sheet>

      {/* Sheet: Editar disciplina */}
      <Sheet open={editSubject !== null} onClose={() => setEditSubject(null)} title="Editar disciplina">
        {editSubject && (
          <SubjectForm
            key={editSubject.id}
            defaultSemester={editSubject.semester}
            initialValues={buildInitialValues(editSubject)}
            submitLabel="Salvar alterações"
            onCancel={() => setEditSubject(null)}
            onSubmit={(input) => {
              updateSubject(editSubject.id, input);
              setEditSubject(null);
              show("Disciplina atualizada");
            }}
          />
        )}
      </Sheet>

      <SubjectDetailSheet
        subject={detail}
        stats={detail ? stats[detail.id] : undefined}
        onClose={() => setDetailId(null)}
        onEdit={(s) => {
          setDetailId(null);
          setEditSubject(s);
        }}
        onDelete={(s) => {
          removeSubject(s.id);
          setDetailId(null);
          show("Disciplina excluída");
        }}
      />

      <Toast message={message} />
    </div>
  );
}
