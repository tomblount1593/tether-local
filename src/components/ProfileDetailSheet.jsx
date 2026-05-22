import { useState } from "react";
import { ArrowLeft, ShieldCheck, MapPin, Heart, X, Sparkles } from "lucide-react";
import { useTier } from "../hooks/useTier";
import { motion, AnimatePresence } from "framer-motion";
import CompatibilityScoreBadge from "./CompatibilityScoreBadge";
import { MATCHES_REFERENCE } from "@/constants/matchesReference";

const getRichData = (profileId) => {
  const richProfiles = {
    "std-1": {
      profession: "Investment Banking",
      education: "LSE",
      height: "6'0\"",
      languages: ["English", "Spanish"],
      distance: null,
      whoHeIs: "Patient, deliberate, and genuinely interested in understanding people.",
      fitBanner: "Strong alignment on values, lifestyle pace, and what you both want from a partnership.",
      fitHighlights: ["Values alignment", "Lifestyle fit", "Long-term intent"],
      whatMattersMost: [
        "Loyalty and consistency",
        "Intellectual and emotional depth",
        "Ability to communicate and resolve conflict",
        "Shared sense of humour and perspective",
        "Physical attraction that's real, not forced",
      ],
      sections: {
        type: {
          title: "Personality & Presentation",
          summary: "Warm, cerebral, confident without being loud.",
          details: [
            "Describes himself with quiet confidence",
            "Values substance in conversation",
            "Thoughtful about his values and lifestyle",
          ],
          viewerNote: "You both appreciate depth and substance.",
          physical: false,
        },
        romantic: {
          title: "Romantic Pattern & Intent",
          summary: "Serious about finding something real.",
          details: ["Looking for genuine partnership", "Long-term oriented", "Values emotional connection"],
          viewerNote: "Your intents align — both seeking serious partnership.",
          physical: false,
        },
        values: {
          title: "Values & Life Direction",
          summary: "Career-focused but life-balanced.",
          details: ["Ambitious but deliberate", "Values time with people who matter", "Seeks meaning beyond work"],
          viewerNote: "Similar balance between ambition and living well.",
          physical: false,
        },
        lifestyle: {
          title: "Lifestyle & Social Scene",
          summary: "Moderately social, quality-focused.",
          details: ["Good restaurants and travel", "Close friends more than broad social circles", "Intentional about how he spends time"],
          viewerNote: "Your lifestyle rhythms match.",
          physical: false,
        },
        presentation: {
          title: "Self-Presentation & Openness",
          summary: "Comfortable and direct.",
          details: ["Fully out and comfortable", "Authentic in how he presents himself", "No gap between private and public self"],
          viewerNote: "Both equally comfortable in your own skin.",
          physical: false,
        },
      },
      personalityCard: {
        label: "What comes through",
        text: "Someone who values depth and authenticity. You get the sense that there's thought behind his choices, and that he's genuinely interested in understanding the people around him. He's not trying to be anything other than what he is.",
      },
    },
    "std-2": {
      profession: "Marketing Leadership",
      education: "Cambridge",
      height: "5'11\"",
      languages: ["English", "French"],
      distance: null,
      whoHeIs: "Energetic, ambitious, and genuinely kind.",
      fitBanner: "High compatibility on energy, life direction, and the kind of lifestyle you both build.",
      fitHighlights: ["Energy match", "Ambition aligned", "Lifestyle overlap"],
      whatMattersMost: [
        "Mutual respect and shared ambition",
        "Physical attraction and chemistry",
        "Active, engaged lifestyle together",
        "Good humour and ease",
        "Building something real",
      ],
      sections: {
        type: {
          title: "Personality & Presentation",
          summary: "Warm, ambitious, socially confident.",
          details: [
            "Natural leader without being domineering",
            "Genuine interest in others",
            "Balanced between confidence and kindness",
          ],
          viewerNote: "Similar energy and social warmth.",
          physical: false,
        },
        romantic: {
          title: "Romantic Pattern & Intent",
          summary: "Looking for a real relationship.",
          details: ["Serious about partnership", "Values equality and mutual growth", "Ready for commitment"],
          viewerNote: "Both seeking genuine connection.",
          physical: false,
        },
        values: {
          title: "Values & Life Direction",
          summary: "Career-driven with strong personal values.",
          details: ["Ambitious in his field", "Values loyalty and integrity", "Seeks meaningful impact"],
          viewerNote: "Shared values on ambition and authenticity.",
          physical: false,
        },
        lifestyle: {
          title: "Lifestyle & Social Scene",
          summary: "Active, social, quality-focused.",
          details: ["Enjoys dining out and travel", "Strong friend group and community", "Balance between socialising and quieter time"],
          viewerNote: "Lifestyle rhythms are compatible.",
          physical: false,
        },
        presentation: {
          title: "Self-Presentation & Openness",
          summary: "Fully out and unapologetic.",
          details: ["Comfortable across all circles", "Authentic in self-presentation", "No compartmentalising"],
          viewerNote: "Both equally grounded in yourself.",
          physical: false,
        },
      },
      personalityCard: {
        label: "What comes through",
        text: "Someone who knows who he is and isn't trying to be anything else. Ambitious but not at the expense of kindness. The kind of person who makes others around him feel valued.",
      },
    },
    "prm-1": {
      profession: "Architecture",
      education: "Yale",
      height: "5'10\"",
      languages: ["English", "Italian", "German"],
      distance: "28 miles",
      whoHeIs: "Thoughtful, creative, and deeply interested in how the world works.",
      fitBanner: "Exceptionally strong compatibility across cultural outlook, emotional depth, and relationship vision.",
      fitHighlights: ["Cultural & intellectual alignment", "Emotional depth match", "Long-term vision aligned"],
      whatMattersMost: [
        "Deep conversation and intellectual curiosity",
        "Shared appreciation for beauty and craft",
        "Emotional authenticity and presence",
        "Building something meaningful together",
        "Genuine chemistry and physical attraction",
      ],
      sections: {
        type: {
          title: "Personality & Presentation",
          summary: "Thoughtful, artistic, grounded.",
          details: [
            "Interested in how things are made",
            "Contemplative about design and meaning",
            "Comfortable in quiet as well as social",
          ],
          viewerNote: "Shared appreciation for substance and thoughtfulness.",
          physical: false,
        },
        romantic: {
          title: "Romantic Pattern & Intent",
          summary: "Intentional about lasting partnership.",
          details: ["Seeks considered relationship", "Values depth and presence", "Long-term oriented"],
          viewerNote: "Both building with intention.",
          physical: false,
        },
        values: {
          title: "Values & Life Direction",
          summary: "Values beauty, craft, and meaning.",
          details: ["Interested in how things are designed and made", "Values quality over quantity", "Seeks purposeful work"],
          viewerNote: "Similar values on meaning and authenticity.",
          physical: false,
        },
        lifestyle: {
          title: "Lifestyle & Social Scene",
          summary: "Thoughtful, low-key, culturally engaged.",
          details: ["Values culture and travel", "Prefers depth in friendships over broad social circles", "Appreciates both solitude and connection"],
          viewerNote: "Complementary lifestyles.",
          physical: false,
        },
        presentation: {
          title: "Self-Presentation & Openness",
          summary: "Authentic and grounded.",
          details: ["Fully out and comfortable", "Genuine in all contexts", "No pretence"],
          viewerNote: "Both equally authentic.",
          physical: false,
        },
      },
      personalityCard: {
        label: "What comes through",
        text: "Someone with a genuine eye for beauty and substance. The kind of person who makes you think differently about the world. Serious about what matters, but never heavy-handed about it.",
      },
    },
  };

  return richProfiles[profileId] || null;
};

