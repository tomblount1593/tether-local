import { useMemo, useState } from "react";
import { ArrowLeft, Camera, CameraOff, Mic, MicOff, PhoneOff, Video } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCurrentMatch } from "@/hooks/useCurrentMatch";
import { getDemoUserProfile } from "@/data/demo/demoUserProfiles";
import { getConversationsRoute } from "@/lib/matchFlowRoutes";

function getConversationTheme(tier) {
  if (tier === "premium") {
    return {
      page: "bg-[#5b655d] text-[#f8f3f1]",
      header: "border-[#f8f3f1]/20",
      panel: "bg-[#37423a] border border-[#f8f3f1]/20",
      panelMuted: "bg-[#37423a]/70 border border-[#f8f3f1]/14",
      chip: "bg-[#f8f3f1] text-[#37423a]",
      meta: "text-[#f8f3f1]/72",
      subtle: "text-[#f8f3f1]/84",
      control: "bg-[#f8f3f1]/12 text-[#f8f3f1] border border-[#f8f3f1]/20",
      controlActive: "bg-[#f8f3f1] text-[#37423a]",
      danger: "bg-[#d06d5b] text-white",
    };
  }
  if (tier === "concierge") {
    return {
      page: "bg-[#0a0d0a] text-[#d8c6ae]",
      header: "border-[#d8c6ae]/24",
      panel: "bg-[#232623] border border-[#d8c6ae]/20",
      panelMuted: "bg-[#232623]/72 border border-[#d8c6ae]/14",
      chip: "bg-[#d8c6ae] text-[#0a0d0a]",
      meta: "text-[#d8c6ae]/72",
      subtle: "text-[#d8c6ae]/84",
      control: "bg-[#d8c6ae]/12 text-[#d8c6ae] border border-[#d8c6ae]/20",
      controlActive: "bg-[#d8c6ae] text-[#0a0d0a]",
      danger: "bg-[#7c302f] text-[#f7e8df]",
    };
  }
  return {
    page: "bg-[#f8f3f1] text-[#37423a]",
    header: "border-[#37423a]/12",
    panel: "bg-[#d4d2cd] border border-[#37423a]/12",
    panelMuted: "bg-[#d4d2cd]/72 border border-[#37423a]/10",
    chip: "bg-[#37423a] text-[#f8f3f1]",
    meta: "text-[#37423a]/70",
    subtle: "text-[#37423a]/82",
    control: "bg-[#37423a]/8 text-[#37423a] border border-[#37423a]/14",
    controlActive: "bg-[#37423a] text-[#f8f3f1]",
    danger: "bg-[#b85b58] text-white",
  };
}

function getBackRoute(pathname) {
  return getConversationsRoute(pathname);
}

export default function VideoCall() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { context, match, isFallback } = useCurrentMatch(matchId, "conversations");
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  const user = useMemo(() => getDemoUserProfile(context), [context]);
  const theme = getConversationTheme(context?.membershipTier || "standard");

  if (!match || isFallback) {
    return (
      <div className={`min-h-screen ${theme.page} px-6 py-10`} data-testid="video-call-page">
        <button onClick={() => navigate(getBackRoute(location.pathname))} className="inline-flex items-center gap-2 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <p className="mt-8 text-base font-medium">We couldn&apos;t load this video call. Please return to Chat.</p>
      </div>
    );
  }

  const venueLabel = match.firstDateSuggestion?.venueName || "Date plan pending";
  const locationLabel = String(match.location || "London").split(",")[0];

  return (
    <div className={`min-h-screen h-screen flex flex-col ${theme.page}`} data-testid="video-call-page">
      <header className={`px-4 py-3 border-b ${theme.header}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(getBackRoute(location.pathname))} className="inline-flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <img src={match.photoPath} alt={match.displayName} className="w-9 h-9 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="font-heading text-lg leading-none truncate">{match.displayName}</p>
            <p className={`text-xs truncate mt-1 ${theme.meta}`}>{venueLabel} · {locationLabel}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 flex flex-col gap-3 min-h-0">
        <div className={`flex-1 min-h-0 rounded-[28px] overflow-hidden relative ${theme.panel}`}>
          <div className="absolute inset-0">
            <img src={match.photoPath} alt={match.displayName} className={`w-full h-full object-cover ${cameraOff ? "opacity-20" : "opacity-100"}`} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/50" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between p-4">
            <div className="flex items-start justify-between gap-3">
              <div className={`rounded-full px-3 py-1.5 inline-flex items-center gap-2 ${theme.panelMuted}`}>
                <Video className="w-4 h-4" />
                <span className="text-xs font-semibold">Video call ready</span>
              </div>
              <div className={`rounded-full px-3 py-1.5 ${theme.panelMuted}`}>
                <span className="text-xs font-semibold">00:12</span>
              </div>
            </div>

            <div className="self-end w-[120px] rounded-[22px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.22)]">
              <div className={`aspect-[3/4] relative ${theme.panelMuted}`}>
                {cameraOff ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <CameraOff className="w-6 h-6" />
                    <span className="text-[11px] font-medium">Camera off</span>
                  </div>
                ) : (
                  <>
                    <img src={user?.photoPath || match.photoPath} alt="You" className="w-full h-full object-cover opacity-95" />
                    <div className="absolute inset-0 bg-black/10" />
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 text-center">
              <div className={`rounded-full px-3 py-1.5 ${theme.chip}`}>
                <span className="text-xs font-semibold">Connected</span>
              </div>
              <div>
                <p className="font-heading text-[28px] leading-none">{match.displayName}</p>
                <p className={`text-sm mt-1 ${theme.subtle}`}>Pre-date video check-in before tomorrow&apos;s plan</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setMicMuted((value) => !value)}
            className={`min-h-[56px] rounded-2xl flex flex-col items-center justify-center gap-1 ${micMuted ? theme.controlActive : theme.control}`}
          >
            {micMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span className="text-[11px] font-semibold">{micMuted ? "Mic off" : "Mic on"}</span>
          </button>
          <button
            type="button"
            onClick={() => setCameraOff((value) => !value)}
            className={`min-h-[56px] rounded-2xl flex flex-col items-center justify-center gap-1 ${cameraOff ? theme.controlActive : theme.control}`}
          >
            {cameraOff ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            <span className="text-[11px] font-semibold">{cameraOff ? "Camera off" : "Camera on"}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(getBackRoute(location.pathname))}
            className={`min-h-[56px] rounded-2xl flex flex-col items-center justify-center gap-1 ${theme.danger}`}
          >
            <PhoneOff className="w-5 h-5" />
            <span className="text-[11px] font-semibold">End call</span>
          </button>
        </div>
      </main>
    </div>
  );
}
