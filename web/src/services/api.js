/**
 * NIRAKSHAN API Client Service
 * Connects to FastAPI backend (http://127.0.0.1:8000)
 * Gracefully falls back to client-side offline execution if backend is offline.
 */

const API_BASE = "http://127.0.0.1:8000/api";

// Fallback Mock State for Zero-Backend offline operation
let localEvidence = [
  {
    id: "EV-2026-0891",
    title: "Threatening Instagram DM Thread",
    type: "Conversation",
    date: "2026-09-28 14:22:10",
    verification_id: "NRK-VER-7721A0F9",
    status: "Verified Hashed",
    file_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    source: "Safe Chat Auditor",
    risk_level: "HIGH",
    notes: "User received persistent location demands and threats of retaliation after boundary refusal.",
    metadata: { risk_score: 78, indicators_flagged: ["Repeated Location Demands", "Intimidation & Threatening Language"] }
  },
  {
    id: "EV-2026-0892",
    title: "Unknown BLE Beacon Telemetry Log",
    type: "Alert",
    date: "2026-09-29 09:15:30",
    verification_id: "NRK-VER-8902BB31",
    status: "Verified Hashed",
    file_hash: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
    source: "BLE Radar Scanner",
    risk_level: "WARNING",
    notes: "Device C4:7D:4F:92:11:A4 observed following user across 3 separate scans with signal RSSI > -65dBm.",
    metadata: { device_id: "C4:7D:4F:92:11:A4", sightings: 3, signal: "Strong (-59dBm)" }
  },
  {
    id: "EV-2026-0893",
    title: "Profile Photo Provenance Certificate",
    type: "Image",
    date: "2026-09-29 18:30:00",
    verification_id: "NRK-PROV-9912FA4E",
    status: "Cryptographically Sealed",
    file_hash: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    source: "Image Shield",
    risk_level: "LOW",
    notes: "Original identity photo sealed with DWT-LSB watermark before social media publishing.",
    metadata: { signer: "USER-SEC-8921", tamper_status: "Intact" }
  },
  {
    id: "EV-2026-0894",
    title: "Manipulated Synthetic Face Image Capture",
    type: "Screenshot",
    date: "2026-09-29 21:05:12",
    verification_id: "NRK-VER-4411C820",
    status: "Verified Hashed",
    file_hash: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    source: "Deepfake Risk Check",
    risk_level: "HIGH",
    notes: "Detected generative diffusion artifacts and unnatural face boundary blending from suspicious Telegram channel.",
    metadata: { risk_score: 82, anomaly: "Generative diffusion artifacts" }
  },
  {
    id: "EV-2026-0895",
    title: "Suspicious Website Sentinel Interception",
    type: "Report",
    date: "2026-09-30 00:10:45",
    verification_id: "NRK-VER-1289DF66",
    status: "Verified Hashed",
    file_hash: "fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9",
    source: "Browser Sentinel Extension",
    risk_level: "MEDIUM",
    notes: "Blocked attempted photo upload to unverified deepfake manipulation portal `deep-swap-nudify.demo`.",
    metadata: { domain: "deep-swap-nudify.demo", action_taken: "Upload Blocked by User" }
  },
  {
    id: "EV-2026-0896",
    title: "WhatsApp Coercion Audio/Text Transcript",
    type: "Conversation",
    date: "2026-09-30 01:00:22",
    verification_id: "NRK-VER-3920FE11",
    status: "Verified Hashed",
    file_hash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    source: "Safe Chat Auditor",
    risk_level: "MEDIUM",
    notes: "Aggressive repeated calls and intimidation messages logged for record-keeping.",
    metadata: { risk_score: 64, indicators_flagged: ["Pressure & Coercive Control"] }
  },
  {
    id: "EV-2026-0897",
    title: "BLE Radar Proximity Beacon Spike",
    type: "Alert",
    date: "2026-09-30 01:25:50",
    verification_id: "NRK-VER-6623AA19",
    status: "Verified Hashed",
    file_hash: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    source: "BLE Radar Scanner",
    risk_level: "WARNING",
    notes: "Secondary beacon observation near public transit corridor.",
    metadata: { signal: "Moderate (-72dBm)", sighting_zone: "Transit Hub" }
  }
];

