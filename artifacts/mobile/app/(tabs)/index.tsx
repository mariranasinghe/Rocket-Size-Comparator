import React, { useRef, useState } from "react";
import {
  Animated,
  LayoutAnimation,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RocketVisualization } from "@/components/RocketVisualization";
import type { RocketData } from "@/components/RocketVisualization";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
    launches: 8,
    costPerKg: 100,
    engines: 39,
    reusable: true,
    missions: ["Artemis Moon landing (planned)", "Mars cargo missions (planned)", "Point-to-point Earth travel"],
    funFact: "Uses 33 Raptor engines on its booster alone — more than any rocket ever built.",
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
    launches: 13,
    costPerKg: 25000,
    engines: 11,
    reusable: false,
    missions: ["Apollo 11 — first Moon landing", "Apollo 13 — safe crew return", "Skylab space station deployment"],
    funFact: "So loud at launch it melted asphalt 1 km away and could be heard 160 km distant.",
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
    launches: 2,
    costPerKg: 6000,
    engines: 7,
    reusable: true,
    missions: ["BE-4 engine pathfinder mission", "NASA ESCAPADE Mars orbiter (2026)", "Commercial GEO satellite delivery"],
    funFact: "Its payload fairing is large enough to fit an entire school bus inside.",
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
    launches: 11,
    costPerKg: 1700,
    engines: 27,
    reusable: true,
    missions: ["Elon Musk's Tesla Roadster to Mars orbit", "USSF-44 national security payload", "Psyche asteroid mission (NASA)"],
    funFact: "The two side boosters return and land simultaneously, just 400m apart — one of rocketry's most dramatic scenes.",
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
    launches: 400,
    costPerKg: 2720,
    engines: 9,
    reusable: true,
    missions: ["Crew Dragon crewed ISS missions", "DART asteroid deflection test", "Starlink internet constellation"],
    funFact: "One booster has been flown 25+ times — like an airliner for orbit.",
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
    launches: 117,
    costPerKg: 10200,
    engines: 3,
    reusable: false,
    missions: ["James Webb Space Telescope", "Herschel & Planck observatories", "Rosetta comet probe"],
    funFact: "Achieved 82 consecutive successful launches — a record unmatched by any heavy-lift rocket.",
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
    launches: 1900,
    costPerKg: 8200,
    engines: 20,
    reusable: false,
    missions: ["ISS crew rotation flights", "GLONASS navigation satellites", "Crew transport for Gagarin era onward"],
    funFact: "Over 1,900 launches make it the most flown rocket design in all of history.",
  },
];

function formatCost(usdPerKg: number): string {
  if (usdPerKg >= 1000) return `$${(usdPerKg / 1000).toFixed(1)}k`;
  return `$${usdPerKg}`;
}

