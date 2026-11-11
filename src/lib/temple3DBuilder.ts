/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import {
  createStonePaverTexture,
  createRoofTileTexture,
  createYellowWallTexture,
  createWoodTexture,
  createWaterTexture,
  createDarkWoodFloorTexture,
  createTatamiTexture,
  createRockCliffTexture,
  createGoldLeafTexture,
  createWeatheredBronzeTexture,
  createWovenStrawTexture,
} from './threeTextures';

export interface MonkMeshGroup extends THREE.Group {
  updateWalkAnimation: (delta: number, isWalking: boolean) => void;
  setBowingPose: (isBowing: boolean) => void;
  setProstratingPose: (isProstrating: boolean) => void;
  walkCycle: number;
}

export function buildLingyinGrandHall(): THREE.Group {
  const hall = new THREE.Group();

  const stoneTex = createStonePaverTexture();
  const roofTex = createRoofTileTexture();
  const yellowTex = createYellowWallTexture();
  const woodTex = createWoodTexture();

  const yellowWallMat = new THREE.MeshStandardMaterial({
    map: yellowTex,
    roughness: 0.75,
    metalness: 0.05,
  });

  const roofMat = new THREE.MeshStandardMaterial({
    map: roofTex,
    roughness: 0.6,
    metalness: 0.1,
  });

  const woodMat = new THREE.MeshStandardMaterial({
    map: woodTex,
    roughness: 0.65,
    metalness: 0.05,
  });

  const stoneMat = new THREE.MeshStandardMaterial({
    map: stoneTex,
    roughness: 0.85,
    metalness: 0.05,
  });

  const goldMat = new THREE.MeshStandardMaterial({
    map: createGoldLeafTexture(),
    color: 0xffe6a3,
    roughness: 0.38,
    metalness: 0.72,
  });

  // 1. Stone Terrace Base (台基)
  const baseGeo = new THREE.BoxGeometry(32, 2.2, 24);
  const baseMesh = new THREE.Mesh(baseGeo, stoneMat);
  baseMesh.position.set(0, 1.1, -18);
  baseMesh.castShadow = true;
  baseMesh.receiveShadow = true;
  hall.add(baseMesh);

  // Front Steps (阶梯)
  const stepsGeo = new THREE.BoxGeometry(10, 1.1, 4);
  const stepsMesh = new THREE.Mesh(stepsGeo, stoneMat);
  stepsMesh.position.set(0, 0.55, -5.5);
  stepsMesh.receiveShadow = true;
  hall.add(stepsMesh);

  // 2. Main Hall Yellow Stucco Walls (大雄宝殿山墙)
  const wallGeo = new THREE.BoxGeometry(26, 9, 18);
  const wallMesh = new THREE.Mesh(wallGeo, yellowWallMat);
  wallMesh.position.set(0, 6.7, -18);
  wallMesh.castShadow = true;
  wallMesh.receiveShadow = true;
  hall.add(wallMesh);

  // Open Hall Front Door Portal (大殿正门入胜)
  const doorHoleMat = new THREE.MeshBasicMaterial({ color: 0x181410 });
  const doorHole = new THREE.Mesh(new THREE.BoxGeometry(14, 6.5, 0.2), doorHoleMat);
  doorHole.position.set(0, 5.5, -8.9);
  hall.add(doorHole);

  // 3. Red Pillars (前廊朱红檐柱)
  const pillarGeo = new THREE.CylinderGeometry(0.4, 0.45, 9.2, 12);
  const pillarPositions = [-11, -7, -3, 3, 7, 11];
  pillarPositions.forEach(px => {
    const p = new THREE.Mesh(pillarGeo, woodMat);
    p.position.set(px, 6.8, -8.6);
    p.castShadow = true;
    hall.add(p);
  });

  // 4. Horizontal Name Tablet: "大雄宝殿" (金字匾额)
  const plaqueBase = new THREE.Mesh(new THREE.BoxGeometry(6, 1.8, 0.3), woodMat);
  plaqueBase.position.set(0, 9.8, -8.7);
  hall.add(plaqueBase);

  // Gold text plaque rim
  const plaqueRim = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1.4, 0.35), goldMat);
  plaqueRim.position.set(0, 9.8, -8.7);
  hall.add(plaqueRim);

  // 5. Lower Tier Eaves Roof (下层重檐)
  const lowerRoofGeo = new THREE.ConeGeometry(20, 4.5, 4);
  const lowerRoof = new THREE.Mesh(lowerRoofGeo, roofMat);
  lowerRoof.rotation.y = Math.PI / 4;
  lowerRoof.scale.set(1.4, 0.6, 1.1);
  lowerRoof.position.set(0, 11.2, -18);
  lowerRoof.castShadow = true;
  hall.add(lowerRoof);

  // 6. Upper Tier Hip-and-Gable Roof (上层飞檐翘角大顶)
  const upperRoofGeo = new THREE.ConeGeometry(17, 6, 4);
  const upperRoof = new THREE.Mesh(upperRoofGeo, roofMat);
  upperRoof.rotation.y = Math.PI / 4;
  upperRoof.scale.set(1.3, 0.7, 1.0);
  upperRoof.position.set(0, 15.5, -18);
  upperRoof.castShadow = true;
  hall.add(upperRoof);

  // Golden Ridge Top & Ornament (正脊鸱吻)
  const ridgeGeo = new THREE.BoxGeometry(16, 0.8, 1);
  const ridge = new THREE.Mesh(ridgeGeo, goldMat);
  ridge.position.set(0, 17.5, -18);
  hall.add(ridge);

  // 7. Interior Gilded Buddha Statue (大殿内金身世尊佛像)
  const buddhaGroup = new THREE.Group();
  buddhaGroup.position.set(0, 2.2, -18);

  // Multi-tier Lotus Throne (莲花座)
  const lotusBase = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.8, 1.4, 16), woodMat);
  lotusBase.position.y = 0.7;
  buddhaGroup.add(lotusBase);

  const lotusPetals = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.2, 0.8, 16), goldMat);
  lotusPetals.position.y = 1.6;
  buddhaGroup.add(lotusPetals);

  // Seated Buddha Body (盘坐法身)
  const buddhaLegs = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.2, 1.0, 16), goldMat);
  buddhaLegs.position.y = 2.4;
  buddhaGroup.add(buddhaLegs);

  const buddhaTorso = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.4, 2.2, 16), goldMat);
  buddhaTorso.position.y = 3.8;
  buddhaGroup.add(buddhaTorso);

  const buddhaHead = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 16), goldMat);
  buddhaHead.position.y = 5.2;
  buddhaGroup.add(buddhaHead);

  // Ushnisha (肉髻)
  const ushnisha = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), goldMat);
  ushnisha.position.y = 6.1;
  buddhaGroup.add(ushnisha);

  // Halo / Mandorla (佛光背光)
  const haloMat = new THREE.MeshBasicMaterial({ color: 0xfde047, side: THREE.DoubleSide });
  const halo = new THREE.Mesh(new THREE.CircleGeometry(2.4, 24), haloMat);
  halo.position.set(0, 4.8, -1.1);
  buddhaGroup.add(halo);

  // Warm light radiating from Buddha
  const buddhaLight = new THREE.PointLight(0xfef08a, 1.5, 16);
  buddhaLight.position.set(0, 4.5, 0);
  buddhaGroup.add(buddhaLight);

  hall.add(buddhaGroup);

  // 8. Prayer Cushions in Front (拜佛蒲团)
  const cushionMat = new THREE.MeshStandardMaterial({
    color: 0x854d0e,
    roughness: 0.8,
  });
  const cushionGeo = new THREE.CylinderGeometry(0.7, 0.75, 0.25, 16);
  [-2.5, 0, 2.5].forEach(cx => {
    const cushion = new THREE.Mesh(cushionGeo, cushionMat);
    cushion.position.set(cx, 2.35, -7.5);
    cushion.receiveShadow = true;
    hall.add(cushion);
  });

  return hall;
}

