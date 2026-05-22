import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BriefcaseBusiness, Camera, ChevronUp, GraduationCap, Loader2, LogOut, MapPin, Save, Settings, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { localApp } from "@/api/localClient";
import { useTier } from "../hooks/useTier";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProfilePhotoCarousel from "../components/ProfilePhotoCarousel";
import { getDemoUserProfile } from "@/data/demo/demoUserProfiles";
import { useDemoUserContext } from "@/hooks/useDemoUserContext";
import { getMembershipRoute } from "@/lib/matchFlowRoutes";
import { getProfilePreviewTheme } from "@/lib/profilePreviewTheme";
import {
  CHILDREN_OPTIONS,
  GREEN_FLAGS_OPTIONS,
  RELATIONSHIP_RHYTHM_OPTIONS,
  SMALL_THINGS_I_VALUE_OPTIONS,
  SOCIAL_ENERGY_OPTIONS,
  applyDefaultProfileDetails,
  buildHeightData,
  createAtAGlanceItems,
  createSecondaryBannerItems,
  getEducationDataFromProfile,
  getHeightDataFromProfile,
  getAgeFromDob,
  getDemoAutoFillCopy,
  getDemoProfileDefaults,
  getDerivedStarSign,
} from "@/lib/onboardingProfile";
import { getRouteOrientationFromContext, normalizeGenderIdentity, normalizeLookingFor, normalizeSexualPreference } from "@/lib/compatibilityVariantRouting";

function EthnicityGlyph({ className = "w-3.5 h-3.5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="9.5" cy="9.5" r="3.2" />
      <path d="M14.8 14.8a3.2 3.2 0 0 0 4.5 0" />
    </svg>
  );
}

function formatGenderLabel(value = "") {
  const normalized = normalizeGenderIdentity(value);
  if (normalized === "female") return "Woman";
  if (normalized === "non_binary") return "Non-binary";
  if (normalized === "trans_male") return "Trans male";
  if (normalized === "trans_female") return "Trans female";
  return "Man";
}

function formatPreferenceLabel(value = "") {
  const normalized = normalizeSexualPreference(value);
  if (normalized === "open_preference" || normalized === "open-preference") return "Open preference";
  return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1).replace(/_/g, " ") : "";
}

function formatLookingForLabel(value = "") {
  const normalized = normalizeLookingFor(value);
  if (normalized === "men_women") return "Men & Women";
  if (normalized === "non_binary_people") return "Non-binary people";
  if (normalized === "open_to_all") return "Open to all";
  if (normalized === "women") return "Women";
  return "Men";
}

