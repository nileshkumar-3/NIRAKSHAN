import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Linking, TouchableOpacity, StyleSheet } from 'react-native';

import { Card, SectionTitle, StatusPill } from '../components/ui';
import { fetchAlerts } from '../services/api';
import { colors, radius, space, TYPOGRAPHY, riskColor } from '../theme';

const ICON = { HIGH: '🔴', WARNING: '🟠', MEDIUM: '🟡', LOW: '🟢' };

export default function AlertsScreen({ onCountChange }) {
  const [data, setData] = useState(null);

  const load = useCallback(async () => {
    const res = await fetchAlerts();
    setData(res);
    onCountChange?.(res.alerts.length);
  }, [onCountChange]);

  useEffect(() => {
    load();
  }, [load]);

  const alerts = data?.alerts || [];

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Safety Alerts</Text>
      <Text style={styles.subtitle}>
        Each alert records what was observed and what you can do next. The decision is always yours.
      </Text>

      {data?.simulated && (
        <View style={styles.simBanner}>
          <Text style={styles.simText}>Demo alerts — the analysis service is not reachable.</Text>
        </View>
      )}

      <SectionTitle right={`${alerts.length} total`}>Recent</SectionTitle>

      <View style={styles.list}>
        {alerts.map((alert) => {
          const tint = riskColor(alert.risk_level);
          return (
            <Card key={alert.id} style={styles.card}>
              <View style={styles.head}>
                <Text style={styles.icon}>{ICON[alert.risk_level] || '🔵'}</Text>
                <View style={styles.headText}>
                  <Text style={styles.alertTitle}>{alert.title}</Text>
                  <Text style={styles.meta}>
                    {alert.type} · {alert.timestamp}
                  </Text>
                </View>
                <StatusPill label={alert.risk_level} level={alert.risk_level} />
              </View>

              <Text style={styles.desc}>{alert.description}</Text>

              <View style={[styles.step, { borderColor: `${tint}44` }]}>
                <Text style={[styles.stepLabel, { color: tint }]}>Recommended next step</Text>
                <Text style={styles.stepText}>{alert.recommended_step}</Text>
              </View>
            </Card>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.help}
        onPress={() => Linking.openURL('https://cybercrime.gov.in/')}
        accessibilityRole="button"
      >
        <Text style={styles.helpText}>Open official reporting portal</Text>
        <Text style={styles.helpNote}>
          NIRAKSHAN never files a report for you. Reviewing and sending it stays with you.
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: space(5), paddingBottom: space(10), gap: space(3) },
  title: TYPOGRAPHY.display,
  subtitle: TYPOGRAPHY.small,

  simBanner: {
    borderWidth: 1,
    borderColor: `${colors.warn}55`,
    backgroundColor: `${colors.warn}14`,
    borderRadius: radius.md,
    padding: 10,
  },
  simText: { ...TYPOGRAPHY.small, color: colors.warn },

  list: { gap: space(2) },
  card: { gap: 8 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headText: { flex: 1, minWidth: 0 },
  icon: { fontSize: 15 },
  alertTitle: { ...TYPOGRAPHY.title, fontSize: 15 },
  meta: { ...TYPOGRAPHY.small, fontSize: 11, marginTop: 1 },
  desc: TYPOGRAPHY.body,

  step: { borderWidth: 1, borderRadius: radius.sm, padding: 10, gap: 3 },
  stepLabel: { ...TYPOGRAPHY.micro, fontSize: 10 },
  stepText: { ...TYPOGRAPHY.small, fontSize: 12 },

  help: {
    marginTop: space(2),
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    gap: 4,
  },
  helpText: { color: colors.accent, fontWeight: '800', fontSize: 13 },
  helpNote: { ...TYPOGRAPHY.small, fontSize: 11, color: colors.faint },
});