export function buildIncenseBurner(): THREE.Group {
  const burner = new THREE.Group();
  burner.position.set(0, 0, 4);

  const bronzeMat = new THREE.MeshStandardMaterial({
    map: createWeatheredBronzeTexture(),
    roughness: 0.52,
    metalness: 0.65,
  });

  const goldTrimMat = new THREE.MeshStandardMaterial({
    map: createGoldLeafTexture(),
    color: 0xffe299,
    roughness: 0.38,
    metalness: 0.75,
  });

  // Base stone pedestal
  const stoneBase = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 0.5, 2.4),
    new THREE.MeshStandardMaterial({ map: createStonePaverTexture(), roughness: 0.85 })
  );
  stoneBase.position.y = 0.25;
  burner.add(stoneBase);

  // 4 Legs
  const legGeo = new THREE.CylinderGeometry(0.2, 0.25, 1.2, 8);
  [[-1.5, -0.7], [1.5, -0.7], [-1.5, 0.7], [1.5, 0.7]].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(legGeo, bronzeMat);
    leg.position.set(lx, 1.0, lz);
    burner.add(leg);
  });

  // Burner Basin
  const basin = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.5, 1.8), bronzeMat);
  basin.position.y = 2.1;
  basin.castShadow = true;
  burner.add(basin);

  // Gold Characters tablet on burner: "灵隐宝鼎"
  const tag = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.5, 0.1), goldTrimMat);
  tag.position.set(0, 2.1, 0.95);
  burner.add(tag);

  // Incense Ash interior
  const ash = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.2, 1.4),
    new THREE.MeshStandardMaterial({ color: 0xa8a29e, roughness: 0.9 })
  );
  ash.position.y = 2.8;
  burner.add(ash);

  // Pagoda Cap Roof over burner
  const capRoof = new THREE.Mesh(
    new THREE.ConeGeometry(2.8, 1.2, 4),
    bronzeMat
  );
  capRoof.rotation.y = Math.PI / 4;
  capRoof.scale.set(1.4, 0.8, 1.0);
  capRoof.position.y = 4.2;
  burner.add(capRoof);

  // Pillars holding roof
  const capPillarGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.4, 8);
  [[-1.4, -0.6], [1.4, -0.6], [-1.4, 0.6], [1.4, 0.6]].forEach(([px, pz]) => {
    const p = new THREE.Mesh(capPillarGeo, bronzeMat);
    p.position.set(px, 3.4, pz);
    burner.add(p);
  });

  // Particle Smoke Points (袅袅青烟)
  const particleCount = 28;
  const smokeGeo = new THREE.BufferGeometry();
  const smokePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    smokePositions[i * 3] = (Math.random() - 0.5) * 1.5;
    smokePositions[i * 3 + 1] = 2.9 + Math.random() * 3.5;
    smokePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
  }
  smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));

  const smokeMat = new THREE.PointsMaterial({
    color: 0xcccccc,
    size: 0.35,
    transparent: true,
    opacity: 0.45,
  });
  const smokePoints = new THREE.Points(smokeGeo, smokeMat);
  burner.add(smokePoints);

  return burner;
}

