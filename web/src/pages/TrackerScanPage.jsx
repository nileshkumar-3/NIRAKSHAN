import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Volume2, 
  Info, 
  ShieldAlert, 
  Clock, 
  Signal, 
  ExternalLink,
  PhoneCall,
  Activity,
  Layers
} from 'lucide-react';
import { scanTrackersApi } from '../services/api';

export default function TrackerScanPage({ setActivePage, onSaveEvidence }) {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [audioChiming, setAudioChiming] = useState(false);
  const [scanData, setScanData] = useState({
    timestamp: new Date().toISOString(),
    scan_mode: "BLE Hardware & Telemetry Sweep",
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
  });

  const canvasRef = useRef(null);
  const radarAngleRef = useRef(0);

  // Radar canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) - 20;

      // Draw concentric radar circles
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.lineWidth = 1;
      for (let r = 0.25; r <= 1.0; r += 0.25) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius * r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // Rotating scan beam if active or subtle sweep
      if (isScanning) {
        radarAngleRef.current = (radarAngleRef.current + 0.05) % (Math.PI * 2);
      } else {
        radarAngleRef.current = (radarAngleRef.current + 0.01) % (Math.PI * 2);
      }

      const beamAngle = radarAngleRef.current;
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, beamAngle, beamAngle + 0.6);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      // Draw Center Blip
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#06B6D4';
      ctx.fill();

      // Draw Discovered Device Blips
      // 1. Unknown tracker (Rose blip)
      const dev1X = cx + radius * 0.65 * Math.cos(0.9);
      const dev1Y = cy + radius * 0.65 * Math.sin(0.9);
      ctx.beginPath();
      ctx.arc(dev1X, dev1Y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#F43F5E';
      ctx.shadowColor = '#F43F5E';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 2. Known device (Emerald blip)
      const dev2X = cx + radius * 0.45 * Math.cos(3.2);
      const dev2Y = cy + radius * 0.45 * Math.sin(3.2);
      ctx.beginPath();
      ctx.arc(dev2X, dev2Y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#10B981';
      ctx.fill();

      // 3. Generic peripheral (Slate blip)
      const dev3X = cx + radius * 0.8 * Math.cos(4.8);
      const dev3Y = cy + radius * 0.8 * Math.sin(4.8);
      ctx.beginPath();
      ctx.arc(dev3X, dev3Y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#94A3B8';
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isScanning]);

  const handleStartScan = async () => {
    setIsScanning(true);
    const data = await scanTrackersApi();
    setTimeout(() => {
      setScanData(data);
      setIsScanning(false);
    }, 2000);
  };

  const triggerChime = () => {
    setAudioChiming(true);
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(940, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1880, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
    setTimeout(() => setAudioChiming(false), 800);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Nearby Tracker Scan & BLE Radar
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 bg-indigo-950 text-indigo-400 border border-indigo-500/30 rounded-full">
              2.4GHz RF Proximity
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Correlates Bluetooth Low Energy sightings over time to flag persistent rogue trackers and physical stalkers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={triggerChime}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer border ${
              audioChiming 
                ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/30' 
                : 'bg-slate-900 text-amber-300 border-amber-500/30 hover:bg-slate-800'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{audioChiming ? 'Chiming...' : 'Acoustic Locator Chime'}</span>
          </button>

          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-900/40 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Spectrum...' : 'Start Scan'}</span>
          </button>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-950/40 via-[#1A0B1A] to-slate-900/90 border border-rose-500/40 flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3">
          <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5 sm:mt-0" />
          <div>
            <p className="text-xs font-bold text-rose-200">
              Emergency Physical Safety Advice
            </p>
            <p className="text-xs text-rose-300/90">
              “{scanData.safety_guidance}”
            </p>
          </div>
        </div>
        <button
          onClick={() => setActivePage('emergency')}
          className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shrink-0 flex items-center space-x-1.5 cursor-pointer shadow-md"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Emergency Support</span>
        </button>
      </div>

      {/* Radar Canvas & Live Devices View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Visualizer (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#091122] border border-slate-800 space-y-4 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs">
            <span className="font-mono text-cyan-400 uppercase tracking-wider">Sonar Sweep Display</span>
            <span className="font-mono text-slate-400 text-[10px]">Range: ~15m</span>
          </div>

          <div className="relative w-[280px] h-[280px] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              className="rounded-full bg-[#050A14] border border-cyan-500/30 shadow-inner"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 w-full pt-2 text-[10px] font-mono text-center">
            <div className="p-2 rounded-xl bg-slate-900 border border-rose-500/30 text-rose-300">
              <span className="block font-bold">🔴 1 Tracker</span>
              <span>Potential Stalker</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-300">
              <span className="block font-bold">🟢 1 Known</span>
              <span>Paired Device</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400">
              <span className="block font-bold">⚪ 2 Generic</span>
              <span>Transient RF</span>
            </div>
          </div>
        </div>

        {/* Detected Devices Telemetry List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">
              Detected Bluetooth Devices ({scanData.devices.length})
            </span>
            <span className="text-[11px] font-mono text-cyan-400">
              Scan Mode: {scanData.scan_mode}
            </span>
          </div>

          {/* Device Cards */}
          <div className="space-y-3">
            {scanData.devices.map((dev) => {
              const isWarning = dev.classification === 'Potential Unknown Tracker';
              const isKnown = dev.is_known;

              return (
                <div
                  key={dev.id}
                  onClick={() => setSelectedDevice(dev)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isWarning 
                      ? 'bg-gradient-to-r from-rose-950/40 to-slate-900 border-rose-500/50 hover:border-rose-400 shadow-lg shadow-rose-950/30' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2.5 rounded-xl mt-0.5 ${
                        isWarning ? 'bg-rose-500/20 text-rose-400' : (isKnown ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400')
                      }`}>
                        <Radio className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-white text-sm">{dev.name}</h4>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            isWarning ? 'bg-rose-500 text-white' : (isKnown ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400')
                          }`}>
                            {dev.classification}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400 mt-1">
                          ID: {dev.id} • Seen: <b className="text-cyan-300">{dev.sightings_count} times</b>
                        </p>
                      </div>
                    </div>

                    <div className="text-right text-xs font-mono">
                      <div className="flex items-center justify-end space-x-1">
                        <Signal className={`w-3.5 h-3.5 ${dev.signal_strength === 'Strong' ? 'text-rose-400' : 'text-slate-400'}`} />
                        <span className={dev.signal_strength === 'Strong' ? 'text-rose-300 font-bold' : 'text-slate-300'}>
                          {dev.signal_strength} ({dev.rssi} dBm)
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Last seen {dev.last_seen_seconds_ago}s ago
                      </span>
                    </div>
                  </div>

                  {/* Warning Highlight */}
                  {dev.warning_message && (
                    <div className="mt-3 pt-2.5 border-t border-rose-500/30 flex items-center justify-between text-xs text-rose-300 font-semibold">
                      <div className="flex items-center space-x-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>“{dev.warning_message}”</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSaveEvidence) {
                            onSaveEvidence({
                              title: `Rogue BLE Tracker Sighting (${dev.id})`,
                              item_type: 'Alert',
                              content: `Unknown tracker detected following user. Seen ${dev.sightings_count} times with strong RSSI (${dev.rssi} dBm).`,
                              source: 'BLE Radar Scanner',
                              risk_level: 'WARNING'
                            });
                          }
                        }}
                        className="text-[10px] font-mono underline hover:text-white"
                      >
                        Save to Vault
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Clarification Box */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            <b>Detection Principle:</b> NIRAKSHAN clearly distinguishes generic peripheral BLE broadcasts from potential unknown trackers by correlating persistent sightings across time and signal proximity. Not every BLE device is an AirTag.
          </div>

        </div>

      </div>

    </div>
  );
}
