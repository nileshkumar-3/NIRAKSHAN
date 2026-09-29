import React from 'react';
import { 
  Compass, 
  ArrowRight, 
  Shield, 
  Cpu, 
  AlertTriangle, 
  Bell, 
  Lock, 
  UserCheck, 
  Scale, 
  HeartHandshake, 
  EyeOff,
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function HowItWorksPage({ setActivePage }) {
  const pipelineSteps = [
    {
      num: "01",
      title: "DIGITAL THREAT",
      icon: AlertTriangle,
      color: "from-rose-500 to-amber-500",
      desc: "An emerging vector occurs: deepfake synthesis attempt, rogue Bluetooth beacon proximity, or coercive chat messages."
    },
    {
      num: "02",
      title: "DETECTION",
      icon: Cpu,
      color: "from-amber-500 to-cyan-500",
      desc: "NIRAKSHAN multi-modal sensors identify spectral anomalies: DWT marker check, RF RSSI correlation, or NLP pattern match."
    },
    {
      num: "03",
      title: "RISK ANALYSIS",
      icon: Shield,
      color: "from-cyan-500 to-indigo-500",
      desc: "Calculates a non-accusatory threat score (0-100) and itemizes risk indicators (pressure, intimidation, spatial tracking)."
    },
    {
      num: "04",
      title: "USER ALERT",
      icon: Bell,
      color: "from-indigo-500 to-purple-500",
      desc: "Presents clear, supportive guidance without panic. Advises on physical relocation or setting boundary assertions."
    },
    {
      num: "05",
      title: "EVIDENCE PRESERVATION",
      icon: Lock,
      color: "from-purple-500 to-rose-500",
      desc: "SHA-256 seals timestamps, file checksums, and transcripts into the local Evidence Vault under complete user custody."
    },
    {
      num: "06",
      title: "USER DECISION",
      icon: UserCheck,
      color: "from-rose-500 to-emerald-500",
      desc: "User remains in full control. The system never takes automated actions against third parties without explicit consent."
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 text-xs font-mono text-cyan-400 border border-cyan-500/30">
          <Compass className="w-3.5 h-3.5" />
          <span>Competition Presentation & Architecture Flow</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white">
          How NIRAKSHAN Protects Users
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          A proactive digital safety architecture designed to detect, analyze, and preserve evidence while keeping the user in absolute sovereignty.
        </p>
      </div>

      {/* 6-Stage Visual Architecture Flow Pipeline */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-6 rounded-3xl bg-[#091122] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-slate-600 group-hover:text-cyan-400 transition-colors">
                    {step.num}
                  </span>
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${step.color} p-0.5 shadow-md`}>
                    <div className="w-full h-full bg-[#091122] rounded-[14px] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-heading text-base font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center text-[10px] font-mono text-cyan-400">
                  <span>Phase {step.num} of Defense Lifecycle</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Core Product Principles Comparison Card */}
      <div className="max-w-5xl mx-auto p-8 rounded-3xl bg-gradient-to-b from-[#0B172E] to-[#080E1B] border border-cyan-500/30 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Ethical AI Framework</span>
          <h2 className="font-heading text-2xl font-bold text-white">
            Ethical Guardrails & Responsible AI Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-rose-400 font-bold">
              <EyeOff className="w-4 h-4" />
              <span>What NIRAKSHAN Never Does</span>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-slate-300">
              <li>Never claims 100% infallible deepfake detection.</li>
              <li>Never labels all Bluetooth devices as trackers.</li>
              <li>Never secretly reads messages or uploads photos without consent.</li>
              <li>Never automatically retaliates or takes actions against third parties.</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>What NIRAKSHAN Guarantees</span>
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-slate-300">
              <li>100% on-device local execution and client memory sandboxing.</li>
              <li>Cryptographic SHA-256 tamper-evident integrity chaining.</li>
              <li>Instant user-controlled evidence and analysis purging.</li>
              <li>Direct routing to official verified national helplines (1930 / 1091).</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => setActivePage('demo')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-rose-500 text-white font-bold text-xs shadow-lg shadow-cyan-950 hover:scale-105 transition-all cursor-pointer inline-flex items-center space-x-2"
          >
            <Flame className="w-4 h-4 text-rose-300 animate-pulse" />
            <span>Launch Live Interactive Competition Demo</span>
          </button>
        </div>
      </div>

    </div>
  );
}
