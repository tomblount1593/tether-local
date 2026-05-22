import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GENDERS = [
  "Male", "Female", "Non-binary", "Trans male", "Trans female",
  "Prefer to self-describe", "Prefer not to say",
];

const PREFERENCES = [
  { value: "gay", label: "Gay", route: "/onboarding-gay" },
  { value: "straight", label: "Straight", route: "/onboarding-straight" },
  { value: "bisexual", label: "Bisexual", route: "/onboarding-bisexual" },
  { value: "lesbian", label: "Lesbian", route: "/onboarding-lesbian" },
  { value: "trans_nonbinary", label: "Trans / Non-binary", route: "/onboarding-trans-nonbinary" },
];

function Chip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all text-left"
      style={{
        borderColor: selected ? "hsl(var(--primary))" : "hsl(var(--border))",
        background: selected ? "hsl(var(--primary)/0.08)" : "hsl(var(--card))",
        color: selected ? "hsl(var(--primary))" : "hsl(var(--foreground))",
      }}
    >
      {label}
    </button>
  );
}

export default function OnboardingEntry() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const [gender, setGender] = useState("");
  const [preference, setPreference] = useState("");

  const calcAge = () => {
    if (!dob.day || !dob.month || !dob.year) return null;
    const birth = new Date(Number(dob.year), Number(dob.month) - 1, Number(dob.day));
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age > 0 ? age : null;
  };

  const age = calcAge();
  const canProceed = name && age && age >= 18 && gender && preference;

  const handleContinue = () => {
    const selected = PREFERENCES.find(p => p.value === preference);
    if (!selected) return;
    // Store orientation context for demo personalisation
    localStorage.setItem("tether_orientation", preference);
    localStorage.setItem("tether_user_gender", gender);
    localStorage.setItem("tether_entry_name", name);
    localStorage.setItem("tether_entry_age", String(age));
    navigate(selected.route);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 px-5 py-8 max-w-lg mx-auto w-full space-y-7">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-primary/10 mb-4">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-heading font-bold mb-1">Welcome to Tether</h1>
          <p className="text-sm text-muted-foreground">Let's set up your experience. This takes about 30 seconds.</p>
        </motion.div>

        {/* Name */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">First Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your first name" className="rounded-xl h-12" />
        </motion.div>

        {/* Date of Birth */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Date of Birth</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Day", key: "day", placeholder: "DD", max: 2 },
              { label: "Month", key: "month", placeholder: "MM", max: 2 },
              { label: "Year", key: "year", placeholder: "YYYY", max: 4 },
            ].map(({ label, key, placeholder, max }) => (
              <div key={key}>
                <span className="text-[10px] text-muted-foreground block mb-1">{label}</span>
                <Input
                  type="number"
                  value={dob[key]}
                  onChange={e => setDob(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  maxLength={max}
                  className="rounded-xl h-11 text-center"
                />
              </div>
            ))}
          </div>
          {age && age >= 18 && <p className="text-xs text-muted-foreground mt-1.5">Age: {age}</p>}
          {age && age < 18 && <p className="text-xs text-destructive mt-1.5">You must be 18 or older to join Tether.</p>}
        </motion.div>

        {/* Gender Identity */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Gender Identity</label>
          <div className="flex flex-wrap gap-2">
            {GENDERS.map(g => (
              <Chip key={g} label={g} selected={gender === g} onClick={() => setGender(g)} />
            ))}
          </div>
        </motion.div>

        {/* Sexual Preference */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Sexual Preference</label>
          <div className="flex flex-wrap gap-2">
            {PREFERENCES.map(p => (
              <Chip key={p.value} label={p.label} selected={preference === p.value} onClick={() => setPreference(p.value)} />
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <Button onClick={handleContinue} disabled={!canProceed} size="lg" className="w-full rounded-full">
            Continue to your compatibility profile <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Your answers are private and used only to build your compatibility profile.
          </p>
        </motion.div>
      </div>
    </div>
  );
}