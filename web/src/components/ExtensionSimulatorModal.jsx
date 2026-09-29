import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Lock, 
  Globe, 
  Sliders, 
  FileCheck, 
  Ban, 
  Flag,
  Radio,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function ExtensionSimulatorModal({ isOpen, onClose, onSaveEvidence }) {
  const [currentDomain, setCurrentDomain] = useState('deep-swap-nudify.demo');
  const [protectUploads, setProtectUploads] = useState(true);
  const [isScanningPage, setIsScanningPage] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [blockedNotice, setBlockedNotice] = useState(false);
  const [reportedNotice, setReportedNotice] = useState(false);

  // Configurable list of simulated risky / safe domains
  const sampleDomains = [
    { domain: 'deep-swap-nudify.demo', risk: 'HIGH', type: 'Unverified Deepfake Face-Swap Portal' },
    { domain: 'ai-cloth-remover-bot.net', risk: 'CRITICAL', type: 'Non-Consensual Image Manipulation Tool' },
    { domain: 'legit-photo-editor.org', risk: 'LOW', type: 'Standard Cloud Image Editor' },
    { domain: 'instagram.com', risk: 'SAFE', type: 'Verified Social Platform' }
  ];

  const currentInfo = sampleDomains.find(d => d.domain === currentDomain) || sampleDomains[0];
  const isRisky = currentInfo.risk === 'HIGH' || currentInfo.risk === 'CRITICAL';

  const handleScanPage = () => {
    setIsScanningPage(true);
    setScanComplete(false);
    setTimeout(() => {
      setIsScanningPage(false);
      setScanComplete(true);
    }, 1200);
  };

  const handleBlockUpload = () => {
    setBlockedNotice(true);
    setTimeout(() => setBlockedNotice(false), 2500);
  };

  const handleReport = () => {
    setReportedNotice(true);
    setTimeout(() => setReportedNotice(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex flex-col items-center">
        
        {/* Top bar */}
        <div className="flex items-center justify-between w-full max-w-[420px] mb-2 px-1">
          <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs">
            <Layers className="w-4 h-4" />
            <span className="font-semibold">Browser Sentinel Extension Popup</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chrome Extension Browser Mock Window */}
        <div className="w-[380px] bg-[#0A1120] border border-cyan-500/40 rounded-2xl shadow-2xl shadow-indigo-950/60 overflow-hidden ring-1 ring-slate-700">
          
          {/* Extension Header */}
          <div className="p-3.5 bg-gradient-to-r from-[#0E1A33] to-[#0A1224] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold text-white flex items-center space-x-1.5">
                  <span>NIRAKSHAN Shield</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-cyan-950 text-cyan-400 border border-cyan-500/30 rounded">v2.0</span>
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">Real-time Web Sentinel</p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-emerald-300">Active</span>
            </div>
          </div>

          {/* Simulated Browser URL Bar Switcher */}
          <div className="p-2.5 bg-slate-900/90 border-b border-slate-800">
            <label className="text-[10px] text-slate-400 font-mono block mb-1">
              Active Browser Tab URL:
            </label>
            <div className="flex items-center space-x-1.5 bg-slate-950 px-2 py-1.5 rounded-lg border border-slate-700">
              <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <select
                value={currentDomain}
                onChange={(e) => {
                  setCurrentDomain(e.target.value);
                  setScanComplete(false);
                }}
                className="bg-transparent text-xs text-cyan-200 font-mono w-full focus:outline-none cursor-pointer"
              >
                {sampleDomains.map(d => (
                  <option key={d.domain} value={d.domain} className="bg-slate-900 text-slate-100">
                    https://{d.domain} ({d.risk})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-3.5">
            
            {/* Website Risk Card */}
            <div className={`p-3.5 rounded-xl border ${
              isRisky 
                ? 'bg-rose-950/30 border-rose-500/40' 
                : 'bg-emerald-950/20 border-emerald-500/30'
            }`}>
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center space-x-1.5">
                  {isRisky ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className={`text-xs font-bold ${isRisky ? 'text-rose-200' : 'text-emerald-200'}`}>
                    Website Risk: {currentInfo.risk}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{currentInfo.type}</span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                {isRisky 
                  ? '“Website appears potentially associated with AI image manipulation.”' 
                  : 'Domain has no record of unauthorized deepfake or scraping services.'}
              </p>

              {isRisky && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleBlockUpload}
                    className="py-1.5 px-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center space-x-1 shadow-sm transition-all"
                  >
                    <Ban className="w-3 h-3" />
                    <span>Block Upload</span>
                  </button>
                  <button
                    onClick={handleReport}
                    className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium flex items-center justify-center space-x-1 border border-slate-700"
                  >
                    <Flag className="w-3 h-3 text-amber-400" />
                    <span>Report Domain</span>
                  </button>
                </div>
              )}

              {blockedNotice && (
                <p className="text-[10px] font-mono text-emerald-400 mt-2 text-center bg-emerald-950/60 py-1 rounded">
                  🛡️ Image Upload Intercepted & Blocked!
                </p>
              )}

              {reportedNotice && (
                <p className="text-[10px] font-mono text-cyan-300 mt-2 text-center bg-cyan-950/60 py-1 rounded">
                  ✅ Domain flagged & logged to Threat Database.
                </p>
              )}
            </div>

            {/* Image Protection Toggle */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Protect uploaded images</p>
                <p className="text-[10px] text-slate-400">Injects provenance watermark before upload</p>
              </div>
              <button
                onClick={() => setProtectUploads(!protectUploads)}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors ${protectUploads ? 'bg-cyan-500' : 'bg-slate-700'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${protectUploads ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Quick Scan Section */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Page DOM & Script Audit</span>
                <button
                  onClick={handleScanPage}
                  disabled={isScanningPage}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1"
                >
                  <Radio className={`w-3 h-3 ${isScanningPage ? 'animate-spin' : ''}`} />
                  <span>{isScanningPage ? 'Auditing...' : 'Scan Current Page'}</span>
                </button>
              </div>

              {scanComplete && (
                <div className="text-[10px] font-mono text-slate-300 bg-slate-950 p-2 rounded border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>File input elements:</span>
                    <span className="text-rose-400">1 detected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Exfiltration scripts:</span>
                    <span className="text-amber-400">Suspicious telemetry</span>
                  </div>
                </div>
              )}
            </div>

            {/* Evidence Save Button */}
            {onSaveEvidence && isRisky && (
              <button
                onClick={() => {
                  onSaveEvidence({
                    title: `Blocked Upload on ${currentDomain}`,
                    item_type: 'Report',
                    content: `Domain ${currentDomain} identified as ${currentInfo.type}. Upload blocked by NIRAKSHAN Shield.`,
                    source: 'Browser Sentinel Extension',
                    risk_level: currentInfo.risk === 'CRITICAL' ? 'HIGH' : 'MEDIUM'
                  });
                  onClose();
                }}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center space-x-1.5 border border-slate-700 cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Save Evidence to Vault</span>
              </button>
            )}

            {/* Disclaimer */}
            <p className="text-[9px] text-slate-500 leading-tight text-center">
              Demonstrates concept using configurable list of known/demo risky domains rather than pretending to detect every AI website.
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}
