import * as Haptics from "expo-haptics";
import React, { useMemo } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import { useNow } from "@/hooks/useNow";
import { useTranslation } from "@/hooks/useTranslation";
import { TimerEntry } from "@/context/TimersContext";
import { Translations } from "@/constants/i18n";
import { Feather } from "@expo/vector-icons";

interface Props {
  timer: TimerEntry;
  isFirst: boolean;
  isLast: boolean;
  onDelete: (id: string) => void;
  onEdit: (timer: TimerEntry) => void;
  onMove: (id: string, direction: "up" | "down") => void;
}

type UnitKey = "hours" | "days" | "weeks" | "months" | "years";

type UnitPair = {
  leftValue: number;
  leftUnit: UnitKey;
  rightValue: number;
  rightUnit: UnitKey;
};

function getUnitLabel(t: Translations, unit: UnitKey, value: number): string {
  switch (unit) {
    case "hours": return t.hours;
    case "days": return t.days;
    case "weeks": return t.week(value);
    case "months": return t.months;
    case "years": return t.year(value);
  }
}

function computeElapsed(dateStr: string, now: number): UnitPair {
  const start = new Date(dateStr).getTime();
  const diffMs = now - start;
  if (diffMs < 0) {
    return { leftValue: 0, leftUnit: "hours", rightValue: 0, rightUnit: "days" };
  }

  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = Math.floor(totalDays / 30.4375);
  const totalYears = Math.floor(totalDays / 365.25);

  if (totalYears >= 1) {
    return { leftValue: totalMonths, leftUnit: "months", rightValue: totalYears, rightUnit: "years" };
  }
  if (totalMonths >= 1) {
    return { leftValue: totalWeeks, leftUnit: "weeks", rightValue: totalMonths, rightUnit: "months" };
  }
  if (totalWeeks >= 1) {
    return { leftValue: totalDays, leftUnit: "days", rightValue: totalWeeks, rightUnit: "weeks" };
  }
  return { leftValue: totalHours, leftUnit: "hours", rightValue: totalDays, rightUnit: "days" };
}

export function TimerCard({
  timer,
  isFirst,
  isLast,
  onDelete,
  onEdit,
  onMove,
}: Props) {
  const colors = useColors();
  const t = useTranslation();
  const now = useNow();
  const elapsed = useMemo(() => computeElapsed(timer.date, now), [timer.date, now]);
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const cardColor = timer.color ?? "#BAE6FD";

  const handleDelete = () => {
    const message = t.confirmDelete(timer.label);
    if (Platform.OS === "web") {
      // eslint-disable-next-line no-restricted-globals
      if (confirm(message)) {
        onDelete(timer.id);
      }
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("", message, [
      { text: "Annuler", style: "cancel" },
      {
        text: t.editTimer,
        style: "destructive",
        onPress: () => onDelete(timer.id),
      },
    ]);
  };

  const handleEdit = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onEdit(timer);
  };

  const handleMove = (direction: "up" | "down") => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onMove(timer.id, direction);
  };

  const startDate = new Date(timer.date);
  const dateLabel = startDate.toLocaleDateString(t.locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeLabel = startDate.toLocaleTimeString(t.locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={[styles.card, { borderColor: cardColor }]}>
      {/* Colored top strip */}
      <View style={[styles.colorStrip, { backgroundColor: cardColor }]} />

      <View style={styles.inner}>
        {/* Header row: badge + label | actions */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.badge, { backgroundColor: cardColor }]}>
              <Feather name="clock" size={12} color="#0f172a" />
            </View>
            <Text style={styles.labelText} numberOfLines={1}>
              {timer.label}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              onPress={() => handleMove("up")}
              style={styles.iconBtn}
              hitSlop={8}
              disabled={isFirst}
            >
              <Text style={[styles.arrowText, isFirst && { color: colors.border }]}>↑</Text>
            </Pressable>
            <Pressable
              onPress={() => handleMove("down")}
              style={styles.iconBtn}
              hitSlop={8}
              disabled={isLast}
            >
              <Text style={[styles.arrowText, isLast && { color: colors.border }]}>↓</Text>
            </Pressable>
            <View style={styles.separator} />
            <Pressable onPress={handleEdit} style={styles.iconBtn} hitSlop={8}>
              <Feather name="edit-2" size={14} color={colors.mutedForeground} />
            </Pressable>
            <Pressable onPress={handleDelete} style={styles.iconBtn} hitSlop={8}>
              <Feather name="trash-2" size={14} color={colors.mutedForeground} />
            </Pressable>
          </View>
        </View>

        {/* Numbers */}
        <View style={styles.numbers}>
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{elapsed.leftValue.toLocaleString(t.locale)}</Text>
            <Text style={styles.statLabel}>{getUnitLabel(t, elapsed.leftUnit, elapsed.leftValue)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBlock}>
            <Text style={styles.statValue}>{elapsed.rightValue.toLocaleString(t.locale)}</Text>
            <Text style={styles.statLabel}>{getUnitLabel(t, elapsed.rightUnit, elapsed.rightValue)}</Text>
          </View>
        </View>

        {/* Date */}
        <Text style={styles.dateText}>{dateLabel} · {timeLabel}</Text>
      </View>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      marginBottom: 14,
      overflow: "hidden",
      ...(Platform.OS === "web"
        ? { boxShadow: "0px 2px 8px rgba(0,0,0,0.07)" }
        : {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.07,
            shadowRadius: 8,
            elevation: 3,
          }),
      borderWidth: 1.5,
    },
    colorStrip: {
      height: 4,
      width: "100%",
    },
    inner: {
      padding: 14,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    headerLeft: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginRight: 8,
    },
    badge: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconBtn: {
      width: 28,
      height: 28,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
    },
    arrowText: {
      fontSize: 16,
      color: colors.mutedForeground,
      lineHeight: 20,
    },
    separator: {
      width: 1,
      height: 16,
      backgroundColor: colors.border,
      marginHorizontal: 3,
    },
    numbers: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    statBlock: {
      flex: 1,
      alignItems: "center",
    },
    statValue: {
      fontSize: 32,
      fontWeight: "700" as const,
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      letterSpacing: -1,
      lineHeight: 38,
    },
    statLabel: {
      fontSize: 10,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textTransform: "uppercase" as const,
      letterSpacing: 1,
      marginTop: 1,
    },
    divider: {
      width: 1,
      height: 38,
      backgroundColor: colors.border,
      marginHorizontal: 12,
    },
    labelText: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600" as const,
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
    },
    dateText: {
      fontSize: 12,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
    },
  });
}
