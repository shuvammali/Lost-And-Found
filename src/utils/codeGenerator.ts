/**
 * Utility functions for generating, normalizing, and verifying
 * secure report resolution PINs / keys for LPU Lost & Found.
 */

const CHARSET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excludes 0/O, 1/I to prevent visual ambiguity

export function generateResolutionCode(): string {
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * CHARSET.length);
    randomPart += CHARSET[randomIndex];
  }
  return `LPU-${randomPart}`;
}

export function normalizeCode(code: string): string {
  if (!code) return '';
  return code
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/^LPU-?/, ''); // normalize with or without LPU- prefix
}

export function validateResolutionCode(inputCode: string, actualCode: string): boolean {
  if (!inputCode || !actualCode) return false;
  const normalizedInput = normalizeCode(inputCode);
  const normalizedActual = normalizeCode(actualCode);
  return normalizedInput === normalizedActual && normalizedInput.length >= 4;
}
