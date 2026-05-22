import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function OnboardingMultiSelectField({
  label,
  values = [],
  onChange,
  options = [],
  placeholder = "Select options",
  helperText = "",
  className = "",
  triggerClassName = "",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const panelId = useId();
  const summary = values.length ? values.join(", ") : placeholder;

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

  const toggleValue = (option) => {
    const exists = values.includes(option);
    onChange(exists ? values.filter((item) => item !== option) : [...values, option]);
  };

  return (
    <div className={`relative space-y-2 ${className}`.trim()} ref={rootRef}>
      <label className="app-section-title text-muted-foreground block">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`onboarding-control flex w-full items-center rounded-xl border px-4 py-2.5 transition-all ${values.length ? "onboarding-control--completed" : ""} ${triggerClassName}`.trim()}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <div className="flex w-full items-center justify-between gap-3">
          <p className={`min-w-0 flex-1 whitespace-normal break-words text-left leading-relaxed ${values.length ? "" : "text-muted-foreground"}`}>{summary}</p>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform flex-shrink-0" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
        </div>
      </button>
      <div
        id={panelId}
        className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border bg-background shadow-lg transition-all duration-200"
        style={{
          maxHeight: open ? "320px" : "0px",
          opacity: open ? 1 : 0,
          padding: open ? "12px" : "0 12px",
          overflowY: open ? "auto" : "hidden",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const selected = values.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleValue(option)}
                className="onboarding-control px-3 py-1.5 rounded-xl text-[13px] font-medium border transition-all text-left"
                data-selected={selected ? "true" : "false"}
                aria-pressed={selected}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
      {helperText ? <p className="text-xs text-muted-foreground">{helperText}</p> : null}
    </div>
  );
}
