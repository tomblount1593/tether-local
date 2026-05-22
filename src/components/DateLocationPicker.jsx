import { useMemo, useState } from "react";
import { MapPin, Search, X } from "lucide-react";
import { dateLocations } from "@/data/demo/dateLocations";

export default function DateLocationPicker({ isOpen, onClose, onSelect, selectedLocation }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return dateLocations;
    return dateLocations.filter((loc) => `${loc.label} ${loc.area} ${loc.name}`.toLowerCase().includes(needle));
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/45 flex items-end sm:items-center sm:justify-center" role="dialog" aria-modal="true" aria-label="Choose a London location">
      <div className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border border-border bg-card p-4 max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-lg">Choose a London location</h3>
          <button type="button" onClick={onClose} aria-label="Close location picker" className="rounded-full p-1 border border-border">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="rounded-xl border border-border bg-background px-3 py-2 flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            aria-label="Search neighbourhood or venue"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search neighbourhood or venue"
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
        <div className="space-y-2">
          {results.map((location) => {
            const active = selectedLocation?.id === location.id;
            return (
              <button
                type="button"
                key={location.id}
                onClick={() => {
                  onSelect(location);
                  onClose();
                }}
                className={`w-full text-left rounded-xl border p-3 ${active ? "border-primary bg-primary/10" : "border-border bg-background"}`}
              >
                <p className="font-semibold text-sm flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {location.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{location.type === "venue" ? "Venue" : "Area"} · London only</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
