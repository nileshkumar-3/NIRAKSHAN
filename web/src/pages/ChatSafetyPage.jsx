import React, { useState } from 'react';
import { 
  MessageSquareWarning, 
  Send, 
  Trash2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Lock, 
  FileText, 
  Info, 
  Sparkles,
  Scale
} from 'lucide-react';
import { analyzeChatApi } from '../services/api';

export default function ChatSafetyPage({ onSaveEvidence, setActivePage }) {
  const [conversationText, setConversationText] = useState(
`Person A: Where are you?
Person B: I don't want to share my location.
Person A: Tell me now.
Person A: If you don't, you'll regret it.`
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Preset conversation samples for demo
  const samplePresets = [
    {
      label: "🔴 Stalking & Coercion Thread",
      text: `Person A: Where are you?
Person B: I don't want to share my location.
Person A: Tell me now.
Person A: If you don't, you'll regret it.`
    },
    {
      label: "🟠 Sextortion & Blackmail Threat",
      text: `Person A: Send more photos right now or I will post what you sent me earlier online.
Person B: Please stop, don't do this.
Person A: You have no choice. Answer me immediately.`
    },
    {
      label: "🟢 Standard Friendly Discussion",
      text: `Friend: Hey! Are you free for coffee tomorrow at 4pm?
Me: Yes, that sounds great! Where should we meet?
Friend: Let's meet at Blue Tokai. See you then!`
    }
  ];

  const handleAnalyze = async () => {
    if (!conversationText.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    setSavedSuccess(false);

    const data = await analyzeChatApi(conversationText);
    setTimeout(() => {
      setResult(data);
      setIsAnalyzing(false);
    }, 600);
  };

  const handleDeleteAnalysis = () => {
    setConversationText('');
    setResult(null);
    setSavedSuccess(false);
  };

  const handleSaveToVault = () => {
    if (!result) return;
    if (onSaveEvidence) {
      onSaveEvidence({
        title: `Chat Risk Audit (${result.risk_level})`,
        item_type: 'Conversation',
        content: conversationText,
        source: 'Safe Chat Auditor',
        risk_level: result.risk_level,
        notes: `Indicators flagged: ${result.indicators.map(i => i.title).join(', ')}. Calculated risk score: ${result.risk_score}/100.`
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Chat Safety & Coercion Threat Auditor
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded-full">
              Consent-First NLP
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Detects coercive ultimatums, repeated location tracking queries, and intimidation cues in conversation transcripts.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setConversationText(preset.text);
                setResult(null);
              }}
              className="text-[11px] font-mono px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/40 transition-all cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Input Area (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#091122] border border-slate-800 space-y-4 flex flex-col justify-between">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Paste Chat Transcript or Direct Messages
              </label>
              <button
                onClick={() => setConversationText('')}
                className="text-[10px] font-mono text-slate-400 hover:text-rose-400 flex items-center space-x-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>

            <textarea
              value={conversationText}
              onChange={(e) => setConversationText(e.target.value)}
              placeholder="Paste conversation text here (e.g. Person A: Where are you? / Person B: I don't want to share...)"
              className="w-full h-64 bg-[#050A14] border border-slate-700 focus:border-cyan-500 rounded-2xl p-4 text-xs sm:text-sm font-sans text-slate-100 placeholder-slate-600 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !conversationText.trim()}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-600 to-indigo-600 hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
              >
                <MessageSquareWarning className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Evaluating Threat Patterns...' : 'Audit Conversation'}</span>
              </button>

              <button
                onClick={handleDeleteAnalysis}
                className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-800 flex items-center space-x-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Analysis</span>
              </button>
            </div>

            {/* Consent & Privacy Notice */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400 leading-snug">
              <b>Privacy Guarantee:</b> “Your conversation should only be analyzed with your consent. Avoid uploading sensitive conversations unnecessarily.” All evaluation occurs strictly in transient local memory.
            </div>
          </div>

        </div>

        {/* Right Audit Results Area (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-gradient-to-b from-[#0B152A] to-[#091122] border border-cyan-500/30 space-y-5 flex flex-col justify-between">
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
                Risk Analysis Breakdown
              </span>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>

            {result ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                
                {/* Risk Level Badge and Score Header */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                  result.risk_level === 'HIGH' ? 'bg-rose-950/40 border-rose-500/50' :
                  result.risk_level === 'MEDIUM' ? 'bg-amber-950/40 border-amber-500/50' :
                  'bg-emerald-950/40 border-emerald-500/50'
                }`}>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300">Risk Level</span>
                    <h3 className={`text-2xl font-black font-heading ${
                      result.risk_level === 'HIGH' ? 'text-rose-400' :
                      result.risk_level === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {result.risk_level}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Threat Score</span>
                    <p className="text-3xl font-black font-mono text-white">
                      {result.risk_score} <span className="text-sm text-slate-400 font-normal">/ 100</span>
                    </p>
                  </div>
                </div>

                {/* Non-Accusatory Diagnostic Statement */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-semibold text-cyan-200">
                  🛡️ “{result.statement}”
                </div>

                {/* Detected Risk Indicators */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase font-mono">
                    Flagged Behavioral Indicators ({result.indicators.length})
                  </h4>

                  {result.indicators.length > 0 ? (
                    <div className="space-y-2">
                      {result.indicators.map((ind) => (
                        <div key={ind.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span>{ind.title}</span>
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-rose-500/20 text-rose-300 rounded">
                              {ind.match_count} trigger(s)
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{ind.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>No coercive or threatening language patterns identified.</span>
                    </div>
                  )}
                </div>

                {/* Actionable Recommendations */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-slate-200 font-mono">Recommended Next Steps:</span>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                    {result.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>

              </div>
            ) : (
              <div className="p-10 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <MessageSquareWarning className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-400">
                  Paste a conversation on the left or select a sample preset to evaluate intimidation and coercion indicators.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          {result && (
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
              <button
                onClick={handleSaveToVault}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center justify-center space-x-1.5 border border-slate-700 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Save to Evidence Vault</span>
              </button>

              {savedSuccess && (
                <span className="text-xs font-mono text-emerald-400 animate-in fade-in">
                  ✅ Saved to Vault!
                </span>
              )}

              <button
                onClick={() => setActivePage('emergency')}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Get Help</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
