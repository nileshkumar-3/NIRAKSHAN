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
 * History routing gives clean URLs, but it needs a server that rewrites every
 * unknown path to index.html. Static hosts like GitHub Pages do not do that, so
 * a deep link such as /dashboard would 404 on refresh.
 *
 * So: when the app is built for a sub-path (BASE_URL !== '/', which is what the
 * Pages deploy sets), switch to hash routing. Dev keeps the tidy URLs, and the
 * deployed site works on any static host with no server config at all.
 */
export const HASH_MODE = import.meta.env.BASE_URL !== '/';

/** Reads the current route from whichever mode is active. */
function readPath() {
  if (!HASH_MODE) return normalize(window.location.pathname);
  const hash = window.location.hash.replace(/^#/, '');
  return hash ? normalize(hash) : DEFAULT_ROUTE.path;
}

/**
 * @returns {{ activePage: string | null, notFound: boolean, setActivePage: (id: string) => void }}
 *   `activePage` is null when the URL does not match a known route.
 */
export function useRouter() {
  const [path, setPath] = useState(readPath);

  useEffect(() => {
    const handleChange = () => setPath(readPath());
    // popstate covers the back/forward buttons; hashchange covers a hash that
    // was edited or pasted by hand. Both are idempotent, so double-firing is fine.
    window.addEventListener('popstate', handleChange);
    window.addEventListener('hashchange', handleChange);
    return () => {
      window.removeEventListener('popstate', handleChange);
      window.removeEventListener('hashchange', handleChange);
    };
  }, []);

  const setActivePage = useCallback((id) => {
    const route = ROUTES.find((r) => r.id === id) || DEFAULT_ROUTE;
    if (readPath() !== route.path) {
      if (HASH_MODE) {
        const base = window.location.pathname + window.location.search;
        window.history.pushState({}, '', `${base}#${route.path}`);
      } else {
        window.history.pushState({}, '', route.path);
      }
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
