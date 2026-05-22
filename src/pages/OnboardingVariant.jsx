/**
 * OnboardingVariant — shared shell for straight, bisexual, lesbian, trans/non-binary flows.
 * Receives `orientation` prop and adapts language / calibration pool accordingly.
 * Same structure and step count as /onboarding-gay. Only text + photos differ.
 */
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { localApp } from "@/api/localClient";
import { useTier } from "../hooks/useTier";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ArrowRight, ArrowLeft, Sparkles, Heart, ShieldCheck, Camera, CheckCircle2, CreditCard, Scan, ChevronDown, SlidersHorizontal, CalendarDays, Gem, Wand2, Route, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getMembershipTheme } from "@/brand/membershipTheme";
import LocationAvailabilitySelector from "@/components/LocationAvailabilitySelector";
import HeightInputField from "@/components/onboarding/HeightInputField";
import EducationField from "@/components/onboarding/EducationField";
import OnboardingSelectField from "@/components/onboarding/OnboardingSelectField";
import OnboardingMultiSelectField from "@/components/onboarding/OnboardingMultiSelectField";
import DevPill from "@/components/dev/DevPill";
import { shouldEnableDevTools } from "@/components/dev/devToolsVisibility";
import TetherIntroLayout from "@/components/TetherIntroLayout";
import HowTetherWorksFlow from "@/components/HowTetherWorksFlow";
import { HOW_TETHER_WORKS_PAGES } from "@/data/howTetherWorksPages";
import { getMembershipRoute, getOnboardingRoute } from "@/lib/matchFlowRoutes";
import {
  GENDER_IDENTITY_OPTIONS,
  SEXUAL_PREFERENCE_OPTIONS,
  LOOKING_FOR_OPTIONS,
  determineCompatibilityVariant,
  normalizeGenderIdentity,
  normalizeLookingFor,
  normalizeSexualPreference,
  saveOnboardingDraft,
  loadOnboardingDraft,
  clearOnboardingDraft,
} from "@/lib/compatibilityVariantRouting";
import {
  buildCompatibilityProfileOutput,
  formatAssessmentDisplayLabel,
  getFinalAssessmentSections,
} from "@/lib/finalCompatibilityAssessments";
import {
  applyDefaultProfileDetails,
  buildEducationData,
  buildHeightData,
  CHILDREN_OPTIONS,
  DATING_INTENTION_OPTIONS,
  DRINKING_OPTIONS,
  EDUCATION_LEVEL_OPTIONS,
  ETHNICITY_OPTIONS,
  FUTURE_FAMILY_DESIRE_OPTIONS,
  getAgeFromDob,
  getDemoAutoFillCopy,
  getDerivedStarSign,
  getDobIso,
  GREEN_FLAGS_OPTIONS,
  LANGUAGE_OPTIONS,
  PET_OPTIONS,
  POLITICS_OPTIONS,
  PRONOUN_OPTIONS,
  RELATIONSHIP_RHYTHM_OPTIONS,
  RELIGION_OPTIONS,
  SMALL_THINGS_I_VALUE_OPTIONS,
  SMOKING_OPTIONS,
  SOCIAL_ENERGY_OPTIONS,
  DRUGS_OPTIONS,
  ONBOARDING_DEFAULT_MULTI,
} from "@/lib/onboardingProfile";

// ─── Shared constants ────────────────────────────────────────────────────────
const GENDERS = GENDER_IDENTITY_OPTIONS;
const SEXUAL_PREFERENCES = SEXUAL_PREFERENCE_OPTIONS.map((label) => ({ label, value: label.toLowerCase() }));
const LOOKING_FOR = LOOKING_FOR_OPTIONS.map((label) => ({
  label,
  value:
    label === "Men"
      ? "men"
      : label === "Women"
        ? "women"
        : label === "Men & Women"
          ? "men_women"
          : label === "Non-binary people"
            ? "non_binary_people"
            : "open_to_all",
}));

function Chip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className="onboarding-control px-3 py-1.5 rounded-xl text-[13px] font-medium border transition-all text-left"
      data-selected={selected ? "true" : "false"}
      aria-pressed={selected}
      type="button"
    >
      {label}
    </button>
  );
}

