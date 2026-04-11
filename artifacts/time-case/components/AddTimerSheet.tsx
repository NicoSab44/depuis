import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";
import { TimerEntry } from "@/context/TimersContext";
import { Feather } from "@expo/vector-icons";

export const PASTEL_COLORS = [
  { hex: "#FECACA", name: "Rose" },
  { hex: "#FBCFE8", name: "Corail" },
  { hex: "#FED7AA", name: "Pêche" },
  { hex: "#FEF08A", name: "Soleil" },
  { hex: "#BBF7D0", name: "Menthe" },
  { hex: "#BAE6FD", name: "Ciel" },
  { hex: "#DDD6FE", name: "Lavande" },
  { hex: "#99F6E4", name: "Jade" },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (label: string, date: string, color: string) => void;
  initialTimer?: TimerEntry | null;
}

type PickerMode = "none" | "date" | "time";

function toDateInputValue(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toTimeInputValue(d: Date) {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function WebDateTimeInputs({
  selectedDate,
  onDateChange,
  onTimeChange,
  colors,
}: {
  selectedDate: Date;
  onDateChange: (d: Date) => void;
  onTimeChange: (d: Date) => void;
  colors: ReturnType<typeof useColors>;
}) {
  const today = toDateInputValue(new Date());

  return (
    <View style={{ gap: 10 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.card,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 14,
          paddingVertical: 4,
          gap: 8,
        }}
      >
        <Feather name="calendar" size={15} color={colors.primary} />
        {/* @ts-ignore web input */}
        <input
          type="date"
          value={toDateInputValue(selectedDate)}
          max={today}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            if (!val) return;
            const [y, mo, d] = val.split("-").map(Number);
            const next = new Date(selectedDate);
            next.setFullYear(y, mo - 1, d);
            onDateChange(next);
          }}
          style={{
            flex: 1,
            fontSize: 15,
            color: colors.foreground,
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            padding: "8px 0",
            fontFamily: "system-ui, sans-serif",
            minWidth: 0,
            width: "100%",
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.card,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 14,
          paddingVertical: 4,
          gap: 8,
        }}
      >
        <Feather name="clock" size={15} color={colors.primary} />
        {/* @ts-ignore web input */}
        <input
          type="time"
          value={toTimeInputValue(selectedDate)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            if (!val) return;
            const [h, m] = val.split(":").map(Number);
            const next = new Date(selectedDate);
            next.setHours(h, m, 0, 0);
            onTimeChange(next);
          }}
          style={{
            flex: 1,
            fontSize: 15,
            color: colors.foreground,
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            padding: "8px 0",
            fontFamily: "system-ui, sans-serif",
            minWidth: 0,
            width: "100%",
          }}
        />
      </View>
    </View>
  );
}

