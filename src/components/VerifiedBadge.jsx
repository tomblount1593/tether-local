import { ShieldCheck } from "lucide-react";

export default function VerifiedBadge({ size = "sm" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="inline-flex items-center gap-1 text-foreground/90">
      <ShieldCheck className={sizes[size]} />
      {size !== "sm" && (
        <span className="text-xs font-body font-semibold">Verified</span>
      )}
    </div>
  );
}