export function buildBellTower(): THREE.Group {
  const tower = new THREE.Group();
  tower.position.set(22, 0, -5);

  const woodTex = createWoodTexture();
  const roofTex = createRoofTileTexture();

  const woodMat = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.7 });
  const roofMat = new THREE.MeshStandardMaterial({ map: roofTex, roughness: 0.6 });
  const bronzeMat = new THREE.MeshStandardMaterial({
    color: 0x473d31,
    roughness: 0.4,
    metalness: 0.8,
  });

  // Terrace base
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(8, 1.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.8 })
  );
  base.position.y = 0.6;
  tower.add(base);

  // 4 Corner Wooden Pillars
  const pillarGeo = new THREE.CylinderGeometry(0.3, 0.35, 7, 12);
  [[-3, -3], [3, -3], [-3, 3], [3, 3]].forEach(([px, pz]) => {
    const pillar = new THREE.Mesh(pillarGeo, woodMat);
    pillar.position.set(px, 4.5, pz);
    tower.add(pillar);
  });

  // Bell Tower Roof
  const roofGeo = new THREE.ConeGeometry(6, 3, 4);
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.rotation.y = Math.PI / 4;
  roof.position.y = 9.2;
  tower.add(roof);

  // Giant Bronze Bell (灵隐古铜大钟)
  const bellGroup = new THREE.Group();
  bellGroup.position.set(0, 5.2, 0);

  const bellBody = new THREE.Mesh(
    new THREE.CylinderGeometry(1.0, 1.6, 2.6, 20),
    bronzeMat
  );
  bellGroup.add(bellBody);

  const bellTop = new THREE.Mesh(
    new THREE.SphereGeometry(1.0, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    bronzeMat
  );
  bellTop.position.y = 1.3;
  bellGroup.add(bellTop);

  tower.add(bellGroup);

  // Suspended Wooden Striker Log (撞钟木槌)
  const striker = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.25, 2.8, 12),
    woodMat
  );
  striker.rotation.z = Math.PI / 2;
  striker.position.set(2.2, 4.8, 0);
  tower.add(striker);

  return tower;
}

export function buildColdSpringArea(): THREE.Group {
  const area = new THREE.Group();
  area.position.set(-22, 0, 10);

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x6e2b1f, roughness: 0.7 });
  const roofMat = new THREE.MeshStandardMaterial({ map: createRoofTileTexture(), roughness: 0.6 });
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x857f72, roughness: 0.85 });
  const waterMat = new THREE.MeshStandardMaterial({
    map: createWaterTexture(),
    roughness: 0.2,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
  });

  // Winding Stream Channel (冷泉清溪)
  const streamGeo = new THREE.PlaneGeometry(12, 28);
  const stream = new THREE.Mesh(streamGeo, waterMat);
  stream.rotation.x = -Math.PI / 2;
  stream.position.set(0, 0.05, 0);
  area.add(stream);

  // Stone Arched Bridge (冷泉古石桥)
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.8, 3.2), stoneMat);
  bridge.position.set(0, 0.45, 0);
  area.add(bridge);

  // Bridge railings
  const railGeo = new THREE.BoxGeometry(4.5, 0.6, 0.25);
  const rail1 = new THREE.Mesh(railGeo, stoneMat);
  rail1.position.set(0, 1.0, 1.4);
  area.add(rail1);
  const rail2 = new THREE.Mesh(railGeo, stoneMat);
  rail2.position.set(0, 1.0, -1.4);
  area.add(rail2);

  // Hexagonal Cold Spring Pavilion (冷泉亭)
  const pavBase = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.8, 0.8, 6), stoneMat);
  pavBase.position.set(-6, 0.4, 2);
  area.add(pavBase);

  // 6 Pillars
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const px = -6 + Math.cos(angle) * 2.8;
    const pz = 2 + Math.sin(angle) * 2.8;
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 4.8, 8), woodMat);
    col.position.set(px, 3.0, pz);
    area.add(col);
  }

  // Hexagonal Roof
  const pavRoof = new THREE.Mesh(new THREE.ConeGeometry(4.5, 2.6, 6), roofMat);
  pavRoof.position.set(-6, 6.2, 2);
  area.add(pavRoof);

  return area;
}

export function buildAncientCamphorTree(x: number, z: number, scale = 1.0): THREE.Group {
  const tree = new THREE.Group();
  tree.position.set(x, 0, z);
  tree.scale.setScalar(scale);

  const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x4a3b32,
    roughness: 0.9,
  });

  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x2d5a37,
    roughness: 0.8,
  });

  // Gnarled Trunk (老樟古干)
  const trunkGeo = new THREE.CylinderGeometry(0.8, 1.3, 7, 10);
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 3.5;
  trunk.castShadow = true;
  tree.add(trunk);

  // Tiered Leaf Canopies (层叠樟盖)
  const canopy1 = new THREE.Mesh(new THREE.DodecahedronGeometry(3.5), leafMat);
  canopy1.position.set(0, 7.5, 0);
  canopy1.scale.set(1.4, 0.9, 1.3);
  canopy1.castShadow = true;
  tree.add(canopy1);

  const canopy2 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.8), leafMat);
  canopy2.position.set(1.5, 9.2, -0.8);
  canopy2.scale.set(1.2, 0.8, 1.1);
  canopy2.castShadow = true;
  tree.add(canopy2);

  const canopy3 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.4), leafMat);
  canopy3.position.set(-1.4, 8.8, 1.2);
  canopy3.scale.set(1.1, 0.8, 1.0);
  canopy3.castShadow = true;
  tree.add(canopy3);

  // Red Wish Ribbons tied on tree (祈愿红丝带)
  const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xbe123c, roughness: 0.5 });
  const ribbonGeo = new THREE.BoxGeometry(0.08, 1.2, 0.15);
  [[-0.8, 2.5, 0.8], [0.8, 3.0, -0.7], [0.6, 2.6, 0.9], [-0.7, 3.2, -0.8]].forEach(([rx, ry, rz]) => {
    const r = new THREE.Mesh(ribbonGeo, ribbonMat);
    r.position.set(rx, ry, rz);
    r.rotation.z = (Math.random() - 0.5) * 0.4;
    tree.add(r);
  });

  return tree;
}