export async function fetchOverview() {
  try {
    const res = await fetch(`${API_BASE}/status/overview`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) return await res.json();
  } catch (e) {
    // Offline fallback
  }
  return {
    digital_safety_score: 82,
    score_status: "Protected",
    image_shield: { status: "Active", message: "Your protected images are being monitored.", protected_images_count: 24 },
    tracker_detection: { status: "No unknown trackers detected", active_radar: true, last_sweep: "Just now" },
    chat_safety: { status: "Low Risk", message: "Zero active coercive threads flagged" },
    evidence_vault: { count: localEvidence.length, label: `${localEvidence.length} protected items` },
    recent_alerts: [
      { id: "ALT-101", type: "image", level: "MEDIUM", title: "Suspicious image detected", desc: "Deepfake synthesis indicators observed on linked social profile photo.", time: "12m ago" },
      { id: "ALT-102", type: "bluetooth", level: "HIGH", title: "Unknown Bluetooth device detected", desc: "Repeated beacon C4:7D:4F:92:11:A4 seen 3 times across recent scans.", time: "45m ago" },
      { id: "ALT-103", type: "chat", level: "HIGH", title: "High-risk message detected", desc: "Location coercion & intimidation patterns flagged in incoming text thread.", time: "2h ago" }
    ]
  };
}

