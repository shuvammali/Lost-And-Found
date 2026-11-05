import test from 'node:test';
import assert from 'node:assert/strict';
import { generateResolutionCode, normalizeCode, validateResolutionCode } from './codeGenerator.ts';
import { calculateMatchScore, findPotentialMatches } from './matchmaker.ts';
import { filterReports } from './filtering.ts';
import { Report } from '../types.ts';

test('generateResolutionCode generates LPU prefixed code of appropriate length', () => {
  const code = generateResolutionCode();
  assert.match(code, /^LPU-[2-9A-HJ-NP-Z]{6}$/);
});

test('validateResolutionCode handles cases, whitespace, and LPU prefix accurately', () => {
  const actual = 'LPU-9K2AB7';
  
  // Exact match
  assert.equal(validateResolutionCode('LPU-9K2AB7', actual), true);
  // Lowercase match
  assert.equal(validateResolutionCode('lpu-9k2ab7', actual), true);
  // Without prefix
  assert.equal(validateResolutionCode('9K2AB7', actual), true);
  // With extra whitespace
  assert.equal(validateResolutionCode('  9k2ab7  ', actual), true);
  // Wrong code
  assert.equal(validateResolutionCode('LPU-111111', actual), false);
  // Empty or invalid input
  assert.equal(validateResolutionCode('', actual), false);
  assert.equal(validateResolutionCode('LPU', actual), false);
});

test('normalizeCode removes whitespace and optional prefix', () => {
  assert.equal(normalizeCode('  LPU-ABC123  '), 'ABC123');
  assert.equal(normalizeCode('xyz999'), 'XYZ999');
});

test('calculateMatchScore correctly rewards category, location, and keyword matches for opposite types', () => {
  const lostWatch: Report = {
    id: 'lost-1',
    type: 'lost',
    title: 'Titan Fastrack Black Watch with metal strap',
    category: 'Jewelry & Watches',
    location: 'Central Library',
    dateTime: 'Yesterday 4 PM',
    description: 'Black dial with silver metal strap lost on 2nd floor reading hall',
    reporterName: 'Aman Sharma',
    reporterContact: 'aman@lpu.in',
    secretCode: 'LPU-TEST01',
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  const foundWatch: Report = {
    id: 'found-1',
    type: 'found',
    title: 'Black Fastrack Watch found near reading desk',
    category: 'Jewelry & Watches',
    location: 'Central Library',
    dateTime: 'Yesterday 6 PM',
    description: 'Silver metal strap titan watch found on table in library',
    reporterName: 'Security Guard',
    reporterContact: '9876543210',
    secretCode: 'LPU-TEST02',
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  const foundUmbrella: Report = {
    id: 'found-2',
    type: 'found',
    title: 'Blue Umbrella',
    category: 'Clothing & Accessories',
    location: 'Uni-Mall (Shopping & Food)',
    dateTime: 'Today 1 PM',
    description: 'Small foldable umbrella',
    reporterName: 'Priya',
    reporterContact: 'priya@lpu.in',
    secretCode: 'LPU-TEST03',
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  const matchHigh = calculateMatchScore(lostWatch, foundWatch);
  assert.ok(matchHigh.score >= 65, `Expected score >= 65, got ${matchHigh.score}`);
  assert.ok(matchHigh.reasons.some(r => r.includes('Same category')));
  assert.ok(matchHigh.reasons.some(r => r.includes('Same location')));

  const matchLow = calculateMatchScore(lostWatch, foundUmbrella);
  assert.equal(matchLow.score, 0);

  // Same type should never match
  const matchSameType = calculateMatchScore(lostWatch, { ...foundWatch, type: 'lost' });
  assert.equal(matchSameType.score, 0);
});

test('filterReports correctly filters by type, status, category, location and keyword query', () => {
  const reports: Report[] = [
    {
      id: 'r1',
      type: 'lost',
      title: 'HP Pavilion Laptop Charger',
      category: 'Electronics & Gadgets',
      location: 'Block 34 (Engineering & Tech)',
      dateTime: 'Nov 3',
      description: 'Blue pin 65W charger',
      reporterName: 'Rohit',
      reporterContact: 'rohit@lpu.in',
      secretCode: 'LPU-111111',
      status: 'open',
      createdAt: '2026-11-03T10:00:00Z',
    },
    {
      id: 'r2',
      type: 'found',
      title: 'Student ID Card - CSE Reg 12104523',
      category: 'ID Cards & Documents',
      location: 'Uni-Mall (Shopping & Food)',
      dateTime: 'Nov 4',
      description: 'Found near food court',
      reporterName: 'Kavita',
      reporterContact: 'kavita@lpu.in',
      secretCode: 'LPU-222222',
      status: 'open',
      createdAt: '2026-11-04T12:00:00Z',
    },
    {
      id: 'r3',
      type: 'lost',
      title: 'Hostel Room Key 304 BH-4',
      category: 'Keys (Hostel / Vehicle)',
      location: 'Boys Hostels (BH 1 - BH 9)',
      dateTime: 'Nov 2',
      description: 'Keychain with iron man tag',
      reporterName: 'Vikram',
      reporterContact: 'vikram@lpu.in',
      secretCode: 'LPU-333333',
      status: 'resolved',
      createdAt: '2026-11-02T08:00:00Z',
    },
  ];

  // Filter only 'lost'
  const lostOnly = filterReports(reports, {
    searchQuery: '',
    type: 'lost',
    status: 'all',
    category: 'All Categories',
    location: 'All Locations',
  });
  assert.equal(lostOnly.length, 2);

  // Filter only 'open'
  const openOnly = filterReports(reports, {
    searchQuery: '',
    type: 'all',
    status: 'open',
    category: 'All Categories',
    location: 'All Locations',
  });
  assert.equal(openOnly.length, 2);

  // Search keyword "Charger"
  const chargerSearch = filterReports(reports, {
    searchQuery: 'Charger',
    type: 'all',
    status: 'all',
    category: 'All Categories',
    location: 'All Locations',
  });
  assert.equal(chargerSearch.length, 1);
  assert.equal(chargerSearch[0].id, 'r1');
});
