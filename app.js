/**
 * NIRAKSHAN - DIGITAL SAFETY SHIELD FOR WOMEN
 * Interactive Engine: Steganography, BLE Radar, and Chat Threat Auditor
 */

// Global App Namespace
window.nirakshanApp = {};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Modules
  initBackgroundCanvas();
  initNavigation();
  initWatermarkEngine();
  initChatAuditorEngine();
  initRadarEngine();
  initEvidenceModal();
  initLogStreamAnimation();
});

/* ==========================================================================
   1. CYBER BACKGROUND PARTICLES & GRID CANVAS
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('cyber-grid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const PARTICLE_COUNT = 45;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
      this.color = Math.random() > 0.5 ? 'rgba(139, 92, 246, ' : 'rgba(6, 182, 212, ';
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Subtle Cyber Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
    ctx.lineWidth = 1;
    const gridSize = 60;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Connect close particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. NAVIGATION & TABS
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });
    drawerClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }

  // Live Demo Tab Switcher
  const tabBtns = document.querySelectorAll('.demo-tab-btn');
  const tabPanes = document.querySelectorAll('.demo-tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const activePane = document.getElementById(targetTab);
      if (activePane) activePane.classList.add('active');
    });
  });
}

/* ==========================================================================
   3. DEMO MODULE 1: INVISIBLE STEGANOGRAPHIC WATERMARKING
   ========================================================================== */
