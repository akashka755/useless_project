// Text scrambling and scattering utilities for Flopkart

const GLITCH_CHARS = '#$%&*+?@~^/\\|=01§Øµ¥£';

export function scrambleText(originalText: string, progress: number): string {
  // progress from 0 (fully scrambled) to 1 (restored)
  if (progress >= 1) return originalText;

  const chars = originalText.split('');
  const threshold = Math.floor(chars.length * progress);

  return chars
    .map((char, index) => {
      if (char === ' ') return ' ';
      if (index < threshold) return char;
      const randIdx = Math.floor(Math.random() * GLITCH_CHARS.length);
      return GLITCH_CHARS[randIdx];
    })
    .join('');
}

export interface ScatterOffset {
  x: number;
  y: number;
  rotate: number;
}

export function generateRandomScatter(): ScatterOffset {
  const angle = Math.random() * Math.PI * 2;
  const distance = 40 + Math.random() * 80;
  return {
    x: Math.round(Math.cos(angle) * distance),
    y: Math.round(Math.sin(angle) * distance),
    rotate: Math.round((Math.random() - 0.5) * 45),
  };
}
