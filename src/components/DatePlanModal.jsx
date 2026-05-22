import { useState } from "react";
import { localApp } from "@/api/localClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

const AVAILABILITY_OPTIONS = [
  { value: "weekday_evening", label: "Weekday Evening" },
  { value: "weekend_morning", label: "Weekend Morning" },
  { value: "weekend_afternoon", label: "Weekend Afternoon" },
  { value: "weekend_evening", label: "Weekend Evening" },
  { value: "flexible", label: "I'm Flexible" },
];

export default function DatePlanModal({ open, onOpenChange, matchId }) {
  const [availability, setAvailability] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!availability) return;
    setSending(true);

    const user = await localApp.auth.me();
    await localApp.entities.DatePlan.create({
      match_id: matchId,
      proposed_by: user.email,
      availability,
      suggested_location: location,
      notes,
    });

    await localApp.entities.Message.create({
      match_id: matchId,
      sender_email: user.email,
      content: `📅 I'd love to plan a date! I'm free ${AVAILABILITY_OPTIONS.find(o => o.value === availability)?.label || availability}${location ? ` — how about ${location}?` : ""}${notes ? ` ${notes}` : ""}`,
      message_type: "date_plan",
    });

    setSending(false);
    onOpenChange(false);
    toast.success("Date plan sent!");
    setAvailability("");
    setLocation("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Plan a Date</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              <Calendar className="w-3.5 h-3.5 inline mr-1" />
              When are you free?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABILITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setAvailability(opt.value)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all ${
                    availability === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              <MapPin className="w-3.5 h-3.5 inline mr-1" />
              Suggest a place (optional)
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. The Ivy, Soho"
              className="rounded-xl"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Anything else? (optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Looking forward to meeting!"
              className="rounded-xl resize-none"
              rows={2}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!availability || sending}
            className="w-full rounded-full"
          >
            <Send className="w-4 h-4 mr-2" />
            {sending ? "Sending..." : "Send Date Plan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}