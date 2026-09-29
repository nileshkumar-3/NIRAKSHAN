"""
NIRAKSHAN — FastAPI REST Backend
Entry point providing API services for:
- Image Shield & Provenance Verification
- AI Deepfake Manipulation Pipeline
- BLE Tracker Hardware & Telemetry Scanner
- Safe Chat Threat Auditor
- Tamper-Evident Evidence Vault & Dossier Generator
- Live Competition Demo Presets
"""

import io
import time
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
from pydantic import BaseModel

from image_shield import ImageShieldEngine
from tracker_scanner import TrackerScannerEngine
from chat_analyzer import ChatThreatAuditor
from evidence import EvidenceVaultManager

app = FastAPI(
    title="NIRAKSHAN Backend API",
    description="AI-Powered Digital Safety Shield for Women's Digital & Physical Sovereignty",
    version="2.0.0"
)

# Enable CORS for Vite frontend and Extension origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Singletons
tracker_engine = TrackerScannerEngine()
vault_manager = EvidenceVaultManager()

# Pydantic Schemas
class ChatAnalysisRequest(BaseModel):
    conversation: str
    user_consent: bool = True

class AddEvidenceRequest(BaseModel):
    title: str
    item_type: str
    content: str
    source: str = "Safe Chat Auditor"
    risk_level: str = "MEDIUM"
    notes: Optional[str] = ""

class GenerateReportRequest(BaseModel):
    item_ids: Optional[List[str]] = None
    investigator_notes: Optional[str] = ""

class MarkDeviceRequest(BaseModel):
    address: str
    is_known: bool

@app.get("/")
def root():
    return {
        "name": "NIRAKSHAN API",
        "tagline": "Digital Safety is Physical Safety.",
        "status": "ONLINE",
        "version": "2.0.0"
    }

@app.get("/api/health")
def health():
    return {"status": "healthy", "timestamp": time.time()}

@app.get("/api/status/overview")
def get_overview_status():
    vault_items = vault_manager.get_all_items()
    return {
        "digital_safety_score": 82,
        "score_status": "Protected",
        "image_shield": {
            "status": "Active",
            "message": "Your protected images are being monitored.",
            "protected_images_count": 24
        },
        "tracker_detection": {
            "status": "No unknown trackers detected",
            "active_radar": True,
            "last_sweep": "2 minutes ago"
        },
        "chat_safety": {
            "status": "Low Risk",
            "message": "Zero active coercive threads flagged"
        },
        "evidence_vault": {
            "count": len(vault_items),
            "label": f"{len(vault_items)} protected items"
        },
        "recent_alerts": [
            {
                "id": "ALT-101",
                "type": "image",
                "level": "MEDIUM",
                "title": "Suspicious image detected",
                "desc": "Deepfake synthesis indicators observed on linked social profile photo.",
                "time": "12m ago"
            },
            {
                "id": "ALT-102",
                "type": "bluetooth",
                "level": "HIGH",
                "title": "Unknown Bluetooth device detected",
                "desc": "Repeated beacon C4:7D:4F:92:11:A4 seen 3 times across recent scans.",
                "time": "45m ago"
            },
            {
                "id": "ALT-103",
                "type": "chat",
                "level": "HIGH",
                "title": "High-risk message detected",
                "desc": "Location coercion & intimidation patterns flagged in incoming text thread.",
                "time": "2h ago"
            }
        ]
    }

# ----------------- IMAGE SHIELD ENDPOINTS -----------------

