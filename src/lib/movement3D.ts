/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Hotspot3D {
  id: string;
  name: string;
  actionName: string;
  position: Vec3;
  radius: number;
}

export type Collider =
  | { type: 'circle'; x: number; z: number; radius: number; name?: string }
  | { type: 'box'; minX: number; maxX: number; minZ: number; maxZ: number; name?: string };

export interface Scene3DConfig {
  id: string;
  name: string;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  playerRadius: number;
  spawnPos: Vec3;
  spawnAngle: number;
  cameraSettings: { yaw: number; pitch: number; dist: number };
  hotspots: Hotspot3D[];
  colliders: Collider[];
}

export const SCENE_CONFIGS: Record<string, Scene3DConfig> = {
  courtyard: {
    id: "courtyard",
    name: "大殿庭前 · 香云缭绕",
    bounds: { minX: -34, maxX: 34, minZ: -5, maxZ: 34 },
    playerRadius: 0.55,
    spawnPos: { x: 0, y: 0, z: 12 },
    spawnAngle: 0,
    cameraSettings: { yaw: 0, pitch: 0.35, dist: 9.5 },
    hotspots: [
      {
        id: "incense_burner",
        name: "灵隐大香炉",
        actionName: "敬奉清香",
        position: { x: 0, y: 0, z: 4 },
        radius: 3.8,
      },
      {
        id: "camphor_tree",
        name: "千年古樟祈愿树",
        actionName: "系红丝带",
        position: { x: -16, y: 0, z: -4 },
        radius: 4.5,
      },
    ],
    colliders: [
      // 1. Grand Hall front facade wall (prevent clipping into the temple building)
      { type: 'box', minX: -36, maxX: 36, minZ: -14, maxZ: -5.2, name: 'grand_hall_wall' },
      // 2. Grand bronze incense burner base
      { type: 'box', minX: -2.5, maxX: 2.5, minZ: 2.2, maxZ: 5.8, name: 'incense_burner' },
      // 3. Ancient Camphor Trees (wish trees with thick trunks)
      { type: 'circle', x: -16, z: -4, radius: 2.2, name: 'tree_west' },
      { type: 'circle', x: 16, z: -4, radius: 2.0, name: 'tree_east' },
      { type: 'circle', x: -20, z: 20, radius: 2.0, name: 'tree_sw' },
      { type: 'circle', x: 22, z: 18, radius: 2.0, name: 'tree_se' },
      // 4. West and East corridor courtyard side walls
      { type: 'box', minX: -36, maxX: -33.2, minZ: -6, maxZ: 36, name: 'corridor_wall_west' },
      { type: 'box', minX: 33.2, maxX: 36, minZ: -6, maxZ: 36, name: 'corridor_wall_east' },
    ],
  },

  grand_hall: {
    id: "grand_hall",
    name: "大雄宝殿 · 瞻仰世尊",
    bounds: { minX: -13, maxX: 13, minZ: -12.5, maxZ: 13 },
    playerRadius: 0.55,
    spawnPos: { x: 0, y: 0, z: 8 },
    spawnAngle: 0,
    cameraSettings: { yaw: 0, pitch: 0.28, dist: 8.5 },
    hotspots: [
      {
        id: "buddha_altar",
        name: "大殿佛前蒲团",
        actionName: "顶礼三拜",
        position: { x: 0, y: 0, z: -3 },
        radius: 4.0,
      },
      {
        id: "prayer_beads_station",
        name: "佛前经座",
        actionName: "拨转百八念珠",
        position: { x: -4, y: 0, z: 2 },
        radius: 3.5,
      },
    ],
    colliders: [
      // 1. Gilded Buddha Lotus Throne & Base
      { type: 'circle', x: 0, z: -8, radius: 4.0, name: 'buddha_throne' },
      // 2. Altar Table & Offerings in front of Buddha
      { type: 'box', minX: -5.3, maxX: 5.3, minZ: -5.9, maxZ: -3.2, name: 'altar_table' },
      // 3. Attendant Statues (Ananda & Kasyapa)
      { type: 'circle', x: -4.5, z: -7.5, radius: 1.5, name: 'ananda_statue' },
      { type: 'circle', x: 4.5, z: -7.5, radius: 1.5, name: 'kasyapa_statue' },
      // 4. Four Great Wooden Pillars
      { type: 'circle', x: -8, z: -8, radius: 0.85, name: 'pillar_nw' },
      { type: 'circle', x: 8, z: -8, radius: 0.85, name: 'pillar_ne' },
      { type: 'circle', x: -8, z: 6, radius: 0.85, name: 'pillar_sw' },
      { type: 'circle', x: 8, z: 6, radius: 0.85, name: 'pillar_se' },
      // 5. Back and side hall walls
      { type: 'box', minX: -15, maxX: 15, minZ: -16, maxZ: -13.2, name: 'back_wall' },
      { type: 'box', minX: -16, maxX: -13.2, minZ: -14, maxZ: 14, name: 'left_wall' },
      { type: 'box', minX: 13.2, maxX: 16, minZ: -14, maxZ: 14, name: 'right_wall' },
    ],
  },

  cold_spring: {
    id: "cold_spring",
    name: "冷泉听溪 · 飞来听泉",
    bounds: { minX: -20, maxX: 22, minZ: -15, maxZ: 22 },
    playerRadius: 0.55,
    spawnPos: { x: 2, y: 0, z: 8 },
    spawnAngle: 0,
    cameraSettings: { yaw: 0.2, pitch: 0.32, dist: 9.0 },
    hotspots: [
      {
        id: "cold_spring_stream",
        name: "冷泉清溪畔",
        actionName: "放莲花灯",
        position: { x: -4, y: 0, z: -2 },
        radius: 4.2,
      },
      {
        id: "cold_spring_pavilion",
        name: "冷泉亭内",
        actionName: "歇息听水",
        position: { x: 10, y: 0, z: -4 },
        radius: 4.0,
      },
    ],
    colliders: [
      // 1. Feilai Peak Cliffs on the West (solid limestone rockface)
      { type: 'box', minX: -26, maxX: -13.5, minZ: -18, maxZ: 26, name: 'feilai_cliffs' },
      { type: 'circle', x: -16, z: -6, radius: 3.5, name: 'cliff_boulder_1' },
      { type: 'circle', x: -15, z: 4, radius: 3.2, name: 'cliff_boulder_2' },
      { type: 'circle', x: -17, z: 14, radius: 3.5, name: 'cliff_boulder_3' },
      // 2. Cold Spring River: Impassable water sections (except via the arched bridge at z: -2 to 2)
      { type: 'box', minX: -7.6, maxX: -0.4, minZ: -18, maxZ: -2.0, name: 'stream_north' },
      { type: 'box', minX: -7.6, maxX: -0.4, minZ: 2.0, maxZ: 26, name: 'stream_south' },
      // 3. Stone bridge railings (prevent falling off the bridge into water)
      { type: 'box', minX: -7.2, maxX: -0.8, minZ: 1.5, maxZ: 2.0, name: 'bridge_rail_south' },
      { type: 'box', minX: -7.2, maxX: -0.8, minZ: -2.0, maxZ: -1.5, name: 'bridge_rail_north' },
      // 4. Hexagonal Cold Spring Pavilion: Central tea table & pillars
      { type: 'circle', x: 10, z: -4, radius: 1.3, name: 'pavilion_center' },
      // 6 pavilion timber columns
      { type: 'circle', x: 10 + 3.4, z: -4, radius: 0.55, name: 'pavilion_col_0' },
      { type: 'circle', x: 10 + 1.7, z: -4 + 2.94, radius: 0.55, name: 'pavilion_col_1' },
      { type: 'circle', x: 10 - 1.7, z: -4 + 2.94, radius: 0.55, name: 'pavilion_col_2' },
      { type: 'circle', x: 10 - 3.4, z: -4, radius: 0.55, name: 'pavilion_col_3' },
      { type: 'circle', x: 10 - 1.7, z: -4 - 2.94, radius: 0.55, name: 'pavilion_col_4' },
      { type: 'circle', x: 10 + 1.7, z: -4 - 2.94, radius: 0.55, name: 'pavilion_col_5' },
      // 5. Dense bamboo clumps
      { type: 'circle', x: -13, z: 9, radius: 2.0, name: 'bamboo_1' },
      { type: 'circle', x: -12, z: 16, radius: 2.0, name: 'bamboo_2' },
    ],
  },

  bell_tower: {
    id: "bell_tower",
    name: "灵隐钟楼 · 暮鼓晨钟",
    bounds: { minX: -15, maxX: 15, minZ: -15, maxZ: 15 },
    playerRadius: 0.55,
    spawnPos: { x: 0, y: 0, z: 7 },
    spawnAngle: 0,
    cameraSettings: { yaw: 0, pitch: 0.3, dist: 8.5 },
    hotspots: [
      {
        id: "bell_tower",
        name: "古铜大钟前",
        actionName: "挥木撞响古钟",
        position: { x: 0, y: 0, z: -1 },
        radius: 4.2,
      },
    ],
    colliders: [
      // 1. Central Bronze Great Bell & Suspension Rig
      { type: 'circle', x: 0, z: -1, radius: 1.9, name: 'great_bell' },
      // 2. Four Tower Corner Timber Pillars
      { type: 'circle', x: -8, z: -8, radius: 1.1, name: 'bell_pillar_nw' },
      { type: 'circle', x: 8, z: -8, radius: 1.1, name: 'bell_pillar_ne' },
      { type: 'circle', x: -8, z: 8, radius: 1.1, name: 'bell_pillar_sw' },
      { type: 'circle', x: 8, z: 8, radius: 1.1, name: 'bell_pillar_se' },
      // 3. Platform Perimeter Stone Balustrades (prevent walking off mountain edge)
      { type: 'box', minX: -18, maxX: 18, minZ: 15.2, maxZ: 18, name: 'balustrade_front' },
      { type: 'box', minX: -18, maxX: 18, minZ: -18, maxZ: -15.2, name: 'balustrade_back' },
      { type: 'box', minX: -18, maxX: -15.2, minZ: -18, maxZ: 18, name: 'balustrade_left' },
      { type: 'box', minX: 15.2, maxX: 18, minZ: -18, maxZ: 18, name: 'balustrade_right' },
    ],
  },

  zen_room: {
    id: "zen_room",
    name: "云林禅房 · 净坐调息",
    bounds: { minX: -9.5, maxX: 9.5, minZ: -8.5, maxZ: 9.5 },
    playerRadius: 0.55,
    spawnPos: { x: 0, y: 0, z: 5.5 },
    spawnAngle: 0,
    cameraSettings: { yaw: 0, pitch: 0.25, dist: 7.5 },
    hotspots: [
      {
        id: "zen_meditation_mat",
        name: "静心禅垫",
        actionName: "闭目静坐",
        position: { x: 0, y: 0, z: 0 },
        radius: 3.5,
      },
      {
        id: "tea_table",
        name: "禅茶桌",
        actionName: "抽签得禅语",
        position: { x: 4.8, y: 0, z: 1 },
        radius: 3.5,
      },
    ],
    colliders: [
      // 1. Zen Tea Table & tea service
      { type: 'box', minX: 3.6, maxX: 6.0, minZ: 0.2, maxZ: 1.8, name: 'tea_table' },
      // 2. Central Raised Meditation Wooden Platform
      { type: 'box', minX: -2.2, maxX: 2.2, minZ: -2.2, maxZ: 2.2, name: 'meditation_platform' },
      // 3. Back Wall & Calligraphy Scroll
      { type: 'box', minX: -12, maxX: 12, minZ: -11, maxZ: -8.8, name: 'back_wall' },
      // 4. Side & front walls
      { type: 'box', minX: -11, maxX: -9.2, minZ: -9, maxZ: 11, name: 'left_wall' },
      { type: 'box', minX: 9.2, maxX: 11, minZ: -9, maxZ: 11, name: 'right_wall' },
      { type: 'box', minX: -11, maxX: 11, minZ: 9.2, maxZ: 11, name: 'front_wall' },
    ],
  },
};

