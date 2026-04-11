import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";

import {
  LangPref,
  Locale,
  ThemePref,
  Translations,
  getSystemLocale,
  translations,
} from "@/constants/i18n";

interface SettingsContextValue {
  themePref: ThemePref;
  langPref: LangPref;
  setThemePref: (t: ThemePref) => void;
  setLangPref: (l: LangPref) => void;
  resolvedTheme: "light" | "dark";
  t: Translations;
}

const SettingsContext = createContext<SettingsContextValue>({
  themePref: "system",
  langPref: "system",
  setThemePref: () => {},
  setLangPref: () => {},
  resolvedTheme: "light",
  t: translations.fr,
});

const STORAGE_KEY = "@time_case_settings_v1";

interface Prefs {
  theme: ThemePref;
  lang: LangPref;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [prefs, setPrefs] = useState<Prefs>({ theme: "system", lang: "system" });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const parsed: Partial<Prefs> = JSON.parse(raw);
          setPrefs({
            theme: parsed.theme ?? "system",
            lang: parsed.lang ?? "system",
          });
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const savePrefs = useCallback((next: Prefs) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const setThemePref = useCallback(
    (theme: ThemePref) => {
      setPrefs((prev) => {
        const next = { ...prev, theme };
        savePrefs(next);
        return next;
      });
    },
    [savePrefs]
  );

  const setLangPref = useCallback(
    (lang: LangPref) => {
      setPrefs((prev) => {
        const next = { ...prev, lang };
        savePrefs(next);
        return next;
      });
    },
    [savePrefs]
  );

  const resolvedTheme: "light" | "dark" =
    prefs.theme === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : prefs.theme;

  const resolvedLocale: Locale =
    prefs.lang === "system" ? getSystemLocale() : prefs.lang;

  const t = translations[resolvedLocale];

  if (!loaded) return null;

  return (
    <SettingsContext.Provider
      value={{
        themePref: prefs.theme,
        langPref: prefs.lang,
        setThemePref,
        setLangPref,
        resolvedTheme,
        t,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
