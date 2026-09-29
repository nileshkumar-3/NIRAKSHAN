import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, TYPOGRAPHY, riskColor } from '../theme';

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ children, right }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{children}</Text>
      {right ? <Text style={styles.sectionRight}>{right}</Text> : null}
    </View>
  );
}

/** Small status chip. `level` drives the colour via the shared risk palette. */
export function StatusPill({ label, level }) {
  const tint = riskColor(level);
  return (
    <View style={[styles.pill, { borderColor: `${tint}66`, backgroundColor: `${tint}1f` }]}>
      <View style={[styles.dot, { backgroundColor: tint }]} />
      <Text style={[styles.pillText, { color: tint }]}>{label}</Text>
    </View>
  );
}

/** Row used across Home / Alerts / Evidence: icon, title, subtitle, trailing. */
export function ListRow({ icon, title, subtitle, trailing, onPress }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Text style={styles.rowIconText}>{icon}</Text>
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.rowSubtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing || null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 16,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: TYPOGRAPHY.micro,
  sectionRight: { ...TYPOGRAPHY.micro, color: colors.accent },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  pillText: { fontSize: 11, fontWeight: '700' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.line,
  },
  rowIconText: { fontSize: 17 },
  rowBody: { flex: 1, minWidth: 0 },
  rowTitle: { ...TYPOGRAPHY.title, fontSize: 15 },
  rowSubtitle: { ...TYPOGRAPHY.small, marginTop: 2 },
});
