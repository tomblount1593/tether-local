import { hashSeed } from "@/data/demo/demoMatchPoolSelector";
import { getRouteOrientationFromContext } from "@/lib/compatibilityVariantRouting";

function routeContextLabel(context = {}) {
  const pref = getRouteOrientationFromContext(context);
  if (pref === "gay") return "gay";
  if (pref === "lesbian") return "lesbian";
  if (pref === "bisexual") return "bisexual";
  if (pref === "trans_nonbinary") return "trans/non-binary";
  return "straight";
}

function getNeighbourhood(match) {
  const location = String(match?.location || "London");
  return location.split(",")[0].trim() || "London";
}

function getVenue(match) {
  return match?.firstDateSuggestion?.venueName || "Bao";
}

const THREAD_TEMPLATES = [
  ({ userName, matchName, neighbourhood, venue }) => [
    `Hey ${userName}, how is your day going?`,
    `Pretty good, just wrapping work. You?`,
    `Good. I am around ${neighbourhood} this week.`,
    `Nice. Want to keep ${venue} at 7:00 PM?`,
    `Yes, that works for me.`,
    `Perfect. Looking forward to meeting you, ${matchName}.`,
  ],
  ({ userName, neighbourhood, venue }) => [
    `Hi ${userName}, are you still up for tomorrow?`,
    `Yes, definitely.`,
    `Great. I can get to ${neighbourhood} easily.`,
    `Same here. ${venue} should be relaxed for a first meet.`,
    `Agreed. I will see you there.`,
    `Perfect, see you tomorrow.`,
  ],
  ({ venue }) => [
    `Hey, quick check-in before tomorrow.`,
    `Thanks, I appreciate that.`,
    `Would you prefer a quiet table at ${venue}?`,
    `Yes please, quieter is better for first chats.`,
    `Done. I will book for 7:00 PM.`,
    `Amazing, thank you.`,
  ],
];

export function getDemoChatThread(match, context = {}, user = {}) {
  if (!match?.id) return null;
  const matchName = String(match.displayName || "Your match");
  const userName = String(user?.displayName || "you");
  const neighbourhood = getNeighbourhood(match);
  const venue = getVenue(match);
  const routeLabel = routeContextLabel(context);
  const selector = hashSeed(`${match.id}:${routeLabel}`) % THREAD_TEMPLATES.length;
  const lines = THREAD_TEMPLATES[selector]({ userName, matchName, neighbourhood, venue });

  const baseHour = 16 + (hashSeed(`${match.id}:hour`) % 4);
  const baseMinute = (hashSeed(`${match.id}:min`) % 4) * 10;
  const makeTime = (index) => {
    const minute = String((baseMinute + index * 3) % 60).padStart(2, "0");
    return `Today, ${baseHour}:${minute}`;
  };

  return {
    matchId: String(match.id),
    participantName: matchName,
    participantPhoto: match.photoPath,
    messages: lines.map((text, index) => ({
      id: `${match.id}-msg-${index + 1}`,
      sender: index % 2 === 0 ? "match" : "user",
      text,
      timestamp: makeTime(index),
    })),
  };
}
