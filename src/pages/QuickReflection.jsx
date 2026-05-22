import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "@/components/BackButton";
import CompatibilityScoreBadge from "@/components/CompatibilityScoreBadge";
import { MATCHES_REFERENCE } from "@/constants/matchesReference";
import { useCurrentMatch } from "@/hooks/useCurrentMatch";
import { getCompatibilityTone } from "@/lib/compatibilityTone";
import { getMatchesRouteWithTab, getWaitingResponseRoute } from "@/lib/matchFlowRoutes";
import { saveStoredReflection } from "@/data/demo/demoDateExperience";

const ALIGNMENT_OPTIONS = ["Strongly aligned", "Mostly aligned", "Mixed", "Misaligned"];
const LIFESTYLE_OPTIONS = ["Yes definitely", "Mostly", "Unsure", "Probably not"];
const LONG_TERM_OPTIONS = ["Strong yes", "Yes", "Unsure", "No"];
const EXPECTATION_OPTIONS = ["Better than expected", "About right", "Less aligned than expected"];
const GUIDANCE_OPTIONS = ["Yes, continue", "Unsure", "No chemistry"];
const QUESTION_TITLE_CLASS = "font-heading font-bold text-base leading-tight text-primary text-center";

function getReflectionTheme(tier) {
  if (tier === "premium") {
    return {
      isStandard: false,
      sectionSurface: "#5b655d",
      sectionBorder: "rgba(248, 243, 241, 0.30)",
      sectionText: "#f8f3f1",
      mutedText: "rgba(248, 243, 241, 0.84)",
      innerSurface: "#f8f3f1",
      innerHeader: "rgba(55, 66, 58, 0.10)",
      sectionHeaderBg: "#5b655d",
      sectionHeaderText: "#f8f3f1",
      topBannerBg: "#5b655d",
      topBannerHeaderBg: "#5b655d",
      topBannerTitleText: "#f8f3f1",
      topBannerBodyText: "rgba(248, 243, 241, 0.84)",
      innerBorder: "rgba(55, 66, 58, 0.22)",
      innerTitle: "#37423a",
      innerText: "rgba(55, 66, 58, 0.86)",
      pillBorder: "rgba(55, 66, 58, 0.42)",
      pillText: "#37423a",
      pillActiveBg: "#37423a",
      pillActiveText: "#f8f3f1",
      textAreaBg: "rgba(55, 66, 58, 0.04)",
      primaryButtonBg: "#37423a",
      primaryButtonText: "#f8f3f1",
    };
  }
  if (tier === "concierge") {
    return {
      isStandard: false,
      sectionSurface: "#242623",
      sectionBorder: "rgba(210, 198, 178, 0.30)",
      sectionText: "#d2c6b2",
      mutedText: "rgba(210, 198, 178, 0.84)",
      innerSurface: "#d2c6b2",
      innerHeader: "rgba(36, 38, 35, 0.08)",
      sectionHeaderBg: "#242623",
      sectionHeaderText: "#d2c6b2",
      topBannerBg: "#242623",
      topBannerHeaderBg: "#242623",
      topBannerTitleText: "#d2c6b2",
      topBannerBodyText: "rgba(210, 198, 178, 0.84)",
      innerBorder: "rgba(36, 38, 35, 0.20)",
      innerTitle: "#141916",
      innerText: "rgba(20, 25, 22, 0.86)",
      pillBorder: "rgba(36, 38, 35, 0.24)",
      pillText: "#141916",
      pillActiveBg: "#242623",
      pillActiveText: "#d2c6b2",
      textAreaBg: "rgba(36, 38, 35, 0.04)",
      primaryButtonBg: "#242623",
      primaryButtonText: "#d2c6b2",
    };
  }
  return {
    isStandard: true,
    sectionSurface: "#37423a",
    sectionBorder: MATCHES_REFERENCE.darkGreenBorder,
    sectionText: "#f8f3f1",
    mutedText: "rgba(248, 243, 241, 0.85)",
    innerSurface: "#f8f3f1",
    innerHeader: "#e7e5e1",
    sectionHeaderBg: "#DAD7D3",
    sectionHeaderText: "#37423a",
    topBannerBg: "#f8f3f1",
    topBannerHeaderBg: "#DAD7D3",
    topBannerTitleText: "#37423a",
    topBannerBodyText: "#37423a",
    innerBorder: "hsl(var(--border))",
    innerTitle: "#37423a",
    innerText: "hsl(var(--muted-foreground))",
    pillBorder: "hsl(var(--border))",
    pillText: "hsl(var(--foreground))",
    pillActiveBg: "transparent",
    pillActiveText: "hsl(var(--primary))",
    textAreaBg: "rgba(255,255,255,0.5)",
    primaryButtonBg: "hsl(var(--primary))",
    primaryButtonText: "hsl(var(--primary-foreground))",
  };
}

