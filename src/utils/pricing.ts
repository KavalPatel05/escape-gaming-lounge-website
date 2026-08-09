import type { StationType, SimMode, BillBreakdown, RewardPoint } from '../types';

/**
 * Calculate pricing breakdown for a session or pre-booking
 */
export function calculateBill(params: {
  stationType: StationType;
  simMode?: SimMode;
  durationMinutes: number; // e.g., 30, 60, 120
  controllersCount: number; // 1 to 4
  extraPersonsCount: number; // 0, 1, 2...
  redeemPoints?: number; // 0, 10, 20
  bookingDate?: string; // YYYY-MM-DD
}): BillBreakdown {
  const {
    stationType,
    simMode = 'standard',
    durationMinutes,
    controllersCount,
    extraPersonsCount,
    redeemPoints = 0,
  } = params;

  let basePrice = 0;
  const hours = durationMinutes / 60;

  if (stationType === 'ps5') {
    // PS5 Pricing logic:
    // 1 & 2 controllers = ₹100 / 1 hr
    // 3 & 4 controllers = ₹170 / 1 hr
    const hourlyRate = controllersCount <= 2 ? 100 : 170;
    basePrice = Math.round(hourlyRate * hours);
  } else if (stationType === 'vr') {
    // VR Pricing:
    // 30 min = ₹150, 1 hr = ₹250
    if (durationMinutes <= 30) {
      basePrice = 150;
    } else {
      const fullHours = Math.floor(durationMinutes / 60);
      const remainingMin = durationMinutes % 60;
      basePrice = fullHours * 250 + (remainingMin > 0 ? 150 : 0);
    }
  } else if (stationType === 'simracing') {
    // SimRacing & Immersive Racing:
    // Standard SimRacing: 30 min = ₹150, 1 hr = ₹250
    // Immersive Racing: 30 min = ₹200, 1 hr = ₹300
    const isImmersive = simMode === 'immersive';
    if (durationMinutes <= 30) {
      basePrice = isImmersive ? 200 : 150;
    } else {
      const fullHours = Math.floor(durationMinutes / 60);
      const remainingMin = durationMinutes % 60;
      const hourlyRate = isImmersive ? 300 : 250;
      const halfRate = isImmersive ? 200 : 150;
      basePrice = fullHours * hourlyRate + (remainingMin > 0 ? halfRate : 0);
    }
  }

  // Extra Person Fee: ₹30 per extra person
  const extraPersonFee = extraPersonsCount * 30;
  const totalPrice = basePrice + extraPersonFee;

  // Reward points calculation: 1 point per 1 hr paid session
  const pointsEarned = Math.floor(hours);

  // Redemption logic: 10 points = ₹100 discount (or free 1-hr base for 2P)
  // 20 points = free 1-hr base for 4P
  let discountApplied = 0;
  if (redeemPoints >= 20) {
    discountApplied = Math.min(totalPrice, 170 + extraPersonFee);
  } else if (redeemPoints >= 10) {
    discountApplied = Math.min(totalPrice, 100);
  }

  const finalPayable = Math.max(0, totalPrice - discountApplied);
  const pointsRequiredForRedeem = controllersCount > 2 ? 20 : 10;

  return {
    basePrice,
    extraPersonFee,
    totalPrice,
    pointsEarned,
    discountApplied,
    finalPayable,
    pointsRequiredForRedeem,
  };
}

export function isWeekdayMonToFri(dateString: string): boolean {
  if (!dateString) return true;
  const date = new Date(dateString);
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

export function getActivePoints(points: RewardPoint[]): RewardPoint[] {
  const now = new Date();
  return points.filter((p) => {
    if (p.isRedeemed) return false;
    const exp = new Date(p.expiryDate);
    return exp > now;
  });
}

export function calculateActiveBalance(points: RewardPoint[]): number {
  return getActivePoints(points).reduce((sum, p) => sum + p.points, 0);
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
