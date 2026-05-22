import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { useLocation, useNavigate, matchPath } from "react-router-dom";
import { Copy, ExternalLink, GripVertical, RefreshCw, Search, Star, X } from "lucide-react";
import { DEV_ROUTES, DEV_ROUTE_GROUP_ORDER, type DevRouteDef, type DevRouteGroupKey } from "@/constants/devRoutes";
import { useTier } from "@/hooks/useTier";
import DevPill from "@/components/dev/DevPill";
import { shouldEnableDevTools, shouldUseInlineDevPill } from "@/components/dev/devToolsVisibility";

const FAV_KEY = "tether_dev_route_favorites";
const FAV_GROUP_ORDER_KEY = "tether_dev_route_favorite_group_order";
const FAV_ROUTE_ORDER_KEY = "tether_dev_route_favorite_route_order";
const RECENT_KEY = "tether_dev_route_recent";
const MAX_RECENT = 12;
type TabKey = "all" | "favorites" | "recent";
type ResolvedDevRoute = DevRouteDef & { resolvedPath: string };
type FavoriteRouteOrderMap = Partial<Record<DevRouteGroupKey, string[]>>;
type ColorSet = {
  launcherBg: string;
  launcherText: string;
  launcherBorder: string;
  panelBg: string;
  panelText: string;
  panelBorder: string;
  chipBg: string;
};

const getStoredStringArray = (key: string) => {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
};

const getStoredGroupOrder = () => {
  const parsed = getStoredStringArray(FAV_GROUP_ORDER_KEY);
  return parsed.filter((item): item is DevRouteGroupKey => DEV_ROUTE_GROUP_ORDER.includes(item as DevRouteGroupKey));
};

const getStoredRouteOrderMap = (): FavoriteRouteOrderMap => {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(FAV_ROUTE_ORDER_KEY) || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).flatMap(([group, value]) => {
        if (!DEV_ROUTE_GROUP_ORDER.includes(group as DevRouteGroupKey)) return [];
        if (!Array.isArray(value)) return [];
        const orderedPaths = value.filter((item): item is string => typeof item === "string");
        return [[group, orderedPaths]];
      }),
    ) as FavoriteRouteOrderMap;
  } catch {
    return {};
  }
};

const normalizePath = (path: string) => (path.startsWith("/") ? path : `/${path}`);

const substituteParams = (route: DevRouteDef, valueMap: Record<string, string>) => {
  if (!route.dynamic || !route.paramName) return route.path;
  const raw = valueMap[route.path] || route.defaultValue || "id_001";
  return route.path.replace(`:${route.paramName}`, raw.trim() || (route.defaultValue || "id_001"));
};

const mergePreferredOrder = <T extends string>(available: T[], preferred: T[]) => {
  const includedPreferred = preferred.filter((value): value is T => available.includes(value as T));
  const missing = available.filter((value) => !includedPreferred.includes(value));
  return [...includedPreferred, ...missing];
};

const mergeVisibleOrder = <T extends string>(fullOrder: T[], visibleOrder: T[]) => {
  const visibleSet = new Set(visibleOrder);
  let visibleIndex = 0;
  return fullOrder.map((value) => {
    if (!visibleSet.has(value)) return value;
    const nextValue = visibleOrder[visibleIndex];
    visibleIndex += 1;
    return nextValue ?? value;
  });
};

type FavoriteRouteCardProps = {
  route: ResolvedDevRoute;
  isCurrent: boolean;
  isFavorite: boolean;
  paramValue: string;
  colorSet: ColorSet;
  onOpenRoute: (route: ResolvedDevRoute) => void;
  onToggleFavorite: (path: string) => void;
  onCopyRoute: (routePath: string) => Promise<void>;
  onSetParamValue: (path: string, value: string) => void;
};

