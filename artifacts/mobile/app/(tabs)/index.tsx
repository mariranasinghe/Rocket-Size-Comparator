import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RocketVisualization } from "@/components/RocketVisualization";
import type { RocketData } from "@/components/RocketVisualization";

const ROCKETS: RocketData[] = [
  {
    id: "starship",
    name: "Starship",
    agency: "SpaceX",
    year: 2023,
    h: 121,
    d: 9,
    pay: 150,
    thr: 74.0,
    active: true,
    color: "#5B8FCC",
    desc: "Tallest ever built. Fully reusable, targeting Mars.",
    boosters: false,
  },
  {
    id: "saturnv",
    name: "Saturn V",
    agency: "NASA",
    year: 1967,
    h: 111,
    d: 10.1,
    pay: 140,
    thr: 35.1,
    active: false,
    color: "#A0A09A",
    desc: "Sent 24 humans to the Moon. Most powerful until Starship.",
    boosters: false,
  },
  {
    id: "newglenn",
    name: "New Glenn",
    agency: "Blue Origin",
    year: 2025,
    h: 98,
    d: 7,
    pay: 45,
    thr: 17.1,
    active: true,
    color: "#3D9E7A",
    desc: "Blue Origin heavy-lifter. Partially reusable.",
    boosters: false,
  },
  {
    id: "falconhvy",
    name: "Falcon Heavy",
    agency: "SpaceX",
    year: 2018,
    h: 70,
    d: 12.2,
    pay: 63.8,
    thr: 22.8,
    active: true,
    color: "#8A7FCC",
    desc: "Three Falcon 9 cores. Launched a Tesla into space.",
    boosters: true,
  },
  {
    id: "falcon9",
    name: "Falcon 9",
    agency: "SpaceX",
    year: 2010,
    h: 70,
    d: 3.7,
    pay: 22.8,
    thr: 7.6,
    active: true,
    color: "#6B68B8",
    desc: "Most-flown rocket today. Pioneered booster reuse.",
    boosters: false,
  },
  {
    id: "ariane5",
    name: "Ariane 5",
    agency: "ESA",
    year: 1996,
    h: 52,
    d: 5.4,
    pay: 21,
    thr: 13.2,
    active: false,
    color: "#C0744A",
    desc: "Europe's workhorse for 27 years. Launched JWST.",
    boosters: true,
  },
  {
    id: "soyuz",
    name: "Soyuz-2",
    agency: "Roscosmos",
    year: 1966,
    h: 46,
    d: 2.95,
    pay: 7.1,
    thr: 4.1,
    active: true,
    color: "#C9A030",
    desc: "Most-launched rocket in history. 60+ years of flights.",
    boosters: false,
  },
];

export default function HomeScreen() {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(["starship", "saturnv", "falcon9"])
  );
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const toggleRocket = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        if (next.size < 6) next.add(id);
      }
      return next;
    });
  };

  const selectedRockets = ROCKETS.filter((r) => selected.has(r.id)).sort(
    (a, b) => b.h - a.h
  );

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.root, { paddingTop: topPad }]}>
      <StatusBar barStyle="light-content" backgroundColor="#080D1A" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Rocket Comparator</Text>
          <Text style={styles.subtitle}>
            Every rocket drawn to real scale — toggle to compare
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {ROCKETS.map((rocket) => {
            const isOn = selected.has(rocket.id);
            return (
              <TouchableOpacity
                key={rocket.id}
                onPress={() => toggleRocket(rocket.id)}
                activeOpacity={0.7}
                style={[
                  styles.chip,
                  {
                    borderColor: rocket.color,
                    backgroundColor: isOn ? rocket.color : "transparent",
                    opacity: isOn ? 1 : 0.4,
                  },
                ]}
              >
                <View
                  style={[
                    styles.chipDot,
                    {
                      backgroundColor: isOn
                        ? "rgba(255,255,255,0.8)"
                        : rocket.color,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.chipLabel,
                    { color: isOn ? "#FFFFFF" : rocket.color },
                  ]}
                >
                  {rocket.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.vizWrapper}>
          <RocketVisualization
            rockets={selectedRockets}
            width={screenWidth - 32}
          />
        </View>

        <View style={styles.stats}>
          {selectedRockets.map((r) => (
            <View
              key={r.id}
              style={[styles.card, { borderTopColor: r.color }]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardName}>{r.name}</Text>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardYear}>{r.year}</Text>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: r.active
                          ? "rgba(52,211,153,0.12)"
                          : "rgba(100,116,139,0.12)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        { color: r.active ? "#34D399" : "#64748B" },
                      ]}
                    >
                      {r.active ? "Active" : "Retired"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.grid}>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Height</Text>
                  <Text style={styles.gridVal}>
                    {r.h}
                    <Text style={styles.gridUnit}>m</Text>
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Payload LEO</Text>
                  <Text style={styles.gridVal}>
                    {r.pay}
                    <Text style={styles.gridUnit}>t</Text>
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Thrust</Text>
                  <Text style={styles.gridVal}>
                    {r.thr}
                    <Text style={styles.gridUnit}>MN</Text>
                  </Text>
                </View>
                <View style={styles.gridItem}>
                  <Text style={styles.gridLabel}>Agency</Text>
                  <Text style={[styles.gridVal, styles.gridValSmall]}>
                    {r.agency}
                  </Text>
                </View>
              </View>

              <Text style={styles.cardDesc}>{r.desc}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#080D1A",
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  header: {
    paddingTop: 12,
    gap: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    fontFamily: "Inter_400Regular",
  },
  chips: {
    flexDirection: "row",
    gap: 7,
    paddingRight: 16,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1.5,
  },
  chipDot: {
    width: 7,
    height: 7,
    borderRadius: 99,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: "500" as const,
    fontFamily: "Inter_500Medium",
  },
  vizWrapper: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#1e2535",
  },
  stats: {
    gap: 10,
  },
  card: {
    backgroundColor: "#0F1A2E",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#1e2535",
    borderTopWidth: 3,
    padding: 14,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardYear: {
    fontSize: 12,
    color: "#4B5563",
    fontFamily: "Inter_400Regular",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "500" as const,
    fontFamily: "Inter_500Medium",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  gridItem: {
    width: "47%",
    gap: 2,
  },
  gridLabel: {
    fontSize: 11,
    color: "#4B5563",
    fontFamily: "Inter_400Regular",
  },
  gridVal: {
    fontSize: 20,
    fontWeight: "500" as const,
    color: "#FFFFFF",
    fontFamily: "Inter_500Medium",
  },
  gridValSmall: {
    fontSize: 14,
  },
  gridUnit: {
    fontSize: 12,
    fontWeight: "400" as const,
    color: "#64748B",
    fontFamily: "Inter_400Regular",
  },
  cardDesc: {
    fontSize: 12,
    color: "#4B5563",
    lineHeight: 18,
    fontFamily: "Inter_400Regular",
  },
});
