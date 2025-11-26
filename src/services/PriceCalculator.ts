import { CalculationInput, CalculationResult, Campus, PaymentPeriod } from '../types';
import { PRICES } from '../data/prices';

export class PriceCalculator {
  /**
   * Calculate tuition fees based on user inputs
   */
  calculate(input: CalculationInput): CalculationResult {
    const { campus, programType, classLevel, numberOfChildren, year } = input;

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

    // Calculate per-child breakdown with sibling discounts (MU only)
    const breakdown: CalculationResult['breakdown'] = [];
    let totalPrice = 0;

    for (let childNum = 1; childNum <= numberOfChildren; childNum++) {
      let childPrice = basePrice;
      let discount = 0;

      // Apply sibling discount if available (MU campus)
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

    // Calculate entry fee (Yashnobod only for IB programs)
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

    // Calculate annual savings if paid yearly
    let annualSavings: number | undefined;
    const requestedPeriod = input.paymentPeriod || basePeriod;

    if (requestedPeriod === 'year') {
      // Assume 5% discount for annual payment
      annualSavings = Math.round(totalPrice * 0.05);
      totalPrice = totalPrice - annualSavings;
      discountsApplied.push('Annual payment discount: 5%');
    }

    // Convert price to requested period if different from base
    const { convertedTotal, period } = this.convertPeriod(
      totalPrice,
      basePeriod,
      requestedPeriod
    );

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

  /**
   * Convert price from one period to another
   */
  private convertPeriod(
    price: number,
    fromPeriod: PaymentPeriod,
    toPeriod: PaymentPeriod
  ): { convertedTotal: number; period: PaymentPeriod } {
    if (fromPeriod === toPeriod) {
      return { convertedTotal: Math.round(price), period: toPeriod };
    }

    // Convert to monthly basis first
    let monthlyPrice = price;
    if (fromPeriod === 'quarter') {
      monthlyPrice = price / 3;
    } else if (fromPeriod === 'year') {
      monthlyPrice = price / 12;
    }

    // Convert to target period
    let convertedPrice = monthlyPrice;
    if (toPeriod === 'quarter') {
      convertedPrice = monthlyPrice * 3;
    } else if (toPeriod === 'year') {
      convertedPrice = monthlyPrice * 12;
    }

    return { convertedTotal: Math.round(convertedPrice), period: toPeriod };
  }

  /**
   * Format price with thousand separators
   */
  formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  /**
   * Get available class levels for a program
   */
  getAvailableClasses(campus: Campus, programType: string): string[] {
    const campusData = PRICES[campus];
    if (!campusData) return [];

    const programData = campusData[programType];
    if (!programData) return [];

    return Object.keys(programData).filter((key) => key !== 'sibling_discount' && key !== 'entry_fee');
  }
}

export const priceCalculator = new PriceCalculator();