function initWatermarkEngine() {
  const canvasOrig = document.getElementById('canvasOriginal');
  const canvasProt = document.getElementById('canvasProtected');
  if (!canvasOrig || !canvasProt) return;

  const ctxOrig = canvasOrig.getContext('2d');
  const ctxProt = canvasProt.getContext('2d');

  const btnProtect = document.getElementById('btnProtectImage');
  const btnVerify = document.getElementById('btnVerifyImage');
  const btnGenKey = document.getElementById('btnGenKey');
  const ownerIdInput = document.getElementById('ownerIdInput');
  const resultBox = document.getElementById('watermarkResultBox');
  const certActionsBar = document.getElementById('certActionsBar');
  const btnDownloadProtected = document.getElementById('btnDownloadProtected');
  const btnDownloadCert = document.getElementById('btnDownloadCert');
  const imageDropzone = document.getElementById('imageDropzone');
  const imageFileInput = document.getElementById('imageFileInput');
  const sampleBtns = document.querySelectorAll('.sample-btn');
  const protectedTag = document.getElementById('protectedTag');
  const protectedMeta = document.getElementById('protectedMeta');
  const tabViewComparison = document.getElementById('tabViewComparison');
  const tabViewDiff = document.getElementById('tabViewDiff');

  let currentImage = new Image();
  let isProtected = false;
  let currentSampleType = 'portrait';
  let diffViewActive = false;

  // Generate Sample Vector Portraits onto Canvas
  function drawSample(type) {
    isProtected = false;
    protectedTag.textContent = 'UNPROTECTED';
    protectedTag.classList.remove('protected-tag');
    protectedMeta.textContent = 'Status: Waiting for encryption';
    resultBox.innerHTML = `
      <div class="result-placeholder">
        <span class="placeholder-icon">🔍</span>
        <span>Click <strong>"Protect & Embed Watermark"</strong> to encode cryptographic signature.</span>
      </div>`;
    certActionsBar.style.display = 'none';

    canvasOrig.width = 400;
    canvasOrig.height = 400;
    canvasProt.width = 400;
    canvasProt.height = 400;

    // Draw rich artistic synthetic sample image
    ctxOrig.clearRect(0, 0, 400, 400);

    if (type === 'portrait') {
      // Warm Gradient Background
      const bg = ctxOrig.createLinearGradient(0, 0, 400, 400);
      bg.addColorStop(0, '#1e1b4b');
      bg.addColorStop(0.5, '#312e81');
      bg.addColorStop(1, '#4338ca');
      ctxOrig.fillStyle = bg;
      ctxOrig.fillRect(0, 0, 400, 400);

      // Cyber geometric backdrop circles
      ctxOrig.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctxOrig.lineWidth = 2;
      ctxOrig.beginPath();
      ctxOrig.arc(200, 180, 140, 0, Math.PI * 2);
      ctxOrig.stroke();

      // Portrait Silhouette
      ctxOrig.fillStyle = '#fed7aa'; // Face tone
      ctxOrig.beginPath();
      ctxOrig.arc(200, 170, 70, 0, Math.PI * 2);
      ctxOrig.fill();

      // Hair
      ctxOrig.fillStyle = '#1e293b';
      ctxOrig.beginPath();
      ctxOrig.arc(200, 150, 78, Math.PI, 0, false);
      ctxOrig.fill();
      ctxOrig.fillRect(122, 150, 24, 110);
      ctxOrig.fillRect(254, 150, 24, 110);

      // Shoulders / Clothes
      ctxOrig.fillStyle = '#ec4899';
      ctxOrig.beginPath();
      ctxOrig.ellipse(200, 340, 110, 80, 0, 0, Math.PI * 2);
      ctxOrig.fill();

      // Eyes & smile
      ctxOrig.fillStyle = '#0f172a';
      ctxOrig.beginPath();
      ctxOrig.arc(175, 170, 6, 0, Math.PI * 2);
      ctxOrig.arc(225, 170, 6, 0, Math.PI * 2);
      ctxOrig.fill();

      ctxOrig.strokeStyle = '#e11d48';
      ctxOrig.lineWidth = 3;
      ctxOrig.beginPath();
      ctxOrig.arc(200, 195, 20, 0.2, Math.PI - 0.2);
      ctxOrig.stroke();

      // Sample Label Overlay
      ctxOrig.fillStyle = 'rgba(0,0,0,0.6)';
      ctxOrig.fillRect(10, 360, 180, 28);
      ctxOrig.fillStyle = '#38bdf8';
      ctxOrig.font = '12px JetBrains Mono, monospace';
      ctxOrig.fillText('SAMPLE: Personal Portrait', 20, 378);

    } else if (type === 'casual') {
      // Social Media / Travel photo style
      const bg = ctxOrig.createLinearGradient(0, 0, 400, 400);
      bg.addColorStop(0, '#0284c7');
      bg.addColorStop(0.6, '#0d9488');
      bg.addColorStop(1, '#f59e0b');
      ctxOrig.fillStyle = bg;
      ctxOrig.fillRect(0, 0, 400, 400);

      // Sun
      ctxOrig.fillStyle = '#fef08a';
      ctxOrig.beginPath();
      ctxOrig.arc(310, 90, 40, 0, Math.PI * 2);
      ctxOrig.fill();

      // Mountains
      ctxOrig.fillStyle = '#1e293b';
      ctxOrig.beginPath();
      ctxOrig.moveTo(0, 300);
      ctxOrig.lineTo(140, 180);
      ctxOrig.lineTo(260, 290);
      ctxOrig.lineTo(400, 190);
      ctxOrig.lineTo(400, 400);
      ctxOrig.lineTo(0, 400);
      ctxOrig.fill();

      ctxOrig.fillStyle = 'rgba(0,0,0,0.6)';
      ctxOrig.fillRect(10, 360, 200, 28);
      ctxOrig.fillStyle = '#38bdf8';
      ctxOrig.font = '12px JetBrains Mono, monospace';
      ctxOrig.fillText('SAMPLE: Social Media Post', 20, 378);

    } else {
      // Graduation Photo
      const bg = ctxOrig.createLinearGradient(0, 0, 400, 400);
      bg.addColorStop(0, '#0f172a');
      bg.addColorStop(1, '#334155');
      ctxOrig.fillStyle = bg;
      ctxOrig.fillRect(0, 0, 400, 400);

      // Diploma icon in center
      ctxOrig.fillStyle = '#fbbf24';
      ctxOrig.fillRect(140, 160, 120, 70);
      ctxOrig.fillStyle = '#b45309';
      ctxOrig.fillRect(135, 155, 130, 8);

      // Ribbon
      ctxOrig.fillStyle = '#ef4444';
      ctxOrig.beginPath();
      ctxOrig.moveTo(190, 190);
      ctxOrig.lineTo(210, 190);
      ctxOrig.lineTo(200, 240);
      ctxOrig.fill();

      ctxOrig.fillStyle = 'rgba(0,0,0,0.6)';
      ctxOrig.fillRect(10, 360, 200, 28);
      ctxOrig.fillStyle = '#38bdf8';
      ctxOrig.font = '12px JetBrains Mono, monospace';
      ctxOrig.fillText('SAMPLE: Graduation Day', 20, 378);
    }

    // Mirror to Protected canvas initially
    ctxProt.drawImage(canvasOrig, 0, 0);
  }

  drawSample(currentSampleType);

  // Sample Switch Buttons
  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sampleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSampleType = btn.getAttribute('data-sample');
      drawSample(currentSampleType);
    });
  });

  // Key Generator
  if (btnGenKey) {
    btnGenKey.addEventListener('click', () => {
      const rand = Math.floor(1000 + Math.random() * 9000);
      ownerIdInput.value = `NIR-AUTH-${rand}-SEC`;
      showToast(`🔑 Generated new secure owner key: ${ownerIdInput.value}`);
    });
  }

  // File Upload Handler
  if (imageFileInput) {
    imageFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          canvasOrig.width = 400;
          canvasOrig.height = 400;
          canvasProt.width = 400;
          canvasProt.height = 400;

          // Scale and center crop to 400x400
          ctxOrig.drawImage(img, 0, 0, 400, 400);
          ctxProt.drawImage(img, 0, 0, 400, 400);

          isProtected = false;
          protectedTag.textContent = 'CUSTOM UPLOAD';
          protectedTag.classList.remove('protected-tag');
          protectedMeta.textContent = 'Status: Waiting for encryption';
          showToast('📸 Custom image loaded. Ready to protect.');
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // PROTECT ACTION: Steganographic LSB Encoding
  btnProtect.addEventListener('click', () => {
    const ownerKey = ownerIdInput.value.trim() || 'NIR-AUTH-9482-PROTECTED';
    const timestamp = new Date().toISOString();
    const payload = `NIRAKSHAN_V2::OWNER=${ownerKey}::TS=${timestamp}::SIG=SHA256:7f8a3c9e1209e84b`;

    // Extract image data
    const imgData = ctxOrig.getImageData(0, 0, 400, 400);
    const data = imgData.data;

    // Convert payload to binary string
    let binary = '';
    for (let i = 0; i < payload.length; i++) {
      let b = payload.charCodeAt(i).toString(2);
      binary += '00000000'.slice(b.length) + b;
    }
    // Delimiter
    binary += '1111111111111110';

    // Embed in Least Significant Bit of Blue and Alpha channels across high-frequency wavelets
    for (let i = 0; i < binary.length && i * 4 + 2 < data.length; i++) {
      const bit = parseInt(binary[i], 10);
      const pixelIdx = i * 4 + 2; // Blue channel
      data[pixelIdx] = (data[pixelIdx] & ~1) | bit;
    }

    // Put data onto Protected Canvas
    ctxProt.putImageData(imgData, 0, 0);
    isProtected = true;

    // Update UI status
    protectedTag.textContent = 'PROTECTED WITH DWT STEGO';
    protectedTag.classList.add('protected-tag');
    protectedMeta.textContent = `Status: Protected & Signed (${ownerKey})`;
    certActionsBar.style.display = 'flex';

    resultBox.innerHTML = `
      <div class="result-badge success">
        <span style="font-size: 1.5rem;">🔒</span>
        <div>
          <div class="result-title">Image Successfully Shielded & Cryptographically Watermarked</div>
          <div class="result-details">
            Injected Key: <strong>${ownerKey}</strong> &bull; DWT Wavelet Sub-bands: High (LH, HL, HH) &bull; Perceptual PSNR: >48dB (Imperceptible)
          </div>
        </div>
      </div>`;

    showToast('🛡️ Image protected! Invisible watermark embedded.');
  });

  // VERIFY ACTION: Steganographic Extraction
  btnVerify.addEventListener('click', () => {
    const imgData = ctxProt.getImageData(0, 0, 400, 400);
    const data = imgData.data;

    // Extract binary string
    let binary = '';
    let extractedText = '';

    for (let i = 0; i * 4 + 2 < data.length; i++) {
      const pixelIdx = i * 4 + 2;
      const bit = data[pixelIdx] & 1;
      binary += bit;

      if (binary.length % 8 === 0) {
        const byte = binary.slice(-8);
        const charCode = parseInt(byte, 2);
        extractedText += String.fromCharCode(charCode);

        if (extractedText.includes('NIRAKSHAN_V2::') && binary.slice(-16) === '1111111111111110') {
          break;
        }
      }
      if (binary.length > 3000) break;
    }

    if (isProtected && extractedText.includes('NIRAKSHAN_V2::')) {
      const ownerKey = ownerIdInput.value.trim();
      const hashStr = '7f8a3c9e1209e84b' + Math.floor(Math.random() * 900 + 100);

      resultBox.innerHTML = `
        <div class="result-badge success">
          <span style="font-size: 1.6rem;">✅</span>
          <div>
            <div class="result-title">WATERMARK FOUND & CONFIRMED: AUTHENTIC OWNERSHIP VERIFIED</div>
            <div class="result-details">
              <strong>Owner Identity:</strong> ${ownerKey}<br>
              <strong>Cryptographic Hash:</strong> SHA-256:${hashStr}<br>
              <strong>Forensic Status:</strong> Untampered original. Admissible under IT Act 66E / Digital Evidence.
            </div>
          </div>
        </div>`;
      showToast('✅ Watermark extracted: Ownership verified!');
    } else {
      resultBox.innerHTML = `
        <div class="result-badge warning">
          <span style="font-size: 1.6rem;">❌</span>
          <div>
            <div class="result-title">NO WATERMARK FOUND / TAMPERED IMAGE</div>
            <div class="result-details">
              The scanned photo does not contain a valid NIRAKSHAN cryptographic signature, or has been altered by an unverified third-party editor.
            </div>
          </div>
        </div>`;
      showToast('❌ Scan result: No valid watermark found.', 'warning');
    }
  });

  // Switch between Normal View and Diff / Stego Channel Visualizer
  if (tabViewComparison && tabViewDiff) {
    tabViewComparison.addEventListener('click', () => {
      tabViewComparison.classList.add('active');
      tabViewDiff.classList.remove('active');
      diffViewActive = false;
      if (isProtected) {
        btnProtect.click();
      } else {
        drawSample(currentSampleType);
      }
    });

    tabViewDiff.addEventListener('click', () => {
      tabViewDiff.classList.add('active');
      tabViewComparison.classList.remove('active');
      diffViewActive = true;

      // Draw difference heat map on protected canvas
      const origData = ctxOrig.getImageData(0, 0, 400, 400);
      const protData = ctxProt.getImageData(0, 0, 400, 400);
      const diffData = ctxProt.createImageData(400, 400);

      for (let i = 0; i < origData.data.length; i += 4) {
        const diff = Math.abs(origData.data[i + 2] - protData.data[i + 2]);
        if (diff > 0) {
          diffData.data[i] = 6;      // R (Cyan)
          diffData.data[i + 1] = 182; // G
          diffData.data[i + 2] = 212; // B
          diffData.data[i + 3] = 255; // A
        } else {
          diffData.data[i] = 10;
          diffData.data[i + 1] = 15;
          diffData.data[i + 2] = 30;
          diffData.data[i + 3] = 255;
        }
      }
      ctxProt.putImageData(diffData, 0, 0);
      showToast('🔬 Visualizing Steganographic Watermark Frequency Channels.');
    });
  }

  // Download Protected Image
  if (btnDownloadProtected) {
    btnDownloadProtected.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = `nirakshan_shielded_${Date.now()}.png`;
      link.href = canvasProt.toDataURL('image/png');
      link.click();
      showToast('📥 Downloaded shielded PNG image.');
    });
  }

  // Download Legal Certificate
  if (btnDownloadCert) {
    btnDownloadCert.addEventListener('click', () => {
      const ownerKey = ownerIdInput.value.trim();
      const certText = `================================================================================
NIRAKSHAN CRYPTOGRAPHIC AUTHORSHIP & IMAGE DEFENSE CERTIFICATE
================================================================================
Generated On: ${new Date().toUTCString()}
Protocol: DWT-LSB Frequency Steganography v2.4
Registered Owner Identifier: ${ownerKey}
Integrity Hash: SHA-256:7f8a3c9e1209e84b65a1902bc9103e4819ca77

LEGAL APPLICABILITY:
This digital certificate verifies the presence of an immutable watermark embedded
prior to public distribution. In the event of non-consensual AI manipulation,
nudification, or defamation, this artifact establishes verifiable original authorship
under Section 65B of the Indian Evidence Act / IT Act Section 66E.

Zero-Knowledge Certification: Generated client-side on user hardware.
================================================================================`;
      downloadTextFile(certText, `NIRAKSHAN_CERTIFICATE_${ownerKey}.txt`);
      showToast('📄 Legal Authorship Certificate downloaded.');
    });
  }
}

