import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Linking, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';

import { Card, SectionTitle } from '../components/ui';
import { checkHealth, getApiHost, setApiHost } from '../services/api';
import { colors, radius, space, TYPOGRAPHY } from '../theme';

const REGIONS = [
  { code: 'IN', name: 'India', emergency: '112', cybercrime: '1930', support: '1091' },
  { code: 'US', name: 'United States', emergency: '911', cybercrime: 'IC3.gov', support: '1-800-799-7233' },
  { code: 'GB', name: 'United Kingdom', emergency: '999', cybercrime: 'Action Fraud', support: '0808 2000 247' },
  { code: 'AU', name: 'Australia', emergency: '000', cybercrime: 'ReportCyber', support: '1800 737 732' },
];

const PERMISSIONS = [
  { label: 'Location', value: 'OFF', level: 'off' },
  { label: 'Bluetooth', value: 'Permission required', level: 'ask' },
  { label: 'Camera', value: 'Permission required', level: 'ask' },
  { label: 'Microphone', value: 'OFF', level: 'off' },
  { label: 'Chat analysis', value: 'User initiated', level: 'user' },
];

const TINT = { off: colors.faint, ask: colors.warn, user: colors.accent };

export default function ProfileScreen() {
  const [region, setRegion] = useState(REGIONS[0]);
  const [online, setOnline] = useState(null);
  const [host, setHost] = useState(getApiHost());
  const [hostDraft, setHostDraft] = useState(getApiHost());

  const check = useCallback(async () => {
    setOnline(null);
    setOnline(await checkHealth());
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  const saveHost = () => {
    setApiHost(hostDraft);
    setHost(hostDraft.trim().replace(/\/+$/, ''));
    check();
  };

  const cycleRegion = () => {
    setRegion(REGIONS[(REGIONS.indexOf(region) + 1) % REGIONS.length]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Your region, your permissions, and your data.</Text>

      <SectionTitle>Get help</SectionTitle>
      <Card style={styles.card}>
        <TouchableOpacity style={styles.regionRow} onPress={cycleRegion} accessibilityRole="button">
          <Text style={styles.regionLabel}>Your region</Text>
          <Text style={styles.regionValue}>{region.name} › (tap to change)</Text>
        </TouchableOpacity>

        <View style={styles.helpline}>
          <Text style={styles.helplineLabel}>Emergency services</Text>
          <Text style={styles.helplineValue}>{region.emergency}</Text>
        </View>
        <View style={styles.helpline}>
          <Text style={styles.helplineLabel}>Cybercrime reporting</Text>
          <Text style={styles.helplineValue}>{region.cybercrime}</Text>
        </View>
        <View style={styles.helpline}>
          <Text style={styles.helplineLabel}>Women’s support</Text>
          <Text style={styles.helplineValue}>{region.support}</Text>
        </View>

        <TouchableOpacity
          style={styles.sos}
          onPress={() => Linking.openURL(`tel:${region.emergency}`)}
          accessibilityRole="button"
        >
          <Text style={styles.sosText}>Call {region.emergency}</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          NIRAKSHAN is a prevention and awareness tool. It does not dispatch anyone, and it does
          not replace emergency services, police, or professional support.
        </Text>
      </Card>

      <SectionTitle>Privacy center</SectionTitle>
      <Card style={styles.card}>
        {PERMISSIONS.map((p) => (
          <View key={p.label} style={styles.permRow}>
            <Text style={styles.permLabel}>{p.label}</Text>
            <Text style={[styles.permValue, { color: TINT[p.level] }]}>{p.value}</Text>
          </View>
        ))}

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.dangerBtn}
          onPress={() =>
            Alert.alert('Delete all data?', 'This removes every local analysis record and evidence item.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete everything', style: 'destructive', onPress: () => {} },
            ])
          }
          accessibilityRole="button"
        >
          <Text style={styles.dangerText}>Delete all data</Text>
        </TouchableOpacity>

        <Text style={styles.privacyNote}>Your safety data should remain under your control.</Text>
      </Card>

      <SectionTitle>Analysis service</SectionTitle>
      <Card style={styles.card}>
        <View style={styles.permRow}>
          <Text style={styles.permLabel}>Status</Text>
          <Text
            style={[
              styles.permValue,
              { color: online === true ? colors.ok : online === false ? colors.warn : colors.faint },
            ]}
          >
            {online === true ? 'Connected' : online === false ? 'Offline (demo mode)' : 'Checking…'}
          </Text>
        </View>

        <TextInput
          style={styles.input}
          value={hostDraft}
          onChangeText={setHostDraft}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="http://192.168.1.20:8000"
          placeholderTextColor={colors.faint}
        />
        <TouchableOpacity style={styles.saveBtn} onPress={saveHost} accessibilityRole="button">
          <Text style={styles.saveText}>Save and test ({host})</Text>
        </TouchableOpacity>
      </Card>

      <Text style={styles.footer}>NIRAKSHAN · Digital safety is physical safety.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: space(5), paddingBottom: space(10), gap: space(3) },
  title: TYPOGRAPHY.display,
  subtitle: TYPOGRAPHY.small,

  card: { gap: 10 },
  regionRow: { gap: 2 },
  regionLabel: { ...TYPOGRAPHY.micro },
  regionValue: { ...TYPOGRAPHY.title, fontSize: 15 },

  helpline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  helplineLabel: { ...TYPOGRAPHY.small, fontSize: 12 },
  helplineValue: { ...TYPOGRAPHY.small, fontSize: 12, color: colors.text, fontWeight: '700' },

  sos: {
    marginTop: space(2),
    backgroundColor: colors.danger,
    borderRadius: radius.md,
    paddingVertical: space(3.5),
    alignItems: 'center',
  },
  sosText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  disclaimer: { ...TYPOGRAPHY.small, fontSize: 11, color: colors.faint },

  permRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  permLabel: { ...TYPOGRAPHY.body, fontSize: 13, color: colors.text },
  permValue: { fontSize: 12, fontWeight: '700' },

  divider: { height: 1, backgroundColor: colors.lineSoft, marginVertical: space(1) },

  dangerBtn: { alignSelf: 'flex-start', paddingVertical: 4 },
  dangerText: { color: colors.danger, fontSize: 13, fontWeight: '700', textDecorationLine: 'underline' },
  privacyNote: { ...TYPOGRAPHY.small, fontSize: 11, color: colors.faint, fontStyle: 'italic' },

  input: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.sm,
    paddingHorizontal: 11,
    paddingVertical: 9,
    color: colors.text,
    fontSize: 12,
  },
  saveBtn: { alignSelf: 'flex-start' },
  saveText: { color: colors.accent, fontSize: 12, fontWeight: '700' },

  footer: {
    ...TYPOGRAPHY.small,
    fontSize: 11,
    textAlign: 'center',
    color: colors.faint,
    marginTop: space(2),
  },
});
