import { useCallback, useEffect, useState } from 'react';
import {
  Settings as SettingsIcon,
  Server,
  Globe,
  Trash2,
  Download,
  ShieldCheck,
  Info,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

/**
 * Emergency numbers are region-scoped by design (product principle: never
 * hard-code one country's numbers as if they were universal). Users can change
 * this; the choice is stored locally in the browser.
 */
const REGIONS = [
  {
    code: 'IN',
    name: 'India',
    emergency: '112',
    cybercrime: '1930',
    women: '1091',
    portal: 'https://cybercrime.gov.in',
  },
  {
    code: 'US',
    name: 'United States',
    emergency: '911',
    cybercrime: 'IC3 report portal',
    women: 'Domestic Violence Hotline 1-800-799-7233',
    portal: 'https://www.ic3.gov',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    emergency: '999',
    cybercrime: 'Action Fraud 0300 123 2040',
    women: 'National Domestic Abuse Helpline 0808 2000 247',
    portal: 'https://www.actionfraud.police.uk',
  },
  {
    code: 'AU',
    name: 'Australia',
    emergency: '000',
    cybercrime: 'ReportCyber',
    women: '1800 737 732',
    portal: 'https://www.cyber.gov.au',
  },
  {
    code: 'XX',
    name: 'Other / not listed',
    emergency: 'Your local emergency number',
    cybercrime: 'Your national cybercrime portal',
    women: 'Your local support service',
    portal: '',
  },
];

export default function SettingsPage({ setActivePage, onPurgeAll }) {
  const [regionCode, setRegionCode] = useState(() => {
    try {
      return localStorage.getItem('nirakshan.region') || 'IN';
    } catch {
      return 'IN';
    }
  });
  const [backend, setBackend] = useState('checking');

  const checkBackend = useCallback(async () => {
    setBackend('checking');
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
      setBackend(res.ok ? 'online' : 'offline');
    } catch {
      setBackend('offline');
    }
  }, []);

  useEffect(() => {
    checkBackend();
  }, [checkBackend]);

  const setRegion = (code) => {
    setRegionCode(code);
    try {
      localStorage.setItem('nirakshan.region', code);
    } catch {
      /* storage unavailable — the in-memory selection still applies */
    }
  };

  const exportData = () => {
    const payload = {
      exported_at: new Date().toISOString(),
      note: 'NIRAKSHAN prototype export. Contains only data held in this browser session.',
      region: REGIONS.find((r) => r.code === regionCode) || null,
      local_storage_keys: Object.keys(localStorage),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nirakshan-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const purge = () => {
    if (window.confirm('Permanently delete all local analysis records and evidence? This cannot be undone.')) {
      onPurgeAll?.();
    }
  };

  const region = REGIONS.find((r) => r.code === regionCode) || REGIONS[REGIONS.length - 1];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-cyan-400" /> Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure your region, review what runs locally, and control your data.
        </p>
      </div>

      {/* Backend status */}
      <section className="p-6 rounded-3xl bg-[#091122] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" /> Analysis service
          </h2>
          <button
            onClick={checkBackend}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-all"
            aria-label="Re-check backend status"
          >
            <RefreshCw className={`w-4 h-4 ${backend === 'checking' ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          {backend === 'online' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : backend === 'checking' ? (
            <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-200">
              {backend === 'online'
                ? 'Backend connected — analysis is live'
                : backend === 'checking'
                  ? 'Checking backend…'
                  : 'Backend offline — running in simulated mode'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Start it with <span className="font-mono text-cyan-400">uvicorn main:app --port 8000</span> inside the
              backend folder.
            </p>
          </div>
        </div>
      </section>

      {/* Region / emergency numbers */}
      <section className="p-6 rounded-3xl bg-[#091122] border border-slate-800 space-y-4">
        <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" /> Your region
        </h2>
        <p className="text-xs text-slate-400">
          NIRAKSHAN never assumes a single country's emergency number. Choose yours so the Get Help page shows the
          right services.
        </p>
        <select
          value={regionCode}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full sm:w-auto bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
        >
          {REGIONS.map((r) => (
            <option key={r.code} value={r.code} className="bg-slate-900">
              {r.name}
            </option>
          ))}
        </select>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            ['Emergency services', region.emergency],
            ['Cybercrime reporting', region.cybercrime],
            ['Women’s support', region.women],
          ].map(([label, value]) => (
            <div key={label} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <dt className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{label}</dt>
              <dd className="text-xs text-slate-200 mt-1">{value}</dd>
            </div>
          ))}
        </dl>

        {region.portal && (
          <a
            href={region.portal}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Open national reporting portal ↗
          </a>
        )}

        <button
          onClick={() => setActivePage('emergency')}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all"
        >
          Open Get Help page
        </button>
      </section>

      {/* Data controls */}
      <section className="p-6 rounded-3xl bg-[#091122] border border-slate-800 space-y-4">
        <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" /> Your data
        </h2>
        <p className="text-xs text-slate-400">
          You stay in control. Nothing is deleted without your action, and you can wipe local records at any time.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportData}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" /> Export my data
          </button>
          <button
            onClick={() => setActivePage('privacy')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Privacy Center
          </button>
          <button
            onClick={purge}
            className="px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-semibold text-xs flex items-center gap-1.5 border border-rose-500/40 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete all local data
          </button>
        </div>
      </section>

      {/* Prototype disclosure */}
      <section className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
        <h2 className="font-heading text-lg font-bold text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400" /> What is real, and what is a prototype
        </h2>
        <ul className="space-y-2 text-xs text-slate-300">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>The invisible provenance marker and SHA-256 digests are computed for real, in your browser.</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Chat risk scoring is a transparent heuristic engine, not a clinical or legal assessment of any person.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Bluetooth results depend on OS permissions and may be simulated. A missing marker or an unlisted device
              is not proof of anything.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              NIRAKSHAN does not replace police, emergency services, platform moderation, or professional support.
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