type FavoriteGroupSectionProps = {
  group: DevRouteGroupKey;
  routes: ResolvedDevRoute[];
  locationPathname: string;
  paramValues: Record<string, string>;
  favorites: string[];
  colorSet: ColorSet;
  onReorderRoutes: (group: DevRouteGroupKey, nextVisiblePaths: string[]) => void;
  onOpenRoute: (route: ResolvedDevRoute) => void;
  onToggleFavorite: (path: string) => void;
  onCopyRoute: (routePath: string) => Promise<void>;
  onSetParamValue: (path: string, value: string) => void;
};

function FavoriteRouteCard({
  route,
  isCurrent,
  isFavorite,
  paramValue,
  colorSet,
  onOpenRoute,
  onToggleFavorite,
  onCopyRoute,
  onSetParamValue,
}: FavoriteRouteCardProps) {
  const dragControls = useDragControls();
  const draggingRef = useRef(false);

  const openIfNotDragging = () => {
    if (draggingRef.current) return;
    onOpenRoute(route);
  };

  const handleDragStart = () => {
    draggingRef.current = true;
  };

  const handleDragEnd = () => {
    window.setTimeout(() => {
      draggingRef.current = false;
    }, 0);
  };

  const handleTitleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openIfNotDragging();
  };

  return (
    <Reorder.Item
      value={route.path}
      dragListener={false}
      dragControls={dragControls}
      className="rounded-2xl"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ listStyle: "none" }}
    >
      <div
        className="rounded-2xl border p-2 transition"
        style={{
          borderColor: isCurrent ? "#37423a" : colorSet.panelBorder,
          background: isCurrent ? "#e5ece2" : "#f4f0ec",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            role="button"
            tabIndex={0}
            onPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => dragControls.start(event)}
            onClick={openIfNotDragging}
            onKeyDown={handleTitleKeyDown}
            className="min-w-0 flex-1 text-left"
          >
            <div className="truncate text-sm font-medium">{route.path}</div>
            <div className="truncate text-[11px] opacity-75">{route.resolvedPath}</div>
          </div>
          <button
            type="button"
            onClick={() => onToggleFavorite(route.path)}
            className={`rounded-lg p-1.5 transition ${isFavorite ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
            aria-label="Toggle Favorite"
          >
            <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
          <button
            type="button"
            onClick={() => void onCopyRoute(route.resolvedPath)}
            className="rounded-lg p-1.5 opacity-75 transition hover:opacity-100"
            aria-label="Copy Route"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => window.open(normalizePath(route.resolvedPath), "_blank", "noopener,noreferrer")}
            className="rounded-lg p-1.5 opacity-75 transition hover:opacity-100"
            aria-label="Open in New Tab"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>

        {route.dynamic && route.paramName ? (
          <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
            <input
              value={paramValue}
              onChange={(event) => onSetParamValue(route.path, event.target.value)}
              placeholder={route.defaultValue || `${route.paramName}_001`}
              className="rounded-lg border px-2 py-1.5 text-xs outline-none"
              style={{ borderColor: colorSet.panelBorder, background: colorSet.chipBg, color: colorSet.panelText }}
            />
            <button
              type="button"
              onClick={() => onOpenRoute(route)}
              className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition hover:opacity-95"
              style={{ borderColor: colorSet.panelBorder, background: colorSet.launcherBg, color: colorSet.launcherText }}
            >
              Launch
            </button>
          </div>
        ) : null}
      </div>
    </Reorder.Item>
  );
}

function FavoriteGroupSection({
  group,
  routes,
  locationPathname,
  paramValues,
  favorites,
  colorSet,
  onReorderRoutes,
  onOpenRoute,
  onToggleFavorite,
  onCopyRoute,
  onSetParamValue,
}: FavoriteGroupSectionProps) {
  const groupDragControls = useDragControls();

  return (
    <Reorder.Item
      value={group}
      dragListener={false}
      dragControls={groupDragControls}
      className="rounded-2xl"
      style={{ listStyle: "none" }}
    >
      <section className="mb-4">
        <div className="mb-2 flex items-start justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] opacity-80">
          <span>{group}</span>
          <button
            type="button"
            onPointerDown={(event) => groupDragControls.start(event)}
            className="rounded-lg p-0.5 opacity-70 transition hover:opacity-100"
            aria-label={`Reorder ${group} favorites section`}
          >
            <GripVertical className="h-3.5 w-3.5" />
          </button>
        </div>
        <Reorder.Group
          axis="y"
          values={routes.map((route) => route.path)}
          onReorder={(nextVisiblePaths) => onReorderRoutes(group, nextVisiblePaths)}
          className="space-y-2"
        >
          {routes.map((route) => {
            const isCurrent = Boolean(matchPath(route.path, locationPathname));
            const paramValue = paramValues[route.path] || route.defaultValue || "";
            return (
              <FavoriteRouteCard
                key={route.path}
                route={route}
                isCurrent={isCurrent}
                isFavorite={favorites.includes(route.path)}
                paramValue={paramValue}
                colorSet={colorSet}
                onOpenRoute={onOpenRoute}
                onToggleFavorite={onToggleFavorite}
                onCopyRoute={onCopyRoute}
                onSetParamValue={onSetParamValue}
              />
            );
          })}
        </Reorder.Group>
      </section>
    </Reorder.Item>
  );
}

type DevRouteSwitcherProps = {
  hideLauncher?: boolean;
};

export default function DevRouteSwitcher({ hideLauncher = false }: DevRouteSwitcherProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { tier } = useTier();
  const devToolsEnabled = shouldEnableDevTools(location.pathname);
  const usesInlineDevPill = shouldUseInlineDevPill(location.pathname);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [favorites, setFavorites] = useState<string[]>(() => getStoredStringArray(FAV_KEY));
  const [favoriteGroupOrder, setFavoriteGroupOrder] = useState<DevRouteGroupKey[]>(() => getStoredGroupOrder());
  const [favoriteRouteOrderByGroup, setFavoriteRouteOrderByGroup] = useState<FavoriteRouteOrderMap>(() => getStoredRouteOrderMap());
  const [recent, setRecent] = useState<string[]>(() => getStoredStringArray(RECENT_KEY));
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== "undefined" && window.innerWidth < 768);

  useEffect(() => {
    if (!devToolsEnabled) return;
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [devToolsEnabled]);

  useEffect(() => {
    if (!devToolsEnabled) return;
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [devToolsEnabled]);

  useEffect(() => {
    if (!devToolsEnabled) return;
    const handleToggle = () => setOpen((prev) => !prev);
    window.addEventListener("tether-dev-toggle", handleToggle);
    return () => window.removeEventListener("tether-dev-toggle", handleToggle);
  }, [devToolsEnabled]);

  const routesWithResolved = useMemo<ResolvedDevRoute[]>(
    () =>
      DEV_ROUTES.map((route) => ({
        ...route,
        resolvedPath: substituteParams(route, paramValues),
      })),
    [paramValues],
  );

  const favoriteRoutesByGroup = useMemo(() => {
    const map = new Map<DevRouteGroupKey, ResolvedDevRoute[]>();
    DEV_ROUTE_GROUP_ORDER.forEach((group) => map.set(group, []));
    routesWithResolved
      .filter((route) => favorites.includes(route.path))
      .forEach((route) => {
        const existing = map.get(route.group) || [];
        map.set(route.group, [...existing, route]);
      });
    return map;
  }, [favorites, routesWithResolved]);

  const orderedFavoriteGroupOrder = useMemo(() => {
    const availableGroups = DEV_ROUTE_GROUP_ORDER.filter((group) => (favoriteRoutesByGroup.get(group) || []).length > 0);
    return mergePreferredOrder(availableGroups, favoriteGroupOrder);
  }, [favoriteGroupOrder, favoriteRoutesByGroup]);

  const orderedFavoriteRouteOrderByGroup = useMemo(() => {
    const nextMap: FavoriteRouteOrderMap = {};
    orderedFavoriteGroupOrder.forEach((group) => {
      const availablePaths = (favoriteRoutesByGroup.get(group) || []).map((route) => route.path);
      nextMap[group] = mergePreferredOrder(availablePaths, favoriteRouteOrderByGroup[group] || []);
    });
    return nextMap;
  }, [favoriteRouteOrderByGroup, favoriteRoutesByGroup, orderedFavoriteGroupOrder]);

  useEffect(() => {
    if (!devToolsEnabled) return;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
      window.localStorage.setItem(FAV_GROUP_ORDER_KEY, JSON.stringify(orderedFavoriteGroupOrder));
      window.localStorage.setItem(FAV_ROUTE_ORDER_KEY, JSON.stringify(orderedFavoriteRouteOrderByGroup));
    }
  }, [devToolsEnabled, favorites, orderedFavoriteGroupOrder, orderedFavoriteRouteOrderByGroup]);

  useEffect(() => {
    if (!devToolsEnabled) return;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    }
  }, [devToolsEnabled, recent]);

  const filteredRoutes = useMemo(() => {
    const q = query.trim().toLowerCase();
    let routes = routesWithResolved;
    if (activeTab === "favorites") routes = routes.filter((route) => favorites.includes(route.path));
    if (activeTab === "recent") routes = routes.filter((route) => recent.includes(route.path));
    if (!q) return routes;
    return routes.filter((route) => {
      const groupHit = route.group.toLowerCase().includes(q);
      const pathHit = route.path.toLowerCase().includes(q) || route.resolvedPath.toLowerCase().includes(q);
      return groupHit || pathHit;
    });
  }, [routesWithResolved, activeTab, favorites, query, recent]);

  const groupedRoutes = useMemo(() => {
    const map = new Map<DevRouteGroupKey, ResolvedDevRoute[]>();
    DEV_ROUTE_GROUP_ORDER.forEach((group) => map.set(group, []));
    filteredRoutes.forEach((route) => {
      const existing = map.get(route.group) || [];
      map.set(route.group, [...existing, route]);
    });
    return map;
  }, [filteredRoutes]);

  const favoriteVisibleGroupedRoutes = useMemo(() => {
    const visibleFavoriteRoutes = filteredRoutes.filter((route) => favorites.includes(route.path));
    const routeByPath = new Map(visibleFavoriteRoutes.map((route) => [route.path, route]));
    const map = new Map<DevRouteGroupKey, ResolvedDevRoute[]>();
    orderedFavoriteGroupOrder.forEach((group) => {
      const orderedPaths = orderedFavoriteRouteOrderByGroup[group] || [];
      const visibleRoutes = orderedPaths
        .map((path) => routeByPath.get(path))
        .filter((route): route is ResolvedDevRoute => Boolean(route));
      map.set(group, visibleRoutes);
    });
    return map;
  }, [favorites, filteredRoutes, orderedFavoriteGroupOrder, orderedFavoriteRouteOrderByGroup]);

  const visibleFavoriteGroups = useMemo(
    () => orderedFavoriteGroupOrder.filter((group) => (favoriteVisibleGroupedRoutes.get(group) || []).length > 0),
    [favoriteVisibleGroupedRoutes, orderedFavoriteGroupOrder],
  );

  const markRecent = (path: string) => {
    setRecent((prev) => [path, ...prev.filter((item) => item !== path)].slice(0, MAX_RECENT));
  };

  const openRoute = (route: DevRouteDef & { resolvedPath: string }) => {
    navigate(normalizePath(route.resolvedPath));
    markRecent(route.path);
    if (isMobile) setOpen(false);
  };

  const copyRoute = async (routePath: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(normalizePath(routePath));
    }
  };

  const toggleFavorite = (path: string) => {
    setFavorites((prev) => (prev.includes(path) ? prev.filter((item) => item !== path) : [path, ...prev]));
  };

  const setParamValue = (path: string, value: string) => {
    setParamValues((prev) => ({
      ...prev,
      [path]: value,
    }));
  };

  const reorderFavoriteGroups = (nextVisibleGroups: DevRouteGroupKey[]) => {
    setFavoriteGroupOrder((prev) => {
      const fullOrder = mergePreferredOrder(
        DEV_ROUTE_GROUP_ORDER.filter((group) => (favoriteRoutesByGroup.get(group) || []).length > 0),
        prev,
      );
      return mergeVisibleOrder(fullOrder, nextVisibleGroups);
    });
  };

  const reorderFavoriteRoutes = (group: DevRouteGroupKey, nextVisiblePaths: string[]) => {
    setFavoriteRouteOrderByGroup((prev) => {
      const fullOrder = orderedFavoriteRouteOrderByGroup[group] || [];
      return {
        ...prev,
        [group]: mergeVisibleOrder(fullOrder, nextVisiblePaths),
      };
    });
  };

  const frameRightInset = "clamp(10px, 3vw, 16px)";
  const launcherStyle = { top: "calc(env(safe-area-inset-top, 0px) + 8px)", right: frameRightInset, bottom: "auto", left: "auto" };
  const panelClass = "h-[70vh] w-[min(88vw,360px)]";
  const panelStyle = { top: "calc(var(--membership-banner-height, 48px) + env(safe-area-inset-top, 0px) + 8px)", right: frameRightInset };

  const colorSet =
    tier === "concierge"
      ? {
          launcherBg: "rgba(10,13,10,0.58)",
          launcherText: "rgba(216,198,174,0.96)",
          launcherBorder: "rgba(216,198,174,0.45)",
          panelBg: "rgba(248,243,241,0.82)",
          panelText: "#37423a",
          panelBorder: "rgba(55,66,58,0.18)",
          chipBg: "#eef1eb",
        }
      : tier === "premium"
        ? {
            launcherBg: "rgba(35,38,35,0.58)",
            launcherText: "rgba(248,243,241,0.96)",
            launcherBorder: "rgba(248,243,241,0.32)",
            panelBg: "rgba(248,243,241,0.82)",
            panelText: "#37423a",
            panelBorder: "rgba(55,66,58,0.18)",
            chipBg: "#eef1eb",
          }
        : {
            launcherBg: "rgba(55,66,58,0.58)",
            launcherText: "rgba(248,243,241,0.96)",
            launcherBorder: "rgba(248,243,241,0.35)",
            panelBg: "rgba(248,243,241,0.82)",
            panelText: "#37423a",
            panelBorder: "rgba(55,66,58,0.25)",
            chipBg: "#eef1eb",
          };

  if (!devToolsEnabled) return null;

  return (
    <>
      {!hideLauncher && !usesInlineDevPill ? (
        <DevPill
          tier={tier}
          className="fixed z-[2000]"
          onClick={() => setOpen((prev) => !prev)}
          style={launcherStyle}
        />
      ) : null}

      <div className={`fixed z-[1999] transition-all duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} ${panelClass}`} style={panelStyle}>
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-[18px]" style={{ background: colorSet.panelBg, color: colorSet.panelText, borderColor: colorSet.panelBorder }}>
          <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: colorSet.panelBorder }}>
            <div className="text-sm font-semibold tracking-wide">Developer Route Switcher</div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-xl border p-2 transition"
                style={{ borderColor: colorSet.panelBorder, background: colorSet.chipBg, color: colorSet.panelText }}
                aria-label="Reload Page"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border p-2 transition"
                style={{ borderColor: colorSet.panelBorder, background: colorSet.chipBg, color: colorSet.panelText }}
                aria-label="Close Panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="border-b px-4 py-3" style={{ borderColor: colorSet.panelBorder }}>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-70" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search route, path, or group"
                className="w-full rounded-xl border py-2 pl-9 pr-3 text-sm outline-none transition"
                style={{ borderColor: colorSet.panelBorder, background: colorSet.chipBg, color: colorSet.panelText }}
              />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { key: "all", label: "All" },
                { key: "favorites", label: "Favorites" },
                { key: "recent", label: "Recent" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as TabKey)}
                  className={`rounded-lg border px-2 py-1.5 text-xs transition ${activeTab === tab.key ? "font-semibold" : ""}`}
                  style={{
                    borderColor: colorSet.panelBorder,
                    background: activeTab === tab.key ? "#dfe7db" : colorSet.chipBg,
                    color: colorSet.panelText,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            {activeTab === "favorites" ? (
              <Reorder.Group
                axis="y"
                values={visibleFavoriteGroups}
                onReorder={reorderFavoriteGroups}
                className="space-y-4"
              >
                {visibleFavoriteGroups.map((group) => {
                  const routes = favoriteVisibleGroupedRoutes.get(group) || [];
                  if (!routes.length) return null;
                  return (
                    <FavoriteGroupSection
                      key={group}
                      group={group}
                      routes={routes}
                      locationPathname={location.pathname}
                      paramValues={paramValues}
                      favorites={favorites}
                      colorSet={colorSet}
                      onReorderRoutes={reorderFavoriteRoutes}
                      onOpenRoute={openRoute}
                      onToggleFavorite={toggleFavorite}
                      onCopyRoute={copyRoute}
                      onSetParamValue={setParamValue}
                    />
                  );
                })}
              </Reorder.Group>
            ) : (
              DEV_ROUTE_GROUP_ORDER.map((group) => {
                const routes = groupedRoutes.get(group) || [];
                if (!routes.length) return null;
                return (
                  <section key={group} className="mb-4">
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] opacity-80">
                      {group}
                    </div>
                    <div className="space-y-2">
                      {routes.map((route) => {
                        const isCurrent = Boolean(matchPath(route.path, location.pathname));
                        const paramValue = paramValues[route.path] || route.defaultValue || "";
                        return (
                          <div
                            key={route.path}
                            className="rounded-2xl border p-2 transition"
                            style={{
                              borderColor: isCurrent ? "#37423a" : colorSet.panelBorder,
                              background: isCurrent ? "#e5ece2" : "#f4f0ec",
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => openRoute(route)}
                                className="min-w-0 flex-1 text-left"
                              >
                                <div className="truncate text-sm font-medium">{route.path}</div>
                                <div className="truncate text-[11px] opacity-75">{route.resolvedPath}</div>
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleFavorite(route.path)}
                                className={`rounded-lg p-1.5 transition ${favorites.includes(route.path) ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
                                aria-label="Toggle Favorite"
                              >
                                <Star className={`h-4 w-4 ${favorites.includes(route.path) ? "fill-current" : ""}`} />
                              </button>
                              <button
                                type="button"
                                onClick={() => void copyRoute(route.resolvedPath)}
                                className="rounded-lg p-1.5 opacity-75 transition hover:opacity-100"
                                aria-label="Copy Route"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => window.open(normalizePath(route.resolvedPath), "_blank", "noopener,noreferrer")}
                                className="rounded-lg p-1.5 opacity-75 transition hover:opacity-100"
                                aria-label="Open in New Tab"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </button>
                            </div>

                            {route.dynamic && route.paramName ? (
                              <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
                                <input
                                  value={paramValue}
                                  onChange={(event) => setParamValue(route.path, event.target.value)}
                                  placeholder={route.defaultValue || `${route.paramName}_001`}
                                  className="rounded-lg border px-2 py-1.5 text-xs outline-none"
                                  style={{ borderColor: colorSet.panelBorder, background: colorSet.chipBg, color: colorSet.panelText }}
                                />
                                <button
                                  type="button"
                                  onClick={() => openRoute(route)}
                                  className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition hover:opacity-95"
                                  style={{ borderColor: colorSet.panelBorder, background: colorSet.launcherBg, color: colorSet.launcherText }}
                                >
                                  Launch
                                </button>
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
