/**
 * NIRAKSHAN — shared design tokens.
 *
 * These deliberately mirror web/src/index.css so the dashboard, the mobile app
 * and the extension read as one product rather than three.
 */

export const colors = {
  bg: '#060B13',
  surface: '#091122',
  surfaceAlt: '#0F1B2E',
  line: '#1E293B',
  lineSoft: '#172033',
  text: '#E2E8F0',
  muted: '#94A3B8',
  faint: '#64748B',

  accent: '#22D3EE',
  accentDeep: '#0891B2',
  indigo: '#4F46E5',

  ok: '#10B981',
  warn: '#F59E0B',
  danger: '#E11D48',
};

export const radius = { sm: 10, md: 14, lg: 18, xl: 24, pill: 999 };

export const space = (n) => n * 4;

/** Maps a risk level to a colour, defaulting to neutral for unknown values. */
export function riskColor(level) {
  switch (String(level).toUpperCase()) {
    case 'HIGH':
    case 'CRITICAL':
      return colors.danger;
    case 'MEDIUM':
    case 'WARNING':
      return colors.warn;
    case 'LOW':
    case 'SAFE':
      return colors.ok;
    default:
      return colors.faint;
  }
}

export const TYPOGRAPHY = {
  display: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  title: { fontSize: 18, fontWeight: '700', color: colors.text },
  body: { fontSize: 14, color: colors.muted, lineHeight: 20 },
  small: { fontSize: 12, color: colors.muted, lineHeight: 17 },
  micro: { fontSize: 10, color: colors.faint, letterSpacing: 1, textTransform: 'uppercase' },
};
