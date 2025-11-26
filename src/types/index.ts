export type Language = 'uz' | 'ru' | 'en' | 'tr';

export type Campus = 'MU' | 'YASH';

export type ProgramType = 'IB' | 'RUS' | 'KG_RUS' | 'KG_BI';

export type PaymentPeriod = 'month' | 'quarter' | 'year';

export interface PriceEntry {
  period: PaymentPeriod;
  base: number;
  year_2025_26?: number;
}

export interface PriceData {
  [campus: string]: {
    [programType: string]: {
      [classLevel: string]: PriceEntry;
    };
    sibling_discount?: {
      [childNumber: number]: number;
    };
    entry_fee?: {
      base: number;
      year_2025_26_factor?: number;
    };
  };
}

export interface CalculationInput {
  campus: Campus;
  programType: ProgramType;
  classLevel: string;
  numberOfChildren: number;
  year: string;
  paymentPeriod?: PaymentPeriod;
}

export interface CalculationResult {
  perChildPrice: number;
  totalPrice: number;
  entryFee?: number;
  discountsApplied: string[];
  period: PaymentPeriod;
  breakdown: {
    childNumber: number;
    basePrice: number;
    discountedPrice: number;
    discount: number;
  }[];
  annualSavings?: number;
}

export interface UserSession {
  userId: number;
  language?: Language;
  campus?: Campus;
  programType?: ProgramType;
  classLevel?: string;
  numberOfChildren?: number;
  year?: string;
  step?: string;
}

export interface ConversationLog {
  id: number;
  userId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  language: Language;
  messageText: string;
  botResponse?: string;
  timestamp: Date;
}

export interface Lead {
  id: number;
  userId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  campus?: Campus;
  programType?: ProgramType;
  classLevel?: string;
  numberOfChildren?: number;
  calculationResult?: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  createdAt: Date;
  updatedAt: Date;
}
