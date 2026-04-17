import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { LangPref, ThemePref } from "@/constants/i18n";
import { useSettings } from "@/context/SettingsContext";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";
import { LegalSheet } from "@/components/LegalSheet";
import { ModalShell } from "@/components/ModalShell";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function SettingsSheet({ visible, onClose }: Props) {
  const colors = useColors();
  const t = useTranslation();
  const { themePref, langPref, setThemePref, setLangPref } = useSettings();
  const [legalOpen, setLegalOpen] = useState(false);

  const styles = makeStyles(colors);

  const themeOptions: { value: ThemePref; label: string; icon: keyof typeof Feather.glyphMap }[] = [
    { value: "system", label: t.themeSystem, icon: "monitor" },
    { value: "light", label: t.themeLight, icon: "sun" },
    { value: "dark", label: t.themeDark, icon: "moon" },
  ];

  const langOptions: { value: LangPref; label: string }[] = [
    { value: "fr", label: t.langFr },
    { value: "en", label: t.langEn },
  ];

  return (
    <>
      <ModalShell visible={visible} onClose={onClose} title={t.settingsTitle}>
        {/* Theme */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t.theme}</Text>
          <View style={styles.optionRow}>
            {themeOptions.map((opt) => {
              const active = themePref === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  style={[styles.optionBtn, active && styles.optionBtnActive]}
                  onPress={() => setThemePref(opt.value)}
                >
                  <Feather
                    name={opt.icon}
                    size={16}
                    color={active ? colors.primary : colors.mutedForeground}
                  />
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t.language}</Text>
          <View style={styles.optionRow}>
            {langOptions.map((opt) => {
              const active = langPref === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  style={[styles.optionBtn, active && styles.optionBtnActive]}
                  onPress={() => setLangPref(opt.value)}
                >
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Mentions légales */}
        <Pressable style={styles.legalBtn} onPress={() => setLegalOpen(true)}>
          <Feather name="file-text" size={15} color={colors.mutedForeground} />
          <Text style={styles.legalBtnText}>{t.legalNav}</Text>
          <Feather name="chevron-right" size={15} color={colors.mutedForeground} />
        </Pressable>
      </ModalShell>

      <LegalSheet visible={legalOpen} onClose={() => setLegalOpen(false)} />
    </>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    section: {
      paddingHorizontal: 20,
      marginBottom: 28,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: "600" as const,
      color: colors.mutedForeground,
      fontFamily: "Inter_600SemiBold",
      textTransform: "uppercase" as const,
      letterSpacing: 0.8,
      marginBottom: 12,
    },
    optionRow: {
      flexDirection: "row",
      gap: 10,
    },
    optionBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.card,
      ...(Platform.OS === "web"
        ? { boxShadow: "0px 1px 3px rgba(0,0,0,0.05)" }
        : {}),
    },
    optionBtnActive: {
      borderColor: colors.primary,
      backgroundColor: colors.secondary,
    },
    optionText: {
      fontSize: 13,
      fontWeight: "500" as const,
      color: colors.mutedForeground,
      fontFamily: "Inter_500Medium",
    },
    optionTextActive: {
      color: colors.primary,
      fontWeight: "600" as const,
      fontFamily: "Inter_600SemiBold",
    },
    legalBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginHorizontal: 20,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    legalBtnText: {
      flex: 1,
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
  });
}
