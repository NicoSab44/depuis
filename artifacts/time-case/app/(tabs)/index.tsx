import * as Haptics from "expo-haptics";
import Constants from "expo-constants";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AddTimerSheet } from "@/components/AddTimerSheet";
import { SettingsSheet } from "@/components/SettingsSheet";
import { TimerCard } from "@/components/TimerCard";
import { TimerEntry, useTimers } from "@/context/TimersContext";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";
import { Feather } from "@expo/vector-icons";

export default function HomeScreen() {
  const colors = useColors();
  const t = useTranslation();
  const insets = useSafeAreaInsets();
  const { timers, addTimer, editTimer, removeTimer, moveTimer } = useTimers();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingTimer, setEditingTimer] = useState<TimerEntry | null>(null);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const styles = useMemo(() => makeStyles(colors), [colors]);

  const openAdd = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setEditingTimer(null);
    setSheetOpen(true);
  };

  const openEdit = (timer: TimerEntry) => {
    setEditingTimer(timer);
    setSheetOpen(true);
  };

  const handleSave = (label: string, date: string, color: string) => {
    if (editingTimer) {
      editTimer(editingTimer.id, label, date, color);
    } else {
      addTimer(label, date, color);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.appTitle}>{t.appTitle}</Text>
            <Text style={styles.subtitle}>
              {timers.length === 0 ? t.noTimers : t.timerCount(timers.length)}
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            style={styles.settingsBtn}
            onPress={() => setSettingsOpen(true)}
            hitSlop={8}
          >
            <Feather name="settings" size={18} color={colors.mutedForeground} />
          </Pressable>
          <Pressable style={styles.fab} onPress={openAdd}>
            <Feather name="plus" size={22} color="#ffffff" />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={timers}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TimerCard
            timer={item}
            isFirst={index === 0}
            isLast={index === timers.length - 1}
            onDelete={removeTimer}
            onEdit={openEdit}
            onMove={moveTimer}
          />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottomPad + 20 },
        ]}
        scrollEnabled={timers.length > 0}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="clock" size={48} color={colors.border} />
            <Text style={styles.emptyTitle}>{t.emptyTitle}</Text>
            <Text style={styles.emptyText}>
              {(() => {
                const parts = t.emptyBody.split("+");
                if (parts.length === 2) {
                  return (
                    <>
                      {parts[0]}
                      <Text style={{ color: colors.primary }}>+</Text>
                      {parts[1]}
                    </>
                  );
                }
                return t.emptyBody;
              })()}
            </Text>
          </View>
        }
      />

      <AddTimerSheet
        visible={sheetOpen}
        onClose={() => {
          setSheetOpen(false);
          setEditingTimer(null);
        }}
        onSave={handleSave}
        initialTimer={editingTimer}
      />

      <SettingsSheet
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <View style={[styles.footer, { paddingBottom: Math.max(bottomPad, 16) }]}>
        <Text style={styles.footerText}>
          v{Constants.expoConfig?.version ?? "1.0.0"}
        </Text>
        <Text style={styles.footerDot}>·</Text>
        <Text style={styles.footerText}>Created by NSA</Text>
      </View>
    </View>
  );
}

function makeStyles(colors: ReturnType<typeof useColors>) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    logo: {
      width: 44,
      height: 44,
      borderRadius: 12,
    },
    appTitle: {
      fontSize: 28,
      fontWeight: "700" as const,
      color: colors.foreground,
      fontFamily: "Inter_700Bold",
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 13,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      marginTop: 2,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    settingsBtn: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: colors.muted,
      alignItems: "center",
      justifyContent: "center",
    },
    fab: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      elevation: 6,
      ...Platform.select({
        web: { boxShadow: "0px 4px 8px rgba(0,100,255,0.3)" },
        default: {
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
      }),
    },
    list: {
      paddingHorizontal: 16,
    },
    emptyState: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 100,
      paddingHorizontal: 40,
      gap: 12,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: "600" as const,
      color: colors.foreground,
      fontFamily: "Inter_600SemiBold",
    },
    emptyText: {
      fontSize: 15,
      color: colors.mutedForeground,
      fontFamily: "Inter_400Regular",
      textAlign: "center",
      lineHeight: 22,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingTop: 8,
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
