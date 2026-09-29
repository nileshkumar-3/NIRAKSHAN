/**
 * NIRAKSHAN — prototype invisible provenance marker (browser edition).
 *
 * WHAT THIS IS
 * A least-significant-bit (LSB) steganographic marker that records that a file
 * was processed by NIRAKSHAN, together with a timestamp and a content digest.
 * It is a *prototype* provenance / integrity mechanism.
 *
 * WHAT THIS IS NOT
 * It does NOT prove authorship, it does NOT prove an image is "untouched", and
 * it does NOT identify who manipulated an image. LSB markers are destroyed by
 * ordinary re-encoding (e.g. saving as JPEG), cropping, resizing, and most
 * social-platform upload pipelines. Therefore:
 *   - marker detected  -> "this file still carries our marker"
 *   - marker missing   -> inconclusive, NOT proof of tampering
 *
 * The same disclaimer is surfaced in the UI wherever a result is shown.
 */

const MAGIC = 'NIRAKSHAN_V1';
const FOOTER = 0xbeef;
const HEADER_BITS = 16;
const FOOTER_BITS = 16;
const MAX_PAYLOAD_BYTES = 2048;
const CHANNEL = 2; // blue channel — least visible to the eye in LSB

/* ------------------------------------------------------------------ */
/* Bit helpers (MSB-first)                                             */
/* ------------------------------------------------------------------ */

/** Big-endian 16-bit expansion. Header/footer are a full 16 bits each. */
function uint16ToBits(value) {
  const bits = [];
  for (let b = 15; b >= 0; b -= 1) bits.push((value >> b) & 1);
  return bits;
}

function bitsToUint16(bits, offset) {
  let value = 0;
  for (let i = 0; i < 16; i += 1) value = (value << 1) | bits[offset + i];
  return value >>> 0;
}

function bytesToBits(bytes) {
  const bits = [];
  for (let i = 0; i < bytes.length; i += 1) {
    for (let bit = 7; bit >= 0; bit -= 1) {
      bits.push((bytes[i] >> bit) & 1);
    }
  }
  return bits;
}

function bitsToBytes(bits) {
  const bytes = new Uint8Array(bits.length / 8);
  for (let i = 0; i < bytes.length; i += 1) {
    let value = 0;
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value << 1) | bits[i * 8 + bit];
    }
    bytes[i] = value;
  }
  return bytes;
}

const textToBytes = (text) => new TextEncoder().encode(text);
const bytesToText = (bytes) => new TextDecoder().decode(bytes);

/* ------------------------------------------------------------------ */
/* Pixel access                                                        */
/* ------------------------------------------------------------------ */

const capacityOf = (imageData) => imageData.width * imageData.height;

function writeBit(data, pixelIndex, value) {
  const i = pixelIndex * 4 + CHANNEL;
  data[i] = value ? data[i] | 1 : data[i] & 0xfe;
}

function readBit(data, pixelIndex) {
  return (data[pixelIndex * 4 + CHANNEL] & 1) >>> 0;
}

/** Reads `count` LSBs starting at `startPixel` into a bit array. */
function readBits(data, startPixel, count) {
  const bits = [];
  for (let i = 0; i < count; i += 1) bits.push(readBit(data, startPixel + i));
  return bits;
}

/* ------------------------------------------------------------------ */
/* Payload format                                                      */
/* ------------------------------------------------------------------ */

/**
 * @param {{ verificationId: string, timestamp: string, digest: string }} meta
 */
export function buildProvenancePayload({ verificationId, timestamp, digest }) {
  return [MAGIC, `VID=${verificationId}`, `TS=${timestamp}`, `SHA256=${digest}`].join('|');
}

export function parseProvenancePayload(text) {
  if (typeof text !== 'string' || !text.startsWith(MAGIC)) return null;
  const out = { magic: MAGIC };
  text
    .slice(MAGIC.length + 1)
    .split('|')
    .forEach((pair) => {
      const idx = pair.indexOf('=');
      if (idx > 0) out[pair.slice(0, idx).toLowerCase()] = pair.slice(idx + 1);
    });
  return out;
}

/* ------------------------------------------------------------------ */
/* Embed / read                                                        */
/* ------------------------------------------------------------------ */

/**
 * Embed the payload. Returns a NEW ImageData; the input is not mutated.
 * @returns {{ ok: true, imageData: ImageData } | { ok: false, reason: string }}
 */
