import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

import { Card, SectionTitle, StatusPill } from '../components/ui';
import { fetchOverview } from '../services/api';
import { colors, radius, space, TYPOGRAPHY } from '../theme';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen({ onScanNow }) {
  const [data, setData] = useState(null);

  const load = useCallback(async () => {
    setData(await fetchOverview());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const score = data?.digital_safety_score ?? 82;

  const cards = [
    {
      icon: '🛡️',
      title: 'Image Shield',
      value: data?.image_shield?.status ?? 'Active',
      level: 'SAFE',
      note: data?.image_shield?.message ?? 'Your protected images are being monitored.',
    },
    {
      icon: '📡',
      title: 'Tracker Scan',
      value: data?.tracker_detection?.status ?? 'No unknown trackers detected',
      level: 'SAFE',
      note: `Last sweep ${data?.tracker_detection?.last_sweep ?? '2 minutes ago'}`,
    },
    {
      icon: '💬',
      title: 'Chat Safety',
      value: data?.chat_safety?.status ?? 'Low Risk',
      level: 'LOW',
      note: 'No coercive threads currently flagged.',
    },
    {
      icon: '🔐',
      title: 'Evidence Vault',
      value: `${data?.evidence_vault?.count ?? 7} items`,
      level: 'LOW',
      note: 'Protected items you have chosen to keep.',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.greeting}>{greeting()}</Text>
      <Text style={styles.title}>Your Digital Safety</Text>

      {data?.simulated && (
        <View style={styles.simBanner}>
          <Text style={styles.simText}>
            Demo data — the analysis service is not reachable from this device.
          </Text>
        </View>
      )}

      {/* Safety score */}
      <Card style={styles.scoreCard}>
        <View style={styles.scoreRow}>
          <View style={styles.ring}>
            <Text style={styles.scoreValue}>{score}</Text>
            <Text style={styles.scoreMax}>/100</Text>
          </View>
          <View style={styles.scoreBody}>
            <Text style={styles.scoreLabel}>Digital Safety Score</Text>
            <StatusPill label={data?.score_status ?? 'Protected'} level="SAFE" />
            <Text style={styles.scoreNote}>
              A summary of your protection posture, not a measurement of your risk.
            </Text>
          </View>
        </View>
      </Card>

      {/* Feature cards */}
      <SectionTitle>Protection status</SectionTitle>
      <View style={styles.grid}>
        {cards.map((card) => (
          <Card key={card.title} style={styles.featureCard}>
            <View style={styles.featureHead}>
              <Text style={styles.featureIcon}>{card.icon}</Text>
              <StatusPill label={card.level} level={card.level} />
            </View>
            <Text style={styles.featureTitle}>{card.title}</Text>
            <Text style={styles.featureValue} numberOfLines={2}>
              {card.value}
            </Text>
            <Text style={styles.featureNote} numberOfLines={2}>
              {card.note}
            </Text>
          </Card>
        ))}
      </View>

      {/* Primary action */}
      <TouchableOpacity style={styles.cta} onPress={onScanNow} accessibilityRole="button">
        <Text style={styles.ctaText}>Scan Now</Text>
        <Text style={styles.ctaSub}>Nearby Bluetooth tracker scan</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>
        Digital safety is physical safety. NIRAKSHAN does not replace police, emergency services, or
        professional support.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: space(5), paddingBottom: space(10), gap: space(3) },

  greeting: { ...TYPOGRAPHY.body, color: colors.muted },
  title: { ...TYPOGRAPHY.display, marginTop: -2, marginBottom: space(1) },

  simBanner: {
    borderWidth: 1,
    borderColor: `${colors.warn}55`,
    backgroundColor: `${colors.warn}14`,
    borderRadius: radius.md,
    padding: 10,
  },
  simText: { ...TYPOGRAPHY.small, color: colors.warn },

  scoreCard: { marginTop: space(1) },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: space(4) },
  ring: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 5,
    borderColor: colors.ok,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  scoreValue: { fontSize: 26, fontWeight: '800', color: colors.text },
  scoreMax: { fontSize: 10, color: colors.faint, marginTop: -2 },
  scoreBody: { flex: 1, gap: 6 },
  scoreLabel: { ...TYPOGRAPHY.micro },
  scoreNote: { ...TYPOGRAPHY.small, fontSize: 11 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space(3) },
  featureCard: { width: '48%', flexGrow: 1, padding: 13, gap: 5 },
  featureHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  featureIcon: { fontSize: 20 },
  featureTitle: { ...TYPOGRAPHY.micro, color: colors.muted },
  featureValue: { ...TYPOGRAPHY.title, fontSize: 14 },
  featureNote: { ...TYPOGRAPHY.small, fontSize: 11 },

  cta: {
    marginTop: space(2),
    backgroundColor: colors.accentDeep,
    borderRadius: radius.lg,
    paddingVertical: space(4),
    alignItems: 'center',
  },
  ctaText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  ctaSub: { color: '#BAE6FD', fontSize: 11, marginTop: 2 },

  footer: {
    ...TYPOGRAPHY.small,
    fontSize: 11,
    textAlign: 'center',
    marginTop: space(2),
    color: colors.faint,
  },
});