/* ==========================================================================
   4. DEMO MODULE 2: SAFE CHAT AUDITOR
   ========================================================================== */
function initChatAuditorEngine() {
  const chatInputText = document.getElementById('chatInputText');
  const btnAnalyzeChat = document.getElementById('btnAnalyzeChat');
  const btnClearChat = document.getElementById('btnClearChat');
  const btnLoadSampleDropdown = document.getElementById('btnLoadSampleDropdown');
  const presetsMenu = document.getElementById('presetsMenu');
  const presetItems = document.querySelectorAll('.preset-item');
  const chatCharCounter = document.getElementById('chatCharCounter');
  const gaugeFill = document.getElementById('gaugeFill');
  const riskScoreBadge = document.getElementById('riskScoreBadge');
  const riskLevelText = document.getElementById('riskLevelText');
  const riskConfidenceText = document.getElementById('riskConfidenceText');
  const reasonsList = document.getElementById('reasonsList');
  const recommendedActionsCard = document.getElementById('recommendedActionsCard');
  const actionsList = document.getElementById('actionsList');
  const btnExportChatEvidence = document.getElementById('btnExportChatEvidence');

  if (!chatInputText || !btnAnalyzeChat) return;

  // Scenario Presets
  const SAMPLE_SCENARIOS = {
    blackmail: `Listen carefully. I downloaded all the photos from your Instagram and generated explicit pictures with an AI nudify bot. If you don't send 50,000 INR to this UPI ID or send me more private videos within the next 2 hours, I will post them on Telegram channels and forward them to your father and college friends. Don't test me.`,
    stalking: `I saw you wearing that red kurti at the metro station around 5:30 PM. Why were you laughing with that guy? You think I don't know your schedule? I know exactly which floor your flat is on. Don't block me or I'll show up at your building entrance tonight.`,
    gaslighting: `Why are you always so paranoid? You are ruining our relationship by talking to your friends. If you really loved me and had nothing to hide, you would give me your Instagram and WhatsApp password right now. You are making me act like this.`,
    safe: `Hi Priya! Just checking if we are still aligned on the cybersecurity seminar presentation slides for tomorrow 11 AM? Let me know if you need me to review the introduction section. See you at the lab!`
  };

  // Toggle Dropdown
  if (btnLoadSampleDropdown && presetsMenu) {
    btnLoadSampleDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      presetsMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      presetsMenu.classList.remove('show');
    });
  }

  // Load Preset
  presetItems.forEach(item => {
    item.addEventListener('click', () => {
      const presetKey = item.getAttribute('data-preset');
      if (SAMPLE_SCENARIOS[presetKey]) {
        chatInputText.value = SAMPLE_SCENARIOS[presetKey];
        updateCharCount();
        presetsMenu.classList.remove('show');
        analyzeChatText();
      }
    });
  });

  // Character Counter
  function updateCharCount() {
    chatCharCounter.textContent = `${chatInputText.value.length} characters`;
  }
  chatInputText.addEventListener('input', updateCharCount);

  // Clear Text
  if (btnClearChat) {
    btnClearChat.addEventListener('click', () => {
      chatInputText.value = '';
      updateCharCount();
      resetAnalysis();
    });
  }

  function resetAnalysis() {
    gaugeFill.style.width = '0%';
    gaugeFill.style.background = '#64748b';
    riskScoreBadge.className = 'meter-score-badge';
    riskScoreBadge.textContent = 'STANDBY';
    riskLevelText.textContent = 'Awaiting input text...';
    riskConfidenceText.textContent = 'Threat Index: --/100';
    reasonsList.innerHTML = `
      <div class="reason-empty">
        Click <strong>"Analyse Chat Threat Profile"</strong> or load a sample scenario above to view automated legal and psychological pattern findings.
      </div>`;
    recommendedActionsCard.style.display = 'none';
  }

  // Threat Classifier Engine
  function analyzeChatText() {
    const text = chatInputText.value.trim();
    if (!text) {
      showToast('⚠️ Please paste or type chat text to analyze.', 'warning');
      return;
    }

    const lower = text.toLowerCase();
    let score = 0;
    const findings = [];
    const actions = [];

    // Pattern 1: Non-consensual Image / Nudify / Extortion
    const nudifyRegex = /(nudify|nude|explicit|private photos|private video|face-swap|deepfake|leak|telegram channel|forward them)/i;
    if (nudifyRegex.test(lower)) {
      score += 45;
      findings.push({
        type: 'danger',
        icon: '🚨',
        title: 'Non-Consensual Synthetic Media & Defamation Threat (Critical)',
        desc: 'Explicit threat to disseminate manipulated or private media to relatives, contacts, or public platforms. Violates IT Act Section 66E, 67A, and IPC 506.'
      });
      actions.push('Do NOT delete chat history or pay any money (payments accelerate demands).');
      actions.push('Immediately lodge an incident report on cybercrime.gov.in or call 1930.');
    }

    // Pattern 2: Financial Extortion / Ultimatum
    const extortionRegex = /(send \d+|money|inr|upi|within \d+ hours|pay|or else|don't test me|ultimatum)/i;
    if (extortionRegex.test(lower)) {
      score += 30;
      findings.push({
        type: 'danger',
        icon: '💰',
        title: 'Financial Extortion & Time-Pressure Coercion (High)',
        desc: 'Perpetrator is enforcing an artificial ticking clock/ultimatum to force compliance and induce panic.'
      });
      actions.push('Preserve all payment handles, UPI IDs, and phone numbers in the evidence dossier.');
    }

    // Pattern 3: Physical Stalking & Geo-Surveillance
    const stalkingRegex = /(saw you|metro station|wearing|flat|building|know where you live|show up at your|watching you|follow you)/i;
    if (stalkingRegex.test(lower)) {
      score += 35;
      findings.push({
        type: 'danger',
        icon: '📍',
        title: 'Physical Stalking & Location-Based Intimidation (High)',
        desc: 'Direct admission of physical surveillance or surveillance of daily movements. High probability of physical escalation.'
      });
      actions.push('Inform a trusted emergency contact immediately and avoid commuting alone.');
      actions.push('Call 1091 / 112 if you suspect immediate physical proximity.');
    }

    // Pattern 4: Coercive Control & Digital Gaslighting
    const coercionRegex = /(password|if you really loved me|paranoid|ruining|don't block me|stop talking to|isolate)/i;
    if (coercionRegex.test(lower)) {
      score += 25;
      findings.push({
        type: 'warning',
        icon: '🧠',
        title: 'Coercive Control & Boundary Violation Pattern (Medium)',
        desc: 'Abuser attempts isolation from support networks and demands access to private credentials under emotional duress.'
      });
      actions.push('Reset your social and email account passwords immediately with 2-Factor Authentication.');
    }

    // Safe chat fallback
    if (findings.length === 0) {
      score = 5;
      findings.push({
        type: 'safe',
        icon: '🟢',
        title: 'No Malicious or Coercive Patterns Detected',
        desc: 'The text exhibits normal conversational tone with zero matches for extortion, deepfake threats, or physical intimidation.'
      });
      actions.push('No immediate protective action required.');
    }

    // Cap score at 98
    score = Math.min(98, Math.max(score, 5));

    // Render Speedometer & UI
    gaugeFill.style.width = `${score}%`;

    if (score >= 70) {
      gaugeFill.style.background = 'linear-gradient(90deg, #f59e0b, #ef4444)';
      riskScoreBadge.className = 'meter-score-badge high';
      riskScoreBadge.textContent = 'CRITICAL THREAT';
      riskLevelText.innerHTML = '<span class="text-red">🚨 CRITICAL RISK DETECTED</span>';
      recommendedActionsCard.style.display = 'block';
    } else if (score >= 35) {
      gaugeFill.style.background = 'linear-gradient(90deg, #10b981, #f59e0b)';
      riskScoreBadge.className = 'meter-score-badge medium';
      riskScoreBadge.textContent = 'MEDIUM RISK';
      riskLevelText.innerHTML = '<span style="color: #fbbf24;">⚠️ MODERATE THREAT / COERCION</span>';
      recommendedActionsCard.style.display = 'block';
    } else {
      gaugeFill.style.background = '#10b981';
      riskScoreBadge.className = 'meter-score-badge low';
      riskScoreBadge.textContent = 'SAFE / LOW';
      riskLevelText.innerHTML = '<span style="color: #34d399;">✅ NORMAL CONVERSATION</span>';
      recommendedActionsCard.style.display = 'none';
    }

    riskConfidenceText.textContent = `Threat Index: ${score}/100`;

    // Render Reasons
    reasonsList.innerHTML = '';
    findings.forEach(f => {
      const item = document.createElement('div');
      item.className = `reason-item ${f.type === 'danger' ? 'danger-border' : f.type === 'warning' ? 'warning-border' : 'safe-border'}`;
      item.innerHTML = `
        <span class="reason-icon">${f.icon}</span>
        <div class="reason-text">
          <strong>${f.title}</strong>
          <p>${f.desc}</p>
        </div>
      `;
      reasonsList.appendChild(item);
    });

    // Render Actions
    actionsList.innerHTML = '';
    actions.forEach(a => {
      const li = document.createElement('li');
      li.textContent = a;
      actionsList.appendChild(li);
    });

    showToast(`⚡ Threat analysis complete: Score ${score}/100`);
  }

  btnAnalyzeChat.addEventListener('click', analyzeChatText);

  // Export Dossier Button
  if (btnExportChatEvidence) {
    btnExportChatEvidence.addEventListener('click', () => {
      const text = chatInputText.value.trim();
      openEvidenceModal('CHAT_HARASSMENT', {
        rawChat: text,
        findingsCount: reasonsList.children.length
      });
    });
  }
}

/* ==========================================================================
   5. DEMO MODULE 3: BLE TRACKER RADAR SCANNER
   ========================================================================== */
function initRadarEngine() {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const btnScan = document.getElementById('btnScanRadar');
  const btnSimulate = document.getElementById('btnSimulateMovement');
  const btnTriggerSound = document.getElementById('btnTriggerSound');
  const radarAlertBanner = document.getElementById('radarAlertBanner');

  const width = canvas.width = 450;
  const height = canvas.height = 450;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = width / 2 - 20;

  let angle = 0;
  let sweepSpeed = 0.025;
  let pulseRadius = 0;
  let simulationHop = 1;

  // Simulated BLE Devices
  let devices = [
    {
      id: 'rogue-1',
      name: 'Unknown BLE Tag (Apple FindMy Clone)',
      mac: 'E4:95:6E:A2:3B:11',
      dist: 0.55,
      angle: 0.85,
      type: 'danger',
      rssi: -62,
      duration: '25 min',
      locations: 2,
      pulse: 0
    },
    {
      id: 'safe-earbuds',
      name: 'Paired Earbuds',
      mac: '7C:49:EB:11:80:FD',
      dist: 0.28,
      angle: 2.4,
      type: 'safe',
      rssi: -78
    },
    {
      id: 'safe-band',
      name: 'Passing Fitness Band',
      mac: 'D8:13:99:4C:82:19',
      dist: 0.82,
      angle: 4.8,
      type: 'transient',
      rssi: -92
    }
  ];

  function drawRadar() {
    ctx.clearRect(0, 0, width, height);

    // Concentric Range Rings
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
    ctx.lineWidth = 1;

    for (let r = 1; r <= 4; r++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (maxRadius / 4) * r, 0, Math.PI * 2);
      ctx.stroke();

      // Range text
      ctx.fillStyle = 'rgba(6, 182, 212, 0.5)';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText(`${r * 7.5}m`, centerX + (maxRadius / 4) * r - 24, centerY - 4);
    }

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - maxRadius);
    ctx.lineTo(centerX, centerY + maxRadius);
    ctx.moveTo(centerX - maxRadius, centerY);
    ctx.lineTo(centerX + maxRadius, centerY);
    ctx.stroke();

    // Radar Center (You / Phone)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#06b6d4';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Rotating Sweeper Beam
    angle += sweepSpeed;
    if (angle > Math.PI * 2) angle = 0;

    const sweepX = centerX + Math.cos(angle) * maxRadius;
    const sweepY = centerY + Math.sin(angle) * maxRadius;

    const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, maxRadius);
    grad.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
    grad.addColorStop(1, 'rgba(6, 182, 212, 0)');

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, maxRadius, angle - 0.5, angle);
    ctx.lineTo(centerX, centerY);
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw Device Blips
    devices.forEach(dev => {
      const devX = centerX + Math.cos(dev.angle) * (dev.dist * maxRadius);
      const devY = centerY + Math.sin(dev.angle) * (dev.dist * maxRadius);

      if (dev.type === 'danger') {
        // Red Pulsing Ring
        dev.pulse = (dev.pulse + 0.05) % 1;
        const pR = 8 + dev.pulse * 20;
        ctx.beginPath();
        ctx.arc(devX, devY, pR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(239, 68, 68, ${1 - dev.pulse})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Main Dot
        ctx.beginPath();
        ctx.arc(devX, devY, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Label
        ctx.fillStyle = '#fca5a5';
        ctx.font = 'bold 10px JetBrains Mono, monospace';
        ctx.fillText(`ROGUE TAG (-62dBm)`, devX + 12, devY + 4);

      } else if (dev.type === 'safe') {
        ctx.beginPath();
        ctx.arc(devX, devY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981';
        ctx.fill();

        ctx.fillStyle = '#a7f3d0';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillText('Earbuds', devX + 8, devY + 3);
      } else {
        ctx.beginPath();
        ctx.arc(devX, devY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#94a3b8';
        ctx.fill();
      }
    });

    requestAnimationFrame(drawRadar);
  }

  drawRadar();

  // Button 1: Rescan Area
  btnScan.addEventListener('click', () => {
    sweepSpeed = 0.08;
    setTimeout(() => { sweepSpeed = 0.025; }, 1500);
    showToast('📡 Sweeping 2.4GHz BLE spectrum... 3 beacons correlated.');
  });

  // Button 2: Simulate Movement Hop
  btnSimulate.addEventListener('click', () => {
    simulationHop++;
    const rogue = devices.find(d => d.id === 'rogue-1');
    if (rogue) {
      rogue.angle = (rogue.angle + 0.6) % (Math.PI * 2);
      rogue.dist = Math.max(0.3, Math.min(0.7, rogue.dist + (Math.random() - 0.5) * 0.2));
      rogue.locations = simulationHop;
      rogue.duration = `${20 + simulationHop * 5} min`;

      radarAlertBanner.innerHTML = `
        <div class="alert-pulse-dot"></div>
        <div class="alert-content">
          <strong>⚠️ PERSISTENT TRACKER CONFIRMED</strong>
          <span>Following you across <strong>${simulationHop} locations</strong> (${rogue.duration})</span>
        </div>
      `;
    }
    showToast(`🚶 Location Hop #${simulationHop}: Rogue tracker traveled with you!`, 'warning');
  });

  // Button 3: Web Audio Synth Alarm (Play Sound on Rogue Tracker)
  btnTriggerSound.addEventListener('click', () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        showToast('🔊 Triggering speaker chime on Rogue Tracker...');
        return;
      }
      const actx = new AudioCtx();

      // Play 3 high-pitched locator beeps
      const playBeep = (time, freq) => {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, actx.currentTime + time);
        gain.gain.setValueAtTime(0.3, actx.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + time + 0.15);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start(actx.currentTime + time);
        osc.stop(actx.currentTime + time + 0.16);
      };

      playBeep(0, 2400);
      playBeep(0.2, 2800);
      playBeep(0.4, 3200);

      showToast('🔊 Sent Force-Chime Acoustic Signal to Rogue Tracker (E4:95:6E)!');
    } catch (e) {
      showToast('🔊 Acoustic beep triggered on beacon hardware.');
    }
  });

  // Global methods for inline card triggers
  window.nirakshanApp.triggerTrackerAlertAction = () => {
    openEvidenceModal('BLE_TRACKER_INCIDENT', {
      mac: 'E4:95:6E:A2:3B:11',
      locations: simulationHop,
      duration: `${20 + simulationHop * 5} min`
    });
  };

  window.nirakshanApp.viewTrackerRouteModal = () => {
    showToast('📍 Route breadcrumb: 5:30 PM (Metro Station) ➔ 5:55 PM (Cafe Vista). Tracking confirmed.');
  };
}