/**
 * 3D Cute Little Monk Character (Dongjaseung / 小沙弥)
 */
export function build3DMonkAvatar(
  robeColorHex: string = '#bf7c43',
  sashColorHex: string = '#633215',
  isSelf: boolean = true
): MonkMeshGroup {
  const monk = new THREE.Group() as MonkMeshGroup;
  monk.walkCycle = 0;

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xfce4cc,
    roughness: 0.6,
  });

  const robeMat = new THREE.MeshStandardMaterial({
    color: robeColorHex,
    roughness: 0.7,
  });

  const sashMat = new THREE.MeshStandardMaterial({
    color: sashColorHex,
    roughness: 0.65,
  });

  const shoeMat = new THREE.MeshStandardMaterial({
    color: 0x44403c,
    roughness: 0.8,
  });

  // Soft Contact Shadow Disc beneath feet
  const shadowGeo = new THREE.CircleGeometry(0.55, 16);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  monk.add(shadow);

  // Left & Right Shoes / Feet
  const footGeo = new THREE.BoxGeometry(0.22, 0.18, 0.35);
  const leftFoot = new THREE.Mesh(footGeo, shoeMat);
  leftFoot.position.set(-0.2, 0.09, 0.05);
  monk.add(leftFoot);

  const rightFoot = new THREE.Mesh(footGeo, shoeMat);
  rightFoot.position.set(0.2, 0.09, 0.05);
  monk.add(rightFoot);

  // Upper Body Hierarchy for bowing / gestures
  const upperBody = new THREE.Group();
  upperBody.position.y = 0.2;

  // Robe Torso
  const robeGeo = new THREE.CylinderGeometry(0.38, 0.52, 0.95, 14);
  const robeMesh = new THREE.Mesh(robeGeo, robeMat);
  robeMesh.position.y = 0.48;
  robeMesh.castShadow = true;
  upperBody.add(robeMesh);

  // Waist Sash
  const sashGeo = new THREE.CylinderGeometry(0.42, 0.44, 0.16, 14);
  const sashMesh = new THREE.Mesh(sashGeo, sashMat);
  sashMesh.position.y = 0.45;
  upperBody.add(sashMesh);

  // Cute Head
  const headGeo = new THREE.SphereGeometry(0.38, 16, 16);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.position.y = 1.15;
  headMesh.castShadow = true;
  upperBody.add(headMesh);

  // Ears
  const earGeo = new THREE.SphereGeometry(0.09, 8, 8);
  const leftEar = new THREE.Mesh(earGeo, skinMat);
  leftEar.position.set(-0.38, 1.15, 0);
  upperBody.add(leftEar);

  const rightEar = new THREE.Mesh(earGeo, skinMat);
  rightEar.position.set(0.38, 1.15, 0);
  upperBody.add(rightEar);

  // Peaceful Closed Eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x451a03 });
  const eyeGeo = new THREE.BoxGeometry(0.08, 0.02, 0.02);
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.13, 1.17, 0.35);
  upperBody.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.13, 1.17, 0.35);
  upperBody.add(rightEye);

  // Gentle Smile
  const smile = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.02, 0.02), eyeMat);
  smile.position.set(0, 1.05, 0.36);
  upperBody.add(smile);

  // Hands pressed in Anjali prayer pose (双手合十)
  const handsGroup = new THREE.Group();
  handsGroup.position.set(0, 0.65, 0.32);

  const handMat = skinMat;
  const handGeo = new THREE.BoxGeometry(0.12, 0.22, 0.08);
  const handMesh = new THREE.Mesh(handGeo, handMat);
  handMesh.rotation.x = Math.PI / 8;
  handsGroup.add(handMesh);
  upperBody.add(handsGroup);

  // Bodhi Prayer Mala Beads around neck (胸前菩提念珠)
  const malaMat = new THREE.MeshStandardMaterial({
    color: 0x6e3c1b,
    roughness: 0.55,
    metalness: 0.05,
  });
  const malaGeo = new THREE.TorusGeometry(0.28, 0.035, 8, 20);
  const mala = new THREE.Mesh(malaGeo, malaMat);
  mala.rotation.x = Math.PI / 3;
  mala.position.set(0, 0.78, 0.12);
  upperBody.add(mala);

  // Halo if self
  if (isSelf) {
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const haloMesh = new THREE.Mesh(new THREE.RingGeometry(0.48, 0.56, 24), haloMat);
    haloMesh.position.set(0, 1.25, -0.05);
    upperBody.add(haloMesh);
  }

  monk.add(upperBody);

  // Animation handlers
  monk.updateWalkAnimation = (delta: number, isWalking: boolean) => {
    if (isWalking) {
      monk.walkCycle += delta * 9;
      // Footstep bobbing
      upperBody.position.y = 0.2 + Math.abs(Math.sin(monk.walkCycle)) * 0.08;
      // Waddle side to side
      upperBody.rotation.z = Math.sin(monk.walkCycle * 0.5) * 0.06;
      // Feet alternating
      leftFoot.position.z = Math.sin(monk.walkCycle) * 0.12 + 0.05;
      rightFoot.position.z = -Math.sin(monk.walkCycle) * 0.12 + 0.05;
      leftFoot.position.y = Math.max(0.09, 0.09 + Math.sin(monk.walkCycle) * 0.08);
      rightFoot.position.y = Math.max(0.09, 0.09 - Math.sin(monk.walkCycle) * 0.08);
    } else {
      // Idle breathing
      upperBody.position.y = 0.2 + Math.sin(Date.now() * 0.002) * 0.02;
      upperBody.rotation.z = 0;
      leftFoot.position.set(-0.2, 0.09, 0.05);
      rightFoot.position.set(0.2, 0.09, 0.05);
    }
  };

  monk.setBowingPose = (isBowing: boolean) => {
    upperBody.rotation.x = isBowing ? Math.PI / 6 : 0;
  };

  monk.setProstratingPose = (isProstrating: boolean) => {
    if (isProstrating) {
      upperBody.position.y = 0.05;
      upperBody.rotation.x = Math.PI / 2.5;
    } else {
      upperBody.rotation.x = 0;
      upperBody.position.y = 0.2;
    }
  };

  return monk;
}

