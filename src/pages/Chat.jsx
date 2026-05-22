import { useMemo, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCurrentMatch } from "@/hooks/useCurrentMatch";
import { getDemoUserProfile } from "@/data/demo/demoUserProfiles";
import { getDemoChatThread } from "@/data/demo/demoChatThreads";
import { getConversationsRoute } from "@/lib/matchFlowRoutes";

function getConversationTheme(tier) {
  if (tier === "premium") {
    return {
      page: "bg-[#5b655d] text-[#f8f3f1]",
      header: "border-[#f8f3f1]/20",
      incoming: "bg-[#37423a] text-[#f8f3f1] border border-[#f8f3f1]/20",
      outgoing: "bg-[#f8f3f1] text-[#37423a]",
      input: "bg-[#37423a] text-[#f8f3f1] border border-[#f8f3f1]/24",
      placeholder: "placeholder:text-[#f8f3f1]/70",
      send: "bg-[#f8f3f1] text-[#37423a]",
      meta: "text-[#f8f3f1]/72",
    };
  }
  if (tier === "concierge") {
    return {
      page: "bg-[#0a0d0a] text-[#d8c6ae]",
      header: "border-[#d8c6ae]/24",
      incoming: "bg-[#232623] text-[#d8c6ae] border border-[#d8c6ae]/20",
      outgoing: "bg-[#d8c6ae] text-[#0a0d0a]",
      input: "bg-[#232623] text-[#d8c6ae] border border-[#d8c6ae]/24",
      placeholder: "placeholder:text-[#d8c6ae]/64",
      send: "bg-[#d8c6ae] text-[#0a0d0a]",
      meta: "text-[#d8c6ae]/72",
    };
  }
  return {
    page: "bg-[#f8f3f1] text-[#37423a]",
    header: "border-[#37423a]/12",
    incoming: "bg-[#d4d2cd] text-[#37423a] border border-[#37423a]/12",
    outgoing: "bg-[#37423a] text-[#f8f3f1]",
    input: "bg-[#d4d2cd] text-[#37423a] border border-[#37423a]/18",
    placeholder: "placeholder:text-[#37423a]/64",
    send: "bg-[#37423a] text-[#f8f3f1]",
    meta: "text-[#37423a]/70",
  };
}

function getBackRoute(pathname) {
  return getConversationsRoute(pathname);
}

export default function Chat() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { context, match, isFallback } = useCurrentMatch(matchId, "conversations");
  const [draft, setDraft] = useState("");

  const user = useMemo(() => getDemoUserProfile(context), [context]);
  const thread = useMemo(() => getDemoChatThread(match, context, user), [match, context, user]);
  const theme = getConversationTheme(context?.membershipTier || "standard");

  if (!match || !thread || isFallback) {
    return (
      <div className={`min-h-screen ${theme.page} px-6 py-10`} data-testid="chat-conversation-page">
        <button onClick={() => navigate(getBackRoute(location.pathname))} className="inline-flex items-center gap-2 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <p className="mt-8 text-base font-medium">We couldn’t load this chat. Please return to Chat.</p>
      </div>
    );
  }

  const sendDisabled = !draft.trim();

  return (
    <div className={`min-h-screen h-screen flex flex-col ${theme.page}`} data-testid="chat-conversation-page">
      <header className={`px-4 py-3 border-b ${theme.header}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(getBackRoute(location.pathname))} className="inline-flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <img src={match.photoPath} alt={match.displayName} className="w-9 h-9 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="font-heading text-lg leading-none truncate">{match.displayName}</p>
            <p className={`text-xs truncate mt-1 ${theme.meta}`}>
              {match.firstDateSuggestion?.venueName || "Date plan pending"} · {String(match.location || "London").split(",")[0]}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {thread.messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`} data-testid="chat-message">
              <div className="max-w-[84%]">
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser ? theme.outgoing : theme.incoming}`} data-testid={isUser ? "chat-message-user" : "chat-message-match"}>
                  {msg.text}
                </div>
                <p className={`mt-1 text-[11px] ${theme.meta}`}>{msg.timestamp}</p>
              </div>
            </div>
          );
        })}
      </main>

      <footer className={`px-4 py-3 border-t ${theme.header}`}>
        <div className="flex items-center gap-2">
          <input
            data-testid="chat-message-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Message ${match.displayName}...`}
            className={`h-11 rounded-full px-4 flex-1 text-sm outline-none ${theme.input} ${theme.placeholder}`}
          />
          <button
            data-testid="chat-send-button"
            type="button"
            disabled={sendDisabled}
            className={`h-11 w-11 rounded-full inline-flex items-center justify-center ${theme.send} disabled:opacity-50`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
