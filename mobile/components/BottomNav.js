import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, space } from '../theme';

export const TABS = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'scan', label: 'Scan', icon: '📡' },
  { key: 'alerts', label: 'Alerts', icon: '🔔' },
  { key: 'evidence', label: 'Evidence', icon: '🔐' },
  { key: 'profile', label: 'Profile', icon: '👤' },
];

export default function BottomNav({ active, onChange, alertCount = 0 }) {
  return (
    <View style={styles.bar} accessibilityRole="tablist">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <TouchableOpacity
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
            onPress={() => onChange(tab.key)}
            style={styles.tab}
          >
            <View>
              <Text style={[styles.icon, !isActive && styles.iconDim]}>{tab.icon}</Text>
              {tab.key === 'alerts' && alertCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{alertCount > 9 ? '9+' : alertCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.bg,
    paddingTop: space(2),
    paddingBottom: space(2),
  },
  tab: { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 2 },
  icon: { fontSize: 19 },
  iconDim: { opacity: 0.45 },
  label: { fontSize: 10, color: colors.faint, fontWeight: '600' },
  labelActive: { color: colors.accent, fontWeight: '800' },
  badge: {
    position: 'absolute',
    top: -3,
    right: -9,
    minWidth: 15,
    height: 15,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
});