function scrollToTopSmooth() {
  if (typeof window === "undefined") return;
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function numericInput(value, maxLength) {
  return String(value || "").replace(/\D/g, "").slice(0, maxLength);
}

function getStoredGenderLabel() {
  const stored = String(localStorage.getItem("tether_user_gender") || "").toLowerCase();
  if (stored === "female") return "Female";
  if (stored === "trans_female") return "Trans female";
  if (stored === "trans_male") return "Trans male";
  if (stored === "non_binary") return "Non-binary";
  if (stored === "male") return "Male";
  return "";
}

const STRAIGHT_MASTER_COMPAT = [
  {
    id: "type", title: "Your Type", number: "01",
    quote: "Attraction is personal. The more clearly we understand your type, the more naturally we can tailor who you see.",
    why: "This helps us understand the looks, traits, and presentation styles you're most drawn to — and how flexible that attraction is.",
    questions: [
      { id: "overall_attraction_direction", title: "Overall Attraction Direction", type: "slider", prompt: "What overall look are you usually most drawn to?", minLabel: "Soft / gentle", maxLabel: "Sharp / defined" },
      { id: "face_aesthetic_pref", title: "Face & Presence Type", type: "multi_select", maxSelect: 10, prompt: "Which overall looks tend to feel like your type?", microcopy: "Select all that feel honest.", opts: ["cute_soft","classic_handsome_or_pretty","rugged_confident","polished_refined","striking_editorial","mature_sophisticated","warm_gentle","distinctive_presence","naturally_attractive","not_sure_yet"] },
      { id: "grooming_style_pref", title: "Grooming & Self-Care", type: "multi_select", prompt: "Which presentation styles do you find attractive?", opts: ["clean_put_together","natural_low_effort","very_well_groomed","slightly_undone_or_scruffy","intentional_style","healthy_fresh","polished_confident","expressive_presentation","looks_after_themselves","no_strong_preference"] },
      { id: "presentation_detail_pref", title: "Presentation Details", type: "multi_select", prompt: "Which presentation details tend to catch your attention?", opts: ["clean_shaven","facial_hair_or_stubble","natural_look","polished_beauty","minimal_style","bold_style","tattoos","piercings","glasses","jewellery","body_hair","no_strong_preference"] },
      { id: "hair_style_pref", title: "Hair & Head Look", type: "multi_select", prompt: "Which hair styles or head looks are you usually drawn to?", opts: ["shaved_or_bald","buzz_or_close_crop","short_clean","textured_short","medium_flow","long_hair","curly_or_natural_texture","dyed_or_alternative","polished_style","no_strong_preference"] },
      { id: "face_detail_pref", title: "Facial Details", type: "multi_select", maxSelect: 5, prompt: "What facial details tend to stand out most to you?", microcopy: "Select up to 5.", opts: ["nice_smile","bright_eyes","expressive_eyes","strong_features","soft_features","defined_jaw_or_bone_structure","warm_friendly_expression","intense_look","distinctive_face","natural_ease"] },
      { id: "body_type_pref", title: "Body & Physical Build", type: "multi_select", prompt: "Which body types do you usually find attractive?", opts: ["slim","lean","athletic","toned","muscular","broad","curvy","soft_natural","stocky","no_strong_preference"] },
      { id: "style_visual_pref", title: "Style & Visual Signals", type: "multi_select", maxSelect: 6, prompt: "Which style signals make someone more your type?", microcopy: "Pick your top 6.", opts: ["clean_cut","sporty","casual","rugged","artsy","minimal","fashion_forward","streetwear","classic_elegant","soft_feminine","masculine_confident","androgynous","alternative","professional_polished"] },
      { id: "attraction_reality_check", title: "Attraction Reality Check", type: "single_select", prompt: "Looking back, who have you actually had the best chemistry with?", opts: ["exactly_my_usual_type","close_to_my_type_but_not_exact","someone_who_surprised_me","personality_changed_the_attraction","chemistry_mattered_more_than_type","i_am_still_learning_my_type"] },
      { id: "your_type_flexibility", title: "Attraction Flexibility", type: "slider", prompt: "How flexible are you on your physical type overall?", minLabel: "Very specific", maxLabel: "Very open" },
    ],
  },
  {
    id: "romantic_pattern", title: "Romantic Pattern", number: "02",
    quote: "What has worked for you before — and what hasn't — often reveals more than preference alone.",
    why: "This helps us learn your dating patterns, what tends to repeat, and what kind of connection is more likely to feel healthy and lasting.",
    questions: [
      { id: "past_dating_types", title: "Past Dating Patterns", type: "multi_select", prompt: "Which kinds of people have you dated or been drawn to before?", opts: ["emotionally_available","emotionally_unavailable","fun_adventurous","serious_stable","confident_assertive","soft_sensitive","ambitious_driven","creative_free_spirited","nurturing_caring","independent_distant","high_chemistry_low_stability","calm_grounded","expressive_intense","low_key_private","socially_outgoing","inconsistent_mixed_signals","relationship_ready","still_figuring_things_out","traditional_or_complementary_dynamic"] },
      { id: "worked_in_past", title: "What Actually Worked", type: "multi_select", maxSelect: 5, prompt: "Which kinds of people have actually worked best for you?", microcopy: "Pick up to 5.", opts: ["emotionally_available","calm_grounded","consistent_reliable","communicative","affectionate_warm","relationship_ready","emotionally_mature","aligned_on_values","easy_to_be_with","strong_chemistry","supportive_of_my_goals","safe_to_be_myself"] },
      { id: "didnt_last_pattern", title: "Exciting but Didn't Last", type: "multi_select", maxSelect: 5, prompt: "Which patterns have felt exciting but usually didn't last?", microcopy: "Pick up to 5.", opts: ["emotionally_unavailable","inconsistent_mixed_signals","intense_fast_start","high_chemistry_low_stability","avoidant_guarded","chaotic_unpredictable","overly_independent","attractive_but_misaligned","fun_but_not_serious","different_life_stage","confusing_intensity_with_security","potential_over_reality"] },
      { id: "closeness_pattern", title: "Closeness Pattern", type: "single_select", prompt: "When you start liking someone, what feels most familiar?", opts: ["steady_and_open","want_reassurance_quickly","hold_back_and_protect_myself","want_closeness_then_feel_overwhelmed","chemistry_first_clarity_later","i_take_time_to_trust"] },
      { id: "conflict_response", title: "Conflict Response", type: "single_select", prompt: "When tension comes up, I usually…", opts: ["address_it_directly","need_time_then_talk","avoid_it_and_hope_it_fades","get_emotionally_reactive","go_quiet_and_withdraw","try_to_keep_the_peace"] },
      { id: "conflict_repair_skills", title: "Conflict Repair", type: "slider_set", prompt: "How do you usually repair after tension?", axes: ["i_can_apologise_when_i_am_wrong","i_can_hear_difficult_feedback_without_shutting_down","i_can_stay_respectful_when_i_am_hurt","i_can_maintain_boundaries_without_becoming_cold","i_try_to_learn_from_conflict_instead_of_repeating_it"] },
      { id: "emotional_safety_support", title: "Emotional Safety & Support", type: "slider_set", prompt: "What helps a relationship feel emotionally safe for you?", axes: ["i_can_express_needs_without_fear_of_judgment","i_feel_emotionally_understood_and_validated","i_can_support_someone_through_stress_or_illness","sensitive_past_experiences_can_be_handled_with_care","calm_repair_after_difficult_moments_matters_to_me"] },
      { id: "humour_resilience", title: "Humour & Resilience", type: "single_select", prompt: "What role does humour play when things get difficult?", opts: ["essential_shared_laughter_helps_me_reconnect","important_especially_during_stress","nice_to_have_but_not_essential","i_prefer_calm_seriousness_over_humour","it_depends_on_the_person"] },
      { id: "relationship_challenge_pattern", title: "Pattern Awareness", type: "multi_select", prompt: "In dating, what tends to be hardest for you?", opts: ["being_fully_myself","communicating_through_problems","maintaining_boundaries","repeating_the_same_pattern","choosing_unavailable_people","moving_too_fast","struggling_to_open_up","avoiding_difficult_conversations","focusing_on_potential_over_reality","confusing_chemistry_with_compatibility","people_pleasing","losing_interest_when_it_becomes_real","unclear_expectations_around_roles_or_pace"] },
      { id: "romantic_pattern_flexibility", title: "Romantic Pattern Flexibility", type: "slider", prompt: "How open are you to dating outside your usual pattern?", minLabel: "Past patterns strongly define", maxLabel: "Very open to different" },
    ],
  },
  {
    id: "intent_values", title: "Intent & Values", number: "03",
    quote: "The right connection starts with wanting similar things — and being ready for them.",
    why: "This helps us understand what you want right now, what matters most to you, and what kind of future fit is important.",
    questions: [
      { id: "relationship_intent", title: "Relationship Intent", type: "single_select", prompt: "What are you looking for right now?", opts: ["long_term_partner","serious_relationship","open_to_see_where_it_goes","casual_but_meaningful","casual_low_pressure"] },
      { id: "relationship_readiness", title: "Relationship Readiness", type: "single_select", prompt: "How ready do you feel for a relationship right now?", opts: ["fully_ready","mostly_ready","unsure_but_open","want_connection_not_full_commitment","still_rebuilding_after_past_experience"] },
      { id: "core_relationship_need", title: "Core Relationship Need", type: "single_select", prompt: "What do you most need from a relationship right now?", opts: ["stability","enjoyment","care","deep_understanding","growth","exploration","emotional_safety"] },
      { id: "core_values", title: "Core Values", type: "multi_select", maxSelect: 6, prompt: "Which relationship values matter most to you?", microcopy: "Pick up to 6.", opts: ["emotional_stability","ambition","independence","affection","consistency","fun_adventure","loyalty","growth","family","confidence","humour","calm","reliability","emotional_maturity","openness","kindness"] },
      { id: "worldview_values_alignment", title: "Values, Worldview & Meaning", type: "slider_set", prompt: "How important is alignment on these deeper areas?", axes: ["core_beliefs_and_moral_compass","life_goals_and_direction","spiritual_or_philosophical_outlook","openness_to_deeper_conversations","shared_sense_of_what_makes_life_meaningful"] },
      { id: "future_alignment_topics", title: "Future Alignment Topics", type: "multi_select", prompt: "Which future topics matter most to align on?", opts: ["marriage","children_parenting_or_family_building","where_to_live","career_ambition","finances","religion_spirituality","family_closeness","relationship_structure","household_or_care_responsibilities","lifestyle_priorities"] },
      { id: "future_direction_adaptability", title: "Future Direction & Adaptability", type: "slider_set", prompt: "What matters most when building a future with someone?", axes: ["moving_toward_common_goals","being_able_to_compromise_without_losing_myself","reassessing_the_future_openly_as_life_changes","handling_unexpected_obstacles_as_a_team","supporting_each_others_personal_direction"] },
      { id: "ambition_support_style", title: "Ambition & Mutual Support", type: "single_select", prompt: "Which dynamic around ambition feels healthiest to you?", opts: ["we_actively_encourage_each_others_goals","we_support_each_other_but_keep_careers_separate","one_persons_ambition_can_take_priority_at_times","i_need_a_partner_whose_pace_matches_mine_closely","i_am_still_working_out_career_and_relationship_balance"] },
      { id: "relationship_structure_and_zodiac_lens", title: "Relationship Matching with Star Sign Insights", type: "single_select", prompt: "Which feels most like you?", microcopy: "This helps us understand how you approach compatibility and relationship fit.", opts: ["star_sign_compatibility_matters_to_me","i_like_star_sign_insights","i_dont_really_care_about_star_signs","im_still_figuring_out_relationship_structure","dont_use_star_signs_in_my_matches"] },
      { id: "intent_values_flexibility", title: "Intent & Values Flexibility", type: "slider", prompt: "How flexible are you overall on intent, values, and future fit?", minLabel: "Very specific", maxLabel: "Open on some things" },
    ],
  },
  {
    id: "lifestyle", title: "Lifestyle & Social Fit", number: "04",
    quote: "Real compatibility lives in the everyday — not just in chemistry.",
    why: "This helps us learn how you live, socialise, communicate, and build your day-to-day life — so matches feel natural in the real world.",
    questions: [
      { id: "lifestyle_identity", title: "Lifestyle Identity", type: "multi_select", prompt: "Which lifestyle patterns feel most like you?", opts: ["social_and_outgoing","low_key_and_private","routine_oriented","spontaneous","family_or_friend_group_connected","independent_social_life","saver","spender","career_first","balance_first","planner","flexible","wellness_focused","nightlife_oriented","culture_or_creativity_led"] },
      { id: "ideal_weekend_shared_activities", title: "Ideal Weekend & Shared Activities", type: "multi_select", maxSelect: 5, prompt: "What kind of shared time would help a relationship feel alive?", microcopy: "Pick up to 5.", opts: ["food_and_restaurants","fitness_or_sport","travel_or_weekends_away","culture_museums_events","nightlife","home_comfort","intellectual_conversation","creative_projects","nature_outdoors","shared_friend_groups","family_time","quiet_routine_together"] },
      { id: "personality_daily_rhythm", title: "Personality & Daily Rhythm", type: "slider_set", prompt: "Where do you naturally sit on these?", axes: ["party_social_butterfly_to_quiet_alone_time","spontaneous_adventurous_to_scheduled_predictable","emotional_feeling_led_to_logical_practical","curious_intellectual_to_grounded_simple","clean_organised_to_relaxed_flexible","work_first_to_play_balance_first"] },
      { id: "friends_family_integration", title: "Friends, Family & Social Circles", type: "single_select", prompt: "How much do you want a partner involved with your friends and family?", opts: ["very_involved","gradually_integrated","separate_but_respectful","depends_on_the_relationship","not_a_major_factor"] },
      { id: "everyday_ease_humour", title: "Everyday Ease & Humour", type: "single_select", prompt: "What role does everyday ease and humour play for you?", opts: ["essential_shared_laughter_helps_me_feel_close","important_especially_during_stress","nice_to_have_but_not_essential","i_prefer_calm_seriousness_over_constant_humour","it_depends_on_the_person"] },
      { id: "household_responsibility_fit", title: "Home & Daily Responsibility", type: "slider_set", prompt: "How important is alignment on home and daily responsibility?", axes: ["cleanliness_and_organisation","sharing_household_responsibilities_fairly","talking_openly_about_expectations","adjusting_responsibilities_when_life_changes","showing_appreciation_for_everyday_contributions"] },
      { id: "communication_style", title: "Communication Style", type: "multi_select", prompt: "How do you naturally communicate interest?", opts: ["frequent_messages","steady_not_constant","more_in_person_than_text","playful_flirty","thoughtful_deeper","practical_check_ins","affectionate_reassurance","space_then_reconnection"] },
      { id: "social_difference_tolerance", title: "Social Difference Tolerance", type: "multi_select", prompt: "Which social differences could you comfortably work with?", opts: ["different_social_energy","different_friendship_groups","different_family_closeness","different_nightlife_preferences","different_public_affection_comfort","different_alone_time_needs","different_travel_or_adventure_needs","different_work_intensity"] },
      { id: "support_under_stress", title: "Support Under Stress", type: "single_select", prompt: "When you are stressed or unwell, what support usually helps most?", opts: ["comfort_and_reassurance","practical_help","space_then_support","humour_and_lightness","direct_problem_solving","quiet_presence"] },
      { id: "lifestyle_social_flexibility", title: "Lifestyle & Social Flexibility", type: "slider", prompt: "How flexible are you on lifestyle, social rhythm, and day-to-day fit?", minLabel: "Need close alignment", maxLabel: "Open if connection works" },
    ],
  },
  {
    id: "presentation", title: "First Impression & Vibe", number: "05",
    quote: "Chemistry is more than looks — it's how someone comes across, and how that feels in real life.",
    why: "This helps us understand the energy you give off, the energy you're drawn to, and the kind of chemistry that feels believable and mutual.",
    questions: [
      { id: "self_energy_markers", title: "Natural Energy", type: "multi_select", prompt: "What kind of energy do you naturally give off?", opts: ["polished","relaxed","creative","professional","sporty","warm","understated","confident","playful","reserved","intense","gentle"] },
      { id: "intended_impression_markers", title: "Intended First Impression", type: "multi_select", maxSelect: 5, prompt: "What first impression do you want to give?", microcopy: "Pick up to 5.", opts: ["attractive","approachable","high_quality","fun","serious_about_dating","warm","confident","emotionally_available","stylish","grounded","interesting","safe_to_be_around"] },
      { id: "energy_vibe_pref", title: "Energy You're Drawn To", type: "multi_select", prompt: "What kind of energy are you usually drawn to?", opts: ["polished","relaxed","creative","grounded","confident","soft","high_energy","understated","emotionally_open","playful","intellectually_curious","calm"] },
      { id: "first_date_chemistry_signals", title: "First Date Chemistry Signals", type: "multi_select", maxSelect: 5, prompt: "On a first date, what usually tells you there could be chemistry?", microcopy: "Pick up to 5.", opts: ["easy_laughter","natural_conversation","strong_eye_contact","physical_presence","shared_values_come_through","flirtation_feels_mutual","comfortable_silences","emotional_openness","similar_humour","i_feel_calm_and_interested","they_feel_like_themselves","there_is_real_curiosity"] },
      { id: "sexual_role", title: "Physical Intimacy Style", type: "single_select", prompt: "What feels most natural for you in physical intimacy?", opts: ["more_initiating","more_receptive","balanced_equal","clearly_complementary","depends_on_connection","still_exploring"] },
      { id: "sexual_dynamic_preference", title: "Sexual Dynamic Preference", type: "single_select", prompt: "What dynamic usually works best for you?", opts: ["complementary_dynamic","balanced_equal_dynamic","flexible_depends_on_connection","emotionally_led_chemistry","varies_by_person","still_exploring"] },
      { id: "sexual_satisfaction_drivers", title: "What Makes Intimacy Feel Satisfying", type: "multi_select", maxSelect: 5, prompt: "What makes intimacy feel satisfying for you?", microcopy: "Pick up to 5.", opts: ["strong_chemistry","emotional_safety","feeling_desired","clear_communication","playfulness","physical_confidence","affection_before_and_after","exploration_and_openness","consistency","feeling_fully_present","trust","tenderness"] },
      { id: "sexual_communication_consent", title: "Sexual Communication & Consent", type: "slider_set", prompt: "How true do these feel for you?", microcopy: "Private and only used to improve compatibility.", axes: ["i_can_tell_or_show_a_partner_what_i_need","i_can_speak_up_if_something_does_not_feel_right","i_am_comfortable_discussing_sex","i_am_responsive_when_a_partner_suggests_something_new","i_want_turn_ons_and_turn_offs_to_be_respected"] },
      { id: "desire_boundaries_turnons", title: "Desire, Boundaries & Turn-Ons", type: "multi_select", maxSelect: 5, prompt: "What should compatibility quietly respect around intimacy?", microcopy: "Private and only used to improve match fit.", opts: ["i_need_emotional_safety_before_sexual_chemistry_builds","i_value_open_conversations_about_turn_ons_and_turn_offs","i_like_playful_flirting_and_visible_attraction","i_enjoy_exploring_when_trust_is_there","i_prefer_a_steady_familiar_sexual_rhythm","i_need_clear_boundaries_to_be_respected","i_am_comfortable_hearing_about_a_partners_desires","i_prefer_to_keep_sexual_details_private_until_there_is_trust","public_flirting_matters_to_me","i_need_body_confidence_and_comfort","sexual_health_and_protection_conversations_matter"] },
      { id: "vibe_intimacy_flexibility", title: "Vibe & Intimacy Flexibility", type: "slider", prompt: "How flexible are you on chemistry, vibe, and intimacy fit?", minLabel: "Very specific", maxLabel: "Very open" },
    ],
  },
];

// ─── Calibration photo pools per orientation ──────────────────────────────────
const MALE_PROFILES = [
  { name: "James", age: 28, photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop", bio: "Architecture nerd, weekend hiker" },
  { name: "Marcus", age: 32, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop", bio: "Chef by day, traveller always" },
  { name: "Daniel", age: 35, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop", bio: "Tech founder, world traveller" },
  { name: "Ryan", age: 29, photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop", bio: "Fitness coach, brunch lover" },
  { name: "Oliver", age: 31, photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop", bio: "Creative director, theatre addict" },
];

const FEMALE_PROFILES = [
  { name: "Sophie", age: 28, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop", bio: "Gallery curator, weekend yoga" },
  { name: "Mia", age: 31, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop", bio: "Marketing director, adventurous cook" },
  { name: "Chloe", age: 29, photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop", bio: "Architect, occasional hiker" },
  { name: "Elena", age: 33, photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop&sat=-50", bio: "Solicitor, frequent traveller" },
  { name: "Ava", age: 27, photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop", bio: "Documentary filmmaker, vinyl collector" },
];

const DIVERSE_PROFILES = [
  ...FEMALE_PROFILES.slice(0, 3),
  ...MALE_PROFILES.slice(0, 2),
];

// ─── Orientation config ───────────────────────────────────────────────────────
const ORIENTATION_CONFIG = {
  straight: {
    welcome: "A curated dating platform built around trust, real compatibility, and meaningful real-world dates.",
    calibrationProfiles: (gender) =>
      gender?.toLowerCase() === "female" ? MALE_PROFILES : FEMALE_PROFILES,
    compat: STRAIGHT_MASTER_COMPAT,
  },

  lesbian: {
    welcome: "A curated dating platform built around trust, real compatibility, and meaningful real-world dates.",
    calibrationProfiles: () => FEMALE_PROFILES,
    compat: [
      {
        id: "type", title: "Your Type", number: "01",
        quote: "Attraction is personal. The more clearly we understand your type, the more naturally we can tailor who you see.",
        why: "This helps us understand what draws you in — the presence, energy, and dynamic you're most naturally attracted to.",
        questions: [
          { id: "overall_attraction_direction", title: "Overall Attraction Direction", type: "slider", prompt: "What overall look are you usually most drawn to?", minLabel: "Soft / feminine", maxLabel: "Sharp / androgynous / masc" },
          { id: "face_aesthetic_pref", title: "Face & Presence Type", type: "multi_select", maxSelect: 10, prompt: "Which overall looks tend to feel like your type?", microcopy: "Select all that feel honest.", opts: ["soft_feminine","polished_feminine","masc_of_center","androgynous","sporty_natural","artsy_editorial","mature_grounded","warm_gentle","distinctive_presence","not_sure_yet"] },
          { id: "grooming_style_pref", title: "Grooming & Self-Care", type: "multi_select", prompt: "Which presentation styles do you find attractive?", opts: ["clean_put_together","natural_low_effort","very_well_groomed","intentional_style","sporty_fresh","effortless_confident","soft_and_polished","expressive_presentation","looks_after_themselves","no_strong_preference"] },
          { id: "presentation_detail_pref", title: "Presentation Details", type: "multi_select", prompt: "Which beauty or presentation details tend to stand out to you?", opts: ["minimal_makeup","polished_makeup","natural_look","bold_beauty","low_maintenance_style","intentional_beauty","glasses","jewellery","tattoos","piercings","no_strong_preference"] },
          { id: "hair_style_pref", title: "Hair & Head Look", type: "multi_select", prompt: "Which hair styles or head looks are you usually drawn to?", opts: ["shaved_or_close_crop","pixie_short","clean_bob","textured_short","medium_soft_flow","long_hair","curly_or_natural_texture","dyed_or_alternative","polished_style","no_strong_preference"] },
          { id: "face_detail_pref", title: "Facial Details", type: "multi_select", maxSelect: 5, prompt: "What facial details tend to stand out most to you?", microcopy: "Select up to 5.", opts: ["nice_smile","expressive_eyes","bright_eyes","strong_bone_structure","soft_features","warm_friendly_expression","confident_presence","intense_look","distinctive_face","natural_ease"] },
          { id: "body_type_pref", title: "Body & Physical Build", type: "multi_select", prompt: "Which body types do you usually find attractive?", opts: ["slim","lean","athletic","toned","curvy","broad_shouldered","soft_natural","muscular","no_strong_preference"] },
          { id: "style_visual_pref", title: "Style & Visual Signals", type: "multi_select", maxSelect: 6, prompt: "Which style signals make someone more your type?", microcopy: "Pick your top 6.", opts: ["femme","masc_of_center","androgynous","sporty","casual","artsy","minimal","fashion_forward","classic_elegant","alternative","professional_polished","glasses","tattoos","piercings","jewellery"] },
          { id: "attraction_reality_check", title: "Attraction Reality Check", type: "single_select", prompt: "Looking back, who have you actually had the best chemistry with?", opts: ["exactly_my_usual_type","close_to_my_type_but_not_exact","someone_who_surprised_me","personality_changed_the_attraction","chemistry_mattered_more_than_type","presentation_mattered_less_once_we_connected","i_am_still_learning_my_type"] },
          { id: "your_type_flexibility", title: "Attraction Flexibility", type: "slider", prompt: "How flexible are you on your physical type overall?", minLabel: "Very specific", maxLabel: "Very open" },
        ],
      },
      {
        id: "romantic_pattern", title: "Romantic Pattern", number: "02",
        quote: "What has worked for you before — and what hasn't — often reveals more than preference alone.",
        why: "This helps us understand your relationship history, what tends to repeat, and what kind of connection is healthier for you.",
        questions: [
          { id: "past_dating_types", title: "Past Dating Patterns", type: "multi_select", prompt: "Which kinds of people have you dated or been drawn to before?", opts: ["emotionally_available","emotionally_unavailable","fun_adventurous","serious_stable","confident_assertive","soft_sensitive","ambitious_driven","creative_free_spirited","nurturing_caring","independent_distant","high_chemistry_low_stability","calm_grounded","expressive_intense","low_key_private","socially_outgoing","avoidant_guarded","affectionate_warm","inconsistent_mixed_signals","relationship_ready","still_figuring_out_identity_or_readiness","queer_affirming_and_safe"] },
          { id: "worked_in_past", title: "What Actually Worked", type: "multi_select", maxSelect: 5, prompt: "Which kinds of people have actually worked best for you?", microcopy: "Pick up to 5.", opts: ["emotionally_available","calm_grounded","consistent_reliable","communicative","affectionate_warm","relationship_ready","emotionally_mature","aligned_on_values","easy_to_be_with","strong_chemistry","supportive_of_my_goals","safe_to_be_myself","identity_safe_and_affirming","reciprocal_in_energy_and_care"] },
          { id: "didnt_last_pattern", title: "Exciting but Didn't Last", type: "multi_select", maxSelect: 5, prompt: "Which patterns have felt exciting but usually didn't last?", microcopy: "Pick up to 5.", opts: ["emotionally_unavailable","inconsistent_mixed_signals","intense_fast_start","high_chemistry_low_stability","avoidant_guarded","chaotic_unpredictable","overly_independent","attractive_but_misaligned","fun_but_not_serious","different_life_stage","emotional_pace_mismatch","visibility_or_outness_mismatch","confusing_intensity_with_security","potential_over_reality"] },
          { id: "closeness_pattern", title: "Closeness Pattern", type: "single_select", prompt: "When you start liking someone, what feels most familiar?", opts: ["steady_and_open","want_reassurance_quickly","hold_back_and_protect_myself","want_closeness_then_feel_overwhelmed","chemistry_first_clarity_later","i_take_time_to_trust"] },
          { id: "conflict_response", title: "Conflict Response", type: "single_select", prompt: "When tension comes up, I usually…", opts: ["address_it_directly","need_time_then_talk","avoid_it_and_hope_it_fades","get_emotionally_reactive","go_quiet_and_withdraw","try_to_keep_the_peace"] },
          { id: "conflict_repair_skills", title: "Conflict Repair", type: "slider_set", prompt: "How do you usually repair after tension?", axes: ["i_can_apologise_when_i_am_wrong","i_can_hear_difficult_feedback_without_shutting_down","i_can_stay_respectful_when_i_am_hurt","i_can_maintain_boundaries_without_becoming_cold","i_try_to_learn_from_conflict_instead_of_repeating_it"] },
          { id: "emotional_safety_support", title: "Emotional Safety & Support", type: "slider_set", prompt: "What helps a relationship feel emotionally safe for you?", axes: ["i_can_express_needs_without_fear_of_judgment","i_feel_emotionally_understood_and_validated","i_can_support_someone_through_stress_or_illness","sensitive_past_experiences_can_be_handled_with_care","calm_repair_after_difficult_moments_matters_to_me"] },
          { id: "humour_resilience", title: "Humour & Resilience", type: "single_select", prompt: "What role does humour play when things get difficult?", opts: ["essential_shared_laughter_helps_me_reconnect","important_especially_during_stress","nice_to_have_but_not_essential","i_prefer_calm_seriousness_over_humour","it_depends_on_the_person"] },
          { id: "relationship_challenge_pattern", title: "Pattern Awareness", type: "multi_select", prompt: "In dating, what tends to be hardest for you?", opts: ["being_fully_myself","communicating_through_problems","maintaining_boundaries","repeating_the_same_pattern","choosing_unavailable_people","moving_too_fast_emotionally","struggling_to_open_up","avoiding_difficult_conversations","focusing_on_potential_over_reality","confusing_chemistry_with_compatibility","people_pleasing","losing_interest_when_it_becomes_real","different_levels_of_outness_or_visibility","losing_myself_in_the_connection"] },
          { id: "romantic_pattern_flexibility", title: "Romantic Pattern Flexibility", type: "slider", prompt: "How open are you to dating outside your usual pattern?", minLabel: "Past patterns strongly define", maxLabel: "Very open to different" },
        ],
      },
      {
        id: "intent_values", title: "Intent & Values", number: "03",
        quote: "The right connection starts with wanting similar things — and being ready for them.",
        why: "This helps us understand what you want right now and what a meaningful future looks like.",
        questions: [
          { id: "relationship_intent", title: "Relationship Intent", type: "single_select", prompt: "What are you looking for right now?", opts: ["long_term_partner","serious_relationship","open_to_see_where_it_goes","casual_but_meaningful","casual_low_pressure"] },
          { id: "relationship_readiness", title: "Relationship Readiness", type: "single_select", prompt: "How ready do you feel for a relationship right now?", opts: ["fully_ready","mostly_ready","unsure_but_open","want_connection_not_full_commitment","still_rebuilding_after_past_experience"] },
          { id: "core_relationship_need", title: "Core Relationship Need", type: "single_select", prompt: "What do you most need from a relationship right now?", opts: ["stability","enjoyment","care","deep_understanding","growth","exploration","emotional_safety"] },
          { id: "core_values", title: "Core Values", type: "multi_select", maxSelect: 6, prompt: "Which relationship values matter most to you?", microcopy: "Pick up to 6.", opts: ["emotional_stability","ambition","independence","affection","consistency","fun_adventure","loyalty","growth","family","confidence","humour","calm","reliability","emotional_maturity","openness","kindness"] },
          { id: "worldview_values_alignment", title: "Values, Worldview & Meaning", type: "slider_set", prompt: "How important is alignment on these deeper areas?", axes: ["core_beliefs_and_moral_compass","life_goals_and_direction","spiritual_or_philosophical_outlook","openness_to_deeper_conversations","shared_sense_of_what_makes_life_meaningful"] },
          { id: "future_alignment_topics", title: "Future Alignment Topics", type: "multi_select", prompt: "Which future topics matter most to align on?", opts: ["marriage","children_parenting_or_family_building","where_to_live","career_ambition","finances","religion_spirituality","family_closeness","relationship_structure","queer_community_or_visibility","lifestyle_priorities"] },
          { id: "future_direction_adaptability", title: "Future Direction & Adaptability", type: "slider_set", prompt: "What matters most when building a future with someone?", axes: ["moving_toward_common_goals","being_able_to_compromise_without_losing_myself","reassessing_the_future_openly_as_life_changes","handling_unexpected_obstacles_as_a_team","supporting_each_others_personal_direction"] },
          { id: "ambition_support_style", title: "Ambition & Mutual Support", type: "single_select", prompt: "Which dynamic around ambition feels healthiest to you?", opts: ["we_actively_encourage_each_others_goals","we_support_each_other_but_keep_careers_separate","one_persons_ambition_can_take_priority_at_times","i_need_a_partner_whose_pace_matches_mine_closely","i_am_still_working_out_career_and_relationship_balance"] },
          { id: "relationship_structure_and_zodiac_lens", title: "Relationship Matching with Star Sign Insights", type: "single_select", prompt: "Which feels most like you?", microcopy: "This helps us understand how you approach compatibility and relationship fit.", opts: ["star_sign_compatibility_matters_to_me","i_like_star_sign_insights","i_dont_really_care_about_star_signs","im_still_figuring_out_relationship_structure","dont_use_star_signs_in_my_matches"] },
          { id: "intent_values_flexibility", title: "Intent & Values Flexibility", type: "slider", prompt: "How flexible are you overall on intent, values, and future fit?", minLabel: "Very specific", maxLabel: "Open on some things" },
        ],
      },
      {
        id: "lifestyle", title: "Lifestyle & Social Fit", number: "04",
        quote: "Real compatibility lives in the everyday — not just in chemistry.",
        why: "This helps us understand your lifestyle rhythm so matches feel natural beyond the first date.",
        questions: [
          { id: "lifestyle_identity", title: "Lifestyle Identity", type: "multi_select", prompt: "Which lifestyle patterns feel most like you?", opts: ["social_and_outgoing","low_key_and_private","routine_oriented","spontaneous","queer_community_connected","non_scene","saver","spender","career_first","balance_first","planner","flexible","wellness_focused","nightlife_oriented","culture_or_creativity_led"] },
          { id: "ideal_weekend_shared_activities", title: "Ideal Weekend & Shared Activities", type: "multi_select", maxSelect: 5, prompt: "What kind of shared time would help a relationship feel alive?", microcopy: "Pick up to 5.", opts: ["food_and_restaurants","fitness_or_sport","travel_or_weekends_away","culture_museums_events","nightlife","home_comfort","intellectual_conversation","creative_projects","nature_outdoors","shared_friend_groups","family_time","quiet_routine_together"] },
          { id: "personality_daily_rhythm", title: "Personality & Daily Rhythm", type: "slider_set", prompt: "Where do you naturally sit on these?", axes: ["party_social_butterfly_to_quiet_alone_time","spontaneous_adventurous_to_scheduled_predictable","emotional_feeling_led_to_logical_practical","curious_intellectual_to_grounded_simple","clean_organised_to_relaxed_flexible","work_first_to_play_balance_first"] },
          { id: "friends_family_integration", title: "Friends, Family & Social Circles", type: "single_select", prompt: "How much do you want a partner involved with your friends, family, or chosen family?", opts: ["very_involved","gradually_integrated","separate_but_respectful","depends_on_the_relationship","not_a_major_factor"] },
          { id: "everyday_ease_humour", title: "Everyday Ease & Humour", type: "single_select", prompt: "What role does everyday ease and humour play for you?", opts: ["essential_shared_laughter_helps_me_feel_close","important_especially_during_stress","nice_to_have_but_not_essential","i_prefer_calm_seriousness_over_constant_humour","it_depends_on_the_person"] },
          { id: "household_responsibility_fit", title: "Home & Daily Responsibility", type: "slider_set", prompt: "How important is alignment on home and daily responsibility?", axes: ["cleanliness_and_organisation","sharing_household_responsibilities_fairly","talking_openly_about_expectations","adjusting_responsibilities_when_life_changes","showing_appreciation_for_everyday_contributions"] },
          { id: "communication_style", title: "Communication Style", type: "multi_select", prompt: "How do you naturally communicate interest?", opts: ["frequent_messages","steady_not_constant","more_in_person_than_text","playful_flirty","thoughtful_deeper","practical_check_ins","affectionate_reassurance","space_then_reconnection"] },
          { id: "social_difference_tolerance", title: "Social Difference Tolerance", type: "multi_select", prompt: "Which social differences could you comfortably work with?", opts: ["different_social_energy","different_friendship_groups","different_family_closeness","different_nightlife_preferences","different_public_affection_comfort","different_alone_time_needs","different_travel_or_adventure_needs","different_work_intensity","different_levels_of_outness_or_public_visibility","different_queer_community_connection_needs"] },
          { id: "support_under_stress", title: "Support Under Stress", type: "single_select", prompt: "When you are stressed or unwell, what support usually helps most?", opts: ["comfort_and_reassurance","practical_help","space_then_support","humour_and_lightness","direct_problem_solving","quiet_presence"] },
          { id: "lifestyle_social_flexibility", title: "Lifestyle & Social Flexibility", type: "slider", prompt: "How flexible are you on lifestyle, social rhythm, and day-to-day fit?", minLabel: "Need close alignment", maxLabel: "Open if connection works" },
        ],
      },
      {
        id: "presentation", title: "First Impression & Vibe", number: "05",
        quote: "Chemistry is more than looks — it's how someone comes across, and how that feels in real life.",
        why: "This helps us understand how you come across and what kind of presence makes you feel genuinely seen.",
        questions: [
          { id: "self_energy_markers", title: "Natural Energy", type: "multi_select", prompt: "What kind of energy do you naturally give off?", opts: ["polished","relaxed","creative","professional","sporty","warm","understated","confident","playful","reserved","intense","gentle"] },
          { id: "intended_impression_markers", title: "Intended First Impression", type: "multi_select", maxSelect: 5, prompt: "What first impression do you want to give?", microcopy: "Pick up to 5.", opts: ["attractive","approachable","high_quality","fun","serious_about_dating","warm","confident","emotionally_available","stylish","grounded","interesting","safe_to_be_around"] },
          { id: "energy_vibe_pref", title: "Energy You're Drawn To", type: "multi_select", prompt: "What kind of energy are you usually drawn to?", opts: ["polished","relaxed","creative","grounded","confident","soft","high_energy","understated","emotionally_open","playful","intellectually_curious","calm"] },
          { id: "first_date_chemistry_signals", title: "First Date Chemistry Signals", type: "multi_select", maxSelect: 5, prompt: "On a first date, what usually tells you there could be chemistry?", microcopy: "Pick up to 5.", opts: ["easy_laughter","natural_conversation","strong_eye_contact","physical_presence","shared_values_come_through","flirtation_feels_mutual","comfortable_silences","emotional_openness","similar_humour","i_feel_calm_and_interested","they_feel_like_themselves","there_is_real_curiosity","emotional_pace_feels_mutual"] },
          { id: "sexual_role_or_intimacy_style", title: "Physical Intimacy Style", type: "single_select", prompt: "What feels most natural for you in physical intimacy?", microcopy: "Private and only used to improve compatibility.", opts: ["more_initiating","more_receptive","balanced_reciprocal","soft_complementary","depends_on_connection","still_exploring"] },
          { id: "sexual_dynamic_preference", title: "Sexual Dynamic Preference", type: "single_select", prompt: "What dynamic usually works best for you?", microcopy: "Private and only used to improve compatibility.", opts: ["soft_complementary_dynamic","balanced_equal_dynamic","flexible_depends_on_connection","emotionally_led_chemistry","reciprocity_first_dynamic","still_exploring"] },
          { id: "sexual_satisfaction_drivers", title: "What Makes Intimacy Feel Satisfying", type: "multi_select", maxSelect: 5, prompt: "What makes intimacy feel satisfying for you?", microcopy: "Pick up to 5.", opts: ["strong_chemistry","emotional_safety","feeling_desired","clear_communication","reciprocity","playfulness","physical_confidence","affection_before_and_after","exploration_and_openness","consistency","feeling_fully_present","trust","tenderness","emotional_depth"] },
          { id: "sexual_communication_consent", title: "Sexual Communication & Consent", type: "slider_set", prompt: "How true do these feel for you?", microcopy: "Private and only used to improve compatibility.", axes: ["i_can_tell_or_show_a_partner_what_i_need","i_can_speak_up_if_something_does_not_feel_right","i_am_comfortable_discussing_intimacy","i_am_responsive_when_a_partner_suggests_something_new","i_want_turn_ons_and_turn_offs_to_be_respected"] },
          { id: "desire_boundaries_turnons", title: "Desire, Boundaries & Turn-Ons", type: "multi_select", maxSelect: 5, prompt: "What should compatibility quietly respect around intimacy?", microcopy: "Private and only used to improve match fit.", opts: ["i_need_emotional_safety_before_sexual_chemistry_builds","i_value_open_conversations_about_turn_ons_and_turn_offs","i_like_playful_flirting_and_visible_attraction","i_enjoy_exploring_when_trust_is_there","i_prefer_a_steady_familiar_sexual_rhythm","i_need_clear_boundaries_to_be_respected","i_am_comfortable_hearing_about_a_partners_desires","i_prefer_to_keep_sexual_details_private_until_there_is_trust","public_affection_comfort_matters","outness_or_visibility_alignment_matters","identity_respect_and_emotional_safety","affection_outside_sex_matters","sexual_health_conversations_matter"] },
          { id: "vibe_intimacy_flexibility", title: "Vibe & Intimacy Flexibility", type: "slider", prompt: "How flexible are you on chemistry, vibe, and intimacy fit?", minLabel: "Very specific", maxLabel: "Very open" },
        ],
      },
    ],
  },

  bisexual: {
    welcome: "A curated dating platform built around trust, real compatibility, and meaningful real-world dates.",
    calibrationProfiles: () => DIVERSE_PROFILES,
    compat: [
      {
        id: "type", title: "Your Type", number: "01",
        quote: "Attraction is personal. The more clearly we understand your type, the more naturally we can tailor who you see.",
        why: "This helps us understand the looks, traits, and presentation styles you're most drawn to — and how flexible that attraction is.",
        questions: [
          { id: "overall_attraction_direction", title: "Overall Attraction Direction", type: "slider", prompt: "What overall look are you usually most drawn to?", minLabel: "Soft", maxLabel: "Sharp / defined" },
          { id: "face_aesthetic_pref", title: "Face & Presence Type", type: "multi_select", maxSelect: 10, prompt: "Which overall looks tend to feel like your type?", microcopy: "Select all that feel honest.", opts: ["cute_soft","handsome_classic","rugged_confident","pretty_refined","striking_editorial","mature_sophisticated","warm_gentle","androgynous","distinctive_presence","not_sure_yet"] },
          { id: "grooming_style_pref", title: "Grooming & Self-Care", type: "multi_select", prompt: "Which presentation styles do you find attractive?", opts: ["clean_put_together","natural_low_effort","very_well_groomed","slightly_scruffy_or_undone","intentional_style","healthy_fresh","polished_confident","expressive_presentation","looks_after_themselves","no_strong_preference"] },
          { id: "presentation_detail_pref", title: "Presentation Details", type: "multi_select", prompt: "Which presentation details tend to stand out to you?", opts: ["clean_shaven","light_stubble","beard_or_facial_hair","minimal_makeup","polished_beauty","natural_look","bold_style","glasses","jewellery","body_hair","no_strong_preference"] },
          { id: "hair_style_pref", title: "Hair & Head Look", type: "multi_select", prompt: "Which hair styles or head looks are you usually drawn to?", opts: ["shaved_or_very_short","pixie_or_short_crop","clean_short","textured_short","medium_soft_flow","long_hair","curly_or_natural_texture","dyed_or_alternative","polished_style","no_strong_preference"] },
          { id: "face_detail_pref", title: "Facial Details", type: "multi_select", maxSelect: 5, prompt: "What facial details tend to stand out most to you?", microcopy: "Select up to 5.", opts: ["nice_smile","bright_eyes","expressive_eyes","strong_features","soft_features","defined_bone_structure","intense_look","warm_friendly_expression","distinctive_face","natural_ease"] },
          { id: "body_type_pref", title: "Body & Physical Build", type: "multi_select", prompt: "Which body types do you usually find attractive?", opts: ["slim","lean","athletic","toned","muscular","broad","curvy","soft_natural","stocky","no_strong_preference"] },
          { id: "style_visual_pref", title: "Style & Visual Signals", type: "multi_select", maxSelect: 6, prompt: "Which style signals make someone more your type?", microcopy: "Pick your top 6.", opts: ["clean_cut","sporty","casual","rugged","artsy","minimal","fashion_forward","classic_elegant","femme","masc_of_center","androgynous","alternative","glasses","tattoos","piercings","jewellery","professional_polished"] },
          { id: "attraction_reality_check", title: "Attraction Reality Check", type: "single_select", prompt: "Looking back, who have you actually had the best chemistry with?", opts: ["exactly_my_usual_type","close_to_my_type_but_not_exact","someone_who_surprised_me","personality_changed_the_attraction","chemistry_mattered_more_than_type","different_genders_brought_out_different_chemistry","i_am_still_learning_my_type"] },
          { id: "your_type_flexibility", title: "Attraction Flexibility", type: "slider", prompt: "How flexible are you on your physical type overall?", minLabel: "Very specific", maxLabel: "Very open" },
        ],
      },
      {
        id: "romantic_pattern", title: "Romantic Pattern", number: "02",
        quote: "What has worked for you before — and what hasn't — often reveals more than preference alone.",
        why: "This helps us understand your relationship patterns and what makes connection more likely to last.",
        questions: [
          { id: "past_dating_types", title: "Past Dating Patterns", type: "multi_select", prompt: "Which kinds of people have you dated or been drawn to before?", opts: ["emotionally_available","emotionally_unavailable","fun_adventurous","serious_stable","confident_assertive","soft_sensitive","ambitious_driven","creative_free_spirited","nurturing_caring","independent_distant","high_chemistry_low_stability","calm_grounded","expressive_intense","low_key_private","socially_outgoing","avoidant_guarded","affectionate_warm","inconsistent_mixed_signals","relationship_ready","still_figuring_things_out","different_dynamics_with_different_genders"] },
          { id: "worked_in_past", title: "What Actually Worked", type: "multi_select", maxSelect: 5, prompt: "Which kinds of people have actually worked best for you?", microcopy: "Pick up to 5.", opts: ["emotionally_available","calm_grounded","consistent_reliable","communicative","affectionate_warm","relationship_ready","emotionally_mature","aligned_on_values","easy_to_be_with","strong_chemistry","supportive_of_my_goals","safe_to_be_myself","respected_my_bisexuality"] },
          { id: "didnt_last_pattern", title: "Exciting but Didn't Last", type: "multi_select", maxSelect: 5, prompt: "Which patterns have felt exciting but usually didn't last?", microcopy: "Pick up to 5.", opts: ["emotionally_unavailable","inconsistent_mixed_signals","intense_fast_start","high_chemistry_low_stability","avoidant_guarded","chaotic_unpredictable","overly_independent","attractive_but_misaligned","fun_but_not_serious","different_life_stage","assumptions_about_my_bisexuality","confusing_intensity_with_security","potential_over_reality"] },
          { id: "closeness_pattern", title: "Closeness Pattern", type: "single_select", prompt: "When you start liking someone, what feels most familiar?", opts: ["steady_and_open","want_reassurance_quickly","hold_back_and_protect_myself","want_closeness_then_feel_overwhelmed","chemistry_first_clarity_later","i_take_time_to_trust"] },
          { id: "conflict_response", title: "Conflict Response", type: "single_select", prompt: "When tension comes up, I usually…", opts: ["address_it_directly","need_time_then_talk","avoid_it_and_hope_it_fades","get_emotionally_reactive","go_quiet_and_withdraw","try_to_keep_the_peace"] },
          { id: "conflict_repair_skills", title: "Conflict Repair", type: "slider_set", prompt: "How do you usually repair after tension?", axes: ["i_can_apologise_when_i_am_wrong","i_can_hear_difficult_feedback_without_shutting_down","i_can_stay_respectful_when_i_am_hurt","i_can_maintain_boundaries_without_becoming_cold","i_try_to_learn_from_conflict_instead_of_repeating_it"] },
          { id: "emotional_safety_support", title: "Emotional Safety & Support", type: "slider_set", prompt: "What helps a relationship feel emotionally safe for you?", axes: ["i_can_express_needs_without_fear_of_judgment","i_feel_emotionally_understood_and_validated","i_can_support_someone_through_stress_or_illness","sensitive_past_experiences_can_be_handled_with_care","calm_repair_after_difficult_moments_matters_to_me"] },
          { id: "humour_resilience", title: "Humour & Resilience", type: "single_select", prompt: "What role does humour play when things get difficult?", opts: ["essential_shared_laughter_helps_me_reconnect","important_especially_during_stress","nice_to_have_but_not_essential","i_prefer_calm_seriousness_over_humour","it_depends_on_the_person"] },
          { id: "relationship_challenge_pattern", title: "Pattern Awareness", type: "multi_select", prompt: "In dating, what tends to be hardest for you?", opts: ["being_fully_myself","communicating_through_problems","maintaining_boundaries","repeating_the_same_pattern","choosing_unavailable_people","moving_too_fast","struggling_to_open_up","avoiding_difficult_conversations","focusing_on_potential_over_reality","confusing_chemistry_with_compatibility","people_pleasing","losing_interest_when_it_becomes_real","not_knowing_when_i_need_more_balance_or_variety","feeling_boxed_in_by_assumptions"] },
          { id: "romantic_pattern_flexibility", title: "Romantic Pattern Flexibility", type: "slider", prompt: "How open are you to dating outside your usual pattern?", minLabel: "Past patterns strongly define", maxLabel: "Very open to different" },
        ],
      },
      {
        id: "intent_values", title: "Intent & Values", number: "03",
        quote: "The right connection starts with wanting similar things and being ready for them.",
        why: "This helps us understand what you want now and what matters most to you going forward.",
        questions: [
          { id: "relationship_intent", title: "Relationship Intent", type: "single_select", prompt: "What are you looking for right now?", opts: ["long_term_partner","serious_relationship","open_to_see_where_it_goes","casual_but_meaningful","casual_low_pressure"] },
          { id: "relationship_readiness", title: "Relationship Readiness", type: "single_select", prompt: "How ready do you feel for a relationship right now?", opts: ["fully_ready","mostly_ready","unsure_but_open","want_connection_not_full_commitment","still_rebuilding_after_past_experience"] },
          { id: "core_relationship_need", title: "Core Relationship Need", type: "single_select", prompt: "What do you most need from a relationship right now?", opts: ["stability","enjoyment","care","deep_understanding","growth","exploration","emotional_safety"] },
          { id: "core_values", title: "Core Values", type: "multi_select", maxSelect: 6, prompt: "Which relationship values matter most to you?", microcopy: "Pick up to 6.", opts: ["emotional_stability","ambition","independence","affection","consistency","fun_adventure","loyalty","growth","family","confidence","humour","calm","reliability","emotional_maturity","openness","kindness"] },
          { id: "worldview_values_alignment", title: "Values, Worldview & Meaning", type: "slider_set", prompt: "How important is alignment on these deeper areas?", axes: ["core_beliefs_and_moral_compass","life_goals_and_direction","spiritual_or_philosophical_outlook","openness_to_deeper_conversations","shared_sense_of_what_makes_life_meaningful"] },
          { id: "future_alignment_topics", title: "Future Alignment Topics", type: "multi_select", prompt: "Which future topics matter most to align on?", opts: ["marriage","children_parenting_or_family_building","where_to_live","career_ambition","finances","religion_spirituality","family_closeness","relationship_structure","identity_or_orientation_respect","lifestyle_priorities"] },
          { id: "future_direction_adaptability", title: "Future Direction & Adaptability", type: "slider_set", prompt: "What matters most when building a future with someone?", axes: ["moving_toward_common_goals","being_able_to_compromise_without_losing_myself","reassessing_the_future_openly_as_life_changes","handling_unexpected_obstacles_as_a_team","supporting_each_others_personal_direction"] },
          { id: "ambition_support_style", title: "Ambition & Mutual Support", type: "single_select", prompt: "Which dynamic around ambition feels healthiest to you?", opts: ["we_actively_encourage_each_others_goals","we_support_each_other_but_keep_careers_separate","one_persons_ambition_can_take_priority_at_times","i_need_a_partner_whose_pace_matches_mine_closely","i_am_still_working_out_career_and_relationship_balance"] },
          { id: "relationship_structure_and_zodiac_lens", title: "Relationship Matching with Star Sign Insights", type: "single_select", prompt: "Which feels most like you?", microcopy: "This helps us understand how you approach compatibility and relationship fit.", opts: ["star_sign_compatibility_matters_to_me","i_like_star_sign_insights","i_dont_really_care_about_star_signs","im_still_figuring_out_relationship_structure","dont_use_star_signs_in_my_matches"] },
          { id: "intent_values_flexibility", title: "Intent & Values Flexibility", type: "slider", prompt: "How flexible are you overall on intent, values, and future fit?", minLabel: "Very specific", maxLabel: "Open on some things" },
        ],
      },
      {
        id: "lifestyle", title: "Lifestyle & Social Fit", number: "04",
        quote: "Real compatibility lives in the everyday — not just in chemistry.",
        why: "This helps us understand your lifestyle so we can match you with people who fit naturally.",
        questions: [
          { id: "lifestyle_identity", title: "Lifestyle Identity", type: "multi_select", prompt: "Which lifestyle patterns feel most like you?", opts: ["social_and_outgoing","low_key_and_private","routine_oriented","spontaneous","community_connected","non_scene","saver","spender","career_first","balance_first","planner","flexible","wellness_focused","nightlife_oriented","culture_or_creativity_led"] },
          { id: "ideal_weekend_shared_activities", title: "Ideal Weekend & Shared Activities", type: "multi_select", maxSelect: 5, prompt: "What kind of shared time would help a relationship feel alive?", microcopy: "Pick up to 5.", opts: ["food_and_restaurants","fitness_or_sport","travel_or_weekends_away","culture_museums_events","nightlife","home_comfort","intellectual_conversation","creative_projects","nature_outdoors","shared_friend_groups","family_time","quiet_routine_together"] },
          { id: "personality_daily_rhythm", title: "Personality & Daily Rhythm", type: "slider_set", prompt: "Where do you naturally sit on these?", axes: ["party_social_butterfly_to_quiet_alone_time","spontaneous_adventurous_to_scheduled_predictable","emotional_feeling_led_to_logical_practical","curious_intellectual_to_grounded_simple","clean_organised_to_relaxed_flexible","work_first_to_play_balance_first"] },
          { id: "friends_family_integration", title: "Friends, Family & Social Circles", type: "single_select", prompt: "How much do you want a partner involved with your friends and family?", opts: ["very_involved","gradually_integrated","separate_but_respectful","depends_on_the_relationship","not_a_major_factor"] },
          { id: "everyday_ease_humour", title: "Everyday Ease & Humour", type: "single_select", prompt: "What role does everyday ease and humour play for you?", opts: ["essential_shared_laughter_helps_me_feel_close","important_especially_during_stress","nice_to_have_but_not_essential","i_prefer_calm_seriousness_over_constant_humour","it_depends_on_the_person"] },
          { id: "household_responsibility_fit", title: "Home & Daily Responsibility", type: "slider_set", prompt: "How important is alignment on home and daily responsibility?", axes: ["cleanliness_and_organisation","sharing_household_responsibilities_fairly","talking_openly_about_expectations","adjusting_responsibilities_when_life_changes","showing_appreciation_for_everyday_contributions"] },
          { id: "communication_style", title: "Communication Style", type: "multi_select", prompt: "How do you naturally communicate interest?", opts: ["frequent_messages","steady_not_constant","more_in_person_than_text","playful_flirty","thoughtful_deeper","practical_check_ins","affectionate_reassurance","space_then_reconnection"] },
          { id: "social_difference_tolerance", title: "Social Difference Tolerance", type: "multi_select", prompt: "Which social differences could you comfortably work with?", opts: ["different_social_energy","different_friendship_groups","different_family_closeness","different_nightlife_preferences","different_public_affection_comfort","different_alone_time_needs","different_travel_or_adventure_needs","different_work_intensity","different_community_or_identity_visibility_needs","different_levels_of_comfort_with_mixed_gender_attraction"] },
          { id: "support_under_stress", title: "Support Under Stress", type: "single_select", prompt: "When you are stressed or unwell, what support usually helps most?", opts: ["comfort_and_reassurance","practical_help","space_then_support","humour_and_lightness","direct_problem_solving","quiet_presence"] },
          { id: "lifestyle_social_flexibility", title: "Lifestyle & Social Flexibility", type: "slider", prompt: "How flexible are you on lifestyle, social rhythm, and day-to-day fit?", minLabel: "Need close alignment", maxLabel: "Open if connection works" },
        ],
      },
      {
        id: "presentation", title: "First Impression & Vibe", number: "05",
        quote: "Chemistry is more than looks — it's how someone comes across, and how that feels in real life.",
        why: "This helps us understand the presence you project and what draws you to someone.",
        questions: [
          { id: "self_energy_markers", title: "Natural Energy", type: "multi_select", prompt: "What kind of energy do you naturally give off?", opts: ["polished","relaxed","creative","professional","sporty","warm","understated","confident","playful","reserved","intense","gentle"] },
          { id: "intended_impression_markers", title: "Intended First Impression", type: "multi_select", maxSelect: 5, prompt: "What first impression do you want to give?", microcopy: "Pick up to 5.", opts: ["attractive","approachable","high_quality","fun","serious_about_dating","warm","confident","emotionally_available","stylish","grounded","interesting","safe_to_be_around"] },
          { id: "energy_vibe_pref", title: "Energy You're Drawn To", type: "multi_select", prompt: "What kind of energy are you usually drawn to?", opts: ["polished","relaxed","creative","grounded","confident","soft","high_energy","understated","emotionally_open","playful","intellectually_curious","calm"] },
          { id: "first_date_chemistry_signals", title: "First Date Chemistry Signals", type: "multi_select", maxSelect: 5, prompt: "On a first date, what usually tells you there could be chemistry?", microcopy: "Pick up to 5.", opts: ["easy_laughter","natural_conversation","strong_eye_contact","physical_presence","shared_values_come_through","flirtation_feels_mutual","comfortable_silences","emotional_openness","similar_humour","i_feel_calm_and_interested","they_feel_like_themselves","there_is_real_curiosity"] },
          { id: "sexual_role_or_intimacy_style", title: "Physical Intimacy Style", type: "single_select", prompt: "What feels most natural for you in physical intimacy?", microcopy: "Private and only used to improve compatibility.", opts: ["more_initiating","more_receptive","balanced_equal","clearly_complementary","depends_on_connection","still_exploring"] },
          { id: "sexual_dynamic_preference", title: "Sexual Dynamic Preference", type: "single_select", prompt: "What dynamic usually works best for you?", microcopy: "Private and only used to improve compatibility.", opts: ["complementary_dynamic","balanced_equal_dynamic","flexible_depends_on_connection","emotionally_led_chemistry","varies_by_person_and_gender_context","still_exploring"] },
          { id: "sexual_satisfaction_drivers", title: "What Makes Intimacy Feel Satisfying", type: "multi_select", maxSelect: 5, prompt: "What makes intimacy feel satisfying for you?", microcopy: "Pick up to 5.", opts: ["strong_chemistry","emotional_safety","feeling_desired","clear_communication","playfulness","physical_confidence","affection_before_and_after","exploration_and_openness","consistency","feeling_fully_present","trust","tenderness"] },
          { id: "sexual_communication_consent", title: "Sexual Communication & Consent", type: "slider_set", prompt: "How true do these feel for you?", microcopy: "Private and only used to improve compatibility.", axes: ["i_can_tell_or_show_a_partner_what_i_need","i_can_speak_up_if_something_does_not_feel_right","i_am_comfortable_discussing_sex","i_am_responsive_when_a_partner_suggests_something_new","i_want_turn_ons_and_turn_offs_to_be_respected"] },
          { id: "desire_boundaries_turnons", title: "Desire, Boundaries & Turn-Ons", type: "multi_select", maxSelect: 5, prompt: "What should compatibility quietly respect around intimacy?", microcopy: "Private and only used to improve match fit.", opts: ["i_need_emotional_safety_before_sexual_chemistry_builds","i_value_open_conversations_about_turn_ons_and_turn_offs","i_like_playful_flirting_and_visible_attraction","i_enjoy_exploring_when_trust_is_there","i_prefer_a_steady_familiar_sexual_rhythm","i_need_clear_boundaries_to_be_respected","i_am_comfortable_hearing_about_a_partners_desires","i_prefer_to_keep_sexual_details_private_until_there_is_trust","comfort_with_mixed_gender_attraction","flexible_across_different_connection_styles","identity_respect_and_emotional_safety","sexual_health_conversations_matter"] },
          { id: "vibe_intimacy_flexibility", title: "Vibe & Intimacy Flexibility", type: "slider", prompt: "How flexible are you on chemistry, vibe, and intimacy fit?", minLabel: "Very specific", maxLabel: "Very open" },
        ],
      },
    ],
  },

  trans_nonbinary: {
    welcome: "A curated dating platform built around trust, real compatibility, and meaningful real-world dates.",
    calibrationProfiles: () => DIVERSE_PROFILES,
    compat: [
      {
        id: "type", title: "Your Type", number: "01",
        quote: "Attraction is personal. The more clearly we understand your type, the more naturally we can tailor who you see.",
        why: "This helps us understand the looks, traits, and presentation styles you're most drawn to — and how flexible that attraction is.",
        questions: [
          { id: "overall_attraction_direction", title: "Overall Attraction Direction", type: "slider", prompt: "What overall look are you usually most drawn to?", minLabel: "Soft", maxLabel: "Sharp / defined" },
          { id: "face_aesthetic_pref", title: "Face & Presence Type", type: "multi_select", maxSelect: 10, prompt: "Which overall looks tend to feel like your type?", microcopy: "Select all that feel honest.", opts: ["soft_gentle","cute_pretty","handsome_classic","rugged_confident","striking_editorial","androgynous","mature_grounded","distinctive_presence","gender_expansive_presentation","not_sure_yet"] },
          { id: "grooming_style_pref", title: "Grooming & Self-Care", type: "multi_select", prompt: "Which presentation styles do you find attractive?", opts: ["clean_put_together","natural_low_effort","very_well_groomed","intentional_style","healthy_fresh","expressive_presentation","understated_confidence","polished_confident","looks_after_themselves","no_strong_preference"] },
          { id: "presentation_detail_pref", title: "Presentation Details", type: "multi_select", prompt: "Which presentation details tend to stand out to you?", opts: ["clean_shaven","light_stubble","beard_or_facial_hair","minimal_makeup","polished_beauty","natural_look","gender_expansive_styling","body_hair","distinctive_presentation","no_strong_preference"] },
          { id: "hair_style_pref", title: "Hair & Head Look", type: "multi_select", prompt: "Which hair styles or head looks are you usually drawn to?", opts: ["shaved_or_very_short","pixie_or_short_crop","clean_short","textured_short","medium_soft_flow","long_hair","curly_or_natural_texture","dyed_or_alternative","polished_style","no_strong_preference"] },
          { id: "face_detail_pref", title: "Facial Details", type: "multi_select", maxSelect: 5, prompt: "What facial details tend to stand out most to you?", microcopy: "Select up to 5.", opts: ["nice_smile","bright_eyes","expressive_eyes","strong_features","soft_features","defined_bone_structure","intense_look","warm_friendly_expression","distinctive_face","natural_ease"] },
          { id: "body_type_pref", title: "Body & Physical Build", type: "multi_select", prompt: "Which body types do you usually find attractive?", opts: ["slim","lean","athletic","toned","muscular","broad","curvy","soft_natural","no_strong_preference"] },
          { id: "style_visual_pref", title: "Style & Visual Signals", type: "multi_select", maxSelect: 6, prompt: "Which style signals make someone more your type?", microcopy: "Pick your top 6.", opts: ["clean_cut","sporty","casual","rugged","artsy","minimal","fashion_forward","classic_elegant","femme","masc_of_center","androgynous","gender_expansive","alternative","glasses","tattoos","piercings","jewellery","professional_polished"] },
          { id: "attraction_reality_check", title: "Attraction Reality Check", type: "single_select", prompt: "Looking back, who have you actually had the best chemistry with?", opts: ["exactly_my_usual_type","close_to_my_type_but_not_exact","someone_who_surprised_me","personality_changed_the_attraction","chemistry_mattered_more_than_type","i_am_still_learning_my_type"] },
          { id: "your_type_flexibility", title: "Attraction Flexibility", type: "slider", prompt: "How flexible are you on your physical type overall?", minLabel: "Very specific", maxLabel: "Very open" },
        ],
      },
      {
        id: "romantic_pattern", title: "Romantic Pattern", number: "02",
        quote: "What has worked for you before — and what hasn't — often reveals more than preference alone.",
        why: "This helps us learn your dating patterns, what tends to repeat, and what kind of connection is more likely to feel healthy and lasting.",
        questions: [
          { id: "past_dating_types", title: "Past Dating Patterns", type: "multi_select", prompt: "Which kinds of people have you dated or been drawn to before?", opts: ["emotionally_available","emotionally_unavailable","fun_adventurous","serious_stable","confident_assertive","soft_sensitive","ambitious_driven","creative_free_spirited","nurturing_caring","independent_distant","high_chemistry_low_stability","calm_grounded","expressive_intense","low_key_private","socially_outgoing","avoidant_guarded","affectionate_warm","inconsistent_mixed_signals","relationship_ready","identity_safe_and_affirming","different_dynamics_with_cis_trans_or_nonbinary_partners"] },
          { id: "worked_in_past", title: "What Actually Worked", type: "multi_select", maxSelect: 5, prompt: "Which kinds of people have actually worked best for you?", microcopy: "Pick up to 5.", opts: ["emotionally_available","calm_grounded","consistent_reliable","communicative","affectionate_warm","relationship_ready","emotionally_mature","aligned_on_values","easy_to_be_with","strong_chemistry","supportive_of_my_goals","safe_to_be_myself","identity_safe_and_affirming"] },
          { id: "didnt_last_pattern", title: "Exciting but Didn't Last", type: "multi_select", maxSelect: 5, prompt: "Which patterns have felt exciting but usually didn't last?", microcopy: "Pick up to 5.", opts: ["emotionally_unavailable","inconsistent_mixed_signals","intense_fast_start","high_chemistry_low_stability","avoidant_guarded","chaotic_unpredictable","overly_independent","attractive_but_misaligned","fun_but_not_serious","not_fully_affirming_or_safe","visibility_or_disclosure_mismatch","confusing_intensity_with_security","potential_over_reality"] },
          { id: "closeness_pattern", title: "Closeness Pattern", type: "single_select", prompt: "When you start liking someone, what feels most familiar?", opts: ["steady_and_open","want_reassurance_quickly","hold_back_and_protect_myself","want_closeness_then_feel_overwhelmed","chemistry_first_clarity_later","i_take_time_to_trust"] },
          { id: "conflict_response", title: "Conflict Response", type: "single_select", prompt: "When tension comes up, I usually…", opts: ["address_it_directly","need_time_then_talk","avoid_it_and_hope_it_fades","get_emotionally_reactive","go_quiet_and_withdraw","try_to_keep_the_peace"] },
          { id: "conflict_repair_skills", title: "Conflict Repair", type: "slider_set", prompt: "How do you usually repair after tension?", axes: ["i_can_apologise_when_i_am_wrong","i_can_hear_difficult_feedback_without_shutting_down","i_can_stay_respectful_when_i_am_hurt","i_can_maintain_boundaries_without_becoming_cold","i_try_to_learn_from_conflict_instead_of_repeating_it"] },
          { id: "emotional_safety_support", title: "Emotional Safety & Support", type: "slider_set", prompt: "What helps a relationship feel emotionally safe for you?", axes: ["i_can_express_needs_without_fear_of_judgment","i_feel_emotionally_understood_and_validated","i_feel_identity_respected_and_seen","sensitive_past_experiences_can_be_handled_with_care","calm_repair_after_difficult_moments_matters_to_me"] },
          { id: "humour_resilience", title: "Humour & Resilience", type: "single_select", prompt: "What role does humour play when things get difficult?", opts: ["essential_shared_laughter_helps_me_reconnect","important_especially_during_stress","nice_to_have_but_not_essential","i_prefer_calm_seriousness_over_humour","it_depends_on_the_person"] },
          { id: "relationship_challenge_pattern", title: "Pattern Awareness", type: "multi_select", prompt: "In dating, what tends to be hardest for you?", opts: ["being_fully_myself","communicating_through_problems","maintaining_boundaries","repeating_the_same_pattern","choosing_unavailable_people","moving_too_fast","struggling_to_open_up","avoiding_difficult_conversations","focusing_on_potential_over_reality","confusing_chemistry_with_compatibility","people_pleasing","losing_interest_when_it_becomes_real","navigating_visibility_or_identity_safety","feeling_misread_or_not_fully_seen"] },
          { id: "romantic_pattern_flexibility", title: "Romantic Pattern Flexibility", type: "slider", prompt: "How open are you to dating outside your usual pattern?", minLabel: "Past patterns strongly define", maxLabel: "Very open to different" },
        ],
      },
      {
        id: "intent_values", title: "Intent & Values", number: "03",
        quote: "The right connection starts with wanting similar things — and being ready for them.",
        why: "This helps us understand what you're looking for now and what matters most to you.",
        questions: [
          { id: "relationship_intent", title: "Relationship Intent", type: "single_select", prompt: "What are you looking for right now?", opts: ["long_term_partner","serious_relationship","open_to_see_where_it_goes","casual_but_meaningful","casual_low_pressure"] },
          { id: "relationship_readiness", title: "Relationship Readiness", type: "single_select", prompt: "How ready do you feel for a relationship right now?", opts: ["fully_ready","mostly_ready","unsure_but_open","want_connection_not_full_commitment","still_rebuilding_after_past_experience"] },
          { id: "core_relationship_need", title: "Core Relationship Need", type: "single_select", prompt: "What do you most need from a relationship right now?", opts: ["stability","enjoyment","care","deep_understanding","growth","exploration","emotional_safety"] },
          { id: "core_values", title: "Core Values", type: "multi_select", maxSelect: 6, prompt: "Which relationship values matter most to you?", microcopy: "Pick up to 6.", opts: ["emotional_stability","ambition","independence","affection","consistency","fun_adventure","loyalty","growth","family","confidence","humour","calm","reliability","emotional_maturity","openness","kindness"] },
          { id: "worldview_values_alignment", title: "Values, Worldview & Meaning", type: "slider_set", prompt: "How important is alignment on these deeper areas?", axes: ["core_beliefs_and_moral_compass","life_goals_and_direction","spiritual_or_philosophical_outlook","openness_to_deeper_conversations","shared_sense_of_what_makes_life_meaningful"] },
          { id: "future_alignment_topics", title: "Future Alignment Topics", type: "multi_select", prompt: "Which future topics matter most to align on?", opts: ["marriage","children_parenting_or_family_building","where_to_live","career_ambition","finances","religion_spirituality","family_closeness","relationship_structure","identity_respect_and_public_visibility","lifestyle_priorities"] },
          { id: "future_direction_adaptability", title: "Future Direction & Adaptability", type: "slider_set", prompt: "What matters most when building a future with someone?", axes: ["moving_toward_common_goals","being_able_to_compromise_without_losing_myself","reassessing_the_future_openly_as_life_changes","handling_unexpected_obstacles_as_a_team","supporting_each_others_personal_direction"] },
          { id: "ambition_support_style", title: "Ambition & Mutual Support", type: "single_select", prompt: "Which dynamic around ambition feels healthiest to you?", opts: ["we_actively_encourage_each_others_goals","we_support_each_other_but_keep_careers_separate","one_persons_ambition_can_take_priority_at_times","i_need_a_partner_whose_pace_matches_mine_closely","i_am_still_working_out_career_and_relationship_balance"] },
          { id: "relationship_structure_and_zodiac_lens", title: "Relationship Matching with Star Sign Insights", type: "single_select", prompt: "Which feels most like you?", microcopy: "This helps us understand how you approach compatibility and relationship fit.", opts: ["star_sign_compatibility_matters_to_me","i_like_star_sign_insights","i_dont_really_care_about_star_signs","im_still_figuring_out_relationship_structure","dont_use_star_signs_in_my_matches"] },
          { id: "intent_values_flexibility", title: "Intent & Values Flexibility", type: "slider", prompt: "How flexible are you overall on intent, values, and future fit?", minLabel: "Very specific", maxLabel: "Open on some things" },
        ],
      },
      {
        id: "lifestyle", title: "Lifestyle & Social Fit", number: "04",
        quote: "Real compatibility lives in the everyday — not just in chemistry.",
        why: "This helps us learn how you live, socialise, communicate, and build your day-to-day life — so matches feel natural in the real world.",
        questions: [
          { id: "lifestyle_identity", title: "Lifestyle Identity", type: "multi_select", prompt: "Which lifestyle patterns feel most like you?", opts: ["social_and_outgoing","low_key_and_private","routine_oriented","spontaneous","community_connected","non_scene","saver","spender","career_first","balance_first","planner","flexible","wellness_focused","nightlife_oriented","culture_or_creativity_led"] },
          { id: "ideal_weekend_shared_activities", title: "Ideal Weekend & Shared Activities", type: "multi_select", maxSelect: 5, prompt: "What kind of shared time would help a relationship feel alive?", microcopy: "Pick up to 5.", opts: ["food_and_restaurants","fitness_or_sport","travel_or_weekends_away","culture_museums_events","nightlife","home_comfort","intellectual_conversation","creative_projects","nature_outdoors","shared_friend_groups","family_time","quiet_routine_together"] },
          { id: "personality_daily_rhythm", title: "Personality & Daily Rhythm", type: "slider_set", prompt: "Where do you naturally sit on these?", axes: ["party_social_butterfly_to_quiet_alone_time","spontaneous_adventurous_to_scheduled_predictable","emotional_feeling_led_to_logical_practical","curious_intellectual_to_grounded_simple","clean_organised_to_relaxed_flexible","work_first_to_play_balance_first"] },
          { id: "friends_family_integration", title: "Friends, Family & Social Circles", type: "single_select", prompt: "How much do you want a partner involved with your friends, family, or chosen family?", opts: ["very_involved","gradually_integrated","separate_but_respectful","depends_on_the_relationship","not_a_major_factor"] },
          { id: "everyday_ease_humour", title: "Everyday Ease & Humour", type: "single_select", prompt: "What role does everyday ease and humour play for you?", opts: ["essential_shared_laughter_helps_me_feel_close","important_especially_during_stress","nice_to_have_but_not_essential","i_prefer_calm_seriousness_over_constant_humour","it_depends_on_the_person"] },
          { id: "household_responsibility_fit", title: "Home & Daily Responsibility", type: "slider_set", prompt: "How important is alignment on home and daily responsibility?", axes: ["cleanliness_and_organisation","sharing_household_responsibilities_fairly","talking_openly_about_expectations","adjusting_responsibilities_when_life_changes","showing_appreciation_for_everyday_contributions"] },
          { id: "communication_style", title: "Communication Style", type: "multi_select", prompt: "How do you naturally communicate interest?", opts: ["frequent_messages","steady_not_constant","more_in_person_than_text","playful_flirty","thoughtful_deeper","practical_check_ins","affectionate_reassurance","space_then_reconnection"] },
          { id: "social_difference_tolerance", title: "Social Difference Tolerance", type: "multi_select", prompt: "Which social differences could you comfortably work with?", opts: ["different_social_energy","different_friendship_groups","different_family_closeness","different_nightlife_preferences","different_public_affection_comfort","different_alone_time_needs","different_travel_or_adventure_needs","different_work_intensity","different_levels_of_public_visibility_or_disclosure","different_community_connection_needs"] },
          { id: "support_under_stress", title: "Support Under Stress", type: "single_select", prompt: "When you are stressed or unwell, what support usually helps most?", opts: ["comfort_and_reassurance","practical_help","space_then_support","humour_and_lightness","direct_problem_solving","quiet_presence"] },
          { id: "lifestyle_social_flexibility", title: "Lifestyle & Social Flexibility", type: "slider", prompt: "How flexible are you on lifestyle, social rhythm, and day-to-day fit?", minLabel: "Need close alignment", maxLabel: "Open if connection works" },
        ],
      },
      {
        id: "presentation", title: "First Impression & Vibe", number: "05",
        quote: "Chemistry is more than looks — it's how someone comes across, and how that feels in real life.",
        why: "This helps us understand the energy you give off, the energy you're drawn to, and the kind of chemistry that feels believable and mutual.",
        questions: [
          { id: "self_energy_markers", title: "Natural Energy", type: "multi_select", prompt: "What kind of energy do you naturally give off?", opts: ["polished","relaxed","creative","professional","sporty","warm","understated","confident","playful","reserved","intense","gentle"] },
          { id: "intended_impression_markers", title: "Intended First Impression", type: "multi_select", maxSelect: 5, prompt: "What first impression do you want to give?", microcopy: "Pick up to 5.", opts: ["attractive","approachable","high_quality","fun","serious_about_dating","warm","confident","emotionally_available","stylish","grounded","interesting","safe_to_be_around"] },
          { id: "energy_vibe_pref", title: "Energy You're Drawn To", type: "multi_select", prompt: "What kind of energy are you usually drawn to?", opts: ["polished","relaxed","creative","grounded","confident","soft","high_energy","understated","emotionally_open","playful","intellectually_curious","calm"] },
          { id: "first_date_chemistry_signals", title: "First Date Chemistry Signals", type: "multi_select", maxSelect: 5, prompt: "On a first date, what usually tells you there could be chemistry?", microcopy: "Pick up to 5.", opts: ["easy_laughter","natural_conversation","strong_eye_contact","physical_presence","shared_values_come_through","flirtation_feels_mutual","comfortable_silences","emotional_openness","similar_humour","i_feel_calm_and_interested","they_feel_like_themselves","there_is_real_curiosity","i_feel_seen_and_respected"] },
          { id: "sexual_role_or_intimacy_style", title: "Physical Intimacy Style", type: "single_select", prompt: "What feels most natural for you in physical intimacy?", microcopy: "Private and only used to improve compatibility.", opts: ["more_initiating","more_receptive","balanced_equal","clearly_complementary","depends_on_connection","still_exploring"] },
          { id: "sexual_dynamic_preference", title: "Sexual Dynamic Preference", type: "single_select", prompt: "What dynamic usually works best for you?", microcopy: "Private and only used to improve compatibility.", opts: ["complementary_dynamic","balanced_equal_dynamic","flexible_depends_on_connection","emotionally_led_chemistry","varies_by_person_and_body_comfort","still_exploring"] },
          { id: "sexual_satisfaction_drivers", title: "What Makes Intimacy Feel Satisfying", type: "multi_select", maxSelect: 5, prompt: "What makes intimacy feel satisfying for you?", microcopy: "Pick up to 5.", opts: ["strong_chemistry","emotional_safety","feeling_desired","clear_communication","playfulness","physical_confidence","affection_before_and_after","exploration_and_openness","consistency","feeling_fully_present","trust","tenderness","feeling_seen_and_respected"] },
          { id: "sexual_communication_consent", title: "Sexual Communication & Consent", type: "slider_set", prompt: "How true do these feel for you?", microcopy: "Private and only used to improve compatibility.", axes: ["i_can_tell_or_show_a_partner_what_i_need","i_can_speak_up_if_something_does_not_feel_right","i_am_comfortable_discussing_intimacy","i_am_responsive_when_a_partner_suggests_something_new","i_need_body_boundaries_and_turn_ons_to_be_respected"] },
          { id: "desire_boundaries_turnons", title: "Desire, Boundaries & Turn-Ons", type: "multi_select", maxSelect: 5, prompt: "What should compatibility quietly respect around intimacy?", microcopy: "Private and only used to improve match fit.", opts: ["i_need_emotional_safety_before_sexual_chemistry_builds","i_value_open_conversations_about_turn_ons_and_turn_offs","i_like_playful_flirting_and_visible_attraction","i_enjoy_exploring_when_trust_is_there","i_prefer_a_steady_familiar_sexual_rhythm","i_need_clear_boundaries_to_be_respected","i_am_comfortable_hearing_about_a_partners_desires","i_prefer_to_keep_sexual_details_private_until_there_is_trust","body_comfort_and_boundaries_matter","identity_respect_is_non_negotiable","public_visibility_or_disclosure_comfort_matters","privacy_around_intimacy","sober_intimacy_preference","sexual_health_conversations_matter"] },
          { id: "vibe_intimacy_flexibility", title: "Vibe & Intimacy Flexibility", type: "slider", prompt: "How flexible are you on chemistry, vibe, and intimacy fit?", minLabel: "Very specific", maxLabel: "Very open" },
        ],
      },
    ],
  },
};

// ─── Compatibility section component ─────────────────────────────────────────
function getQuestionMicrocopy(question) {
  if (question?.microcopy) return question.microcopy;
  if (!question?.type || question.type === "single_select") return "Single choice";
  if (question.type === "multi_select") return question.maxSelect ? `Choose up to ${question.maxSelect}` : "Select all that feel honest";
  if (question.type === "slider") return "Drag to choose";
  if (question.type === "slider_set") return "Drag each slider";
  return "";
}

function formatAssessmentOptionText(value, question) {
  return formatAssessmentDisplayLabel(
    question?.optionLabels?.[value] || question?.axisLabels?.[value] || value,
  );
}

const SECTION_SUMMARY_BY_ID = {
  type: "This helps us learn the attraction signals that genuinely draw you in.",
  romantic_pattern: "This helps us understand what has worked before and what patterns to avoid.",
  intent_values: "This helps us identify the future fit and values that matter most to you.",
  lifestyle: "This helps us understand if your everyday lives are likely to feel natural together.",
  presentation: "This helps us predict whether chemistry is likely to translate in real life.",
};

function CompatSection({ section, onComplete, onBackToIntro, onQuestionIndexChange }) {
  const [answers, setAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [validationMessage, setValidationMessage] = useState("");
  const scrollRef = useRef(null);
  const question = section.questions[questionIndex];
  const sectionSummary = SECTION_SUMMARY_BY_ID[section.id] || "This helps us calibrate your compatibility with more precision.";

  const isAnswered = (q, value) => {
    if (q.type === "multi_select") return Array.isArray(value) && value.length > 0;
    if (q.type === "slider") return Array.isArray(value) && Number.isFinite(value[0]);
    if (q.type === "slider_set") return value && Object.keys(value).length === (q.axes?.length || 0);
    return value !== undefined;
  };

  const toggleMulti = (qi, value, maxSelect) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[qi]) ? prev[qi] : [];
      const exists = current.includes(value);
      if (exists) return { ...prev, [qi]: current.filter((v) => v !== value) };
      if (maxSelect && current.length >= maxSelect) return prev;
      return { ...prev, [qi]: [...current, value] };
    });
  };

  const handleContinue = () => {
    const value = answers[questionIndex];
    if (!isAnswered(question, value)) {
      setValidationMessage(
        question.type === "multi_select"
          ? "Please choose at least one option to continue."
          : question.type === "slider_set"
            ? "Please move each slider before continuing."
            : "Please complete this question to continue.",
      );
      return;
    }
    setValidationMessage("");
    if (questionIndex < section.questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      scrollRef.current?.scrollTo?.({ top: 0, behavior: "smooth" });
      scrollToTopSmooth();
      return;
    }
    onComplete(answers);
    scrollToTopSmooth();
  };

  const handleBack = () => {
    setValidationMessage("");
    if (questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1);
      scrollRef.current?.scrollTo?.({ top: 0, behavior: "smooth" });
      scrollToTopSmooth();
      return;
    }
    onBackToIntro();
    scrollToTopSmooth();
  };

  useEffect(() => {
    const handleExternalBack = () => {
      setValidationMessage("");
      if (questionIndex > 0) {
        setQuestionIndex((prev) => prev - 1);
        scrollRef.current?.scrollTo?.({ top: 0, behavior: "smooth" });
        scrollToTopSmooth();
        return;
      }
      onBackToIntro();
      scrollToTopSmooth();
    };
    window.addEventListener("tether-compat-question-back", handleExternalBack);
    return () => window.removeEventListener("tether-compat-question-back", handleExternalBack);
  }, [questionIndex, onBackToIntro]);

  useEffect(() => {
    onQuestionIndexChange?.(questionIndex);
  }, [questionIndex, onQuestionIndexChange]);

  const currentMulti = Array.isArray(answers[questionIndex]) ? answers[questionIndex] : [];
  const multiMaxReached = question?.type === "multi_select" && question?.maxSelect && currentMulti.length >= question.maxSelect;

  return (
    <div className="assessment-question-shell flex-1 flex flex-col" data-testid="assessment-question-screen">
      <div className="assessment-question-content" ref={scrollRef}>
        <div className="assessment-question-panel" data-testid="assessment-question-panel">
          <p className="assessment-microcopy mb-3">Question {questionIndex + 1} of {section.questions.length}</p>
          <p className="assessment-question-title mb-2" data-testid="assessment-question-title">{question.title || `Question ${questionIndex + 1}`}</p>
          <div className="assessment-question-summary-banner mb-4" data-testid="assessment-question-summary-banner">
            <p>{question.summary || sectionSummary}</p>
          </div>
          <p className="assessment-question-prompt assessment-question-prompt-heading mb-2" data-testid="assessment-question-prompt">{question.prompt || question.q}</p>
          <p className="assessment-question-microcopy mb-3" data-testid="assessment-question-microcopy">{getQuestionMicrocopy(question)}</p>
          {(question.type === "single_select" || !question.type) && (
            <div className={`assessment-option-list ${question.opts.length >= 7 ? "assessment-option-list--dense" : ""}`} data-testid="assessment-option-list">
              {question.opts.map((opt) => (
                <button key={opt} onClick={() => { setValidationMessage(""); setAnswers(prev => ({ ...prev, [questionIndex]: opt })); }} className="assessment-option-card w-full text-left" data-selected={answers[questionIndex] === opt ? "true" : "false"} type="button" data-testid="assessment-option-card">
                  <span className="assessment-option-title">{formatAssessmentOptionText(opt, question)}</span>
                </button>
              ))}
            </div>
          )}
          {question.type === "multi_select" && (
            <div className={`assessment-option-list ${question.opts.length >= 7 ? "assessment-option-list--dense" : ""}`} data-testid="assessment-option-list">
              {question.opts.map((opt) => {
                const selected = currentMulti.includes(opt);
                const disabled = !selected && multiMaxReached;
                return (
                  <button key={opt} onClick={() => { setValidationMessage(""); toggleMulti(questionIndex, opt, question.maxSelect); }} className="assessment-option-card w-full text-left" data-selected={selected ? "true" : "false"} type="button" aria-pressed={selected} disabled={disabled} data-testid="assessment-option-card">
                    <span className="assessment-option-title">{formatAssessmentOptionText(opt, question)}</span>
                  </button>
                );
              })}
            </div>
          )}
          {multiMaxReached ? <p className="assessment-microcopy mt-2">You can choose up to {question.maxSelect}.</p> : null}
          {question.type === "slider" && (
            <div className="assessment-option-card">
              <Slider data-testid="assessment-slider" value={answers[questionIndex] || [0.5]} onValueChange={(val) => { setValidationMessage(""); setAnswers(prev => ({ ...prev, [questionIndex]: val })); }} min={0} max={1} step={0.01} />
              <div className="flex justify-between mt-2">
                <span className="assessment-slider-label" data-testid="assessment-slider-left-label">{question.minLabel || "Lower"}</span>
                <span className="assessment-slider-label" data-testid="assessment-slider-right-label">{question.maxLabel || "Higher"}</span>
              </div>
            </div>
          )}
          {question.type === "slider_set" && (
            <div className="space-y-2">
              <p className="assessment-microcopy">Scale: Not like me · Somewhat · Very true</p>
              {(question.axes || []).map((axis) => (
                <div key={axis} className="assessment-option-card">
                  <p className="assessment-axis-title mb-2">{formatAssessmentOptionText(axis, question)}</p>
                  <Slider data-testid="assessment-slider" value={[answers[questionIndex]?.[axis] ?? 0.5]} onValueChange={([v]) => { setValidationMessage(""); setAnswers(prev => ({ ...prev, [questionIndex]: { ...(prev[questionIndex] || {}), [axis]: v } })); }} min={0} max={1} step={0.01} />
                  <div className="flex justify-between mt-2">
                    <span className="assessment-slider-label" data-testid="assessment-slider-left-label">Not like me</span>
                    <span className="assessment-slider-label" data-testid="assessment-slider-right-label">Very true</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {validationMessage ? <p className="assessment-validation-message mt-3" data-testid="assessment-validation-message">{validationMessage}</p> : null}
        </div>
      </div>
      <div className="assessment-bottom-controls flex items-center gap-3 mt-2">
        <Button variant="ghost" onClick={handleBack} className="rounded-full assessment-button" data-testid="assessment-back">Back</Button>
        <Button onClick={handleContinue} className="assessment-button rounded-full flex-1" data-testid="assessment-continue">
          Continue <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

// ─── Tier features (welcome screen) ──────────────────────────────────────────
const TIER_FEATURES = {
  standard: [
    { Icon: ShieldCheck,       text: "Verified profiles — no catfishing" },
    { Icon: Sparkles,          text: "20–30 curated daily matches" },
    { Icon: Heart,             text: "Guided dates from £9 — first meet to second and third" },
    { Icon: SlidersHorizontal, text: "Only profiles from 60% compatibility and above" },
  ],
  premium: [
    { Icon: SlidersHorizontal, text: "More control with advanced match filters" },
    { Icon: CalendarDays,      text: "Four standard dates included each month" },
    { Icon: Gem,               text: "Elevated date options and smarter second & third dates" },
    { Icon: SlidersHorizontal, text: "Only profiles from 75% — adjustable threshold" },
  ],
  concierge: [
    { Icon: Wand2,             text: "Curated introductions with AI + a dedicated dating expert" },
    { Icon: Route,             text: "Premium date planning from first to third date" },
    { Icon: Star,              text: "Elevated experiences designed around real compatibility" },
    { Icon: SlidersHorizontal, text: "Only profiles from 85% — adjustable threshold" },
  ],
};

// ─── Main component ───────────────────────────────────────────────────────────
const TIER_COLORS = {
  standard: { bg: "hsl(var(--primary))", text: "hsl(var(--primary-foreground))", light: "hsl(var(--primary) / 0.1)", pageBg: "hsl(var(--background))", logoBg: "hsl(var(--primary) / 0.1)", specialBannerBg: "hsl(var(--primary) / 0.1)", specialBannerText: "#2F3B35" },
  premium: { bg: "#f8f3f1", text: "#37423a", light: "rgba(248,243,241,0.12)", pageBg: "#5b655d", logoBg: "#37423a", specialBannerBg: "#37423a", specialBannerText: "#f8f3f1" },
  concierge: { bg: "#d8c6ae", text: "#0a0d0a", light: "rgba(216,198,174,0.12)", pageBg: "#0a0d0a", logoBg: "#232623", specialBannerBg: "#232623", specialBannerText: "#d8c6ae" },
};

const ONBOARDING_LAYOUT = {
  mainBannerWidth: "100%",
  mainBannerMaxWidth: "360px",
  mainBannerHeight: "48px",
  infoBannerWidth: "100%",
  infoBannerMaxWidth: "360px",
  membershipBannerMaxWidth: "220px",
  membershipBannerHeight: "auto",
};

const LOWER_BANNER_STYLES = {
  standard: { borderColor: "rgba(47,59,53,0.25)", textColor: "#141916" },
  premium: { borderColor: "rgba(238,231,218,0.25)", textColor: "#EEE7DA" },
  concierge: { borderColor: "rgba(238,231,218,0.25)", textColor: "#EEE7DA" },
};

function SpecialDropdown({ tier, tierColors }) {
  const [open, setOpen] = useState(false);
  const mutedColor = tier === "standard" ? "#7A8A7B" : "rgba(238,231,218,0.5)";
  const textColor = tier === "standard" ? "#2F3B35" : "#EEE7DA";
  const subTextColor = tier === "standard" ? "#7A8A7B" : "rgba(238,231,218,0.7)";
  const itemColor = tier === "standard" ? "#2F3B35" : "rgba(238,231,218,0.85)";
  const headingColor = tier === "concierge" ? "#CBB9A3" : tier === "premium" ? "#C9A96E" : "#141916";
  const borderColor = tier === "standard" ? "rgba(47,59,53,0.1)" : "rgba(238,231,218,0.08)";
  const panelBorderColor = tier === "concierge" ? "rgba(203,185,163,0.2)" : tier === "premium" ? "rgba(238,231,218,0.15)" : "rgba(47,59,53,0.15)";
  const panelBg = tier === "concierge" ? "#1a1a1a" : tier === "premium" ? "#1e2e29" : "#F5F0EB";

  return (
    <div className="w-full flex flex-col items-center">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-center rounded-full border-0 transition-all text-[13px] font-medium"
        style={{
          width: ONBOARDING_LAYOUT.infoBannerWidth,
          maxWidth: ONBOARDING_LAYOUT.infoBannerMaxWidth,
          height: ONBOARDING_LAYOUT.mainBannerHeight,
          backgroundColor: tierColors.specialBannerBg,
          color: tierColors.specialBannerText,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "15px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <span>What makes our app different?</span>
        <ChevronDown
          className="w-4 h-4 flex-shrink-0"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", color: "inherit" }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
            className="rounded-2xl border text-left"
            style={{
              borderColor: panelBorderColor,
              background: panelBg,
              width: ONBOARDING_LAYOUT.infoBannerWidth,
              maxWidth: ONBOARDING_LAYOUT.infoBannerMaxWidth,
              marginTop: "8px",
            }}
          >
            <div className="p-4 space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: mutedColor }}>Why we're different</p>
                <p className="text-xs leading-relaxed mb-2" style={{ color: textColor }}>Tether is built around trust, compatibility, and real-world dating — not endless swiping.</p>
                <p className="text-xs leading-relaxed mb-3" style={{ color: subTextColor }}>Most dating apps focus on surface-level filters, fast matching, and keeping people engaged inside the app. We take a more intentional approach.</p>
                <div className="space-y-1.5">
                  {[
                    { sym: "✦", text: "Curated, more intentional introductions" },
                    { sym: "◌", text: "Built around trust and real compatibility" },
                    { sym: "↗", text: "Designed for real-world dates, not just app engagement" },
                  ].map(item => (
                    <div key={item.text} className="flex items-start gap-2 text-[11px]" style={{ color: itemColor }}>
                      <span className="flex-shrink-0 w-4 text-center opacity-60">{item.sym}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t" style={{ borderColor }} />
              <div>
                <p className="text-sm font-heading font-semibold mb-2" style={{ color: headingColor }}>Smarter compatibility matching</p>
                <div className="space-y-1.5">
                  {[
                    { sym: "◐", text: "Only profiles above your compatibility threshold" },
                    { sym: "◐", text: "Higher tiers unlock stronger match quality" },
                    { sym: "◐", text: "Adjustable thresholds for more control" },
                  ].map(item => (
                    <div key={item.text} className="flex items-start gap-2 text-[11px]" style={{ color: itemColor }}>
                      <span className="flex-shrink-0 w-4 text-center opacity-60">{item.sym}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t" style={{ borderColor }} />
              <div>
                <p className="text-sm font-heading font-semibold mb-2" style={{ color: headingColor }}>Our compatibility test makes us different</p>
                <p className="text-xs leading-relaxed mb-2" style={{ color: textColor }}>Our compatibility system is designed to go beyond age, location, and surface preferences.</p>
                <p className="text-xs leading-relaxed mb-3" style={{ color: subTextColor }}>Instead of relying on shallow matching, we use a more thoughtful framework shaped by psychological insight, dating expertise, and real-world behaviour over time.</p>
                <p className="text-xs font-semibold mb-3" style={{ color: tier === "standard" ? "#2F3B35" : "rgba(238,231,218,0.9)" }}>Better matches, not more matches.</p>
                <div className="space-y-1.5 mb-3">
                  {[
                    { sym: "◇", text: "Emotional and communication compatibility" },
                    { sym: "◐", text: "Lifestyle, values, and relationship alignment" },
                    { sym: "✧", text: "Sexual compatibility handled privately and respectfully" },
                    { sym: "⟲", text: "A system that learns over time through behaviour and feedback" },
                  ].map(item => (
                    <div key={item.text} className="flex items-start gap-2 text-[11px]" style={{ color: itemColor }}>
                      <span className="flex-shrink-0 w-4 text-center opacity-60">{item.sym}</span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] leading-relaxed italic" style={{ color: tier === "standard" ? "#7A8A7B" : "rgba(238,231,218,0.55)" }}>
                  Whatever your sexual or dating preference is, your compatibility experience is designed specifically around you — so we can better understand what you want, what feels right, and who may be the strongest match.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OnboardingVariant({ orientation }) {
  const ONBOARDING_THEME_TIER = "standard";
  const navigate = useNavigate();
  const location = useLocation();
  const { tier } = useTier();
  const config = ORIENTATION_CONFIG[orientation] || ORIENTATION_CONFIG.straight;
  const userGender = localStorage.getItem("tether_user_gender") || "";
  const compatRouteSyncRef = useRef(false);
  const tierColors = TIER_COLORS[ONBOARDING_THEME_TIER] || TIER_COLORS.standard;
  const membershipTheme = getMembershipTheme(ONBOARDING_THEME_TIER);

  const stages = ["welcome", "basics", "metrics", "photos", "prompts", "verification",
    "compat_intro", "compat_section", "date_journey", "complete"];

  const [stage, setStage] = useState("welcome");
  const [loading, setLoading] = useState(false);
  const [compatIndex, setCompatIndex] = useState(0);
  const [compatPhase, setCompatPhase] = useState("intro");
  const [compatQuestionIndex, setCompatQuestionIndex] = useState(0);
  const [compatMarkers, setCompatMarkers] = useState({});
  const [howTetherWorksPageIndex, setHowTetherWorksPageIndex] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [specialOpen, setSpecialOpen] = useState(false);
  const [cityError, setCityError] = useState(false);

  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const [gender, setGender] = useState("");
  const [selectedPref, setSelectedPref] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const lastAutoFillRef = useRef({});

  const calcAge = () => getAgeFromDob(dob);
  const derivedStarSign = getDerivedStarSign(dob);

  const [formData, setFormData] = useState({
    display_name: localStorage.getItem("tether_entry_name") || "",
    age: "",
    height_cm: "",
    height_unit: "cm",
    height_feet: "",
    height_inches: "",
    height_display_value: "",
    pronouns: "",
    education: "",
    education_level: "",
    education_institution: "",
    education_details: null,
    work: "",
    ethnicity: "",
    gender_identity: "",
    sexual_preference: "",
    dating_preference: "",
    location: "",
    bio: "",
    dating_intention: "",
    children: "",
    future_family_desire: "",
    pets: "",
    drinking: "",
    smoking: "",
    drugs: "",
    religion: "",
    politics: "",
    languages: "",
    derived_star_sign: "",
    birth_date: "",
    photos: [],
    prompt_looking_for: "",
    prompt_ideal_weekend: "",
    ...ONBOARDING_DEFAULT_MULTI,
    age_range_min: 25, age_range_max: 40, distance_preference: 15,
  });

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const resolvedCompatibilityRoute = determineCompatibilityVariant({
    genderIdentity: gender,
    sexualPreference: selectedPref || orientation,
    lookingFor,
  });
  const compatSections = getFinalAssessmentSections(resolvedCompatibilityRoute);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { file_url } = await localApp.integrations.Core.UploadFile({ file });
    update("photos", [...formData.photos, file_url]);
  };

  const handleCompatComplete = (data) => {
    const sectionId = compatSections[compatIndex].id;
    setCompatMarkers(prev => ({ ...prev, [sectionId]: data }));
    setCompatQuestionIndex(0);
    if (compatIndex < compatSections.length - 1) {
      setCompatIndex(i => i + 1);
      setCompatPhase("intro");
    } else {
      setHowTetherWorksPageIndex(0);
      setStage("date_journey");
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    const age = calcAge() || Number(formData.age);
    const birthDate = getDobIso(dob);
    const starSign = getDerivedStarSign(dob);
    const resolved = determineCompatibilityVariant({
      genderIdentity: gender,
      sexualPreference: selectedPref || orientation,
      lookingFor,
    });
    const compatibilityProfileOutput = buildCompatibilityProfileOutput({
      sections: compatSections,
      sectionAnswers: compatMarkers,
      routeContext: resolved,
    });
    const height = buildHeightData({
      unit: formData.height_unit,
      cmValue: formData.height_cm,
      feetValue: formData.height_feet,
      inchesValue: formData.height_inches,
    });
    const education = buildEducationData({
      level: formData.education_level,
      institution: formData.education_institution,
    });
    const profile = {
      ...formData,
      age,
      birth_date: birthDate,
      derived_star_sign: starSign,
      pronouns: formData.pronouns,
      education: education.displayInstitution || undefined,
      education_level: education.level || undefined,
      education_institution: education.institution || undefined,
      education_details: education.displayInstitution || education.displayLevel ? education : undefined,
      work: formData.work,
      ethnicity: formData.ethnicity,
      gender_identity: normalizeGenderIdentity(gender),
      gender_identity_label: gender,
      sexual_preference: normalizeSexualPreference(selectedPref || orientation),
      sexual_preference_label: SEXUAL_PREFERENCES.find((item) => item.value === (selectedPref || orientation))?.label || selectedPref || orientation,
      dating_preference: normalizeLookingFor(lookingFor),
      dating_preference_label: LOOKING_FOR.find((item) => item.value === lookingFor)?.label || lookingFor,
      height_cm: formData.height_unit === "cm" ? Number(formData.height_cm) || undefined : undefined,
      height_unit: formData.height_unit,
      height_feet: formData.height_unit === "ft" ? Number(formData.height_feet) || undefined : undefined,
      height_inches: formData.height_unit === "ft" ? Number(formData.height_inches) || 0 : undefined,
      height,
      height_display_value: height.displayValue || undefined,
      is_verified: true,
      onboarding_complete: true,
      compatibility_complete: true,
      profile_complete: true,
      ...compatibilityProfileOutput,
    };
    await localApp.entities.Profile.create(profile);
    setLoading(false);
    clearOnboardingDraft();
    navigate(`${getMembershipRoute("", resolved.routeOrientation)}?entryPoint=post_onboarding`, {
      state: { entryPoint: "post_onboarding" },
    });
  };

  const goNext = () => {
    const idx = stages.indexOf(stage);
    if (idx < stages.length - 1) {
      setStage(stages[idx + 1]);
      scrollToTopSmooth();
    }
  };
  const goBack = () => {
    if (stage === "date_journey") {
      if (howTetherWorksPageIndex > 0) {
        setHowTetherWorksPageIndex((prev) => prev - 1);
        scrollToTopSmooth();
        return;
      }
      const idx = stages.indexOf(stage);
      if (idx > 0) {
        setStage(stages[idx - 1]);
        scrollToTopSmooth();
      }
      return;
    }
    if (stage === "compat_section" && compatPhase === "questions") {
      window.dispatchEvent(new Event("tether-compat-question-back"));
      return;
    }
    if (stage === "compat_section" && compatPhase === "intro" && compatIndex > 0) {
      setCompatIndex((prev) => prev - 1);
      setCompatPhase("intro");
      setCompatQuestionIndex(0);
      scrollToTopSmooth();
      return;
    }
    const idx = stages.indexOf(stage);
    if (idx > 0) {
      setStage(stages[idx - 1]);
      scrollToTopSmooth();
    }
  };

  const canProceed = () => {
    if (stage === "basics") {
      const age = calcAge();
      return formData.display_name && age && gender && selectedPref && lookingFor && formData.location === "London";
    }
    return true;
  };

  const handleBasicsContinue = () => {
    if (formData.location !== "London") {
      setCityError(true);
      return;
    }
    const age = calcAge();
    const effectivePref = normalizeSexualPreference(selectedPref || orientation);
    const resolved = determineCompatibilityVariant({
      genderIdentity: gender,
      sexualPreference: effectivePref,
      lookingFor,
    });
    localStorage.setItem("tether_orientation", resolved.routeOrientation);
    localStorage.setItem("tether_user_gender", normalizeGenderIdentity(gender));
    localStorage.setItem("tether_user_sexual_preference", effectivePref);
    localStorage.setItem("tether_user_looking_for", normalizeLookingFor(lookingFor));
    localStorage.setItem("tether_entry_name", formData.display_name);
    localStorage.setItem("tether_entry_age", String(age));
    localStorage.setItem(
      "tetherDemoUserContext",
      JSON.stringify({
        membershipTier: "standard",
        ...resolved,
        birthDate: `${dob.year}-${String(dob.month).padStart(2, "0")}-${String(dob.day).padStart(2, "0")}`,
      }),
    );
    goNext();
  };

  const currentSection = compatSections[compatIndex];

  useEffect(() => {
    if (!gender) return;
    setFormData((prev) => applyDefaultProfileDetails(prev, gender, selectedPref || orientation, lookingFor));
  }, [gender, lookingFor, orientation, selectedPref]);

  useEffect(() => {
    const autoFill = getDemoAutoFillCopy({
      genderIdentity: gender,
      sexualPreference: selectedPref,
      lookingFor,
    });
    if (!autoFill) return;

    setFormData((prev) => {
      const next = { ...prev };
      let changed = false;

      Object.entries(autoFill).forEach(([field, nextValue]) => {
        if (!nextValue) return;
        const previousAutoFill = lastAutoFillRef.current[field];
        const isArrayField = Array.isArray(nextValue);
        const currentValue = next[field];
        const matchesPreviousAutoFill = isArrayField
          ? Array.isArray(currentValue) && Array.isArray(previousAutoFill) && currentValue.join("||") === previousAutoFill.join("||")
          : currentValue === previousAutoFill;

        if (!currentValue || (Array.isArray(currentValue) && currentValue.length === 0) || matchesPreviousAutoFill) {
          next[field] = nextValue;
          changed = true;
        }
      });

      if (!changed) return prev;
      lastAutoFillRef.current = autoFill;
      return next;
    });
  }, [gender, lookingFor, selectedPref]);

  useEffect(() => {
    const draft = loadOnboardingDraft();
    if (!draft || draft.targetRoute !== location.pathname) return;

    if (draft.formData) setFormData(draft.formData);
    if (draft.dob) setDob(draft.dob);
    if (draft.gender) setGender(draft.gender);
    if (draft.selectedPref) setSelectedPref(draft.selectedPref);
    if (draft.lookingFor) setLookingFor(draft.lookingFor);
    if (draft.stage) setStage(draft.stage);
    if (typeof draft.compatIndex === "number") setCompatIndex(draft.compatIndex);
    if (draft.compatPhase) setCompatPhase(draft.compatPhase);
    if (typeof draft.compatQuestionIndex === "number") setCompatQuestionIndex(draft.compatQuestionIndex);
    clearOnboardingDraft();
  }, [location.pathname]);

  useEffect(() => {
    if (stage !== "compat_intro" || compatRouteSyncRef.current) return;
    const targetRoute = resolvedCompatibilityRoute.onboardingRoute;
    if (!targetRoute || targetRoute === location.pathname) return;

    compatRouteSyncRef.current = true;
    saveOnboardingDraft({
      targetRoute,
      stage,
      formData,
      dob,
      gender,
      selectedPref,
      lookingFor,
      compatIndex,
      compatPhase,
      compatQuestionIndex,
    });
    navigate(targetRoute, { replace: true });
  }, [compatPhase, compatIndex, compatQuestionIndex, dob, formData, gender, location.pathname, lookingFor, navigate, resolvedCompatibilityRoute.onboardingRoute, selectedPref, stage]);

  const setupProgressStages = ["basics", "metrics", "photos", "prompts", "verification", "compat_intro", "date_journey"];
  let progressTotal = 0;
  let progressActive = 0;
  if (stage === "compat_section") {
    if (compatPhase === "questions") {
      progressTotal = currentSection?.questions?.length || 10;
      progressActive = compatQuestionIndex + 1;
    } else {
      progressTotal = compatSections.length;
      progressActive = compatIndex + 1;
    }
  } else if (stage === "date_journey") {
    progressTotal = HOW_TETHER_WORKS_PAGES.length;
    progressActive = howTetherWorksPageIndex + 1;
  } else if (setupProgressStages.includes(stage)) {
    progressTotal = setupProgressStages.length;
    progressActive = setupProgressStages.indexOf(stage) + 1;
  }

  const tierFeatures = TIER_FEATURES[ONBOARDING_THEME_TIER] || TIER_FEATURES.standard;
  const isDev = shouldEnableDevTools(location.pathname);

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const orientationSlug = orientation === "trans_nonbinary" ? "trans-nonbinary" : orientation;
    const sectionMatch = path.match(new RegExp(`/onboarding-${orientationSlug}-section(0[1-5]|[1-5])$`));

    if (sectionMatch) {
      const nextSectionIndex = Math.max(0, Math.min(4, Number(sectionMatch[1]) - 1));
      setCompatIndex(nextSectionIndex);
      setCompatPhase("intro");
      setCompatQuestionIndex(0);
      setHowTetherWorksPageIndex(0);
      setStage("compat_section");
      return;
    }

    if (path.endsWith(`/onboarding-${orientationSlug}-howitworks`)) {
      setHowTetherWorksPageIndex(0);
      setStage("date_journey");
    }
  }, [location.pathname, orientation]);

  if (stage === "welcome") {
    return (
      <TetherIntroLayout
        tier={ONBOARDING_THEME_TIER}
        onStart={goNext}
        onSignIn={() => navigate("/sign-in-standard")}
        startLabel="Start with Tether"
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col" data-tier="standard" style={{ backgroundColor: tierColors.pageBg }}>
      {/* Progress — only when past welcome */}
      {stage !== "welcome" && progressTotal > 0 && (
      <div className="px-5 pt-5 pb-2">
        <div className="flex gap-1" data-testid="assessment-progress">
          {Array.from({ length: progressTotal }).map((_, i) => (
            <div key={i} className="h-0.5 flex-1 rounded-full transition-all duration-500"
              style={{ backgroundColor: i < progressActive ? tierColors.bg : "hsl(var(--border))", opacity: i < progressActive ? 1 : 0.22 }} />
          ))}
        </div>
      </div>
      )}

      <div className="flex-1 flex flex-col px-5 py-2 max-w-2xl mx-auto w-full">
        {stage !== "welcome" && (
          <div className="onboarding-top-row mb-3">
            <button onClick={goBack} className="onboarding-back-button flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="assessment-back">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div />
            <div className="onboarding-dev-slot">
              {isDev ? <div data-testid="assessment-dev"><DevPill tier={ONBOARDING_THEME_TIER} onClick={() => window.dispatchEvent(new Event("tether-dev-toggle"))} /></div> : null}
            </div>
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div key={stage + compatIndex + compatPhase}
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }} className="flex-1 flex flex-col" data-testid="assessment-screen">

            {/* BASICS — About You */}
            {stage === "basics" && (
              <div className="flex-1 flex flex-col gap-5 overflow-auto pb-2" data-testid="about-you-screen">
                <div>
                  <h2 className="app-title onboarding-page-title mb-1">About you</h2>
                  <p className="app-lead onboarding-subtitle text-muted-foreground">Let's set up your profile</p>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="app-section-title text-muted-foreground mb-1.5 block">First Name</label>
                    <Input value={formData.display_name} onChange={e => update("display_name", e.target.value)} placeholder="Your first name" className={`onboarding-control rounded-xl h-9 ${formData.display_name ? "onboarding-control--completed" : ""}`} />
                  </div>
                  <div>
                    <label className="app-section-title text-muted-foreground mb-1.5 block">Date of Birth</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Day", key: "day", placeholder: "DD" },
                        { label: "Month", key: "month", placeholder: "MM" },
                        { label: "Year", key: "year", placeholder: "YYYY" },
                      ].map(({ label, key, placeholder }) => (
                        <div key={key}>
                          <span className="text-[12px] text-muted-foreground block mb-1">{label}</span>
                          <Input
                            data-testid={key === "day" ? "dob-day-input" : key === "month" ? "dob-month-input" : "dob-year-input"}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={key === "year" ? 4 : 2}
                            value={dob[key]}
                            onChange={e => setDob(prev => ({ ...prev, [key]: numericInput(e.target.value, key === "year" ? 4 : 2) }))}
                            placeholder={placeholder}
                            className={`onboarding-control onboarding-date-input rounded-xl h-9 text-center ${dob[key] ? "onboarding-control--completed" : ""}`}
                          />
                        </div>
                      ))}
                    </div>
                    {(calcAge() || derivedStarSign) ? (
                      <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
                        <p>{calcAge() ? `Age: ${calcAge()}` : ""}</p>
                        <p className="text-right">{derivedStarSign ? `Star Sign: ${derivedStarSign}` : ""}</p>
                      </div>
                    ) : null}
                    {dob.year && dob.year.length === 4 && !calcAge() && <p className="text-xs text-destructive mt-1.5">You must be 18 or older to join Tether.</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <HeightInputField
                        cmValue={formData.height_cm}
                        unit={formData.height_unit}
                        feetValue={formData.height_feet}
                        inchesValue={formData.height_inches}
                        onChange={({ unit, cmValue, feetValue, inchesValue, height }) => {
                          setFormData((prev) => ({
                            ...prev,
                            height_unit: unit,
                            height_cm: cmValue,
                            height_feet: feetValue,
                            height_inches: inchesValue,
                            height_display_value: height.displayValue,
                            height,
                          }));
                        }}
                      />
                    </div>
                    <OnboardingSelectField
                      label="Pronouns"
                      value={formData.pronouns}
                      onChange={(value) => update("pronouns", value)}
                      options={PRONOUN_OPTIONS}
                      placeholder="Select pronouns"
                    />
                  </div>
                  <div className="grid grid-cols-2 items-stretch gap-3">
                    <EducationField
                      level={formData.education_level}
                      institution={formData.education_institution}
                      options={EDUCATION_LEVEL_OPTIONS}
                      onChange={({ level, institution }) => {
                        const details = buildEducationData({ level, institution });
                        setFormData((prev) => ({
                          ...prev,
                          education_level: level,
                          education_institution: institution,
                          education_details: details,
                          education: details.displayInstitution,
                        }));
                      }}
                      className="flex h-full flex-col"
                      triggerClassName="h-full min-h-9"
                    />
                    <div>
                      <label className="app-section-title text-muted-foreground mb-1.5 block">Work</label>
                      <Input value={formData.work} onChange={e => update("work", e.target.value)} placeholder="Your work" className={`onboarding-control rounded-xl h-9 ${formData.work ? "onboarding-control--completed" : ""}`} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 items-stretch gap-3">
                    <OnboardingSelectField
                      label="Ethnicity"
                      value={formData.ethnicity}
                      onChange={(value) => update("ethnicity", value)}
                      options={ETHNICITY_OPTIONS}
                      placeholder="Select ethnicity"
                      className="flex h-full flex-col"
                      triggerClassName="h-full min-h-9"
                    />
                    <OnboardingSelectField
                      label="Gender Identity"
                      value={gender}
                      onChange={(value, option) => {
                        setGender(value);
                        update("gender_identity", normalizeGenderIdentity(value));
                        update("gender_identity_label", option?.label || value);
                      }}
                      options={GENDERS.map((label) => ({ label, value: label }))}
                      placeholder="Select"
                      className="flex h-full flex-col"
                      triggerClassName="h-full min-h-9"
                    />
                  </div>
                  <div className="grid grid-cols-2 items-stretch gap-3">
                    <OnboardingSelectField
                      label="Sexual Preference"
                      value={selectedPref}
                      onChange={(value, option) => {
                        setSelectedPref(value);
                        update("sexual_preference", value);
                        update("sexual_preference_label", option?.label || value);
                      }}
                      options={SEXUAL_PREFERENCES}
                      placeholder="Select"
                      className="flex h-full flex-col"
                      triggerClassName="h-full min-h-9"
                    />
                    <OnboardingSelectField
                      label="Who would you like to date?"
                      value={lookingFor}
                      onChange={(value, option) => {
                        setLookingFor(value);
                        update("dating_preference", value);
                        update("dating_preference_label", option?.label || value);
                      }}
                      options={LOOKING_FOR}
                      placeholder="Select"
                      className="flex h-full flex-col"
                      triggerClassName="h-full min-h-9"
                    />
                  </div>
                  <LocationAvailabilitySelector
                    selectedCity={formData.location}
                    onSelectCity={(city) => {
                      update("location", city);
                      setCityError(false);
                    }}
                    theme={ONBOARDING_THEME_TIER}
                    showError={cityError}
                  />
                  <div>
                    <label className="app-section-title text-muted-foreground mb-1.5 block">Short Bio</label>
                    <Textarea value={formData.bio} onChange={e => update("bio", e.target.value)} placeholder="A few words about you..." className={`onboarding-control rounded-xl resize-none ${formData.bio ? "onboarding-control--completed" : ""}`} rows={2} />
                  </div>
                  <div className="grid grid-cols-2 items-stretch gap-3">
                    <OnboardingSelectField
                      label="Dating intention"
                      value={formData.dating_intention}
                      onChange={(value) => update("dating_intention", value)}
                      options={DATING_INTENTION_OPTIONS}
                      placeholder="Select your dating intention"
                      className="flex h-full flex-col"
                      triggerClassName="h-full min-h-9"
                    />
                    <OnboardingSelectField
                      label="Children"
                      value={formData.children}
                      onChange={(value) => update("children", value)}
                      options={CHILDREN_OPTIONS}
                      placeholder="Select children preference"
                      className="flex h-full flex-col"
                      triggerClassName="h-full min-h-9"
                    />
                  </div>
                  <div className="grid grid-cols-2 items-stretch gap-3">
                    <OnboardingSelectField
                      label="Future family desire"
                      value={formData.future_family_desire}
                      onChange={(value) => update("future_family_desire", value)}
                      options={FUTURE_FAMILY_DESIRE_OPTIONS}
                      placeholder="Select future family desire"
                      className="flex h-full flex-col"
                      triggerClassName="h-full min-h-9"
                    />
                    <OnboardingSelectField
                      label="Pets"
                      value={formData.pets}
                      onChange={(value) => update("pets", value)}
                      options={PET_OPTIONS}
                      placeholder="Select pets"
                      className="flex h-full flex-col"
                      triggerClassName="h-full min-h-9"
                    />
                  </div>
                  <div className="grid grid-cols-2 items-stretch gap-3">
                    <OnboardingSelectField
                      label="Drinking"
                      value={formData.drinking}
                      onChange={(value) => update("drinking", value)}
                      options={DRINKING_OPTIONS}
                      placeholder="Select drinking"
                      className="flex h-full flex-col"
                      triggerClassName="h-full min-h-9"
                    />
                    <OnboardingSelectField
                      label="Smoking"
                      value={formData.smoking}
                      onChange={(value) => update("smoking", value)}
                      options={SMOKING_OPTIONS}
                      placeholder="Select smoking"
                      className="flex h-full flex-col"
                      triggerClassName="h-full min-h-9"
                    />
                  </div>
                  <div className="grid grid-cols-2 items-stretch gap-3">
                    <OnboardingSelectField
                      label="Drugs"
                      value={formData.drugs}
                      onChange={(value) => update("drugs", value)}
                      options={DRUGS_OPTIONS}
                      placeholder="Select drugs"
                      className="flex h-full flex-col"
                      triggerClassName="h-full min-h-9"
                    />
                    <OnboardingSelectField
                      label="Religion"
                      value={formData.religion}
                      onChange={(value) => update("religion", value)}
                      options={RELIGION_OPTIONS}
                      placeholder="Select religion"
                      className="flex h-full flex-col"
                      triggerClassName="h-full min-h-9"
                    />
                  </div>
                  <div className="grid grid-cols-2 items-stretch gap-3">
                    <OnboardingSelectField
                      label="Politics"
                      value={formData.politics}
                      onChange={(value) => update("politics", value)}
                      options={POLITICS_OPTIONS}
                      placeholder="Select politics"
                      className="flex h-full flex-col"
                      triggerClassName="h-full min-h-9"
                    />
                    <OnboardingSelectField
                      label="Languages"
                      value={formData.languages}
                      onChange={(value) => update("languages", value)}
                      options={LANGUAGE_OPTIONS}
                      placeholder="Select languages"
                      className="flex h-full flex-col"
                      triggerClassName="h-full min-h-9"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Your answers are private and used only to build your compatibility profile.</p>
                </div>
              </div>
            )}

            {/* METRICS */}
            {stage === "metrics" && (
              <div className="flex-1 flex flex-col gap-6">
                <div>
                  <h2 className="app-title onboarding-page-title mb-1">Preferences</h2>
                  <p className="app-lead onboarding-subtitle text-muted-foreground">Help us find the right matches</p>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="app-section-title text-muted-foreground mb-3 block">Age Range: {formData.age_range_min} – {formData.age_range_max}</label>
                    <div className="space-y-3">
                      {[{ label: "Min", field: "age_range_min" }, { label: "Max", field: "age_range_max" }].map(({ label, field }) => (
                        <div key={field} className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-8">{label}</span>
                          <Slider value={[formData[field]]} onValueChange={([v]) => update(field, v)} min={18} max={60} step={1} className="flex-1" />
                          <span className="text-sm font-medium w-8">{formData[field]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="app-section-title text-muted-foreground mb-2 block">Distance: {formData.distance_preference} miles</label>
                    <Slider value={[formData.distance_preference]} onValueChange={([v]) => update("distance_preference", v)} min={1} max={50} step={1} />
                  </div>
                </div>
              </div>
            )}

            {/* PHOTOS */}
            {stage === "photos" && (
              <div className="flex-1 flex flex-col gap-5">
                <div>
                  <h2 className="app-title mb-1">Your photos</h2>
                  <p className="app-lead text-muted-foreground">Add 3–5 photos that reflect the real you</p>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <label key={i} className={`${i === 0 ? "col-span-2 row-span-2" : ""} aspect-[3/4] rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all overflow-hidden ${formData.photos[i] ? "border-transparent" : "border-border"}`}>
                      {formData.photos[i] ? <img src={formData.photos[i]} className="w-full h-full object-cover rounded-2xl" alt="" /> : (
                        <div className="flex flex-col items-center gap-1 text-muted-foreground">
                          <Camera className="w-5 h-5" />
                          <span className="text-[10px]">{i === 0 ? "Main photo" : `Photo ${i + 1}`}</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center max-w-sm mx-auto">
                  Please upload at least one clear face photo. It helps us verify you safely, keep Tether trusted, and make sure every member knows who they&apos;re meeting.
                </p>
              </div>
            )}

            {/* PROMPTS */}
            {stage === "prompts" && (
              <div className="flex-1 flex flex-col gap-5">
                <div>
                  <h2 className="app-title onboarding-page-title mb-1">Your prompts</h2>
                  <p className="app-lead text-muted-foreground">Help matches understand who you are</p>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "What I'm looking for", field: "prompt_looking_for", placeholder: "Someone who..." },
                    { label: "My ideal weekend", field: "prompt_ideal_weekend", placeholder: "Saturday starts with..." },
                  ].map(({ label, field, placeholder }) => (
                    <div key={field}>
                      <label className="app-section-title text-muted-foreground mb-1.5 block">{label}</label>
                      <Textarea value={formData[field]} onChange={e => update(field, e.target.value)} placeholder={placeholder} className={`onboarding-control rounded-xl resize-none ${formData[field] ? "onboarding-control--completed" : ""}`} rows={2} />
                    </div>
                  ))}
                  <OnboardingMultiSelectField
                    label="Social Energy"
                    values={formData.social_energy}
                    onChange={(value) => update("social_energy", value)}
                    options={SOCIAL_ENERGY_OPTIONS}
                    placeholder="Select social energy"
                  />
                  <OnboardingMultiSelectField
                    label="Relationship Rhythm"
                    values={formData.relationship_rhythm}
                    onChange={(value) => update("relationship_rhythm", value)}
                    options={RELATIONSHIP_RHYTHM_OPTIONS}
                    placeholder="Select relationship rhythm"
                  />
                  <OnboardingMultiSelectField
                    label="Small things I value"
                    values={formData.small_things_i_value}
                    onChange={(value) => update("small_things_i_value", value)}
                    options={SMALL_THINGS_I_VALUE_OPTIONS}
                    placeholder="Select what you value"
                  />
                  <OnboardingMultiSelectField
                    label="Green Flags"
                    values={formData.green_flags}
                    onChange={(value) => update("green_flags", value)}
                    options={GREEN_FLAGS_OPTIONS}
                    placeholder="Select green flags"
                  />
                </div>
              </div>
            )}

            {/* VERIFICATION */}
            {stage === "verification" && (
              <div className="onboarding-screen--verification flex-1 flex flex-col" data-testid="verification-screen">
                <div className="verification-centred-area">
                  <div className="verification-stack" data-testid="verification-stack">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShieldCheck className="w-10 h-10" style={{ color: tierColors.bg }} data-testid="verification-icon" />
                    </div>
                    <div>
                      <h2 className="app-title onboarding-page-title mb-2" style={{ color: tierColors.bg }} data-testid="verification-title">Verification</h2>
                      <p className="app-lead text-muted-foreground max-w-xs leading-relaxed">Every Tether member is verified to create a safer, more trustworthy dating experience.</p>
                    </div>
                    <div className="w-full max-w-xs space-y-3">
                      {[
                        { Icon: CreditCard, title: "ID Verification", desc: "Photo ID matched to your profile" },
                        { Icon: Scan, title: "Selfie Match", desc: "Facial verification confirms your identity" },
                        { Icon: ShieldCheck, title: "Trust Badge", desc: "Verified badge visible to all matches" },
                      ].map(item => (
                        <div key={item.title} className="onboarding-verification-card flex items-center gap-3 p-3.5 rounded-xl text-left" data-testid="verification-card">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: tierColors.light }}>
                            <item.Icon className="w-4 h-4" style={{ color: tierColors.bg }} />
                          </div>
                          <div><p className="text-sm font-semibold">{item.title}</p><p className="text-xs text-muted-foreground">{item.desc}</p></div>
                          <CheckCircle2 className="w-4 h-4 ml-auto" style={{ color: tierColors.bg }} />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground max-w-xs">For this demo, verification is simulated and all profiles are considered verified.</p>
                  </div>
                </div>
              </div>
            )}

            {/* COMPAT INTRO */}
            {stage === "compat_intro" && (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 assessment-screen--centered" data-testid="assessment-intro-screen">
                <img src={membershipTheme.logo} alt={`${tier} Tether logo`} className="assessment-brand-logo" data-testid="assessment-logo" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-primary">Compatibility Assessment</p>
                  <h2 className="assessment-page-title mb-3" data-testid="assessment-page-title">Building your compatibility profile</h2>
                  <p className="assessment-body leading-relaxed max-w-sm">Next, you'll complete a five-part assessment. This isn't a questionnaire — it's the system learning who you are, what you want, and who you're likely to connect with.</p>
                </div>
                <div className="assessment-section-list assessment-section-list--reference" data-testid="assessment-section-list">
                  {compatSections.map((s, index) => (
                    <div key={s.id} className="assessment-section-row" data-testid="assessment-section-row">
                      <div className="assessment-section-row-content">
                        <span className="assessment-section-number" data-testid="assessment-section-number">{s.number}</span>
                        <span className="assessment-section-name" data-testid="assessment-section-name">{s.title}</span>
                      </div>
                      {index < compatSections.length - 1 ? (
                        <div className="assessment-section-separator" />
                      ) : null}
                    </div>
                  ))}
                </div>
                <p className="assessment-microcopy">Takes about 5–7 minutes. The more you put in, the better your matches.</p>
              </div>
            )}

            {/* COMPAT SECTION */}
            {stage === "compat_section" && currentSection && (
              <div className="flex-1 flex flex-col">
                {compatPhase === "intro" ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-7 assessment-screen--centered" data-testid="assessment-section-intro-screen">
                    <div data-testid="assessment-section-intro-logo">
                      <img src={membershipTheme.logo} alt={`${tier} Tether logo`} className="assessment-brand-logo" data-testid="assessment-logo" />
                    </div>
                    <div className="max-w-xs">
                      <p className="assessment-kicker mb-2">SECTION {currentSection.number} / 05</p>
                      <div data-testid="assessment-section-intro-title">
                        <h2 className="assessment-section-title mb-5" data-testid="assessment-section-title">{currentSection.title}</h2>
                      </div>
                      <blockquote className="assessment-section-quote mb-4" data-testid="assessment-section-intro-quote">"{currentSection.quote}"</blockquote>
                      <p className="assessment-body leading-relaxed text-center" data-testid="assessment-section-intro-body">{currentSection.why}</p>
                    </div>
                    <Button onClick={() => { setCompatQuestionIndex(0); setCompatPhase("questions"); }} className="rounded-full w-full max-w-xs" data-testid="assessment-section-begin">Begin <ArrowRight className="w-4 h-4 ml-2" /></Button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <div className="mb-4">
                      <p className="assessment-kicker">SECTION {currentSection.number} / 05</p>
                      <h2 className="assessment-section-title mt-0.5" data-testid="assessment-section-title">{currentSection.title}</h2>
                    </div>
                    <CompatSection section={currentSection} onComplete={handleCompatComplete} onBackToIntro={() => setCompatPhase("intro")} onQuestionIndexChange={setCompatQuestionIndex} />
                  </div>
                )}
              </div>
            )}

            {/* DATE JOURNEY */}
            {stage === "date_journey" && (
              <HowTetherWorksFlow
                pageIndex={howTetherWorksPageIndex}
                onBack={goBack}
                onContinue={() => setHowTetherWorksPageIndex((prev) => Math.min(prev + 1, HOW_TETHER_WORKS_PAGES.length - 1))}
                onEnter={goNext}
                isSubmitting={false}
                tier={ONBOARDING_THEME_TIER}
              />
            )}

            {/* COMPLETE */}
            {stage === "complete" && (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-7">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="w-12 h-12 text-primary" />
                </motion.div>
                <div>
                  <h2 className="app-title mb-2">You're all set</h2>
                  <p className="app-lead text-muted-foreground max-w-xs leading-relaxed">Your compatibility profile is ready. We'll curate your first set of daily matches based on everything you've shared.</p>
                </div>
                <Button onClick={handleComplete} size="lg" className="w-full max-w-xs rounded-full" disabled={loading}>
                  {loading ? "Setting up your profile..." : "Choose your membership"} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {["basics", "metrics", "photos", "prompts", "verification", "compat_intro"].includes(stage) && (
          <div className="flex items-center gap-3 pt-4 pb-3">
            {stage === "basics" ? (
              <Button onClick={handleBasicsContinue} disabled={!canProceed()} className="rounded-full flex-1 h-auto py-2.5 text-xs whitespace-normal text-center leading-snug">Continue to your compatibility profile <ArrowRight className="w-3.5 h-3.5 ml-1 flex-shrink-0" /></Button>
            ) : (
              <Button onClick={goNext} disabled={!canProceed()} className="rounded-full flex-1">Continue <ArrowRight className="w-4 h-4 ml-1" /></Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
