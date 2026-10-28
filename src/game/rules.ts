/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BusSkin {
  id: string;
  name: string;
  subtitle: string;
  primaryColor: string;
  secondaryColor: string;
  roofColor: string;
  stripeColor: string;
  price: number;
  maxSpeed: number; // in km/h
  acceleration: number;
  handling: number;
  hornType: 'classic' | 'musical' | 'staccato';
  routeText: string;
}

export const BUS_SKINS: BusSkin[] = [
  {
    id: 'sobuj_sathi',
    name: 'সবুজ সাথী',
    subtitle: 'ঢাকার ক্লাসিক লোকাল বাস',
    primaryColor: '#15803d',
    secondaryColor: '#facc15',
    roofColor: '#166534',
    stripeColor: '#dc2626',
    price: 0,
    maxSpeed: 85,
    acceleration: 28,
    handling: 1.0,
    hornType: 'classic',
    routeText: 'মিরপুর ১০ ➔ ফার্মগেট ➔ গুলিস্তান',
  },
  {
    id: 'lal_neel',
    name: 'লাল-নীল বুলেট',
    subtitle: 'গতি আর সাহসের প্রতীক',
    primaryColor: '#dc2626',
    secondaryColor: '#2563eb',
    roofColor: '#991b1b',
    stripeColor: '#fbbf24',
    price: 350,
    maxSpeed: 95,
    acceleration: 33,
    handling: 1.1,
    hornType: 'staccato',
    routeText: 'উত্তরা ➔ মহাখালী ➔ মতিঝিল',
  },
  {
    id: 'vip_local',
    name: 'ভিআইপি লোকাল',
    subtitle: 'ভাঙা সিটে রাজকীয় ভ্রমণ',
    primaryColor: '#0284c7',
    secondaryColor: '#f8fafc',
    roofColor: '#0369a1',
    stripeColor: '#f59e0b',
    price: 800,
    maxSpeed: 90,
    acceleration: 30,
    handling: 1.25,
    hornType: 'musical',
    routeText: 'গাবতলী ➔ শাহবাগ ➔ সায়েদাবাদ',
  },
  {
    id: 'jam_destroyer',
    name: 'জ্যাম খাদক',
    subtitle: 'ট্রাফিকের বুক চিরে এগিয়ে চলা দৈত্য',
    primaryColor: '#e11d48',
    secondaryColor: '#0f172a',
    roofColor: '#be123c',
    stripeColor: '#eab308',
    price: 1500,
    maxSpeed: 100,
    acceleration: 36,
    handling: 1.15,
    hornType: 'musical',
    routeText: 'মোহাম্মদপুর ➔ বাংলামটর ➔ যাত্রাবাড়ী',
  },
  {
    id: 'midnight_dhaka',
    name: 'নাইট রাইডার ঢাকা',
    subtitle: 'রাত ৩টার ফাঁকা ভিআইপি রোডের রাজা',
    primaryColor: '#1e1b4b',
    secondaryColor: '#06b6d4',
    roofColor: '#0f172a',
    stripeColor: '#a855f7',
    price: 2500,
    maxSpeed: 110,
    acceleration: 40,
    handling: 1.3,
    hornType: 'staccato',
    routeText: 'এয়ারপোর্ট ➔ গুলশান ২ ➔ কমলাপুর',
  },
  {
    id: 'golden_boss',
    name: 'সোনার বাংলা বস',
    subtitle: 'ঢাকার রাজপথের আসল মহারাজ',
    primaryColor: '#eab308',
    secondaryColor: '#713f12',
    roofColor: '#ca8a04',
    stripeColor: '#ffffff',
    price: 4500,
    maxSpeed: 115,
    acceleration: 42,
    handling: 1.35,
    hornType: 'musical',
    routeText: 'সমগ্র ঢাকা মেট্রোপলিটন ➔ রাজপথের বস',
  },
];

/**
 * Calculates updated speed based on acceleration, braking, friction, and max speed limit.
 */
export function calculateSpeed(
  currentSpeed: number,
  isGas: boolean,
  isBrake: boolean,
  isHandbrake: boolean,
  accelPower: number,
  maxSpeed: number,
  dt: number
): number {
  let speed = currentSpeed;

  if (isHandbrake) {
    speed -= 55 * dt;
    return Math.max(0, speed);
  }

  if (isGas) {
    speed += accelPower * dt;
  } else if (isBrake) {
    speed -= (accelPower * 1.8 + 25) * dt;
  } else {
    // Natural friction rolling resistance
    speed -= 14 * dt;
  }

  return Math.max(0, Math.min(maxSpeed, speed));
}

/**
 * Calculates collision damage given impact velocity and angle factor.
 */
export function calculateDamage(
  currentDamage: number,
  speedKmH: number,
  isDirectHeadOn: boolean = false
): number {
  if (speedKmH < 10) return currentDamage; // minor scratch / bump ignore

  const baseRatio = (speedKmH / 100);
  const increment = (baseRatio * 22) * (isDirectHeadOn ? 1.6 : 0.8);
  const roundedInc = Math.round(increment * 10) / 10;
  return Math.min(100, Math.round((currentDamage + roundedInc) * 10) / 10);
}

/**
 * Calculates fare earned when picking up passengers.
 */
export function calculateFare(passengerCount: number, currentCombo: number = 1): { cashEarned: number; bonusPoints: number } {
  const baseRate = 20; // 20 Taka per passenger
  const comboMultiplier = 1 + (Math.min(5, currentCombo) - 1) * 0.25;
  const cashEarned = Math.round(passengerCount * baseRate * comboMultiplier);
  const bonusPoints = passengerCount * 100 * currentCombo;
  return { cashEarned, bonusPoints };
}

/**
 * Determines if a near-miss overtake occurred between the bus and an obstacle.
 */
export function checkNearMiss(
  busX: number,
  busZ: number,
  busWidth: number,
  busLength: number,
  obsX: number,
  obsZ: number,
  obsWidth: number,
  obsLength: number,
  relativeSpeed: number
): boolean {
  if (relativeSpeed < 20) return false; // Must be overtaking with notable speed

  const dx = Math.abs(busX - obsX);
  const dz = Math.abs(busZ - obsZ);

  const contactThresholdX = (busWidth + obsWidth) * 0.5;
  const contactThresholdZ = (busLength + obsLength) * 0.5;

  // Near miss if within close lateral gap, overlapping in Z
  const isLateralClose = dx > contactThresholdX && dx < contactThresholdX + 1.1;
  const isPassingZ = dz < contactThresholdZ * 0.8;

  return isLateralClose && isPassingZ;
}

/**
 * Check if player can unlock a bus skin with their accumulated cash.
 */
export function canUnlockSkin(skinId: string, currentCash: number, unlockedIds: string[]): boolean {
  if (unlockedIds.includes(skinId)) return false;
  const skin = BUS_SKINS.find(s => s.id === skinId);
  if (!skin) return false;
  return currentCash >= skin.price;
}

/**
 * Formats numbers in Bengali Taka representation.
 */
export function formatTaka(amount: number): string {
  return `৳${Math.floor(amount).toLocaleString('en-US')}`;
}

/**
 * Formats speed in km/h with Bengali unit.
 */
export function formatSpeed(speedKmH: number): string {
  return `${Math.round(speedKmH)} কিমি/ঘণ্টা`;
}

/**
 * Formats distance in meters or kilometers.
 */
export function formatDistance(distanceMeters: number): string {
  if (distanceMeters < 1000) {
    return `${Math.floor(distanceMeters)} মি.`;
  }
  return `${(distanceMeters / 1000).toFixed(1)} কিমি`;
}