/**
 * Resolves collisions for a circle of given radius against boundaries and all colliders.
 * Returns the resolved position pushed outside obstacles.
 */
export function resolveCollisions(
  pos: Vec3,
  colliders: Collider[] = [],
  radius: number = 0.55,
  bounds = SCENE_CONFIGS.courtyard.bounds,
  maxIterations = 4
): Vec3 {
  let currX = pos.x;
  let currZ = pos.z;

  for (let iter = 0; iter < maxIterations; iter++) {
    let hadCollision = false;

    // 1. Boundary clamp (respecting player radius)
    const minX = bounds.minX + radius;
    const maxX = bounds.maxX - radius;
    const minZ = bounds.minZ + radius;
    const maxZ = bounds.maxZ - radius;

    if (currX < minX) {
      currX = minX;
      hadCollision = true;
    } else if (currX > maxX) {
      currX = maxX;
      hadCollision = true;
    }

    if (currZ < minZ) {
      currZ = minZ;
      hadCollision = true;
    } else if (currZ > maxZ) {
      currZ = maxZ;
      hadCollision = true;
    }

    // 2. Obstacle collision tests
    for (const c of colliders) {
      if (c.type === 'circle') {
        const dx = currX - c.x;
        const dz = currZ - c.z;
        const distSq = dx * dx + dz * dz;
        const minDist = radius + c.radius;

        if (distSq < minDist * minDist) {
          hadCollision = true;
          const dist = Math.sqrt(distSq);
          if (dist > 1e-5) {
            const overlap = minDist - dist;
            currX += (dx / dist) * overlap;
            currZ += (dz / dist) * overlap;
          } else {
            // Exactly on top of center - push out along arbitrary direction
            currX += minDist;
          }
        }
      } else if (c.type === 'box') {
        // Nearest point on box
        const closestX = Math.max(c.minX, Math.min(c.maxX, currX));
        const closestZ = Math.max(c.minZ, Math.min(c.maxZ, currZ));
        const dx = currX - closestX;
        const dz = currZ - closestZ;
        const distSq = dx * dx + dz * dz;

        if (distSq < radius * radius) {
          hadCollision = true;
          const dist = Math.sqrt(distSq);
          if (dist > 1e-5) {
            const overlap = radius - dist;
            currX += (dx / dist) * overlap;
            currZ += (dz / dist) * overlap;
          } else {
            // Center is inside the box: push out to closest edge
            const dLeft = currX - c.minX;
            const dRight = c.maxX - currX;
            const dTop = currZ - c.minZ;
            const dBottom = c.maxZ - currZ;
            const minEdge = Math.min(dLeft, dRight, dTop, dBottom);

            if (minEdge === dLeft) currX = c.minX - radius;
            else if (minEdge === dRight) currX = c.maxX + radius;
            else if (minEdge === dTop) currZ = c.minZ - radius;
            else currZ = c.maxZ + radius;
          }
        }
      }
    }

    if (!hadCollision) break;
  }

  return { x: currX, y: pos.y, z: currZ };
}

