import { motion } from "framer-motion";

/**
 * RankingGrid — visual card grid where users rank their top N choices.
 * Tapping a card selects it (adds to ranked list). Tapping a ranked card deselects it.
 * Shows rank badge (1, 2, 3…) on selected cards.
 */
export default function RankingGrid({ cards, ranked, onToggle, maxRank = 5, columns = 2 }) {
  return (
    <div
      className="grid gap-2.5"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {cards.map((card) => {
        const rankPos = ranked.indexOf(card.id);
        const isSelected = rankPos !== -1;
        const rankLabel = rankPos + 1;

        return (
          <motion.button
            key={card.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(card.id)}
            className="relative rounded-2xl overflow-hidden border-2 transition-all text-left"
            style={{
              borderColor: isSelected ? "hsl(var(--primary))" : "transparent",
              aspectRatio: card.square ? "1/1" : "3/4",
              boxShadow: isSelected ? "0 0 0 2px hsl(var(--primary)/0.25)" : "none",
            }}
          >
            {card.photo && (
              <img
                src={card.photo}
                alt={card.label || card.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            )}

            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: card.photo
                  ? "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)"
                  : isSelected
                  ? "hsl(var(--primary)/0.12)"
                  : "hsl(var(--secondary))",
              }}
            />

            {/* Text content */}
            <div className="absolute bottom-0 left-0 right-0 p-2.5">
              {card.name && (
                <p className="text-white text-xs font-bold leading-tight">
                  {card.name}{card.age ? `, ${card.age}` : ""}
                </p>
              )}
              {card.label && !card.name && (
                <p
                  className="text-xs font-semibold leading-tight"
                  style={{ color: card.photo ? "white" : isSelected ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}
                >
                  {card.label}
                </p>
              )}
              {card.sublabel && (
                <p
                  className="text-[10px] mt-0.5 leading-tight"
                  style={{ color: card.photo ? "rgba(255,255,255,0.65)" : "hsl(var(--muted-foreground))" }}
                >
                  {card.sublabel}
                </p>
              )}
            </div>

            {/* Rank badge */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }}
              >
                {rankLabel}
              </motion.div>
            )}

            {/* Dimmed overlay if at max and not selected */}
            {!isSelected && ranked.length >= maxRank && (
              <div className="absolute inset-0 bg-black/30" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}