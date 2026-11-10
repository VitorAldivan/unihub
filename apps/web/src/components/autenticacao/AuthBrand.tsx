import { GraduationCap } from "lucide-react";

export function AuthBrand() {
  return (
    <div className="flex items-center gap-[9px]">
      <GraduationCap className="h-[23px] w-[23px] text-brand" strokeWidth={1.5} aria-hidden />
      <span className="text-lg font-semibold">UniHub</span>
    </div>
  );
}