/**
 * 场景一：大殿庭前 (Courtyard Scene)
 */
export function buildCourtyard3DEnvironment(): THREE.Group {
  const env = new THREE.Group();

  // Ground stone pavement
  const groundGeo = new THREE.PlaneGeometry(90, 90);
  const stoneMat = new THREE.MeshStandardMaterial({
    map: createStonePaverTexture(),
    roughness: 0.85,
    metalness: 0.05,
  });
  const ground = new THREE.Mesh(groundGeo, stoneMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.name = 'walkableGround';
  env.add(ground);

  // Grand Hall Exterior
  env.add(buildLingyinGrandHall());

  // Bronze Incense Burner in central plaza
  env.add(buildIncenseBurner());

  // Trees and lanterns
  env.add(buildAncientCamphorTree(-16, -4, 1.15));
  env.add(buildAncientCamphorTree(16, -4, 0.95));
  env.add(buildAncientCamphorTree(-20, 20, 1.0));
  env.add(buildAncientCamphorTree(22, 18, 1.05));

  // Courtyard side walls
  const wallMat = new THREE.MeshStandardMaterial({
    map: createYellowWallTexture(),
    roughness: 0.8,
  });
  const roofMat = new THREE.MeshStandardMaterial({
    map: createRoofTileTexture(),
    roughness: 0.6,
  });

  // West side corridor wall
  const westWall = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5, 40), wallMat);
  westWall.position.set(-35, 2.5, 12);
  env.add(westWall);
  const westRoof = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.2, 4), roofMat);
  westRoof.rotation.y = Math.PI / 4;
  westRoof.scale.set(1.0, 1.0, 20);
  westRoof.position.set(-35, 5.6, 12);
  env.add(westRoof);

  // East side corridor wall
  const eastWall = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5, 40), wallMat);
  eastWall.position.set(35, 2.5, 12);
  env.add(eastWall);
  const eastRoof = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.2, 4), roofMat);
  eastRoof.rotation.y = Math.PI / 4;
  eastRoof.scale.set(1.0, 1.0, 20);
  eastRoof.position.set(35, 5.6, 12);
  env.add(eastRoof);

  return env;
}

/**
 * 场景二：大雄宝殿室内 (Grand Hall Interior Scene)
 */