function buildFallbackProfile(context, routedDemo) {
  const demoDefaults = getDemoProfileDefaults({
    genderIdentity: context?.genderIdentity || "male",
    sexualPreference: context?.sexualPreference || getRouteOrientationFromContext(context),
    lookingFor: context?.lookingFor || "open_to_all",
  }) || {};
  const autoCopy = getDemoAutoFillCopy({
    genderIdentity: context?.genderIdentity || "male",
    sexualPreference: context?.sexualPreference || getRouteOrientationFromContext(context),
    lookingFor: context?.lookingFor || "open_to_all",
  }) || {};
  const defaults = applyDefaultProfileDetails(
    {},
    context?.genderIdentity || "male",
    context?.sexualPreference || getRouteOrientationFromContext(context),
    context?.lookingFor || "open_to_all",
  );
  const birthDate = routedDemo.birthDate || context?.birthDate || "1993-05-01";

  return {
    id: "demo-profile",
    display_name: localStorage.getItem("tether_entry_name") || routedDemo.displayName || "Tom",
    age: getAgeFromDob(birthDate) || routedDemo.age,
    birth_date: birthDate,
    derived_star_sign: getDerivedStarSign(birthDate),
    bio: autoCopy.bio || routedDemo.bio || demoDefaults.bio,
    location: routedDemo.location || demoDefaults.location,
    photos: routedDemo.photoSet,
    is_verified: true,
    age_range_min: 26,
    age_range_max: 38,
    distance_preference: 15,
    gender_identity: normalizeGenderIdentity(context?.genderIdentity || "male"),
    gender_identity_label: formatGenderLabel(context?.genderIdentity || "male"),
    sexual_preference: normalizeSexualPreference(context?.sexualPreference || getRouteOrientationFromContext(context)),
    sexual_preference_label: formatPreferenceLabel(context?.sexualPreference || getRouteOrientationFromContext(context)),
    dating_preference: normalizeLookingFor(context?.lookingFor || "open_to_all"),
    dating_preference_label: formatLookingForLabel(context?.lookingFor || "open_to_all"),
    prompt_looking_for: autoCopy.prompt_looking_for || demoDefaults.prompt_looking_for || "",
    prompt_ideal_weekend: autoCopy.prompt_ideal_weekend || demoDefaults.prompt_ideal_weekend || "",
    social_energy: demoDefaults.social_energy || SOCIAL_ENERGY_OPTIONS.slice(0, 4),
    relationship_rhythm: demoDefaults.relationship_rhythm || RELATIONSHIP_RHYTHM_OPTIONS.slice(0, 3),
    small_things_i_value: demoDefaults.small_things_i_value || SMALL_THINGS_I_VALUE_OPTIONS.slice(0, 6),
    green_flags: demoDefaults.green_flags || GREEN_FLAGS_OPTIONS.slice(0, 5),
    children: demoDefaults.children || CHILDREN_OPTIONS[0],
    education: getEducationDataFromProfile(demoDefaults).displayInstitution || demoDefaults.education,
    education_level: getEducationDataFromProfile(demoDefaults).level || "Bachelor's Degree",
    education_institution: getEducationDataFromProfile(demoDefaults).displayInstitution || demoDefaults.education,
    education_details: getEducationDataFromProfile(demoDefaults),
    height_cm: demoDefaults.height_cm || 184,
    height_unit: "cm",
    height_feet: "",
    height_inches: "",
    height: buildHeightData({ unit: "cm", cmValue: demoDefaults.height_cm || 184 }),
    height_display_value: buildHeightData({ unit: "cm", cmValue: demoDefaults.height_cm || 184 }).displayValue,
    ...defaults,
  };
}

function buildProfileSections(profile) {
  return [
    { title: "About", body: profile.bio },
    { title: "What I'm looking for", body: profile.prompt_looking_for },
    { title: "My ideal weekend", body: profile.prompt_ideal_weekend },
    { title: "Social Energy", chips: profile.social_energy || [] },
    { title: "Relationship Rhythm", chips: profile.relationship_rhythm || [] },
    { title: "Small things I value", chips: profile.small_things_i_value || [] },
    { title: "Green Flags", chips: profile.green_flags || [] },
  ].filter((section) => section.body || (Array.isArray(section.chips) && section.chips.length));
}