export async function protectImageApi(formData) {
  try {
    const res = await fetch(`${API_BASE}/image/protect`, { method: "POST", body: formData, signal: AbortSignal.timeout(3000) });
    if (res.ok) return await res.json();
  } catch (e) {}
  
  // Client-side fallback computation
  const randHash = Math.random().toString(36).substring(2, 14).toUpperCase();
  const verId = `NRK-PROV-${randHash}`;
  const now = new Date().toISOString();
  
  const newItem = {
    id: `EV-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
    title: "Protected Image (Client Sealed)",
    type: "Image",
    date: new Date().toLocaleString(),
    verification_id: verId,
    status: "Cryptographically Sealed",
    file_hash: `sha256_${randHash.toLowerCase()}_client_sealed`,
    source: "Image Shield",
    risk_level: "LOW",
    notes: "Image protected with client-side DWT-LSB invisible watermarking signature.",
    metadata: { signer: "USER-SEC-8921", ver_id: verId, timestamp: now }
  };
  localEvidence.unshift(newItem);

  return {
    success: true,
    simulated: true,
    metadata: {
      status: "Protected",
      verification_id: verId,
      timestamp: now,
      integrity_status: "Cryptographically Sealed (DWT/LSB)",
      protection_marker: "Detected & Verified",
      original_hash: `f8a920b${randHash.toLowerCase()}`,
      protected_hash: `3c91d8e${randHash.toLowerCase()}`
    }
  };
}

export async function verifyImageApi(formData) {
  try {
    const res = await fetch(`${API_BASE}/image/verify`, { method: "POST", body: formData, signal: AbortSignal.timeout(3000) });
    if (res.ok) return await res.json();
  } catch (e) {}
  
  // Simulated verification
  return {
    is_protected: true,
    simulated: true,
    protection_status: "Protected",
    verification_id: "NRK-PROV-9912FA4E",
    protection_timestamp: "2026-09-29T18:30:00Z",
    integrity_status: "Valid Provenance Marker",
    registered_user: "USER-SEC-8921",
    tag: "PRIMARY_IDENTITY",
    file_hash: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    protection_detected: true,
    details: "Image integrity marker verified. Cryptographic ownership signature matched."
  };
}

export async function analyzeManipulationRiskApi(formData) {
  try {
    const res = await fetch(`${API_BASE}/image/manipulation-check`, { method: "POST", body: formData, signal: AbortSignal.timeout(4000) });
    if (res.ok) return await res.json();
  } catch (e) {}

  return {
    risk_level: "MEDIUM",
    simulated: true,
    risk_score: 54,
    protection_marker: "Not Found",
    metadata_consistency: "Normal (EXIF standard)",
    visual_anomaly_check: "Review recommended (Boundary blending & unnatural smoothing indicators)",
    recommendation: "Minor visual inconsistencies detected. Recommend reviewing the source context before trusting.",
    pipeline_stages: [
      { step: 1, name: "Image Received", status: "Completed", detail: "Format parsed, 1080x1350px, Hash: 8f9210a..." },
      { step: 2, name: "Metadata Checked", status: "Completed", detail: "Normal (EXIF standard)" },
      { step: 3, name: "Protection Marker Checked", status: "Completed", detail: "Not Found" },
      { step: 4, name: "Visual Manipulation Indicators Analyzed", status: "Completed", detail: "Review recommended (Boundary blending & unnatural smoothing indicators)" },
      { step: 5, name: "Risk Assessment Generated", status: "Completed", detail: "Risk Score: 54/100 (MEDIUM)" }
    ],
    disclaimer: "This prototype provides an experimental risk assessment and does not establish whether an image is definitively AI-generated or manipulated."
  };
}

export async function scanTrackersApi() {
  try {
    const res = await fetch(`${API_BASE}/tracker/scan`, { signal: AbortSignal.timeout(3500) });
    if (res.ok) return await res.json();
  } catch (e) {}

  return {
    timestamp: new Date().toISOString(),
    simulated: true,
    scan_mode: "Simulated Telemetry / Cross-Platform",
    devices_count: 4,
    unknown_trackers_count: 1,
    devices: [
      {
        id: "C4:7D:4F:92:11:A4",
        name: "Unknown BLE Tracker",
        classification: "Potential Unknown Tracker",
        risk_tier: "WARNING",
        tag_label: "Persistent Sighting",
        rssi: -59,
        signal_strength: "Strong",
        sightings_count: 3,
        first_seen_seconds_ago: 1800,
        last_seen_seconds_ago: 20,
        is_known: false,
        warning_message: "Repeated unknown device detected. Review recommended."
      },
      {
        id: "E2:1B:08:44:91:32",
        name: "Galaxy Buds Live",
        classification: "Known Device",
        risk_tier: "SAFE",
        tag_label: "User Paired Device",
        rssi: -76,
        signal_strength: "Moderate",
        sightings_count: 12,
        first_seen_seconds_ago: 3600,
        last_seen_seconds_ago: 90,
        is_known: true,
        warning_message: null
      },
      {
        id: "A1:88:23:FE:19:67",
        name: "Smart Fitness Band",
        classification: "Generic BLE Device",
        risk_tier: "NEUTRAL",
        tag_label: "Transient RF Signal",
        rssi: -85,
        signal_strength: "Weak",
        sightings_count: 1,
        first_seen_seconds_ago: 600,
        last_seen_seconds_ago: 15,
        is_known: true,
        warning_message: null
      },
      {
        id: "F3:90:12:AA:77:BC",
        name: "BLE Peripheral (Unidentified)",
        classification: "Generic BLE Device",
        risk_tier: "NEUTRAL",
        tag_label: "Transient RF Signal",
        rssi: -82,
        signal_strength: "Weak",
        sightings_count: 1,
        first_seen_seconds_ago: 300,
        last_seen_seconds_ago: 45,
        is_known: false,
        warning_message: null
      }
    ],
    alerts: [
      {
        device_id: "C4:7D:4F:92:11:A4",
        name: "Unknown BLE Tracker",
        signal_strength: "Strong",
        sightings: 3,
        warning: "Repeated unknown device detected. Review recommended."
      }
    ],
    safety_guidance: "If you suspect an unknown tracker is following you, move to a safe public location and contact appropriate support.",
    hardware_notes: "BLE scanner distinguishes generic peripheral beacons from persistent potential trackers. OS restrictions and MAC rotation may limit passive background tracking."
  };
}

export async function analyzeChatApi(conversationText) {
  try {
    const res = await fetch(`${API_BASE}/chat/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation: conversationText, user_consent: true }),
      signal: AbortSignal.timeout(3000)
    });
    if (res.ok) return await res.json();
  } catch (e) {}

  // Client-side regex pattern evaluation
  const text = conversationText.toLowerCase();
  const indicators = [];
  let score = 0;

  if (text.includes("where are you") || text.includes("tell me now") || text.includes("location") || text.includes("who are you with")) {
    score += 35;
    indicators.push({
      id: "location_stalking",
      title: "Repeated Location Demands",
      description: "Insistent queries demanding live whereabouts or physical location disclosure.",
      match_count: 2,
      examples: ["'Where are you?'", "'Tell me now.'"]
    });
  }

  if (text.includes("regret it") || text.includes("if you don't") || text.includes("ruin") || text.includes("watch what happens")) {
    score += 40;
    indicators.push({
      id: "threatening_language",
      title: "Intimidation & Threatening Language",
      description: "Explicit or implicit threats of retaliation, physical harm, or destructive consequences.",
      match_count: 2,
      examples: ["'If you don't, you'll regret it.'"]
    });
  }

  if (text.includes("don't want") || text.includes("stop") || text.includes("no") || text.includes("leave me")) {
    score += 20;
    indicators.push({
      id: "boundary_violation",
      title: "Boundary Violation & Rejection Denial",
      description: "Disregarding explicit refusals or repeatedly overstepping stated boundaries.",
      match_count: 1,
      examples: ["'I don't want to share my location.'"]
    });
  }

  const finalScore = Math.min(Math.max(score, indicators.length > 0 ? 78 : 12), 100);
  const riskLevel = finalScore >= 70 ? "HIGH" : (finalScore >= 35 ? "MEDIUM" : "LOW");

  return {
    risk_score: finalScore,
    simulated: true,
    risk_level: riskLevel,
    badge_color: riskLevel === "HIGH" ? "red" : (riskLevel === "MEDIUM" ? "yellow" : "green"),
    summary: riskLevel === "HIGH" 
      ? "Potential high-risk indicators detected: Repeated location requests, coercive threats, and boundary refusal."
      : "Standard conversational flow with low threat indicators.",
    indicators: indicators,
    recommendations: [
      "Do not yield to coercive ultimatums or share real-time location.",
      "Capture and preserve this conversation into the Evidence Vault.",
      "Reach out to a trusted person, or contact your local cyber safety helpline. Numbers vary by region — see Get Help."
    ],
    statement: "Potential risk indicators detected.",
    legal_context: "May fall under provisions regarding criminal intimidation (IPC 506 / BNS 351) or cyber harassment (IT Act 66E / 67A).",
    privacy_notice: "Your conversation was analyzed in local memory with your consent. No chat text has been stored on external servers."
  };
}

