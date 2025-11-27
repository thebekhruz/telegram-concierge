// ==========================================
// PRICE CALCULATOR SERVICE
// Calculates tuition fees with all applicable discounts
// ==========================================

import { CalculationInput, CalculationResult, Campus, PaymentPeriod } from '../types';
import { PRICES } from '../data/prices';

export class PriceCalculator {
  // ==========================================
  // MAIN CALCULATION METHOD
  // Calculates tuition fees based on:
  // - Campus (MU or YASH)
  // - Program type (IB, RUS, KG_RUS, KG_BI)
  // - Class level
  // - Number of children (for sibling discounts at MU)
  // - Academic year (special discounts for 2025-2026 at YASH)
  // - Payment period (monthly, quarterly, annually)
  // ==========================================
  calculate(input: CalculationInput): CalculationResult {
    const { campus, programType, classLevel, numberOfChildren, year } = input;

    // ==========================================
    // STEP 1: Validate and retrieve pricing data
    // ==========================================

    // Get the campus price data
    const campusData = PRICES[campus];
    if (!campusData) {
      throw new Error(`Invalid campus: ${campus}`);
    }

    // Get the program price data
    const programData = campusData[programType];
    if (!programData) {
      throw new Error(`Invalid program type: ${programType}`);
    }

    // Get the class level price
    const priceEntry = programData[classLevel];
    if (!priceEntry) {
      throw new Error(`Invalid class level: ${classLevel}`);
    }

    // ==========================================
    // STEP 2: Determine base price and apply year discounts
    // ==========================================

    // Determine base period and price
    const basePeriod = priceEntry.period;
    let basePrice = priceEntry.base;

    // Apply year discount if applicable (Yashnobod 2025-26)
    const discountsApplied: string[] = [];
    if (year === '2025-2026' && priceEntry.year_2025_26) {
      basePrice = priceEntry.year_2025_26;
      const discountPercent = Math.round(
        ((priceEntry.base - priceEntry.year_2025_26) / priceEntry.base) * 100
      );
      discountsApplied.push(`${year} year discount: ${discountPercent}%`);
    }

    // ==========================================
    // STEP 3: Calculate per-child breakdown with sibling discounts
    // MU Campus offers sibling discounts:
    // - 1st child: 100% (no discount)
    // - 2nd child: 95% (5% discount)
    // - 3rd+ child: 90% (10% discount)
    // ==========================================

    const breakdown: CalculationResult['breakdown'] = [];
    let totalPrice = 0;

    for (let childNum = 1; childNum <= numberOfChildren; childNum++) {
      let childPrice = basePrice;
      let discount = 0;

      // Apply sibling discount if available (MU campus only)
      if (campus === 'MU' && campusData.sibling_discount) {
        const siblingFactor = campusData.sibling_discount[childNum] || campusData.sibling_discount[3];
        childPrice = basePrice * siblingFactor;
        discount = Math.round(((basePrice - childPrice) / basePrice) * 100);

        if (childNum > 1 && discount > 0) {
          const siblingDiscountMsg = `Child #${childNum}: ${discount}% sibling discount`;
          if (!discountsApplied.includes(siblingDiscountMsg)) {
            discountsApplied.push(siblingDiscountMsg);
          }
        }
      }

      breakdown.push({
        childNumber: childNum,
        basePrice: basePrice,
        discountedPrice: Math.round(childPrice),
        discount: discount,
      });

      totalPrice += childPrice;
    }

    totalPrice = Math.round(totalPrice);

    // ==========================================
    // STEP 4: Calculate entry fee (Yashnobod campus only)
    // ==========================================

    let entryFee: number | undefined;
    if (campus === 'YASH' && campusData.entry_fee) {
      entryFee = campusData.entry_fee.base;

      // Apply year discount to entry fee
      if (year === '2025-2026' && campusData.entry_fee.year_2025_26_factor) {
        entryFee = Math.round(entryFee * campusData.entry_fee.year_2025_26_factor);
        const entryDiscountPercent = Math.round((1 - campusData.entry_fee.year_2025_26_factor) * 100);
        discountsApplied.push(`Entry fee: ${entryDiscountPercent}% discount for ${year}`);
      }
    }

    // ==========================================
    // STEP 5: Apply annual payment discount (5%)
    // ==========================================

    let annualSavings: number | undefined;
    const requestedPeriod = input.paymentPeriod || basePeriod;

    if (requestedPeriod === 'year') {
      // 5% discount for annual payment at both campuses
      annualSavings = Math.round(totalPrice * 0.05);
      totalPrice = totalPrice - annualSavings;
      discountsApplied.push('Annual payment discount: 5%');
    }

    // ==========================================
    // STEP 6: Convert prices to requested payment period
    // ==========================================

    // Convert price to requested period if different from base
    const { convertedTotal, period } = this.convertPeriod(
      totalPrice,
      basePeriod,
      requestedPeriod
    );

    // Return the complete calculation result
    return {
      perChildPrice: Math.round(convertedTotal / numberOfChildren),
      totalPrice: convertedTotal,
      entryFee,
      discountsApplied,
      period,
      breakdown: breakdown.map((item) => ({
        ...item,
        discountedPrice: Math.round(
          this.convertPeriod(item.discountedPrice, basePeriod, requestedPeriod).convertedTotal
        ),
        basePrice: Math.round(
          this.convertPeriod(item.basePrice, basePeriod, requestedPeriod).convertedTotal
        ),
      })),
      annualSavings,
    };
  }

  // ==========================================
  // PERIOD CONVERSION METHOD
  // Converts prices between monthly, quarterly, and annual periods
  // ==========================================
  private convertPeriod(
    price: number,
    fromPeriod: PaymentPeriod,
    toPeriod: PaymentPeriod
  ): { convertedTotal: number; period: PaymentPeriod } {
    // If same period, no conversion needed
    if (fromPeriod === toPeriod) {
      return { convertedTotal: Math.round(price), period: toPeriod };
    }

    // Step 1: Convert to monthly basis first
    let monthlyPrice = price;
    if (fromPeriod === 'quarter') {
      monthlyPrice = price / 3;  // Quarterly → Monthly
    } else if (fromPeriod === 'year') {
      monthlyPrice = price / 12; // Annual → Monthly
    }

    // Step 2: Convert from monthly to target period
    let convertedPrice = monthlyPrice;
    if (toPeriod === 'quarter') {
      convertedPrice = monthlyPrice * 3;  // Monthly → Quarterly
    } else if (toPeriod === 'year') {
      convertedPrice = monthlyPrice * 12; // Monthly → Annual
    }

    return { convertedTotal: Math.round(convertedPrice), period: toPeriod };
  }

  // ==========================================
  // PRICE FORMATTING METHOD
  // Formats numbers with spaces as thousand separators
  // Example: 1000000 → "1 000 000"
  // ==========================================
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  // ==========================================
  // UTILITY: Get available class levels for a program
  // ==========================================
  getAvailableClasses(campus: Campus, programType: string): string[] {
    const campusData = PRICES[campus];
    if (!campusData) return [];

    const programData = campusData[programType];
    if (!programData) return [];

    return Object.keys(programData).filter((key) => key !== 'sibling_discount' && key !== 'entry_fee');
  }
}

export const priceCalculator = new PriceCalculator();