export default function HomeScreen() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["starship", "saturnv", "falcon9"]));
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [panelRocket, setPanelRocket] = useState<RocketData | null>(null);
  const panelAnim = useRef(new Animated.Value(0)).current;
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const selectedRockets = ROCKETS.filter((r) => selected.has(r.id)).sort((a, b) => b.h - a.h);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

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
    if (highlightedId === id) setHighlightedId(null);
    if (panelRocket?.id === id) hidePanel();
  };

  const showPanel = (rocket: RocketData) => {
    setPanelRocket(rocket);
    panelAnim.setValue(0);
    Animated.spring(panelAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 18,
      stiffness: 200,
    }).start();
  };

  const hidePanel = () => {
    Animated.timing(panelAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setPanelRocket(null);
      setHighlightedId(null);
    });
  };

  const handleRocketPress = (id: string) => {
    const rocket = ROCKETS.find((r) => r.id === id)!;
    if (highlightedId === id) {
      hidePanel();
    } else {
      setHighlightedId(id);
      showPanel(rocket);
    }
  };

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const maxH = Math.max(...selectedRockets.map((r) => r.h));
  const maxPay = Math.max(...selectedRockets.map((r) => r.pay));
  const maxThr = Math.max(...selectedRockets.map((r) => r.thr));

  return (
    <View style={[styles.root, { paddingTop: topPad }]}>
      <StatusBar barStyle="light-content" backgroundColor="#080D1A" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Rocket Comparator</Text>
          <Text style={styles.subtitle}>Every rocket drawn to real scale — tap any rocket to explore</Text>
        </View>

        {/* Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
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
                <View style={[styles.chipDot, { backgroundColor: isOn ? "rgba(255,255,255,0.8)" : rocket.color }]} />
                <Text style={[styles.chipLabel, { color: isOn ? "#FFFFFF" : rocket.color }]}>{rocket.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Visualization */}
        <View style={styles.vizWrapper}>
          <RocketVisualization
            rockets={selectedRockets}
            width={screenWidth - 32}
            highlightedId={highlightedId}
            onRocketPress={handleRocketPress}
          />
          {highlightedId === null && (
            <Text style={styles.tapHint}>Tap a rocket to learn more</Text>
          )}
        </View>

        {/* Quick Info Panel */}
        {panelRocket && (
          <Animated.View
            style={[
              styles.panel,
              { borderTopColor: panelRocket.color },
              {
                opacity: panelAnim,
                transform: [
                  {
                    translateY: panelAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [16, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.panelHeader}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View style={[styles.colorDot, { backgroundColor: panelRocket.color }]} />
                  <Text style={styles.panelName}>{panelRocket.name}</Text>
                </View>
                <Text style={styles.panelSub}>
                  {panelRocket.agency} · {panelRocket.year} ·{" "}
                  <Text style={{ color: panelRocket.active ? "#34D399" : "#64748B" }}>
                    {panelRocket.active ? "Active" : "Retired"}
                  </Text>
                </Text>
              </View>
              <TouchableOpacity onPress={hidePanel} style={styles.closeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.panelGrid}>
              {[
                { label: "Launches", value: panelRocket.launches >= 1000 ? `${panelRocket.launches}+` : `${panelRocket.launches}` },
                { label: "Cost / kg", value: formatCost(panelRocket.costPerKg) },
                { label: "Engines", value: `${panelRocket.engines}` },
                { label: "Reusable", value: panelRocket.reusable ? "Yes ✓" : "No" },
              ].map(({ label, value }) => (
                <View key={label} style={styles.panelStat}>
                  <Text style={styles.panelStatLabel}>{label}</Text>
                  <Text style={styles.panelStatVal}>{value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.panelDivider} />

            <Text style={styles.sectionLabel}>Notable Missions</Text>
            {panelRocket.missions.map((m) => (
              <View key={m} style={styles.missionRow}>
                <View style={[styles.missionDot, { backgroundColor: panelRocket.color }]} />
                <Text style={styles.missionText}>{m}</Text>
              </View>
            ))}

            <View style={[styles.funFactBox, { borderColor: `${panelRocket.color}55` }]}>
              <Text style={styles.funFactEmoji}>💡</Text>
              <Text style={styles.funFactText}>{panelRocket.funFact}</Text>
            </View>
          </Animated.View>
        )}

        {/* Comparison Bars */}
        {selectedRockets.length > 1 && (
          <View style={styles.compCard}>
            <Text style={styles.compTitle}>Side-by-Side Comparison</Text>
            {[
              { label: "Height", getVal: (r: RocketData) => r.h, max: maxH, unit: "m" },
              { label: "Payload to LEO", getVal: (r: RocketData) => r.pay, max: maxPay, unit: "t" },
              { label: "Thrust at liftoff", getVal: (r: RocketData) => r.thr, max: maxThr, unit: "MN" },
            ].map(({ label, getVal, max, unit }) => (
              <View key={label} style={styles.compMetric}>
                <Text style={styles.compMetricLabel}>{label}</Text>
                {selectedRockets.map((r) => {
                  const val = getVal(r);
                  const pct = val / max;
                  return (
                    <View key={r.id} style={styles.barRow}>
                      <Text style={styles.barName} numberOfLines={1}>{r.name.split(" ")[0]}</Text>
                      <View style={styles.barTrack}>
                        <View style={[styles.barFill, { width: `${pct * 100}%` as unknown as number, backgroundColor: r.color }]} />
                      </View>
                      <Text style={styles.barVal}>{val}{unit}</Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        )}

        {/* Stat Cards */}
        <View style={styles.stats}>
          {selectedRockets.map((r) => {
            const isExpanded = expandedIds.has(r.id);
            const isFocused = highlightedId === r.id;
            return (
              <TouchableOpacity
                key={r.id}
                onPress={() => toggleExpand(r.id)}
                activeOpacity={0.9}
                style={[
                  styles.card,
                  { borderTopColor: r.color },
                  isFocused && { borderColor: `${r.color}55` },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardName}>{r.name}</Text>
                  <View style={styles.cardMeta}>
                    <Text style={styles.cardYear}>{r.year}</Text>
                    <View style={[styles.badge, { backgroundColor: r.active ? "rgba(52,211,153,0.12)" : "rgba(100,116,139,0.12)" }]}>
                      <Text style={[styles.badgeText, { color: r.active ? "#34D399" : "#64748B" }]}>
                        {r.active ? "Active" : "Retired"}
                      </Text>
                    </View>
                    <Text style={styles.expandChevron}>{isExpanded ? "▲" : "▼"}</Text>
                  </View>
                </View>

                <View style={styles.grid}>
                  <View style={styles.gridItem}>
                    <Text style={styles.gridLabel}>Height</Text>
                    <Text style={styles.gridVal}>{r.h}<Text style={styles.gridUnit}>m</Text></Text>
                  </View>
                  <View style={styles.gridItem}>
                    <Text style={styles.gridLabel}>Payload LEO</Text>
                    <Text style={styles.gridVal}>{r.pay}<Text style={styles.gridUnit}>t</Text></Text>
                  </View>
                  <View style={styles.gridItem}>
                    <Text style={styles.gridLabel}>Thrust</Text>
                    <Text style={styles.gridVal}>{r.thr}<Text style={styles.gridUnit}>MN</Text></Text>
                  </View>
                  <View style={styles.gridItem}>
                    <Text style={styles.gridLabel}>Agency</Text>
                    <Text style={[styles.gridVal, styles.gridValSmall]}>{r.agency}</Text>
                  </View>
                </View>

                <Text style={styles.cardDesc}>{r.desc}</Text>

                {isExpanded && (
                  <View style={styles.expandedContent}>
                    <View style={styles.panelDivider} />
                    <View style={styles.extraGrid}>
                      {[
                        { label: "Total Launches", value: r.launches >= 1000 ? `${r.launches}+` : `${r.launches}` },
                        { label: "Cost / kg to LEO", value: formatCost(r.costPerKg) },
                        { label: "Engine Count", value: `${r.engines}` },
                        { label: "Reusable", value: r.reusable ? "Yes ✓" : "No" },
                      ].map(({ label, value }) => (
                        <View key={label} style={styles.extraItem}>
                          <Text style={styles.extraLabel}>{label}</Text>
                          <Text style={styles.extraVal}>{value}</Text>
                        </View>
                      ))}
                    </View>
                    <Text style={styles.sectionLabel}>Notable Missions</Text>
                    {r.missions.map((m) => (
                      <View key={m} style={styles.missionRow}>
                        <View style={[styles.missionDot, { backgroundColor: r.color }]} />
                        <Text style={styles.missionText}>{m}</Text>
                      </View>
                    ))}
                    <View style={[styles.funFactBox, { borderColor: `${r.color}55` }]}>
                      <Text style={styles.funFactEmoji}>💡</Text>
                      <Text style={styles.funFactText}>{r.funFact}</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#080D1A" },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 14 },
  header: { paddingTop: 12, gap: 3 },
  title: { fontSize: 22, fontWeight: "600" as const, color: "#FFFFFF" },
  subtitle: { fontSize: 13, color: "#64748B", lineHeight: 18 },
  chips: { flexDirection: "row", gap: 7, paddingRight: 16 },
  chip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, borderWidth: 1.5 },
  chipDot: { width: 7, height: 7, borderRadius: 99 },
  chipLabel: { fontSize: 12, fontWeight: "500" as const },
  vizWrapper: { borderRadius: 12, overflow: "hidden", borderWidth: 0.5, borderColor: "#1e2535" },
  tapHint: { position: "absolute", bottom: 8, left: 0, right: 0, textAlign: "center", fontSize: 10, color: "rgba(255,255,255,0.2)", fontFamily: "monospace" },

  // Quick info panel
  panel: {
    backgroundColor: "#0D1828",
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#1e2535",
    borderTopWidth: 3,
    padding: 16,
    gap: 12,
  },
  panelHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  colorDot: { width: 10, height: 10, borderRadius: 99, marginTop: 4 },
  panelName: { fontSize: 18, fontWeight: "700" as const, color: "#FFFFFF" },
  panelSub: { fontSize: 12, color: "#64748B", marginTop: 2 },
  closeBtn: { padding: 4 },
  closeText: { fontSize: 14, color: "#4B5563" },
  panelGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  panelStat: { width: "47%", backgroundColor: "#111D30", borderRadius: 10, padding: 10, gap: 2 },
  panelStatLabel: { fontSize: 11, color: "#4B5563" },
  panelStatVal: { fontSize: 17, fontWeight: "600" as const, color: "#FFFFFF" },
  panelDivider: { height: 0.5, backgroundColor: "#1e2535" },
  sectionLabel: { fontSize: 11, color: "#4B5563", fontWeight: "600" as const, textTransform: "uppercase" as const, letterSpacing: 0.8 },
  missionRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  missionDot: { width: 5, height: 5, borderRadius: 99, marginTop: 6, flexShrink: 0 },
  missionText: { fontSize: 13, color: "#94A3B8", lineHeight: 20, flex: 1 },
  funFactBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#111D30",
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
  },
  funFactEmoji: { fontSize: 14, marginTop: 1 },
  funFactText: { fontSize: 12, color: "#94A3B8", lineHeight: 18, flex: 1 },

  // Comparison bars
  compCard: {
    backgroundColor: "#0D1525",
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#1e2535",
    padding: 16,
    gap: 14,
  },
  compTitle: { fontSize: 14, fontWeight: "600" as const, color: "#FFFFFF" },
  compMetric: { gap: 6 },
  compMetricLabel: { fontSize: 11, color: "#4B5563", fontWeight: "600" as const, textTransform: "uppercase" as const, letterSpacing: 0.7 },
  barRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  barName: { width: 60, fontSize: 11, color: "#94A3B8", textAlign: "right" as const },
  barTrack: { flex: 1, height: 8, backgroundColor: "#111D30", borderRadius: 99, overflow: "hidden" as const },
  barFill: { height: "100%", borderRadius: 99 },
  barVal: { width: 44, fontSize: 11, color: "#64748B", textAlign: "right" as const },

  // Stat cards
  stats: { gap: 10 },
  card: {
    backgroundColor: "#0F1A2E",
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#1e2535",
    borderTopWidth: 3,
    padding: 14,
    gap: 10,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardName: { fontSize: 16, fontWeight: "600" as const, color: "#FFFFFF" },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardYear: { fontSize: 12, color: "#4B5563" },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  badgeText: { fontSize: 11, fontWeight: "500" as const },
  expandChevron: { fontSize: 10, color: "#4B5563" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  gridItem: { width: "47%", gap: 2 },
  gridLabel: { fontSize: 11, color: "#4B5563" },
  gridVal: { fontSize: 20, fontWeight: "500" as const, color: "#FFFFFF" },
  gridValSmall: { fontSize: 14 },
  gridUnit: { fontSize: 12, fontWeight: "400" as const, color: "#64748B" },
  cardDesc: { fontSize: 12, color: "#4B5563", lineHeight: 18 },

  // Expanded card content
  expandedContent: { gap: 10 },
  extraGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  extraItem: { width: "47%", backgroundColor: "#0A1220", borderRadius: 8, padding: 10, gap: 2 },
  extraLabel: { fontSize: 11, color: "#4B5563" },
  extraVal: { fontSize: 15, fontWeight: "600" as const, color: "#E2E8F0" },
});
