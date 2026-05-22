export default function PromptCard({ prompt, answer }) {
  if (!answer) return null;
  
  return (
    <div className="bg-secondary/50 rounded-xl border border-border p-4">
      <p className="text-sm font-heading font-bold text-muted-foreground uppercase tracking-[0.1em] mb-1.5">
        {prompt}
      </p>
      <p className="text-sm font-body text-foreground leading-relaxed">{answer}</p>
    </div>
  );
}
