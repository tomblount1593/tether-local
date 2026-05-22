import bisexualDocRaw from "../../.codex-doc-extract/bisexual.txt?raw";
import gayDocRaw from "../../.codex-doc-extract/gay.txt?raw";
import lesbianDocRaw from "../../.codex-doc-extract/lesbian.txt?raw";
import straightDocRaw from "../../.codex-doc-extract/straight.txt?raw";
import transNonbinaryDocRaw from "../../.codex-doc-extract/trans_nonbinary.txt?raw";

const SECTION_DEFINITIONS = [
  {
    number: "01",
    index: "1",
    id: "type",
    title: "Your Type",
    quote:
      "Attraction is personal. The more clearly we understand your type, the more naturally we can tailor who you see.",
    why:
      "This helps us understand the looks, traits, and presentation styles you're most drawn to — and how flexible that attraction is.",
    summary:
      "This helps us learn the attraction signals that genuinely draw you in.",
  },
  {
    number: "02",
    index: "2",
    id: "romantic_pattern",
    title: "Romantic Pattern",
    quote:
      "What has worked for you before — and what hasn't — often reveals more than preference alone.",
    why:
      "This helps us learn your dating patterns, what tends to repeat, and what kind of connection is more likely to feel healthy and lasting.",
    summary:
      "This helps us understand what has worked before and what patterns to avoid.",
  },
  {
    number: "03",
    index: "3",
    id: "intent_values",
    title: "Intent & Values",
    quote:
      "The right connection starts with wanting similar things — and being ready for them.",
    why:
      "This helps us understand what you want right now, what matters most to you, and what kind of future fit is important.",
    summary:
      "This helps us identify the future fit and values that matter most to you.",
  },
  {
    number: "04",
    index: "4",
    id: "lifestyle",
    title: "Lifestyle & Social Fit",
    quote:
      "Real compatibility lives in the everyday — not just in chemistry.",
    why:
      "This helps us learn how you live, socialise, communicate, and build your day-to-day life — so matches feel natural in the real world.",
    summary:
      "This helps us understand if your everyday lives are likely to feel natural together.",
  },
  {
    number: "05",
    index: "5",
    id: "presentation",
    title: "First Impression & Vibe",
    quote:
      "Chemistry is more than looks — it's how someone comes across, and how that feels in real life.",
    why:
      "This helps us understand the energy you give off, the energy you're drawn to, and the kind of chemistry that feels believable and mutual.",
    summary:
      "This helps us predict whether chemistry is likely to translate in real life.",
  },
];

const SECTION_BY_INDEX = Object.fromEntries(
  SECTION_DEFINITIONS.map((section) => [section.index, section]),
);

const QUESTION_FIELD_KEYS = new Set([
  "type",
  "id",
  "legacy_id_if_needed",
  "prompt",
  "adaptive_prompt",
  "microcopy",
  "options",
  "shared_options",
  "adaptive_options_if_masculine_attraction",
  "adaptive_options_if_feminine_attraction",
  "axes",
  "scale",
  "selection_rule",
  "markers",
  "marker_mapping",
  "measures",
  "important",
]);

