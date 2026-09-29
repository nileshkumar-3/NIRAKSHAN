import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Info } from 'lucide-react';

import { useRouter } from './router';
import { addEvidenceApi, getEvidenceListApi } from './services/api';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileSimulatorModal from './components/MobileSimulatorModal';
import ExtensionSimulatorModal from './components/ExtensionSimulatorModal';
import EvidenceReportModal from './components/EvidenceReportModal';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ImageShieldPage from './pages/ImageShieldPage';
import TrackerScanPage from './pages/TrackerScanPage';
import ChatSafetyPage from './pages/ChatSafetyPage';
import EvidenceVaultPage from './pages/EvidenceVaultPage';
import AlertsCenterPage from './pages/AlertsCenterPage';
import PrivacyCenterPage from './pages/PrivacyCenterPage';
import SettingsPage from './pages/SettingsPage';
import EmergencyPage from './pages/EmergencyPage';
import HowItWorksPage from './pages/HowItWorksPage';
import DemoModePage from './pages/DemoModePage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * NIRAKSHAN application shell.
 *
 * Owns three things the individual pages deliberately do not:
 *   1. routing (via the dependency-free ./router)
 *   2. cross-page evidence state, so "Save to Vault" from Image Shield,
 *      Chat Safety, Tracker Scan, Alerts or the Extension simulator all land
 *      in one place
 *   3. the three overlay surfaces (mobile simulator, extension simulator,
 *      evidence report)
 */
export default function App() {
  const { activePage, notFound, setActivePage } = useRouter();

  const [evidenceItems, setEvidenceItems] = useState([]);
  const [mobileSimOpen, setMobileSimOpen] = useState(false);
  const [extSimOpen, setExtSimOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(timer);
  }, [toast]);

  // Load the existing vault once so "Generate Evidence Report" has real content
  // even before the user saves anything in this session.
  useEffect(() => {
    let cancelled = false;
    getEvidenceListApi().then((items) => {
      if (!cancelled && Array.isArray(items)) setEvidenceItems(items);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const notify = useCallback((message, tone = 'success') => {
    setToast({ message, tone, id: Date.now() });
  }, []);

  const handleSaveEvidence = useCallback(
    async (item) => {
      try {
        const res = await addEvidenceApi(item);
        if (res?.item) setEvidenceItems((prev) => [res.item, ...prev]);
      } catch {
        /* Backend offline — the Vault page falls back to its own local list. */
      }
      notify(`“${item.title}” was preserved in your Evidence Vault.`);
    },
    [notify],
  );

  const handlePurgeAll = useCallback(() => {
    setEvidenceItems([]);
    notify('All local analysis records and evidence were deleted.', 'info');
  }, [notify]);

  const openMobileSim = useCallback(() => setMobileSimOpen(true), []);
  const openExtSim = useCallback(() => setExtSimOpen(true), []);
  const openEvidenceReport = useCallback(() => setReportOpen(true), []);

  const shared = useMemo(
    () => ({
      setActivePage,
      openEvidenceReport,
      openMobileSim,
      openExtSim,
      onSaveEvidence: handleSaveEvidence,
      onAddNewItem: handleSaveEvidence,
      onPurgeAll: handlePurgeAll,
    }),
    [setActivePage, openEvidenceReport, openMobileSim, openExtSim, handleSaveEvidence, handlePurgeAll],
  );

  const renderPage = () => {
    if (notFound) return <NotFoundPage setActivePage={setActivePage} />;
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage {...shared} />;
      case 'image-shield':
        return <ImageShieldPage {...shared} />;
      case 'tracker-scan':
        return <TrackerScanPage {...shared} />;
      case 'chat-safety':
        return <ChatSafetyPage {...shared} />;
      case 'evidence':
        return <EvidenceVaultPage {...shared} />;
      case 'alerts':
        return <AlertsCenterPage {...shared} />;
      case 'privacy':
        return <PrivacyCenterPage {...shared} />;
      case 'settings':
        return <SettingsPage {...shared} />;
      case 'emergency':
        return <EmergencyPage {...shared} />;
      case 'how-it-works':
        return <HowItWorksPage {...shared} />;
      case 'demo':
        return <DemoModePage {...shared} />;
      case 'landing':
      default:
        return <LandingPage {...shared} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060B13]">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        openMobileSim={openMobileSim}
        openExtSim={openExtSim}
      />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{renderPage()}</div>
      </main>

      <Footer setActivePage={setActivePage} />

      {/* ---------------- Overlays ---------------- */}
      <MobileSimulatorModal isOpen={mobileSimOpen} onClose={() => setMobileSimOpen(false)} />
      <ExtensionSimulatorModal
        isOpen={extSimOpen}
        onClose={() => setExtSimOpen(false)}
        onSaveEvidence={handleSaveEvidence}
      />
      <EvidenceReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        evidenceItems={evidenceItems}
      />

      {/* ---------------- Toast ---------------- */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4">
          <div
            role="status"
            className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-[#0B1526]/95 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 max-w-sm"
          >
            {toast.tone === 'info' ? (
              <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            )}
            <p className="text-xs text-slate-200 leading-relaxed">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
