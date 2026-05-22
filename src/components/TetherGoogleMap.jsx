import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { APIProvider, AdvancedMarker, Map as GoogleMap, useMap } from "@vis.gl/react-google-maps";
import { MapPin, ShieldCheck, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCurrentDemoMatches } from "@/hooks/useCurrentDemoMatches";
import { useTier } from "@/hooks/useTier";
import { getDemoUserProfile } from "@/data/demo/demoUserProfiles";
import { GOOGLE_MAPS_API_KEY, getGoogleMapIdForTier } from "@/config/googleMaps";
import { getLocalStyleForTier } from "@/config/googleMapThemeStyles";
import { getAreaForMatch, getMatchMapPosition, getUserMapPosition, LONDON_BOUNDS, LONDON_CENTER } from "@/data/demo/londonMapAreas";
import { getBoundsForRadius, milesToMeters, splitMatchesByRadius } from "@/data/demo/mapRadiusUtils";
import { getCompatibilityTone } from "@/lib/compatibilityTone";

function routeForMatch(pathname, matchId) {
  if (pathname.includes("-gay")) return `/match-gay/${matchId}`;
  if (pathname.includes("-straight")) return `/match-straight/${matchId}`;
  if (pathname.includes("-queer")) return `/match-queer/${matchId}`;
  if (pathname.includes("-pansexual")) return `/match-pansexual/${matchId}`;
  if (pathname.includes("-fluid")) return `/match-fluid/${matchId}`;
  if (pathname.includes("-open-preference")) return `/match-open-preference/${matchId}`;
  if (pathname.includes("-bisexual")) return `/match-bisexual/${matchId}`;
  if (pathname.includes("-lesbian")) return `/match-lesbian/${matchId}`;
  if (pathname.includes("-trans-nonbinary")) return `/match-trans-nonbinary/${matchId}`;
  return `/match/${matchId}`;
}

function getMatchScore(match) {
  const value = Number(
    match?.compatibilityScore
      ?? match?.score
      ?? match?.updatedScore
      ?? match?.initialScore
      ?? 0,
  );
  if (Number.isFinite(value)) return Math.max(0, Math.min(100, Math.round(value)));
  return 0;
}

function getMatchName(match) {
  return match?.displayName || match?.display_name || match?.name || "Potential match";
}

function getMatchPhoto(match) {
  return match?.photoPath || match?.image || "/placeholder.svg";
}

function getMatchAge(match) {
  const value = Number(match?.age);
  return Number.isFinite(value) ? value : null;
}

function sortEntries(entries, sortBy) {
  if (sortBy === "distance") return [...entries].sort((a, b) => a.distanceMiles - b.distanceMiles);
  if (sortBy === "newest") return [...entries].sort((a, b) => String(b.match.id).localeCompare(String(a.match.id)));
  return [...entries].sort((a, b) => b.match.compatibilityScore - a.match.compatibilityScore);
}

function buildAreaClusters(entries) {
  const clusters = new Map();
  for (const entry of entries) {
    const area = getAreaForMatch(entry.match, entry.index);
    const key = area?.id || "london";
    if (!clusters.has(key)) clusters.set(key, { key, area, entries: [] });
    clusters.get(key).entries.push(entry);
  }
  return [...clusters.values()];
}

function expandedPosition(entry, siblingIndex, siblingCount) {
  if (siblingCount <= 1) return entry.position;
  const step = (Math.PI * 2) / siblingCount;
  const angle = siblingIndex * step;
  const latOffset = Math.sin(angle) * 0.0032;
  const lngOffset = Math.cos(angle) * 0.0046;
  return { lat: entry.position.lat + latOffset, lng: entry.position.lng + lngOffset };
}

function getZoomTier(zoom) {
  if (zoom >= 12.2) return "micro";
  if (zoom >= 10.4) return "mid";
  return "macro";
}