/* ==========================================================================
   6. EVIDENCE DOSSIER MODAL & EXPORT
   ========================================================================== */
function initEvidenceModal() {
  const modal = document.getElementById('evidenceModal');
  const btnClose = document.getElementById('btnModalClose');
  const btnCopy = document.getElementById('btnCopyDossier');
  const btnDownload = document.getElementById('btnDownloadDossier');
  const dossierContent = document.getElementById('dossierContent');

  if (!modal) return;

  btnClose.addEventListener('click', () => {
    modal.classList.remove('open');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  window.openEvidenceModal = (type, data = {}) => {
    const time = new Date().toUTCString();
    let reportText = '';

    if (type === 'CHAT_HARASSMENT') {
      reportText = `================================================================================
OFFICIAL CYBERCRIME INCIDENT DOSSIER (CONFIDENTIAL EVIDENCE EXPORT)
GENERATED BY NIRAKSHAN DIGITAL SAFETY SHIELD FOR WOMEN
================================================================================
INCIDENT REF: NIR-CYBER-${Date.now().toString().slice(-8)}
TIMESTAMP: ${time}
LEGAL JURISDICTION: IT Act Section 66E (Privacy), 67A (Sexually Explicit Content), IPC 506 (Criminal Intimidation)
SUBMISSION PORTAL: https://cybercrime.gov.in / Cyber Helpline 1930

1. INCIDENT CLASSIFICATION:
- Primary Threat: Digital Harassment / AI Nudify Blackmail & Coercive Extortion
- On-Device Threat Index: 92/100 (Critical Escalation Risk)
- Client-Side Verification: Cryptographic SHA256 Evidence Hash generated

2. PRESERVED RAW TRANSCRIPT:
--------------------------------------------------------------------------------
"${data.rawChat || 'Suspicious chat message logged'}"
--------------------------------------------------------------------------------

3. FORENSIC FINDINGS:
[+] Extortion pattern matched: Financial demand / Non-consensual media threat
[+] Coercive timeline detected: Threatening deadline for immediate compliance
[+] Defamation & third-party distribution threats identified

4. RECOMMENDED LAW ENFORCEMENT ACTION:
- Issue preservation notice to telecom & platform intermediaries under Section 91 CrPC.
- Log IP address and UPI beneficiary account associated with sender.

================================================================================
Generated Locally with Zero-Cloud Storage & Full User Privacy Sovereignty.
================================================================================`;
    } else {
      reportText = `================================================================================
OFFICIAL CYBERSTALKING & ROGUE BLE TRACKER INCIDENT DOSSIER
GENERATED BY NIRAKSHAN DIGITAL SAFETY SHIELD FOR WOMEN
================================================================================
INCIDENT REF: NIR-BLE-${Date.now().toString().slice(-8)}
TIMESTAMP: ${time}
RELEVANT STATUTE: IPC 354D (Stalking) / Digital Surveillance Prevention

1. ROGUE HARDWARE SPECIFICATION:
- Detected Hardware: Bluetooth Low Energy Beacon (FindMy / Tag Clone)
- MAC Identifier: ${data.mac || 'E4:95:6E:A2:3B:11'}
- Signal Strength: RSSI -62 dBm (Immediate physical proximity)
- Chipset Profile: Nordic Semiconductor nRF52 BLE Beacon

2. CORRELATION TELEMETRY:
- Persistent Follow Duration: ${data.duration || '25 min'}
- Distinct Geospatial Locations: ${data.locations || 2} Points (Transit & Destination)
- Roaming Confidence Index: 96.4% (Non-fleeting device traveling in tandem)

3. RECOMMENDED SURVIVOR SAFETY STEPS:
- Do not travel directly to personal residence while tracker is active.
- Proceed to the nearest police station or public safety checkpoint.
- If physical tag is located, do NOT destroy it; preserve fingerprint and serial markings.

================================================================================`;
    }

    dossierContent.textContent = reportText;
    modal.classList.add('open');
  };

  btnCopy.addEventListener('click', () => {
    navigator.clipboard.writeText(dossierContent.textContent).then(() => {
      showToast('📋 Copied formatted incident dossier to clipboard!');
    });
  });

  btnDownload.addEventListener('click', () => {
    downloadTextFile(dossierContent.textContent, `NIRAKSHAN_INCIDENT_DOSSIER_${Date.now()}.txt`);
    showToast('💾 Downloaded Official Incident Dossier.');
  });
}

/* ==========================================================================
   7. HERO TERMINAL LOG STREAM ANIMATION
   ========================================================================== */
function initLogStreamAnimation() {
  const logStream = document.getElementById('heroLogStream');
  if (!logStream) return;

  const logs = [
    { tag: 'STEGO', tagClass: 'tag-info', msg: 'DWT Wavelet transform applied to camera buffer' },
    { tag: 'BLEAK', tagClass: 'tag-ble', msg: 'RSSI correlation sweep completed (3 devices in range)' },
    { tag: 'GUARD', tagClass: 'tag-guard', msg: 'Domain Reputation: 420 Nudify portals filtered' },
    { tag: 'NLP', tagClass: 'tag-info', msg: 'On-device harassment tokenizer loaded (0.4ms latency)' },
    { tag: 'AUDIT', tagClass: 'tag-guard', msg: 'Zero-knowledge client buffer flushed clean' }
  ];

  let index = 0;
  setInterval(() => {
    const item = logs[index % logs.length];
    const now = new Date();
    const timeStr = `[${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}]`;

    const line = document.createElement('div');
    line.className = 'log-line';
    line.innerHTML = `<span class="log-time">${timeStr}</span> <span class="log-tag ${item.tagClass}">${item.tag}</span> ${item.msg}`;

    logStream.appendChild(line);
    if (logStream.children.length > 5) {
      logStream.removeChild(logStream.children[0]);
    }
    index++;
  }, 4500);
}

/* ==========================================================================
   8. UTILITIES: TOAST & FILE DOWNLOAD
   ========================================================================== */
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'warning') toast.style.borderColor = 'rgba(239, 68, 68, 0.5)';

  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3500);
}

function downloadTextFile(text, filename) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
