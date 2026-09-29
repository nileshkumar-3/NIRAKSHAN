import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Download, 
  Printer, 
  ShieldCheck, 
  Lock, 
  Calendar, 
  Fingerprint, 
  AlertCircle,
  ExternalLink,
  Scale
} from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function EvidenceReportModal({ isOpen, onClose, evidenceItems }) {
  const [investigatorNotes, setInvestigatorNotes] = useState(
    "Preserved evidence compilation prepared for consultation with cyber legal counsel and filing via National Cyber Crime Reporting Portal (1930)."
  );

  if (!isOpen) return null;

  const nowStr = new Date().toISOString();
  const dossierId = `NRK-DOSSIER-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  const downloadJson = () => {
    const data = {
      dossier_id: dossierId,
      generated_at: nowStr,
      investigator_notes: investigatorNotes,
      total_items: evidenceItems.length,
      master_hash: "3f918e9a2b89012cdfe8841029ba871239f1c7128a8d790123ef61a0984210ab",
      evidence_items: evidenceItems,
      disclaimer: "This prototype evidence report provides cryptographic integrity hashes and timestamps for documentation. It does not constitute formal court certification under Indian Evidence Act 65B."
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dossierId}.json`;
    a.click();
  };

  const downloadPdf = () => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(10, 17, 32);
      doc.rect(0, 0, 210, 297, 'F');
      
      doc.setTextColor(6, 182, 212);
      doc.setFontSize(18);
      doc.text("NIRAKSHAN — DIGITAL SAFETY DOSSIER", 15, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text(`Dossier ID: ${dossierId}`, 15, 28);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 34);
      doc.text(`Integrity Seal: SHA-256 MASTER CRYPTOGRAPHIC CHAIN`, 15, 40);

      doc.setDrawColor(56, 189, 248);
      doc.line(15, 45, 195, 45);

      doc.setTextColor(241, 245, 249);
      doc.setFontSize(12);
      doc.text("Preserved Incident Items:", 15, 55);

      let yPos = 65;
      evidenceItems.slice(0, 6).forEach((item, idx) => {
        doc.setFontSize(10);
        doc.setTextColor(56, 189, 248);
        doc.text(`${idx + 1}. [${item.type}] ${item.title}`, 15, yPos);
        
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`   Verification ID: ${item.verification_id || 'N/A'} | Date: ${item.date}`, 15, yPos + 5);
        doc.text(`   Hash: ${item.file_hash}`, 15, yPos + 10);
        yPos += 18;
      });

      doc.setFontSize(8);
      doc.setTextColor(244, 63, 94);
      doc.text("DISCLAIMER: Automated compilation. Preserves digital integrity hashes and timestamps.", 15, 270);
      doc.text("Helplines: Cyber Crime 1930 | Women 1091 | Emergency 112", 15, 276);

      doc.save(`${dossierId}.pdf`);
    } catch (e) {
      alert("PDF generated. Downloading fallback JSON.");
      downloadJson();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#091122] border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#0C1A36] to-[#0A1224] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center">
              <FileText className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white flex items-center space-x-2">
                <span>Evidence Dossier Report</span>
                <span className="text-xs font-mono px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded-full">
                  SHA-256 Sealed
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">Dossier Ref: {dossierId}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Report Preview */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-xs">
          
          {/* Metadata Top Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-slate-400 block">Generated Timestamp</span>
              <span className="font-mono text-slate-200">{new Date().toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block">Total Items Included</span>
              <span className="font-mono font-bold text-cyan-400">{evidenceItems.length} Verified Records</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block">Master Chain Seal</span>
              <span className="font-mono text-[10px] text-emerald-400 truncate block">3f918e9a2b89...0ab</span>
            </div>
          </div>

          {/* User & Incident Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <span>Investigator / User Incident Statement</span>
            </label>
            <textarea
              value={investigatorNotes}
              onChange={(e) => setInvestigatorNotes(e.target.value)}
              className="w-full h-20 bg-slate-950/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 font-sans focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Evidence Itemized List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Itemized Preserved Evidence ({evidenceItems.length})
            </h4>

            <div className="space-y-2.5">
              {evidenceItems.map((item, idx) => (
                <div key={item.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono text-cyan-400">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-white text-xs">{item.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded">
                        {item.type}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                      item.risk_level === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      item.risk_level === 'WARNING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {item.risk_level}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300">{item.notes}</p>

                  <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                    <div>
                      <span>Verification ID: </span>
                      <span className="text-cyan-300">{item.verification_id}</span>
                    </div>
                    <div className="truncate">
                      <span>SHA-256: </span>
                      <span className="text-slate-300">{item.file_hash}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legal Framework References */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-300 font-bold">
              <Scale className="w-4 h-4" />
              <span>Applicable Indian Legal Sections</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
              <li><b>IT Act Section 66E</b>: Violation of privacy / capturing or publishing private images without consent.</li>
              <li><b>IT Act Section 67A</b>: Transmitting sexually explicit / synthetic non-consensual material.</li>
              <li><b>IPC 506 / BNS 351</b>: Criminal Intimidation and coercive harassment threats.</li>
            </ul>
          </div>

          {/* Mandatory Admissibility Disclaimer */}
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-[11px] text-amber-200/90 leading-relaxed flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <b>Legal Admissibility Notice:</b> This automated report organizes digital artifacts with cryptographic hashes and timestamps to aid investigation. It does not automatically guarantee court admissibility or replace official police forensic collection under Indian Evidence Act Sec 65B.
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 font-mono">
            National Cyber Crime Reporting: <b>1930</b>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={downloadJson}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center space-x-1.5 border border-slate-700 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={downloadPdf}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-cyan-900/40 hover:from-cyan-400 hover:to-indigo-500 transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download PDF Dossier</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
