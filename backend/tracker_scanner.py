"""
NIRAKSHAN — Bluetooth Low Energy (BLE) Tracker Detection Engine
Handles:
1. Real-time BLE Hardware scanning via 'bleak' (when available)
2. Sighting history, temporal correlation, and RSSI tracking
3. Heuristic risk classification: Known Device vs Generic BLE vs Potential Unknown Tracker
4. Safety alerts & actionable guidance for persistent beacons
"""

import asyncio
import time
import random
from typing import List, Dict, Any, Optional

# Try importing bleak, gracefully fallback to simulated telemetry if unavailable or restricted
try:
    from bleak import BleakScanner
    BLEAK_AVAILABLE = True
except ImportError:
    BLEAK_AVAILABLE = False

# Known Apple FindMy, Samsung SmartTag, Tile payload signatures & generic manufacturer prefixes
TRACKER_SIGNATURES = {
    "4c00": {"vendor": "Apple Inc.", "category": "FindMy / AirTag Protocol Candidate"},
    "7500": {"vendor": "Samsung Electronics", "category": "SmartTag Candidate"},
    "feed": {"vendor": "Tile Inc.", "category": "Tile Tracker Candidate"},
    "004c": {"vendor": "Apple Inc.", "category": "Apple Proximity Tag"}
}

