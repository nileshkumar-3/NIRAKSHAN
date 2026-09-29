/**
 * NIRAKSHAN — minimal, dependency-free client-side router.
 *
 * Why not react-router?
 * The prototype deliberately ships with no runtime dependency beyond React
 * itself so the competition demo runs fully offline, with no install step
 * and no network access. The app only needs flat routes, so the History API
 * is more than enough.
 *
 * This module intentionally exposes the same `setActivePage('<id>')` contract
 * that every existing component already uses, so no page had to be rewritten.
 */
import { useCallback, useEffect, useState } from 'react';

export const ROUTES = [
  { id: 'landing', path: '/', label: 'Home' },
  { id: 'dashboard', path: '/dashboard', label: 'Overview' },
  { id: 'image-shield', path: '/image-shield', label: 'Image Shield' },
  { id: 'tracker-scan', path: '/tracker-scan', label: 'Tracker Scan' },
  { id: 'chat-safety', path: '/chat-safety', label: 'Chat Safety' },
  { id: 'evidence', path: '/evidence', label: 'Evidence Vault' },
  { id: 'alerts', path: '/alerts', label: 'Alerts' },
  { id: 'privacy', path: '/privacy', label: 'Privacy' },
  { id: 'settings', path: '/settings', label: 'Settings' },
  { id: 'emergency', path: '/get-help', label: 'Get Help' },
  { id: 'how-it-works', path: '/how-it-works', label: 'How It Works' },
  { id: 'demo', path: '/demo', label: 'Live Demo' },
];

export const DEFAULT_ROUTE = ROUTES[0];

/** Strip a trailing slash so `/dashboard/` and `/dashboard` are the same page. */
function normalize(pathname) {
  if (!pathname) return DEFAULT_ROUTE.path;
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? DEFAULT_ROUTE.path : trimmed;
}

export function pathToId(pathname) {
  const match = ROUTES.find((route) => route.path === normalize(pathname));
  return match ? match.id : null;
}

export function idToPath(id) {
  const match = ROUTES.find((route) => route.id === id);
  return match ? match.path : DEFAULT_ROUTE.path;
}

/**
 * @returns {{ activePage: string | null, notFound: boolean, setActivePage: (id: string) => void }}
 *   `activePage` is null when the URL does not match a known route.
 */
export function useRouter() {
  const [path, setPath] = useState(() => normalize(window.location.pathname));

  useEffect(() => {
    const handlePop = () => setPath(normalize(window.location.pathname));
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const setActivePage = useCallback((id) => {
    const route = ROUTES.find((r) => r.id === id) || DEFAULT_ROUTE;
    if (normalize(window.location.pathname) !== route.path) {
      window.history.pushState({}, '', route.path);
    }
    setPath(route.path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const match = ROUTES.find((route) => route.path === path);

  return {
    activePage: match ? match.id : null,
    notFound: !match,
    setActivePage,
  };
}