function getTargetZoom(radiusMiles, distanceScope = "local") {
  if (distanceScope === "global") return 2.6;
  if (distanceScope === "nationwide") return 5.6;
  if (radiusMiles <= 1) return 14.4;
  if (radiusMiles <= 2.5) return 13.6;
  if (radiusMiles <= 5) return 12.6;
  if (radiusMiles <= 10) return 12.2;
  if (radiusMiles <= 15) return 11.4;
  if (radiusMiles <= 20) return 10.8;
  if (radiusMiles <= 25) return 10.6;
  return 9.4;
}

function radiusControlToken(value) {
  const radius = Number(value);
  if (radius === 2.5) return "25";
  if (radius === 7.5) return "75";
  return String(Number.isInteger(radius) ? radius : radius);
}

function TetherRadiusCircle({ center, radiusMiles, tier, showCircle = true }) {
  const map = useMap();
  const circleRef = useRef(null);

  useEffect(() => {
    if (!map || !window.google?.maps) return;
    if (circleRef.current) circleRef.current.setMap(null);
    if (!showCircle) return;
    const strokeColor = tier === "concierge" ? "rgba(0,0,0,0.62)" : tier === "premium" ? "rgba(0,0,0,0.54)" : "rgba(55,66,58,0.58)";
    const fillColor = tier === "concierge" ? "rgba(0,0,0,0.22)" : tier === "premium" ? "rgba(0,0,0,0.18)" : "rgba(55,66,58,0.28)";
    const drawMiles = Math.max(1, Number(radiusMiles) || 1);
    circleRef.current = new window.google.maps.Circle({
      map,
      center,
      radius: milesToMeters(drawMiles),
      strokeColor,
      strokeOpacity: 1,
      strokeWeight: 2.8,
      fillColor,
      fillOpacity: 1,
      clickable: false,
      zIndex: 1,
    });
    return () => {
      if (circleRef.current) {
        circleRef.current.setMap(null);
        circleRef.current = null;
      }
    };
  }, [map, center, radiusMiles, tier, showCircle]);

  return showCircle ? <span data-testid="map-radius-circle" style={{ display: "none" }} /> : null;
}

function MapViewportController({
  center,
  radiusMiles,
  reframeTick,
  distanceScope = "local",
  markerPositions = [],
  onViewportFitted,
}) {
  const map = useMap();
  useEffect(() => {
    if (!map || !window.google?.maps) return;
    const now = Date.now();
    if (distanceScope === "global") {
      map.setCenter({ lat: 20, lng: 0 });
      const targetZoom = getTargetZoom(radiusMiles, distanceScope);
      map.setZoom(targetZoom);
      onViewportFitted?.({ radiusMiles, timestamp: now, zoomTier: getZoomTier(targetZoom), zoom: targetZoom });
      return;
    }
    if (distanceScope === "nationwide") {
      map.setCenter({ lat: 54.5, lng: -2.5 });
      const targetZoom = getTargetZoom(radiusMiles, distanceScope);
      map.setZoom(targetZoom);
      onViewportFitted?.({ radiusMiles, timestamp: now, zoomTier: getZoomTier(targetZoom), zoom: targetZoom });
      return;
    }
    const radiusBounds = getBoundsForRadius(center, radiusMiles);
    const bounds = new window.google.maps.LatLngBounds(
      { lat: radiusBounds?.south ?? center.lat, lng: radiusBounds?.west ?? center.lng },
      { lat: radiusBounds?.north ?? center.lat, lng: radiusBounds?.east ?? center.lng },
    );
    markerPositions.forEach((pos) => {
      if (pos?.lat != null && pos?.lng != null) bounds.extend(pos);
    });
    map.fitBounds(bounds, { top: 40, right: 34, bottom: 40, left: 34 });
    const targetZoom = getTargetZoom(radiusMiles, distanceScope);
    const currentZoom = map.getZoom?.() ?? targetZoom;
    if (currentZoom > targetZoom) map.setZoom(targetZoom);
    const finalZoom = Math.min(currentZoom, targetZoom);
    onViewportFitted?.({ radiusMiles, timestamp: now, zoomTier: getZoomTier(finalZoom), zoom: finalZoom });
  }, [map, center, radiusMiles, reframeTick, distanceScope, markerPositions, onViewportFitted]);
  return null;
}

