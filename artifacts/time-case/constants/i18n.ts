export type Locale = "fr" | "en";
export type LangPref = "system" | "fr" | "en";
export type ThemePref = "system" | "light" | "dark";

export interface Translations {
  appTitle: string;
  noTimers: string;
  timerCount: (n: number) => string;
  newTimer: string;
  editTimer: string;
  fieldText: string;
  fieldDateTime: string;
  fieldColor: string;
  placeholder: string;
  save: string;
  add: string;
  done: string;
  emptyTitle: string;
  emptyBody: string;
  confirmDelete: (label: string) => string;
  settingsTitle: string;
  theme: string;
  themeSystem: string;
  themeLight: string;
  themeDark: string;
  language: string;
  langSystem: string;
  langFr: string;
  langEn: string;
  hours: string;
  days: string;
  week: (n: number) => string;
  months: string;
  year: (n: number) => string;
  locale: string;
}

const fr: Translations = {
  appTitle: "Depuis",
  noTimers: "Aucun timer",
  timerCount: (n) => `${n} timer${n > 1 ? "s" : ""}`,
  newTimer: "Nouveau timer",
  editTimer: "Modifier",
  fieldText: "Texte",
  fieldDateTime: "Date et heure de départ",
  fieldColor: "Couleur",
  placeholder: "Ex: notre premier rendez-vous",
  save: "Enregistrer",
  add: "Ajouter",
  done: "OK",
  emptyTitle: "Aucun timer",
  emptyBody: "Appuie sur + pour ajouter le temps écoulé depuis une date importante.",
  confirmDelete: (label) => `Supprimer "${label}" ?`,
  settingsTitle: "Paramètres",
  theme: "Thème",
  themeSystem: "Système",
  themeLight: "Clair",
  themeDark: "Sombre",
  language: "Langue",
  langSystem: "Système",
  langFr: "Français",
  langEn: "English",
  hours: "heures",
  days: "jours",
  week: (n) => (n > 1 ? "semaines" : "semaine"),
  months: "mois",
  year: (n) => (n > 1 ? "années" : "année"),
  locale: "fr-FR",
};

const en: Translations = {
  appTitle: "Depuis",
  noTimers: "No timers",
  timerCount: (n) => `${n} timer${n > 1 ? "s" : ""}`,
  newTimer: "New timer",
  editTimer: "Edit",
  fieldText: "Label",
  fieldDateTime: "Start date & time",
  fieldColor: "Color",
  placeholder: "e.g. our first date",
  save: "Save",
  add: "Add",
  done: "Done",
  emptyTitle: "No timers",
  emptyBody: "Tap + to track time elapsed since an important date.",
  confirmDelete: (label) => `Delete "${label}"?`,
  settingsTitle: "Settings",
  theme: "Theme",
  themeSystem: "System",
  themeLight: "Light",
  themeDark: "Dark",
  language: "Language",
  langSystem: "System",
  langFr: "Français",
  langEn: "English",
  hours: "hours",
  days: "days",
  week: (n) => (n > 1 ? "weeks" : "week"),
  months: "months",
  year: (n) => (n > 1 ? "years" : "year"),
  locale: "en-US",
};

export const translations: Record<Locale, Translations> = { fr, en };

export function getSystemLocale(): Locale {
  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en";
  }
  return "fr";
}
