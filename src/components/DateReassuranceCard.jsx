import { ShieldCheck } from "lucide-react";
import { MEMBERSHIP_CHAT_OPEN_COPY } from "@/data/demo/dateUpgradeOptions";

export default function DateReassuranceCard({ membershipTier, onViewChatOptions, showConfidenceBanner }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3.5 space-y-3">
      <div className="text-center">
        <h3 className="font-heading font-bold text-base">Worried about the date?</h3>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          First dates can feel like a lot — we’ve got you. Your match is verified, and chat opens before the date so you can get a feel for each other first.
        </p>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          If something feels off after chatting or a video call, you can cancel or reschedule. We use what we learn to support better matches next time.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-background p-3 text-center">
        <p className="text-sm font-semibold leading-snug">{MEMBERSHIP_CHAT_OPEN_COPY[membershipTier] || MEMBERSHIP_CHAT_OPEN_COPY.standard}</p>
      </div>

      {showConfidenceBanner && (
        <div className="rounded-xl border border-primary/30 bg-primary/10 p-3">
          <p className="text-sm font-semibold flex items-center gap-2"><ShieldCheck className="w-4 h-4" />Date Confidence Check</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Cancelling 3 dates before attending one triggers a quick confidence check so we can help with better pacing.</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground leading-relaxed text-center">
        After your date, we’ll ask for brief private feedback on chemistry, ease, attraction, and whether you’d meet again.
      </p>

      <button type="button" onClick={onViewChatOptions} className="block w-full rounded-full border border-border bg-[#e7e5e1] px-5 py-2.5 text-xs font-semibold text-center">
        View chat options
      </button>
    </div>
  );
}