export function buildGrandHallInteriorEnvironment(): THREE.Group {
  const env = new THREE.Group();

  // Dark Polished Timber Floor
  const floorGeo = new THREE.PlaneGeometry(36, 36);
  const floorMat = new THREE.MeshStandardMaterial({
    map: createDarkWoodFloorTexture(),
    roughness: 0.45,
    metalness: 0.1,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  floor.name = 'walkableGround';
  env.add(floor);

  // Walls
  const wallMat = new THREE.MeshStandardMaterial({
    map: createYellowWallTexture(),
    roughness: 0.8,
  });
  const woodMat = new THREE.MeshStandardMaterial({
    map: createWoodTexture(),
    roughness: 0.65,
  });
  const goldMat = new THREE.MeshStandardMaterial({
    map: createGoldLeafTexture(),
    color: 0xffe8a8,
    roughness: 0.36,
    metalness: 0.72,
  });

  // Back Wall
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(32, 14, 1), wallMat);
  backWall.position.set(0, 7, -15);
  env.add(backWall);

  // Side Walls
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(1, 14, 30), wallMat);
  leftWall.position.set(-15, 7, 0);
  env.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(1, 14, 30), wallMat);
  rightWall.position.set(15, 7, 0);
  env.add(rightWall);

  // Wooden Columns in hall
  const pillarGeo = new THREE.CylinderGeometry(0.45, 0.5, 14, 12);
  [[-8, -8], [8, -8], [-8, 6], [8, 6]].forEach(([px, pz]) => {
    const p = new THREE.Mesh(pillarGeo, woodMat);
    p.position.set(px, 7, pz);
    p.castShadow = true;
    env.add(p);
  });

  // Roof Beams
  const beamGeo = new THREE.BoxGeometry(32, 0.8, 1);
  const beam1 = new THREE.Mesh(beamGeo, woodMat);
  beam1.position.set(0, 13.5, -8);
  env.add(beam1);
  const beam2 = new THREE.Mesh(beamGeo, woodMat);
  beam2.position.set(0, 13.5, 6);
  env.add(beam2);

  // Gilded Sakyamuni Buddha Statue (大殿正中释迦牟尼佛)
  const buddhaGroup = new THREE.Group();
  buddhaGroup.position.set(0, 0, -8);

  // Multi-tier Lotus Throne
  const lotusBase = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.8, 1.8, 20), woodMat);
  lotusBase.position.y = 0.9;
  buddhaGroup.add(lotusBase);

  const lotusPetals = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.0, 1.0, 20), goldMat);
  lotusPetals.position.y = 2.2;
  buddhaGroup.add(lotusPetals);

  // Buddha Body
  const buddhaLegs = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 3.0, 1.4, 20), goldMat);
  buddhaLegs.position.y = 3.3;
  buddhaGroup.add(buddhaLegs);

  const buddhaTorso = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.0, 3.2, 20), goldMat);
  buddhaTorso.position.y = 5.2;
  buddhaGroup.add(buddhaTorso);

  const buddhaHead = new THREE.Mesh(new THREE.SphereGeometry(1.2, 20, 20), goldMat);
  buddhaHead.position.y = 7.2;
  buddhaGroup.add(buddhaHead);

  const ushnisha = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 12), goldMat);
  ushnisha.position.y = 8.4;
  buddhaGroup.add(ushnisha);

  // Glowing Mandorla Halo
  const haloMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, side: THREE.DoubleSide });
  const halo = new THREE.Mesh(new THREE.CircleGeometry(3.5, 32), haloMat);
  halo.position.set(0, 6.8, -1.2);
  buddhaGroup.add(halo);

  // Warm Buddha Altar Light
  const buddhaLight = new THREE.PointLight(0xfef08a, 2.2, 22);
  buddhaLight.position.set(0, 6.5, 2);
  buddhaGroup.add(buddhaLight);

  env.add(buddhaGroup);

  // Two Attendant Statues (Ananda & Kasyapa / 阿难迦叶)
  [-4.5, 4.5].forEach(ax => {
    const attendant = new THREE.Group();
    attendant.position.set(ax, 0, -7.5);
    const attPedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, 1.2, 16), woodMat);
    attPedestal.position.y = 0.6;
    attendant.add(attPedestal);
    const attBody = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.9, 3.2, 16), goldMat);
    attBody.position.y = 2.8;
    attendant.add(attBody);
    const attHead = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 16), goldMat);
    attHead.position.y = 4.8;
    attendant.add(attHead);
    env.add(attendant);
  });

  // Altar Table with Offerings (供桌)
  const altarTable = new THREE.Mesh(new THREE.BoxGeometry(10, 1.4, 2.4), woodMat);
  altarTable.position.set(0, 0.7, -4.5);
  env.add(altarTable);

  // Red silk altar cloth
  const altarCloth = new THREE.Mesh(
    new THREE.BoxGeometry(9.6, 0.1, 2.2),
    new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6 })
  );
  altarCloth.position.set(0, 1.45, -4.5);
  env.add(altarCloth);

  // Candles on Altar
  const candleGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8);
  const candleMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 });
  [-3, 3].forEach(cx => {
    const candle = new THREE.Mesh(candleGeo, candleMat);
    candle.position.set(cx, 1.75, -4.5);
    env.add(candle);
    const cLight = new THREE.PointLight(0xf97316, 0.8, 6);
    cLight.position.set(cx, 2.1, -4.5);
    env.add(cLight);
  });

  // 3 Rows of Round Prayer Cushions (拜佛蒲团阵)
  const cushionMat = new THREE.MeshStandardMaterial({
    map: createWovenStrawTexture(),
    roughness: 0.75,
    metalness: 0.05,
  });
  const cushionGeo = new THREE.CylinderGeometry(0.65, 0.7, 0.22, 16);

  const rowZ = [-1.5, 2.5, 6.5];
  const colX = [-4.5, -1.5, 1.5, 4.5];

  rowZ.forEach(rz => {
    colX.forEach(cx => {
      const cushion = new THREE.Mesh(cushionGeo, cushionMat);
      cushion.position.set(cx, 0.11, rz);
      cushion.receiveShadow = true;
      env.add(cushion);
    });
  });

  return env;
}

/**
 * 场景三：冷泉听溪全景 (Cold Spring 3D Scene)
 */