function SectionBanner({ theme }) {
  return (
    <div
      className="overflow-hidden rounded-[26px] border text-center"
      style={{ borderColor: theme.sectionBorder, background: theme.topBannerBg }}
    >
      <div className="px-4 py-2.5 text-center" style={{ background: theme.topBannerHeaderBg }}>
        <p
          className="font-heading font-bold text-center"
          style={{ ...MATCHES_REFERENCE.insightTitleStyle, color: theme.topBannerTitleText }}
        >
          Let&apos;s do a quick reflection
        </p>
      </div>
      <div className="px-4 py-3 text-center">
        <p
          className="font-body text-center"
          style={{ ...MATCHES_REFERENCE.insightSecondaryStyle, color: theme.topBannerBodyText }}
        >
          Your feedback helps Tether better understand real-world compatibility.
        </p>
      </div>
    </div>
  );
}

function PillGroup({ value, onChange, options, theme }) {
  return (
    <div className="flex min-h-[56px] flex-wrap items-center justify-center gap-2 px-3 py-2">
      {options.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className="rounded-full border px-3 py-2 text-[11px] font-body leading-tight text-center transition-colors"
            style={{
              borderColor: active ? theme.pillActiveBg : theme.pillBorder,
              background: active ? theme.pillActiveBg : "transparent",
              color: active ? theme.pillActiveText : theme.pillText,
            }}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function QuestionBlock({ title, value, onChange, options, theme }) {
  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: theme.innerBorder, background: theme.innerSurface }}>
      <div className="px-3 py-1.5 min-h-[34px] flex items-center justify-center" style={{ background: theme.innerHeader }}>
        <p className="font-heading font-bold text-[15px] leading-tight text-center" style={{ color: theme.innerTitle }}>{title}</p>
      </div>
      <PillGroup value={value} onChange={onChange} options={options} theme={theme} />
    </div>
  );
}

function ReflectionSection({ title, children, theme }) {
  return (
    <section
      className="rounded-[26px] overflow-hidden border"
      style={{ borderColor: theme.sectionBorder, background: theme.sectionSurface }}
    >
      <div className="px-4 py-2.5 text-center" style={{ background: theme.sectionHeaderBg }}>
        <h2 className="font-heading font-bold text-base leading-tight" style={{ color: theme.sectionHeaderText }}>{title}</h2>
      </div>
      <div className={theme.isStandard ? "p-3 space-y-2.5" : "p-3.5 space-y-3"}>
        {children}
      </div>
    </section>
  );
}

function buildInitialState(match) {
  const stageLabel = String(match?.dateStage || "");
  const stageNumber = Number(match?.stageNumber) || (stageLabel.startsWith("3") ? 3 : stageLabel.startsWith("1") ? 1 : 2);
  return {
    dateNumber: stageNumber,
    attraction: "",
    conversation: "",
    chemistry: "",
    comfort: "",
    energy: "",
    humour: "",
    emotionalBalance: "",
    timeTogether: "",
    lifestyleFit: "",
    routinesFit: "",
    interestGrowth: "",
    anotherDate: "",
    romanticPotential: "",
    positives: "",
    missing: "",
    expectationFit: "",
    continueGuidance: "Yes, continue",
  };
}

