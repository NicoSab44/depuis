import { translations, getSystemLocale } from "../constants/i18n";

describe("translations — French (fr)", () => {
  const t = translations.fr;

  it("has correct static strings", () => {
    expect(t.appTitle).toBe("Depuis");
    expect(t.hours).toBe("heures");
    expect(t.days).toBe("jours");
    expect(t.months).toBe("mois");
    expect(t.locale).toBe("fr-FR");
  });

  it("timerCount uses singular for 1", () => {
    expect(t.timerCount(1)).toBe("1 timer");
  });

  it("timerCount uses plural for > 1", () => {
    expect(t.timerCount(2)).toBe("2 timers");
    expect(t.timerCount(10)).toBe("10 timers");
  });

  it("week() returns singular for 1", () => {
    expect(t.week(1)).toBe("semaine");
  });

  it("week() returns plural for > 1", () => {
    expect(t.week(2)).toBe("semaines");
    expect(t.week(5)).toBe("semaines");
  });

  it("year() returns singular for 1", () => {
    expect(t.year(1)).toBe("année");
  });

  it("year() returns plural for > 1", () => {
    expect(t.year(2)).toBe("années");
  });

  it("confirmDelete includes the label", () => {
    expect(t.confirmDelete("Mon anniversaire")).toBe('Supprimer "Mon anniversaire" ?');
  });
});

describe("translations — English (en)", () => {
  const t = translations.en;

  it("has correct static strings", () => {
    expect(t.appTitle).toBe("Depuis");
    expect(t.hours).toBe("hours");
    expect(t.days).toBe("days");
    expect(t.months).toBe("months");
    expect(t.locale).toBe("en-US");
  });

  it("timerCount uses singular for 1", () => {
    expect(t.timerCount(1)).toBe("1 timer");
  });

  it("timerCount uses plural for > 1", () => {
    expect(t.timerCount(3)).toBe("3 timers");
  });

  it("week() returns singular for 1", () => {
    expect(t.week(1)).toBe("week");
  });

  it("week() returns plural for > 1", () => {
    expect(t.week(3)).toBe("weeks");
  });

  it("year() returns singular for 1", () => {
    expect(t.year(1)).toBe("year");
  });

  it("year() returns plural for > 1", () => {
    expect(t.year(5)).toBe("years");
  });

  it("confirmDelete includes the label", () => {
    expect(t.confirmDelete("My birthday")).toBe('Delete "My birthday"?');
  });
});

describe("getSystemLocale", () => {
  const originalNavigator = global.navigator;

  afterEach(() => {
    Object.defineProperty(global, "navigator", {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  it("returns 'fr' when navigator.language starts with 'fr'", () => {
    Object.defineProperty(global, "navigator", {
      value: { language: "fr-FR" },
      writable: true,
      configurable: true,
    });
    expect(getSystemLocale()).toBe("fr");
  });

  it("returns 'fr' for lowercase fr", () => {
    Object.defineProperty(global, "navigator", {
      value: { language: "fr" },
      writable: true,
      configurable: true,
    });
    expect(getSystemLocale()).toBe("fr");
  });

  it("returns 'en' for English locale", () => {
    Object.defineProperty(global, "navigator", {
      value: { language: "en-US" },
      writable: true,
      configurable: true,
    });
    expect(getSystemLocale()).toBe("en");
  });

  it("returns 'en' for unsupported locale", () => {
    Object.defineProperty(global, "navigator", {
      value: { language: "de-DE" },
      writable: true,
      configurable: true,
    });
    expect(getSystemLocale()).toBe("en");
  });

  it("returns 'fr' when navigator is undefined", () => {
    Object.defineProperty(global, "navigator", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    expect(getSystemLocale()).toBe("fr");
  });
});
