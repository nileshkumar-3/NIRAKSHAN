import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, StyleSheet } from 'react-native';

import { Card, SectionTitle, StatusPill } from '../components/ui';
import { fetchEvidence, deleteEvidence } from '../services/api';
import { colors, radius, space, TYPOGRAPHY } from '../theme';

const TYPE_ICON = {
  Screenshot: '🖼️',
  Image: '🖼️',
  Conversation: '💬',
  Alert: '🔔',
  Report: '📄',
};

export default function EvidenceScreen() {
  const [data, setData] = useState(null);
  const [items, setItems] = useState([]);

  const load = useCallback(async () => {
    const res = await fetchEvidence();
    setData(res);
    setItems(res.items);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = (item) => {
    Alert.alert('Delete this item?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteEvidence(item.id);
          setItems((prev) => prev.filter((i) => i.id !== item.id));
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Evidence Vault</Text>
      <Text style={styles.subtitle}>
        Records you have chosen to keep, each with a timestamp and a verification ID so you can show
        what it was and when it was captured.
      </Text>

      {data?.simulated && (
        <View style={styles.simBanner}>
          <Text style={styles.simText}>
            Demo records — the analysis service is not reachable on this device.
          </Text>
        </View>
      )}

      <SectionTitle right={`${items.length} items`}>Your records</SectionTitle>

      <View style={styles.list}>
        {items.map((item) => (
          <Card key={item.id} style={styles.card}>
            <View style={styles.head}>
              <Text style={styles.icon}>{TYPE_ICON[item.type] || '📄'}</Text>
              <View style={styles.headText}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.meta}>
                  {item.type} · {item.date}
                </Text>
              </View>
            </View>

            <View style={styles.tags}>
              <StatusPill label={item.risk_level} level={item.risk_level} />
              <View style={styles.tag}>
                <Text style={styles.tagText}>{item.status}</Text>
              </View>
            </View>

            <Text style={styles.verId}>{item.verification_id}</Text>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => remove(item)}
              accessibilityRole="button"
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </Card>
        ))}
      </View>

      <Card style={styles.noteCard}>
        <Text style={styles.noteTitle}>About reports</Text>
        <Text style={styles.noteBody}>
          A record here helps you describe what happened and when. It is not automatically a
          legally admissible document, and NIRAKSHAN does not submit anything on your behalf. Share
          it with a lawyer, a platform, or law enforcement through their own process.
        </Text>
      </Card>
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
  icon: { fontSize: 19 },
  itemTitle: { ...TYPOGRAPHY.title, fontSize: 15 },
  meta: { ...TYPOGRAPHY.small, fontSize: 11, marginTop: 1 },

  tags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tag: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
    justifyContent: 'center',
  },
  tagText: { fontSize: 11, fontWeight: '700', color: colors.muted },

  verId: { fontSize: 10, color: colors.faint, fontFamily: 'monospace' },

  deleteBtn: { alignSelf: 'flex-start', paddingVertical: 4 },
  deleteText: { color: colors.danger, fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' },

  noteCard: { marginTop: space(2), gap: 6 },
  noteTitle: { ...TYPOGRAPHY.micro, color: colors.warn },
  noteBody: { ...TYPOGRAPHY.small, fontSize: 12 },
});
