import React, { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { LangPref, ThemePref } from "@/constants/i18n";
import { useSettings } from "@/context/SettingsContext";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";
import { LegalSheet } from "@/components/LegalSheet";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function SettingsSheet({ visible, onClose }: Props) {
  const colors = useColors();
  const t = useTranslation();
  const insets = useSafeAreaInsets();
  const { themePref, langPref, setThemePref, setLangPref } = useSettings();
  const [legalOpen, setLegalOpen] = useState(false);

  const styles = useMemo(() => makeStyles(colors, insets), [colors, insets]);

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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>{t.settingsTitle}</Text>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
            <Feather name="x" size={20} color={colors.mutedForeground} />
          </Pressable>
        </View>

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
                  <Text
                    style={[styles.optionText, active && styles.optionTextActive]}
                  >
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
                  <Text
                    style={[styles.optionText, active && styles.optionTextActive]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Mentions légales */}
        <Pressable
          style={styles.legalBtn}
          onPress={() => setLegalOpen(true)}
        >
          <Feather name="file-text" size={15} color={colors.mutedForeground} />
          <Text style={styles.legalBtnText}>{t.legalNav}</Text>
          <Feather name="chevron-right" size={15} color={colors.mutedForeground} />
        </Pressable>
      </View>

      <LegalSheet visible={legalOpen} onClose={() => setLegalOpen(false)} />
    </Modal>
  );
}

function makeStyles(
  colors: ReturnType<typeof useColors>,
  insets: { top: number; bottom: number }
) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: insets.top + 16,
      paddingBottom: Math.max(insets.bottom, 24),
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: "center",
      marginBottom: 16,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      marginBottom: 32,
    },
    title: {
      fontSize: 20,
      fontWeight: "700" as const,
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
    },
    closeBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
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
