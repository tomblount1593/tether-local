import { Outlet, Link, useLocation } from "react-router-dom";
import { Heart, MessageCircle, User, Sparkles, Map, BarChart2, Crown } from "lucide-react";
import MembershipBanner from "./MembershipBanner";
import { useTier } from "../hooks/useTier";
import { getMembershipTheme } from "@/brand/membershipTheme";
import { DEMO_VARIANT_ROUTE_SLUGS } from "@/data/demo/demoVariantRoutes";

export default function AppLayout() {
  const location = useLocation();
  const { tier, tierData } = useTier();

  // Detect orientation suffix from current path (e.g. "-gay", "-lesbian", etc.)
  const currentOrientation = DEMO_VARIANT_ROUTE_SLUGS.find(o =>
    location.pathname === `/${o}` ||
    location.pathname.startsWith(`/app-${o}`) ||
    location.pathname.includes(`-${o}`)
  ) || null;
  const suffix = currentOrientation ? `-${currentOrientation}` : "";

  // Base paths for each nav item — append suffix when in orientation context
  const navItems = [
    { basePath: "/discover",      altPaths: ["/", "/app"], icon: Sparkles,      label: "Discover" },
    { basePath: "/matches",       altPaths: [],             icon: Heart,         label: "Matches" },
    { basePath: "/conversations", altPaths: [],             icon: MessageCircle, label: "Chat" },
    ...(tier === "premium" || tier === "concierge" ? [{ basePath: "/map", altPaths: [], icon: Map, label: "Map" }] : []),
    ...(tier === "concierge" ? [{ basePath: "/expert", altPaths: [], icon: Crown, label: "Expert" }] : []),
    { basePath: "/insights",      altPaths: [],             icon: BarChart2,     label: "Insights" },
    { basePath: "/profile",       altPaths: [],             icon: User,          label: "Profile" },
  ].map(item => ({
    ...item,
    path: item.basePath + suffix,
  }));

  const theme = getMembershipTheme(tier);
  const navBg = tier === "standard" ? theme.background : theme.surface;
  const navBorder = tier === "concierge" ? "rgba(216,198,174,0.2)" : "rgba(55,66,58,0.22)";
  const activeColor = tier === "concierge" ? theme.accent : theme.primaryText;
  const inactiveColor = tier === "standard" ? "#6c756d" : theme.secondaryText;

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      style={{
        ["--membership-banner-height"]: "48px",
        ["--bottom-nav-height"]: "calc(72px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {/* Global membership banner — sticky, above Toaster (z-100) */}
      <div style={{ position: 'sticky', top: 0, zIndex: 200 }}>
        <MembershipBanner />
      </div>

      <div className="flex-1 min-h-0" style={{ paddingBottom: "var(--bottom-nav-height)" }}>
        <Outlet />
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bottom-nav" data-testid="bottom-nav" style={{ background: navBg, borderTop: `1px solid ${navBorder}`, height: "var(--bottom-nav-height)" }}>
        <div className="max-w-lg mx-auto h-full flex items-start justify-around px-1" style={{ paddingTop: "6px", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 14px)" }}>
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.basePath + "/") ||
              (item.altPaths || []).some(p => location.pathname === p) ||
              (currentOrientation && location.pathname === `/app-${currentOrientation}` && item.basePath === "/discover");
            const manyTabs = navItems.length > 5;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-0.5 px-1.5 py-1.5 rounded-xl transition-all duration-200 flex-1 min-w-0"
                style={{ color: isActive ? activeColor : inactiveColor }}
              >
                <item.icon className={`${manyTabs ? "w-4 h-4" : "w-5 h-5"} ${isActive ? "stroke-[2.5]" : ""}`} />
                <span className={`${manyTabs ? "text-[9px]" : "text-[10px]"} font-body font-medium truncate w-full text-center leading-none`}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
