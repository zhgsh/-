/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MonkAvatar } from '../lib/monkAvatars';
import { MonkFigure } from './MonkFigure';
import { templeAudio } from '../lib/templeAudio';
import { Bell, Flame, Wind, Eye } from 'lucide-react';

interface TempleCanvasProps {
  scene: 'courtyard' | 'grand_hall' | 'cold_spring' | 'bell_tower' | 'zen_room';
  userMonk: MonkAvatar;
  companions: MonkAvatar[];
  onMoveUser: (x: number, y: number) => void;
  onStrikeBell: () => void;
  onOpenIncense: () => void;
  onOpenWishes: () => void;
  onOpenWoodenFish: () => void;
  onOpenPrayerBeads: () => void;
  bellRinging: boolean;
}

export const TempleCanvas: React.FC<TempleCanvasProps> = ({
  scene,
  userMonk,
  companions,
  onMoveUser,
  onStrikeBell,
  onOpenIncense,
  onOpenWishes,
  onOpenWoodenFish,
  onOpenPrayerBeads,
  bellRinging,
}) => {
  const [clickWave, setClickWave] = useState<{ x: number; y: number } | null>(null);

  // Background image mapping
  const sceneImages: Record<string, string> = {
    courtyard: "/src/assets/images/lingyin_temple_grand_hall_1794297858042.jpg",
    grand_hall: "/src/assets/images/lingyin_buddha_altar_1794297859865.jpg",
    cold_spring: "/src/assets/images/lingyin_cold_spring_pavilion_1794297859363.jpg",
    bell_tower: "/src/assets/images/lingyin_bell_tower_dusk_1794297859893.jpg",
    zen_room: "/src/assets/images/lingyin_buddha_altar_1794297859865.jpg",
  };

  const currentBg = sceneImages[scene] || sceneImages.courtyard;

  const handleGroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only handle direct clicks or clicks on the container, not on child buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.max(10, Math.min(90, ((e.clientX - rect.left) / rect.width) * 100));
    // Clamp walking Y coordinates to safe ground walking zones
    const yPct = Math.max(55, Math.min(88, ((e.clientY - rect.top) / rect.height) * 100));

    setClickWave({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setTimeout(() => setClickWave(null), 800);

    onMoveUser(xPct, yPct);
  };

  // Filter companions belonging to this scene
  const sceneCompanions = companions.filter(c => {
    if (scene === 'courtyard') return c.scene === 'courtyard';
    if (scene === 'cold_spring') return c.scene === 'cold_spring';
    if (scene === 'grand_hall') return c.scene === 'grand_hall';
    if (scene === 'bell_tower') return c.scene === 'bell_tower';
    return true;
  });

  return (
    <div
      onClick={handleGroundClick}
      className={`relative w-full h-[calc(100vh-65px)] min-h-[540px] bg-stone-950 overflow-hidden select-none cursor-pointer transition-transform duration-500 ${
        bellRinging ? 'animate-pulse' : ''
      }`}
    >
      {/* Background Image with graceful fallback */}
      <img
        src={currentBg}
        alt={`灵隐寺景观 - ${scene}`}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 contrast-[1.03] transition-all duration-700 pointer-events-none"
      />

      {/* Atmospheric Vignette & Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-stone-950/30 pointer-events-none" />

      {/* Bell vibration ripple if bell is ringing */}
      {bellRinging && (
        <div className="absolute inset-0 bg-amber-400/10 pointer-events-none animate-ping" />
      )}

      {/* Click ripple animation on ground */}
      {clickWave && (
        <div
          style={{ left: clickWave.x, top: clickWave.y }}
          className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-amber-300/80 animate-ping pointer-events-none"
        />
      )}

      {/* Scene Spot Title Badge */}
      <div className="absolute top-5 left-6 z-20 pointer-events-none">
        <div className="bg-stone-900/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stone-700/60 shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-serif text-amber-100 font-semibold tracking-wider">
            {scene === 'courtyard' && '大殿庭前 · 香云缭绕'}
            {scene === 'grand_hall' && '大雄宝殿 · 瞻仰世尊'}
            {scene === 'cold_spring' && '冷泉溪畔 · 飞来听泉'}
            {scene === 'bell_tower' && '灵隐晓钟 · 晨暮长鸣'}
            {scene === 'zen_room' && '云林禅房 · 净坐调息'}
          </span>
        </div>
      </div>

      {/* Interactive Spots in Scene */}
      {scene === 'courtyard' && (
        <>
          {/* Incense Burner Hotspot */}
          <div className="absolute top-[52%] left-[58%] -translate-x-1/2 z-10 flex flex-col items-center">
            {/* Animated smoke */}
            <div className="w-1 h-20 bg-gradient-to-t from-stone-400/40 to-transparent blur-xs animate-smoke pointer-events-none" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenIncense();
              }}
              className="mt-1 px-3 py-1 bg-stone-900/80 backdrop-blur-md hover:bg-amber-900/80 text-amber-200 border border-amber-700/50 rounded-full text-[11px] font-serif shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <Flame className="w-3 h-3 text-orange-400" />
              <span>敬奉清香</span>
            </button>
          </div>

          {/* Camphor Tree Wishes Hotspot */}
          <div className="absolute top-[48%] left-[24%] -translate-x-1/2 z-10 flex flex-col items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenWishes();
              }}
              className="px-3 py-1 bg-stone-900/80 backdrop-blur-md hover:bg-rose-950/80 text-rose-200 border border-rose-700/50 rounded-full text-[11px] font-serif shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <span className="text-xs">🎋</span>
              <span>系祈愿红丝带</span>
            </button>
          </div>
        </>
      )}

      {scene === 'grand_hall' && (
        <>
          {/* Main Buddha Altar Prayer Cushion */}
          <div className="absolute top-[68%] left-[50%] -translate-x-1/2 z-10 flex flex-col items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPrayerBeads();
              }}
              className="px-3.5 py-1.5 bg-stone-900/80 backdrop-blur-md hover:bg-amber-900/90 text-amber-200 border border-amber-600/60 rounded-full text-xs font-serif shadow-xl flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <span>📿</span>
              <span>佛前拨转百八念珠</span>
            </button>
          </div>
        </>
      )}

      {scene === 'cold_spring' && (
        <>
          {/* Cold spring water lantern hotspot */}
          <div className="absolute top-[65%] left-[45%] -translate-x-1/2 z-10 flex flex-col items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenWishes();
              }}
              className="px-3 py-1 bg-stone-900/80 backdrop-blur-md hover:bg-amber-950/80 text-amber-200 border border-amber-700/50 rounded-full text-[11px] font-serif shadow-lg flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <span>🪷</span>
              <span>放水上莲花灯</span>
            </button>
          </div>
        </>
      )}

      {scene === 'bell_tower' && (
        <>
          {/* Bell Strike Striker Hotspot */}
          <div className="absolute top-[48%] left-[68%] -translate-x-1/2 z-10 flex flex-col items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStrikeBell();
              }}
              className={`px-4 py-2 bg-stone-900/85 backdrop-blur-md hover:bg-amber-800/90 text-amber-100 border border-amber-500/60 rounded-full text-xs font-serif shadow-2xl flex items-center gap-2 transition-transform ${
                bellRinging ? 'scale-110 shadow-amber-500/50' : 'hover:scale-105'
              }`}
            >
              <Bell className="w-4 h-4 text-amber-300 fill-current" />
              <span>挥木撞响古钟</span>
            </button>
          </div>
        </>
      )}

      {/* Online Companion Monks */}
      {sceneCompanions.map((comp) => (
        <div
          key={comp.id}
          style={{
            left: `${comp.x}%`,
            top: `${comp.y}%`,
          }}
          className="absolute -translate-x-1/2 -translate-y-full z-15 pointer-events-auto"
        >
          <MonkFigure
            name={comp.name}
            isSelf={false}
            robeColor={comp.robeColor}
            sashColor={comp.sashColor}
            posture={comp.posture}
            statusText={comp.statusText}
          />
        </div>
      ))}

      {/* User Little Monk Avatar */}
      <div
        style={{
          left: `${userMonk.x}%`,
          top: `${userMonk.y}%`,
        }}
        className="absolute -translate-x-1/2 -translate-y-full z-20 pointer-events-auto transition-all duration-700 ease-out"
      >
        <MonkFigure
          name={userMonk.name}
          isSelf={true}
          robeColor={userMonk.robeColor}
          sashColor={userMonk.sashColor}
          posture={userMonk.posture}
          statusText={userMonk.statusText}
        />
      </div>

      {/* Quiet Hint at Bottom of Canvas */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 pointer-events-none text-center z-20">
        <div className="text-xs font-serif text-amber-100/90 bg-stone-900/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-stone-700/60 shadow-lg flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>轻触地面漫步 · 共聚灵隐净土</span>
        </div>
      </div>
    </div>
  );
};
