import { useEffect } from "react";

/**
 * Thin wrapper that sets the orientation in localStorage before rendering
 * any existing page. All demo pages already read tether_orientation to pick
 * the right profile pool — so no page logic needs to change.
 */
export default function OrientationWrapper({ orientation, children }) {
  useEffect(() => {
    localStorage.setItem("tether_orientation", orientation);
  }, [orientation]);

  return children;
}