import { MatchResult, Report } from '../types.ts';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'with', 'from',
  'by', 'about', 'as', 'into', 'like', 'through', 'after', 'over', 'between',
  'out', 'against', 'during', 'without', 'before', 'under', 'around', 'among',
  'item', 'lost', 'found', 'please', 'help', 'contact', 'lpu'
]);

function extractKeywords(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !STOP_WORDS.has(word));
}

export function calculateMatchScore(item1: Report, item2: Report): { score: number; reasons: string[] } {
  // Only match opposite types (lost with found)
  if (item1.type === item2.type) {
    return { score: 0, reasons: [] };
  }

  // Do not match item with itself
  if (item1.id === item2.id) {
    return { score: 0, reasons: [] };
  }

  let score = 0;
  const reasons: string[] = [];

  // 1. Category match (Weight: 35)
  if (item1.category === item2.category && item1.category !== 'Other Items') {
    score += 35;
    reasons.push(`Same category: ${item1.category}`);
  }

  // 2. Location match (Weight: 30)
  if (item1.location === item2.location && item1.location !== 'Other LPU Campus Spot') {
    score += 30;
    reasons.push(`Same location: ${item1.location}`);
  } else if (
    item1.location.includes('Block') &&
    item2.location.includes('Block') &&
    item1.location.split(' ')[1] === item2.location.split(' ')[1]
  ) {
    score += 25;
    reasons.push(`Same block`);
  }

  // 3. Keyword overlap in Title and Description (Weight: up to 35)
  const keywords1 = new Set([...extractKeywords(item1.title), ...extractKeywords(item1.description)]);
  const keywords2 = extractKeywords(item2.title);
  const keywords2All = new Set([...keywords2, ...extractKeywords(item2.description)]);

  const sharedTitleKeywords = keywords2.filter((kw) => keywords1.has(kw));
  const sharedAllKeywords = Array.from(keywords1).filter((kw) => keywords2All.has(kw));

  if (sharedTitleKeywords.length > 0) {
    score += Math.min(25, sharedTitleKeywords.length * 15);
    reasons.push(`Title matches: "${sharedTitleKeywords.slice(0, 3).join(', ')}"`);
  } else if (sharedAllKeywords.length > 0) {
    score += Math.min(15, sharedAllKeywords.length * 8);
    reasons.push(`Shared keywords: "${sharedAllKeywords.slice(0, 3).join(', ')}"`);
  }

  return {
    score: Math.min(100, score),
    reasons,
  };
}

export function findPotentialMatches(
  targetItem: Report,
  allItems: Report[],
  minScore = 30
): MatchResult[] {
  const matches: MatchResult[] = [];

  for (const item of allItems) {
    if (item.id === targetItem.id) continue;
    const { score, reasons } = calculateMatchScore(targetItem, item);
    if (score >= minScore) {
      matches.push({
        report: item,
        score,
        reasons,
      });
    }
  }

  // Sort by highest score first, then newest
  return matches.sort((a, b) => b.score - a.score);
}
