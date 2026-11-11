/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  buildScene3DEnvironment,
  build3DMonkAvatar,
  MonkMeshGroup,
} from '../lib/temple3DBuilder';
import { MonkAvatar } from '../lib/monkAvatars';
import {
  stepTowardsTarget,
  calculateKeyboardMovement,
  getNearestHotspot,
  resolveCollisions,
  Hotspot3D,
  SCENE_CONFIGS,
  Scene3DConfig,
  Vec3,
} from '../lib/movement3D';
import { Compass, Footprints, Sparkles, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Eye } from 'lucide-react';

export type TempleSceneId = 'courtyard' | 'grand_hall' | 'cold_spring' | 'bell_tower' | 'zen_room';

interface Temple3DSceneProps {
  currentScene: TempleSceneId;
  userMonk: MonkAvatar;
  companions: MonkAvatar[];
  onOpenWoodenFish: () => void;
  onOpenPrayerBeads: () => void;
  onOpenIncense: () => void;
  onStrikeBell: () => void;
  onOpenFortune: () => void;
  onOpenWishes: () => void;
  onBow: () => void;
  onProstrate: () => void;
  bellRinging: boolean;
}

export const Temple3DScene: React.FC<Temple3DSceneProps> = ({
  currentScene,
  userMonk,
  companions,
  onOpenWoodenFish,
  onOpenPrayerBeads,
  onOpenIncense,
  onStrikeBell,
  onOpenFortune,
  onOpenWishes,
  onBow,
  onProstrate,
  bellRinging,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Active interactive proximity hotspot
  const [activeHotspot, setActiveHotspot] = useState<Hotspot3D | null>(null);
  const [cameraPreset, setCameraPreset] = useState<'follow' | 'feature' | 'aerial'>('follow');
  const [showTouchDpad, setShowTouchDpad] = useState<boolean>(false);

  // Scene configuration ref (updated dynamically when currentScene changes)
  const sceneConfigRef = useRef<Scene3DConfig>(SCENE_CONFIGS[currentScene] || SCENE_CONFIGS.courtyard);

  // Mutable refs for animation loop
  const playerPosRef = useRef<Vec3>({ ...sceneConfigRef.current.spawnPos });
  const playerTargetRef = useRef<Vec3 | null>(null);
  const playerAngleRef = useRef<number>(sceneConfigRef.current.spawnAngle);
  const isWalkingRef = useRef<boolean>(false);
  const cameraYawRef = useRef<number>(sceneConfigRef.current.cameraSettings.yaw);
  const cameraPitchRef = useRef<number>(sceneConfigRef.current.cameraSettings.pitch);
  const cameraDistRef = useRef<number>(sceneConfigRef.current.cameraSettings.dist);

  const keysRef = useRef<{ forward: boolean; backward: boolean; left: boolean; right: boolean }>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const isDraggingRef = useRef<boolean>(false);
  const prevPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // References to 3D scene elements
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const envContainerRef = useRef<THREE.Group | null>(null);
  const hotspotsContainerRef = useRef<THREE.Group | null>(null);
  const companionsContainerRef = useRef<THREE.Group | null>(null);
  const groundMeshRef = useRef<THREE.Mesh | null>(null);
  const userMonkMeshRef = useRef<MonkMeshGroup | null>(null);
  const clickMarkerMeshRef = useRef<THREE.Mesh | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);

  // Switch scene 3D models and spawn position
  const switchSceneEnvironment = useCallback((sceneId: TempleSceneId) => {
    const scene = sceneRef.current;
    if (!scene) return;

    const config = SCENE_CONFIGS[sceneId] || SCENE_CONFIGS.courtyard;
    sceneConfigRef.current = config;

    // 1. Atmosphere colors per scene
    const atmospheres: Record<TempleSceneId, { bg: number; fogDensity: number; sunIntensity: number; hemiIntensity: number }> = {
      courtyard: { bg: 0xd7d2c3, fogDensity: 0.012, sunIntensity: 1.4, hemiIntensity: 0.85 },
      grand_hall: { bg: 0x221a16, fogDensity: 0.015, sunIntensity: 0.6, hemiIntensity: 0.95 },
      cold_spring: { bg: 0xc8d6cd, fogDensity: 0.016, sunIntensity: 1.3, hemiIntensity: 0.9 },
      bell_tower: { bg: 0xb8bcc4, fogDensity: 0.014, sunIntensity: 1.35, hemiIntensity: 0.85 },
      zen_room: { bg: 0xded8cb, fogDensity: 0.018, sunIntensity: 0.5, hemiIntensity: 0.95 },
    };
    const atmo = atmospheres[sceneId] || atmospheres.courtyard;

    scene.background = new THREE.Color(atmo.bg);
    scene.fog = new THREE.FogExp2(atmo.bg, atmo.fogDensity);

    if (sunLightRef.current) sunLightRef.current.intensity = atmo.sunIntensity;
    if (hemiLightRef.current) hemiLightRef.current.intensity = atmo.hemiIntensity;

    // 2. Tear down previous environment
    if (envContainerRef.current) {
      scene.remove(envContainerRef.current);
      envContainerRef.current.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(m => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
    }

    // 3. Build new environment
    const newEnv = buildScene3DEnvironment(sceneId);
    scene.add(newEnv);
    envContainerRef.current = newEnv;

    // 4. Locate walkable ground mesh for raycasting
    let foundGround: THREE.Mesh | null = null;
    newEnv.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && child.name === 'walkableGround') {
        foundGround = child as THREE.Mesh;
      }
    });
    groundMeshRef.current = foundGround;

    // 5. Reset player position to scene spawn
    playerPosRef.current = { ...config.spawnPos };
    playerTargetRef.current = null;
    playerAngleRef.current = config.spawnAngle;
    isWalkingRef.current = false;
    setActiveHotspot(null);

    // Apply default camera settings
    cameraYawRef.current = config.cameraSettings.yaw;
    cameraPitchRef.current = config.cameraSettings.pitch;
    cameraDistRef.current = config.cameraSettings.dist;
    setCameraPreset('follow');

    // 6. Rebuild Hotspot Markers
    if (hotspotsContainerRef.current) {
      scene.remove(hotspotsContainerRef.current);
      hotspotsContainerRef.current.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
        }
      });
    }

    const hotspotsGroup = new THREE.Group();
    config.hotspots.forEach(h => {
      const ringMat = new THREE.MeshBasicMaterial({
        color: h.id.includes('buddha') ? 0xf59e0b : h.id.includes('incense') ? 0xf97316 : 0x10b981,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(new THREE.RingGeometry(h.radius * 0.75, h.radius * 0.9, 32), ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(h.position.x, 0.05, h.position.z);
      hotspotsGroup.add(ring);
    });
    scene.add(hotspotsGroup);
    hotspotsContainerRef.current = hotspotsGroup;

    // 7. Rebuild Companion Monks for this Scene
    if (companionsContainerRef.current) {
      scene.remove(companionsContainerRef.current);
      companionsContainerRef.current.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
        }
      });
    }

    const compGroup = new THREE.Group();
    const sceneCompanionSpots: Record<TempleSceneId, { x: number; z: number; angle: number; posture?: string }[]> = {
      courtyard: [
        { x: -14, z: 2, angle: 0.5 },
        { x: 18, z: 4, angle: -1.2 },
        { x: -8, z: 18, angle: 1.8 },
        { x: 6, z: 12, angle: 0 },
      ],
      grand_hall: [
        { x: -4.5, z: 2.5, angle: 0, posture: 'prostrating' },
        { x: 1.5, z: 2.5, angle: 0, posture: 'prostrating' },
        { x: 4.5, z: 6.5, angle: 0, posture: 'meditating' },
        { x: -1.5, z: 6.5, angle: 0, posture: 'meditating' },
      ],
      cold_spring: [
        { x: 10, z: -4, angle: 2.2, posture: 'meditating' },
        { x: -4, z: 6, angle: -1.4 },
        { x: 4, z: 4, angle: 0.8 },
        { x: -8, z: 14, angle: 0.2 },
      ],
      bell_tower: [
        { x: -6, z: 4, angle: 0.8 },
        { x: 6, z: 4, angle: -0.8 },
        { x: -8, z: -4, angle: 1.2 },
        { x: 8, z: -4, angle: -1.2 },
      ],
      zen_room: [
        { x: -4, z: -2, angle: 1.57, posture: 'meditating' },
        { x: 4, z: -2, angle: -1.57, posture: 'meditating' },
        { x: -4, z: 3, angle: 1.57, posture: 'meditating' },
        { x: 4, z: 3, angle: -1.57, posture: 'meditating' },
      ],
    };

    const spots = sceneCompanionSpots[sceneId] || sceneCompanionSpots.courtyard;
    companions.slice(0, 4).forEach((comp, idx) => {
      const spot = spots[idx] || { x: 4, z: 4, angle: 0 };
      const compMesh = build3DMonkAvatar(comp.robeColor, comp.sashColor, false);
      compMesh.position.set(spot.x, 0, spot.z);
      compMesh.rotation.y = spot.angle;
      if (spot.posture === 'prostrating') {
        compMesh.setProstratingPose(true);
      } else if (spot.posture === 'meditating') {
        compMesh.setProstratingPose(false);
      }
      compGroup.add(compMesh);
    });
    scene.add(compGroup);
    companionsContainerRef.current = compGroup;
  }, [companions]);

  // Main 3D WebGL Canvas Setup
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Detect Software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 200);
    camera.position.set(0, 7, 24);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xfff8ee, 0x8a9296, 0.85);
    hemiLight.position.set(0, 30, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.4);
    sunLight.position.set(20, 35, 15);
    sunLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 0.5;
      sunLight.shadow.camera.far = 100;
      sunLight.shadow.camera.left = -30;
      sunLight.shadow.camera.right = 30;
      sunLight.shadow.camera.top = 30;
      sunLight.shadow.camera.bottom = -30;
      sunLight.shadow.bias = -0.0005;
    }
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // 4. Click Target Marker Ripple
    const markerMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    const clickMarker = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.5, 24), markerMat);
    clickMarker.rotation.x = -Math.PI / 2;
    clickMarker.position.y = 0.05;
    scene.add(clickMarker);
    clickMarkerMeshRef.current = clickMarker;

    // 5. Build User 3D Little Monk Avatar
    const userMonkMesh = build3DMonkAvatar(userMonk.robeColor, userMonk.sashColor, true);
    userMonkMesh.position.set(playerPosRef.current.x, 0, playerPosRef.current.z);
    scene.add(userMonkMesh);
    userMonkMeshRef.current = userMonkMesh;

    // 6. Mount Initial Environment for currentScene
    switchSceneEnvironment(currentScene);

    // 7. Raycasting & Click-to-Move
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevPointerRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - prevPointerRef.current.x;
      const dy = e.clientY - prevPointerRef.current.y;
      prevPointerRef.current = { x: e.clientX, y: e.clientY };

      // Orbit camera around player
      cameraYawRef.current -= dx * 0.006;
      cameraPitchRef.current = Math.max(0.12, Math.min(1.25, cameraPitchRef.current + dy * 0.005));
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      // Check intersect against walkable ground or fallback plane
      const targets = groundMeshRef.current ? [groundMeshRef.current] : scene.children;
      const intersects = raycaster.intersectObjects(targets, true);

      if (intersects.length > 0) {
        const point = intersects[0].point;
        const bounds = sceneConfigRef.current.bounds;
        const colliders = sceneConfigRef.current.colliders;
        const playerRadius = sceneConfigRef.current.playerRadius;

        // Ensure clicked destination resolves outside obstacles
        const safeTarget = resolveCollisions(
          { x: point.x, y: 0, z: point.z },
          colliders,
          playerRadius,
          bounds
        );

        playerTargetRef.current = safeTarget;

        // Animate click marker ripple at safe location
        clickMarker.position.set(safeTarget.x, 0.06, safeTarget.z);
        clickMarker.scale.set(1, 1, 1);
        (clickMarker.material as THREE.MeshBasicMaterial).opacity = 0.85;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraDistRef.current = Math.max(4.5, Math.min(24, cameraDistRef.current + e.deltaY * 0.012));
    };

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['KeyW', 'ArrowUp'].includes(e.code)) keysRef.current.forward = true;
      if (['KeyS', 'ArrowDown'].includes(e.code)) keysRef.current.backward = true;
      if (['KeyA', 'ArrowLeft'].includes(e.code)) keysRef.current.left = true;
      if (['KeyD', 'ArrowRight'].includes(e.code)) keysRef.current.right = true;
      if (e.code === 'KeyE' && activeHotspot) {
        triggerHotspotAction(activeHotspot.id);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['KeyW', 'ArrowUp'].includes(e.code)) keysRef.current.forward = false;
      if (['KeyS', 'ArrowDown'].includes(e.code)) keysRef.current.backward = false;
      if (['KeyA', 'ArrowLeft'].includes(e.code)) keysRef.current.left = false;
      if (['KeyD', 'ArrowRight'].includes(e.code)) keysRef.current.right = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    dom.addEventListener('click', handleCanvasClick);
    dom.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let frameId = 0;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 60);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    let lastHotspotCheck = 0;

    function tick() {
      const now = performance.now();
      const delta = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      const bounds = sceneConfigRef.current.bounds;
      const colliders = sceneConfigRef.current.colliders;
      const playerRadius = sceneConfigRef.current.playerRadius;
      const currentPos = playerPosRef.current;
      const keys = keysRef.current;
      const keyboard = calculateKeyboardMovement(
        keys,
        cameraYawRef.current,
        7.5,
        delta,
        bounds,
        currentPos,
        colliders,
        playerRadius
      );

      // 1. Movement logic with anti-clipping
      if (keyboard.isMoving) {
        playerTargetRef.current = null;
        currentPos.x = keyboard.nextPos.x;
        currentPos.z = keyboard.nextPos.z;
        playerAngleRef.current = keyboard.angle;
        isWalkingRef.current = true;
      } else if (playerTargetRef.current) {
        const step = stepTowardsTarget(
          currentPos,
          playerTargetRef.current,
          7.5,
          delta,
          bounds,
          colliders,
          playerRadius
        );
        currentPos.x = step.position.x;
        currentPos.z = step.position.z;
        playerAngleRef.current = step.angle;
        isWalkingRef.current = !step.isArrived;
        if (step.isArrived) {
          playerTargetRef.current = null;
        }
      } else {
        isWalkingRef.current = false;
      }

      // 2. Animate User Monk Mesh
      if (userMonkMeshRef.current) {
        const mesh = userMonkMeshRef.current;
        mesh.position.set(currentPos.x, currentPos.y, currentPos.z);
        mesh.rotation.y = THREE.MathUtils.damp(mesh.rotation.y, playerAngleRef.current, 12, delta);
        mesh.updateWalkAnimation(delta, isWalkingRef.current);
      }

      // 3. Fade and Expand Click Marker
      if (clickMarkerMeshRef.current) {
        const mat = clickMarkerMeshRef.current.material as THREE.MeshBasicMaterial;
        if (mat.opacity > 0) {
          mat.opacity = Math.max(0, mat.opacity - delta * 1.8);
          clickMarkerMeshRef.current.scale.multiplyScalar(1 + delta * 0.8);
        }
      }

      // 4. Update Camera Position (Third-person follow)
      const cy = cameraYawRef.current;
      const cp = cameraPitchRef.current;
      const dist = cameraDistRef.current;

      const camTargetX = currentPos.x;
      const camTargetY = currentPos.y + 1.2;
      const camTargetZ = currentPos.z;

      const camX = camTargetX + Math.sin(cy) * Math.cos(cp) * dist;
      const camY = camTargetY + Math.sin(cp) * dist;
      const camZ = camTargetZ + Math.cos(cy) * Math.cos(cp) * dist;

      camera.position.x = THREE.MathUtils.damp(camera.position.x, camX, 8, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, camY, 8, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, camZ, 8, delta);
      camera.lookAt(camTargetX, camTargetY, camTargetZ);

      // 5. Throttled Hotspot Proximity Check (Every 120ms)
      if (now - lastHotspotCheck > 120) {
        lastHotspotCheck = now;
        const nearest = getNearestHotspot(currentPos, sceneConfigRef.current.hotspots);
        setActiveHotspot(nearest);
      }

      // Render Scene
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      dom.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      dom.removeEventListener('click', handleCanvasClick);
      dom.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, []);

  // Handle scene change while staying in 3D canvas
  useEffect(() => {
    if (sceneRef.current) {
      switchSceneEnvironment(currentScene);
    }
  }, [currentScene, switchSceneEnvironment]);

  // Update monk posture when user bows or prostrates
  useEffect(() => {
    if (userMonkMeshRef.current) {
      userMonkMeshRef.current.setBowingPose(userMonk.posture === 'bowing');
      userMonkMeshRef.current.setProstratingPose(userMonk.posture === 'prostrating');
    }
  }, [userMonk.posture]);

  const triggerHotspotAction = (hotspotId: string) => {
    switch (hotspotId) {
      case 'buddha_altar':
        onProstrate();
        onOpenPrayerBeads();
        break;
      case 'prayer_beads_station':
        onOpenPrayerBeads();
        break;
      case 'incense_burner':
        onOpenIncense();
        break;
      case 'bell_tower':
        onStrikeBell();
        break;
      case 'cold_spring_stream':
        onOpenWishes();
        break;
      case 'cold_spring_pavilion':
        onOpenWoodenFish();
        break;
      case 'camphor_tree':
        onOpenWishes();
        break;
      case 'zen_meditation_mat':
        onOpenWoodenFish();
        break;
      case 'tea_table':
        onOpenFortune();
        break;
      default:
        onOpenWoodenFish();
        break;
    }
  };

  const handleCameraPreset = (preset: 'follow' | 'feature' | 'aerial') => {
    setCameraPreset(preset);
    const cfg = sceneConfigRef.current;
    if (preset === 'follow') {
      cameraYawRef.current = cfg.cameraSettings.yaw;
      cameraPitchRef.current = cfg.cameraSettings.pitch;
      cameraDistRef.current = cfg.cameraSettings.dist;
    } else if (preset === 'feature') {
      // Look directly towards central focal point
      cameraYawRef.current = Math.PI;
      cameraPitchRef.current = 0.22;
      cameraDistRef.current = cfg.cameraSettings.dist * 1.25;
    } else if (preset === 'aerial') {
      // High bird's eye view
      cameraPitchRef.current = 1.1;
      cameraDistRef.current = Math.min(22, cfg.cameraSettings.dist * 2.2);
    }
  };

  const currentConfig = SCENE_CONFIGS[currentScene] || SCENE_CONFIGS.courtyard;

  return (
    <div className="relative w-full h-[calc(100vh-65px)] min-h-[540px] bg-[#1c1b18] overflow-hidden select-none">
      {/* 1. WebGL Three.js Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 2. Top-Left Scene View Indicators & Camera Angles */}
      <div className="absolute top-4 left-6 z-20 pointer-events-auto flex items-center gap-2">
        <div className="bg-stone-900/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-600/30 shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-xs font-serif text-amber-100 font-semibold tracking-wider">
            {currentConfig.name}
          </span>
          <span className="text-[10px] text-amber-300/80 border-l border-stone-700 pl-2 font-mono">
            3D 漫步
          </span>
        </div>

        {/* Camera Views Quick Switch */}
        <div className="hidden sm:flex items-center gap-1 bg-stone-900/80 backdrop-blur-md p-1 rounded-full border border-stone-700/60 text-[11px] font-serif">
          {[
            { id: 'follow', label: '跟随' },
            { id: 'feature', label: '主景' },
            { id: 'aerial', label: '全景' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => handleCameraPreset(p.id as any)}
              className={`px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                cameraPreset === p.id
                  ? 'bg-amber-800 text-amber-100 font-bold'
                  : 'text-stone-300 hover:text-stone-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Top-Right Walking Controls Help & Mobile D-pad Toggle */}
      <div className="absolute top-4 right-6 z-20 pointer-events-auto flex items-center gap-2">
        <button
          onClick={() => setShowTouchDpad(!showTouchDpad)}
          className={`px-3 py-1.5 rounded-full text-xs font-serif backdrop-blur-md border transition-colors flex items-center gap-1.5 cursor-pointer ${
            showTouchDpad
              ? 'bg-amber-900/80 border-amber-600 text-amber-100'
              : 'bg-stone-900/70 border-stone-700/60 text-stone-300 hover:text-stone-100'
          }`}
          title="开启虚拟方向摇杆"
        >
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>方向键</span>
        </button>

        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-serif bg-stone-900/70 border border-stone-700/50 text-stone-300">
          <Footprints className="w-3.5 h-3.5 text-amber-400" />
          <span>点击地面寻路 / WASD 移动 / 拖拽旋转视角</span>
        </div>
      </div>

      {/* 4. Interactive Hotspot Notification Pill (When Monk is Near a Spot) */}
      {activeHotspot && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="px-5 py-2.5 rounded-2xl bg-amber-950/90 backdrop-blur-md border border-amber-500/60 shadow-2xl flex items-center gap-3 text-stone-100">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-left font-serif">
              <span className="text-[11px] text-stone-300 block">已至 · {activeHotspot.name}</span>
              <span className="text-xs font-bold text-amber-200">
                可进行：{activeHotspot.actionName}
              </span>
            </div>
            <button
              onClick={() => triggerHotspotAction(activeHotspot.id)}
              className="ml-2 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-serif font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              立刻参与
            </button>
          </div>
        </div>
      )}

      {/* 5. Mobile Virtual D-Pad (Touch Direction Buttons) */}
      {showTouchDpad && (
        <div className="absolute bottom-24 right-6 z-30 pointer-events-auto bg-stone-900/85 backdrop-blur-md p-2 rounded-2xl border border-stone-700/60 shadow-2xl flex flex-col items-center gap-1 select-none">
          <button
            onPointerDown={() => { keysRef.current.forward = true; }}
            onPointerUp={() => { keysRef.current.forward = false; }}
            className="w-10 h-10 rounded-xl bg-stone-800 active:bg-amber-700 flex items-center justify-center text-stone-200 cursor-pointer"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1">
            <button
              onPointerDown={() => { keysRef.current.left = true; }}
              onPointerUp={() => { keysRef.current.left = false; }}
              className="w-10 h-10 rounded-xl bg-stone-800 active:bg-amber-700 flex items-center justify-center text-stone-200 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onPointerDown={() => { keysRef.current.backward = true; }}
              onPointerUp={() => { keysRef.current.backward = false; }}
              className="w-10 h-10 rounded-xl bg-stone-800 active:bg-amber-700 flex items-center justify-center text-stone-200 cursor-pointer"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
            <button
              onPointerDown={() => { keysRef.current.right = true; }}
              onPointerUp={() => { keysRef.current.right = false; }}
              className="w-10 h-10 rounded-xl bg-stone-800 active:bg-amber-700 flex items-center justify-center text-stone-200 cursor-pointer"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