export default function Profile() {
  const { tier, tierData } = useTier();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [showScrollTopBanner, setShowScrollTopBanner] = useState(false);
  const { context } = useDemoUserContext();
  const routedDemo = getDemoUserProfile(context);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset || 0;
      const shouldShow = scrollTop > 420;
      setShowScrollTopBanner((current) => (current === shouldShow ? current : shouldShow));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadProfile = async () => {
    const fallbackProfile = buildFallbackProfile(context, routedDemo);
    try {
      const user = await localApp.auth.me();
      const profiles = await localApp.entities.Profile.filter({ created_by: user.email });
      if (profiles.length > 0) {
        setProfile(profiles[0]);
        setEditData(profiles[0]);
      } else {
        setProfile(fallbackProfile);
        setEditData(fallbackProfile);
      }
    } catch {
      setProfile(fallbackProfile);
      setEditData(fallbackProfile);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!profile) return;
    if (profile.id === "demo-profile") {
      setProfile({ ...profile, ...editData });
      setEditing(false);
      toast.success("Profile updated!");
      return;
    }
    setSaving(true);
    await localApp.entities.Profile.update(profile.id, {
      display_name: editData.display_name,
      bio: editData.bio,
      location: editData.location,
      prompt_looking_for: editData.prompt_looking_for,
      prompt_ideal_weekend: editData.prompt_ideal_weekend,
      social_energy: editData.social_energy,
      relationship_rhythm: editData.relationship_rhythm,
      small_things_i_value: editData.small_things_i_value,
      green_flags: editData.green_flags,
    });
    setProfile({ ...profile, ...editData });
    setEditing(false);
    setSaving(false);
    toast.success("Profile updated!");
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (profile?.id === "demo-profile") {
      toast.info("Photo upload isn't enabled in this demo flow yet.");
      return;
    }
    const { file_url } = await localApp.integrations.Core.UploadFile({ file });
    const updatedPhotos = [...(profile.photos || []), file_url];
    await localApp.entities.Profile.update(profile.id, { photos: updatedPhotos });
    setProfile({ ...profile, photos: updatedPhotos });
    setEditData({ ...editData, photos: updatedPhotos });
    toast.success("Photo added!");
  };

  const handleLogout = () => {
    localApp.auth.logout();
  };

  const effectiveProfile = useMemo(() => {
    if (!profile) return null;
    const fallback = buildFallbackProfile(context, routedDemo);
    const merged = {
      ...fallback,
      ...profile,
      photos: Array.isArray(profile.photos) && profile.photos.length ? profile.photos : fallback.photos,
    };
    [
      "display_name",
      "location",
      "bio",
      "prompt_looking_for",
      "prompt_ideal_weekend",
      "height_display_value",
      "education_level",
      "education_institution",
      "pronouns",
      "education",
      "work",
      "ethnicity",
      "dating_intention",
      "children",
      "future_family_desire",
      "pets",
      "drinking",
      "smoking",
      "drugs",
      "religion",
      "politics",
      "languages",
    ].forEach((key) => {
      if (!merged[key]) merged[key] = fallback[key];
    });
    if (!merged.education_details?.displayInstitution && !merged.education_details?.displayLevel) {
      merged.education_details = getEducationDataFromProfile(merged.education || merged.education_level || merged.education_institution ? merged : fallback);
    }
    [
      "social_energy",
      "relationship_rhythm",
      "small_things_i_value",
      "green_flags",
    ].forEach((key) => {
      if (!Array.isArray(merged[key]) || merged[key].length === 0) merged[key] = fallback[key];
    });
    merged.birth_date = merged.birth_date || routedDemo.birthDate;
    merged.height = getHeightDataFromProfile(merged);
    merged.age = getAgeFromDob(merged.birth_date) || merged.age || fallback.age;
    merged.derived_star_sign = merged.derived_star_sign || getDerivedStarSign(merged.birth_date);
    merged.gender_identity_label = merged.gender_identity_label || formatGenderLabel(merged.gender_identity || context?.genderIdentity || "male");
    merged.sexual_preference_label = merged.sexual_preference_label || formatPreferenceLabel(merged.sexual_preference || context?.sexualPreference || getRouteOrientationFromContext(context));
    merged.dating_preference_label = merged.dating_preference_label || formatLookingForLabel(merged.dating_preference || context?.lookingFor || "open_to_all");
    return merged;
  }, [context, profile, routedDemo]);

  const profileSections = useMemo(() => (effectiveProfile ? buildProfileSections(effectiveProfile) : []), [effectiveProfile]);
  const atAGlance = useMemo(() => (effectiveProfile ? createAtAGlanceItems(effectiveProfile) : []), [effectiveProfile]);
  const secondaryBannerItems = useMemo(() => {
    if (!effectiveProfile) return [];
    return createSecondaryBannerItems(effectiveProfile).map((item) =>
      item.key === "ethnicity" ? { ...item, icon: EthnicityGlyph } : item,
    );
  }, [effectiveProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!effectiveProfile) return null;

  const verifiedBannerTheme =
    tier === "concierge"
      ? {
          bg: "#242623",
          border: "rgba(210, 198, 178, 0.30)",
          title: "#d2c6b2",
          copy: "rgba(210, 198, 178, 0.78)",
          icon: "#d2c6b2",
        }
      : tier === "premium"
        ? {
            bg: "rgba(55, 66, 58, 0.52)",
            border: "rgba(248, 243, 241, 0.22)",
            title: "#f8f3f1",
            copy: "rgba(248, 243, 241, 0.78)",
            icon: "#f8f3f1",
          }
        : {
            bg: "rgba(212, 210, 205, 0.48)",
            border: "rgba(55, 66, 58, 0.14)",
            title: "#37423a",
            copy: "rgba(55, 66, 58, 0.72)",
            icon: "#37423a",
          };
  const profileBannerTheme =
    tier === "concierge"
      ? {
          headerBg: "#242623",
          headerText: "#d2c6b2",
          surface: "#242623",
          border: "rgba(210, 198, 178, 0.30)",
          bodyText: "rgba(210, 198, 178, 0.84)",
          sectionTitle: "#d2c6b2",
          sectionSymbol: "#d2c6b2",
          memberBodyBg: "#242623",
        }
      : tier === "premium"
        ? {
            headerBg: "#37423a",
            headerText: "#f8f3f1",
            surface: "#5b655d",
            border: "rgba(248, 243, 241, 0.28)",
            bodyText: "rgba(248, 243, 241, 0.78)",
            sectionTitle: "#f8f3f1",
            sectionSymbol: "#f8f3f1",
            memberBodyBg: "#5b655d",
          }
        : {
            headerBg: "#37423a",
            headerText: "#f8f3f1",
            surface: "#f8f3f1",
            border: "rgba(55, 66, 58, 0.18)",
            bodyText: "#37423a",
            sectionTitle: "#37423a",
            sectionSymbol: "#d8c6ae",
            memberBodyBg: "#d4d2cd",
          };

  const isPremium = tier === "premium";
  const isConcierge = tier === "concierge";
  const previewTheme = getProfilePreviewTheme(tier);
  const detailHeaderBg = isConcierge ? previewTheme.headerBg : "#37423a";
  const detailHeaderText = isConcierge ? previewTheme.headerText : "#f8f3f1";
  const sectionHeaderBg = isConcierge ? "#d2c6b2" : isPremium ? "#737973" : "#37423a";
  const sectionHeaderText = isConcierge ? "#141916" : "#f8f3f1";
  const profileMetricsBg = isConcierge ? previewTheme.summaryBg : isPremium ? "#737973" : profileBannerTheme.surface;
  const atAGlanceBg = isConcierge ? "#d2c6b2" : isPremium ? "#37423a" : "#37423a";
  const atAGlanceText = isConcierge ? "#141916" : "#f8f3f1";
  const atAGlanceChipBg = isConcierge ? "#242623" : isPremium ? "#37423a" : "#e7e5e2";
  const atAGlanceChipText = isConcierge ? "#d2c6b2" : isPremium ? "#f8f3f1" : "#6c756d";
  const standardSectionContentBg = "#E6E4E0";
  const bodySurfaceStyle = isPremium || isConcierge ? { background: profileBannerTheme.surface } : { background: standardSectionContentBg };
  const cardBorderColor = isPremium || isConcierge ? profileBannerTheme.border : undefined;

  return (
    <div className="max-w-lg mx-auto font-body">
      {showScrollTopBanner ? (
        <div className="fixed left-1/2 top-[72px] z-[40] flex -translate-x-1/2 justify-center px-4">
          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setShowScrollTopBanner(false);
            }}
            className="inline-flex min-w-[240px] items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-xs font-body text-foreground shadow-sm btn-hover-light whitespace-nowrap"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            <span>View the rest of your profile</span>
          </button>
        </div>
      ) : null}

      <div className="flex items-center justify-between px-4 pt-6 mb-5">
        <h1 className="text-xl font-heading font-bold">Profile</h1>
        <div>
          {!editing ? (
            <Button variant="outline" size="sm" className="rounded-full text-xs btn-hover-light bg-card border-border" onClick={() => setEditing(true)}>
              <Settings className="w-3.5 h-3.5 mr-1" /> Edit
            </Button>
          ) : (
            <Button size="sm" className="rounded-full text-xs" onClick={handleSave} disabled={saving}>
              <Save className="w-3.5 h-3.5 mr-1" /> {saving ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
      </div>

      <div className="px-4 mb-5">
        <div className="relative profile-photo-frame">
          <ProfilePhotoCarousel photos={effectiveProfile.photos} className="aspect-[3/4] w-full rounded-2xl" />
          <label className="profile-camera-button w-10 h-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center cursor-pointer shadow-lg border border-border">
            <Camera className="w-4 h-4" />
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>
      </div>

      <div className="space-y-4 px-4 pb-6">
        <div className="rounded-[26px] border bg-card overflow-hidden" style={{ borderColor: profileBannerTheme.border, background: profileBannerTheme.surface }}>
          <div className="px-5 py-2.5 text-center" style={{ background: detailHeaderBg, color: detailHeaderText }}>
            {editing ? (
              <Input
                value={editData.display_name}
                onChange={(e) => setEditData({ ...editData, display_name: e.target.value })}
                className="rounded-xl text-xl font-bold font-heading text-center"
              />
            ) : (
              <h2 className="font-heading font-bold text-[17px] leading-[1.1]">{effectiveProfile.display_name}, {effectiveProfile.age}</h2>
            )}
          </div>
          <div className="px-5 py-4" style={{ background: profileMetricsBg }}>
            <div className="mx-auto grid w-fit max-w-full grid-cols-2 gap-x-6 gap-y-4 min-w-0">
              {secondaryBannerItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="grid grid-cols-[16px_minmax(0,1fr)] items-center gap-2.5 text-xs font-body" style={{ color: isConcierge ? previewTheme.summaryText : profileBannerTheme.bodyText }}>
                    <Icon className="w-3.5 h-3.5" />
                    <span className="leading-tight">{item.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border-t border-border px-5 py-3" style={{ background: atAGlanceBg }}>
            <p className="text-[11px] font-body font-semibold uppercase tracking-[0.14em] text-center mb-2.5" style={{ color: atAGlanceText }}>
              At a glance
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch", scrollSnapType: "x mandatory" }}>
              {atAGlance.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-body"
                    style={{
                      scrollSnapAlign: "start",
                      background: atAGlanceChipBg,
                      color: atAGlanceChipText,
                      borderColor: cardBorderColor || "hsl(var(--border))",
                    }}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="leading-none whitespace-nowrap">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl p-3 border" style={{ background: verifiedBannerTheme.bg, borderColor: verifiedBannerTheme.border }}>
          <ShieldCheck className="w-5 h-5" style={{ color: verifiedBannerTheme.icon }} />
          <div>
            <p className="text-sm font-heading font-bold" style={{ color: verifiedBannerTheme.title }}>Identity Verified</p>
            <p className="text-xs font-body" style={{ color: verifiedBannerTheme.copy }}>Your profile is verified and trusted</p>
          </div>
        </div>

        {profileSections.map((card) => (
          <div key={card.title} className="rounded-2xl border border-border bg-card overflow-hidden" style={{ borderColor: cardBorderColor, background: isPremium || isConcierge ? profileBannerTheme.surface : undefined }}>
            <div className="px-5 py-2.5 text-center" style={{ background: sectionHeaderBg, color: sectionHeaderText }}>
              <p className="font-heading font-bold leading-[1.1]" style={{ fontSize: "clamp(17px,4.4vw,21px)" }}>{card.title}</p>
            </div>
            <div className="px-5 py-3" style={bodySurfaceStyle}>
              {card.body ? <p className="text-[12px] font-body leading-relaxed text-center" style={{ color: isPremium || isConcierge ? profileBannerTheme.bodyText : undefined }}>{card.body}</p> : null}
              {card.chips ? (
                <div className="flex flex-wrap justify-center gap-2">
                  {card.chips.map((chip) => (
                    <span key={chip} className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-[11px] font-body text-muted-foreground">
                      {chip}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ))}

        <div className="space-y-3">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center min-h-[28px]">
            <div className="flex justify-end pr-2">
              <Sparkles className="w-3.5 h-3.5" style={{ color: profileBannerTheme.sectionSymbol }} />
            </div>
            <h3 className="text-[clamp(18px,4.8vw,22px)] leading-[1.15] font-heading font-bold text-center" style={{ color: profileBannerTheme.sectionTitle }}>
              Preferences
            </h3>
            <div />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-[22px] overflow-hidden border" style={{ borderColor: profileBannerTheme.border, background: profileBannerTheme.surface }}>
              <div className="px-2 py-2 text-center" style={{ background: profileBannerTheme.headerBg }}>
                <p className="font-heading font-bold leading-none" style={{ color: profileBannerTheme.headerText, fontSize: "clamp(15px,4vw,18px)" }}>Intent</p>
              </div>
              <div className="px-2 py-2.5 text-center">
                <p className="font-body leading-none" style={{ color: profileBannerTheme.bodyText, fontSize: "clamp(12px,3.1vw,14px)" }}>{effectiveProfile.dating_intention}</p>
              </div>
            </div>
            <div className="rounded-[22px] overflow-hidden border" style={{ borderColor: profileBannerTheme.border, background: profileBannerTheme.surface }}>
              <div className="px-2 py-2 text-center" style={{ background: profileBannerTheme.headerBg }}>
                <p className="font-heading font-bold leading-none" style={{ color: profileBannerTheme.headerText, fontSize: "clamp(15px,4vw,18px)" }}>Age Range</p>
              </div>
              <div className="px-2 py-2.5 text-center">
                <p className="font-body leading-none" style={{ color: profileBannerTheme.bodyText, fontSize: "clamp(12px,3.1vw,14px)" }}>{effectiveProfile.age_range_min}–{effectiveProfile.age_range_max}</p>
              </div>
            </div>
            <div className="rounded-[22px] overflow-hidden border" style={{ borderColor: profileBannerTheme.border, background: profileBannerTheme.surface }}>
              <div className="px-2 py-2 text-center" style={{ background: profileBannerTheme.headerBg }}>
                <p className="font-heading font-bold leading-none" style={{ color: profileBannerTheme.headerText, fontSize: "clamp(15px,4vw,18px)" }}>Distance</p>
              </div>
              <div className="px-2 py-2.5 text-center">
                <p className="font-body leading-none" style={{ color: profileBannerTheme.bodyText, fontSize: "clamp(12px,3.1vw,14px)" }}>{effectiveProfile.distance_preference}mi</p>
              </div>
            </div>
          </div>
        </div>

        <Link
          to={getMembershipRoute(location.pathname)}
          state={{ from: "profile-membership" }}
          className="block rounded-[24px] overflow-hidden border mb-2 btn-hover-light"
          style={{ borderColor: profileBannerTheme.border }}
        >
          <div className="px-4 py-3 flex items-center justify-center text-center" style={{ background: profileBannerTheme.headerBg }}>
            <p className="font-heading font-bold leading-none" style={{ color: profileBannerTheme.headerText, fontSize: "clamp(18px,4.8vw,22px)" }}>
              {tierData.name} Member
            </p>
          </div>
          <div className="px-4 py-3 text-center" style={{ background: profileBannerTheme.memberBodyBg }}>
            <p className="font-body leading-none" style={{ color: profileBannerTheme.bodyText, fontSize: "clamp(13px,3.4vw,15px)" }}>
              Manage Membership ({tierData.price} · {tierData.priceDetail})
            </p>
          </div>
        </Link>

        <Button variant="ghost" className="w-full text-muted-foreground rounded-full mt-4" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );
}
