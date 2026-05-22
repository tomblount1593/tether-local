import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCurrentBookingMatch } from "@/hooks/useCurrentBookingMatch";
import BackButton from "@/components/BackButton";
import { getMatchesRoute } from "@/lib/matchFlowRoutes";

export default function PostDateFeedback() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { match, booking } = useCurrentBookingMatch(bookingId, "post-date-feedback");
  const [chemistry, setChemistry] = useState(4);
  const [ease, setEase] = useState(4);
  const [wouldMeetAgain, setWouldMeetAgain] = useState("yes");
  const [notes, setNotes] = useState("");
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);
  if (!match) return null;

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background px-4 py-6 space-y-4">
      <div className="flex items-center gap-2">
        <BackButton />
        <h1 className="font-heading font-bold text-xl">Post-Date Feedback</h1>
      </div>
      <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
        <img src={match.photoPath} alt={match.displayName} className="w-14 h-14 rounded-full object-cover" />
        <div>
          <p className="font-semibold">{match.displayName}, {match.age}</p>
          <p className="text-xs text-muted-foreground">{booking?.selectedLocation?.label || `${match.firstDateSuggestion?.venueName} · ${match.firstDateSuggestion?.neighbourhood}`}</p>
          <p className="text-xs text-muted-foreground mt-1">{booking?.selectedDate || "Date"} · {booking?.selectedTime || "19:00"}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
        <p className="text-sm font-medium">How did it feel in real life?</p>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setChemistry(n)} className={`rounded-lg py-2 text-sm border ${chemistry === n ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>Chem {n}</button>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={`ease-${n}`} onClick={() => setEase(n)} className={`rounded-lg py-2 text-sm border ${ease === n ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>Ease {n}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setWouldMeetAgain("yes")} className={`rounded-lg py-2 text-sm border ${wouldMeetAgain === "yes" ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>Would meet again</button>
          <button type="button" onClick={() => setWouldMeetAgain("no")} className={`rounded-lg py-2 text-sm border ${wouldMeetAgain === "no" ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>Not this one</button>
        </div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Anything you want us to learn for better matching?" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" />
      </div>
      <Button className="w-full rounded-full" onClick={() => navigate(getMatchesRoute(location.pathname))}>Submit Feedback</Button>
    </div>
  );
}
