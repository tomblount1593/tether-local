import {
  HEIGHT_CM_RANGE,
  HEIGHT_FEET_RANGE,
  HEIGHT_INCHES_RANGE,
  buildHeightData,
  centimetersToFeetInches,
  feetInchesToCentimeters,
} from "@/lib/onboardingProfile";

function numericInput(value, maxLength = 3) {
  return String(value || "").replace(/\D/g, "").slice(0, maxLength);
}

export default function HeightInputField({
  cmValue = "",
  unit = "cm",
  feetValue = "",
  inchesValue = "",
  onChange,
}) {
  const hasValue = unit === "cm" ? Boolean(cmValue) : Boolean(feetValue || inchesValue);

  const handleUnitChange = (nextUnit) => {
    if (nextUnit === unit) return;

    if (nextUnit === "ft") {
      const { feet, inches } = centimetersToFeetInches(cmValue || 184);
      const height = buildHeightData({ unit: "ft", feetValue: feet, inchesValue: inches });
      onChange({
        unit: "ft",
        cmValue: "",
        feetValue: String(height.feetValue ?? feet),
        inchesValue: String(height.inchesValue ?? inches),
        height,
      });
      return;
    }

    const convertedCm = feetInchesToCentimeters(feetValue || 6, inchesValue || 0) ?? 184;
    const height = buildHeightData({ unit: "cm", cmValue: convertedCm });
    onChange({
      unit: "cm",
      cmValue: String(height.cmValue ?? convertedCm),
      feetValue: "",
      inchesValue: "",
      height,
    });
  };

  const handleCentimeterChange = (value) => {
    const nextValue = numericInput(value, 3);
    const numeric = Number(nextValue);
    const height = buildHeightData({
      unit: "cm",
      cmValue: Number.isFinite(numeric) && numeric >= HEIGHT_CM_RANGE.min && numeric <= HEIGHT_CM_RANGE.max ? numeric : null,
    });
    onChange({
      unit: "cm",
      cmValue: nextValue,
      feetValue: "",
      inchesValue: "",
      height,
    });
  };

  const handleFeetInchesChange = (nextFeet, nextInches) => {
    const feet = numericInput(nextFeet, 1);
    const inches = numericInput(nextInches, 2);
    const numericFeet = Number(feet);
    const numericInches = Number(inches);
    const isFeetValid = Number.isFinite(numericFeet) && numericFeet >= HEIGHT_FEET_RANGE.min && numericFeet <= HEIGHT_FEET_RANGE.max;
    const isInchesValid = Number.isFinite(numericInches) && numericInches >= HEIGHT_INCHES_RANGE.min && numericInches <= HEIGHT_INCHES_RANGE.max;
    const height = buildHeightData({
      unit: "ft",
      feetValue: isFeetValid ? numericFeet : null,
      inchesValue: isInchesValid ? numericInches : null,
    });
    onChange({
      unit: "ft",
      cmValue: "",
      feetValue: feet,
      inchesValue: inches,
      height,
    });
  };

  return (
    <div>
      <label className="app-section-title text-muted-foreground mb-1.5 block">Height</label>
      <div className={`onboarding-control flex h-9 w-full items-center justify-between rounded-xl border px-3 ${hasValue ? "onboarding-control--completed" : ""}`}>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 pr-2">
          {unit === "cm" ? (
            <input
              type="number"
              min={HEIGHT_CM_RANGE.min}
              max={HEIGHT_CM_RANGE.max}
              value={cmValue}
              onChange={(event) => handleCentimeterChange(event.target.value)}
              placeholder="184"
              className="min-w-0 flex-1 bg-transparent text-left outline-none onboarding-date-input"
            />
          ) : (
            <div className="flex min-w-0 flex-1 items-center gap-1 whitespace-nowrap">
              <input
                type="number"
                min={HEIGHT_FEET_RANGE.min}
                max={HEIGHT_FEET_RANGE.max}
                value={feetValue}
                onChange={(event) => handleFeetInchesChange(event.target.value, inchesValue)}
                placeholder="5"
                className="w-6 bg-transparent text-left outline-none onboarding-date-input"
              />
              <span className="text-[12px] text-current/80">ft</span>
              <input
                type="number"
                min={HEIGHT_INCHES_RANGE.min}
                max={HEIGHT_INCHES_RANGE.max}
                value={inchesValue}
                onChange={(event) => handleFeetInchesChange(feetValue, event.target.value)}
                placeholder="11"
                className="w-7 bg-transparent text-left outline-none onboarding-date-input"
              />
              <span className="text-[12px] text-current/80">in</span>
            </div>
          )}
        </div>
        <div className="flex w-[68px] flex-shrink-0 items-center justify-end gap-1">
          {["cm", "ft"].map((option) => {
            const selected = unit === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleUnitChange(option)}
                className={`rounded-md border px-2 py-0.5 text-[11px] font-medium transition-all ${selected ? "onboarding-control border-current/40 bg-white/12" : "border-transparent bg-transparent"}`}
                data-selected={selected ? "true" : "false"}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
