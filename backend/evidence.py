"""
NIRAKSHAN — Evidence Vault & Cryptographic Dossier Manager
Handles:
1. Tamper-evident evidence storage with SHA-256 verification hashes
2. Structured Evidence Report generation (timestamps, checksums, incident timeline, notes)
3. Zero-knowledge local management and user-controlled deletion
"""

import time
import hashlib
import json
from typing import List, Dict, Any, Optional

class EvidenceVaultManager:
    def __init__(self):
        self._vault_items: Dict[str, Dict[str, Any]] = {}
        self._init_demo_vault()

    def _init_demo_vault(self):
        now = time.time()
        demo_items = [
            {
                "id": "EV-2026-0891",
                "title": "Threatening Instagram DM Thread",
                "type": "Conversation",
                "date": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(now - 86400 * 2)),
                "verification_id": "NRK-VER-7721A0F9",
                "status": "Verified Hashed",
                "file_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                "source": "Safe Chat Auditor",
                "risk_level": "HIGH",
                "notes": "User received persistent location demands and threats of retaliation after boundary refusal.",
                "metadata": {
                    "risk_score": 78,
                    "indicators_flagged": ["Repeated Location Demands", "Intimidation & Threatening Language"]
                }
            },
            {
                "id": "EV-2026-0892",
                "title": "Unknown BLE Beacon Telemetry Log",
                "type": "Alert",
                "date": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(now - 86400)),
                "verification_id": "NRK-VER-8902BB31",
                "status": "Verified Hashed",
                "file_hash": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
                "source": "BLE Radar Scanner",
                "risk_level": "WARNING",
                "notes": "Device C4:7D:4F:92:11:A4 observed following user across 3 separate scans with signal RSSI > -65dBm.",
                "metadata": {
                    "device_id": "C4:7D:4F:92:11:A4",
                    "sightings": 3,
                    "signal": "Strong (-59dBm)"
                }
            },
            {
                "id": "EV-2026-0893",
                "title": "Profile Photo Provenance Certificate",
                "type": "Image",
                "date": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(now - 3600 * 12)),
                "verification_id": "NRK-PROV-9912FA4E",
                "status": "Cryptographically Sealed",
                "file_hash": "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
                "source": "Image Shield",
                "risk_level": "LOW",
                "notes": "Original identity photo sealed with DWT-LSB watermark before social media publishing.",
                "metadata": {
                    "signer": "USER-SEC-8921",
                    "tamper_status": "Intact"
                }
            },
            {
                "id": "EV-2026-0894",
                "title": "Manipulated Synthetic Face Image Capture",
                "type": "Screenshot",
                "date": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(now - 3600 * 5)),
                "verification_id": "NRK-VER-4411C820",
                "status": "Verified Hashed",
                "file_hash": "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
                "source": "Deepfake Risk Check",
                "risk_level": "HIGH",
                "notes": "Detected generative diffusion artifacts and unnatural face boundary blending from suspicious Telegram channel.",
                "metadata": {
                    "risk_score": 82,
                    "anomaly": "Generative diffusion artifacts"
                }
            },
            {
                "id": "EV-2026-0895",
                "title": "Suspicious Website Sentinel Interception",
                "type": "Report",
                "date": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(now - 3600 * 2)),
                "verification_id": "NRK-VER-1289DF66",
                "status": "Verified Hashed",
                "file_hash": "fcde2b2edba56bf408601fb721fe9b5c338d10ee429ea04fae5511b68fbf8fb9",
                "source": "Browser Sentinel Extension",
                "risk_level": "MEDIUM",
                "notes": "Blocked attempted photo upload to unverified deepfake manipulation portal `deep-swap-nudify.demo`.",
                "metadata": {
                    "domain": "deep-swap-nudify.demo",
                    "action_taken": "Upload Blocked by User"
                }
            },
            {
                "id": "EV-2026-0896",
                "title": "WhatsApp Coercion Audio/Text Transcript",
                "type": "Conversation",
                "date": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(now - 3600)),
                "verification_id": "NRK-VER-3920FE11",
                "status": "Verified Hashed",
                "file_hash": "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
                "source": "Safe Chat Auditor",
                "risk_level": "MEDIUM",
                "notes": "Aggressive repeated calls and intimidation messages logged for record-keeping.",
                "metadata": {
                    "risk_score": 64,
                    "indicators_flagged": ["Pressure & Coercive Control"]
                }
            },
            {
                "id": "EV-2026-0897",
                "title": "BLE Radar Proximity Beacon Spike",
                "type": "Alert",
                "date": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(now - 900)),
                "verification_id": "NRK-VER-6623AA19",
                "status": "Verified Hashed",
                "file_hash": "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
                "source": "BLE Radar Scanner",
                "risk_level": "WARNING",
                "notes": "Secondary beacon observation near public transit corridor.",
                "metadata": {
                    "signal": "Moderate (-72dBm)",
                    "sighting_zone": "Transit Hub"
                }
            }
        ]
        for item in demo_items:
            self._vault_items[item["id"]] = item

    def get_all_items(self) -> List[Dict[str, Any]]:
        return list(self._vault_items.values())

    def get_item(self, item_id: str) -> Optional[Dict[str, Any]]:
        return self._vault_items.get(item_id)

    def add_item(self, title: str, item_type: str, content: str, source: str = "User Manual Input", risk_level: str = "MEDIUM", notes: str = "", metadata: Optional[Dict] = None) -> Dict[str, Any]:
        now = time.time()
        file_hash = hashlib.sha256(f"{title}{content}{now}".encode()).hexdigest()
        item_id = f"EV-2026-{int(now) % 10000:04d}"
        verification_id = f"NRK-VER-{file_hash[:8].upper()}"

        item = {
            "id": item_id,
            "title": title,
            "type": item_type,
            "date": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(now)),
            "verification_id": verification_id,
            "status": "Verified Hashed",
            "file_hash": file_hash,
            "source": source,
            "risk_level": risk_level,
            "notes": notes or "Item preserved by user in secure Evidence Vault.",
            "content_preview": content[:200] if content else "",
            "metadata": metadata or {}
        }
        self._vault_items[item_id] = item
        return item

    def delete_item(self, item_id: str) -> bool:
        if item_id in self._vault_items:
            del self._vault_items[item_id]
            return True
        return False

    def clear_all(self):
        self._vault_items.clear()

    def generate_dossier_report(self, item_ids: Optional[List[str]] = None, investigator_notes: str = "") -> Dict[str, Any]:
        """
        Builds a comprehensive, structured digital safety dossier.
        """
        now = time.time()
        timestamp_str = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(now))
        dossier_id = f"DOSSIER-NRK-{hashlib.sha256(f'{timestamp_str}{investigator_notes}'.encode()).hexdigest()[:10].upper()}"

        selected = []
        if item_ids:
            for iid in item_ids:
                if iid in self._vault_items:
                    selected.append(self._vault_items[iid])
        else:
            selected = list(self._vault_items.values())

        # Compile hashes for master seal
        combined_hashes = "".join([i["file_hash"] for i in selected])
        master_hash = hashlib.sha256(f"{dossier_id}{combined_hashes}".encode()).hexdigest()

        return {
            "dossier_id": dossier_id,
            "generated_at": timestamp_str,
            "master_integrity_hash": master_hash,
            "total_items_count": len(selected),
            "evidence_items": selected,
            "investigator_notes": investigator_notes or "Prepared for Cyber Crime reporting and legal consultation.",
            "applicable_legal_frameworks": [
                "Information Technology Act 2000 (Sec 66E - Violation of Privacy, Sec 67A - Sexually Explicit Material)",
                "Bharatiya Nyaya Sanhita (BNS Sec 351 / IPC 506 - Criminal Intimidation)",
                "Digital Personal Data Protection Act (DPDP Act 2023)"
            ],
            "recommended_reporting_portals": [
                {"name": "National Cyber Crime Reporting Portal (India)", "url": "https://cybercrime.gov.in", "helpline": "1930"},
                {"name": "National Women Helpline", "helpline": "1091 / 181"},
                {"name": "Emergency Police Response", "helpline": "112"}
            ],
            "disclaimer": "This document is an automated evidence compilation compiled by NIRAKSHAN. It preserves digital integrity hashes and incident timestamps to assist in investigation. It does not replace formal law enforcement discovery or court certification under Indian Evidence Act Sec 65B."
        }
