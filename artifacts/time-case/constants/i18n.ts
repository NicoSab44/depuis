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
  legalNav: string;
  legalTitle: string;
  legalEditorTitle: string;
  legalEditorName: string;
  legalEditorType: string;
  legalEditorTypeValue: string;
  legalContact: string;
  legalHostingTitle: string;
  legalHostingText: string;
  legalDataTitle: string;
  legalDataText: string;
  legalTrackingTitle: string;
  legalTrackingServerLogs: string;
  legalTrackingCookies: string;
  legalTrackingAnalytics: string;
  legalTrackingAds: string;
  legalLawTitle: string;
  legalLawText: string;
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
  legalNav: "Mentions légales",
  legalTitle: "Mentions légales",
  legalEditorTitle: "Éditeur de l'application",
  legalEditorName: "Nom",
  legalEditorType: "Statut",
  legalEditorTypeValue: "Personne physique",
  legalContact: "Contact",
  legalHostingTitle: "Hébergement",
  legalHostingText:
    "L'application Depuis est une application mobile distribuée via le Google Play Store. Elle ne dispose d'aucun serveur propre — toutes les données sont stockées localement sur votre appareil et n'transitent par aucun réseau.",
  legalDataTitle: "Données personnelles",
  legalDataText:
    "Aucune donnée personnelle n'est collectée, transmise ou partagée. Les informations saisies (libellés, dates, couleurs) sont enregistrées uniquement dans la mémoire locale de votre appareil via AsyncStorage et ne quittent jamais celui-ci.",
  legalTrackingTitle: "Collecte & traçabilité",
  legalTrackingServerLogs: "Logs serveur / adresses IP",
  legalTrackingCookies: "Cookies",
  legalTrackingAnalytics: "Analytics / statistiques",
  legalTrackingAds: "Publicités / trackers tiers",
  legalLawTitle: "Droit applicable",
  legalLawText:
    "Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.",
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
  legalNav: "Legal notice",
  legalTitle: "Legal Notice",
  legalEditorTitle: "App Publisher",
  legalEditorName: "Name",
  legalEditorType: "Type",
  legalEditorTypeValue: "Individual",
  legalContact: "Contact",
  legalHostingTitle: "Hosting",
  legalHostingText:
    "Depuis is a mobile application distributed via the Google Play Store. It has no dedicated server — all data is stored locally on your device and never transmitted over any network.",
  legalDataTitle: "Personal Data",
  legalDataText:
    "No personal data is collected, transmitted or shared. Information you enter (labels, dates, colors) is saved only in your device's local storage via AsyncStorage and never leaves your device.",
  legalTrackingTitle: "Tracking & Collection",
  legalTrackingServerLogs: "Server logs / IP addresses",
  legalTrackingCookies: "Cookies",
  legalTrackingAnalytics: "Analytics / statistics",
  legalTrackingAds: "Ads / third-party trackers",
  legalLawTitle: "Applicable Law",
  legalLawText:
    "These legal notices are governed by French law. In the event of a dispute, French courts shall have sole jurisdiction.",
};

export const translations: Record<Locale, Translations> = { fr, en };

export function getSystemLocale(): Locale {
  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en";
  }
  return "fr";
}