/**
 * Checks whether a position collides with any collider or scene boundary.
 */
export function isPositionColliding(
  pos: Vec3,
  colliders: Collider[] = [],
  radius: number = 0.55,
  bounds = SCENE_CONFIGS.courtyard.bounds
): boolean {
  if (
    pos.x < bounds.minX + radius ||
    pos.x > bounds.maxX - radius ||
    pos.z < bounds.minZ + radius ||
    pos.z > bounds.maxZ - radius
  ) {
    return true;
  }

  for (const c of colliders) {
    if (c.type === 'circle') {
      const dx = pos.x - c.x;
      const dz = pos.z - c.z;
      const minDist = radius + c.radius;
      if (dx * dx + dz * dz < minDist * minDist) {
        return true;
      }
    } else if (c.type === 'box') {
      const closestX = Math.max(c.minX, Math.min(c.maxX, pos.x));
      const closestZ = Math.max(c.minZ, Math.min(c.maxZ, pos.z));
      const dx = pos.x - closestX;
      const dz = pos.z - closestZ;
      if (dx * dx + dz * dz < radius * radius) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Step player towards target point on X-Z plane without penetrating colliders
 */
export function stepTowardsTarget(
  current: Vec3,
  target: Vec3,
  speed: number,
  delta: number,
  bounds = SCENE_CONFIGS.courtyard.bounds,
  colliders: Collider[] = [],
  playerRadius: number = 0.55
): { position: Vec3; isArrived: boolean; angle: number } {
  // Resolve target itself if it happens to be inside an obstacle
  const safeTarget = resolveCollisions(target, colliders, playerRadius, bounds);

  const dx = safeTarget.x - current.x;
  const dz = safeTarget.z - current.z;
  const distance = Math.hypot(dx, dz);

  // Arrival threshold
  if (distance < 0.18) {
    return {
      position: safeTarget,
      isArrived: true,
      angle: Math.atan2(dx, dz),
    };
  }

  const stepDistance = Math.min(distance, speed * delta);
  const ratio = stepDistance / distance;
  const rawNextX = current.x + dx * ratio;
  const rawNextZ = current.z + dz * ratio;

  // Resolve position against scene obstacles
  const resolved = resolveCollisions(
    { x: rawNextX, y: current.y, z: rawNextZ },
    colliders,
    playerRadius,
    bounds
  );

  const movedDist = Math.hypot(resolved.x - current.x, resolved.z - current.z);
  const remainingDist = Math.hypot(safeTarget.x - resolved.x, safeTarget.z - resolved.z);
  const isStuck = movedDist < 0.003 && distance > 0.3;

  return {
    position: resolved,
    isArrived: isStuck || remainingDist < 0.22,
    angle: Math.atan2(dx, dz),
  };
}

/**
 * Calculate move direction vector from WASD keys relative to camera angle,
 * with wall sliding collision response.
 */
export function calculateKeyboardMovement(
  keys: { forward: boolean; backward: boolean; left: boolean; right: boolean },
  cameraYaw: number,
  speed: number,
  delta: number,
  bounds = SCENE_CONFIGS.courtyard.bounds,
  currentPos: Vec3 = { x: 0, y: 0, z: 0 },
  colliders: Collider[] = [],
  playerRadius: number = 0.55
): { moveX: number; moveZ: number; nextPos: Vec3; isMoving: boolean; angle: number } {
  let inputZ = 0;
  let inputX = 0;

  if (keys.forward) inputZ -= 1;
  if (keys.backward) inputZ += 1;
  if (keys.left) inputX -= 1;
  if (keys.right) inputX += 1;

  if (inputX === 0 && inputZ === 0) {
    return { moveX: 0, moveZ: 0, nextPos: currentPos, isMoving: false, angle: 0 };
  }

  // Normalize input
  const len = Math.hypot(inputX, inputZ);
  const normX = inputX / len;
  const normZ = inputZ / len;

  // Rotate by camera yaw
  const cos = Math.cos(cameraYaw);
  const sin = Math.sin(cameraYaw);

  const worldX = normX * cos - normZ * sin;
  const worldZ = normX * sin + normZ * cos;

  const stepDist = speed * delta;
  const desiredX = worldX * stepDist;
  const desiredZ = worldZ * stepDist;
  const angle = Math.atan2(worldX, worldZ);

  // 1. Try full diagonal step
  const proposedFull: Vec3 = {
    x: currentPos.x + desiredX,
    y: currentPos.y,
    z: currentPos.z + desiredZ,
  };
  const resolvedFull = resolveCollisions(proposedFull, colliders, playerRadius, bounds);

  const movedFull = Math.hypot(resolvedFull.x - currentPos.x, resolvedFull.z - currentPos.z);
  if (movedFull > 1e-4) {
    return {
      moveX: resolvedFull.x - currentPos.x,
      moveZ: resolvedFull.z - currentPos.z,
      nextPos: resolvedFull,
      isMoving: true,
      angle,
    };
  }

  // 2. Wall sliding along X-only
  const proposedX: Vec3 = { x: currentPos.x + desiredX, y: currentPos.y, z: currentPos.z };
  const resolvedX = resolveCollisions(proposedX, colliders, playerRadius, bounds);
  const movedX = Math.abs(resolvedX.x - currentPos.x);

  // 3. Wall sliding along Z-only
  const proposedZ: Vec3 = { x: currentPos.x, y: currentPos.y, z: currentPos.z + desiredZ };
  const resolvedZ = resolveCollisions(proposedZ, colliders, playerRadius, bounds);
  const movedZ = Math.abs(resolvedZ.z - currentPos.z);

  if (movedX >= movedZ && movedX > 1e-4) {
    return {
      moveX: resolvedX.x - currentPos.x,
      moveZ: 0,
      nextPos: resolvedX,
      isMoving: true,
      angle: desiredX > 0 ? Math.PI / 2 : -Math.PI / 2,
    };
  } else if (movedZ > 1e-4) {
    return {
      moveX: 0,
      moveZ: resolvedZ.z - currentPos.z,
      nextPos: resolvedZ,
      isMoving: true,
      angle: desiredZ > 0 ? 0 : Math.PI,
    };
  }

  // Blocked in all directions
  return {
    moveX: 0,
    moveZ: 0,
    nextPos: currentPos,
    isMoving: false,
    angle,
  };
}

/**
 * Find nearest interactive hotspot to player position
 */
export function getNearestHotspot(playerPos: Vec3, hotspots: Hotspot3D[]): Hotspot3D | null {
  let closest: Hotspot3D | null = null;
  let minDist = Infinity;

  for (const h of hotspots) {
    const dist = Math.hypot(playerPos.x - h.position.x, playerPos.z - h.position.z);
    if (dist <= h.radius && dist < minDist) {
      minDist = dist;
      closest = h;
    }
  }

  return closest;
}
