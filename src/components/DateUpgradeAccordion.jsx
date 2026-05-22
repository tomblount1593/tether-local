import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { getDateUpgradeConfig } from "@/data/demo/dateUpgradeOptions";

const STATUS_COPY = {
  selected_by_user: "Selected by you",
  pending_match_response: "Waiting for match",
  accepted_by_match: "Accepted — you’re both set",
  declined_by_match: "Declined — your original date stays confirmed",
  included: "Included with membership",
};

export default function DateUpgradeAccordion({
  membershipTier,
  selectedUpgradeId,
  onSelectUpgrade,
  upgradeTiming,
  onUpgradeTimingChange,
  upgradeStatus,
  embedded = false,
}) {
  const [open, setOpen] = useState(Boolean(selectedUpgradeId));
  const config = getDateUpgradeConfig(membershipTier);
  const confirmButtonClass =
    membershipTier === "concierge"
      ? "btn-hover-dark w-full min-h-[42px] rounded-full bg-[#d2c6b2] px-4 py-2 text-sm font-semibold text-[#242623] disabled:opacity-50"
      : "btn-hover-dark w-full min-h-[42px] rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50";

  return (
    <div className={embedded ? "space-y-3" : "rounded-2xl border border-border bg-card p-4"}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`relative w-full rounded-xl border border-border bg-[#e7e5e1] p-3 ${embedded ? "" : ""}`}
      >
        <div className="text-center">
          <h3 className="font-heading font-bold text-base">Upgrade your Date</h3>
          <p className="text-xs font-body text-muted-foreground">Choose a more curated setting</p>
        </div>
        <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              aria-pressed={upgradeTiming === "choose_now"}
              onClick={() => onUpgradeTimingChange("choose_now")}
              className={`rounded-xl border p-3 text-left ${upgradeTiming === "choose_now" ? "border-primary bg-primary/10" : "border-border bg-[#e7e5e1]"}`}
            >
              <p className="font-heading font-bold text-base leading-tight">Choose now</p>
              <p className="text-xs font-body text-muted-foreground mt-1 leading-snug">Choose an upgrade now and we’ll ask your match if they’d like to do the same.</p>
            </button>
            <button
              type="button"
              aria-pressed={upgradeTiming === "decide_after_confirmation"}
              onClick={() => onUpgradeTimingChange("decide_after_confirmation")}
              className={`rounded-xl border p-3 text-left ${upgradeTiming === "decide_after_confirmation" ? "border-primary bg-primary/10" : "border-border bg-[#e7e5e1]"}`}
            >
              <p className="font-heading font-bold text-base leading-tight">Decide after confirmation</p>
              <p className="text-xs font-body text-muted-foreground mt-1 leading-snug">Confirm the date first, then upgrade once you both know the plan.</p>
            </button>
          </div>

          <div className="rounded-xl border border-border p-3 bg-[#e7e5e1] text-center">
            <p className="font-heading font-bold text-base leading-tight">{config.membershipLabel}</p>
            <p className="text-xs font-body text-muted-foreground mt-1 leading-snug">{config.coreDateLabel} · {config.coreDateCost}</p>
            <p className="text-xs font-body text-muted-foreground mt-1 leading-snug">{config.discountCopy}</p>
          </div>

          {config.options.map((option) => {
            const selected = selectedUpgradeId === option.id;
            const status = option.included ? "included" : selected ? upgradeStatus || "selected_by_user" : null;
            return (
              <button
                type="button"
                key={option.id}
                aria-selected={selected}
                onClick={() => onSelectUpgrade(option.id)}
                className={`w-full rounded-xl border px-3 py-3 text-left transition-colors ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-[#e7e5e1] text-foreground"}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-heading font-bold text-base leading-tight">{option.name}</p>
                  <span className="text-xs font-semibold">{option.costLabel}</span>
                </div>
                <p className={`text-xs font-body mt-1 leading-snug ${selected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{option.description}</p>
                <p className={`text-[11px] font-body mt-1 leading-snug ${selected ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{option.note}</p>
                {status ? (
                  <p className={`text-[11px] mt-2 font-semibold ${selected ? "text-primary-foreground" : "text-foreground"}`}>{STATUS_COPY[status]}</p>
                ) : null}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => {
              if (selectedUpgradeId) onUpgradeTimingChange("choose_now");
            }}
            disabled={!selectedUpgradeId}
            className={confirmButtonClass}
          >
            Confirm Date Upgrade
          </button>
        </div>
      )}
    </div>
  );
}
