import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  FileText, 
  Download, 
  Trash2, 
  Eye, 
  ShieldCheck, 
  Plus, 
  Search, 
  Filter, 
  Fingerprint, 
  AlertTriangle,
  FileCheck,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { getEvidenceListApi, deleteEvidenceApi } from '../services/api';

export default function EvidenceVaultPage({ openEvidenceReport, onAddNewItem }) {
  const [items, setItems] = useState([]);
  const [selectedType, setSelectedType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewItem, setViewItem] = useState(null);

  const loadItems = async () => {
    const list = await getEvidenceListApi();
    setItems(list);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to permanently delete this evidence record?")) {
      await deleteEvidenceApi(id);
      setItems(items.filter(i => i.id !== id));
      if (viewItem?.id === id) setViewItem(null);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesType = selectedType === 'ALL' || item.type.toUpperCase() === selectedType.toUpperCase();
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.verification_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.file_hash?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const exportSingleJson = (item, e) => {
    e.stopPropagation();
    const blob = new Blob([JSON.stringify(item, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.id}_${item.verification_id}.json`;
    a.click();
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Evidence Vault & Cryptographic Ledger
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-500/30 rounded-full">
              SHA-256 Hashed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Preserve tamper-evident incident records, screenshot hashes, and threat logs with full user custody.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={openEvidenceReport}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-950 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Evidence Report</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-[#091122] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search title, hash, ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['ALL', 'CONVERSATION', 'ALERT', 'IMAGE', 'SCREENSHOT', 'REPORT'].map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition-all cursor-pointer ${
                selectedType === t 
                  ? 'bg-cyan-500 text-black shadow-sm' 
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

      </div>

      {/* Evidence Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setViewItem(item)}
            className="p-5 rounded-3xl bg-[#091122] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4 cursor-pointer group hover:shadow-xl hover:shadow-cyan-950/20"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  {item.type}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  item.risk_level === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                  item.risk_level === 'WARNING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {item.risk_level}
                </span>
              </div>

              <h3 className="font-bold text-white text-sm group-hover:text-cyan-300 transition-colors line-clamp-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {item.notes}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
              <div className="flex items-center justify-between">
                <span>Date:</span>
                <span className="text-slate-300">{item.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Verification ID:</span>
                <span className="text-cyan-400 font-bold">{item.verification_id}</span>
              </div>
              <div className="flex items-center justify-between truncate">
                <span>Status:</span>
                <span className="text-emerald-400">{item.status}</span>
              </div>
            </div>

            {/* Item Card Bottom Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
              <span className="text-[10px] text-slate-500 font-mono">
                Hash: {item.file_hash?.slice(0, 10)}...
              </span>
              
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={(e) => exportSingleJson(item, e)}
                  title="Export JSON record"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  title="Delete record"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Item Inspection Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-[#091122] border border-cyan-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">{viewItem.title}</h3>
              </div>
              <button
                onClick={() => setViewItem(null)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-300">
              <div><span className="text-slate-500">ID:</span> {viewItem.id}</div>
              <div><span className="text-slate-500">Verification ID:</span> <b className="text-cyan-300">{viewItem.verification_id}</b></div>
              <div><span className="text-slate-500">Timestamp:</span> {viewItem.date}</div>
              <div><span className="text-slate-500">Type / Source:</span> {viewItem.type} / {viewItem.source}</div>
              <div className="break-all"><span className="text-slate-500">SHA-256 Checksum:</span> <br /><span className="text-emerald-400 text-[11px]">{viewItem.file_hash}</span></div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Preserved Content / Notes:</label>
              <p className="text-xs text-slate-200 bg-slate-900 p-3 rounded-xl border border-slate-800 leading-relaxed">
                {viewItem.notes}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={(e) => exportSingleJson(viewItem, e)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export Record</span>
              </button>
              <button
                onClick={() => setViewItem(null)}
                className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
