import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Shield, 
  Radio, 
  Bell, 
  Lock, 
  User, 
  MessageSquareWarning, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Volume2, 
  PhoneCall, 
  Info, 
  ChevronRight,
  Sparkles,
  Search,
  Trash2
} from 'lucide-react';

export default function MobileSimulatorModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('home'); // home, scan, alerts, evidence, profile
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState([
    {
      id: "C4:7D:4F:92:11:A4",
      name: "Unknown Bluetooth Tracker",
      type: "Potential Unknown Tracker",
      signal: "Strong",
      rssi: -59,
      seen: 3,
      isWarning: true
    },
    {
      id: "E2:1B:08:44:91:32",
      name: "Known Device (Galaxy Buds)",
      type: "Known Device",
      signal: "Weak",
      rssi: -82,
      seen: 12,
      isWarning: false
    },
    {
      id: "A1:88:23:FE:19:67",
      name: "Generic BLE Beacon",
      type: "Generic BLE Device",
      signal: "Weak",
      rssi: -88,
      seen: 1,
      isWarning: false
    }
  ]);
  const [audioChiming, setAudioChiming] = useState(false);

  useEffect(() => {
    let interval;
    if (isScanning) {
      setScanProgress(0);
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            setIsScanning(false);
            clearInterval(interval);
            return 100;
          }
          return prev + 20;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const triggerChime = () => {
    setAudioChiming(true);
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
    setTimeout(() => setAudioChiming(false), 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex flex-col items-center">
        
        {/* Top Floating Controls */}
        <div className="flex items-center justify-between w-full max-w-[380px] mb-3 px-2">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs">
            <Smartphone className="w-4 h-4" />
            <span className="font-semibold">NIRAKSHAN Mobile App (Live Demo)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Realistic Mobile Frame (iPhone/Android Cyber Styled) */}
        <div className="w-[360px] h-[720px] bg-[#070D18] border-[8px] border-slate-800 rounded-[44px] shadow-2xl shadow-cyan-500/10 flex flex-col overflow-hidden relative ring-1 ring-slate-700/80">
          
          {/* Dynamic Island / Speaker Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3">
            <div className="w-2 h-2 rounded-full bg-slate-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-900/60 border border-cyan-500/40" />
          </div>

          {/* Status Bar */}
          <div className="pt-3 px-6 pb-2 flex items-center justify-between text-[11px] text-slate-400 font-mono z-20 bg-[#070D18]/90">
            <span>01:40</span>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px]">5G</span>
              <div className="w-4 h-2 rounded-sm border border-slate-400 p-0.5 flex items-center">
                <div className="w-full h-full bg-emerald-400 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Screen Content Body */}
          <div className="flex-1 overflow-y-auto px-4 pb-20 pt-1 text-slate-100">
            
            {/* SCREEN 1: HOME */}
            {activeTab === 'home' && (
              <div className="space-y-4">
                {/* Header Greeting */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-xs text-slate-400">Good evening</span>
                    <h2 className="font-heading text-lg font-bold text-white flex items-center space-x-1.5">
                      <span>Priya Sharma</span>
                      <Shield className="w-4 h-4 text-cyan-400" />
                    </h2>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5">
                    <div className="w-full h-full bg-[#0B1528] rounded-full flex items-center justify-center text-xs font-bold text-cyan-300">
                      PS
                    </div>
                  </div>
                </div>

                {/* Score Hero Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0D1E3A] to-[#0B1426] border border-cyan-500/30 relative overflow-hidden shadow-lg shadow-cyan-950/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-cyan-300 font-mono uppercase tracking-wider">Your Digital Safety</p>
                      <div className="flex items-baseline space-x-1 my-1">
                        <span className="text-3xl font-extrabold font-heading text-white">82</span>
                        <span className="text-sm text-slate-400 font-mono">/ 100</span>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        ● Shield Active & Protected
                      </span>
                    </div>
                    {/* Ring dial graphic */}
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="26" stroke="#1E293B" strokeWidth="5" fill="none" />
                        <circle cx="32" cy="32" r="26" stroke="#06B6D4" strokeWidth="5" fill="none" strokeDasharray="163" strokeDashoffset="29" strokeLinecap="round" />
                      </svg>
                      <Shield className="w-6 h-6 text-cyan-400 absolute" />
                    </div>
                  </div>
                </div>

                {/* 4 Status Cards */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div 
                    onClick={() => setActiveTab('scan')} 
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-xs font-bold text-white">🛡 Image Shield</p>
                    <p className="text-[10px] text-emerald-400">Active (24 sealed)</p>
                  </div>

                  <div 
                    onClick={() => setActiveTab('scan')} 
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Radio className="w-4 h-4 text-indigo-400" />
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-xs font-bold text-white">📡 Tracker Scan</p>
                    <p className="text-[10px] text-emerald-400">Safe (1 warning)</p>
                  </div>

                  <div 
                    onClick={() => setActiveTab('alerts')} 
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <MessageSquareWarning className="w-4 h-4 text-emerald-400" />
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>
                    <p className="text-xs font-bold text-white">💬 Chat Safety</p>
                    <p className="text-[10px] text-slate-400">Low Risk</p>
                  </div>

                  <div 
                    onClick={() => setActiveTab('evidence')} 
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Lock className="w-4 h-4 text-rose-400" />
                      <span className="text-[10px] font-mono text-slate-400">7</span>
                    </div>
                    <p className="text-xs font-bold text-white">🔐 Evidence Vault</p>
                    <p className="text-[10px] text-slate-400">7 items stored</p>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  onClick={() => { setActiveTab('scan'); setIsScanning(true); }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-rose-500 text-white font-bold text-sm shadow-lg shadow-cyan-900/40 flex items-center justify-center space-x-2 active:scale-98 transition-transform cursor-pointer"
                >
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span>Scan Nearby Trackers</span>
                </button>

                {/* Quick Emergency Strip */}
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <PhoneCall className="w-4 h-4 text-rose-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Emergency Helplines</p>
                      <p className="text-[10px] text-rose-300">Cyber Crime: 1930 | Women: 1091</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('profile')} 
                    className="px-2.5 py-1 rounded bg-rose-600 text-white text-[10px] font-bold"
                  >
                    View
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 2: SCANNER */}
            {activeTab === 'scan' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-base font-bold text-white">Nearby Tracker Scan</h3>
                  <button
                    onClick={() => setIsScanning(true)}
                    disabled={isScanning}
                    className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
                    <span>{isScanning ? 'Scanning...' : 'Start Scan'}</span>
                  </button>
                </div>

                {/* Scanning Animation Area */}
                <div className="h-44 rounded-2xl bg-[#091222] border border-cyan-500/30 relative flex items-center justify-center overflow-hidden">
                  {/* Concentric rings */}
                  <div className="absolute w-36 h-36 rounded-full border border-cyan-500/20" />
                  <div className="absolute w-24 h-24 rounded-full border border-cyan-500/30" />
                  <div className="absolute w-12 h-12 rounded-full border border-cyan-500/40" />
                  
                  {/* Rotating scanner beam */}
                  <div className={`absolute w-36 h-36 rounded-full origin-center ${isScanning ? 'animate-radar' : ''}`}>
                    <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/40 to-transparent origin-bottom-right rounded-tl-full" />
                  </div>

                  {/* Center Dot */}
                  <div className="relative z-10 w-4 h-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/80 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  {/* Device Blips */}
                  <div className="absolute top-10 right-14 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-lg shadow-rose-500 animate-ping" />
                  <div className="absolute bottom-8 left-12 w-2 h-2 rounded-full bg-emerald-400" />
                </div>

                {/* High Priority Tracker Warning Box */}
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-rose-200">Potential Unknown Tracker</p>
                      <p className="text-[11px] text-rose-300/90 leading-tight mt-0.5">
                        “Repeated unknown device detected. Review recommended.”
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detected Devices List */}
                <div className="space-y-2">
                  <p className="text-[11px] font-mono text-slate-400 uppercase">Bluetooth devices detected (3)</p>
                  
                  {scanResults.map((dev) => (
                    <div key={dev.id} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Radio className={`w-3.5 h-3.5 ${dev.isWarning ? 'text-rose-400' : 'text-slate-400'}`} />
                          <span className="text-xs font-bold text-white">{dev.name}</span>
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          dev.isWarning ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {dev.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Signal: <b className={dev.signal === 'Strong' ? 'text-rose-400' : 'text-slate-300'}>{dev.signal}</b> ({dev.rssi} dBm)</span>
                        <span>Seen: <b className="text-cyan-300">{dev.seen} times</b></span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Force Acoustic Alarm Button */}
                <button
                  onClick={triggerChime}
                  className={`w-full py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    audioChiming 
                      ? 'bg-amber-500 text-black border-amber-400' 
                      : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-amber-500/30'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{audioChiming ? 'Playing Locator Chime...' : 'Trigger Acoustic Locator Chime'}</span>
                </button>

                {/* Safety Information Guidance */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
                  <div className="flex items-center space-x-1 text-cyan-400 font-semibold mb-1">
                    <Info className="w-3 h-3" />
                    <span>Safety Guidance</span>
                  </div>
                  “If you suspect an unknown tracker is following you, move to a safe public location and contact appropriate support.”
                </div>
              </div>
            )}

            {/* SCREEN 3: ALERTS */}
            {activeTab === 'alerts' && (
              <div className="space-y-3">
                <h3 className="font-heading text-base font-bold text-white">Active Safety Alerts</h3>
                
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-300">🔴 High-risk chat indicator</span>
                    <span className="text-[10px] font-mono text-slate-400">10m ago</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Location demands & threats detected in WhatsApp conversation thread.
                  </p>
                  <p className="text-[10px] text-cyan-400 pt-1">
                    Recommended: Save to Vault & do not share live location.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">🟠 Repeated unknown Bluetooth device</span>
                    <span className="text-[10px] font-mono text-slate-400">45m ago</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Beacon C4:7D:4F:92:11:A4 seen 3 times with strong signal.
                  </p>
                  <p className="text-[10px] text-cyan-400 pt-1">
                    Recommended: Inspect backpack/vehicle at safe public area.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/40 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300">🟡 Image integrity issue</span>
                    <span className="text-[10px] font-mono text-slate-400">3h ago</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Unsealed social media image identified on external page.
                  </p>
                </div>
              </div>
            )}

            {/* SCREEN 4: EVIDENCE */}
            {activeTab === 'evidence' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-base font-bold text-white">Evidence Vault</h3>
                  <span className="text-xs font-mono text-cyan-400">7 items</span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Threatening DM Thread</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-rose-500/20 text-rose-300 rounded">HIGH</span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400">ID: NRK-VER-7721A0F9</p>
                    <p className="text-[10px] text-slate-300">SHA-256 Hashed • 2026-09-28</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Unknown BLE Beacon Log</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded">WARNING</span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400">ID: NRK-VER-8902BB31</p>
                    <p className="text-[10px] text-slate-300">SHA-256 Hashed • 2026-09-29</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">Profile Photo Certificate</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded">SEALED</span>
                    </div>
                    <p className="text-[10px] font-mono text-slate-400">ID: NRK-PROV-9912FA4E</p>
                    <p className="text-[10px] text-slate-300">DWT-LSB Watermarked • 2026-09-29</p>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 5: PROFILE & EMERGENCY */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h3 className="font-heading text-base font-bold text-white">Emergency & Controls</h3>
                
                {/* Emergency Helplines Direct Dial */}
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-2">
                  <p className="text-xs font-bold text-rose-300">Direct Emergency Helplines</p>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="tel:1930"
                      className="p-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-center font-bold text-xs flex items-center justify-center space-x-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>1930 (Cyber)</span>
                    </a>
                    <a
                      href="tel:1091"
                      className="p-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-center font-bold text-xs flex items-center justify-center space-x-1"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>1091 (Women)</span>
                    </a>
                  </div>
                </div>

                {/* Privacy toggles summary */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <p className="font-bold text-slate-200">Device Permissions</p>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Location Tracking</span>
                    <span className="text-emerald-400 font-mono font-bold">OFF (Zero-Log)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Bluetooth Low Energy</span>
                    <span className="text-cyan-400 font-mono font-bold">Active Shield</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Local Data Custody</span>
                    <span className="text-indigo-400 font-mono font-bold">100% On-Device</span>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Navigation Bar */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-[#0B1426] border-t border-slate-800 flex items-center justify-around px-2 z-30">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center justify-center space-y-1 ${activeTab === 'home' ? 'text-cyan-400' : 'text-slate-500'}`}
            >
              <Shield className="w-4 h-4" />
              <span className="text-[10px] font-medium">Home</span>
            </button>
            <button
              onClick={() => setActiveTab('scan')}
              className={`flex flex-col items-center justify-center space-y-1 ${activeTab === 'scan' ? 'text-cyan-400' : 'text-slate-500'}`}
            >
              <Radio className="w-4 h-4" />
              <span className="text-[10px] font-medium">Scan</span>
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex flex-col items-center justify-center space-y-1 ${activeTab === 'alerts' ? 'text-cyan-400' : 'text-slate-500'}`}
            >
              <Bell className="w-4 h-4" />
              <span className="text-[10px] font-medium">Alerts</span>
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`flex flex-col items-center justify-center space-y-1 ${activeTab === 'evidence' ? 'text-cyan-400' : 'text-slate-500'}`}
            >
              <Lock className="w-4 h-4" />
              <span className="text-[10px] font-medium">Evidence</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center space-y-1 ${activeTab === 'profile' ? 'text-cyan-400' : 'text-slate-500'}`}
            >
              <User className="w-4 h-4" />
              <span className="text-[10px] font-medium">Profile</span>
            </button>
          </div>

          {/* iOS Bottom Home Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-600 rounded-full z-40 pointer-events-none" />

        </div>
      </div>
    </div>
  );
}
