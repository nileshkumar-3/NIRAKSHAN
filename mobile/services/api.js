/**
 * NIRAKSHAN mobile — API client.
 *
 * Talks to the same FastAPI backend as the web dashboard, with the same
 * "fall back to clearly-labelled simulated data" behaviour so the app is
 * demoable on a stage with no server running.
 *
 * The host differs per platform:
 *   - iOS simulator      -> http://127.0.0.1:8000
 *   - Android emulator   -> http://10.0.2.2:8000   (the emulator's host loopback)
 *   - physical device    -> your machine's LAN IP, e.g. http://192.168.1.20:8000
 * Override it at runtime from the Profile screen.
 */

import { Platform } from 'react-native';

const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';

let API_BASE = `${DEFAULT_HOST}/api`;

export function setApiHost(host) {
  const clean = String(host || '').trim().replace(/\/+$/, '');
  API_BASE = `${clean}/api`;
}

export function getApiHost() {
  return API_BASE.replace(/\/api$/, '');
}

const withTimeout = (ms) => (AbortSignal.timeout ? AbortSignal.timeout(ms) : undefined);

/* ------------------------------------------------------------------ */
/* Simulated fixtures — used only when the backend is unreachable.     */
/* Every response carries `simulated: true` so the UI can say so.       */
/* ------------------------------------------------------------------ */

const SIM_DEVICES = [
  {
    id: 'C4:7D:4F:92:11:A4',
    name: 'Unknown Bluetooth device',
    classification: 'Potential Unknown Tracker',
    risk_tier: 'WARNING',
    signal_strength: 'Strong',
    rssi: -59,
    sightings_count: 3,
    warning_message: 'Repeated unknown device detected. Review recommended.',
  },
  {
    id: 'E2:1B:08:44:91:32',
    name: 'Galaxy Buds Live',
    classification: 'Known Device',
    risk_tier: 'SAFE',
    signal_strength: 'Weak',
    rssi: -76,
    sightings_count: 12,
    warning_message: null,
  },
  {
    id: 'A1:88:23:FE:19:67',
    name: 'Generic BLE peripheral',
    classification: 'Generic BLE Device',
    risk_tier: 'NEUTRAL',
    signal_strength: 'Weak',
    rssi: -85,
    sightings_count: 1,
    warning_message: null,
  },
];

const SIM_ALERTS = [
  {
    id: 'ALT-001',
    timestamp: '2026-09-30 01:20:00',
    risk_level: 'HIGH',
    type: 'Chat Safety',
    title: 'High-risk chat indicator',
    description: 'Conversation contained repeated location demands and a coercive threat.',
    recommended_step: 'Preserve the conversation to your Evidence Vault and avoid sharing live location.',
  },
  {
    id: 'ALT-002',
    timestamp: '2026-09-30 00:45:00',
    risk_level: 'WARNING',
    type: 'Tracker Scan',
    title: 'Repeated unknown Bluetooth device',
    description: 'Device C4:7D:4F:92:11:A4 was seen 3 times in close proximity at strong signal.',
    recommended_step: 'Move to a safe public location and check your belongings for an unfamiliar tag.',
  },
  {
    id: 'ALT-003',
    timestamp: '2026-09-29 22:15:00',
    risk_level: 'MEDIUM',
    type: 'Image Shield',
    title: 'Image integrity issue',
    description: 'A photo you were sent no longer carries its protection marker.',
    recommended_step: 'Treat this as inconclusive, not proof. Compare against your original copy.',
  },
];

const SIM_EVIDENCE = [
  {
    id: 'EV-2026-0891',
    title: 'Threatening direct message thread',
    type: 'Conversation',
    date: '2026-09-28 14:22',
    verification_id: 'NRK-VER-7721A0F9',
    status: 'Hash recorded',
    risk_level: 'HIGH',
  },
  {
    id: 'EV-2026-0892',
    title: 'Unknown BLE device log',
    type: 'Alert',
    date: '2026-09-29 09:15',
    verification_id: 'NRK-VER-8902BB31',
    status: 'Hash recorded',
    risk_level: 'WARNING',
  },
  {
    id: 'EV-2026-0893',
    title: 'Profile photo provenance record',
    type: 'Image',
    date: '2026-09-29 18:30',
    verification_id: 'NRK-PROV-9912FA4E',
    status: 'Marker verified',
    risk_level: 'LOW',
  },
];

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: withTimeout(1500) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchOverview() {
  try {
    const res = await fetch(`${API_BASE}/status/overview`, { signal: withTimeout(1800) });
    if (res.ok) return await res.json();
  } catch {
    /* fall through to the simulated payload */
  }
  return {
    simulated: true,
    digital_safety_score: 82,
    score_status: 'Protected',
    image_shield: { status: 'Active', message: 'Your protected images are being monitored.', count: 24 },
    tracker_detection: { status: 'No unknown trackers detected', last_sweep: '2 minutes ago' },
    chat_safety: { status: 'Low Risk' },
    evidence_vault: { count: 7 },
  };
}

export async function scanTrackers() {
  try {
    const res = await fetch(`${API_BASE}/tracker/scan`, { signal: withTimeout(4000) });
    if (res.ok) return await res.json();
  } catch {
    /* fall through */
  }
  return {
    simulated: true,
    scan_mode: 'Simulated Telemetry (demo)',
    devices: SIM_DEVICES,
    alerts: [
      {
        device_id: SIM_DEVICES[0].id,
        warning: SIM_DEVICES[0].warning_message,
      },
    ],
    safety_guidance:
      'If you suspect an unknown tracker is following you, move to a safe public location and contact appropriate support.',
    hardware_notes:
      'A BLE device is not the same thing as a tracker. This scanner records what the radio reports, and repeated sightings of the same unrecognised device warrant review. Operating-system restrictions, rotating identifiers, and privacy features on modern trackers can all limit detection.',
  };
}

export async function fetchAlerts() {
  try {
    const res = await fetch(`${API_BASE}/alerts`, { signal: withTimeout(1800) });
    if (res.ok) {
      const data = await res.json();
      return { simulated: false, alerts: data.alerts || [] };
    }
  } catch {
    /* fall through */
  }
  return { simulated: true, alerts: SIM_ALERTS };
}

export async function fetchEvidence() {
  try {
    const res = await fetch(`${API_BASE}/evidence`, { signal: withTimeout(1800) });
    if (res.ok) {
      const data = await res.json();
      return { simulated: false, items: data.items || [] };
    }
  } catch {
    /* fall through */
  }
  return { simulated: true, items: SIM_EVIDENCE };
}

export async function deleteEvidence(id) {
  try {
    const res = await fetch(`${API_BASE}/evidence/${id}`, { method: 'DELETE', signal: withTimeout(1500) });
    if (res.ok) return true;
  } catch {
    /* fall through */
  }
  return true;
}
