/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSpeed,
  calculateDamage,
  calculateFare,
  checkNearMiss,
  canUnlockSkin,
  formatTaka,
  formatSpeed,
  formatDistance,
  BUS_SKINS
} from './rules.ts';

test('calculateSpeed accelerates when gas is active', () => {
  const initialSpeed = 20;
  const newSpeed = calculateSpeed(initialSpeed, true, false, false, 30, 90, 0.1);
  assert.ok(newSpeed > initialSpeed, 'Speed should increase with gas');
  assert.equal(Math.round(newSpeed), 23);
});

test('calculateSpeed clamps to maxSpeed', () => {
  const currentSpeed = 95;
  const newSpeed = calculateSpeed(currentSpeed, true, false, false, 30, 90, 1.0);
  assert.equal(newSpeed, 90, 'Speed must not exceed max speed');
});

test('calculateSpeed decelerates smoothly when braking or handbraking', () => {
  const currentSpeed = 60;
  const brakedSpeed = calculateSpeed(currentSpeed, false, true, false, 30, 90, 0.1);
  assert.ok(brakedSpeed < currentSpeed, 'Braking should decrease speed');

  const handbraked = calculateSpeed(currentSpeed, false, false, true, 30, 90, 0.1);
  assert.ok(handbraked < currentSpeed, 'Handbraking should decrease speed');
});

test('calculateDamage ignores minor crawls and penalizes high speed impacts', () => {
  const noDmg = calculateDamage(10, 5, false);
  assert.equal(noDmg, 10, 'Very low speed should cause 0 damage increment');

  const crashDmg = calculateDamage(0, 80, true);
  assert.ok(crashDmg > 15, 'Head on high-speed crash should cause significant damage');
  assert.ok(crashDmg <= 100, 'Damage must be capped at 100');
});

test('calculateFare scales with combo multiplier and returns cash and bonus', () => {
  const { cashEarned: singleCash, bonusPoints: singlePoints } = calculateFare(3, 1);
  assert.equal(singleCash, 60);
  assert.equal(singlePoints, 300);

  const { cashEarned: comboCash, bonusPoints: comboPoints } = calculateFare(3, 3);
  assert.ok(comboCash > singleCash, 'Combo should increase fare');
  assert.ok(comboPoints > singlePoints, 'Combo should increase points');
});

test('checkNearMiss detects narrow overtakes properly', () => {
  // Bus width 2.6, obs width 1.8. contactThresholdX = 2.2.
  // When lateral dx is 2.8 and relative speed is 40 -> Near miss!
  const isNear = checkNearMiss(0, 0, 2.6, 8.0, 2.8, 1.0, 1.8, 4.0, 40);
  assert.equal(isNear, true, 'Close lateral pass at speed should trigger near miss');

  // Too far away
  const tooFar = checkNearMiss(0, 0, 2.6, 8.0, 6.0, 1.0, 1.8, 4.0, 40);
  assert.equal(tooFar, false, 'Far away pass should not trigger near miss');

  // Too slow
  const tooSlow = checkNearMiss(0, 0, 2.6, 8.0, 2.8, 1.0, 1.8, 4.0, 10);
  assert.equal(tooSlow, false, 'Low speed pass should not trigger near miss');
});

test('canUnlockSkin correctly verifies affordability', () => {
  const freeSkinId = 'sobuj_sathi';
  assert.equal(canUnlockSkin(freeSkinId, 1000, ['sobuj_sathi']), false, 'Already unlocked cannot unlock again');

  const bulletSkinId = 'lal_neel';
  assert.equal(canUnlockSkin(bulletSkinId, 200, ['sobuj_sathi']), false, 'Cannot afford with 200');
  assert.equal(canUnlockSkin(bulletSkinId, 500, ['sobuj_sathi']), true, 'Can afford with 500');
});

test('formatting functions output clean Bengali labels', () => {
  assert.equal(formatTaka(150), '৳150');
  assert.equal(formatSpeed(75), '75 কিমি/ঘণ্টা');
  assert.equal(formatDistance(450), '450 মি.');
  assert.equal(formatDistance(2400), '2.4 কিমি');
});
