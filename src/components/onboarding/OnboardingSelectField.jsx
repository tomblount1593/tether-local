import { useEffect, useId, useRef, useState } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";

export default function OnboardingSelectField({
  label,
  value = "",
  onChange,
  options = [],
  placeholder = "Select an option",
  helperText = "",
  className = "",
  triggerClassName = "",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const panelId = useId();

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

  const normalizedOptions = options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option,
  );
  const selectedOption = normalizedOptions.find((option) => option.value === value);
  const displayValue = selectedOption?.label || value || "";

  return (
    <div className={`relative space-y-2 ${className}`.trim()} ref={rootRef}>
      <label className="app-section-title text-muted-foreground block">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`onboarding-control flex w-full items-center rounded-xl border px-4 py-2.5 transition-all ${value ? "onboarding-control--completed" : ""} ${triggerClassName}`.trim()}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <div className="flex w-full items-center justify-between gap-3">
          <p className={`text-left ${displayValue ? "" : "text-muted-foreground"}`}>{displayValue || placeholder}</p>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
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
        <div className="space-y-2">
          {normalizedOptions.map((option) => {
            const selected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value, option);
                  setOpen(false);
                }}
                className="onboarding-control w-full rounded-xl border px-3 py-2 text-left"
                data-selected={selected ? "true" : "false"}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="onboarding-control-title">{option.label}</p>
                  {selected ? <CheckCircle2 className="h-4 w-4" /> : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {helperText ? <p className="text-xs text-muted-foreground">{helperText}</p> : null}
    </div>
  );
}
