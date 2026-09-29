import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Easing, StyleSheet } from 'react-native';

import { Card, SectionTitle, StatusPill } from '../components/ui';
import { scanTrackers } from '../services/api';
import { colors, radius, space, TYPOGRAPHY, riskColor } from '../theme';

export default function ScanScreen() {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const pulse = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);

  useEffect(() => {
    if (!scanning) {
      pulse.stopAnimation();
      pulse.setValue(0);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [scanning, pulse]);

  const stop = useCallback(() => {
    setScanning(false);
    if (timer.current) clearInterval(timer.current);
  }, []);

  const start = useCallback(async () => {
    setScanning(true);
    setProgress(0);
    setResult(null);
    setExpanded(null);

    timer.current = setInterval(() => {
      setProgress((p) => (p >= 100 ? p : p + 20));
    }, 350);

    const data = await scanTrackers();
    setResult(data);
    setProgress(100);
    setScanning(false);
    if (timer.current) clearInterval(timer.current);
  }, []);

  useEffect(() => stop, [stop]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.35] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] });
  const devices = result?.devices || [];

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Nearby Tracker Scan</Text>
      <Text style={styles.subtitle}>
        Records what your phone's Bluetooth radio reports, then highlights devices you have seen
        more than once.
      </Text>

      <View style={styles.radarWrap}>
        <Animated.View style={[styles.pulse, { transform: [{ scale }], opacity }]} />
        <View style={styles.radar}>
          <Text style={styles.radarValue}>{scanning ? `${progress}%` : devices.length || '—'}</Text>
          <Text style={styles.radarLabel}>{scanning ? 'Scanning' : 'BLE devices'}</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={start}
          disabled={scanning}
          accessibilityRole="button"
        >
          <Text style={styles.btnPrimaryText}>{scanning ? 'Scanning…' : 'Start scan'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnGhost]}
          onPress={stop}
          disabled={!scanning}
          accessibilityRole="button"
        >
          <Text style={styles.btnGhostText}>Stop scan</Text>
        </TouchableOpacity>
      </View>

      {result?.simulated && (
        <View style={styles.simBanner}>
          <Text style={styles.simText}>
            Simulated telemetry — no Bluetooth radio was read on this device.
          </Text>
        </View>
      )}

      {devices.length > 0 && (
        <>
          <SectionTitle right={`${devices.length} found`}>Detected devices</SectionTitle>
          <View style={styles.list}>
            {devices.map((dev) => {
              const tint = riskColor(dev.risk_tier);
              const open = expanded === dev.id;
              return (
                <Card key={dev.id} style={styles.deviceCard}>
                  <View style={styles.deviceHead}>
                    <View style={styles.deviceInfo}>
                      <Text style={styles.deviceId}>{dev.id}</Text>
                      <Text style={styles.deviceName}>{dev.name}</Text>
                    </View>
                    <StatusPill label={dev.risk_tier} level={dev.risk_tier} />
                  </View>

                  <Text style={styles.meta}>
                    {dev.classification} · Signal {dev.signal_strength} ({dev.rssi} dBm) · Seen{' '}
                    {dev.sightings_count}x
                  </Text>

                  {dev.warning_message && (
                    <View style={[styles.warnBox, { borderColor: `${tint}55` }]}>
                      <Text style={[styles.warnText, { color: tint }]}>
                        “{dev.warning_message}”
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.detailsBtn}
                    onPress={() => setExpanded(open ? null : dev.id)}
                    accessibilityRole="button"
                  >
                    <Text style={styles.detailsText}>{open ? 'Hide details' : 'View details'}</Text>
                  </TouchableOpacity>

                  {open && (
                    <View style={styles.detailsBox}>
                      <DetailRow label="Classification" value={dev.classification} />
                      <DetailRow
                        label="Signal strength"
                        value={`${dev.signal_strength} (${dev.rssi} dBm)`}
                      />
                      <DetailRow label="Times seen" value={String(dev.sightings_count)} />
                      <Text style={styles.detailsNote}>
                        A nearby Bluetooth device is not automatically a tracker. This entry is
                        flagged only because the same unrecognised identifier kept appearing.
                      </Text>
                    </View>
                  )}
                </Card>
              );
            })}
          </View>
        </>
      )}

      <SectionTitle>If you are worried</SectionTitle>
      <Card style={styles.safetyCard}>
        <Text style={styles.safetyText}>{result?.safety_guidance}</Text>
        <Text style={styles.legalNote}>{result?.hardware_notes}</Text>
      </Card>
    </ScrollView>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: space(5), paddingBottom: space(10), gap: space(3) },
  title: TYPOGRAPHY.display,
  subtitle: TYPOGRAPHY.small,

  radarWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: space(4) },
  pulse: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: colors.accent,
  },
  radar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: `${colors.accent}66`,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarValue: { fontSize: 30, fontWeight: '800', color: colors.text },
  radarLabel: { ...TYPOGRAPHY.micro, marginTop: 2 },

  controls: { flexDirection: 'row', gap: space(2) },
  btn: { flex: 1, borderRadius: radius.md, paddingVertical: space(3.5), alignItems: 'center' },
  btnPrimary: { backgroundColor: colors.accentDeep },
  btnPrimaryText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  btnGhost: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.line },
  btnGhostText: { color: colors.text, fontWeight: '700', fontSize: 14 },

  simBanner: {
    borderWidth: 1,
    borderColor: `${colors.warn}55`,
    backgroundColor: `${colors.warn}14`,
    borderRadius: radius.md,
    padding: 10,
  },
  simText: { ...TYPOGRAPHY.small, color: colors.warn },

  list: { gap: space(2) },
  deviceCard: { gap: 8 },
  deviceHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  deviceInfo: { flex: 1, minWidth: 0 },
  deviceId: { fontSize: 12, fontWeight: '700', color: colors.text },
  deviceName: { ...TYPOGRAPHY.small, fontSize: 12, marginTop: 1 },
  meta: { ...TYPOGRAPHY.small, fontSize: 11 },

  warnBox: { borderWidth: 1, borderRadius: radius.sm, padding: 9 },
  warnText: { fontSize: 12, lineHeight: 17 },

  detailsBtn: { alignSelf: 'flex-start', paddingVertical: 4 },
  detailsText: { color: colors.accent, fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' },
  detailsBox: { gap: 6, borderTopWidth: 1, borderTopColor: colors.lineSoft, paddingTop: 10 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { ...TYPOGRAPHY.small, fontSize: 11 },
  detailValue: { ...TYPOGRAPHY.small, fontSize: 11, color: colors.text, fontWeight: '600' },
  detailsNote: { ...TYPOGRAPHY.small, fontSize: 11, color: colors.faint, marginTop: 2 },

  safetyCard: { gap: 8 },
  safetyText: { ...TYPOGRAPHY.body, color: colors.text },
  legalNote: { ...TYPOGRAPHY.small, fontSize: 11, color: colors.faint },
});
