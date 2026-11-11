/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

/**
 * Procedural authentic materials & textures for Hangzhou Lingyin Temple (杭州灵隐寺)
 * Built with procedural Canvas generation: 100% reliable, zero 404s, authentic temple realism.
 */

/**
 * 1. 灵隐寺长条青石地坪 (Jiangnan Slate Stone Pavers)
 * Traditional staggered rectangular flagstones with weathered edges and joint accents.
 */
export function createStonePaverTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm slate grey base
  ctx.fillStyle = '#787670';
  ctx.fillRect(0, 0, 512, 512);

  // Staggered rectangular pavers (4 rows x 4 cols, offset by row)
  const rows = 8;
  const rowH = 512 / rows;

  for (let r = 0; r < rows; r++) {
    const y = r * rowH;
    const isOdd = r % 2 === 1;
    const cols = isOdd ? 5 : 4;
    const slabW = 512 / (isOdd ? 4.5 : 4);

    for (let c = -1; c <= cols + 1; c++) {
      const x = c * slabW + (isOdd ? -slabW * 0.4 : 0);

      // Random stone shade within Jiangnan slate palette
      const seed = Math.sin(r * 19 + c * 37);
      const tone = Math.floor(seed * 18);
      const rCol = Math.min(255, Math.max(80, 122 + tone));
      const gCol = Math.min(255, Math.max(80, 120 + tone - 2));
      const bCol = Math.min(255, Math.max(80, 114 + tone - 4));

      // Draw slab body
      ctx.fillStyle = `rgb(${rCol}, ${gCol}, ${bCol})`;
      ctx.fillRect(x + 2, y + 2, slabW - 4, rowH - 4);

      // Top/Left slight sun bevel highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(x + 2, y + 2, slabW - 4, 3);
      ctx.fillRect(x + 2, y + 2, 3, rowH - 4);

      // Bottom/Right recessed bevel shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
      ctx.fillRect(x + 2, y + rowH - 5, slabW - 4, 3);
      ctx.fillRect(x + slabW - 5, y + 2, 3, rowH - 4);

      // Fine stone grain and micro-fissures
      for (let i = 0; i < 35; i++) {
        const nx = x + 4 + Math.random() * (slabW - 8);
        const ny = y + 4 + Math.random() * (rowH - 8);
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.07)' : 'rgba(20,20,20,0.08)';
        ctx.fillRect(nx, ny, 1 + Math.random() * 2, 1 + Math.random() * 2);
      }

      // Faint green moss flecks in stone joints
      if (Math.abs(seed) > 0.4) {
        ctx.fillStyle = 'rgba(64, 82, 54, 0.35)';
        ctx.fillRect(x + slabW - 4, y + 2, 3, rowH - 4);
        ctx.fillRect(x + 2, y + rowH - 4, slabW - 4, 3);
      }
    }
  }

  // Deep mortar joints
  ctx.strokeStyle = '#43413b';
  ctx.lineWidth = 3;
  for (let r = 0; r <= rows; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * rowH);
    ctx.lineTo(512, r * rowH);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 2. 灵隐寺黛黑筒瓦屋面 (Traditional Lingyin Slate Roof Tiles)
 * Alternating cover & pan tiles (筒瓦与板瓦) with deep shadows and clay ceramic luster.
 */
