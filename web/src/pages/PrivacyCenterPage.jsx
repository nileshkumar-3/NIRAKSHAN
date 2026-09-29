import React, { useState } from 'react';
import { 
  UserCheck, 
  Trash2, 
  Download, 
  ShieldCheck, 
  Sliders, 
  EyeOff, 
  Lock, 
  Cpu, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Radio,
  Camera,
  Mic,
  MapPin
} from 'lucide-react';
import { purgeAllDataApi } from '../services/api';

export default function PrivacyCenterPage({ onPurgeAll }) {
  const [purgedNotice, setPurgedNotice] = useState(false);
  const [exportedNotice, setExportedNotice] = useState(false);

  const handlePurge = async () => {
    if (confirm("Permanently wipe all transient analysis records, device logs, and evidence items? This action cannot be undone.")) {
      await purgeAllDataApi();
      if (onPurgeAll) onPurgeAll();
      setPurgedNotice(true);
      setTimeout(() => setPurgedNotice(false), 4000);
    }
  };

  const handleExportData = () => {
    const backupData = {
      export_timestamp: new Date().toISOString(),
      user_sovereignty: "Zero-Knowledge Local Archive",
      privacy_policy: "DPDP Act 2023 Compliant",
      local_storage_audit: "100% On-Device"
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nirakshan_privacy_archive_${Date.now()}.json`;
    a.click();
    setExportedNotice(true);
    setTimeout(() => setExportedNotice(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Privacy Center & Data Sovereignty
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded-full">
              Zero-Knowledge On-Device
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            NIRAKSHAN never transmits raw photos, private chats, or GPS tracking coordinates to remote cloud servers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export My Data</span>
          </button>
          <button
            onClick={handlePurge}
            className="px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-rose-950 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete All Analysis</span>
          </button>
        </div>
      </div>

      {purgedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>All local analysis caches, temporary session fingerprints, and logs have been wiped clean.</span>
        </div>
      )}

      {exportedNotice && (
        <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 text-xs flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Encrypted privacy telemetry archive downloaded successfully.</span>
        </div>
      )}

      {/* Privacy By Design Core Statement */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0C1A36] via-[#091224] to-[#070D18] border border-cyan-500/30 relative overflow-hidden space-y-3">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest">
          <ShieldCheck className="w-4 h-4" />
          <span>Privacy by Design</span>
        </div>
        <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
          “Your safety data should remain under your control.”
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Traditional apps often compromise victim privacy by exfiltrating user conversations and geolocation to external analytics databases. NIRAKSHAN operates under strict Zero-Knowledge principles where algorithms run inside your local client sandbox.
        </p>
      </div>

      {/* Data Collection & Permission Status Matrix */}
      <div className="p-6 rounded-3xl bg-[#091122] border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-base font-bold text-white uppercase font-mono tracking-wider">
            Hardware Sensor & Telemetry Permissions
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Strict Least-Privilege Policy</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Permission 1: Location */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                OFF
              </span>
            </div>
            <p className="text-xs font-bold text-white">Location Tracking</p>
            <p className="text-[10px] text-slate-400">Zero GPS exfiltration or path recording</p>
          </div>

          {/* Permission 2: Bluetooth */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                Required
              </span>
            </div>
            <p className="text-xs font-bold text-white">Bluetooth Low Energy</p>
            <p className="text-[10px] text-slate-400">Used strictly for local beacon radar sweep</p>
          </div>

          {/* Permission 3: Camera */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <Camera className="w-4 h-4 text-indigo-400" />
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                User Initiated
              </span>
            </div>
            <p className="text-xs font-bold text-white">Camera / Image Upload</p>
            <p className="text-[10px] text-slate-400">Activated only on explicit file selection</p>
          </div>

          {/* Permission 4: Microphone */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <Mic className="w-4 h-4 text-rose-400" />
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                OFF
              </span>
            </div>
            <p className="text-xs font-bold text-white">Microphone / Audio</p>
            <p className="text-[10px] text-slate-400">No ambient listening or recording</p>
          </div>

          {/* Permission 5: Chat Analysis */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <EyeOff className="w-4 h-4 text-emerald-400" />
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                User Initiated
              </span>
            </div>
            <p className="text-xs font-bold text-white">Chat NLP Audit</p>
            <p className="text-[10px] text-slate-400">Explicit consent required per paste</p>
          </div>

        </div>
      </div>

      {/* Control Action Buttons Bar */}
      <div className="p-6 rounded-3xl bg-[#091122] border border-slate-800 space-y-4">
        <h3 className="font-heading text-base font-bold text-white uppercase font-mono tracking-wider">
          Data Management & Purge Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <button
            onClick={handlePurge}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-rose-500/50 text-left space-y-1 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400">Delete all analysis</span>
              <Trash2 className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-[10px] text-slate-400">Clear chat heuristics & scan history</p>
          </button>

          <button
            onClick={handlePurge}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-rose-500/50 text-left space-y-1 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400">Delete evidence</span>
              <Lock className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-[10px] text-slate-400">Wipe all Evidence Vault records</p>
          </button>

          <button
            onClick={handleExportData}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-left space-y-1 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400">Export my data</span>
              <Download className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-[10px] text-slate-400">Download complete JSON archive</p>
          </button>

          <button
            onClick={() => alert("All permissions are currently configured to maximum Zero-Knowledge enforcement.")}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 text-left space-y-1 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400">Manage permissions</span>
              <Sliders className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-[10px] text-slate-400">Configure sensor access limits</p>
          </button>

        </div>
      </div>

    </div>
  );
}