export function embedProvenanceMarker(imageData, payload) {
  const bytes = textToBytes(payload);
  if (bytes.length > MAX_PAYLOAD_BYTES) {
    return { ok: false, reason: `Payload too large (${bytes.length} bytes, max ${MAX_PAYLOAD_BYTES}).` };
  }

  const bits = [...uint16ToBits(bytes.length), ...bytesToBits(bytes), ...uint16ToBits(FOOTER)];

  if (capacityOf(imageData) < bits.length) {
    return {
      ok: false,
      reason: `Image too small to hold the marker (needs ${bits.length} px, has ${capacityOf(imageData)} px).`,
    };
  }

  const out = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height,
  );

  for (let i = 0; i < bits.length; i += 1) writeBit(out.data, i, bits[i]);
  return { ok: true, imageData: out };
}

/**
 * @returns {{ found: boolean, payload: object | null, raw: string | null, reason?: string }}
 */
export function readProvenanceMarker(imageData) {
  const data = imageData.data;
  const capacity = capacityOf(imageData);

  if (capacity < HEADER_BITS + FOOTER_BITS + 8) {
    return { found: false, payload: null, raw: null, reason: 'Image too small to contain a marker.' };
  }

  const length = bitsToUint16(readBits(data, 0, HEADER_BITS), 0);

  if (length < 4 || length > MAX_PAYLOAD_BYTES) {
    return { found: false, payload: null, raw: null, reason: 'No NIRAKSHAN marker header found.' };
  }

  const totalBits = HEADER_BITS + length * 8 + FOOTER_BITS;
  if (capacity < totalBits) {
    return { found: false, payload: null, raw: null, reason: 'Marker header present but image is truncated.' };
  }

  const bodyBits = readBits(data, HEADER_BITS, length * 8);

  const footerOffset = HEADER_BITS + length * 8;
  const footer = bitsToUint16(readBits(data, footerOffset, FOOTER_BITS), 0);

  if (footer !== FOOTER) {
    return {
      found: false,
      payload: null,
      raw: null,
      reason: 'Marker header found but the footer check failed — the file was very likely re-encoded or edited.',
    };
  }

  const raw = bytesToText(bitsToBytes(bodyBits));
  const payload = parseProvenancePayload(raw);
  if (!payload) {
    return { found: false, payload: null, raw, reason: 'Marker present but not a valid NIRAKSHAN payload.' };
  }

  return { found: true, payload, raw };
}

/* ------------------------------------------------------------------ */
/* Image helpers                                                       */
/* ------------------------------------------------------------------ */

export async function fileToImageData(file) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(bitmap, 0, 0);
  if (typeof bitmap.close === 'function') bitmap.close();
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export async function imageDataToBlob(imageData, type = 'image/png') {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  canvas.getContext('2d').putImageData(imageData, 0, 0);
  return new Promise((resolve) => canvas.toBlob(resolve, type, 0.95));
}

/** SHA-256 hex digest. Returns null when Web Crypto is unavailable. */
export async function sha256Hex(blob) {
  try {
    const buffer = await blob.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    return null;
  }
}

/**
 * Draws a deterministic placeholder portrait so DEMO 1 can run with zero setup
 * (no judge-supplied file required). Clearly synthetic — it is not a real photo.
 */
export function createSamplePortraitBlob() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');

  const bg = ctx.createLinearGradient(0, 0, 512, 640);
  bg.addColorStop(0, '#0d1f3c');
  bg.addColorStop(0.55, '#1b1740');
  bg.addColorStop(1, '#2a0f33');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 512, 640);

  const halo = ctx.createRadialGradient(256, 250, 20, 256, 250, 250);
  halo.addColorStop(0, 'rgba(103, 232, 249, 0.35)');
  halo.addColorStop(1, 'rgba(103, 232, 249, 0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, 512, 640);

  ctx.fillStyle = 'rgba(148, 163, 184, 0.55)';
  ctx.beginPath();
  ctx.ellipse(256, 700, 210, 190, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(226, 232, 240, 0.75)';
  ctx.beginPath();
  ctx.ellipse(256, 250, 118, 150, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
  ctx.beginPath();
  ctx.ellipse(256, 160, 128, 96, 0, Math.PI, 0);
  ctx.fill();

  ctx.fillStyle = 'rgba(6, 11, 19, 0.9)';
  ctx.font = '600 17px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SYNTHETIC SAMPLE - NOT A REAL PHOTO', 256, 612);

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}