export default function QuickReflection() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { context, match: fallbackMatch } = useCurrentMatch(matchId, "matches");
  const match = location.state?.matchData || fallbackMatch;
  const sourceTab = location.state?.sourceTab || "matches";
  const membershipTier = context?.membershipTier || "standard";
  const theme = useMemo(() => getReflectionTheme(membershipTier), [membershipTier]);
  const [form, setForm] = useState(() => buildInitialState(match));
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const scoreTone = useMemo(
    () => getCompatibilityTone(Number(match?.compatibilityScore) || 65, membershipTier),
    [match?.compatibilityScore, membershipTier]
  );

  if (!match) return null;

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const submitReflection = () => {
    const payload = {
      ...form,
      matchId: String(match.id),
      submittedAt: new Date().toISOString(),
    };
    saveStoredReflection(match.id, payload);
    navigate(getWaitingResponseRoute(location.pathname, match.id), {
      state: {
        matchData: match,
        reflection: payload,
        sourceTab,
      },
    });
  };

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-background px-4 py-6 space-y-4" data-testid="quick-reflection-page">
      <div className="flex items-center gap-2">
        <BackButton onClick={() => navigate(getMatchesRouteWithTab(location.pathname, sourceTab))} />
        <h1 className="font-heading font-bold text-xl">Quick reflection</h1>
      </div>

      <SectionBanner theme={theme} />

      <div
        className="rounded-2xl border-2 p-3.5 flex items-center gap-3"
        style={{ borderColor: theme.sectionBorder, background: theme.sectionSurface }}
      >
        <img src={match.photoPath} alt={match.displayName} className="w-14 h-14 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <p className={MATCHES_REFERENCE.primaryTextClass} style={{ color: theme.sectionText }}>{match.displayName}, {match.age}</p>
          <p className={`${MATCHES_REFERENCE.secondaryTextClass} mt-0.5`} style={{ color: theme.mutedText }}>{match.locationLabel}</p>
          <p className={`${MATCHES_REFERENCE.summaryTextClass} mt-1`} style={{ color: theme.mutedText }}>
            Date {form.dateNumber} reflection. This should only take about a minute.
          </p>
        </div>
        <CompatibilityScoreBadge
          score={Number(match.compatibilityScore) || 65}
          size="sm"
          tier={membershipTier}
          scoreColor={theme.sectionText}
          trackColor={theme.sectionBorder}
        />
      </div>

      <ReflectionSection title="Attraction & chemistry" theme={theme}>
        <QuestionBlock
          title="Did the attraction feel stronger in person?"
          value={form.attraction}
          onChange={(value) => updateField("attraction", value)}
          options={["Much stronger", "Slightly stronger", "About the same", "Weaker than expected"]}
          theme={theme}
        />
        <QuestionBlock
          title="Did conversation feel natural?"
          value={form.conversation}
          onChange={(value) => updateField("conversation", value)}
          options={["Very natural", "Mostly easy", "Mixed", "Forced"]}
          theme={theme}
        />
        <QuestionBlock
          title="Did physical chemistry feel mutual?"
          value={form.chemistry}
          onChange={(value) => updateField("chemistry", value)}
          options={["Definitely", "Possibly", "Unsure", "Not really"]}
          theme={theme}
        />
      </ReflectionSection>

      <ReflectionSection title="Emotional & social fit" theme={theme}>
        <QuestionBlock title="Did you feel comfortable around them?" value={form.comfort} onChange={(value) => updateField("comfort", value)} options={ALIGNMENT_OPTIONS} theme={theme} />
        <QuestionBlock title="Did energy levels feel aligned?" value={form.energy} onChange={(value) => updateField("energy", value)} options={ALIGNMENT_OPTIONS} theme={theme} />
        <QuestionBlock title="Did humour feel compatible?" value={form.humour} onChange={(value) => updateField("humour", value)} options={ALIGNMENT_OPTIONS} theme={theme} />
        <QuestionBlock title="Did the interaction feel emotionally balanced?" value={form.emotionalBalance} onChange={(value) => updateField("emotionalBalance", value)} options={ALIGNMENT_OPTIONS} theme={theme} />
      </ReflectionSection>

      <ReflectionSection title="Lifestyle alignment" theme={theme}>
        <QuestionBlock title="Could you realistically imagine spending more time together?" value={form.timeTogether} onChange={(value) => updateField("timeTogether", value)} options={LIFESTYLE_OPTIONS} theme={theme} />
        <QuestionBlock title="Did your lifestyles feel compatible?" value={form.lifestyleFit} onChange={(value) => updateField("lifestyleFit", value)} options={LIFESTYLE_OPTIONS} theme={theme} />
        <QuestionBlock title="Did conversation around routines and interests feel aligned?" value={form.routinesFit} onChange={(value) => updateField("routinesFit", value)} options={LIFESTYLE_OPTIONS} theme={theme} />
      </ReflectionSection>

      <ReflectionSection title="Long-term potential" theme={theme}>
        <QuestionBlock title="Has your interest increased after this date?" value={form.interestGrowth} onChange={(value) => updateField("interestGrowth", value)} options={LONG_TERM_OPTIONS} theme={theme} />
        <QuestionBlock title="Would you genuinely like another date?" value={form.anotherDate} onChange={(value) => updateField("anotherDate", value)} options={LONG_TERM_OPTIONS} theme={theme} />
        <QuestionBlock title="Could you see romantic potential developing?" value={form.romanticPotential} onChange={(value) => updateField("romanticPotential", value)} options={LONG_TERM_OPTIONS} theme={theme} />
      </ReflectionSection>

      <ReflectionSection title="Help Tether learn" theme={theme}>
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: theme.innerBorder, background: theme.innerSurface }}>
          <div className="px-3 py-1.5 min-h-[34px] flex items-center justify-center" style={{ background: theme.innerHeader }}>
            <p className="font-heading font-bold text-[15px] leading-tight text-center" style={{ color: theme.innerTitle }}>What stood out most positively?</p>
          </div>
          <div className="px-3 py-2">
            <textarea
              value={form.positives}
              onChange={(e) => updateField("positives", e.target.value)}
              rows={2}
              placeholder="Optional"
              className="w-full rounded-xl border px-3 py-2 text-xs font-body resize-none text-center"
              style={{ borderColor: theme.innerBorder, background: theme.textAreaBg, color: theme.innerText }}
            />
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: theme.innerBorder, background: theme.innerSurface }}>
          <div className="px-3 py-1.5 min-h-[34px] flex items-center justify-center" style={{ background: theme.innerHeader }}>
            <p className="font-heading font-bold text-[15px] leading-tight text-center" style={{ color: theme.innerTitle }}>Was anything unexpectedly missing?</p>
          </div>
          <div className="px-3 py-2">
            <textarea
              value={form.missing}
              onChange={(e) => updateField("missing", e.target.value)}
              rows={2}
              placeholder="Optional"
              className="w-full rounded-xl border px-3 py-2 text-xs font-body resize-none text-center"
              style={{ borderColor: theme.innerBorder, background: theme.textAreaBg, color: theme.innerText }}
            />
          </div>
        </div>
        <QuestionBlock
          title="Did this match feel:"
          value={form.expectationFit}
          onChange={(value) => updateField("expectationFit", value)}
          options={EXPECTATION_OPTIONS}
          theme={theme}
        />
      </ReflectionSection>

      <ReflectionSection title="Should Tether help guide the next stage?" theme={theme}>
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: theme.innerBorder, background: theme.innerSurface }}>
          <div className="px-3 py-1.5 min-h-[34px] flex items-center justify-center" style={{ background: theme.innerHeader }}>
            <p className="font-heading font-bold text-[15px] leading-tight text-center" style={{ color: theme.innerTitle }}>Choose next-stage guidance</p>
          </div>
          <PillGroup
            value={form.continueGuidance}
            onChange={(value) => updateField("continueGuidance", value)}
            options={GUIDANCE_OPTIONS}
            theme={theme}
          />
        </div>
      </ReflectionSection>

      <button
        type="button"
        onClick={submitReflection}
        className="btn-hover-dark w-full rounded-full px-5 py-3 text-sm font-semibold"
        style={{ background: theme.primaryButtonBg, color: theme.primaryButtonText }}
      >
        Submit Reflection
      </button>
    </div>
  );
}
