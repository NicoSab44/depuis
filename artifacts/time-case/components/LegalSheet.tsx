import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import * as Linking from "expo-linking";
import React, { useMemo } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function LegalSheet({ visible, onClose }: Props) {
  const colors = useColors();
  const t = useTranslation();
  const insets = useSafeAreaInsets();

  const styles = useMemo(() => makeStyles(colors, insets), [colors, insets]);

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
          <Text style={styles.title}>{t.legalTitle}</Text>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
            <Feather name="x" size={20} color={colors.mutedForeground} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Éditeur */}

          <Section title={t.legalEditorTitle} colors={colors} styles={styles}>
            <Row label={t.legalEditorName} value="Nicolas SABOUREAU" styles={styles} colors={colors} />
            <Row label={t.legalEditorType} value={t.legalEditorTypeValue} styles={styles} colors={colors} />
            <Pressable onPress={() => Linking.openURL("mailto:saboureaunicolas@gmail.com")}>
              <Row
                label={t.legalContact}
                value="saboureaunicolas@gmail.com"
                styles={styles}
                colors={colors}
                link
              />
            </Pressable>
            <Pressable onPress={() => Linking.openURL("https://www.linkedin.com/in/nicolas-saboureau")}>
              <Row
                label="LinkedIn"
                value="linkedin.com/in/nicolas-saboureau"
                styles={styles}
                colors={colors}
                link
              />
            </Pressable>
          </Section>

          {/* Hébergement */}
          <Section title={t.legalHostingTitle} colors={colors} styles={styles}>
            <InfoBlock text={t.legalHostingText} styles={styles} colors={colors} />
          </Section>

          {/* Données personnelles */}
          <Section title={t.legalDataTitle} colors={colors} styles={styles}>
            <InfoBlock text={t.legalDataText} styles={styles} colors={colors} />
          </Section>

          {/* Logs & trackers */}
          <Section title={t.legalTrackingTitle} colors={colors} styles={styles}>
            <TrackingRow
              label={t.legalTrackingServerLogs}
              status={false}
              styles={styles}
              colors={colors}
            />
            <TrackingRow
              label={t.legalTrackingCookies}
              status={false}
              styles={styles}
              colors={colors}
            />
            <TrackingRow
              label={t.legalTrackingAnalytics}
              status={false}
              styles={styles}
              colors={colors}
            />
            <TrackingRow
              label={t.legalTrackingAds}
              status={false}
              styles={styles}
              colors={colors}
            />
          </Section>

          {/* Droit applicable */}
          <Section title={t.legalLawTitle} colors={colors} styles={styles}>
            <InfoBlock text={t.legalLawText} styles={styles} colors={colors} />
          </Section>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            v{Constants.expoConfig?.version ?? "1.0.0"}
          </Text>
          <Text style={styles.footerDot}>·</Text>
          <Text style={styles.footerText}>Created by NSA</Text>
        </View>
      </View>
    </Modal>
  );
}

function Section({
  title,
  children,
  colors,
  styles,
}: {
  title: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
  styles: ReturnType<typeof makeStyles>;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{title}</Text>
      <View style={[styles.card, { borderColor: colors.border, backgroundColor: colors.card }]}>
        {children}
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  link,
  styles,
  colors,
}: {
  label: string;
  value: string;
  link?: boolean;
  styles: ReturnType<typeof makeStyles>;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, link && { color: colors.primary }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function InfoBlock({
  text,
  styles,
  colors,
}: {
  text: string;
  styles: ReturnType<typeof makeStyles>;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.infoBlock}>
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

function TrackingRow({
  label,
  status,
  styles,
  colors,
}: {
  label: string;
  status: boolean;
  styles: ReturnType<typeof makeStyles>;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={[styles.badge, { backgroundColor: status ? "#fef2f2" : "#f0fdf4" }]}>
        <Feather
          name={status ? "check" : "x"}
          size={12}
          color={status ? "#ef4444" : "#22c55e"}
        />
        <Text style={[styles.badgeText, { color: status ? "#ef4444" : "#22c55e" }]}>
          {status ? "Oui" : "Non"}
        </Text>
      </View>
    </View>
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
      marginBottom: 24,
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
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: Math.max(insets.bottom, 32),
      gap: 20,
    },
    section: {
      gap: 8,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: "600" as const,
      color: colors.mutedForeground,
      fontFamily: "Inter_600SemiBold",
      textTransform: "uppercase" as const,
      letterSpacing: 0.8,
    },
    card: {
      borderRadius: 14,
      borderWidth: 1,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 13,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    rowLabel: {
      fontSize: 14,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
      flex: 1,
    },
    rowValue: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      maxWidth: "55%",
      textAlign: "right",
    },
    infoBlock: {
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    infoText: {
      fontSize: 14,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      lineHeight: 21,
    },
    badge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },
    badgeText: {
      fontSize: 12,
      fontWeight: "600" as const,
      fontFamily: "Inter_600SemiBold",
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingTop: 12,
      paddingBottom: Math.max(insets.bottom, 20),
    },
    footerText: {
      fontSize: 12,
      color: colors.border,
      fontFamily: "Inter_400Regular",
    },
    footerDot: {
      fontSize: 12,
      color: colors.border,
      fontFamily: "Inter_400Regular",
    },
  });
}
