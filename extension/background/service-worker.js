/**
 * NIRAKSHAN Shield — background service worker.
 *
 * Responsibilities (all deliberately conservative):
 *   - badge the toolbar icon with the risk level of the current tab
 *   - answer "what is this site?" for the popup
 *   - keep a local, user-owned log of user-initiated actions
 *
 * It does NOT read page content, does NOT inspect network bodies, and does
 * NOT contact any third-party service. Everything stays in chrome.storage.
 */

import { lookupDomain, matchesWatchlist, RISKY_DOMAINS } from '../config/risky-domains.js';

const BADGE_COLORS = {
  CRITICAL: '#E11D48',
  HIGH: '#F97316',
  MEDIUM: '#EAB308',
  LOW: '#22C55E',
};

/** The user can add their own entries; we merge them over the built-in list. */
async function getCustomEntries() {
  const { customDomains = [] } = await chrome.storage.local.get('customDomains');
  return Array.isArray(customDomains) ? customDomains : [];
}

async function classify(host) {
  const h = String(host || '').toLowerCase().replace(/^www\./, '');

  for (const entry of await getCustomEntries()) {
    if (String(entry.domain).toLowerCase() === h) return { ...entry, source: 'user-list' };
  }

  const builtin = lookupDomain(h);
  if (builtin) return { ...builtin, source: 'built-in demo list' };

  return {
    domain: h,
    risk: 'NOT_LISTED',
    category: 'Not on the watchlist',
    confidence:
      'This domain is not on the NIRAKSHAN watchlist. That is not an endorsement, and it does not mean the site is safe.',
    source: 'no match',
  };
}

function paintBadge(risk) {
  if (!chrome.action) return;
  if (risk === 'NOT_LISTED') {
    chrome.action.setBadgeText({ text: '' });
    chrome.action.setBadgeBackgroundColor({ color: '#0F172A' });
    return;
  }
  chrome.action.setBadgeText({ text: risk.charAt(0) });
  chrome.action.setBadgeBackgroundColor({ color: BADGE_COLORS[risk] || '#64748B' });
}

async function refreshBadge(tabId, url) {
  try {
    const host = new URL(url).hostname;
    const verdict = await classify(host);
    paintBadge(verdict.risk);
    if (tabId != null) chrome.storage.session.set({ [`tab:${tabId}`]: verdict });
  } catch {
    paintBadge('NOT_LISTED');
  }
}

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, (tab) => tab && refreshBadge(tabId, tab.url));
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) refreshBadge(tabId, tab.url);
});

/* ------------------------------------------------------------------ */
/* Message API used by the popup and content script                    */
/* ------------------------------------------------------------------ */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'CLASSIFY_URL') {
    const host = (() => {
      try {
        return new URL(message.url).hostname;
      } catch {
        return sender?.tab?.url ? new URL(sender.tab.url).hostname : '';
      }
    })();

    classify(host).then(sendResponse);
    return true; // async
  }

  if (message?.type === 'LOG_ACTION') {
    // User-initiated only. We record the fact of the action, never page content.
    chrome.storage.local.get('actionLog', ({ actionLog = [] }) => {
      const entry = {
        at: new Date().toISOString(),
        action: message.action,
        domain: message.domain || 'unknown',
        note: 'Recorded locally by user action. No page content was captured.',
      };
      chrome.storage.local.set({ actionLog: [entry, ...actionLog].slice(0, 100) });
    });
    sendResponse({ ok: true });
    return true;
  }

  if (message?.type === 'GET_LIST_SIZE') {
    sendResponse({ size: RISKY_DOMAINS.length });
    return true;
  }

  return false;
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('actionLog', ({ actionLog = [] }) => {
    if (actionLog.length === 0) {
      chrome.storage.local.set({
        actionLog: [],
        protectUploads: true,
        customDomains: [],
      });
    }
  });
});
