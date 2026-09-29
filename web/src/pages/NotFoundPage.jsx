import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage({ setActivePage }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-5 py-20">
      <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
        <ShieldAlert className="w-8 h-8 text-amber-400" />
      </div>
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-extrabold text-white">Page not found</h1>
        <p className="text-sm text-slate-400 max-w-md">
          That address is not part of NIRAKSHAN. Nothing was lost — pick up where you left off below.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setActivePage('dashboard')}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs flex items-center gap-2 transition-all hover:scale-[1.02]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
        </button>
        <button
          onClick={() => setActivePage('landing')}
          className="px-5 py-3 rounded-xl bg-slate-900 text-slate-200 font-semibold text-xs flex items-center gap-2 border border-slate-700 transition-all"
        >
          <Home className="w-3.5 h-3.5" /> Home
        </button>
      </div>
    </div>
  );
}
