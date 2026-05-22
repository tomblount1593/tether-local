import { useState } from "react";
import { Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UPGRADE_OPTIONS = {
  core: [
    { id: "cocktail", name: "Cocktail / Mocktail Bar", summary: "A relaxed setting with a little more atmosphere", price: "£15 each", note: "Alcohol & non-alcohol options available", tag: null },
    { id: "dinner", name: "Casual Dinner", summary: "Something to linger over — low pressure, good conversation", price: "£40 each", note: null, tag: null },
  ],
  premium: [
    { id: "cocktail", name: "Cocktail / Mocktail Bar", summary: "Member rate — a more curated first impression", price: "£10 each", note: "Discounted from £15 standard", tag: "Premium rate" },
    { id: "dinner", name: "Dinner", summary: "A natural next step — relaxed, unhurried", price: "£30 each", note: "Standard price £40", tag: "Member discount" },
  ],
  concierge: [
    { id: "cocktail", name: "Cocktail / Mocktail", summary: "Included with your membership — just show up", price: "Included", note: "Alcohol & non-alcohol available", tag: "Included" },
    { id: "dinner", name: "Dinner Upgrade", summary: "A more considered evening together", price: "£50 extra", note: "Dietary requirements captured on selection", tag: "Curated upgrade", requiresDietary: true },
  ],
};

const TIER_STYLE = {
  core: {
    banner: "bg-secondary/50 border-border",
    bannerText: "text-foreground",
    subText: "text-muted-foreground",
    icon: "text-foreground",
    chevron: "text-muted-foreground",
    expanded: "bg-secondary/60 border-border",
    optionBg: "bg-card border-border",
    optionSelected: "border-primary bg-primary text-primary-foreground",
    tagBg: "bg-muted text-muted-foreground",
    priceBg: "bg-primary/10 text-primary",
    divider: "border-border",
  },
  premium: {
    banner: "bg-[#737973] border-[#3d4f45]",
    bannerText: "text-[#EEE7DA]",
    subText: "text-[rgba(248,243,241,0.84)]",
    icon: "text-[#d8c6ae]",
    chevron: "text-[rgba(248,243,241,0.84)]",
    expanded: "bg-[#37423a] border-[rgba(248,243,241,0.24)]",
    optionBg: "bg-[#37423a] border-[rgba(248,243,241,0.24)]",
    optionSelected: "border-[#f8f3f1] bg-[#f8f3f1]",
    tagBg: "bg-[rgba(216,198,174,0.18)] text-[#d8c6ae]",
    priceBg: "bg-[rgba(216,198,174,0.18)] text-[#d8c6ae]",
    divider: "border-[rgba(248,243,241,0.24)]",
  },
  concierge: {
    banner: "bg-[#242623] border-[rgba(210,198,178,0.30)]",
    bannerText: "text-[#d2c6b2]",
    subText: "text-[rgba(210,198,178,0.78)]",
    icon: "text-[#d2c6b2]",
    chevron: "text-[rgba(210,198,178,0.78)]",
    expanded: "bg-[#242623] border-[rgba(210,198,178,0.30)]",
    optionBg: "bg-[#242623] border-[rgba(210,198,178,0.30)]",
    optionSelected: "border-[#d0c7b4] bg-[#d0c7b4]",
    tagBg: "bg-[rgba(210,198,178,0.18)] text-[#d2c6b2]",
    priceBg: "bg-[rgba(210,198,178,0.18)] text-[#d2c6b2]",
    divider: "border-[rgba(210,198,178,0.30)]",
  },
};

export default function UpgradeDateBanner({ tier = "core", centered = false, bannerBackgroundOverride = null }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [dietaryOpen, setDietaryOpen] = useState(false);
  const [dietary, setDietary] = useState("");

  const normalizedTier = tier === "standard" ? "core" : tier;
  const options = UPGRADE_OPTIONS[normalizedTier] || UPGRADE_OPTIONS.core;
  const s = TIER_STYLE[normalizedTier] || TIER_STYLE.core;
  const isConcierge = tier === "concierge";
  const isStandard = normalizedTier === "core";
  const confirmButtonClass =
    tier === "concierge"
      ? "btn-hover-dark w-full min-h-[42px] rounded-full bg-[#d2c6b2] px-4 py-2 text-sm font-semibold text-[#242623] disabled:opacity-50"
      : "btn-hover-dark w-full min-h-[42px] rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50";

  const handleSelect = (opt) => {
    setSelected(opt.id);
    if (opt.requiresDietary) setDietaryOpen(true);
    else setDietaryOpen(false);
  };

  return (
    <div className={`border-t ${s.divider}`}>
      {/* Collapsed banner */}
      <button
        onClick={() => setOpen(!open)}
        className={`btn-hover-mid relative w-full px-4 py-2.5 transition-all ${s.banner} border-b ${s.divider}`}
        style={bannerBackgroundOverride ? { background: bannerBackgroundOverride } : undefined}
      >
        <div className="w-full">
          <div className={`grid grid-cols-[1fr_auto_1fr] items-center min-h-[24px] ${s.bannerText}`}>
            <div className="flex justify-end pr-2">
              <Sparkles className={`w-3.5 h-3.5 flex-shrink-0 ${s.icon}`} />
            </div>
            <p className="font-heading font-bold text-base leading-tight text-center">Upgrade your Date</p>
            <div className="flex justify-start pl-2">
              {selected && <Check className={`w-3.5 h-3.5 ${s.icon}`} />}
            </div>
          </div>
          <div className="text-center">
            <p className={`text-xs font-body mt-0.5 ${s.subText}`}>
              {selected ? `${options.find(o => o.id === selected)?.name} selected` : "Choose a more curated setting"}
            </p>
          </div>
        </div>
      </button>

      {/* Expanded options */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className={`px-4 py-3 space-y-2.5 ${s.expanded}`}>
              {options.map((opt) => (
                (() => {
                  const isSelected = selected === opt.id;
                  const selectedOptionClass = isConcierge
                    ? "border-[#d0c7b4] bg-[#d0c7b4] text-[#0b0c0a]"
                    : isStandard
                      ? s.optionSelected
                      : "border-[#f8f3f1] bg-[#f8f3f1] text-[#242623]";
                  const selectedTitleClass = isConcierge
                    ? "text-[#0b0c0a]"
                    : isStandard
                      ? "text-primary-foreground"
                      : "text-[#242623]";
                  const selectedBodyClass = isConcierge
                    ? "text-[rgba(11,12,10,0.82)]"
                    : isStandard
                      ? "text-[rgba(248,243,241,0.88)]"
                      : "text-[rgba(36,38,35,0.78)]";
                  const selectedNoteClass = isConcierge
                    ? "text-[rgba(11,12,10,0.74)]"
                    : isStandard
                      ? "text-[rgba(248,243,241,0.78)]"
                      : "text-[rgba(36,38,35,0.70)]";
                  const priceClass = isSelected && isStandard
                    ? "bg-[#d9d6d1] text-[#37423a]"
                    : s.priceBg;
                  return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left rounded-xl border p-3 transition-all ${isSelected ? selectedOptionClass : `btn-hover-light ${s.optionBg}`}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`font-heading font-bold text-base leading-tight ${isSelected ? selectedTitleClass : s.bannerText}`}>{opt.name}</p>
                        {opt.tag && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${s.tagBg}`}>{opt.tag}</span>
                        )}
                      </div>
                      <p className={`text-xs font-body mt-1 leading-snug ${isSelected ? selectedBodyClass : s.subText}`}>{opt.summary}</p>
                      {opt.note && <p className={`text-[11px] font-body mt-1 leading-snug ${isSelected ? selectedNoteClass : s.subText}`}>{opt.note}</p>}
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${priceClass}`}>{opt.price}</span>
                  </div>
                </button>
                  );
                })()
              ))}

              {/* Dietary requirements for Concierge dinner */}
              <AnimatePresence>
                {dietaryOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <div className={`rounded-xl border p-3 ${s.optionBg}`}>
                      <p className={`font-heading font-bold text-base mb-1 ${s.bannerText}`}>Dietary Requirements</p>
                      <p className={`text-xs font-body mb-2 ${s.subText}`}>Let us know so we can choose the right venue.</p>
                      <textarea
                        value={dietary}
                        onChange={(e) => setDietary(e.target.value)}
                        placeholder="Any dietary needs or preferences..."
                        rows={2}
                        className={`w-full text-xs rounded-lg border px-3 py-2 resize-none bg-transparent outline-none ${s.divider} ${s.bannerText} placeholder:opacity-40`}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <button
                type="button"
                disabled={!selected}
                className={confirmButtonClass}
              >
                Confirm Date Upgrade
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
