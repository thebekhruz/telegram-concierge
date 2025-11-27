import { PriceData, Campus, ProgramType } from '../types';

// Type assertion is used here because TypeScript has difficulty with
// index signatures mixed with explicit properties (sibling_discount, entry_fee)
export const PRICES = {
  MU: {
    IB: {
      KG: { period: 'quarter', base: 28875000 },
      PYP1: { period: 'quarter', base: 43257500 },
      PYP2: { period: 'quarter', base: 43257500 },
      PYP3: { period: 'quarter', base: 47850000 },
      PYP4: { period: 'quarter', base: 47850000 },
      PYP5: { period: 'quarter', base: 47850000 },
      MYP1: { period: 'quarter', base: 53075000 },
      MYP2: { period: 'quarter', base: 53075000 },
      MYP3: { period: 'quarter', base: 53075000 },
      MYP4: { period: 'quarter', base: 56970000 },
      MYP5: { period: 'quarter', base: 56970000 },
      DP1: { period: 'quarter', base: 61710000 },
      DP2: { period: 'quarter', base: 61710000 },
    },
    RUS: {
      '1-4': { period: 'month', base: 9460000 },
      '5-8': { period: 'month', base: 10340000 },
      '9-11': { period: 'month', base: 11220000 },
    },
    KG_RUS: {
      KG: { period: 'month', base: 6600000 },
    },
    sibling_discount: {
      1: 1.0, // 100% - first child
      2: 0.95, // 95% - second child
      3: 0.9, // 90% - third child and beyond
    },
  },
  YASH: {
    IB: {
      KG: {
        period: 'quarter',
        base: 40000000,
        year_2025_26: 32000000, // 20% discount
      },
      PYP1: {
        period: 'quarter',
        base: 47500000,
        year_2025_26: 40375000, // 15% discount
      },
      PYP2: {
        period: 'quarter',
        base: 47500000,
        year_2025_26: 40375000,
      },
      PYP3: {
        period: 'quarter',
        base: 52500000,
        year_2025_26: 44625000, // 15% discount
      },
      PYP4: {
        period: 'quarter',
        base: 52500000,
        year_2025_26: 44625000,
      },
      PYP5: {
        period: 'quarter',
        base: 52500000,
        year_2025_26: 44625000,
      },
      MYP1: {
        period: 'quarter',
        base: 60000000,
        year_2025_26: 51000000, // 15% discount
      },
      MYP2: {
        period: 'quarter',
        base: 60000000,
        year_2025_26: 51000000,
      },
      MYP3: {
        period: 'quarter',
        base: 60000000,
        year_2025_26: 51000000,
      },
      MYP4: {
        period: 'quarter',
        base: 65000000,
        year_2025_26: 55250000, // 15% discount
      },
      MYP5: {
        period: 'quarter',
        base: 65000000,
        year_2025_26: 55250000,
      },
    },
    RUS: {
      '1-4': {
        period: 'month',
        base: 10400000,
        year_2025_26: 8840000, // 15% discount
      },
      '5-8': {
        period: 'month',
        base: 11000000,
        year_2025_26: 9350000, // 15% discount
      },
      '9-11': {
        period: 'month',
        base: 12000000,
        year_2025_26: 10200000, // 15% discount
      },
    },
    KG_BI: {
      KG: {
        period: 'month',
        base: 9200000,
        year_2025_26: 7360000, // 20% discount
      },
    },
    entry_fee: {
      base: 24000000,
      year_2025_26_factor: 0.7, // 30% discount => pay 70%
    },
  },
} as unknown as PriceData;

// Helper function to get class level options based on program type
export function getClassLevelOptions(campus: Campus, programType: ProgramType): string[] {
  const campusData = PRICES[campus];
  if (!campusData || !campusData[programType]) {
    return [];
  }
  return Object.keys(campusData[programType] as any);
}

// Helper to map grade number to class level key
export function getClassLevelKey(programType: ProgramType, grade: number): string | null {
  if (programType === 'RUS') {
    if (grade >= 1 && grade <= 4) return '1-4';
    if (grade >= 5 && grade <= 8) return '5-8';
    if (grade >= 9 && grade <= 11) return '9-11';
  }
  return null;
}