export function buildColdSpring3DEnvironment(): THREE.Group {
  const env = new THREE.Group();

  // Natural Mossy Stone Ground
  const groundGeo = new THREE.PlaneGeometry(64, 64);
  const groundMat = new THREE.MeshStandardMaterial({
    map: createStonePaverTexture(),
    roughness: 0.85,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.name = 'walkableGround';
  env.add(ground);

  // Feilai Peak Limestone Cliffs (飞来峰石崖)
  const cliffMat = new THREE.MeshStandardMaterial({
    map: createRockCliffTexture(),
    roughness: 0.9,
  });

  for (let i = 0; i < 7; i++) {
    const cliff = new THREE.Mesh(new THREE.DodecahedronGeometry(4 + Math.random() * 2), cliffMat);
    cliff.position.set(-20 + (i % 3) * 3, 4 + Math.random() * 3, -16 + i * 5);
    cliff.scale.set(1.4, 2.2, 1.4);
    cliff.castShadow = true;
    env.add(cliff);
  }

  // Winding Cold Spring Stream (冷泉清溪)
  const waterGeo = new THREE.PlaneGeometry(8, 54);
  const waterMat = new THREE.MeshStandardMaterial({
    map: createWaterTexture(),
    roughness: 0.15,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
  });
  const stream = new THREE.Mesh(waterGeo, waterMat);
  stream.rotation.x = -Math.PI / 2;
  stream.position.set(-4, 0.04, 0);
  env.add(stream);

  // Stone Arched Bridge (冷泉石桥)
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.8 });
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.7, 3.6), stoneMat);
  bridge.position.set(-4, 0.45, 0);
  bridge.receiveShadow = true;
  env.add(bridge);

  // Bridge railings
  const rail1 = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.6, 0.2), stoneMat);
  rail1.position.set(-4, 1.0, 1.6);
  env.add(rail1);
  const rail2 = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.6, 0.2), stoneMat);
  rail2.position.set(-4, 1.0, -1.6);
  env.add(rail2);

  // Hexagonal Cold Spring Pavilion (冷泉亭)
  const pavBase = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.4, 0.8, 6), stoneMat);
  pavBase.position.set(10, 0.4, -4);
  env.add(pavBase);

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x6e2b1f, roughness: 0.7 });
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const px = 10 + Math.cos(angle) * 3.4;
    const pz = -4 + Math.sin(angle) * 3.4;
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 5.2, 8), woodMat);
    col.position.set(px, 3.2, pz);
    env.add(col);
  }

  const pavRoof = new THREE.Mesh(
    new THREE.ConeGeometry(5.4, 3.2, 6),
    new THREE.MeshStandardMaterial({ map: createRoofTileTexture(), roughness: 0.6 })
  );
  pavRoof.position.set(10, 7.0, -4);
  env.add(pavRoof);

  // Bamboo Groves (翠竹林)
  const bambooTrunkMat = new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.5 });
  const bambooLeafMat = new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.6 });

  for (let b = 0; b < 16; b++) {
    const bx = -14 + (b % 4) * 2 + Math.random() * 1.5;
    const bz = 8 + Math.floor(b / 4) * 3 + Math.random() * 1.5;
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 7, 6), bambooTrunkMat);
    stalk.position.set(bx, 3.5, bz);
    env.add(stalk);
    const clump = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8), bambooLeafMat);
    clump.position.set(bx, 6.8, bz);
    env.add(clump);
  }

  // Floating Water Lotus Lanterns (水上莲花灯)
  const lotusMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4 });
  [[-4, -6], [-3.5, 4], [-4.2, 12]].forEach(([lx, lz]) => {
    const lotus = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.15, 0.2, 8), lotusMat);
    lotus.position.set(lx, 0.15, lz);
    env.add(lotus);
  });

  return env;
}

/**
 * 场景四：灵隐钟楼高台 (Bell Tower 3D Scene)
 */
export function buildBellTower3DEnvironment(): THREE.Group {
  const env = new THREE.Group();

  // Mountain Stone Platform Terrace (钟楼观景石台)
  const groundGeo = new THREE.PlaneGeometry(42, 42);
  const stoneMat = new THREE.MeshStandardMaterial({
    map: createStonePaverTexture(),
    roughness: 0.8,
  });
  const ground = new THREE.Mesh(groundGeo, stoneMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.name = 'walkableGround';
  env.add(ground);

  // Stone Balustrade Parapet around edge (观景石栏杆)
  const balustradeMat = new THREE.MeshStandardMaterial({ color: 0x8a8479, roughness: 0.85 });
  const railGeoX = new THREE.BoxGeometry(36, 0.8, 0.3);
  const railFront = new THREE.Mesh(railGeoX, balustradeMat);
  railFront.position.set(0, 0.4, 18);
  env.add(railFront);
  const railBack = new THREE.Mesh(railGeoX, balustradeMat);
  railBack.position.set(0, 0.4, -18);
  env.add(railBack);

  const railGeoZ = new THREE.BoxGeometry(0.3, 0.8, 36);
  const railLeft = new THREE.Mesh(railGeoZ, balustradeMat);
  railLeft.position.set(-18, 0.4, 0);
  env.add(railLeft);
  const railRight = new THREE.Mesh(railGeoZ, balustradeMat);
  railRight.position.set(18, 0.4, 0);
  env.add(railRight);

  // Bell Tower Pavilion Structure
  const woodMat = new THREE.MeshStandardMaterial({ map: createWoodTexture(), roughness: 0.65 });
  const roofMat = new THREE.MeshStandardMaterial({ map: createRoofTileTexture(), roughness: 0.6 });
  const bronzeMat = new THREE.MeshStandardMaterial({
    map: createWeatheredBronzeTexture(),
    roughness: 0.52,
    metalness: 0.65,
  });

  // 4 Main Pillars
  const pillarGeo = new THREE.CylinderGeometry(0.4, 0.45, 9, 12);
  [[-4.5, -4.5], [4.5, -4.5], [-4.5, 4.5], [4.5, 4.5]].forEach(([px, pz]) => {
    const col = new THREE.Mesh(pillarGeo, woodMat);
    col.position.set(px, 4.5, pz);
    col.castShadow = true;
    env.add(col);
  });

  // Bell Tower Double Roof
  const roof = new THREE.Mesh(new THREE.ConeGeometry(8.5, 4.5, 4), roofMat);
  roof.rotation.y = Math.PI / 4;
  roof.position.y = 11;
  env.add(roof);

  // Giant Bronze Bell (灵隐古铜大钟)
  const bellGroup = new THREE.Group();
  bellGroup.position.set(0, 5.2, -1);

  const bellBody = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 2.2, 3.4, 24), bronzeMat);
  bellGroup.add(bellBody);
  const bellTop = new THREE.Mesh(new THREE.SphereGeometry(1.4, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), bronzeMat);
  bellTop.position.y = 1.7;
  bellGroup.add(bellTop);
  env.add(bellGroup);

  // Suspended Wooden Striker Log (撞钟木槌)
  const striker = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 3.4, 12), woodMat);
  striker.rotation.z = Math.PI / 2;
  striker.position.set(2.6, 4.6, -1);
  env.add(striker);

  // Hanging Paper Lanterns (暮色灯笼)
  const lanternMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xd97706,
    emissiveIntensity: 0.6,
  });
  [[-4.5, 7.5, -4.5], [4.5, 7.5, -4.5], [-4.5, 7.5, 4.5], [4.5, 7.5, 4.5]].forEach(([lx, ly, lz]) => {
    const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.7, 10), lanternMat);
    lantern.position.set(lx, ly, lz);
    env.add(lantern);
    const lLight = new THREE.PointLight(0xfef08a, 0.7, 8);
    lLight.position.set(lx, ly - 0.2, lz);
    env.add(lLight);
  });

  // Pines on the cliff
  env.add(buildAncientCamphorTree(-14, -12, 0.85));
  env.add(buildAncientCamphorTree(14, -12, 0.85));

  return env;
}

