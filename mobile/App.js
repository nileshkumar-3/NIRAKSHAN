import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, View, StyleSheet } from 'react-native';

import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import AlertsScreen from './screens/AlertsScreen';
import EvidenceScreen from './screens/EvidenceScreen';
import ProfileScreen from './screens/ProfileScreen';
import { colors } from './theme';

/**
 * NIRAKSHAN mobile shell.
 *
 * Navigation is a simple tab switch rather than a router: the app has exactly
 * five destinations and keeping it dependency-free means `npm install` only
 * pulls Expo itself.
 */
export default function App() {
  const [tab, setTab] = useState('home');
  const [alertCount, setAlertCount] = useState(0);

  const goToScan = useCallback(() => setTab('scan'), []);

  useEffect(() => {
    setAlertCount(3); // refreshed by the Alerts screen once it loads
  }, [tab]);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={styles.body}>
        {tab === 'home' && <HomeScreen onScanNow={goToScan} />}
        {tab === 'scan' && <ScanScreen />}
        {tab === 'alerts' && <AlertsScreen onCountChange={setAlertCount} />}
        {tab === 'evidence' && <EvidenceScreen />}
        {tab === 'profile' && <ProfileScreen />}
      </View>
      <BottomNav active={tab} onChange={setTab} alertCount={alertCount} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1 },
});
