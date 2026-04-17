import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useColors } from "@/hooks/useColors";
import { useTranslation } from "@/hooks/useTranslation";

const offlineImage = require("@/assets/images/offline.png");

interface Props {
  onRetry: () => void;
}

export function OfflineScreen({ onRetry }: Props) {
  const colors = useColors();
  const t = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={offlineImage}
        style={styles.image}
        resizeMode="contain"
        accessibilityLabel="Connexion interrompue"
      />

      <Text style={[styles.title, { color: colors.foreground }]}>
        {t.offlineTitle}
      </Text>

      <Text style={[styles.body, { color: colors.mutedForeground }]}>
        {t.offlineBody}
      </Text>

      <View style={[styles.reasonBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.reasonText, { color: colors.mutedForeground }]}>
          {t.offlineReason}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.retryBtn,
          { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
        ]}
        onPress={onRetry}
      >
        <Text style={styles.retryText}>{t.offlineRetry}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  image: {
    width: 260,
    height: 260,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  body: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  reasonBox: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
    width: "100%",
    maxWidth: 360,
    marginTop: 4,
  },
  reasonText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 21,
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 50,
  },
  retryText: {
    fontSize: 15,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
    letterSpacing: 0.3,
  },
});
