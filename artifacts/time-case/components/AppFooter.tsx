import Constants from "expo-constants";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

import { useColors } from "@/hooks/useColors";

interface Props {
  style?: ViewStyle;
}

export function AppFooter({ style }: Props) {
  const colors = useColors();
  return (
    <View style={[styles.row, style]}>
      <Text style={[styles.text, { color: colors.border }]}>
        v{Constants.expoConfig?.version ?? "1.0.0"}
      </Text>
      <Text style={[styles.text, { color: colors.border }]}>·</Text>
      <Text style={[styles.text, { color: colors.border }]}>Created by NSA</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
  },
  text: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
