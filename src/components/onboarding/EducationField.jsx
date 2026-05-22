import { useEffect, useId, useRef, useState } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function EducationField({
  level = "",
  institution = "",
  onChange,
  options = [],
  placeholder = "Select education",
  className = "",
  triggerClassName = "",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const panelId = useId();
  const hasValue = Boolean(level || institution);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const handleOutside = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className={`relative space-y-2 ${className}`.trim()} ref={rootRef}>
      <label className="app-section-title text-muted-foreground block">Education</label>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`onboarding-control flex h-9 w-full items-center rounded-xl border px-4 py-2.5 transition-all ${hasValue ? "onboarding-control--completed" : ""} ${triggerClassName}`.trim()}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <div className="flex w-full items-center justify-between gap-3">
          <p className={`truncate text-left ${institution ? "" : "text-muted-foreground"}`}>{institution || placeholder}</p>
          <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
        </div>
      </button>
      <div
        id={panelId}
        className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border bg-background shadow-lg transition-all duration-200"
        style={{
          maxHeight: open ? "420px" : "0px",
          opacity: open ? 1 : 0,
          padding: open ? "12px" : "0 12px",
          overflowY: open ? "auto" : "hidden",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div className="space-y-3">
          <div>
            <p className="app-section-title text-muted-foreground mb-2 block">Education Institution</p>
            <Input
              value={institution}
              onChange={(event) => onChange({ level, institution: event.target.value })}
              placeholder="Type institution / location"
              className={`onboarding-control rounded-xl h-9 ${institution ? "onboarding-control--completed" : ""}`}
            />
          </div>
          <div>
            <p className="app-section-title text-muted-foreground mb-2 block">Education Level</p>
            <div className="space-y-2">
              {options.map((option) => {
                const selected = option === level;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onChange({ level: option, institution })}
                    className="onboarding-control w-full rounded-xl border px-3 py-2 text-left"
                    data-selected={selected ? "true" : "false"}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="onboarding-control-title">{option}</p>
                      {selected ? <CheckCircle2 className="h-4 w-4" /> : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