export default function TetherGoogleMap({
  radiusMiles = 25,
  sortBy = "compatibility",
  onVisibleCountChange,
  onOutOfRadiusCountChange,
  radiusOptions = [10, 25, 50],
  distanceScope = "local",
  onRequestExpandDistance,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { tier: activeTier } = useTier();
  const { context, matches } = useCurrentDemoMatches("map");
  const tier = activeTier || context?.membershipTier || "standard";
  const mapId = getGoogleMapIdForTier(tier);
  const useLocalStyledMap = (tier === "premium" || tier === "concierge") && !mapId;
  const renderedMapId = mapId || undefined;
  const hasMapConfig = Boolean(GOOGLE_MAPS_API_KEY && (mapId || useLocalStyledMap));
  const localMapStyles = useMemo(
    () => (useLocalStyledMap ? getLocalStyleForTier(tier) : null),
    [tier, useLocalStyledMap],
  );
  const demoUser = getDemoUserProfile(context);
  const isElevatedTier = tier === "premium" || tier === "concierge";

  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [radiusWarning, setRadiusWarning] = useState(null);
  const [zoom, setZoom] = useState(11.2);
  const [center, setCenter] = useState(LONDON_CENTER);
  const [reframeTick, setReframeTick] = useState(0);
  const [expandedAreaId, setExpandedAreaId] = useState(null);
  const [lastFitMeta, setLastFitMeta] = useState(null);
  const mapShellRef = useRef(null);
  const prevRadius = useRef(radiusMiles);
  const handleViewportFitted = useCallback((payload) => {
    setLastFitMeta(payload);
  }, []);

  const effectiveRadiusMiles = useMemo(() => {
    if (tier === "concierge") {
      if (distanceScope === "global") return 3000;
      if (distanceScope === "nationwide") return 120;
    }
    return radiusMiles;
  }, [tier, distanceScope, radiusMiles]);

  const localScope = distanceScope === "local";
  const showRadiusCircle = tier === "standard" || localScope;

  const userPosition = useMemo(() => getUserMapPosition(context, demoUser), [context, demoUser]);
  const distanceScale = useMemo(() => 1, []);
  const withPositions = useMemo(
    () => (matches || []).map((match, index) => ({ match, index, position: getMatchMapPosition(match, index, context) })),
    [matches, context],
  );

  const split = useMemo(
    () => splitMatchesByRadius(withPositions, userPosition, effectiveRadiusMiles, distanceScale),
    [withPositions, userPosition, effectiveRadiusMiles, distanceScale],
  );
  const inRadius = useMemo(() => sortEntries(split.inRadius, sortBy), [split.inRadius, sortBy]);
  const inRadiusPositions = useMemo(() => inRadius.map((entry) => entry.position), [inRadius]);
  const outOfRadius = useMemo(() => sortEntries(split.outOfRadius, "distance"), [split.outOfRadius]);

  useEffect(() => {
    if (onVisibleCountChange) onVisibleCountChange(inRadius.length);
  }, [inRadius.length, onVisibleCountChange]);

  useEffect(() => {
    onOutOfRadiusCountChange?.(outOfRadius.length);
  }, [outOfRadius.length, onOutOfRadiusCountChange]);

  useEffect(() => {
    if (prevRadius.current !== effectiveRadiusMiles) {
      prevRadius.current = effectiveRadiusMiles;
      setSelectedMatchId(null);
      setRadiusWarning(null);
      setReframeTick((v) => v + 1);
    }
  }, [effectiveRadiusMiles]);

  useEffect(() => {
    if (!mapShellRef.current || !lastFitMeta) return;
    const card = mapShellRef.current.closest("[data-testid='tether-map-card']");
    if (!card) return;
    card.dataset.lastFitRadius = String(lastFitMeta.radiusMiles);
    card.dataset.lastFitTimestamp = String(lastFitMeta.timestamp);
    card.dataset.mapZoomTier = String(lastFitMeta.zoomTier || "");
  }, [lastFitMeta]);

  const areaClusters = useMemo(() => buildAreaClusters(inRadius), [inRadius]);
  const preferIndividualMarkers = distanceScope === "local" && effectiveRadiusMiles <= 5;
  const showClusters = !preferIndividualMarkers && zoom < 12.8;
  const zoomTier = getZoomTier(zoom);

  const selectedMatch = useMemo(
    () => inRadius.find((entry) => entry.match.id === selectedMatchId)?.match || null,
    [selectedMatchId, inRadius],
  );

  const selectedMatchView = useMemo(() => {
    if (!selectedMatch) return null;
    const score = getMatchScore(selectedMatch);
    const name = getMatchName(selectedMatch);
    const age = getMatchAge(selectedMatch);
    return {
      id: selectedMatch.id,
      score,
      name,
      ageText: age ? `${name}, ${age}` : name,
      photo: getMatchPhoto(selectedMatch),
      location: selectedMatch.distanceLabel || selectedMatch.location || "London",
      reason: selectedMatch.compatibilityBreakdown?.overallRead || selectedMatch.shortBio || selectedMatch.oneLineVibe || "Potential match nearby",
    };
  }, [selectedMatch]);

  const expandRadiusForWarning = () => {
    if (!radiusWarning?.distanceMiles) return;
    if (onRequestExpandDistance) onRequestExpandDistance(radiusWarning.distanceMiles);
    const sorted = [...radiusOptions].sort((a, b) => a - b);
    const nextRadius = sorted.find((opt) => opt >= radiusWarning.distanceMiles) || sorted[sorted.length - 1];
    if (nextRadius > radiusMiles) {
      const token = radiusControlToken(nextRadius);
      const button = document.querySelector(`[data-testid="map-radius-control-${token}"]`);
      if (button) button.click();
    }
    setRadiusWarning(null);
  };

  if (!hasMapConfig) {
    if (import.meta.env.DEV) {
      console.warn("[Map] Missing Google Maps config", {
        tier,
        hasApiKey: Boolean(GOOGLE_MAPS_API_KEY),
        mapId,
        renderedMapId,
        useLocalStyledMap,
      });
    }
    return (
      <div
        className={`h-full w-full rounded-[32px] border border-border bg-card p-5 flex flex-col justify-center tether-map-fallback tether-map-fallback--${tier}`}
        data-testid="map-fallback"
        data-map-id={mapId}
        data-map-tier={tier}
      >
        <h3 className="font-heading font-bold text-lg">London map preview</h3>
        <p className="text-sm font-body text-muted-foreground mt-1">The live map is temporarily unavailable right now. Please try again shortly.</p>
      </div>
    );
  }

  const activeRadiusToken = Number.isInteger(effectiveRadiusMiles) ? String(effectiveRadiusMiles) : effectiveRadiusMiles.toFixed(1);

  return (
    <div
      ref={mapShellRef}
      className={`tether-google-map-shell map-zoom--${zoomTier}`}
      data-map-id={mapId}
      data-map-tier={tier}
      data-map-render-mode={useLocalStyledMap ? "local-style" : "cloud-map-id"}
      data-active-radius={activeRadiusToken}
      data-visible-match-count={String(inRadius.length)}
      data-out-radius-count={String(outOfRadius.length)}
      data-last-fit-radius={lastFitMeta?.radiusMiles != null ? String(lastFitMeta.radiusMiles) : ""}
      data-last-fit-timestamp={lastFitMeta?.timestamp != null ? String(lastFitMeta.timestamp) : ""}
      data-map-zoom-tier={lastFitMeta?.zoomTier || zoomTier}
    >
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <div
          className="tether-google-map-host"
          data-testid="tether-google-map"
          data-map-id={mapId}
          data-map-tier={tier}
          data-map-render-mode={useLocalStyledMap ? "local-style" : "cloud-map-id"}
        >
          <GoogleMap
            key={`tether-map-${tier}-${mapId}`}
            id={`tether-map-${tier}`}
            reuseMaps={false}
            className="tether-google-map"
            style={{ width: "100%", height: "100%" }}
            defaultCenter={LONDON_CENTER}
            defaultZoom={11.2}
            center={center}
            zoom={zoom}
            onCameraChanged={(ev) => {
              setZoom(ev.detail.zoom);
              setCenter(ev.detail.center);
            }}
            mapId={renderedMapId}
            styles={localMapStyles || undefined}
            minZoom={2}
            maxZoom={15}
            gestureHandling="greedy"
            disableDefaultUI
            clickableIcons={false}
            restriction={distanceScope === "local" ? { latLngBounds: LONDON_BOUNDS, strictBounds: false } : undefined}
            onClick={() => {
              setSelectedMatchId(null);
            }}
          >
            <MapViewportController
              center={userPosition}
              radiusMiles={effectiveRadiusMiles}
              reframeTick={reframeTick}
              distanceScope={distanceScope}
              markerPositions={inRadiusPositions}
              onViewportFitted={handleViewportFitted}
            />
          <TetherRadiusCircle center={userPosition} radiusMiles={effectiveRadiusMiles} tier={tier} showCircle={showRadiusCircle} />

          <AdvancedMarker position={userPosition} title="You are here" zIndex={2000}>
            <div className={`tether-user-map-marker tether-user-map-marker--${tier}`}>
              <MapPin className="w-3.5 h-3.5" />
              <span data-testid="you-are-here-marker">You are here</span>
            </div>
          </AdvancedMarker>

          {outOfRadius.slice(0, 20).map((entry) => (
            <AdvancedMarker
              key={`out-${entry.match.id}-${entry.index}`}
              position={entry.position}
              title={`${getMatchScore(entry.match)}% outside radius`}
              zIndex={40}
              onClick={(e) => {
                e?.domEvent?.stopPropagation?.();
                setSelectedMatchId(null);
                setRadiusWarning({ distanceMiles: entry.distanceMiles });
              }}
            >
              <button type="button" className="map-out-radius-marker" data-testid="map-out-radius-marker" aria-label={`${getMatchScore(entry.match)}% outside radius`}>
                {getMatchScore(entry.match)}%
              </button>
            </AdvancedMarker>
          ))}

          {showClusters
            ? areaClusters.map((cluster) => {
                if (cluster.entries.length === 1) {
                  const only = cluster.entries[0];
                  const score = getMatchScore(only.match);
                  const tone = getCompatibilityTone(score, tier, "dark");
                  const name = getMatchName(only.match);
                  return (
                    <AdvancedMarker
                      key={`${only.match.id}-${only.index}`}
                      position={only.position}
                      title={`${name}, ${score}% compatible`}
                      onClick={(e) => {
                        e?.domEvent?.stopPropagation?.();
                        setRadiusWarning(null);
                        setSelectedMatchId(only.match.id);
                      }}
                    >
                      <button type="button" className={`tether-match-marker tether-match-marker--${tier}`} aria-label={`${name} ${score}%`} data-testid="match-map-marker">
                        <div className="tether-match-marker__photoWrap">
                          <img src={getMatchPhoto(only.match)} alt={name} className="tether-match-marker__photo" />
                        </div>
                        <span className="tether-match-marker__score" style={{ color: tone.text }} data-testid="match-map-score-chip">
                          {score}%
                        </span>
                      </button>
                    </AdvancedMarker>
                  );
                }
                return (
                  <AdvancedMarker
                    key={`cluster-${cluster.key}`}
                    position={cluster.area?.position || cluster.entries[0].position}
                    title={`${cluster.entries.length} matches`}
                    onClick={(e) => {
                      e?.domEvent?.stopPropagation?.();
                      setExpandedAreaId(cluster.key);
                      setZoom(13.2);
                      setCenter(cluster.area?.position || cluster.entries[0].position);
                    }}
                  >
                    <button type="button" className={`tether-map-cluster tether-map-cluster--${tier}`} data-testid="map-cluster-marker" aria-label={`${cluster.entries.length} matches`}>
                      <span className="tether-map-cluster__count">{cluster.entries.length}</span>
                      <span className="tether-map-cluster__label">matches</span>
                    </button>
                  </AdvancedMarker>
                );
              })
            : areaClusters.flatMap((cluster) =>
                cluster.entries.map((entry, idx) => {
                  const score = getMatchScore(entry.match);
                  const tone = getCompatibilityTone(score, tier, "dark");
                  const name = getMatchName(entry.match);
                  const position = expandedPosition(entry, idx, cluster.entries.length);
                  return (
                    <AdvancedMarker
                      key={`${entry.match.id}-${entry.index}`}
                      position={position}
                      title={`${name}, ${score}% compatible`}
                      onClick={(e) => {
                        e?.domEvent?.stopPropagation?.();
                        setRadiusWarning(null);
                        setSelectedMatchId(entry.match.id);
                      }}
                    >
                      <button type="button" className={`tether-match-marker tether-match-marker--${tier} ${selectedMatchId === entry.match.id ? "is-selected" : ""}`} aria-label={`${name} ${score}%`} data-testid="match-map-marker">
                        <div className="tether-match-marker__photoWrap">
                          <img src={getMatchPhoto(entry.match)} alt={name} className="tether-match-marker__photo" />
                        </div>
                        <span className="tether-match-marker__score" style={{ color: tone.text }} data-testid="match-map-score-chip">
                          {score}%
                        </span>
                      </button>
                    </AdvancedMarker>
                  );
                }),
              )}
          </GoogleMap>
        </div>
      </APIProvider>

      {radiusWarning && (
        <div className={`map-radius-warning map-radius-warning--${tier}`} data-testid="map-radius-warning">
          <h3>Potential match outside your radius</h3>
          <p>Update your compatibility distance to view this profile.</p>
          <div className="map-radius-warning__actions">
            <button type="button" onClick={expandRadiusForWarning} data-testid="map-radius-warning-expand">Expand radius</button>
            <button type="button" onClick={() => setRadiusWarning(null)} data-testid="map-radius-warning-dismiss">Keep current radius</button>
          </div>
        </div>
      )}

      {selectedMatchView && (
        <div className={`tether-map-preview tether-map-preview--${tier} ${isElevatedTier ? "tether-map-preview--elevated" : ""}`} data-testid="map-match-preview">
          <button type="button" className="tether-map-preview__close" aria-label="Close preview" onClick={() => setSelectedMatchId(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="tether-map-preview__media">
            <img src={selectedMatchView.photo} alt={selectedMatchView.name} className="tether-map-preview__photo" />
            <div
              className="tether-map-preview__scoreRing"
              style={{ color: getCompatibilityTone(selectedMatchView.score, tier, tier === "standard" ? "light" : "dark").text }}
              data-testid="map-preview-score"
            >
              {selectedMatchView.score}%
            </div>
          </div>
          <div className="tether-map-preview__content">
            <div className="tether-map-preview__head">
              <p className="tether-map-preview__name">{selectedMatchView.ageText}</p>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="tether-map-preview__sub">{selectedMatchView.location}</p>
            <p className="tether-map-preview__reason">{selectedMatchView.reason}</p>
            <div className="tether-map-preview__actions tether-map-preview__actions--single">
              <button
                type="button"
                data-testid="map-preview-view-profile"
                onClick={() => navigate(`${routeForMatch(location.pathname, selectedMatchView.id)}?source=map&mode=potential`, { state: { fromMap: true } })}
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      )}
      <span data-testid={`map-zoom-tier-${zoomTier}`} style={{ display: "none" }} />
      <span data-testid={expandedAreaId ? "map-cluster-expanded" : "map-cluster-collapsed"} style={{ display: "none" }} />
      <span data-testid={`map-style-id-${mapId}`} style={{ display: "none" }} />
    </div>
  );
}
