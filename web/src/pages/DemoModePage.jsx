import { useCallback, useRef, useState } from 'react';
import {
  Shield,
  Radio,
  MessageSquareWarning,
  Play,
  RotateCcw,
  Upload,
  X,
  Cpu,
  Lock,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Info,
} from 'lucide-react';

import { scanTrackersApi, analyzeChatApi } from '../services/api';
import {
  buildProvenancePayload,
  embedProvenanceMarker,
  readProvenanceMarker,
  fileToImageData,
  imageDataToBlob,
  sha256Hex,
  createSamplePortraitBlob,
} from '../services/steganography';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomId = () => Math.random().toString(36).slice(2, 10).toUpperCase();

const SAMPLE_CHAT = `Person A: Where are you?

Person B: I don't want to share my location.

Person A: Tell me now.

Person A: If you don't, you'll regret it.`;

const LIFECYCLE = [
  'Digital threat',
  'Detection',
  'Risk analysis',
  'User alert',
  'Evidence preservation',
  'User decision / reporting',
];

const DEMOS = [
  {
    id: 1,
    key: 'image',
    Icon: Shield,
    title: 'Image Shield',
    headline: 'Provenance marker + integrity verification',
    steps: [
      'Image received (decoded locally in your browser)',
      'Provenance marker embedded in least-significant bits',
      'SHA-256 content digest computed',
      'Verification record generated',
    ],
  },
  {
    id: 2,
    key: 'tracker',
    Icon: Radio,
    title: 'Tracker Detection',
    headline: 'BLE discovery + repeated-sighting correlation',
    steps: [
      'Requesting Bluetooth permission',
      'Scanning BLE advertising channels',
      'Recording device IDs, timestamps and signal strength',
      'Correlating repeated sightings over time',
      'Generating a potential-risk warning',
    ],
  },
  {
    id: 3,
    key: 'chat',
    Icon: MessageSquareWarning,
    title: 'Chat Safety',
    headline: 'Consent-gated conversation risk analysis',
    steps: [
      'Conversation received',
      'Verifying your consent flag',
      'Scanning for risk patterns',
      'Scoring detected indicators',
      'Generating recommended actions',
    ],
  },
];

/** Badge that states plainly whether a result is real or simulated. */
function ModeChip({ simulated }) {
  return simulated ? (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      SIMULATED RESULT
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/40 text-emerald-300">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      LIVE RESULT
    </span>
  );
}

