import { getZodiacSign } from "@/utils/zodiac";

const STRONG = new Set(["Virgo", "Capricorn", "Cancer", "Pisces"]);
const GOOD = new Set(["Libra", "Scorpio", "Leo"]);

export function getZodiacCompatibility(userBirthDate, matchBirthDate) {
  const userSign = getZodiacSign(userBirthDate || "1993-05-01") || "Taurus";
  const matchSign = getZodiacSign(matchBirthDate || "1993-03-15") || "Pisces";

  let traditionalFit = "mixed";
  if (userSign === matchSign || STRONG.has(matchSign)) traditionalFit = "strong";
  else if (GOOD.has(matchSign)) traditionalFit = "good";
  else traditionalFit = "unexpected";

  const scoreBase = traditionalFit === "strong" ? 89 : traditionalFit === "good" ? 81 : traditionalFit === "mixed" ? 74 : 70;
  const summary =
    traditionalFit === "strong"
      ? `${userSign} and ${matchSign} usually align well on steadiness and emotional consistency.`
      : traditionalFit === "good"
        ? `${userSign} and ${matchSign} can be a strong blend when pace and communication stay clear.`
        : `${userSign} and ${matchSign} can work well with honest pacing and lifestyle alignment.`;

  return {
    userSign,
    matchSign,
    traditionalFit,
    score: scoreBase,
    summary,
    strengths: ["Emotional honesty", "Mutual curiosity", "Real-world compatibility focus"],
    watchouts: ["Different social pace", "Different communication rhythm"],
  };
}

