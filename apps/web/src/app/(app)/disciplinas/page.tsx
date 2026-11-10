"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAcademic } from "@/context/AcademicProvider";
import { useToast } from "@/hooks/useToast";
import { BotaoNovaDisciplina } from "@/components/disciplinas/BotaoNovaDisciplina";
import { ModalDetalheDisciplina } from "@/components/disciplinas/ModalDetalheDisciplina";
import { FormularioDisciplina } from "@/components/disciplinas/FormularioDisciplina";
import { ListaDisciplinas } from "@/components/disciplinas/ListaDisciplinas";
import { CabecalhoDisciplinas } from "@/components/disciplinas/CabecalhoDisciplinas";
import { NotaDisciplinas } from "@/components/disciplinas/NotaDisciplinas";
import { ResumoDisciplinas } from "@/components/disciplinas/ResumoDisciplinas";
import { Sheet } from "@/components/ui/Sheet";
import { Toast } from "@/components/ui/Toast";

/** Tela "Disciplinas": uma única rolagem (a da página) comporta qualquer quantidade de disciplinas. */
export default function SubjectsPage() {
  const { subjects, stats, semester, semesters, setSemester, hasAnySubjects, addSubject, removeSubject, loadDemoData } =
    useAcademic();
  const [formOpen, setFormOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const { message, show } = useToast();
  const focusId = useSearchParams().get("foco");

  // Vindo de Hoje/Calendário ("Ver em Disciplinas"): rola até a disciplina escolhida.
  useEffect(() => {
    if (!focusId) return;
    document.getElementById(`subject-${focusId}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [focusId]);

  const detail = subjects.find((s) => s.id === detailId) ?? null;

  return (
    <div className="px-6 pb-10 pt-6">
      <CabecalhoDisciplinas />

      <div className="mt-6">
        <ResumoDisciplinas
          count={subjects.length}
          semester={semester}
          semesters={semesters}
          onSemesterChange={setSemester}
        />
      </div>

      <div className="mt-6">
        <BotaoNovaDisciplina onClick={() => setFormOpen(true)} />
      </div>

      <ListaDisciplinas
        subjects={subjects}
        stats={stats}
        focusId={focusId}
        hasAnySubjects={hasAnySubjects}
        onOpen={(s) => setDetailId(s.id)}
        onLoadDemo={loadDemoData}
      />

      <NotaDisciplinas />

      <Sheet open={formOpen} onClose={() => setFormOpen(false)} title="Nova disciplina" hideHeader>
        <FormularioDisciplina
          defaultSemester={semester}
          onCancel={() => setFormOpen(false)}
          onSubmit={(input) => {
            addSubject(input);
            setFormOpen(false);
            show(`Disciplina adicionada em ${input.semester}`);
          }}
        />
      </Sheet>

      <ModalDetalheDisciplina
        subject={detail}
        stats={detail ? stats[detail.id] : undefined}
        onClose={() => setDetailId(null)}
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
