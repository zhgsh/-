/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceBead, getBeadProgressPercent, isMilestoneBead, getQuoteForBead } from './prayerBeads';
import { createRandomMonk, generateOnlineCompanions } from './monkAvatars';
import { getMeritTitle, drawRandomFortune, ZEN_FORTUNES } from './templeLogic';

test('prayer beads advance correctly from 1 to 108', () => {
  const step1 = advanceBead(1, 0);
  assert.equal(step1.nextBead, 2);
  assert.equal(step1.nextLaps, 0);
  assert.equal(step1.isFullLap, false);

  const step108 = advanceBead(108, 0);
  assert.equal(step108.nextBead, 1);
  assert.equal(step108.nextLaps, 1);
  assert.equal(step108.isFullLap, true);
});

test('prayer beads progress calculation and milestones', () => {
  assert.equal(getBeadProgressPercent(1), 1);
  assert.equal(getBeadProgressPercent(54), 50);
  assert.equal(getBeadProgressPercent(108), 100);

  assert.equal(isMilestoneBead(18), true);
  assert.equal(isMilestoneBead(108), true);
  assert.equal(isMilestoneBead(15), false);

  const quote = getQuoteForBead(1);
  assert.ok(quote && quote.length > 0);
});

test('monk avatar creation assigns valid name and palette', () => {
  const monk = createRandomMonk('user-1', '清风');
  assert.equal(monk.id, 'user-1');
  assert.equal(monk.name, '清风');
  assert.ok(monk.robeColor.startsWith('#'));
  assert.ok(monk.x >= 0 && monk.x <= 100);
  assert.ok(monk.y >= 0 && monk.y <= 100);

  const companions = generateOnlineCompanions(5);
  assert.equal(companions.length, 5);
  companions.forEach(c => {
    assert.ok(c.name.length > 0);
    assert.ok(c.robeColor.startsWith('#'));
  });
});

test('merit rank title and fortunes logic', () => {
  assert.equal(getMeritTitle(0), '初入空门');
  assert.equal(getMeritTitle(25), '云林行者');
  assert.equal(getMeritTitle(80), '心水自澄');
  assert.equal(getMeritTitle(150), '万虑俱息');
  assert.equal(getMeritTitle(1200), '觉行圆满');

  const fortune = drawRandomFortune();
  assert.ok(fortune.title.length > 0);
  assert.ok(fortune.poem.length === 4);
  assert.ok(ZEN_FORTUNES.some(f => f.number === fortune.number));
});
