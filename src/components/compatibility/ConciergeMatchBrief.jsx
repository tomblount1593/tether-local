import { useState } from "react";
import { ArrowRight, Upload, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { localApp } from "@/api/localClient";

const BRIEF_SECTIONS = [
  {
    id: "relationship_ambition",
    title: "Relationship Ambition & Life Stage",
    description: "Help us understand your vision for partnership.",
    questions: [
      { id: "q1", text: "What kind of partnership are you hoping to build in the next 1–3 years?", type: "textarea" },
      { id: "q2", text: "Do you want marriage, long-term partnership, or committed dating leading somewhere serious?", type: "textarea" },
      { id: "q3", text: "How important is emotional maturity and life-stage alignment?", type: "textarea" },
    ],
  },
  {
    id: "lifestyle_ambition",
    title: "Lifestyle Compatibility & Ambition Fit",
    description: "What kind of life and work rhythm suits you best in a partner?",
    questions: [
      { id: "q1", text: "What kind of work rhythm suits you best in a partner?", type: "textarea" },
      { id: "q2", text: "How important is career ambition to you in a partner?", type: "textarea" },
      { id: "q3", text: "How important is financial stability in long-term compatibility?", type: "textarea" },
    ],
  },
  {
    id: "geographic_ambition",
    title: "Geographic Ambition",
    description: "Help us understand your geographic flexibility.",
    questions: [
      { id: "q1", text: "Are you only looking locally, or open to national matching?", type: "radio", options: ["Local only", "London + surrounding", "Nationwide UK", "International"] },
      { id: "q2", text: "Would you relocate for the right relationship?", type: "radio", options: ["Yes", "Maybe", "No"] },
    ],
  },
  {
    id: "partner_criteria",
    title: "Partner Criteria Clarifier",
    description: "What truly matters in a long-term partner for you?",
    questions: [
      { id: "q1", text: "What are your true non-negotiables?", type: "textarea" },
      { id: "q2", text: "What kind of person usually looks right on paper but never works for you?", type: "textarea" },
    ],
  },
];

export default function ConciergeMatchBrief({ onComplete }) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [phase, setPhase] = useState("intro");
  const [answers, setAnswers] = useState({});
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);

  const currentSection = BRIEF_SECTIONS[sectionIndex];

  const handleAnswer = (questionId, value) => {
    const key = `${currentSection.id}_${questionId}`;
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const allAnswered = currentSection.questions.every((q) => answers[`${currentSection.id}_${q.id}`]);

  const handleNext = () => {
    if (sectionIndex < BRIEF_SECTIONS.length - 1) {
      setSectionIndex(sectionIndex + 1);
      setPhase("intro");
    } else {
      setPhase("video");
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoUploading(true);
    const { file_url } = await localApp.integrations.Core.UploadFile({ file });
    setVideoUrl(file_url);
    setVideoUploading(false);
  };

  const handleVideoComplete = () => {
    onComplete({
      concierge_brief: answers,
      expert_video_url: videoUrl,
    });
  };

  if (phase === "intro") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-7">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Your Match Brief — Section {sectionIndex + 1} / {BRIEF_SECTIONS.length}</p>
          <h3 className="text-2xl font-heading font-bold mb-3">{currentSection.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">{currentSection.description}</p>
        </div>
        <Button onClick={() => setPhase("questions")} className="rounded-full w-full max-w-xs">
          Begin <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  if (phase === "video") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Camera className="w-8 h-8 text-primary" />
        </div>
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Final Step</p>
          <h2 className="text-2xl font-heading font-bold mb-2">Tell Your Expert What You're Looking For</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-4">
            In your own words, share what kind of relationship you want, what tends to work for you, and what you hope we help you find. (1–2 minutes)
          </p>
        </div>

        {!videoUrl ? (
          <label className="w-full max-w-xs cursor-pointer">
            <div className="p-6 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-all">
              {videoUploading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-sm font-medium">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold">Upload video</p>
                    <p className="text-xs text-muted-foreground">or drag and drop</p>
                  </div>
                </>
              )}
            </div>
            <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} disabled={videoUploading} />
          </label>
        ) : (
          <div className="w-full max-w-xs p-4 rounded-2xl bg-primary/10 border border-primary/30">
            <p className="text-sm font-medium text-primary">✓ Video uploaded</p>
          </div>
        )}

        <Button onClick={handleVideoComplete} disabled={!videoUrl} size="lg" className="w-full max-w-xs rounded-full">
          Complete Setup <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-5">
      <div>
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Section {sectionIndex + 1} / {BRIEF_SECTIONS.length}</p>
        <h3 className="text-xl font-heading font-bold">{currentSection.title}</h3>
      </div>
      <div className="space-y-5 flex-1">
        {currentSection.questions.map((q) => {
          const value = answers[`${currentSection.id}_${q.id}`] || "";
          return (
            <div key={q.id}>
              <label className="text-sm font-semibold text-foreground block mb-2">{q.text}</label>
              {q.type === "textarea" ? (
                <Textarea
                  value={value}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  placeholder="Share your thoughts..."
                  className="rounded-xl resize-none"
                  rows={2}
                />
              ) : (
                <div className="space-y-2">
                  {q.options.map((option) => (
                    <label key={option} className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer transition-all hover:bg-secondary" style={value === option ? { borderColor: "hsl(var(--primary))", backgroundColor: "hsl(var(--primary))/5" } : {}}>
                      <input type="radio" name={`${currentSection.id}_${q.id}`} value={option} checked={value === option} onChange={(e) => handleAnswer(q.id, e.target.value)} className="w-4 h-4" />
                      <span className="text-sm font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 pt-4">
        <Button variant="outline" onClick={() => (sectionIndex > 0 ? setSectionIndex(sectionIndex - 1) : null)} className="rounded-full">
          Back
        </Button>
        <Button onClick={handleNext} disabled={!allAnswered} className="rounded-full flex-1">
          {sectionIndex === BRIEF_SECTIONS.length - 1 ? "Next: Video" : "Next"} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}