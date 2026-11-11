/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  stepTowardsTarget,
  calculateKeyboardMovement,
  getNearestHotspot,
  resolveCollisions,
  isPositionColliding,
  SCENE_CONFIGS,
} from './movement3D';

test('all 5 scenes have valid 3D configurations, spawn positions, and colliders', () => {
  const sceneIds = ['courtyard', 'grand_hall', 'cold_spring', 'bell_tower', 'zen_room'];
  sceneIds.forEach(id => {
    const config = SCENE_CONFIGS[id];
    assert.ok(config, `Missing config for scene ${id}`);
    assert.ok(config.name.length > 0);
    assert.ok(config.bounds.minX < config.bounds.maxX);
    assert.ok(config.bounds.minZ < config.bounds.maxZ);
    assert.ok(config.spawnPos.x >= config.bounds.minX && config.spawnPos.x <= config.bounds.maxX);
    assert.ok(config.spawnPos.z >= config.bounds.minZ && config.spawnPos.z <= config.bounds.maxZ);
    assert.ok(config.hotspots.length > 0);
    assert.ok(config.colliders.length > 0, `Scene ${id} must have colliders to prevent clipping`);
    assert.ok(config.playerRadius > 0.2);
  });
});

test('spawn points in all 5 scenes do not intersect any colliders', () => {
  const sceneIds = ['courtyard', 'grand_hall', 'cold_spring', 'bell_tower', 'zen_room'];
  sceneIds.forEach(id => {
    const cfg = SCENE_CONFIGS[id];
    const isColliding = isPositionColliding(cfg.spawnPos, cfg.colliders, cfg.playerRadius, cfg.bounds);
    assert.equal(isColliding, false, `Spawn position for ${id} must not intersect obstacles`);
  });
});

test('resolveCollisions pushes player outside circular obstacles (e.g. camphor tree, bell)', () => {
  const cfg = SCENE_CONFIGS.courtyard;
  // West camphor tree is at (-16, -4, radius: 2.2). Attempt to place player at (-16, -4)
  const insideTree = { x: -16, y: 0, z: -4 };
  const resolved = resolveCollisions(insideTree, cfg.colliders, cfg.playerRadius, cfg.bounds);

  const distToTree = Math.hypot(resolved.x - (-16), resolved.z - (-4));
  assert.ok(
    distToTree >= 2.2 + cfg.playerRadius - 0.01,
    `Player must be pushed outside tree radius. Dist was ${distToTree}`
  );
});

test('resolveCollisions pushes player outside box obstacles (e.g. incense burner, altar table)', () => {
  const cfg = SCENE_CONFIGS.courtyard;
  // Incense burner box: minX: -2.5, maxX: 2.5, minZ: 2.2, maxZ: 5.8
  const insideBurner = { x: 0, y: 0, z: 4 };
  const resolved = resolveCollisions(insideBurner, cfg.colliders, cfg.playerRadius, cfg.bounds);

  const stillInside =
    resolved.x > -2.5 + cfg.playerRadius &&
    resolved.x < 2.5 - cfg.playerRadius &&
    resolved.z > 2.2 + cfg.playerRadius &&
    resolved.z < 5.8 - cfg.playerRadius;

  assert.equal(stillInside, false, 'Player must be pushed outside the incense burner');
});

test('stepTowardsTarget does not penetrate obstacles when walking towards an obstacle', () => {
  const cfg = SCENE_CONFIGS.courtyard;
  const current = { x: 0, y: 0, z: 12 };
  // Target is deep inside the incense burner at (0, 4)
  const targetInsideObstacle = { x: 0, y: 0, z: 4 };

  let pos = { ...current };
  for (let i = 0; i < 20; i++) {
    const step = stepTowardsTarget(
      pos,
      targetInsideObstacle,
      8,
      0.1,
      cfg.bounds,
      cfg.colliders,
      cfg.playerRadius
    );
    pos = step.position;
  }

  // Final position must be outside the incense burner
  const inBurner =
    pos.x > -2.5 - cfg.playerRadius &&
    pos.x < 2.5 + cfg.playerRadius &&
    pos.z > 2.2 - cfg.playerRadius &&
    pos.z < 5.8 + cfg.playerRadius;

  assert.equal(inBurner, false, `Player should not penetrate incense burner. Current Z was ${pos.z}`);
});

test('calculateKeyboardMovement slides smoothly along wall instead of penetrating', () => {
  const cfg = SCENE_CONFIGS.zen_room;
  // Place near the tea table at (minX: 3.6)
  const nearTable = { x: 3.5 - cfg.playerRadius, y: 0, z: 1.0 };

  // Walk directly into the table towards +X (keys.right = true)
  const result = calculateKeyboardMovement(
    { forward: false, backward: false, left: false, right: true },
    0, // camera facing north
    6,
    0.1,
    cfg.bounds,
    nearTable,
    cfg.colliders,
    cfg.playerRadius
  );

  assert.ok(
    result.nextPos.x <= 3.6 - cfg.playerRadius + 0.01,
    `Player must not penetrate into tea table. X was ${result.nextPos.x}`
  );
});

test('getNearestHotspot identifies proximity across different scenes', () => {
  // Grand Hall Buddha Altar at (0, 0, -3)
  const altarHotspot = getNearestHotspot({ x: 0.2, y: 0, z: -2.8 }, SCENE_CONFIGS.grand_hall.hotspots);
  assert.ok(altarHotspot !== null);
  assert.equal(altarHotspot?.id, 'buddha_altar');

  // Bell Tower Bell at (0, 0, -1)
  const bellHotspot = getNearestHotspot({ x: 0.5, y: 0, z: -1.2 }, SCENE_CONFIGS.bell_tower.hotspots);
  assert.ok(bellHotspot !== null);
  assert.equal(bellHotspot?.id, 'bell_tower');
});