const STRAIGHT_SHARED_QUESTION_METADATA = {
  "2.1": {
    type: "multi_select",
    id: "past_dating_types",
    adaptivePrompt: [
      "Female + Prefer Girls: Which kinds of women have you dated or been drawn to before?",
      "Female + Prefer Guys: Which kinds of men have you dated or been drawn to before?",
      "Male + Prefer Girls: Which kinds of women have you dated or been drawn to before?",
      "Male + Prefer Guys: Which kinds of men have you dated or been drawn to before?",
      "Show Mix: Which kinds of people have you dated or been drawn to before?",
    ],
  },
  "2.2": {
    type: "multi_select",
    id: "worked_in_past",
    prompt: "Which kinds of people have actually worked best for you?",
    microcopy: "Pick up to 5.",
    maxSelect: 5,
  },
  "2.3": {
    type: "multi_select",
    id: "didnt_last_pattern",
    prompt:
      "Which patterns have felt exciting but usually didn't last?",
    microcopy: "Pick up to 5.",
    maxSelect: 5,
  },
  "2.4": {
    type: "single_select",
    id: "closeness_pattern",
    prompt:
      "When you start liking someone, what feels most familiar?",
  },
  "2.5": {
    type: "single_select",
    id: "conflict_response",
    prompt: "When tension comes up, I usually…",
  },
  "2.6": {
    type: "slider_set",
    id: "conflict_repair_skills",
    prompt: "How do you usually repair after tension?",
  },
  "2.7": {
    type: "slider_set",
    id: "emotional_safety_support",
    prompt:
      "What helps a relationship feel emotionally safe for you?",
  },
  "2.8": {
    type: "single_select",
    id: "humour_resilience",
    prompt:
      "What role does humour play when things get difficult?",
  },
  "2.9": {
    type: "multi_select",
    id: "relationship_challenge_pattern",
    prompt: "In dating, what tends to be hardest for you?",
  },
  "2.10": {
    type: "slider",
    id: "romantic_pattern_flexibility",
    prompt:
      "How open are you to dating outside your usual pattern?",
  },
  "3.1": {
    type: "single_select",
    id: "relationship_intent",
    prompt: "What are you looking for right now?",
  },
  "3.2": {
    type: "single_select",
    id: "relationship_readiness",
    prompt: "How ready do you feel for a relationship right now?",
  },
  "3.3": {
    type: "single_select",
    id: "core_relationship_need",
    prompt:
      "What do you most need from a relationship right now?",
  },
  "3.4": {
    type: "multi_select",
    id: "core_values",
    prompt: "Which relationship values matter most to you?",
    microcopy: "Pick up to 6.",
    maxSelect: 6,
  },
  "3.5": {
    type: "slider_set",
    id: "worldview_values_alignment",
    prompt:
      "How important is alignment on these deeper areas?",
  },
  "3.6": {
    type: "multi_select",
    id: "future_alignment_topics",
    prompt:
      "Which future topics matter most to align on?",
  },
  "3.7": {
    type: "slider_set",
    id: "future_direction_adaptability",
    prompt:
      "What matters most when building a future with someone?",
  },
  "3.8": {
    type: "single_select",
    id: "ambition_support_style",
    prompt:
      "Which dynamic around ambition feels healthiest to you?",
  },
  "3.9": {
    type: "single_select",
    id: "relationship_structure_and_zodiac_lens",
    prompt:
      "Which best describes how you think about structure and lighter compatibility signals?",
    microcopy:
      "Your star sign can be used as a light-touch insight, never as a dealbreaker.",
  },
  "3.10": {
    type: "slider",
    id: "intent_values_flexibility",
    prompt:
      "How flexible are you overall on intent, values, and future fit?",
  },
  "4.1": {
    type: "multi_select",
    id: "lifestyle_identity",
    prompt: "Which lifestyle patterns feel most like you?",
  },
  "4.2": {
    type: "multi_select",
    id: "ideal_weekend_shared_activities",
    prompt:
      "What kind of shared time would help a relationship feel alive?",
    microcopy: "Pick up to 5.",
    maxSelect: 5,
  },
  "4.3": {
    type: "slider_set",
    id: "personality_daily_rhythm",
    prompt: "Where do you naturally sit on these?",
    axes: [
      "party_social_butterfly_to_quiet_alone_time",
      "spontaneous_adventurous_to_scheduled_predictable",
      "emotional_feeling_led_to_logical_practical",
      "curious_intellectual_to_grounded_simple",
      "clean_organised_to_relaxed_flexible",
      "work_first_to_play_balance_first",
    ],
    axisLabels: {
      party_social_butterfly_to_quiet_alone_time:
        "Party / social butterfly ↔ quiet / alone time",
      spontaneous_adventurous_to_scheduled_predictable:
        "Spontaneous / adventurous ↔ scheduled / predictable",
      emotional_feeling_led_to_logical_practical:
        "Emotional / feeling-led ↔ logical / practical",
      curious_intellectual_to_grounded_simple:
        "Curious / intellectual ↔ grounded / simple",
      clean_organised_to_relaxed_flexible:
        "Clean / organised ↔ relaxed / flexible",
      work_first_to_play_balance_first:
        "Work-first ↔ play / balance-first",
    },
  },
  "4.4": {
    type: "single_select",
    id: "friends_family_integration",
    prompt:
      "How much do you want a partner involved with your friends and family?",
  },
  "4.5": {
    type: "single_select",
    id: "everyday_ease_humour",
    prompt:
      "What role does everyday ease and humour play for you?",
  },
  "4.6": {
    type: "slider_set",
    id: "household_responsibility_fit",
    prompt:
      "How important is alignment on home and daily responsibility?",
  },
  "4.7": {
    type: "multi_select",
    id: "communication_style",
    prompt: "How do you naturally communicate interest?",
  },
  "4.8": {
    type: "multi_select",
    id: "social_difference_tolerance",
    prompt:
      "Which social differences could you comfortably work with?",
  },
  "4.9": {
    type: "single_select",
    id: "support_under_stress",
    prompt:
      "When you are stressed or unwell, what support usually helps most?",
  },
  "4.10": {
    type: "slider",
    id: "lifestyle_social_flexibility",
    prompt:
      "How flexible are you on lifestyle, social rhythm, and day-to-day fit?",
  },
  "5.1": {
    type: "multi_select",
    id: "self_energy_markers",
    prompt: "What kind of energy do you naturally give off?",
  },
  "5.2": {
    type: "multi_select",
    id: "intended_impression_markers",
    prompt: "What first impression do you want to give?",
    microcopy: "Pick up to 5.",
    maxSelect: 5,
  },
  "5.3": {
    type: "multi_select",
    id: "energy_vibe_pref",
    prompt: "What kind of energy are you usually drawn to?",
  },
  "5.4": {
    type: "multi_select",
    id: "first_date_chemistry_signals",
    prompt:
      "On a first date, what usually tells you there could be chemistry?",
    microcopy: "Pick up to 5.",
    maxSelect: 5,
  },
  "5.5": {
    type: "single_select",
    id: "sexual_role_or_intimacy_style",
    prompt:
      "What feels most natural for you in physical intimacy?",
    microcopy: "Private and only used to improve compatibility.",
  },
  "5.6": {
    type: "single_select",
    id: "sexual_dynamic_preference",
    prompt: "What dynamic usually works best for you?",
  },
  "5.7": {
    type: "multi_select",
    id: "sexual_satisfaction_drivers",
    prompt: "What makes intimacy feel satisfying for you?",
    microcopy: "Pick up to 5.",
    maxSelect: 5,
  },
  "5.8": {
    type: "slider_set",
    id: "sexual_communication_consent",
    prompt: "How true do these feel for you?",
    microcopy: "Private and only used to improve compatibility.",
  },
  "5.9": {
    type: "multi_select",
    id: "desire_boundaries_turnons",
    prompt:
      "What should compatibility quietly respect around intimacy?",
    microcopy: "Private and only used to improve match fit.",
    maxSelect: 5,
  },
  "5.10": {
    type: "slider",
    id: "vibe_intimacy_flexibility",
    prompt:
      "How flexible are you on chemistry, vibe, and intimacy fit?",
  },
};

