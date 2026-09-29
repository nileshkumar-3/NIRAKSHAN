import React, { useState } from 'react';
import { 
  PhoneCall, 
  ShieldAlert, 
  Users, 
  Share2, 
  Globe, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  HeartHandshake
} from 'lucide-react';

export default function EmergencyPage({ openEvidenceReport }) {
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [trustedMessageSent, setTrustedMessageSent] = useState(false);

  const countryDirectory = {
    IN: {
      name: "India",
      cybercrime: { number: "1930", label: "National Cyber Crime Helpline (24x7)", url: "https://cybercrime.gov.in" },
      women: { number: "1091", label: "National Women in Distress Helpline" },
      emergency: { number: "112", label: "National Emergency Police Response" },
      resources: [
        { name: "National Cyber Crime Reporting Portal", url: "https://cybercrime.gov.in" },
        { name: "National Commission for Women (NCW)", url: "http://ncw.nic.in" },
        { name: "Cyber Peace Foundation", url: "https://www.cyberpeace.org" }
      ]
    },
    US: {
      name: "United States",
      cybercrime: { number: "1-800-225-5324", label: "FBI IC3 Internet Crime Complaint Center", url: "https://www.ic3.gov" },
      women: { number: "1-800-799-7233", label: "National Domestic Violence Helpline (NDVH)" },
      emergency: { number: "911", label: "National Emergency Response (911)" },
      resources: [
        { name: "Cyber Civil Rights Initiative (CCRI)", url: "https://cybercivilrights.org" },
        { name: "National Center for Missing & Exploited Children", url: "https://www.missingkids.org" }
      ]
    },
    UK: {
      name: "United Kingdom",
      cybercrime: { number: "0300 123 2040", label: "Action Fraud UK Cyber Crime", url: "https://www.actionfraud.police.uk" },
      women: { number: "0808 2000 247", label: "National Freephone Domestic Abuse Helpline" },
      emergency: { number: "999", label: "Emergency Police Service" },
      resources: [
        { name: "Revenge Porn Helpline UK", url: "https://revengepornhelpline.org.uk" },
        { name: "National Cyber Security Centre (NCSC)", url: "https://www.ncsc.gov.uk" }
      ]
    }
  };

  const currentData = countryDirectory[selectedCountry] || countryDirectory.IN;

  const handleSendEmergencyAlert = () => {
    setTrustedMessageSent(true);
    setTimeout(() => setTrustedMessageSent(false), 4000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              Get Help & Emergency Support
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-500/30 rounded-full">
              24x7 Response
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Immediate connection to official helplines, trusted contacts, legal advisory resources, and evidence sharing.
          </p>
        </div>

        {/* Country Selector */}
        <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-2xl border border-slate-700">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span className="text-xs text-slate-400 font-mono">Region:</span>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-transparent text-xs font-bold text-white font-mono focus:outline-none cursor-pointer"
          >
            <option value="IN" className="bg-slate-900 text-slate-100">India (1930 / 1091 / 112)</option>
            <option value="US" className="bg-slate-900 text-slate-100">United States (911 / IC3)</option>
            <option value="UK" className="bg-slate-900 text-slate-100">United Kingdom (999 / Action Fraud)</option>
          </select>
        </div>
      </div>

      {/* Mandatory Responsibility Notice */}
      <div className="p-4 rounded-3xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200/90 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <b>Important Safety Notice:</b> NIRAKSHAN is a preventative awareness, detection, and evidence gathering tool. It is <b>not a substitute for police, emergency services, or formal platform moderation</b>. If you are in immediate physical danger, contact your local emergency response immediately.
        </p>
      </div>

      {/* 4 Emergency Support Option Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* TILE 1: Official Emergency Helplines */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/50 space-y-4 shadow-xl shadow-rose-950/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">Call Emergency Helplines</h3>
              <p className="text-xs text-slate-400">{currentData.name} Official Response Directory</p>
            </div>
          </div>

          <div className="space-y-2.5">
            <a
              href={`tel:${currentData.cybercrime.number}`}
              className="p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-between shadow-md transition-all cursor-pointer"
            >
              <div>
                <span className="block text-[10px] uppercase font-mono opacity-90">{currentData.cybercrime.label}</span>
                <span className="text-base font-mono font-black">{currentData.cybercrime.number}</span>
              </div>
              <PhoneCall className="w-5 h-5" />
            </a>

            <a
              href={`tel:${currentData.women.number}`}
              className="p-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-between shadow-md transition-all cursor-pointer"
            >
              <div>
                <span className="block text-[10px] uppercase font-mono opacity-90">{currentData.women.label}</span>
                <span className="text-base font-mono font-black">{currentData.women.number}</span>
              </div>
              <PhoneCall className="w-5 h-5" />
            </a>

            <a
              href={`tel:${currentData.emergency.number}`}
              className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center justify-between border border-slate-700 transition-all cursor-pointer"
            >
              <div>
                <span className="block text-[10px] uppercase font-mono text-slate-400">{currentData.emergency.label}</span>
                <span className="text-base font-mono font-black text-cyan-400">{currentData.emergency.number}</span>
              </div>
              <PhoneCall className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* TILE 2: Contact Trusted Support Circle */}
        <div className="p-6 rounded-3xl bg-[#091122] border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">Contact Trusted Person</h3>
                <p className="text-xs text-slate-400">Pre-configured Emergency Circles</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Send an instant discrete safety check-in and advisory message to your emergency contacts without alerting external listeners.
            </p>

            <div className="space-y-2 mt-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span>Primary: Ananya (Sister)</span>
                <span className="text-emerald-400 font-bold">+91 98765 43210</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span>Secondary: Prof. Meenakshi</span>
                <span className="text-emerald-400 font-bold">+91 91234 56789</span>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={handleSendEmergencyAlert}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-950 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Broadcast Discrete Check-in</span>
            </button>
            {trustedMessageSent && (
              <p className="text-[11px] font-mono text-emerald-400 text-center mt-2 animate-in fade-in">
                ✅ Check-in dispatched to trusted contacts.
              </p>
            )}
          </div>
        </div>

        {/* TILE 3: Official Safety & Legal Portals */}
        <div className="p-6 rounded-3xl bg-[#091122] border border-slate-800 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">Open Safety Resources</h3>
              <p className="text-xs text-slate-400">Verified Legal & Cyber Incident Portals</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {currentData.resources.map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-slate-200 text-xs flex items-center justify-between transition-all"
              >
                <span className="font-semibold">{res.name}</span>
                <ExternalLink className="w-4 h-4 text-cyan-400" />
              </a>
            ))}
          </div>
        </div>

        {/* TILE 4: Share Selected Evidence */}
        <div className="p-6 rounded-3xl bg-[#091122] border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white">Share Selected Evidence</h3>
                <p className="text-xs text-slate-400">Generate Cryptographic Dossier</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Export a sanitized incident timeline containing SHA-256 hashes, device sightings, and chat threats formatted for official submission.
            </p>
          </div>

          <button
            onClick={openEvidenceReport}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center space-x-2 border border-slate-700 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate & Share Evidence Dossier</span>
          </button>
        </div>

      </div>

    </div>
  );
}
