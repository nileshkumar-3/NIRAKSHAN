/**
 * NIRAKSHAN Shield — popup controller.
 *
 * Every button here is a user-initiated, local action. "Report" only opens the
 * official reporting portal in a new tab; it never submits anything on your
 * behalf, and NIRAKSHAN never contacts a third party automatically.
 */

import { lookupDomain } from '../config/risky-domains.js';

const $ = (id) => document.getElementById(id);

const els = {
  statusDot: $('status-dot'),
  statusText: $('status-text'),
  domain: $('current-domain'),
  riskLine: $('risk-line'),
  riskNote: $('risk-note'),
  continueBtn: $('btn-continue'),
  blockBtn: $('btn-block'),
  reportBtn: $('btn-report'),
  saveBtn: $('btn-save'),
  toggle: $('toggle-protect'),
  scanBtn: $('btn-scan'),
  scanResult: $('scan-result'),
  logList: $('log-list'),
  clearLogBtn: $('btn-clear-log'),
};

let currentTab = null;
let verdict = null;

const RISK_COPY = {
  NOT_LISTED: 'Not on the watchlist — not a safety endorsement',
  MEDIUM: 'Potentially associated with AI image manipulation',
  HIGH: 'Website appears potentially associated with AI image manipulation',
  CRITICAL: 'Critical: this site is linked to non-consensual image manipulation',
};

function logAction(action, domain) {
  chrome.runtime.sendMessage({ type: 'LOG_ACTION', action, domain });
  renderLog();
}

async function renderLog() {
  const { actionLog = [] } = await chrome.storage.local.get('actionLog');
  els.logList.replaceChildren();

  if (actionLog.length === 0) {
    const li = document.createElement('li');
    li.className = 'ns-log-empty';
    li.textContent = 'No actions recorded yet.';
    els.logList.append(li);
    return;
  }

  actionLog.slice(0, 12).forEach((entry) => {
    const li = document.createElement('li');
    const when = new Date(entry.at).toLocaleString();
    li.textContent = `${entry.action.replace(/-/g, ' ')} · ${entry.domain} · ${when}`;
    els.logList.append(li);
  });
}

function render() {
  const risk = verdict?.risk || 'NOT_LISTED';

  els.domain.textContent = currentTab?.url ? new URL(currentTab.url).hostname : 'Unavailable';
  els.riskLine.textContent = RISK_COPY[risk] || RISK_COPY.NOT_LISTED;
  els.riskLine.className = `ns-risk-line risk-${risk}`;
  els.riskNote.textContent = verdict?.confidence || '';

  const watchlisted = risk !== 'NOT_LISTED';

  els.statusDot.className = 'ns-dot';
  if (watchlisted) {
    els.statusDot.classList.add(risk === 'CRITICAL' || risk === 'HIGH' ? 'is-danger' : 'is-warn');
    els.statusText.textContent = 'Active — watchlisted site';
  } else {
    els.statusDot.classList.add('is-active');
    els.statusText.textContent = 'Active — monitoring this page';
  }

  // A site that is not on the list has nothing to warn about, so the action
  // buttons are disabled rather than silently doing nothing.
  [els.continueBtn, els.blockBtn, els.reportBtn, els.saveBtn].forEach((btn) => {
    btn.disabled = !watchlisted;
  });
}

async function init() {
  [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const { protectUploads = true } = await chrome.storage.local.get('protectUploads');
  els.toggle.setAttribute('aria-checked', String(protectUploads));

  if (currentTab?.url) {
    verdict = await chrome.runtime.sendMessage({ type: 'CLASSIFY_URL', url: currentTab.url });
  }

  render();
  renderLog();
}

els.toggle.addEventListener('click', async () => {
  const next = els.toggle.getAttribute('aria-checked') !== 'true';
  els.toggle.setAttribute('aria-checked', String(next));
  await chrome.storage.local.set({ protectUploads: next });
  logAction(next ? 'upload-protection-on' : 'upload-protection-off', els.domain.textContent);
});

els.continueBtn.addEventListener('click', () => {
  logAction('user-chose-continue', els.domain.textContent);
  els.continueBtn.textContent = 'Logged';
  els.continueBtn.disabled = true;
});

els.blockBtn.addEventListener('click', async () => {
  logAction('upload-blocked-by-user', els.domain.textContent);
  els.blockBtn.textContent = 'Uploads warned';
  // Arm the guard for this session so the content script is actually active.
  const { protectUploads } = await chrome.storage.local.get('protectUploads');
  if (!protectUploads) await chrome.storage.local.set({ protectUploads: true });
});

els.reportBtn.addEventListener('click', () => {
  logAction('user-opened-report-portal', els.domain.textContent);
  // Opens the official portal only. Nothing is submitted automatically.
  chrome.tabs.create({ url: 'https://cybercrime.gov.in/' });
  els.reportBtn.textContent = 'Portal opened';
});

els.saveBtn.addEventListener('click', () => {
  const record = {
    saved_at: new Date().toISOString(),
    domain: els.domain.textContent,
    risk: verdict?.risk,
    category: verdict?.category,
    note: 'Saved by the user. Captures the domain only — no page content.',
  };
  chrome.storage.local.get('savedEvidence', ({ savedEvidence = [] }) => {
    chrome.storage.local.set({ savedEvidence: [record, ...savedEvidence].slice(0, 50) });
  });
  logAction('evidence-saved', els.domain.textContent);
  els.saveBtn.textContent = 'Saved to vault';
  els.saveBtn.disabled = true;
});

els.scanBtn.addEventListener('click', () => {
  els.scanResult.hidden = false;
  els.scanResult.textContent = 'Scanning…';

  chrome.tabs.sendMessage(currentTab.id, { type: 'NIRAKSHAN_SCAN' }, () => {
    // Extensions cannot run on internal pages, so a failure here is expected
    // and is reported honestly rather than shown as a clean scan.
    if (chrome.runtime.lastError) {
      els.scanResult.textContent =
        'This page does not allow extensions to run (browser settings, web store, or a PDF viewer). Nothing was scanned.';
      return;
    }

    let local = null;
    try {
      local = lookupDomain(new URL(currentTab.url).hostname);
    } catch {
      local = null;
    }

    els.scanResult.textContent = local
      ? `Match found: ${local.category}.`
      : 'No match on the demo watchlist. That is not an endorsement — the list is short and curated by hand.';
  });
});

els.clearLogBtn.addEventListener('click', async () => {
  await chrome.storage.local.set({ actionLog: [] });
  renderLog();
});

init();
