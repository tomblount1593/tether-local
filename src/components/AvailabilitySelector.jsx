
const SLOTS = [
  { id: "weekday_eve", label: "Weekday evenings", group: "Weekdays" },
  { id: "weekday_day", label: "Weekday daytime", group: "Weekdays" },
  { id: "fri_eve", label: "Friday evening", group: "Weekends" },
  { id: "sat_day", label: "Saturday daytime", group: "Weekends" },
  { id: "sat_eve", label: "Saturday evening", group: "Weekends" },
  { id: "sun_day", label: "Sunday daytime", group: "Weekends" },
  { id: "sun_eve", label: "Sunday evening", group: "Weekends" },
];

export default function AvailabilitySelector({ value = [], onChange }) {
  const toggle = (id) => {
    if (value.includes(id)) onChange(value.filter((x) => x !== id));
    else onChange([...value, id]);
  };

  const groups = [...new Set(SLOTS.map((s) => s.group))];

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group}>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{group}</p>
          <div className="flex flex-wrap gap-2">
            {SLOTS.filter((s) => s.group === group).map((slot) => {
              const sel = value.includes(slot.id);
              return (
                <button
                  key={slot.id}
                  onClick={() => toggle(slot.id)}
                  className="py-2 px-3.5 rounded-full text-sm font-medium border transition-all"
                  style={{
                    background: sel ? "hsl(var(--primary))" : "hsl(var(--secondary))",
                    color: sel ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))",
                    borderColor: sel ? "hsl(var(--primary))" : "transparent",
                  }}
                >
                  {slot.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}