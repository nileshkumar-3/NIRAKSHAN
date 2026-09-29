import React from 'react';
import { 
  Shield, 
  Cpu, 
  Radio, 
  MessageSquareWarning, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  EyeOff, 
  Flame, 
  Smartphone, 
  Layers,
  ChevronRight,
  Activity,
  PhoneCall
} from 'lucide-react';

export default function LandingPage({ setActivePage, openMobileSim, openExtSim }) {
  return (
    <div className="space-y-24 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        
        {/* Background Cyber Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-indigo-600/15 to-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          
          {/* Badge Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-lg shadow-cyan-950/50">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>NIRAKSHAN 2.0 • AI-Powered Digital Safety Shield</span>
          </div>

          {/* Hero Heading */}
          <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Your Digital World <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-200 to-rose-400 bg-clip-text text-transparent">
              Deserves a Shield.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            NIRAKSHAN detects emerging digital threats before they become real-world safety problems.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActivePage('dashboard')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-rose-500 text-white font-bold text-sm flex items-center space-x-2 shadow-lg shadow-cyan-900/40 hover:shadow-cyan-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Activity className="w-4 h-4" />
              <span>Open Safety Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActivePage('image-shield')}
              className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-semibold text-sm flex items-center space-x-2 border border-slate-700 hover:border-cyan-500/50 transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Check an Image</span>
            </button>

            <button
              onClick={() => setActivePage('demo')}
              className="px-5 py-3.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-sm flex items-center space-x-2 border border-rose-500/40 transition-all cursor-pointer"
            >
              <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Launch Live Demo</span>
            </button>
          </div>

          {/* Core Philosophy Callout */}
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400 pt-2">
            “Digital Safety is Physical Safety.”
          </p>

        </div>

        {/* VISUAL DASHBOARD PREVIEW MOCKUP */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#0F1B35] to-[#070D18] border border-cyan-500/30 p-4 sm:p-6 shadow-2xl shadow-cyan-950/60 overflow-hidden group">
            
            {/* Window header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">NIRAKSHAN Defense Terminal — Active Sweep</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-time Active Defense</span>
                </span>
              </div>
            </div>

            {/* Mock Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              
              {/* Card 1: Safety Score */}
              <div className="p-4 rounded-2xl bg-[#091122]/90 border border-cyan-500/30 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Digital Safety Score</span>
                  <div className="flex items-baseline space-x-1 my-2">
                    <span className="text-3xl font-extrabold font-heading text-white">82</span>
                    <span className="text-xs font-mono text-slate-400">/ 100</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-xs text-emerald-400 font-semibold bg-emerald-950/50 px-2 py-1 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Protected</span>
                </div>
              </div>

              {/* Card 2: AI Image Protection */}
              <div className="p-4 rounded-2xl bg-[#091122]/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono text-slate-400 uppercase">AI Image Shield</span>
                    <Shield className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-base font-bold text-white mt-1">Active</p>
                  <p className="text-[11px] text-slate-400 mt-1">24 photos cryptographically sealed</p>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">DWT-LSB Injected</span>
              </div>

              {/* Card 3: Tracker Detection */}
              <div className="p-4 rounded-2xl bg-[#091122]/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono text-slate-400 uppercase">Tracker Radar</span>
                    <Radio className="w-4 h-4 text-indigo-400" />
                  </div>
                  <p className="text-base font-bold text-white mt-1">Safe</p>
                  <p className="text-[11px] text-slate-400 mt-1">No unknown trackers detected</p>
                </div>
                <span className="text-[10px] font-mono text-indigo-400">2.4GHz BLE Sweep</span>
              </div>

              {/* Card 4: Chat Risk */}
              <div className="p-4 rounded-2xl bg-[#091122]/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono text-slate-400 uppercase">Chat Safety</span>
                    <MessageSquareWarning className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-base font-bold text-white mt-1">Low Risk</p>
                  <p className="text-[11px] text-slate-400 mt-1">Zero active coercive threads</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">Local NLP Heuristic</span>
              </div>

              {/* Card 5: Evidence Vault */}
              <div className="p-4 rounded-2xl bg-[#091122]/90 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-mono text-slate-400 uppercase">Evidence Vault</span>
                    <Lock className="w-4 h-4 text-rose-400" />
                  </div>
                  <p className="text-base font-bold text-white mt-1">7 Protected Items</p>
                  <p className="text-[11px] text-slate-400 mt-1">SHA-256 Verified</p>
                </div>
                <span className="text-[10px] font-mono text-rose-400">Dossier Ready</span>
              </div>

            </div>

            {/* Quick interactive hint */}
            <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
              <span>Interactive prototype with live simulated hardware BLE radar and steganography canvas.</span>
              <button 
                onClick={() => setActivePage('dashboard')} 
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <span>Launch Interactive Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* WHY NIRAKSHAN SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-4 mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Paradigm Shift</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
            WHY NIRAKSHAN?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Traditional safety systems focus mainly on physical emergencies when danger is already at your doorstep. NIRAKSHAN focuses on the digital layer that precedes it.
          </p>
          <div className="inline-block px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-950 via-slate-900 to-rose-950 border border-cyan-500/30 text-sm font-semibold text-white">
            “From streets to screens — safety needs both.”
          </div>
        </div>

        {/* 5 Threat Vectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl bg-[#091122] border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white">AI Image Manipulation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Protects personal photos with invisible provenance watermarks to prove authentic ownership against AI nudification and deepfake face-swapping.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#091122] border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Radio className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white">Unknown Bluetooth Trackers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Detects persistent rogue BLE beacons and hidden tags tracking your real-world physical movements across multiple locations.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#091122] border border-slate-800 hover:border-rose-500/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <MessageSquareWarning className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white">Coercive Chat & Extortion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Audits text conversations for coercive control, aggressive location demands, sextortion ultimatums, and intimidation cues.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#091122] border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white">Cryptographic Evidence Vault</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates SHA-256 hashed incident dossiers with timestamps, incident transcripts, and legal section mappings for cybercrime filing.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#091122] border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white">Browser Sentinel Extension</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Warns users before uploading photos to suspicious AI morphing domains and provides 1-click domain threat reporting.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#091122] border border-slate-800 hover:border-rose-500/40 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white">Zero-Knowledge On-Device</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero cloud telemetry storage. All NLP and image computations run strictly in client memory under total user sovereignty.
            </p>
          </div>

        </div>
      </section>

      {/* PLATFORM TRIFECTA SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0B152A] via-[#09101F] to-[#080D1A] border border-cyan-500/20 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Cross-Platform Defense</span>
              <h3 className="font-heading text-2xl font-bold text-white">
                Three Connected Interfaces, One Shield
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={openMobileSim}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Simulate Mobile App</span>
              </button>
              <button
                onClick={openExtSim}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Simulate Extension</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <p className="text-xs font-bold text-cyan-400 font-mono">1. Desktop Web Dashboard</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Full-featured security operations center for deepfake verification, dossier generation, and risk diagnostics.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <p className="text-xs font-bold text-indigo-400 font-mono">2. Mobile Application</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                On-the-go BLE tracker radar, real-time proximity alerts, locator chimes, and instant emergency contacts.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <p className="text-xs font-bold text-rose-400 font-mono">3. Browser Extension</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Proactive web sentinel intercepting image uploads on unauthorized AI morphing sites and rogue services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
          Ready to experience the next generation of digital safety?
        </h3>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Explore the interactive dashboard, test image watermarking, audit conversations, and run the competition demo suite.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setActivePage('dashboard')}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-sm shadow-xl shadow-cyan-900/40 hover:scale-105 transition-all cursor-pointer"
          >
            Launch Safety Dashboard
          </button>
        </div>
      </section>

    </div>
  );
}