export function AddTimerSheet({
  visible,
  onClose,
  onSave,
  initialTimer,
}: Props) {
  const colors = useColors();
  const t = useTranslation();
  const insets = useSafeAreaInsets();

  const isEditing = !!initialTimer;

  const [label, setLabel] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedColor, setSelectedColor] = useState(PASTEL_COLORS[5].hex);
  const [pickerMode, setPickerMode] = useState<PickerMode>("none");

  useEffect(() => {
    if (visible) {
      if (initialTimer) {
        setLabel(initialTimer.label);
        setSelectedDate(new Date(initialTimer.date));
        setSelectedColor(initialTimer.color ?? PASTEL_COLORS[5].hex);
      } else {
        setLabel("");
        setSelectedDate(new Date());
        setSelectedColor(PASTEL_COLORS[5].hex);
      }
      setPickerMode("none");
    }
  }, [visible, initialTimer]);

  const handleSave = () => {
    if (!label.trim()) return;
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onSave(label.trim(), selectedDate.toISOString(), selectedColor);
    onClose();
  };

  const dateLabel = selectedDate.toLocaleDateString(t.locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeLabel = selectedDate.toLocaleTimeString(t.locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const styles = useMemo(() => makeStyles(colors, insets), [colors, insets]);

  const handleNativeDateChange = (_: unknown, date?: Date) => {
    if (Platform.OS === "android") setPickerMode("none");
    if (date) {
      setSelectedDate((prev) => {
        const next = new Date(date);
        next.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
        return next;
      });
    }
  };

  const handleNativeTimeChange = (_: unknown, date?: Date) => {
    if (Platform.OS === "android") setPickerMode("none");
    if (date) {
      setSelectedDate((prev) => {
        const next = new Date(prev);
        next.setHours(date.getHours(), date.getMinutes(), 0, 0);
        return next;
      });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          <View style={styles.handle} />

          <View style={styles.sheetHeader}>
            <Text style={styles.title}>
              {isEditing ? t.editTimer : t.newTimer}
            </Text>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <Feather name="x" size={20} color={colors.mutedForeground} />
            </Pressable>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            {/* Label */}
            <Text style={styles.fieldLabel}>{t.fieldText}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.placeholder}
              placeholderTextColor={colors.mutedForeground}
              value={label}
              onChangeText={setLabel}
              returnKeyType="done"
              maxLength={80}
            />

            {/* Date & time */}
            <Text style={[styles.fieldLabel, { marginTop: 24 }]}>
              {t.fieldDateTime}
            </Text>

            {Platform.OS === "web" ? (
              <WebDateTimeInputs
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onTimeChange={setSelectedDate}
                colors={colors}
              />
            ) : (
              <>
                <View style={styles.dateTimeRow}>
                  <Pressable
                    style={[
                      styles.dateTimeBtn,
                      { flex: 3 },
                      pickerMode === "date" && styles.dateTimeBtnActive,
                    ]}
                    onPress={() =>
                      setPickerMode((m) => (m === "date" ? "none" : "date"))
                    }
                  >
                    <Feather name="calendar" size={15} color={colors.primary} />
                    <Text style={styles.dateTimeText}>{dateLabel}</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.dateTimeBtn,
                      { flex: 2 },
                      pickerMode === "time" && styles.dateTimeBtnActive,
                    ]}
                    onPress={() =>
                      setPickerMode((m) => (m === "time" ? "none" : "time"))
                    }
                  >
                    <Feather name="clock" size={15} color={colors.primary} />
                    <Text style={styles.dateTimeText}>{timeLabel}</Text>
                  </Pressable>
                </View>

                {pickerMode === "date" && (
                  <View style={styles.pickerWrap}>
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display={Platform.OS === "ios" ? "inline" : "default"}
                      maximumDate={new Date()}
                      onChange={handleNativeDateChange}
                      style={{ alignSelf: "stretch" }}
                    />
                    {Platform.OS === "ios" && (
                      <Pressable
                        onPress={() => setPickerMode("none")}
                        style={styles.pickerDone}
                      >
                        <Text style={styles.pickerDoneText}>{t.done}</Text>
                      </Pressable>
                    )}
                  </View>
                )}

                {pickerMode === "time" && (
                  <View style={styles.pickerWrap}>
                    <DateTimePicker
                      value={selectedDate}
                      mode="time"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      is24Hour
                      onChange={handleNativeTimeChange}
                      style={{ alignSelf: "stretch" }}
                    />
                    {Platform.OS === "ios" && (
                      <Pressable
                        onPress={() => setPickerMode("none")}
                        style={styles.pickerDone}
                      >
                        <Text style={styles.pickerDoneText}>{t.done}</Text>
                      </Pressable>
                    )}
                  </View>
                )}
              </>
            )}

            {/* Color picker */}
            <Text style={[styles.fieldLabel, { marginTop: 24 }]}>{t.fieldColor}</Text>
            <View style={styles.colorRow}>
              {PASTEL_COLORS.map((c) => (
                <Pressable
                  key={c.hex}
                  onPress={() => setSelectedColor(c.hex)}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: c.hex },
                    selectedColor === c.hex && styles.colorSwatchSelected,
                  ]}
                >
                  {selectedColor === c.hex && (
                    <Feather name="check" size={14} color="#0f172a" />
                  )}
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <View
            style={[
              styles.footer,
              { paddingBottom: Math.max(insets.bottom, 20) },
            ]}
          >
            <Pressable
              style={[
                styles.saveBtn,
                { backgroundColor: selectedColor },
                !label.trim() && styles.saveBtnDisabled,
              ]}
              onPress={handleSave}
              disabled={!label.trim()}
            >
              <Text style={styles.saveBtnText}>
                {isEditing ? t.save : t.add}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
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
      paddingTop: 12,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: "center",
      marginBottom: 16,
    },
    sheetHeader: {
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
    content: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    fieldLabel: {
      fontSize: 12,
      fontWeight: "600" as const,
      color: colors.mutedForeground,
      fontFamily: "Inter_600SemiBold",
      textTransform: "uppercase" as const,
      letterSpacing: 0.8,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
    },
    dateTimeRow: {
      flexDirection: "row",
      gap: 10,
    },
    dateTimeBtn: {
      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 14,
      paddingVertical: 13,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    dateTimeBtnActive: {
      borderColor: colors.primary,
    },
    dateTimeText: {
      flex: 1,
      fontSize: 15,
      color: colors.foreground,
      fontFamily: "Inter_400Regular",
    },
    pickerWrap: {
      marginTop: 12,
      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    pickerDone: {
      alignItems: "center",
      padding: 14,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    pickerDoneText: {
      fontSize: 16,
      color: colors.primary,
      fontFamily: "Inter_600SemiBold",
    },
    colorRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    colorSwatch: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: "transparent",
    },
    colorSwatchSelected: {
      borderColor: "#0f172a",
    },
    footer: {
      paddingHorizontal: 20,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    saveBtn: {
      borderRadius: 16,
      paddingVertical: 16,
      alignItems: "center",
    },
    saveBtnDisabled: {
      opacity: 0.4,
    },
    saveBtnText: {
      fontSize: 16,
      fontWeight: "700" as const,
      color: "#0f172a",
      fontFamily: "Inter_700Bold",
    },
  });
}