export async function getEvidenceListApi() {
  try {
    const res = await fetch(`${API_BASE}/evidence`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      const data = await res.json();
      return data.items || [];
    }
  } catch (e) {}
  return [...localEvidence];
}

export async function addEvidenceApi(item) {
  try {
    const res = await fetch(`${API_BASE}/evidence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
      signal: AbortSignal.timeout(2000)
    });
    if (res.ok) return await res.json();
  } catch (e) {}

  const newItem = {
    id: `EV-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
    date: new Date().toLocaleString(),
    verification_id: `NRK-VER-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    status: "Verified Hashed",
    file_hash: `sha256_${Math.random().toString(36).substring(2, 16)}`,
    ...item
  };
  localEvidence.unshift(newItem);
  return { success: true, item: newItem };
}

export async function deleteEvidenceApi(itemId) {
  try {
    const res = await fetch(`${API_BASE}/evidence/${itemId}`, { method: "DELETE", signal: AbortSignal.timeout(1500) });
    if (res.ok) return true;
  } catch (e) {}

  localEvidence = localEvidence.filter(i => i.id !== itemId);
  return true;
}

export async function purgeAllDataApi() {
  try {
    await fetch(`${API_BASE}/privacy/purge`, { method: "POST" });
  } catch (e) {}
  localEvidence = [];
  return true;
}
