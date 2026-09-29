/**
 * NIRAKSHAN Shield — website watchlist (PROTOTYPE).
 *
 * READ THIS BEFORE DEMOING IT
 * ---------------------------
 * This is a small, human-curated DEMO list. It is NOT a detector. The
 * extension cannot tell you that some other site is safe, and a site missing
 * from this list is not a site that has been cleared.
 *
 * Every entry uses a reserved, non-routable top-level domain (RFC 2606:
 * .demo / .test / .example / .invalid) so the demo can never point at — or
 * accidentally send traffic to — a real website.
 *
 * `confidence` is the curator's stated reason for the entry, not a measurement.
 */

export const RISKY_DOMAINS = [
  {
    domain: 'deep-swap-nudify.demo',
    risk: 'HIGH',
    category: 'Unverified deepfake / face-swap portal',
    confidence: 'Listed for demonstration only. No such service has been assessed.',
  },
  {
    domain: 'ai-cloth-remover.demo',
    risk: 'CRITICAL',
    category: 'Non-consensual image manipulation tool',
    confidence: 'Listed for demonstration only. No such service has been assessed.',
  },
  {
    domain: 'free-avatar-generator.test',
    risk: 'MEDIUM',
    category: 'Unverified AI avatar synthesis site',
    confidence: 'Listed for demonstration only. No such service has been assessed.',
  },
  {
    domain: 'face-fusion-lab.invalid',
    risk: 'HIGH',
    category: 'Unverified face-enforcement simulation site',
    confidence: 'Listed for demonstration only. No such service has been assessed.',
  },
];

/** Sites used to show the "not on the list" state during a demo. */
export const BENIGN_DOMAINS = [
  { domain: 'example.com', note: 'Reserved documentation domain.' },
  { domain: 'wikipedia.org', note: 'Ordinary reference site, not on the watchlist.' },
];

const normalise = (host) => String(host || '').toLowerCase().replace(/^www\./, '');

/**
 * @returns {object | null} the matching watchlist entry, or null.
 * Note the asymmetry on purpose: a null result means "not on the list",
 * which is NOT the same as "safe".
 */
export function lookupDomain(host) {
  const h = normalise(host);
  return RISKY_DOMAINS.find((entry) => normalise(entry.domain) === h) || null;
}

/** True when the host is a registrable subdomain of a watchlist entry. */
export function matchesWatchlist(host) {
  const h = normalise(host);
  return RISKY_DOMAINS.some((entry) => h === normalise(entry.domain) || h.endsWith(`.${normalise(entry.domain)}`));
}
