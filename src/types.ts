export type ReportType = 'lost' | 'found';
export type ReportStatus = 'open' | 'resolved';

export interface Report {
  id: string;
  type: ReportType;
  title: string;
  category: string;
  location: string;
  dateTime: string;
  description: string;
  reporterName: string;
  reporterContact: string;
  secretCode: string;
  status: ReportStatus;
  resolvedAt?: string;
  resolvedByNote?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface MatchResult {
  report: Report;
  score: number;
  reasons: string[];
}

export interface FilterState {
  searchQuery: string;
  type: 'all' | 'lost' | 'found';
  status: 'all' | 'open' | 'resolved';
  category: string;
  location: string;
}

export const LPU_LOCATIONS = [
  'All Locations',
  'Block 13 (Student Centre)',
  'Block 14 (Administration)',
  'Block 25 (Polytechnic)',
  'Block 28 (CSE Labs)',
  'Block 29 (Design & Fashion)',
  'Block 30 (Pharmacy & Bio)',
  'Block 32 (Law & Arts)',
  'Block 33 (Computer Applications)',
  'Block 34 (Engineering & Tech)',
  'Block 35 (Agriculture)',
  'Block 36 (Hotel Management)',
  'Block 37 (Applied Sciences)',
  'Block 38 (Physical Education)',
  'Uni-Mall (Shopping & Food)',
  'Central Library',
  'Baldev Raj Mittal Unipolis',
  'Shanti Devi Mittal Auditorium',
  'RoboPark & Innovation Hub',
  'Boys Hostels (BH 1 - BH 9)',
  'Girls Hostels (GH 1 - GH 6)',
  'Main Sports Stadium & Ground',
  'Food Kiosks / Cafeteria',
  'Main Gate 1 & 2',
  'Uni-Hospital / Medical Centre',
  'Other LPU Campus Spot',
];

export const ITEM_CATEGORIES = [
  'All Categories',
  'Electronics & Gadgets',
  'ID Cards & Documents',
  'Wallets, Purses & Cash',
  'Keys (Hostel / Vehicle)',
  'Backpacks, Bags & Pouches',
  'Books, Notes & Stationery',
  'Clothing & Accessories',
  'Water Bottles & Fitness',
  'Jewelry & Watches',
  'Other Items',
];
