import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ModalShell } from "@/components/ModalShell";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function LegalSheet({ visible, onClose }: Props) {
  const colors = useColors();
  const t = useTranslation();

  return (
    <ModalShell visible={visible} onClose={onClose} title={t.legalTitle}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Section title={t.legalEditorTitle} colors={colors}>
          <Row label={t.legalEditorName} value="Nicolas SABOUREAU" colors={colors} />
          <Row label={t.legalEditorType} value={t.legalEditorTypeValue} colors={colors} />
          <Pressable onPress={() => Linking.openURL("mailto:saboureaunicolas@gmail.com")}>
            <Row label={t.legalContact} value="saboureaunicolas@gmail.com" colors={colors} link />
          </Pressable>
          <Pressable onPress={() => Linking.openURL("https://www.linkedin.com/in/nicolas-saboureau")}>
            <Row label="LinkedIn" value="linkedin.com/in/nicolas-saboureau" colors={colors} link />
          </Pressable>
        </Section>

        <Section title={t.legalHostingTitle} colors={colors}>
          <InfoBlock text={t.legalHostingText} colors={colors} />
        </Section>

        <Section title={t.legalDataTitle} colors={colors}>
          <InfoBlock text={t.legalDataText} colors={colors} />
        </Section>

        <Section title={t.legalTrackingTitle} colors={colors}>
          <TrackingRow label={t.legalTrackingServerLogs} status={false} colors={colors} />
          <TrackingRow label={t.legalTrackingCookies} status={false} colors={colors} />
          <TrackingRow label={t.legalTrackingAnalytics} status={false} colors={colors} />
          <TrackingRow label={t.legalTrackingAds} status={false} colors={colors} />
        </Section>

        <Section title={t.legalLawTitle} colors={colors}>
          <InfoBlock text={t.legalLawText} colors={colors} />
        </Section>
      </ScrollView>
    </ModalShell>
  );
}

function Section({
  title,
  children,
  colors,
}: {
  title: string;
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{title}</Text>
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
  colors,
}: {
  label: string;
  value: string;
  link?: boolean;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <Text style={[styles.rowLabel, { color: colors.foreground }]}>{label}</Text>
      <Text
        style={[styles.rowValue, { color: link ? colors.primary : colors.mutedForeground }]}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

function InfoBlock({
  text,
  colors,
}: {
  text: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.infoBlock}>
      <Text style={[styles.infoText, { color: colors.mutedForeground }]}>{text}</Text>
    </View>
  );
}

function TrackingRow({
  label,
  status,
  colors,
}: {
  label: string;
  status: boolean;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <Text style={[styles.rowLabel, { color: colors.foreground }]}>{label}</Text>
      <View style={[styles.badge, { backgroundColor: status ? "#fef2f2" : "#f0fdf4" }]}>
        <Feather name={status ? "check" : "x"} size={12} color={status ? "#ef4444" : "#22c55e"} />
        <Text style={[styles.badgeText, { color: status ? "#ef4444" : "#22c55e" }]}>
          {status ? "Oui" : "Non"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 20,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
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
  },
  rowLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  rowValue: {
    fontSize: 14,
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
});