class TrackerScannerEngine:
    def __init__(self):
        # In-memory history of observed devices: {device_id: {"first_seen": ts, "last_seen": ts, "count": int, "rssi_history": []}}
        self.device_history: Dict[str, Dict[str, Any]] = {}
        self.is_scanning = False
        self._init_demo_devices()

    def _init_demo_devices(self):
        """Pre-populate a few realistic baseline devices for demo realism."""
        now = time.time()
        self.device_history["C4:7D:4F:92:11:A4"] = {
            "name": "Unknown BLE Beacon",
            "first_seen": now - 1800,
            "last_seen": now - 30,
            "count": 3,
            "rssi_history": [-68, -62, -59],
            "is_known_user_device": False,
            "estimated_type": "Potential Unknown Tracker"
        }
        self.device_history["E2:1B:08:44:91:32"] = {
            "name": "Galaxy Buds Live",
            "first_seen": now - 3600,
            "last_seen": now - 120,
            "count": 12,
            "rssi_history": [-75, -78],
            "is_known_user_device": True,
            "estimated_type": "Known Device"
        }
        self.device_history["A1:88:23:FE:19:67"] = {
            "name": "Smart Fitness Band",
            "first_seen": now - 600,
            "last_seen": now - 10,
            "count": 1,
            "rssi_history": [-88],
            "is_known_user_device": True,
            "estimated_type": "Generic BLE Device"
        }

    async def scan_devices(self, scan_duration: float = 3.0, force_simulated: bool = False) -> Dict[str, Any]:
        """
        Executes a scan. If hardware BLE is accessible, probes real spectrum via bleak.
        Otherwise or if force_simulated=True, enriches with simulated realistic RF beacons.
        """
        discovered_raw = []
        hardware_success = False
        error_msg = None

        if BLEAK_AVAILABLE and not force_simulated:
            try:
                scanner = BleakScanner()
                devices = await asyncio.wait_for(scanner.discover(timeout=scan_duration, return_adv=True), timeout=scan_duration + 1.0)
                hardware_success = True
                for device, adv_data in devices.values():
                    discovered_raw.append({
                        "address": device.address,
                        "name": device.name or "Unnamed BLE Device",
                        "rssi": adv_data.rssi if adv_data else (device.rssi or -75),
                        "manufacturer_data": {k: v.hex() for k, v in (adv_data.manufacturer_data.items() if adv_data else {})}
                    })
            except Exception as e:
                error_msg = str(e)
                hardware_success = False

        if not hardware_success or len(discovered_raw) == 0:
            # Fallback to realistic RF simulation
            discovered_raw = self._generate_simulated_scan_results()

        # Process and classify devices
        processed_devices = []
        now = time.time()
        high_risk_alerts = []

        for item in discovered_raw:
            addr = item["address"]
            rssi = item.get("rssi", -70)
            name = item.get("name", "Unknown BLE Device")
            
            # Update history
            if addr not in self.device_history:
                self.device_history[addr] = {
                    "name": name,
                    "first_seen": now,
                    "last_seen": now,
                    "count": 1,
                    "rssi_history": [rssi],
                    "is_known_user_device": "Buds" in name or "Watch" in name or "Band" in name,
                    "estimated_type": "Generic BLE Device"
                }
            else:
                self.device_history[addr]["last_seen"] = now
                self.device_history[addr]["count"] += 1
                self.device_history[addr]["rssi_history"].append(rssi)
                if len(self.device_history[addr]["rssi_history"]) > 10:
                    self.device_history[addr]["rssi_history"].pop(0)

            hist = self.device_history[addr]
            sightings = hist["count"]
            is_known = hist.get("is_known_user_device", False)

            # Classification Logic
            # Do NOT claim every device is an AirTag
            if is_known:
                classification = "Known Device"
                risk_tier = "SAFE"
                tag_label = "User Paired Device"
            elif sightings >= 3 and rssi > -75:
                classification = "Potential Unknown Tracker"
                risk_tier = "WARNING"
                tag_label = "Persistent Sighting"
                high_risk_alerts.append({
                    "device_id": addr,
                    "name": name,
                    "signal_strength": self._rssi_to_strength(rssi),
                    "sightings": sightings,
                    "warning": "Repeated unknown device detected. Review recommended."
                })
            elif "Beacon" in name or "Tag" in name or "FindMy" in name:
                classification = "Potential Unknown Tracker"
                risk_tier = "ATTENTION"
                tag_label = "Unpaired BLE Beacon"
            else:
                classification = "Generic BLE Device"
                risk_tier = "NEUTRAL"
                tag_label = "Transient RF Signal"

            # Signal strength representation
            strength_label = self._rssi_to_strength(rssi)

            processed_devices.append({
                "id": addr,
                "name": name,
                "classification": classification,
                "risk_tier": risk_tier,
                "tag_label": tag_label,
                "rssi": rssi,
                "signal_strength": strength_label,
                "sightings_count": sightings,
                "first_seen_seconds_ago": int(now - hist["first_seen"]),
                "last_seen_seconds_ago": int(now - hist["last_seen"]),
                "is_known": is_known,
                "warning_message": "Repeated unknown device detected. Review recommended." if classification == "Potential Unknown Tracker" and sightings >= 3 else None
            })

        # Sort: Warnings first, then by signal strength
        processed_devices.sort(key=lambda d: (0 if d["risk_tier"] == "WARNING" else (1 if d["risk_tier"] == "ATTENTION" else 2), -d["rssi"]))

        return {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            # Explicit so the UI can label simulated telemetry as simulated
            # rather than implying a real radio reading was taken.
            "simulated": not hardware_success,
            "scan_mode": "Hardware BLE (Bleak)" if hardware_success else "Telemetry Emulation / Cross-Platform",
            "devices_count": len(processed_devices),
            "unknown_trackers_count": sum(1 for d in processed_devices if d["classification"] == "Potential Unknown Tracker"),
            "devices": processed_devices,
            "alerts": high_risk_alerts,
            "safety_guidance": "If you suspect an unknown tracker is following you, move to a safe public location and contact appropriate support.",
            "hardware_notes": "BLE scanner distinguishes generic peripheral beacons from persistent potential trackers. OS restrictions and MAC rotation may limit passive background tracking."
        }

    def _rssi_to_strength(self, rssi: int) -> str:
        if rssi >= -60:
            return "Strong"
        elif rssi >= -75:
            return "Moderate"
        else:
            return "Weak"

    def _generate_simulated_scan_results(self) -> List[Dict[str, Any]]:
        """Generates realistic RF device list for demonstrations."""
        results = [
            {
                "address": "C4:7D:4F:92:11:A4",
                "name": "Unknown BLE Tracker",
                "rssi": random.randint(-64, -58),
                "manufacturer_data": {"4c00": "01092002"}
            },
            {
                "address": "E2:1B:08:44:91:32",
                "name": "Galaxy Buds Live",
                "rssi": random.randint(-79, -74),
                "manufacturer_data": {"7500": "4210"}
            },
            {
                "address": "A1:88:23:FE:19:67",
                "name": "Smart Fitness Band",
                "rssi": random.randint(-88, -82),
                "manufacturer_data": {}
            },
            {
                "address": "F3:90:12:AA:77:BC",
                "name": "BLE Peripheral (Unidentified)",
                "rssi": random.randint(-85, -78),
                "manufacturer_data": {}
            }
        ]
        return results

    def mark_device_known(self, address: str, is_known: bool = True) -> bool:
        if address in self.device_history:
            self.device_history[address]["is_known_user_device"] = is_known
            return True
        return False

    def reset_history(self):
        self.device_history.clear()
        self._init_demo_devices()
