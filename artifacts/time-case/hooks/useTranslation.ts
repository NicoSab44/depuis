import { useSettings } from "@/context/SettingsContext";
import { Translations } from "@/constants/i18n";

export function useTranslation(): Translations {
  return useSettings().t;
}