function SectionCard({ title, summary, details, viewerNote, physical }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left rounded-2xl border border-border bg-card overflow-hidden transition-all"
    >
      <div className="px-5 py-2.5 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p
            className="font-heading font-bold text-center"
            style={{ ...MATCHES_REFERENCE.insightTitleStyle }}
          >
            {title}
          </p>
          <p
            className="mt-1 font-body text-muted-foreground text-center"
            style={MATCHES_REFERENCE.insightSecondaryStyle}
          >
            {summary}
          </p>
        </div>
        <div className="text-xs font-semibold text-muted-foreground flex-shrink-0 mt-0.5">
          {expanded ? "−" : "+"}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border px-5 py-3 space-y-3 bg-card/50">
              {details && details.length > 0 && (
                <div className="space-y-2">
                  {details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <p className="text-xs text-foreground leading-relaxed">{detail}</p>
                    </div>
                  ))}
                </div>
              )}

              {viewerNote && (
                <div className="rounded-lg bg-primary/10 px-3 py-2 border border-primary/20">
                  <p className="text-xs text-foreground italic">{viewerNote}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

export default function ProfileDetailSheet({ profile, score, reason, topMarkers, outOfRange, onLike, onPass, onClose }) {
  const { tier } = useTier();
  if (!profile) return null;

  const rich = getRichData(profile.id);
  const rawPhotos = profile.photos || [];
  const photos = Array.isArray(rawPhotos) ? rawPhotos.filter(Boolean) : [rawPhotos].filter(Boolean);
  const singlePhoto = photos[0] || null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto bg-background rounded-t-3xl overflow-hidden"
        style={{ maxHeight: "95vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "calc(95vh - 120px)" }}>
          {/* Clean hero image */}
          <div className="w-full rounded-t-3xl overflow-hidden bg-card border-b border-border">
            <div className="relative aspect-[3/4] overflow-hidden">
              <button
                type="button"
                onClick={onClose}
                aria-label="Go back"
                className="absolute top-4 left-4 z-10 h-10 w-10 rounded-full border border-white/45 bg-white/88 text-[rgba(255,255,255,0.92)] backdrop-blur-md shadow-[0_6px_18px_rgba(0,0,0,0.20)] inline-flex items-center justify-center transition-colors hover:bg-white/92 active:bg-white/95"
              >
                <ArrowLeft className="w-5 h-5 opacity-100" strokeWidth={2.75} />
              </button>
              <img src={singlePhoto} alt={profile.display_name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Key information banner */}
          <div className="px-5 py-4 border-b border-border bg-card">
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className={MATCHES_REFERENCE.primaryTextClass}>{profile.display_name}, {profile.age}</h2>
                  {profile.is_verified && <ShieldCheck className="w-5 h-5" style={{ color: "#CBB9A3" }} />}
                </div>
                <div className={`flex items-center gap-1.5 ${MATCHES_REFERENCE.secondaryTextClass}`}>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{profile.location}</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <CompatibilityScoreBadge score={score} size="md" tier={tier} />
              </div>
            </div>
          </div>

          {rich ? (
            <div className="px-4 pt-4 pb-2 space-y-4">
              {/* Why we think this is a strong fit */}
              <div className="rounded-2xl overflow-hidden bg-primary">
                <div className="px-5 py-3.5">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-primary-foreground/60" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-foreground/60">Tether Match Insight</span>
                  </div>
                  <p
                    className="font-heading font-bold text-primary-foreground text-center"
                    style={MATCHES_REFERENCE.insightTitleStyle}
                  >
                    Why we think this is a strong fit
                  </p>
                  <p
                    className="mt-1 font-body text-primary-foreground/80 text-center"
                    style={MATCHES_REFERENCE.insightSecondaryStyle}
                  >
                    {rich.fitBanner}
                  </p>
                </div>
                <div className="border-t border-primary-foreground/10 px-5 py-3 flex flex-wrap justify-center gap-2">
                  {rich.fitHighlights.map((h) => (
                    <span key={h} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-primary-foreground/15 text-primary-foreground">{h}</span>
                  ))}
                </div>
              </div>

              {/* Essential details */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-3 border-b border-border text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">About {profile.display_name}</p>
                </div>
                <div className="px-5 py-4 grid grid-cols-2 gap-3">
                  {[
                    { label: "Profession", value: rich.profession },
                    { label: "Education", value: rich.education },
                    { label: "Height", value: rich.height },
                    { label: "Languages", value: rich.languages?.join(", ") },
                    { label: "Relationship intent", value: profile.intent === "relationship" ? "Serious relationship" : profile.intent === "dating" ? "Dating" : "Open to possibilities" },
                    { label: "Structure", value: profile.relationship_structure?.replace(/_/g, " ") || "—" },
                  ].filter(f => f.value).map(({ label, value }) => (
                    <div key={label} className={`${label === "Profession" || label === "Education" || label === "Relationship intent" || label === "Structure" ? "col-span-2" : ""} text-center`}>
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">{label}</p>
                      <p className="text-xs font-medium text-foreground leading-snug capitalize">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Who He Is */}
              <div className="rounded-2xl border border-border bg-card px-5 py-4 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Who He Is</p>
                <p className="text-sm leading-relaxed text-foreground font-heading italic">"{rich.whoHeIs}"</p>
              </div>

              {/* What Matters Most */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="px-5 pt-4 pb-2 border-b border-border text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">What Matters Most to {profile.display_name}</p>
                </div>
                <div className="px-5 py-4 space-y-2.5">
                  {rich.whatMattersMost.map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <p className="text-sm text-foreground leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5 Compatibility sections */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">Compatibility Profile — tap to explore</p>
                <div className="space-y-2">
                  {Object.values(rich.sections).map((s) => (
                    <SectionCard key={s.title} title={s.title} summary={s.summary} details={s.details} viewerNote={s.viewerNote} physical={s.physical} />
                  ))}
                </div>
              </div>

              {/* Personality card */}
              {rich?.personalityCard && (
                <div className="rounded-2xl border border-border bg-card px-5 py-5 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">{rich.personalityCard.label}</p>
                  <p className="text-sm font-heading italic leading-relaxed text-foreground">"{rich.personalityCard.text}"</p>
                </div>
              )}

              {/* Compatibility note */}
              <div className="rounded-2xl border border-border bg-card px-5 py-4 text-center">
                <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                  You can see your full compatibility breakdown once you are a match.
                </p>
              </div>

              <div className="h-2" />
            </div>
          ) : (
            <div className="px-4 pt-4 pb-2 space-y-4">
              {/* Fallback for non-rich profiles */}
              <div className="rounded-2xl px-4 py-3.5 bg-primary">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-primary-foreground/60" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-foreground/60">Tether Match Insight</span>
                </div>
                <p
                  className="font-heading font-bold text-primary-foreground text-center"
                  style={MATCHES_REFERENCE.insightTitleStyle}
                >
                  Why we think this is a strong fit
                </p>
                <p
                  className="mt-1 font-body text-primary-foreground/80 text-center"
                  style={MATCHES_REFERENCE.insightSecondaryStyle}
                >
                  {reason}
                </p>
                {topMarkers?.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                    {topMarkers.map((m) => (
                      <span key={m} className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-primary-foreground/15 text-primary-foreground">{m}</span>
                    ))}
                  </div>
                )}
              </div>

              {profile.bio && (
                <div className="rounded-2xl border border-border bg-card px-5 py-4 text-center">
                  <p className="text-sm text-foreground leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Additional photos gallery */}
              {photos.length > 1 && (
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">More Photos</p>
                  <div className="space-y-3">
                    {photos.slice(1).map((photo, i) => (
                      <div key={i} className="rounded-2xl overflow-hidden h-80">
                        <img src={photo} alt={`${profile.display_name} photo ${i + 2}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-border bg-card px-5 py-4 text-center">
                <p className="text-[11px] text-muted-foreground italic leading-relaxed">
                  You can see your full compatibility breakdown once you are a match.
                </p>
              </div>

              <div className="h-2" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border flex items-center gap-3 flex-shrink-0 bg-background">
          <button onClick={onPass} className="btn-hover-light flex-1 h-12 rounded-xl border-2 border-border flex items-center justify-center gap-2 text-muted-foreground transition-all active:scale-95">
            <X className="w-5 h-5" />
            <span className="text-sm font-medium">Pass</span>
          </button>
          <button onClick={onLike} className="btn-hover-dark flex-1 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2 transition-all active:scale-95">
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">Interested</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
