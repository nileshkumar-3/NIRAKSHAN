import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Radio, 
  MessageSquareWarning, 
  Lock, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  RefreshCw, 
  FileText, 
  Sliders, 
  ChevronRight,
  Sparkles,
  Smartphone,
  Layers,
  Activity,
  Download
} from 'lucide-react';
import { fetchOverview } from '../services/api';

export default function DashboardPage({ setActivePage, openEvidenceReport, openMobileSim, openExtSim }) {
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState({
    digital_safety_score: 82,
    score_status: "Protected",
    image_shield: { status: "Active", message: "Your protected images are being monitored.", protected_images_count: 24 },
    tracker_detection: { status: "No unknown trackers detected", active_radar: true, last_sweep: "2 minutes ago" },
    chat_safety: { status: "Low Risk", message: "Zero active coercive threads flagged" },
    evidence_vault: { count: 7, label: "7 protected items" },
    recent_alerts: [
      { id: "ALT-101", type: "image", level: "MEDIUM", title: "Suspicious image detected", desc: "Deepfake synthesis indicators observed on linked social profile photo.", time: "12m ago" },
      { id: "ALT-102", type: "bluetooth", level: "HIGH", title: "Unknown Bluetooth device detected", desc: "Repeated beacon C4:7D:4F:92:11:A4 seen 3 times across recent scans.", time: "45m ago" },
      { id: "ALT-103", type: "chat", level: "HIGH", title: "High-risk message detected", desc: "Location coercion & intimidation patterns flagged in incoming text thread.", time: "2h ago" }
    ]
  });

  const loadData = async () => {
    setLoading(true);
    const data = await fetchOverview();
    setOverview(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Digital Threat Operations Dashboard
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-500/30 rounded-full">
              Live Monitoring
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time digital defense indicators, provenance integrity, and RF spectrum telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500/50 transition-all cursor-pointer"
            title="Refresh System Status"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
          <button
            onClick={() => setActivePage('demo')}
            className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/40 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Judge Demo Suite</span>
          </button>
          <button
            onClick={openEvidenceReport}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-900/40 flex items-center space-x-1.5 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Dossier Report</span>
          </button>
        </div>
      </div>

      {/* Main 5 Primary Dashboard Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* CARD 1: Digital Safety Score */}
        <div className="p-5 rounded-3xl bg-gradient-to-b from-[#0D1D38] to-[#070D18] border border-cyan-500/40 shadow-xl shadow-cyan-950/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">Digital Safety Score</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline space-x-1 my-3">
              <span className="text-4xl font-black font-heading text-white">{overview.digital_safety_score}</span>
              <span className="text-sm font-mono text-slate-400">/ 100</span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Status: {overview.score_status}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">All multi-vector defense sensors optimal</p>
          </div>
        </div>

        {/* CARD 2: Image Shield */}
        <div 
          onClick={() => setActivePage('image-shield')}
          className="p-5 rounded-3xl bg-[#091122] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono uppercase text-slate-400">Image Shield</span>
              <Shield className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-lg font-bold text-white mt-1 flex items-center space-x-2">
              <span>{overview.image_shield.status}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              “{overview.image_shield.message}”
            </p>
          </div>
          <div className="pt-3 flex items-center justify-between text-xs text-cyan-400 font-semibold">
            <span>24 Sealed Photos</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 3: Tracker Detection */}
        <div 
          onClick={() => setActivePage('tracker-scan')}
          className="p-5 rounded-3xl bg-[#091122] border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono uppercase text-slate-400">Tracker Detection</span>
              <Radio className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-base font-bold text-white mt-1">
              {overview.tracker_detection.status}
            </p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Active BLE beacon sweep running in background.
            </p>
          </div>
          <div className="pt-3 flex items-center justify-between text-xs text-indigo-400 font-semibold">
            <span>Radar Sweep Active</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 4: Chat Safety */}
        <div 
          onClick={() => setActivePage('chat-safety')}
          className="p-5 rounded-3xl bg-[#091122] border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono uppercase text-slate-400">Chat Safety</span>
              <MessageSquareWarning className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-lg font-bold text-white mt-1 flex items-center space-x-2">
              <span>{overview.chat_safety.status}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {overview.chat_safety.message}
            </p>
          </div>
          <div className="pt-3 flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span>Audit Conversations</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 5: Evidence Vault */}
        <div 
          onClick={() => setActivePage('evidence')}
          className="p-5 rounded-3xl bg-[#091122] border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono uppercase text-slate-400">Evidence Vault</span>
              <Lock className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-lg font-bold text-white mt-1">
              {overview.evidence_vault.label}
            </p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              SHA-256 cryptographically sealed artifacts ready for filing.
            </p>
          </div>
          <div className="pt-3 flex items-center justify-between text-xs text-rose-400 font-semibold">
            <span>Open Vault</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* Two Column Section: Recent Alerts Stream + Quick Defense Triggers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Alerts Feed (2 Columns) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#091122] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-rose-400" />
              <h3 className="font-heading text-lg font-bold text-white">Recent Threat Alerts</h3>
            </div>
            <button
              onClick={() => setActivePage('alerts')}
              className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
            >
              View All Alerts
            </button>
          </div>

          <div className="space-y-3">
            {overview.recent_alerts.map((alert) => (
              <div 
                key={alert.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-xl mt-0.5 ${
                    alert.level === 'HIGH' ? 'bg-rose-500/15 text-rose-400' : 'bg-amber-500/15 text-amber-400'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs sm:text-sm font-bold text-white">{alert.title}</p>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        alert.level === 'HIGH' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {alert.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{alert.desc}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-[10px] font-mono text-slate-500">{alert.time}</span>
                  <button
                    onClick={() => setActivePage('alerts')}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium cursor-pointer"
                  >
                    Action
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] font-mono text-slate-500 pt-1">
            * Realistic simulation telemetry data provided for demonstration purposes.
          </p>
        </div>

        {/* Quick Actions & Companion App Launchers (1 Column) */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0C172E] to-[#091122] border border-cyan-500/20 space-y-5 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">Quick Actions</span>
            <h3 className="font-heading text-lg font-bold text-white mt-1">
              Active Defense Controls
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Trigger on-demand scans and test cross-platform companion tools.
            </p>

            <div className="space-y-2.5 mt-4">
              <button
                onClick={() => setActivePage('image-shield')}
                className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-left flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-slate-200">Seal Photo (Watermark)</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActivePage('tracker-scan')}
                className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/40 text-left flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Radio className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-slate-200">Sweep Nearby BLE Trackers</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => setActivePage('chat-safety')}
                className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-rose-500/40 text-left flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <MessageSquareWarning className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-semibold text-slate-200">Audit Chat Threat</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Simulators Launch Box */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Companion Prototypes</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={openMobileSim}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center justify-center space-x-1.5 border border-slate-700 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile App</span>
              </button>
              <button
                onClick={openExtSim}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold flex items-center justify-center space-x-1.5 border border-slate-700 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Browser Ext</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
