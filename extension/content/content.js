/**
 * NIRAKSHAN Shield — content script.
 *
 * Scope: this script runs on every http(s) page but returns immediately unless
 * the host is on the watchlist. It never reads page text, never touches
 * message content, and never exfiltrates anything.
 *
 * What it does on a watchlisted page:
 *   - shows a one-time advisory banner
 *   - warns BEFORE a file picker is opened, and can veto the upload
 *
 * Vetoing works by keeping a capture-phase listener on the page's own file
 * inputs. We do not modify the File objects themselves.
 */

import { matchesWatchlist, lookupDomain } from '../config/risky-domains.js';

const BANNER_ID = 'nirakshan-shield-banner';
const host = window.location.hostname;

if (matchesWatchlist(host)) {
  const entry = lookupDomain(host) || { risk: 'HIGH', category: 'Listed on the NIRAKSHAN watchlist' };

  chrome.runtime.sendMessage({ type: 'CLASSIFY_URL', url: window.location.href }, (verdict) => {
    const risk = verdict?.risk || entry.risk;
    const title =
      risk === 'CRITICAL'
        ? 'Critical: do not upload personal images here'
        : risk === 'HIGH'
          ? 'This site is on the NIRAKSHAN watchlist'
          : 'Heads up before you upload anything here';

    showBanner({
      risk,
      title,
      body: `${entry.category}. NIRAKSHAN uses a short, curated demo list — it cannot tell you whether any other site is safe. You decide whether to continue.`,
    });
  });

  guardUploads(entry);
}

// Answers the popup's "Scan current page" button. We deliberately report only
// what we can see from this page — we do not enumerate the page's contents.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'NIRAKSHAN_SCAN') {
    const fileInputs = document.querySelectorAll('input[type="file"]').length;
    const watchlisted = matchesWatchlist(host);
    sendResponse({
      ok: true,
      watchlisted,
      fileInputs,
      // No page text, no URLs of links, no form values are ever collected.
      inspected: watchlisted ? 'watchlist match' : 'watchlist check only',
    });
    return true;
  }
  return false;
});

function showBanner({ risk, title, body }) {
  if (document.getElementById(BANNER_ID)) return;

  const el = document.createElement('div');
  el.id = BANNER_ID;
  el.setAttribute('role', 'alert');
  el.innerHTML = `
    <div class="ns-inner">
      <div class="ns-badge">NIRAKSHAN</div>
      <div class="ns-copy">
        <strong></strong>
        <span></span>
      </div>
      <button class="ns-close" type="button" aria-label="Dismiss advisory">&times;</button>
    </div>`;

  el.querySelector('strong').textContent = title;
  el.querySelector('.ns-copy span').textContent = body;
  el.querySelector('.ns-close').addEventListener('click', () => el.remove());

  document.documentElement.appendChild(el);
}

function guardUploads(entry) {
  let warned = false;

  document.addEventListener(
    'click',
    (event) => {
      if (warned) return;

      const input = event.target instanceof HTMLElement ? event.target.closest('input[type="file"]') : null;
      if (!input) return;

      warned = true;

      const proceed = window.confirm(
        [
          'NIRAKSHAN Shield: you are about to upload a file to',
          window.location.hostname,
          '',
          `This domain is on the watchlist (${entry.category}).`,
          '',
          'Uploading a personal photo here may expose it to AI manipulation.',
          'Continue anyway?',
        ].join('\n'),
      );

      chrome.runtime.sendMessage({
        type: 'LOG_ACTION',
        action: proceed ? 'upload-allowed-by-user' : 'upload-blocked-by-user',
        domain: window.location.hostname,
      });

      if (!proceed) {
        // Veto: stop the click from ever reaching the site's own handler.
        event.preventDefault();
        event.stopPropagation();
        window.setTimeout(() => {
          warned = false;
        }, 1500);
      }
    },
    true, // capture phase, so the page handler never runs first
  );
}
