import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Minimal, elegant back arrow for secondary pages.
 * Sits top-left above the page title — colour matches the page's text tone.
 */
export default function BackButton({ color, onClick }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={onClick || (() => navigate(-1))}
      aria-label="Go back"
      className="flex items-center justify-center w-8 h-8 rounded-full transition-all active:scale-95 flex-shrink-0"
      style={{ color: color || "hsl(var(--muted-foreground))" }}
    >
      <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
    </button>
  );
}