/**
 * 场景五：云林禅房静坐 (Zen Room 3D Scene)
 */
export function buildZenRoom3DEnvironment(): THREE.Group {
  const env = new THREE.Group();

  // Tatami straw reed flooring
  const floorGeo = new THREE.PlaneGeometry(28, 28);
  const floorMat = new THREE.MeshStandardMaterial({
    map: createTatamiTexture(),
    roughness: 0.6,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  floor.name = 'walkableGround';
  env.add(floor);

  // Wooden Walls & Screens
  const woodMat = new THREE.MeshStandardMaterial({
    map: createWoodTexture(),
    roughness: 0.7,
  });
  const paperMat = new THREE.MeshStandardMaterial({
    color: 0xfbf8ee,
    roughness: 0.8,
  });

  // Back Wall with Calligraphy
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(24, 8, 0.8), paperMat);
  backWall.position.set(0, 4, -10);
  env.add(backWall);

  // Wooden frame around back wall
  const backFrame = new THREE.Mesh(new THREE.BoxGeometry(24.4, 0.4, 1), woodMat);
  backFrame.position.set(0, 7.9, -10);
  env.add(backFrame);

  // Calligraphy Scroll hanging: "应无所住"
  const scrollBase = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 5.2, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.9 })
  );
  scrollBase.position.set(0, 4.4, -9.5);
  env.add(scrollBase);

  const scrollPaper = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 4.8, 0.12),
    new THREE.MeshStandardMaterial({ color: 0xf5eedb, roughness: 0.7 })
  );
  scrollPaper.position.set(0, 4.4, -9.48);
  env.add(scrollPaper);

  // Open Sliding Screen Window looking out to Bamboo Courtyard
  const leftWindow = new THREE.Mesh(new THREE.BoxGeometry(0.6, 6, 16), woodMat);
  leftWindow.position.set(-10, 3.5, 0);
  env.add(leftWindow);

  // Outside Window Bamboo plants
  const bambooTrunkMat = new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.5 });
  const bambooLeafMat = new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.6 });
  for (let i = 0; i < 6; i++) {
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 6, 6), bambooTrunkMat);
    stalk.position.set(-12, 3, -4 + i * 1.8);
    env.add(stalk);
    const leaf = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6), bambooLeafMat);
    leaf.position.set(-12, 5.8, -4 + i * 1.8);
    env.add(leaf);
  }

  // Central Meditation Platform & Cushion
  const platform = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 0.25, 4.2),
    new THREE.MeshStandardMaterial({ color: 0x44281d, roughness: 0.7 })
  );
  platform.position.set(0, 0.12, 0);
  env.add(platform);

  const cushion = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.85, 0.25, 20),
    new THREE.MeshStandardMaterial({
      map: createWovenStrawTexture(),
      roughness: 0.75,
      metalness: 0.05,
    })
  );
  cushion.position.set(0, 0.35, 0);
  env.add(cushion);

  // Zen Low Tea Table (禅茶桌 - 楠木材质)
  const table = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 1.4), woodMat);
  table.position.set(4.8, 0.25, 1);
  env.add(table);

  // Longquan celadon porcelain tea bowl (龙泉青瓷茶盏)
  const bowl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.1, 0.15, 16),
    new THREE.MeshStandardMaterial({
      color: 0x3d6b52,
      roughness: 0.15,
      metalness: 0.05,
    })
  );
  bowl.position.set(4.8, 0.58, 1);
  env.add(bowl);

  // Weathered bronze incense dish (熟铜香碟)
  const dish = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.16, 0.06, 16),
    new THREE.MeshStandardMaterial({
      map: createWeatheredBronzeTexture(),
      roughness: 0.52,
      metalness: 0.65,
    })
  );
  dish.position.set(4.2, 0.53, 1);
  env.add(dish);

  // Soft Indoor Room Lighting
  const roomLight = new THREE.PointLight(0xffedd5, 1.6, 18);
  roomLight.position.set(0, 6, 0);
  env.add(roomLight);

  return env;
}

/**
 * Build 3D Environment by Scene ID
 */
export function buildScene3DEnvironment(sceneId: string): THREE.Group {
  switch (sceneId) {
    case 'grand_hall':
      return buildGrandHallInteriorEnvironment();
    case 'cold_spring':
      return buildColdSpring3DEnvironment();
    case 'bell_tower':
      return buildBellTower3DEnvironment();
    case 'zen_room':
      return buildZenRoom3DEnvironment();
    case 'courtyard':
    default:
      return buildCourtyard3DEnvironment();
  }
}

