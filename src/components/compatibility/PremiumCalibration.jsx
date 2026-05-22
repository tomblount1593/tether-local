import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const PREMIUM_SECTIONS = [
  {
    id: "attraction_reality",
    title: "Attraction Reality Check",
    description: "Separate fantasy from genuine mutual attraction and real-date potential.",
    questions: [
      { id: "q1", text: "Which profiles feel exciting but less likely to work in real life?", type: "textarea" },
      { id: "q2", text: "Which profiles feel attractive and genuinely dateable?", type: "textarea" },
      { id: "q3", text: "Which energy feels best in person, not just on screen?", type: "textarea" },
      { id: "q4", text: "Are you open to being shown adjacent types if long-term compatibility is stronger?", type: "radio", options: ["Yes", "Maybe", "No"] },
    ],
  },
  {
    id: "lifestyle_flexibility",
    title: "Lifestyle Flexibility Calibration",
    description: "Understand how far you'd stretch for the right person.",
    questions: [
      { id: "q1", text: "How open are you to someone with a different weekly rhythm?", type: "radio", options: ["Very open", "Somewhat open", "Prefer similar rhythm"] },
      { id: "q2", text: "How far would you realistically travel for a strong match?", type: "radio", options: ["Local only", "Up to 25 miles", "Up to 50 miles", "Willing to travel further"] },
      { id: "q3", text: "Would you date someone in a nearby city if fit was unusually high?", type: "radio", options: ["Yes", "Maybe", "No"] },
      { id: "q4", text: "Do you prefer similarity, complementarity, or a balance?", type: "radio", options: ["Similarity", "Complementarity", "Balanced mix"] },
    ],
  },
  {
    id: "dating_priority",
    title: "Dating Priority Calibration",
    description: "Help us understand urgency, availability, and seriousness.",
    questions: [
      { id: "q1", text: "How actively are you looking right now?", type: "radio", options: ["Very actively", "Moderately", "Casually exploring"] },
      { id: "q2", text: "How soon would you like to meet someone worthwhile?", type: "radio", options: ["Within weeks", "Within months", "When it feels right"] },
      { id: "q3", text: "Are you open to slightly more effort for significantly better fit?", type: "radio", options: ["Yes", "Maybe", "No"] },
      { id: "q4", text: "What matters most?", type: "radio", options: ["Convenience", "Chemistry", "Long-term alignment"] },
    ],
  },
];

export default function PremiumCalibration({ onComplete }) {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [phase, setPhase] = useState("intro");
  const [answers, setAnswers] = useState({});

  const currentSection = PREMIUM_SECTIONS[sectionIndex];

  const handleAnswer = (questionId, value) => {
    const key = `${currentSection.id}_${questionId}`;
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const allAnswered = currentSection.questions.every((q) => answers[`${currentSection.id}_${q.id}`]);

  const handleNext = () => {
    if (sectionIndex < PREMIUM_SECTIONS.length - 1) {
      setSectionIndex(sectionIndex + 1);
      setPhase("intro");
    } else {
      onComplete({ premium_calibration: answers });
    }
  };

  if (phase === "intro") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-7">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Refine Your Fit — Section {sectionIndex + 1} / 3</p>
          <h3 className="text-2xl font-heading font-bold mb-3">{currentSection.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">{currentSection.description}</p>
        </div>
        <Button onClick={() => setPhase("questions")} className="rounded-full w-full max-w-xs">
          Begin <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-5">
      <div>
        <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Section {sectionIndex + 1} / 3</p>
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
          {sectionIndex === PREMIUM_SECTIONS.length - 1 ? "Complete" : "Next"} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}