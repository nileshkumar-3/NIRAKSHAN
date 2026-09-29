import React from 'react';
import { Shield, Lock, PhoneCall, ExternalLink, HeartHandshake, EyeOff, Radio } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="w-full bg-[#04070D] border-t border-slate-800/80 text-slate-400 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Statement Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0B1528] to-slate-900/90 border border-cyan-500/20 mb-12 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <p className="text-sm font-semibold text-cyan-400 font-mono uppercase tracking-wider mb-1">
                A Mission for Women's Digital Sovereignty
              </p>
              <h3 className="font-heading text-lg md:text-xl font-bold text-white leading-relaxed">
                “We taught people how to stay safe on the streets. <br className="hidden sm:inline" />
                <span className="text-rose-400 font-extrabold">NIRAKSHAN asks: who protects them from threats on the screen?”</span>
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => setActivePage('emergency')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-rose-900/40 hover:from-rose-500 hover:to-rose-600 transition-all cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Emergency Helplines (1930 / 1091)</span>
              </button>
              <button
                onClick={() => setActivePage('how-it-works')}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-medium text-xs border border-slate-700 transition-all cursor-pointer"
              >
                Architecture & Principles
              </button>
            </div>
          </div>
        </div>

        {/* 4 Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Central Message */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="font-heading text-lg font-bold text-white">NIRAKSHAN</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-Powered Digital Safety Shield engineered to prevent image-based abuse, rogue Bluetooth stalking, and online coercion before they manifest into physical danger.
            </p>
            <div className="inline-block px-2.5 py-1 bg-cyan-950/60 border border-cyan-500/30 rounded text-[11px] font-mono text-cyan-300">
              “Digital Safety is Physical Safety.”
            </div>
          </div>

          {/* Col 2: Core Modules */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 font-mono">
              Defense Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActivePage('image-shield')} className="hover:text-cyan-400 transition-colors">
                  AI Image Protection & Provenance
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('tracker-scan')} className="hover:text-cyan-400 transition-colors">
                  BLE Tracker Sonar & Radar Scan
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('chat-safety')} className="hover:text-cyan-400 transition-colors">
                  Safe Chat Threat Auditor
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('evidence')} className="hover:text-cyan-400 transition-colors">
                  Cryptographic Evidence Vault
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('privacy')} className="hover:text-cyan-400 transition-colors">
                  Zero-Knowledge Privacy Center
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Support Helplines */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 font-mono">
              Official Helplines (India)
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between">
                <span>National Cyber Crime Helpline:</span>
                <span className="font-mono font-bold text-rose-400">1930</span>
              </li>
              <li className="flex items-center justify-between">
                <span>National Women Helpline:</span>
                <span className="font-mono font-bold text-amber-400">1091 / 181</span>
              </li>
              <li className="flex items-center justify-between">
                <span>National Emergency Number:</span>
                <span className="font-mono font-bold text-emerald-400">112</span>
              </li>
              <li className="pt-1">
                <a 
                  href="https://cybercrime.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center space-x-1 text-cyan-400 hover:underline"
                >
                  <span>cybercrime.gov.in</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Ethical Commitments */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 font-mono">
              Ethical Guardrails
            </h4>
            <div className="space-y-2 text-[11px] text-slate-400 leading-snug">
              <div className="flex items-start space-x-2">
                <EyeOff className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>Zero cloud storage. 100% on-device processing.</span>
              </div>
              <div className="flex items-start space-x-2">
                <Lock className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>User maintains total custody & instant data deletion.</span>
              </div>
              <div className="flex items-start space-x-2">
                <HeartHandshake className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>Non-accusatory risk indexing; supportive alerting.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Disclaimer and Copyright */}
        <div className="border-t border-slate-800/60 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>
            © 2026 NIRAKSHAN Shield. Prototype built for digital safety advocacy. Not a replacement for official law enforcement or emergency services.
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 font-mono">Status: All Defense Nodes Operational</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>

      </div>
    </footer>
  );
}
