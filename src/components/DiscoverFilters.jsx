import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal } from "lucide-react";

const INTENTS = [
  { v: "", l: "Any intent" },
  { v: "relationship", l: "Relationship" },
  { v: "dating", l: "Dating" },
  { v: "open", l: "Open" },
];

const SCENES = [
  { v: "", l: "Any scene" },
  { v: "low_key", l: "Low-key" },
  { v: "moderately_social", l: "Social" },
  { v: "very_scene", l: "Scene-focused" },
];

const STRUCTURES = [
  { v: "", l: "Any structure" },
  { v: "monogamous", l: "Monogamous" },
  { v: "prefer_monogamy", l: "Prefer mono" },
  { v: "open_to_either", l: "Open to either" },
];

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(({ v, l }) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border"
            style={{
              background: value === v ? "hsl(var(--primary))" : "transparent",
              color: value === v ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
              borderColor: value === v ? "hsl(var(--primary))" : "hsl(var(--border))",
            }}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DiscoverFilters({ filters, onChange, onClose }) {
  const hasActiveFilters = filters.intent || filters.scene_level || filters.relationship_structure;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto rounded-t-3xl bg-card border-t border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>
        <div className="px-5 pb-8 pt-3">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <h3 className="font-heading font-bold text-base">Filter Matches</h3>
            </div>
            <button onClick={onClose} className="text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-5">
            <FilterGroup
              label="Looking for"
              options={INTENTS}
              value={filters.intent}
              onChange={(v) => onChange({ ...filters, intent: v })}
            />
            <FilterGroup
              label="Scene level"
              options={SCENES}
              value={filters.scene_level}
              onChange={(v) => onChange({ ...filters, scene_level: v })}
            />
            <FilterGroup
              label="Relationship structure"
              options={STRUCTURES}
              value={filters.relationship_structure}
              onChange={(v) => onChange({ ...filters, relationship_structure: v })}
            />

            <div className="flex gap-3 pt-1">
              {hasActiveFilters && (
                <button
                  onClick={() => onChange({ intent: "", scene_level: "", relationship_structure: "" })}
                  className="flex-1 py-3 rounded-xl text-sm font-medium border border-border text-muted-foreground"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-semibold bg-primary text-primary-foreground"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}