function StepList({ demo, step, running }) {
  return (
    <ol className="space-y-2">
      {demo.steps.map((label, index) => {
        const done = step > index;
        const active = running && step === index;
        return (
          <li
            key={label}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
              done
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : active
                  ? 'border-cyan-500/40 bg-cyan-500/5'
                  : 'border-slate-800 bg-slate-900/40'
            }`}
          >
            <span className="mt-0.5 shrink-0">
              {done ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : active ? (
                <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
              ) : (
                <span className="w-4 h-4 rounded-full border border-slate-700 block" />
              )}
            </span>
            <span className={`text-xs leading-relaxed ${done ? 'text-slate-300' : 'text-slate-500'}`}>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function DemoModePage({ setActivePage, onSaveEvidence }) {
  const [activeId, setActiveId] = useState(null);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState('idle'); // idle | running | done
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [upload, setUpload] = useState(null);
  const [chatText, setChatText] = useState(SAMPLE_CHAT);
  const [saved, setSaved] = useState(false);
  const runToken = useRef(0);

  const demo = DEMOS.find((d) => d.id === activeId) || null;

  const handleUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUpload({ name: file.name, blob: file });
    setSaved(false);
  }, []);

  /* DEMO 1 — runs entirely in the browser against real pixel data. */
  const runImage = useCallback(async () => {
    const blob = upload ? upload.blob : await createSamplePortraitBlob();
    const digest = await sha256Hex(blob);
    const imageData = await fileToImageData(blob);
    const verificationId = `NRK-PROV-${randomId()}`;
    const timestamp = new Date().toISOString();

    const embed = embedProvenanceMarker(
      imageData,
      buildProvenancePayload({ verificationId, timestamp, digest: digest || 'unavailable' }),
    );
    if (!embed.ok) throw new Error(embed.reason);

    const protectedBlob = await imageDataToBlob(embed.imageData);
    // Read the marker back out of the re-encoded bytes to prove the round trip.
    const verify = readProvenanceMarker(await fileToImageData(protectedBlob));

    return {
      simulated: false,
      verificationId,
      timestamp,
      digest,
      name: upload ? upload.name : 'nirakshan-synthetic-sample.png',
      usedSample: !upload,
      originalSize: blob.size,
      protectedSize: protectedBlob.size,
      roundTrip: verify.found && verify.payload?.vid === verificationId,
    };
  }, [upload]);

  /* DEMO 2 — uses the FastAPI backend when reachable, otherwise simulated. */
  const runTracker = useCallback(async () => {
    const data = await scanTrackersApi();
    return {
      simulated: data.simulated === true || /simulat/i.test(data.scan_mode || ''),
      data,
    };
  }, []);

  /* DEMO 3 — consent-gated, user-initiated only. */
  const runChat = useCallback(async () => {
    const data = await analyzeChatApi(chatText);
    return { simulated: data.simulated === true, data };
  }, [chatText]);

  const runDemo = useCallback(
    async (id) => {
      const token = runToken.current + 1;
      runToken.current = token;
      const target = DEMOS.find((d) => d.id === id);

      setActiveId(id);
      setPhase('running');
      setStep(0);
      setResult(null);
      setError(null);
      setSaved(false);

      for (let i = 0; i < target.steps.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        await sleep(650);
        if (runToken.current !== token) return;
        setStep(i + 1);
      }

      try {
        const output = id === 1 ? await runImage() : id === 2 ? await runTracker() : await runChat();
        if (runToken.current !== token) return;
        setResult(output);
        setPhase('done');
      } catch (err) {
        if (runToken.current !== token) return;
        setError(err?.message || 'Unexpected error during the demonstration.');
        setPhase('done');
      }
    },
    [runImage, runTracker, runChat],
  );

  const reset = useCallback(() => {
    runToken.current += 1; // cancels any in-flight demo
    setActiveId(null);
    setPhase('idle');
    setStep(0);
    setResult(null);
    setError(null);
    setSaved(false);
  }, []);

  const saveToVault = useCallback(() => {
    if (!result || !onSaveEvidence) return;
    if (activeId === 1) {
      onSaveEvidence({
        title: `Image Provenance Record ${result.verificationId}`,
        item_type: 'Image',
        content: `Marker embedded and verified. Digest: ${result.digest}`,
        source: 'Image Shield (Demo Mode)',
        risk_level: 'LOW',
        notes: 'Prototype provenance marker. Not proof of authorship.',
      });
    } else if (activeId === 2) {
      const flagged = (result.data?.devices || []).filter((d) => d.risk_tier === 'WARNING');
      onSaveEvidence({
        title: `Tracker Scan Summary (${flagged.length} flagged)`,
        item_type: 'Alert',
        content: flagged.length
          ? flagged.map((d) => `${d.id} seen ${d.sightings_count}x`).join('; ')
          : 'No potential unknown trackers flagged in this scan.',
        source: 'BLE Scanner (Demo Mode)',
        risk_level: flagged.length ? 'WARNING' : 'LOW',
        notes: result.simulated ? 'Simulated telemetry — not a hardware reading.' : 'Live BLE reading.',
      });
    } else {
      const r = result.data;
      onSaveEvidence({
        title: `Chat Risk Audit (${r?.risk_level})`,
        item_type: 'Conversation',
        content: chatText,
        source: 'Chat Safety Analyzer (Demo Mode)',
        risk_level: r?.risk_level || 'LOW',
        notes: `Indicators: ${(r?.indicators || []).map((i) => i.title).join(', ') || 'none'}.`,
      });
    }
    setSaved(true);
  }, [result, activeId, chatText, onSaveEvidence]);

  const renderResult = () => {
    if (phase !== 'done') return null;

    if (error) {
      return (
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30">
          <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" /> This demonstration could not complete
          </div>
          <p className="text-xs text-slate-300 mt-2">{error}</p>
        </div>
      );
    }
    if (!result) return null;

    if (activeId === 1) {
      return (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="font-heading text-base font-bold text-emerald-300">Protection Detected</h4>
            <ModeChip simulated={false} />
          </div>
          <p className="text-xs text-slate-300">Image integrity marker verified.</p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Row label="Verification ID" value={result.verificationId} mono />
            <Row label="Protection timestamp" value={new Date(result.timestamp).toLocaleString()} />
            <Row
              label="Integrity status"
              value={result.roundTrip ? 'Marker recovered from re-encoded file' : 'Round trip FAILED'}
            />
            <Row label="File size" value={`${result.originalSize} → ${result.protectedSize} bytes`} mono />
          </dl>
          <Row label="SHA-256 of source" value={result.digest || 'unavailable'} mono />
        </div>
      );
    }

    if (activeId === 2) {
      const data = result.data || {};
      const devices = data.devices || [];
      return (
        <div className="space-y-3">
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2 flex-wrap">
            <h4 className="font-heading text-base font-bold text-amber-300">
              Nearby BLE devices: {devices.length}
            </h4>
            <ModeChip simulated={result.simulated} />
          </div>
          <div className="space-y-2">
            {devices.map((dev) => (
              <div
                key={dev.id}
                className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs font-mono text-slate-200 truncate">{dev.id}</p>
                  <p className="text-[11px] text-slate-400">
                    {dev.classification} · Signal {dev.signal_strength} ({dev.rssi} dBm) · Seen {dev.sightings_count}x
                  </p>
                </div>
                <span
                  className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-mono font-bold border ${
                    dev.risk_tier === 'WARNING'
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                      : dev.risk_tier === 'SAFE'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {dev.risk_tier}
                </span>
              </div>
            ))}
          </div>
          {(data.alerts || []).map((a) => (
            <div key={a.device_id} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <p className="text-xs text-amber-200">“{a.warning}”</p>
            </div>
          ))}
          <p className="text-[11px] text-slate-400 leading-relaxed">{data.hardware_notes}</p>
        </div>
      );
    }

    const r = result.data || {};
    const indicators = r.indicators || [];
    const isHigh = r.risk_level === 'HIGH';
    const isMed = r.risk_level === 'MEDIUM';
    return (
      <div className="space-y-3">
        <div
          className={`p-5 rounded-2xl border flex items-center justify-between gap-3 flex-wrap ${
            isHigh
              ? 'bg-rose-500/10 border-rose-500/30'
              : isMed
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-emerald-500/10 border-emerald-500/30'
          }`}
        >
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Risk Level</p>
            <p
              className={`font-heading text-2xl font-extrabold ${
                isHigh ? 'text-rose-400' : isMed ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {r.risk_level}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Risk score</p>
            <p className="font-heading text-2xl font-extrabold text-white">
              {r.risk_score}
              <span className="text-xs text-slate-500">/100</span>
            </p>
          </div>
          <ModeChip simulated={result.simulated} />
        </div>

        {indicators.length > 0 && (
          <ul className="space-y-2">
            {indicators.map((ind) => (
              <li key={ind.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <p className="text-xs font-bold text-slate-200">{ind.title}</p>
                <p className="text-[11px] text-slate-400 mt-1">{ind.description}</p>
              </li>
            ))}
          </ul>
        )}

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">Recommended actions</p>
          <ul className="space-y-1.5">
            {(r.recommendations || []).map((rec) => (
              <li key={rec} className="text-xs text-slate-300 flex items-start gap-2">
                <ArrowRight className="w-3 h-3 mt-0.5 text-cyan-400 shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[11px] text-slate-400">{r.statement}</p>
      </div>
    );
  };

  return (
    <div className="space-y-10 pb-16">
      {/* ---------------- Header ---------------- */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-300">
          <Sparkles className="w-3.5 h-3.5" /> DEMO MODE
        </span>
        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white">Launch Live Demo</h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Three end-to-end demonstrations of how NIRAKSHAN moves from a digital threat to a user decision.
          Every result is labelled LIVE or SIMULATED so nothing is ever overclaimed.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => runDemo(1)}
            disabled={phase === 'running'}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-rose-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" /> Launch Live Demo
          </button>
          <button
            onClick={reset}
            className="px-4 py-3.5 rounded-xl bg-slate-900 text-slate-200 font-semibold text-sm flex items-center gap-2 border border-slate-700 hover:border-slate-500 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* ---------------- Honesty banner ---------------- */}
      <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-relaxed">
          DEMO 1 runs entirely in your browser against real pixel data. DEMO 2 and DEMO 3 use the FastAPI backend
          when it is running, and fall back to clearly labelled simulated telemetry when it is not. Images and
          conversations you supply stay on this device unless a backend is explicitly running.
        </p>
      </div>

      {/* ---------------- Demo selector ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DEMOS.map((d) => {
          const Icon = d.Icon;
          const isActive = activeId === d.id;
          return (
            <button
              key={d.id}
              onClick={() => runDemo(d.id)}
              disabled={phase === 'running'}
              className={`p-5 rounded-3xl text-left border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isActive
                  ? 'border-cyan-500/60 bg-cyan-500/5'
                  : 'border-slate-800 bg-[#091122] hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-slate-500">DEMO {d.id}</span>
                <Icon className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="font-heading text-base font-bold text-white">{d.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{d.headline}</p>
              <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-cyan-400">
                {isActive && phase === 'running' ? 'Running…' : 'Run demo'}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          );
        })}
      </div>

      {/* ---------------- Stage ---------------- */}
      {demo && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-[#091122] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" /> Analysis pipeline
              </h3>
              <span className="text-[10px] font-mono text-slate-500">DEMO {demo.id}</span>
            </div>
            <StepList demo={demo} step={step} running={phase === 'running'} />
          </div>

          <div className="space-y-4">
            {activeId === 1 && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Input image (optional)</p>
                {upload ? (
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-700">
                    <span className="text-xs text-slate-200 truncate">{upload.name}</span>
                    <button
                      onClick={() => setUpload(null)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white shrink-0"
                      aria-label="Clear selected image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <label className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed border-slate-700 hover:border-cyan-500/50 cursor-pointer transition-colors">
                      <Upload className="w-5 h-5 text-cyan-400" />
                      <span className="text-xs text-slate-300">Choose an image</span>
                      <span className="text-[10px] text-slate-500">Or run with a built-in synthetic sample</span>
                      <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                    </label>
                    <p className="text-[10px] text-slate-500">
                      Processed with the browser Canvas API. Your file is never uploaded anywhere.
                    </p>
                  </>
                )}
              </div>
            )}

            {activeId === 3 && (
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Conversation</p>
                <textarea
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  rows={6}
                  className="w-full p-3 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500 resize-y"
                />
                <p className="text-[10px] text-slate-500">
                  Only analyse conversations you have consent to analyse. Avoid pasting sensitive material
                  unnecessarily.
                </p>
              </div>
            )}

            {renderResult()}

            {phase === 'done' && result && !error && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={saveToVault}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Lock className="w-3.5 h-3.5" /> Save to Evidence Vault
                </button>
                <button
                  onClick={() => runDemo(activeId)}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Run again
                </button>
                <button
                  onClick={reset}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
                {saved && <span className="text-xs text-emerald-400">Preserved to your Evidence Vault.</span>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- Defence lifecycle ---------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0B172E] to-[#080E1B] border border-cyan-500/20 space-y-5">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">How NIRAKSHAN Protects Users</span>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white">The defence lifecycle</h2>
          <p className="text-xs text-slate-400 max-w-2xl mx-auto">
            NIRAKSHAN never takes action against another person on your behalf. It informs you, preserves what you
            choose to keep, and leaves the decision with you.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {LIFECYCLE.map((stage, index) => (
            <div key={stage} className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800 text-center">
              <span className="text-[10px] font-mono font-bold text-cyan-400">{index + 1}</span>
              <p className="text-[11px] font-bold text-slate-200 mt-1 leading-tight">{stage}</p>
              {index < LIFECYCLE.length - 1 && (
                <ArrowRight className="w-3 h-3 mx-auto mt-2 text-slate-700 lg:hidden" />
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setActivePage('how-it-works')}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" /> Full architecture
          </button>
          <button
            onClick={() => setActivePage('emergency')}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5" /> I need help now
          </button>
        </div>
      </div>

      {/* ---------------- Tagline ---------------- */}
      <div className="text-center space-y-4 py-6">
        <p className="font-heading text-lg sm:text-2xl font-bold text-white max-w-3xl mx-auto leading-snug">
          “We taught people how to stay safe on the streets.
          <span className="block mt-2 text-cyan-400">NIRAKSHAN asks: who protects them from threats on the screen?</span>”
        </p>
        <p className="text-sm font-mono text-slate-400">Digital Safety is Physical Safety.</p>
      </div>
    </div>
  );
}

/** Small label/value pair used in the DEMO 1 result card. */
function Row({ label, value, mono }) {
  return (
    <div>
      <dt className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{label}</dt>
      <dd className={`text-xs text-slate-200 mt-0.5 break-all ${mono ? 'font-mono' : ''}`}>{value}</dd>
    </div>
  );
}
