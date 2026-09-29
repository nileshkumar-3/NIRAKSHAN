import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldAlert, 
  Radio, 
  MessageSquareWarning, 
  Shield, 
  PhoneCall,
  Lock
} from 'lucide-react';

export default function AlertsCenterPage({ setActivePage, onSaveEvidence }) {
  const [filter, setFilter] = useState('ALL');

  const alerts = [
    {
      id: "ALT-001",
      timestamp: "2026-09-30 01:20:00",
      risk_level: "HIGH",
      type: "Chat Risk",
      icon: MessageSquareWarning,
      title: "High-risk chat indicator",
      description: "Conversation transcript contains repeated urgent location demands and explicit intimidation cues.",
      recommended_step: "Preserve conversation to Evidence Vault, avoid sharing real-time location, and notify trusted support."
    },
    {
      id: "ALT-002",
      timestamp: "2026-09-30 00:45:00",
      risk_level: "WARNING",
      type: "Tracker Radar",
      icon: Radio,
      title: "Repeated unknown Bluetooth device",
      description: "Beacon C4:7D:4F:92:11:A4 recorded 3 times in near proximity with strong RSSI (-59dBm).",
      recommended_step: "Move to a safe public location and review personal belongings or bag pockets for hidden hardware tags."
    },
    {
      id: "ALT-003",
      timestamp: "2026-09-29 22:15:00",
      risk_level: "MEDIUM",
      type: "Image Shield",
      icon: Shield,
      title: "Image integrity issue",
      description: "Unregistered social media profile photo detected with generative blending and deepfake anomalies.",
      recommended_step: "Seal original photos with NIRAKSHAN watermark before public posting to preserve verifiable authorship."
    },
    {
      id: "ALT-004",
      timestamp: "2026-09-29 17:30:00",
      risk_level: "LOW",
      type: "System Shield",
      icon: CheckCircle2,
      title: "Defense nodes synchronized",
      description: "Local heuristic classifier rules updated with latest 2026 threat signatures.",
      recommended_step: "No user intervention required."
    }
  ];

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'ALL') return true;
    if (filter === 'HIGH') return a.risk_level === 'HIGH';
    if (filter === 'WARNING') return a.risk_level === 'WARNING';
    if (filter === 'MEDIUM') return a.risk_level === 'MEDIUM';
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Safety Alerts Center
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-500/30 rounded-full">
              Real-time Sentinel
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Prioritized threat alerts with actionable safety recommendations and one-click evidence preservation.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          {['ALL', 'HIGH', 'WARNING', 'MEDIUM'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                filter === f 
                  ? 'bg-cyan-500 text-black shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const Icon = alert.icon;
          const isHigh = alert.risk_level === 'HIGH';
          const isWarning = alert.risk_level === 'WARNING';

          return (
            <div
              key={alert.id}
              className={`p-6 rounded-3xl border transition-all ${
                isHigh 
                  ? 'bg-gradient-to-r from-rose-950/40 via-slate-900/90 to-slate-900 border-rose-500/50 shadow-xl shadow-rose-950/20' :
                isWarning 
                  ? 'bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-slate-900 border-amber-500/50 shadow-xl shadow-amber-950/20' :
                'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-2xl ${
                    isHigh ? 'bg-rose-500/20 text-rose-400' :
                    isWarning ? 'bg-amber-500/20 text-amber-400' :
                    'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base flex items-center space-x-2">
                      <span>{alert.title}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        isHigh ? 'bg-rose-500 text-white' :
                        isWarning ? 'bg-amber-500 text-black' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {alert.risk_level}
                      </span>
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      Type: {alert.type} • {alert.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      if (onSaveEvidence) {
                        onSaveEvidence({
                          title: alert.title,
                          item_type: 'Alert',
                          content: alert.description,
                          source: alert.type,
                          risk_level: alert.risk_level,
                          notes: `Recommended step: ${alert.recommended_step}`
                        });
                        alert("Preserved alert to Evidence Vault.");
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Save to Vault</span>
                  </button>
                  <button
                    onClick={() => setActivePage('emergency')}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Get Help</span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {alert.description}
              </p>

              {/* Action Recommendation */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs flex items-start space-x-2">
                <span className="text-cyan-400 font-mono font-bold shrink-0">Action:</span>
                <span className="text-slate-200">{alert.recommended_step}</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
