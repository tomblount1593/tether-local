import { useState } from "react";
import { Heart, X, MapPin, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ProfilePhotoCarousel from "./ProfilePhotoCarousel";
import VerifiedBadge from "./VerifiedBadge";
import PromptCard from "./PromptCard";
import CompatibilityScoreBadge from "./CompatibilityScoreBadge";

export default function DailyMatchCard({ profile, compatibilityScore, compatHints, topMarkers = [], aiPowered = false, outOfRange = null, onLike, onPass, index = 0 }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-card rounded-3xl overflow-hidden shadow-sm border border-border"
    >
      {/* Out of range banner */}
      {outOfRange && (
        <div className="px-4 py-2.5 flex items-start gap-2.5" style={{ background: '#2F3B35' }}>
          <Sparkles className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#CBB9A3' }} />
          <p className="text-xs leading-relaxed" style={{ color: '#EEE7DA' }}>{outOfRange}</p>
        </div>
      )}
      <div className="relative">
        <ProfilePhotoCarousel photos={profile.photos} className="aspect-[4/5]" />

        {/* Compatibility banner — bottom of photo */}
        <div className="absolute bottom-0 left-0 right-0">
          {/* Gradient fade */}
          <div className="h-24 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="bg-black/75 backdrop-blur-sm px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                {aiPowered && <Sparkles className="w-3 h-3 text-[#A8C3A0] flex-shrink-0" />}
                <p className="text-white/90 text-xs font-medium truncate">
                  {compatHints || "Strong compatibility match"}
                </p>
              </div>
              {topMarkers.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {topMarkers.slice(0, 2).map((m) => (
                    <span key={m} className="text-[9px] font-semibold bg-white/15 text-white/80 rounded-full px-2 py-0.5">{m}</span>
                  ))}
                </div>
              )}
            </div>
            {/* Score ring */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <CompatibilityScoreBadge score={compatibilityScore} size="md" darkMode />
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3.5">
        {/* Name + location */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-heading font-bold">{profile.display_name}, {profile.age}</h3>
              {profile.is_verified && <VerifiedBadge />}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-sm">{profile.location}</span>
            </div>
          </div>
        </div>

        {/* Full breakdown teaser */}
        <div className="bg-primary/5 rounded-xl px-3.5 py-2 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <p className="text-xs text-primary/80">Full compatibility breakdown unlocks after matching</p>
        </div>

        {/* Bio */}
        {profile.bio && <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>}

        {/* Prompt preview */}
        <div className="space-y-2">
          <PromptCard prompt="What I'm looking for" answer={profile.prompt_looking_for} />
          {expanded && (
            <>
              <PromptCard prompt="Ideal weekend" answer={profile.prompt_ideal_weekend} />
              <PromptCard prompt="Biggest green flag" answer={profile.prompt_green_flag} />
            </>
          )}
          {(profile.prompt_ideal_weekend || profile.prompt_green_flag) && (
            <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-xs font-medium text-primary">
              {expanded ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</> : <><ChevronDown className="w-3.5 h-3.5" /> Read more</>}
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => onPass?.(profile)}
            className="flex-1 h-12 rounded-xl border-2 border-border flex items-center justify-center gap-2 text-muted-foreground hover:border-muted-foreground/30 transition-all active:scale-95"
          >
            <X className="w-5 h-5" />
            <span className="text-sm font-medium">Pass</span>
          </button>
          <button
            onClick={() => onLike?.(profile)}
            className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95"
          >
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">Interested</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