@app.post("/api/image/protect")
async def protect_image(
    file: UploadFile = File(...),
    user_id: str = Form("USER-SEC-8921"),
    tag: str = Form("PRIMARY_IDENTITY")
):
    try:
        content = await file.read()
        protected_bytes, metadata = ImageShieldEngine.protect_image(content, user_id=user_id, custom_tag=tag)
        
        # Also log to evidence vault
        vault_manager.add_item(
            title=f"Protected Image ({file.filename or 'photo.png'})",
            item_type="Image",
            content=f"Verification ID: {metadata['verification_id']}",
            source="Image Shield",
            risk_level="LOW",
            notes=f"Cryptographically sealed image. Integrity: {metadata['integrity_status']}",
            metadata=metadata
        )

        return JSONResponse({
            "success": True,
            "metadata": metadata,
            "filename": f"protected_{file.filename or 'image.png'}"
        })
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/image/verify")
async def verify_image(file: UploadFile = File(...)):
    try:
        content = await file.read()
        result = ImageShieldEngine.verify_image(content)
        return JSONResponse(result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/image/manipulation-check")
async def manipulation_check(file: UploadFile = File(...)):
    try:
        content = await file.read()
        result = ImageShieldEngine.analyze_manipulation_risk(content)
        return JSONResponse(result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# ----------------- TRACKER SCANNER ENDPOINTS -----------------

@app.get("/api/tracker/scan")
@app.post("/api/tracker/scan")
async def scan_trackers(duration: float = 2.5, force_simulated: bool = False):
    result = await tracker_engine.scan_devices(scan_duration=duration, force_simulated=force_simulated)
    return JSONResponse(result)

@app.post("/api/tracker/mark-known")
def mark_tracker_known(payload: MarkDeviceRequest):
    success = tracker_engine.mark_device_known(payload.address, payload.is_known)
    return {"success": success, "address": payload.address, "is_known": payload.is_known}

@app.post("/api/tracker/reset")
def reset_tracker_history():
    tracker_engine.reset_history()
    return {"success": True, "message": "Tracker history reset to demo baseline."}

# ----------------- CHAT AUDITOR ENDPOINTS -----------------

@app.post("/api/chat/analyze")
def analyze_chat(payload: ChatAnalysisRequest):
    result = ChatThreatAuditor.analyze_text(payload.conversation)
    return JSONResponse(result)

# ----------------- EVIDENCE VAULT ENDPOINTS -----------------

@app.get("/api/evidence")
def list_evidence():
    items = vault_manager.get_all_items()
    return {"items": items, "count": len(items)}

@app.post("/api/evidence")
def add_evidence(payload: AddEvidenceRequest):
    item = vault_manager.add_item(
        title=payload.title,
        item_type=payload.item_type,
        content=payload.content,
        source=payload.source,
        risk_level=payload.risk_level,
        notes=payload.notes or ""
    )
    return {"success": True, "item": item}

@app.delete("/api/evidence/{item_id}")
def delete_evidence(item_id: str):
    success = vault_manager.delete_item(item_id)
    return {"success": success, "deleted_id": item_id}

@app.post("/api/evidence/generate-report")
def generate_dossier(payload: GenerateReportRequest):
    dossier = vault_manager.generate_dossier_report(
        item_ids=payload.item_ids,
        investigator_notes=payload.investigator_notes or ""
    )
    return JSONResponse(dossier)

# ----------------- PRIVACY & ALERTS ENDPOINTS -----------------

@app.get("/api/alerts")
def get_alerts():
    return {
        "alerts": [
            {
                "id": "ALT-001",
                "timestamp": "2026-09-30 01:20:00",
                "risk_level": "HIGH",
                "type": "Chat Risk",
                "title": "High-risk chat indicator",
                "description": "Conversation with repeated location demands and coercive ultimatums.",
                "recommended_step": "Preserve conversation to Evidence Vault and avoid sharing real-time location."
            },
            {
                "id": "ALT-002",
                "timestamp": "2026-09-30 00:45:00",
                "risk_level": "WARNING",
                "type": "Tracker Radar",
                "title": "Repeated unknown Bluetooth device",
                "description": "Beacon C4:7D:4F:92:11:A4 recorded 3 times in near proximity with strong RSSI (-59dBm).",
                "recommended_step": "Move to a safe public location and review personal belongings for hidden tags."
            },
            {
                "id": "ALT-003",
                "timestamp": "2026-09-29 22:15:00",
                "risk_level": "MEDIUM",
                "type": "Image Shield",
                "title": "Image integrity issue",
                "description": "Unregistered social media profile photo detected with generative blending anomalies.",
                "recommended_step": "Seal original photos with NIRAKSHAN watermark before public posting."
            }
        ]
    }

@app.post("/api/privacy/purge")
def purge_all_data():
    vault_manager.clear_all()
    tracker_engine.reset_history()
    return {
        "success": True,
        "message": "All local caches, analysis records, and telemetry have been permanently purged."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
