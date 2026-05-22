import { Crown, Video, Phone, MessageCircle } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function PrivateChat() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="px-5 pt-8 pb-4 border-b border-border">
        <div className="mb-2">
          <BackButton />
        </div>
        <div className="flex items-center gap-2 mb-1">
          <Crown className="w-4 h-4" style={{ color: "#CBB9A3" }} />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Concierge Service</span>
        </div>
        <h1 className="text-2xl font-heading font-bold">Private Expert Chat</h1>
        <p className="text-sm text-muted-foreground mt-1">Direct access to your personal dating expert — video calls, match guidance, and curated support.</p>
      </div>

      {/* Expert card */}
      <div className="px-5 py-5">
        <div className="rounded-2xl border border-border overflow-hidden" style={{ background: "hsl(var(--card))" }}>
          <div className="flex items-center gap-4 px-4 py-4 border-b border-border">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#CBB9A3" }}>
              <Crown className="w-6 h-6" style={{ color: "#141916" }} />
            </div>
            <div>
              <p className="font-heading font-bold text-base">Your Tether Expert</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-xs text-muted-foreground">Available now</span>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your dedicated Tether expert is here to review your matches, offer guidance, and help curate the strongest introductions for you. All sessions are private and confidential.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold active:scale-95 transition-all"
                style={{ background: "#CBB9A3", color: "#141916" }}
              >
                <Video className="w-4 h-4" />
                Video Call
              </button>
              <button
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold active:scale-95 transition-all border border-border"
                style={{ color: "hsl(var(--foreground))" }}
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </button>
            </div>
          </div>
        </div>

        {/* What to expect */}
        <div className="mt-5 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">What your expert can help with</h2>
          {[
            { icon: Crown, text: "Review and refine your curated match shortlist" },
            { icon: Video, text: "Live video consultations to discuss your dating goals" },
            { icon: MessageCircle, text: "Personalised match reasoning and introduction support" },
            { icon: Phone, text: "Ongoing guidance throughout your Concierge journey" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3 p-3 rounded-xl border border-border" style={{ background: "hsl(var(--card))" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#CBB9A3" }}>
                <Icon className="w-3.5 h-3.5" style={{ color: "#141916" }} />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Concierge assurance */}
        <div className="mt-5 p-4 rounded-2xl" style={{ background: "#CBB9A3" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#2F3B35" }}>Concierge Guarantee</p>
          <p className="text-sm leading-relaxed" style={{ color: "#141916" }}>
            If after 2 months we haven't delivered a curated introduction you feel genuinely excited about, we'll review your account and offer a credit or extension — no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
