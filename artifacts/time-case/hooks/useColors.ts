import { useMemo } from "react";
import colors from "@/constants/colors";
import { useSettings } from "@/context/SettingsContext";

/**
 * Returns a stable reference to the design tokens for the current theme.
 * The object only changes identity when resolvedTheme changes.
 */
export function useColors() {
  const { resolvedTheme } = useSettings();
  return useMemo(() => {
    const palette =
      resolvedTheme === "dark" && "dark" in colors
        ? (colors as Record<string, typeof colors.light>).dark
        : colors.light;
    return { ...palette, radius: colors.radius };
  }, [resolvedTheme]);
}