export function createRoofTileTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Deep charcoal slate base
  ctx.fillStyle = '#282b2d';
  ctx.fillRect(0, 0, 256, 256);

  const tileH = 20;
  for (let y = 0; y < 256; y += tileH) {
    // Cylindrical cover tile gradient
    const grad = ctx.createLinearGradient(0, y, 0, y + tileH);
    grad.addColorStop(0, '#464a4d');
    grad.addColorStop(0.2, '#383b3e');
    grad.addColorStop(0.5, '#282a2c');
    grad.addColorStop(0.85, '#1e2022');
    grad.addColorStop(1, '#111213');
    ctx.fillStyle = grad;
    ctx.fillRect(0, y, 256, tileH - 2);

    // Weathered tile lip highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(0, y, 256, 1.5);

    // Dark valley joint
    ctx.fillStyle = '#0a0b0c';
    ctx.fillRect(0, y + tileH - 2, 256, 2);

    // Vertical tile lap lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 1.5;
    for (let x = 16; x < 256; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + tileH);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 3. 灵隐黄山墙抹灰粉壁 (Lingyin Temple Historic Ochre Plaster Wall)
 * Warm, earthy Jiangnan monastic yellow lime-wash with subtle stucco grain.
 */
export function createYellowWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Authentic Jiangnan temple yellow-ochre base
  ctx.fillStyle = '#c89540';
  ctx.fillRect(0, 0, 512, 512);

  // Horizontal lime-wash brush work
  for (let y = 0; y < 512; y += 8) {
    const strokeSeed = Math.sin(y * 11);
    ctx.fillStyle = strokeSeed > 0 ? 'rgba(235, 178, 85, 0.18)' : 'rgba(168, 110, 36, 0.16)';
    ctx.fillRect(0, y, 512, 8 + Math.random() * 4);
  }

  // Mineral lime plaster grain and aggregate
  for (let i = 0; i < 4500; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const isBright = Math.random() > 0.45;
    ctx.fillStyle = isBright ? 'rgba(255, 235, 180, 0.14)' : 'rgba(120, 75, 20, 0.12)';
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Soft weathered mottling
  for (let i = 0; i < 20; i++) {
    const rad = 25 + Math.random() * 60;
    const cx = Math.random() * 512;
    const cy = Math.random() * 512;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
    grad.addColorStop(0, 'rgba(145, 95, 30, 0.08)');
    grad.addColorStop(1, 'rgba(145, 95, 30, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 3);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 4. 殿堂大漆红栗木梁柱 (Ancient Lacquered Chestnut Temple Timber)
 * Deep reddish-chestnut temple lacquer with smooth longitudinal wood grain.
 */
export function createWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep cinnabar/chestnut base
  ctx.fillStyle = '#5a2218';
  ctx.fillRect(0, 0, 256, 512);

  // Longitudinal wood grain
  for (let x = 0; x < 256; x += 4) {
    const grainTone = Math.sin(x * 0.4) * 0.5 + 0.5;
    ctx.strokeStyle = `rgba(${75 + grainTone * 25}, ${22 + grainTone * 15}, ${14 + grainTone * 10}, 0.65)`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    const wobble = (Math.random() - 0.5) * 8;
    ctx.bezierCurveTo(x + wobble, 170, x - wobble, 340, x, 512);
    ctx.stroke();
  }

  // Soft polished lacquer glaze
  const glaze = ctx.createLinearGradient(0, 0, 256, 0);
  glaze.addColorStop(0, 'rgba(255, 180, 120, 0.06)');
  glaze.addColorStop(0.5, 'rgba(255, 200, 140, 0.12)');
  glaze.addColorStop(1, 'rgba(30, 8, 4, 0.25)');
  ctx.fillStyle = glaze;
  ctx.fillRect(0, 0, 256, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 5. 佛光金身真金箔贴金纹理 (Gilded Temple Gold Leaf)
 * Traditional gold foil leaves (库金箔) with subtle square seams and warm sacred radiance.
 */
export function createGoldLeafTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Sacred gold leaf base
  ctx.fillStyle = '#dca742';
  ctx.fillRect(0, 0, 512, 512);

  // Traditional 9x9cm gold foil patchwork grid
  const leafSize = 512 / 4;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const lx = c * leafSize;
      const ly = r * leafSize;

      // Slight tone shift per gold leaf
      const leafGrad = ctx.createLinearGradient(lx, ly, lx + leafSize, ly + leafSize);
      leafGrad.addColorStop(0, '#f2ca6b');
      leafGrad.addColorStop(0.5, '#deb04e');
      leafGrad.addColorStop(1, '#c99335');
      ctx.fillStyle = leafGrad;
      ctx.fillRect(lx + 1, ly + 1, leafSize - 2, leafSize - 2);

      // Gold leaf seams (贴金接缝痕迹)
      ctx.strokeStyle = 'rgba(160, 105, 25, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(lx, ly, leafSize, leafSize);

      // Micro hammered gold foil shimmer
      for (let i = 0; i < 40; i++) {
        const mx = lx + Math.random() * leafSize;
        const my = ly + Math.random() * leafSize;
        ctx.fillStyle = Math.random() > 0.4 ? 'rgba(255, 248, 200, 0.22)' : 'rgba(140, 85, 15, 0.15)';
        ctx.fillRect(mx, my, 2, 2);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 6. 灵隐古铜熟铜香炉/古钟青铜质感 (Weathered Ancient Temple Bronze)
 * Centuries of incense smoke patina with subtle malachite oxidized green in recesses.
 */
export function createWeatheredBronzeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Deep dark bronze base
  ctx.fillStyle = '#2d2722';
  ctx.fillRect(0, 0, 256, 256);

  // Cast bronze stippling
  for (let i = 0; i < 1800; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(80, 68, 55, 0.22)' : 'rgba(18, 15, 12, 0.35)';
    ctx.fillRect(x, y, 2, 2);
  }

  // Oxidized malachite patina speckles (铜绿斑)
  for (let i = 0; i < 280; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = 2 + Math.random() * 5;
    ctx.fillStyle = 'rgba(68, 102, 85, 0.32)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Soft metallic sheen highlight
  const bronzeSheen = ctx.createLinearGradient(0, 0, 256, 256);
  bronzeSheen.addColorStop(0, 'rgba(150, 115, 75, 0.12)');
  bronzeSheen.addColorStop(0.5, 'rgba(200, 155, 100, 0.08)');
  bronzeSheen.addColorStop(1, 'rgba(15, 12, 10, 0.2)');
  ctx.fillStyle = bronzeSheen;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 7. 拜佛蒲草编织蒲团 (Traditional Woven Straw Prayer Cushion)
 * Concentric braided rush grass with warm natural fiber hues.
 */
export function createWovenStrawTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Warm natural rush straw base
  ctx.fillStyle = '#b89456';
  ctx.fillRect(0, 0, 256, 256);

  const cx = 128;
  const cy = 128;

  // Concentric coils
  for (let r = 8; r < 128; r += 5) {
    ctx.strokeStyle = r % 10 === 0 ? '#98753a' : '#caa769';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Braided stitch marks along coil
    const count = Math.floor(r * 0.8);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      ctx.fillStyle = 'rgba(75, 52, 22, 0.25)';
      ctx.fillRect(px - 1, py - 1, 2, 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 8. 冷泉清溪碧水 (Clear Celadon Spring Stream)
 * Serene, reflective jade brook with subtle surface caustics.
 */
export function createWaterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Cold spring azure-celadon jade gradient
  const grad = ctx.createLinearGradient(0, 0, 256, 256);
  grad.addColorStop(0, '#1c4a45');
  grad.addColorStop(0.5, '#2b665f');
  grad.addColorStop(1, '#183c37');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  // Soft rippling wave caustics
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    const rx = Math.random() * 256;
    const ry = Math.random() * 256;
    const radius = 12 + Math.random() * 32;
    ctx.arc(rx, ry, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 9. 大雄宝殿暗红楠木实木地板 (Deep Lacquered Interior Timber Floor)
 * Broad dark wood planks with authentic joint seams.
 */
export function createDarkWoodFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2c1710';
  ctx.fillRect(0, 0, 512, 512);

  const plankH = 512 / 8;
  for (let i = 0; i < 8; i++) {
    const y = i * plankH;
    ctx.fillStyle = i % 2 === 0 ? '#341d14' : '#27140d';
    ctx.fillRect(0, y, 512, plankH);

    // Fine wood grain streaks
    for (let s = 0; s < 12; s++) {
      const sy = y + Math.random() * plankH;
      ctx.strokeStyle = 'rgba(20, 8, 4, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(512, sy);
      ctx.stroke();
    }

    // Plank seam
    ctx.strokeStyle = '#120704';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 10. 云林禅房蔺草席榻榻米 (Natural Woven Reed Tatami)
 * Hand-woven straw reed pattern with dark indigo cloth border trim.
 */
export function createTatamiTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Natural dried rush grass straw hue
  ctx.fillStyle = '#bfa978';
  ctx.fillRect(0, 0, 256, 256);

  // Weave ridges
  for (let y = 0; y < 256; y += 4) {
    ctx.fillStyle = y % 8 === 0 ? '#a89260' : '#cfba8b';
    ctx.fillRect(0, y, 256, 3);
  }

  // Traditional dark damask fabric edge border
  ctx.fillStyle = '#1c1b19';
  ctx.fillRect(0, 0, 16, 256);
  ctx.fillRect(240, 0, 16, 256);

  // Gold stitch accent on fabric border
  ctx.strokeStyle = '#635338';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(15, 0);
  ctx.lineTo(15, 256);
  ctx.moveTo(241, 0);
  ctx.lineTo(241, 256);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 11. 飞来峰摩崖溶蚀石灰岩 (Feilai Peak Karst Limestone with Mountain Moss)
 * Rugged weathered limestone cliffs with water stains and moss green patina.
 */
export function createRockCliffTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Weathered limestone grey
  ctx.fillStyle = '#56534b';
  ctx.fillRect(0, 0, 512, 512);

  // Karst hollows and crevices
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = 8 + Math.random() * 26;
    const isMoss = Math.random() > 0.45;
    ctx.fillStyle = isMoss ? 'rgba(52, 72, 48, 0.42)' : 'rgba(34, 32, 28, 0.45)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Vertical rainwater mineral streaks (雨水冲刷矿物痕)
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 512;
    const grad = ctx.createLinearGradient(x, 0, x, 512);
    grad.addColorStop(0, 'rgba(30, 28, 25, 0.3)');
    grad.addColorStop(0.5, 'rgba(45, 62, 42, 0.25)');
    grad.addColorStop(1, 'rgba(25, 24, 22, 0.35)');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, 6 + Math.random() * 12, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