function stripLineNumbers(raw = "") {
  return String(raw).replace(/^\d+:\s?/gm, "");
}

function stripQuotes(value = "") {
  return String(value || "")
    .trim()
    .replace(/^["'“”]+/, "")
    .replace(/["'“”]+$/, "");
}

function slugify(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/↔/g, " to ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function isDivider(line = "") {
  return /^[-=]{6,}$/.test(String(line || "").trim());
}

function isQuestionLine(line = "") {
  return /^Q\d+\.\d+\s+—\s+.+$/.test(String(line || "").trim());
}

function isHeadingLine(line = "") {
  const trimmed = String(line || "").trim();
  return (
    !!trimmed &&
    !trimmed.includes(":") &&
    !trimmed.startsWith("-") &&
    /^[A-Z0-9 —&/()+'.-]+$/.test(trimmed)
  );
}

function isFieldLine(line = "") {
  const trimmed = String(line || "").trim();
  const keyMatch = trimmed.match(/^([a-z_]+):/i);
  return keyMatch ? QUESTION_FIELD_KEYS.has(keyMatch[1]) : false;
}

function splitQuestionBlocks(raw) {
  const lines = stripLineNumbers(raw).split(/\r?\n/);
  const blocks = [];
  let current = null;

  for (const line of lines) {
    const match = line.trim().match(/^Q(\d+)\.(\d+)\s+—\s+(.+)$/);
    if (match) {
      if (current) blocks.push(current);
      current = {
        sectionIndex: match[1],
        questionIndex: match[2],
        number: `${match[1]}.${match[2]}`,
        title: stripQuotes(match[3]),
        lines: [],
      };
      continue;
    }
    if (current) current.lines.push(line);
  }

  if (current) blocks.push(current);
  return blocks;
}

function collectFieldLines(lines, startIndex) {
  const collected = [];
  let index = startIndex;

  while (index < lines.length) {
    const rawLine = lines[index];
    const trimmed = rawLine.trim();
    if (isQuestionLine(trimmed) || isDivider(trimmed) || isFieldLine(trimmed)) break;
    if (isHeadingLine(trimmed)) break;
    collected.push(rawLine);
    index += 1;
  }

  return { lines: collected, nextIndex: index };
}

function normalizeFieldLines(lines = []) {
  return lines
    .map((line) => stripQuotes(line.trim()))
    .filter(Boolean);
}

function parseScale(lines = []) {
  const entries = normalizeFieldLines(lines);
  const result = {};
  entries.forEach((entry) => {
    const match = entry.match(/^([^=]+?)\s*=\s*(.+)$/);
    if (match) result[match[1].trim()] = match[2].trim();
  });
  return result;
}

function parseOptionList(lines = []) {
  const options = [];
  const optionLabels = {};

  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = stripQuotes(lines[index].trim());
    if (!trimmed) continue;

    if (trimmed.startsWith("- value:")) {
      const value = trimmed.replace(/^- value:\s*/, "").trim();
      let label = "";
      const nextTrimmed = stripQuotes(lines[index + 1]?.trim() || "");
      if (nextTrimmed.startsWith("label:")) {
        label = nextTrimmed.replace(/^label:\s*/, "").trim();
        index += 1;
      }
      options.push(value);
      if (label) optionLabels[value] = label;
      continue;
    }

    if (trimmed.startsWith("- ")) {
      options.push(trimmed.replace(/^- /, "").trim());
      continue;
    }

    if (trimmed.startsWith("label:") && options.length) {
      optionLabels[options[options.length - 1]] = trimmed.replace(/^label:\s*/, "").trim();
      continue;
    }

    options.push(trimmed);
  }

  return { options, optionLabels };
}

function applyPronounCase(value = "") {
  return String(value || "")
    .replace(/\bi\b/g, "I")
    .replace(/\bi'm\b/gi, "I'm")
    .replace(/\bi'll\b/gi, "I'll")
    .replace(/\bi've\b/gi, "I've")
    .replace(/\bi'd\b/gi, "I'd");
}

function toSentenceCase(value = "") {
  const cleaned = stripQuotes(String(value || "").replaceAll("_", " ").trim());
  if (!cleaned) return "";
  const normalized = applyPronounCase(cleaned.toLowerCase());
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function capitalizeArrowSegments(value = "") {
  if (!String(value).includes("↔")) return value;
  return String(value)
    .split("↔")
    .map((segment) => {
      const trimmed = segment.trim();
      if (!trimmed) return trimmed;
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    })
    .join(" ↔ ");
}

export function formatAssessmentDisplayLabel(value = "") {
  const cleaned = stripQuotes(String(value || "").trim());
  if (!cleaned) return "";
  return capitalizeArrowSegments(cleaned
    .split("/")
    .map((segment) => toSentenceCase(segment))
    .join(" / "));
}

function getUniversalStarSignQuestion() {
  return {
    title: "Relationship Matching with Star Sign Insights",
    prompt: "Which feels most like you?",
    microcopy: "This helps us understand how you approach compatibility and relationship fit.",
    opts: [
      "star_sign_compatibility_matters_to_me",
      "i_like_star_sign_insights",
      "i_dont_really_care_about_star_signs",
      "im_still_figuring_out_relationship_structure",
      "dont_use_star_signs_in_my_matches",
    ],
    optionLabels: {
      star_sign_compatibility_matters_to_me: "Star sign compatibility matters to me",
      i_like_star_sign_insights: "I like star sign insights",
      i_dont_really_care_about_star_signs: "I don’t really care about star signs",
      im_still_figuring_out_relationship_structure: "I’m still figuring out relationship structure",
      dont_use_star_signs_in_my_matches: "Don’t use star signs in my matches",
    },
  };
}

function normalizeOptionLabels(optionLabels = {}) {
  return Object.fromEntries(
    Object.entries(optionLabels).map(([key, label]) => [
      key,
      formatAssessmentDisplayLabel(label),
    ]),
  );
}

function normalizeAxisLabels(axisLabels = {}) {
  return Object.fromEntries(
    Object.entries(axisLabels).map(([key, label]) => [
      key,
      formatAssessmentDisplayLabel(label),
    ]),
  );
}

function parseMarkers(lines = []) {
  return normalizeFieldLines(lines)
    .map((entry) => entry.replace(/^- /, "").trim())
    .filter(Boolean);
}

function parseMarkerMapping(lines = []) {
  return normalizeFieldLines(lines)
    .map((entry) => entry.replace(/^- /, "").trim())
    .map((entry) => {
      const parts = entry.split("→").map((part) => part.trim()).filter(Boolean);
      if (parts.length === 2) return { source: parts[0], marker: parts[1] };
      return { source: entry, marker: entry };
    });
}

function parseAdaptivePrompt(lines = []) {
  return normalizeFieldLines(lines).map((entry) => entry.replace(/^- /, "").trim());
}

function parseAxes(lines = []) {
  const axisLines = normalizeFieldLines(lines).map((entry) =>
    entry.replace(/^- /, "").trim(),
  );
  const axes = [];
  const axisLabels = {};

  axisLines.forEach((entry) => {
    if (entry.includes("↔")) {
      const axisId = slugify(entry);
      axes.push(axisId);
      axisLabels[axisId] = entry;
      return;
    }
    axes.push(entry);
  });

  return { axes, axisLabels };
}

function parseQuestionBlock(block) {
  const question = {
    number: block.number,
    title: block.title,
    sectionIndex: block.sectionIndex,
    questionIndex: block.questionIndex,
  };

  const lines = block.lines;
  let index = 0;
  while (index < lines.length) {
    const trimmed = lines[index].trim();
    if (!trimmed || isDivider(trimmed) || isHeadingLine(trimmed)) {
      index += 1;
      continue;
    }

    const fieldMatch = trimmed.match(/^([a-z_]+):\s*(.*)$/i);
    if (!fieldMatch || !QUESTION_FIELD_KEYS.has(fieldMatch[1])) {
      index += 1;
      continue;
    }

    const key = fieldMatch[1];
    const inlineValue = stripQuotes(fieldMatch[2]);
    const { lines: fieldLines, nextIndex } =
      inlineValue
        ? { lines: [inlineValue], nextIndex: index + 1 }
        : collectFieldLines(lines, index + 1);

    switch (key) {
      case "type":
      case "id":
      case "legacy_id_if_needed":
      case "microcopy":
        question[
          key === "legacy_id_if_needed" ? "legacyId" : key
        ] = normalizeFieldLines(fieldLines).join(" ").trim();
        break;
      case "prompt":
        question.prompt = normalizeFieldLines(fieldLines).join(" ").trim();
        break;
      case "adaptive_prompt":
        question.adaptivePrompt = parseAdaptivePrompt(fieldLines);
        break;
      case "options": {
        const parsed = parseOptionList(fieldLines);
        question.opts = parsed.options;
        question.optionLabels = { ...(question.optionLabels || {}), ...parsed.optionLabels };
        break;
      }
      case "shared_options": {
        const parsed = parseOptionList(fieldLines);
        question.sharedOptions = parsed.options;
        question.sharedOptionLabels = parsed.optionLabels;
        break;
      }
      case "adaptive_options_if_masculine_attraction": {
        const parsed = parseOptionList(fieldLines);
        question.masculineOptions = parsed.options;
        question.masculineOptionLabels = parsed.optionLabels;
        break;
      }
      case "adaptive_options_if_feminine_attraction": {
        const parsed = parseOptionList(fieldLines);
        question.feminineOptions = parsed.options;
        question.feminineOptionLabels = parsed.optionLabels;
        break;
      }
      case "axes": {
        const parsed = parseAxes(fieldLines);
        question.axes = parsed.axes;
        question.axisLabels = parsed.axisLabels;
        break;
      }
      case "scale":
        question.scale = parseScale(fieldLines);
        break;
      case "selection_rule": {
        const selectionRule = normalizeFieldLines(fieldLines).join(" ").trim();
        question.selectionRule = selectionRule;
        const maxSelectMatch = selectionRule.match(/(?:up to|top)\s+(\d+)/i);
        if (maxSelectMatch) question.maxSelect = Number(maxSelectMatch[1]);
        break;
      }
      case "markers":
        question.markers = parseMarkers(fieldLines);
        break;
      case "marker_mapping":
        question.markerMapping = parseMarkerMapping(fieldLines);
        break;
      case "measures":
        question.measures = parseMarkers(fieldLines);
        break;
      case "important":
        question.important = normalizeFieldLines(fieldLines).join(" ").trim();
        break;
      default:
        break;
    }

    index = nextIndex;
  }

  if (question.scale) {
    question.minLabel = question.scale["0"] || question.scale.low || question.scale.min;
    question.maxLabel = question.scale["1"] || question.scale.high || question.scale.max;
  }

  return question;
}

function parseFinalMarkers(raw) {
  const text = stripLineNumbers(raw);
  const startIndex = text.search(/FINAL .* OUTPUT MARKERS/i);
  if (startIndex === -1) return {};

  const lines = text.slice(startIndex).split(/\r?\n/);
  const output = {};
  let currentSectionKey = "";

  lines.forEach((line) => {
    const trimmed = stripQuotes(line.trim());
    if (!trimmed || isDivider(trimmed)) return;
    if (/FINAL .* OUTPUT MARKERS/i.test(trimmed)) return;

    const headingMatch = trimmed.match(/^(Attraction\s*&\s*Type|Romantic Pattern|Intent\s*&\s*Values|Lifestyle\s*&\s*Social Fit|First Impression\s*&\s*Vibe):$/i);
    if (headingMatch) {
      const normalizedHeading = headingMatch[1].toLowerCase();
      if (normalizedHeading.includes("attraction")) currentSectionKey = "type";
      else if (normalizedHeading.includes("romantic")) currentSectionKey = "romantic_pattern";
      else if (normalizedHeading.includes("intent")) currentSectionKey = "intent_values";
      else if (normalizedHeading.includes("lifestyle")) currentSectionKey = "lifestyle";
      else if (normalizedHeading.includes("first impression")) currentSectionKey = "presentation";
      if (!output[currentSectionKey]) output[currentSectionKey] = [];
      return;
    }

    if (currentSectionKey && trimmed.startsWith("- ")) {
      output[currentSectionKey].push(trimmed.replace(/^- /, "").trim());
    }
  });

  return output;
}

function getBisexualDiscoverPreference(routeContext = {}) {
  const explicit = String(
    routeContext.currentDiscoverPreference ||
      routeContext.bisexualFilter ||
      "",
  ).trim();
  if (["prefer_guys", "prefer_girls", "show_mix"].includes(explicit)) return explicit;

  if (routeContext.lookingFor === "men") return "prefer_guys";
  if (routeContext.lookingFor === "women") return "prefer_girls";
  return "show_mix";
}

function isFeminineIdentity(genderIdentity = "") {
  return ["female", "trans_female"].includes(genderIdentity);
}

function getAdaptivePrompt(question, routeContext = {}) {
  if (!Array.isArray(question.adaptivePrompt) || question.adaptivePrompt.length === 0) {
    return question.prompt;
  }

  const discoverPreference = getBisexualDiscoverPreference(routeContext);
  const genderIdentity = routeContext.genderIdentity || "male";
  const preferredPromptKeys = [];

  if (isFeminineIdentity(genderIdentity)) {
    if (discoverPreference === "prefer_girls") preferredPromptKeys.push("female + prefer girls");
    if (discoverPreference === "prefer_guys") preferredPromptKeys.push("female + prefer guys");
  } else {
    if (discoverPreference === "prefer_girls") preferredPromptKeys.push("male + prefer girls");
    if (discoverPreference === "prefer_guys") preferredPromptKeys.push("male + prefer guys");
  }
  preferredPromptKeys.push("show mix");

  for (const key of preferredPromptKeys) {
    const match = question.adaptivePrompt.find((entry) =>
      entry.toLowerCase().startsWith(`${key}:`),
    );
    if (match) return match.split(":").slice(1).join(":").trim();
  }

  return question.prompt;
}

function mergeResolvedOptions(optionGroups = []) {
  const values = [];
  const optionLabels = {};

  optionGroups.forEach(({ values: groupValues = [], labels = {} }) => {
    groupValues.forEach((value) => {
      if (!values.includes(value)) values.push(value);
      if (labels[value]) optionLabels[value] = labels[value];
    });
  });

  return { values, optionLabels };
}

function getBisexualResolvedOptions(question, routeContext = {}) {
  if (!question.masculineOptions && !question.feminineOptions && !question.sharedOptions) {
    return { values: question.opts || [], optionLabels: question.optionLabels || {} };
  }

  const discoverPreference = getBisexualDiscoverPreference(routeContext);
  const groups = [];

  if (discoverPreference === "prefer_guys") {
    groups.push({
      values: question.masculineOptions || [],
      labels: question.masculineOptionLabels || {},
    });
  } else if (discoverPreference === "prefer_girls") {
    groups.push({
      values: question.feminineOptions || [],
      labels: question.feminineOptionLabels || {},
    });
  } else {
    groups.push({
      values: question.masculineOptions || [],
      labels: question.masculineOptionLabels || {},
    });
    groups.push({
      values: question.feminineOptions || [],
      labels: question.feminineOptionLabels || {},
    });
  }

  groups.push({
    values: question.sharedOptions || [],
    labels: question.sharedOptionLabels || {},
  });

  const merged = mergeResolvedOptions(groups);
  return merged.values.length
    ? merged
    : { values: question.opts || [], optionLabels: question.optionLabels || {} };
}

function normalizeQuestion(question, routeContext = {}) {
  const resolved = { ...question };
  const resolvedOptions = getBisexualResolvedOptions(question, routeContext);
  resolved.opts = resolvedOptions.values;
  resolved.optionLabels = normalizeOptionLabels(resolvedOptions.optionLabels);
  resolved.axisLabels = normalizeAxisLabels(question.axisLabels || {});
  resolved.prompt = getAdaptivePrompt(question, routeContext) || question.prompt || question.title;
  if (resolved.minLabel) resolved.minLabel = formatAssessmentDisplayLabel(resolved.minLabel);
  if (resolved.maxLabel) resolved.maxLabel = formatAssessmentDisplayLabel(resolved.maxLabel);
  if (resolved.id === "relationship_structure_and_zodiac_lens") {
    const universalStarSignQuestion = getUniversalStarSignQuestion();
    resolved.title = universalStarSignQuestion.title;
    resolved.prompt = universalStarSignQuestion.prompt;
    resolved.microcopy = universalStarSignQuestion.microcopy;
    resolved.opts = universalStarSignQuestion.opts;
    resolved.optionLabels = normalizeOptionLabels(universalStarSignQuestion.optionLabels);
  }
  return resolved;
}

function buildSections(questions, finalMarkers, routeContext = {}) {
  return SECTION_DEFINITIONS.map((definition) => {
    const sectionQuestions = questions
      .filter((question) => question.sectionIndex === definition.index)
      .map((question) => normalizeQuestion(question, routeContext));

    return {
      id: definition.id,
      title: definition.title,
      number: definition.number,
      quote: definition.quote,
      why: definition.why,
      summary: definition.summary,
      finalMarkers: finalMarkers[definition.id] || [],
      questions: sectionQuestions,
    };
  });
}

function parseAssessment(raw) {
  const questions = splitQuestionBlocks(raw).map(parseQuestionBlock);
  const finalMarkers = parseFinalMarkers(raw);
  return { questions, finalMarkers };
}

const PARSED_GAY = parseAssessment(gayDocRaw);
const PARSED_BISEXUAL = parseAssessment(bisexualDocRaw);
const PARSED_LESBIAN = parseAssessment(lesbianDocRaw);
const PARSED_TRANS_NONBINARY = parseAssessment(transNonbinaryDocRaw);
const PARSED_STRAIGHT = (() => {
  const blocks = splitQuestionBlocks(straightDocRaw).map(parseQuestionBlock);
  const finalMarkers = parseFinalMarkers(straightDocRaw);

  const femaleSectionOne = blocks.slice(0, 10);
  const maleSectionOne = blocks.slice(10, 20);
  const sharedQuestions = blocks.slice(20).map((question) => {
    const metadata = STRAIGHT_SHARED_QUESTION_METADATA[question.number] || {};
    const merged = {
      ...question,
      ...metadata,
      optionLabels: {
        ...(question.optionLabels || {}),
        ...(metadata.optionLabels || {}),
      },
      axisLabels: {
        ...(question.axisLabels || {}),
        ...(metadata.axisLabels || {}),
      },
    };
    if (metadata.maxSelect && !merged.maxSelect) merged.maxSelect = metadata.maxSelect;
    if (metadata.axes) merged.axes = metadata.axes;
    return merged;
  });

  return { femaleSectionOne, maleSectionOne, sharedQuestions, finalMarkers };
})();

export function getFinalAssessmentSections(routeContext = {}) {
  if (routeContext.routeOrientation === "gay") {
    return buildSections(PARSED_GAY.questions, PARSED_GAY.finalMarkers, routeContext);
  }

  if (routeContext.routeOrientation === "lesbian") {
    return buildSections(
      PARSED_LESBIAN.questions,
      PARSED_LESBIAN.finalMarkers,
      routeContext,
    );
  }

  if (routeContext.routeOrientation === "bisexual") {
    return buildSections(
      PARSED_BISEXUAL.questions,
      PARSED_BISEXUAL.finalMarkers,
      routeContext,
    );
  }

  if (routeContext.routeOrientation === "trans_nonbinary") {
    return buildSections(
      PARSED_TRANS_NONBINARY.questions,
      PARSED_TRANS_NONBINARY.finalMarkers,
      routeContext,
    );
  }

  if (routeContext.routeOrientation === "straight") {
    const sectionOneQuestions = isFeminineIdentity(routeContext.genderIdentity)
      ? PARSED_STRAIGHT.femaleSectionOne
      : PARSED_STRAIGHT.maleSectionOne;
    return buildSections(
      [...sectionOneQuestions, ...PARSED_STRAIGHT.sharedQuestions],
      PARSED_STRAIGHT.finalMarkers,
      routeContext,
    );
  }

  return buildSections(PARSED_GAY.questions, PARSED_GAY.finalMarkers, routeContext);
}

function deriveMarkersFromQuestion(question, answer) {
  if (answer === undefined || answer === null) return [];

  const derived = new Set();
  const markerMapping = Array.isArray(question.markerMapping)
    ? question.markerMapping
    : [];

  if (question.type === "slider" && markerMapping.length) {
    const value = Array.isArray(answer) ? answer[0] : Number(answer);
    if (Number.isFinite(value)) {
      const bucket = value <= 0.33 ? "low_score" : value >= 0.67 ? "high_score" : "mid_score";
      markerMapping
        .filter((entry) => entry.source === bucket)
        .forEach((entry) => derived.add(entry.marker));
    }
  } else if ((question.type === "single_select" || question.type === "multi_select") && markerMapping.length) {
    const answers = Array.isArray(answer) ? answer : [answer];
    answers.forEach((selected) => {
      markerMapping
        .filter((entry) => entry.source === selected)
        .forEach((entry) => derived.add(entry.marker));
    });
  }

  if (Array.isArray(question.markers)) {
    question.markers.forEach((marker) => derived.add(marker));
  }

  return [...derived];
}

function buildSectionOutput(section, answersByIndex = {}) {
  const questionOutputs = {};
  const derivedMarkers = new Set();

  section.questions.forEach((question, index) => {
    const answer = answersByIndex[index];
    const questionMarkers = deriveMarkersFromQuestion(question, answer);
    questionMarkers.forEach((marker) => derivedMarkers.add(marker));
    questionOutputs[question.id || question.number || `q_${index + 1}`] = {
      number: question.number,
      title: question.title,
      type: question.type,
      answer,
      markers: questionMarkers,
      markerMapping: question.markerMapping || [],
    };
  });

  return {
    sectionId: section.id,
    title: section.title,
    summary: section.summary,
    answers: questionOutputs,
    derivedMarkers: [...derivedMarkers],
    finalMarkerCatalog: section.finalMarkers || [],
  };
}

export function buildCompatibilityProfileOutput({
  sections = [],
  sectionAnswers = {},
  routeContext = {},
}) {
  const sectionOutputs = {};
  sections.forEach((section) => {
    sectionOutputs[section.id] = buildSectionOutput(
      section,
      sectionAnswers[section.id] || {},
    );
  });

  const compatibilityAnswers = {
    sexualVariant: routeContext.sexualVariant,
    routeOrientation: routeContext.routeOrientation,
    assessmentVariant: routeContext.compatibilityAssessment,
    sections: sectionOutputs,
  };

  const compatibilityMarkerOutput = {
    sexualVariant: routeContext.sexualVariant,
    routeOrientation: routeContext.routeOrientation,
    assessmentVariant: routeContext.compatibilityAssessment,
    profileMarkerFramework: routeContext.profileMarkerFramework,
    attractionFramework: routeContext.attractionFramework,
    intimacyFramework: routeContext.intimacyFramework,
    sections: Object.fromEntries(
      Object.entries(sectionOutputs).map(([sectionId, output]) => [
        sectionId,
        {
          derivedMarkers: output.derivedMarkers,
          finalMarkerCatalog: output.finalMarkerCatalog,
        },
      ]),
    ),
  };

  return {
    sexual_variant: routeContext.sexualVariant,
    assessment_variant: routeContext.compatibilityAssessment,
    compatibility_sections_version: "tether_final_master_v1",
    compatibility_answers: JSON.stringify(compatibilityAnswers),
    compatibility_marker_output: JSON.stringify(compatibilityMarkerOutput),
    type_marker: JSON.stringify({
      orientation: routeContext.routeOrientation,
      ...sectionOutputs.type,
    }),
    romantic_pattern_marker: JSON.stringify(sectionOutputs.romantic_pattern || {}),
    intent_values_marker: JSON.stringify(sectionOutputs.intent_values || {}),
    lifestyle_marker: JSON.stringify(sectionOutputs.lifestyle || {}),
    presentation_marker: JSON.stringify(sectionOutputs.presentation || {}),
  };
}

export function getAssessmentSectionCount(routeContext = {}) {
  return getFinalAssessmentSections(routeContext).length;
}
