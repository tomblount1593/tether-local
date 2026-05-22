import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, GitBranch, Heart, Link2, Orbit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOW_TETHER_WORKS_PAGES } from "@/data/howTetherWorksPages";

const ICON_BY_KEY = {
  analysis: Orbit,
  match: Link2,
  booking: CalendarDays,
  evolving: GitBranch,
  journey: Heart,
};

export default function HowTetherWorksFlow({ pageIndex, onBack, onContinue, onEnter, isSubmitting = false, tier = "standard" }) {
  const page = HOW_TETHER_WORKS_PAGES[pageIndex] || HOW_TETHER_WORKS_PAGES[0];
  const Icon = ICON_BY_KEY[page.icon] || Heart;
  const isFinal = pageIndex === HOW_TETHER_WORKS_PAGES.length - 1;

  return (
    <div
      className={`how-tether-works-screen how-tether-works-screen--${tier} flex-1 flex flex-col`}
      data-testid="how-tether-works-screen"
    >
      <motion.div
        key={page.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="how-tether-works-content flex-1 flex flex-col items-center text-center px-1"
      >
        <div className="how-tether-works-icon-wrap w-16 h-16 rounded-2xl flex items-center justify-center mt-1 mb-3" style={{ backgroundColor: "var(--assessment-option-bg)" }}>
          <Icon className="w-8 h-8" style={{ color: "var(--assessment-title-color)" }} />
        </div>

        <p className="assessment-kicker mb-2" style={{ color: "var(--assessment-title-color)" }}>
          {page.eyebrow}
        </p>
        <h2
          className="how-tether-works-title text-center mb-5"
          style={{ color: "var(--assessment-title-color)", fontFamily: "var(--font-heading)", fontWeight: 700 }}
        >
          {page.title.split("\n").map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </h2>
        <div className="how-tether-works-body-wrap max-w-[32ch] mb-3">
          <p className="how-tether-works-body app-lead leading-relaxed" style={{ color: "var(--assessment-body-color)" }}>{page.body}</p>
          <div className="how-tether-works-copy-divider" />
          <p className="how-tether-works-body app-lead leading-relaxed mt-0" style={{ color: "var(--assessment-body-color)" }}>{page.bodySecondary}</p>
        </div>

        <div className="how-tether-works-card-list w-full space-y-2 mb-2">
          {page.cards.map((card) => (
            <div key={card.number} className="how-tether-works-card rounded-xl border px-4 py-2 text-left flex items-center gap-3">
              <span className="how-tether-works-card-number rounded-full grid place-items-center font-semibold">
                {card.number}
              </span>
              <div className="how-tether-works-card-copy min-w-0">
                <p className="how-tether-works-card-title font-bold leading-tight">
                  {card.title}
                </p>
                <p className="how-tether-works-card-body">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {page.footerNote ? (
          <p className="text-xs mb-3" style={{ color: "var(--assessment-label-color)" }}>{page.footerNote}</p>
        ) : null}
      </motion.div>

      <div className="assessment-bottom-controls assessment-bottom-controls--gay-preview flex items-center gap-3 mt-2">
        <Button variant="ghost" onClick={onBack} className="rounded-full assessment-button">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        {isFinal ? (
          <Button onClick={onEnter} className="assessment-button rounded-full flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Setting up your profile..." : "Continue"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={onContinue} className="assessment-button rounded-full flex-1">
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
