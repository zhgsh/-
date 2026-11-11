/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Sparkles, User } from 'lucide-react';
import { MonkAvatar } from '../lib/monkAvatars';
import { TempleSceneId } from './Temple3DScene';

interface HeaderBarProps {
  currentScene: TempleSceneId;
  onSceneChange: (scene: TempleSceneId) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSoundSettings: () => void;
  onOpenAvatarSettings: () => void;
  userMonk: MonkAvatar;
  onlineCount: number;
  meritCount: number;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentScene,
  onSceneChange,
  isMuted,
  onToggleMute,
  onOpenSoundSettings,
  onOpenAvatarSettings,
  userMonk,
  onlineCount,
  meritCount,
}) => {
  const scenes: { id: TempleSceneId; label: string }[] = [
    { id: 'courtyard', label: '大殿庭前' },
    { id: 'grand_hall', label: '大雄宝殿' },
    { id: 'cold_spring', label: '冷泉听溪' },
    { id: 'bell_tower', label: '灵隐钟楼' },
    { id: 'zen_room', label: '云林禅房' },
  ];

  return (
    <header className="relative z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-stone-900/75 backdrop-blur-md text-stone-100 border-b border-stone-800/80 select-none shadow-md">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button 
          onClick={() => onSceneChange('courtyard')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-amber-900/60 border border-amber-600/40 flex items-center justify-center text-amber-200 text-sm font-serif">
            梵
          </div>
          <span className="text-xl font-serif font-bold tracking-widest text-amber-100 group-hover:text-amber-200 transition-colors whitespace-nowrap">
            杭州灵隐寺
          </span>
        </button>
        <span className="hidden lg:inline text-xs text-stone-400 font-serif border-l border-stone-700/60 pl-3">
          云林禅境 · 3D 全景漫步
        </span>
      </div>

      {/* Zone 2: 5 clean navigation links for the 5 3D scenes */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-serif">
        {scenes.map((s) => {
          const isActive = currentScene === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSceneChange(s.id)}
              className={`relative py-1 transition-colors whitespace-nowrap shrink-0 text-sm cursor-pointer ${
                isActive
                  ? 'text-amber-200 font-semibold'
                  : 'text-stone-300 hover:text-stone-100'
              }`}
            >
              {s.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Online count, sound, and avatar widgets */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Online companions counter */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-300 bg-stone-800/60 px-3 py-1 rounded-full border border-stone-700/50">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
          <span className="tabular-nums font-mono">{onlineCount}</span>
          <span className="text-stone-400">位小沙弥共聚</span>
        </div>

        {/* Merit score indicator */}
        <div className="hidden xl:flex items-center gap-1 text-xs text-amber-200/90 bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-800/40">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>功德</span>
          <span className="font-mono tabular-nums font-semibold">{meritCount}</span>
        </div>

        {/* Ambient Sound Button */}
        <div className="flex items-center bg-stone-800/70 rounded-full border border-stone-700/60 p-0.5">
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? "静音中，点击开启梵音" : "正在播放梵音，点击静音"}
            className="p-1.5 text-stone-300 hover:text-amber-200 transition-colors cursor-pointer"
            title={isMuted ? "开启声音" : "静音"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-500" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
          </button>
          <button
            onClick={onOpenSoundSettings}
            className="text-[11px] px-2 py-1 text-stone-300 hover:text-amber-100 transition-colors border-l border-stone-700/50 cursor-pointer"
          >
            音景
          </button>
        </div>

        {/* Avatar profile trigger */}
        <button
          onClick={onOpenAvatarSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-serif text-amber-100 bg-stone-800/80 hover:bg-stone-700/80 border border-amber-600/30 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <User className="w-3.5 h-3.5 text-amber-400" />
          <span>小沙弥 · {userMonk.name}</span>
        </button>
      </div>
    </header>
  );
};
