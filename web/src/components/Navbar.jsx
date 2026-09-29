import React, { useState } from 'react';
import { 
  Shield, 
  Cpu, 
  Radio, 
  MessageSquareWarning, 
  Lock, 
  Bell, 
  UserCheck, 
  Smartphone, 
  Layers, 
  AlertTriangle, 
  Flame, 
  Menu, 
  X,
  Compass,
  PhoneCall,
  Sliders,
  Activity
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage, openMobileSim, openExtSim }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'image-shield', label: 'Image Shield', icon: Shield },
    { id: 'tracker-scan', label: 'Tracker Scan', icon: Radio },
    { id: 'chat-safety', label: 'Chat Safety', icon: MessageSquareWarning },
    { id: 'evidence', label: 'Evidence Vault', icon: Lock },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: '3' },
    { id: 'privacy', label: 'Privacy', icon: UserCheck },
    { id: 'settings', label: 'Settings', icon: Sliders },
    { id: 'emergency', label: 'Get Help', icon: PhoneCall, highlight: true },
    { id: 'how-it-works', label: 'How It Works', icon: Compass },
    { id: 'demo', label: 'Live Demo', icon: Flame, isSpecial: true }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#060B13]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => setActivePage('landing')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-rose-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-all">
              <div className="w-full h-full bg-[#060B13] rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-heading text-xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 via-slate-100 to-rose-400 bg-clip-text text-transparent">
                  NIRAKSHAN
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 rounded">
                  AI SHIELD
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
                Digital Safety is Physical Safety
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              
              if (item.isSpecial) {
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`ml-2 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                      isActive 
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 ring-1 ring-rose-300' 
                        : 'bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all relative ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[9px] font-mono bg-rose-500/80 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Widgets */}
          <div className="hidden md:flex items-center space-x-2">
            
            {/* Safety Score Pill */}
            <div 
              onClick={() => setActivePage('dashboard')}
              className="flex items-center space-x-2 px-3 py-1 bg-slate-900/90 border border-emerald-500/30 rounded-full cursor-pointer hover:border-emerald-500/60 transition-colors"
              title="Current Digital Safety Index"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono text-slate-300">Safety Index:</span>
              <span className="text-xs font-bold font-mono text-emerald-400">82/100</span>
            </div>

            {/* Mobile App Simulator Launch Button */}
            <button
              onClick={openMobileSim}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs flex items-center space-x-1.5 transition-all"
              title="Open Mobile App Simulation"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">Mobile App</span>
            </button>

            {/* Browser Extension Simulator Launch Button */}
            <button
              onClick={openExtSim}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs flex items-center space-x-1.5 transition-all"
              title="Open Browser Sentinel Extension Preview"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden lg:inline">Extension</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center space-x-2 xl:hidden">
            <button
              onClick={openMobileSim}
              className="p-2 rounded-lg bg-slate-800 text-cyan-400 text-xs"
              title="Mobile Simulator"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0A101D] border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={() => { setActivePage('demo'); setMobileMenuOpen(false); }}
              className="w-full py-2 px-3 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center justify-center space-x-1.5"
            >
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Launch Live Demo</span>
            </button>
            <button
              onClick={() => { openExtSim(); setMobileMenuOpen(false); }}
              className="w-full py-2 px-3 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center justify-center space-x-1.5"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Browser Extension</span>
            </button>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs bg-rose-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
