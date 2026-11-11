/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Volume2, VolumeX, Check } from 'lucide-react';
import { templeAudio } from '../lib/templeAudio';

interface SoundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const SoundSettingsModal: React.FC<SoundSettingsModalProps> = ({
  isOpen,
  onClose,
  isMuted,
  onToggleMute,
}) => {
  const [currentTrack, setCurrentTrack] = useState<'stream' | 'chant' | 'wind'>('stream');

  const soundscapes = [
    {
      id: 'stream',
      name: '冷泉清流',
      desc: '飞来峰下冷泉潺潺流淌，洗涤尘嚣',
      icon: '🌊',
    },
    {
      id: 'chant',
      name: '灵隐梵呗',
      desc: '大雄宝殿庄严诵经共鸣，安宁抚慰',
      icon: '🕉️',
    },
    {
      id: 'wind',
      name: '古松清磬',
      desc: '山风拂过千年樟松，偶尔清磐微鸣',
      icon: '🍃',
    },
  ] as const;

  const handleSelectTrack = (trackId: 'stream' | 'chant' | 'wind') => {
    setCurrentTrack(trackId);
    if (!isMuted) {
      templeAudio.startAmbienceTrack(trackId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-sm bg-stone-900/95 border border-amber-900/40 rounded-3xl p-6 text-stone-100 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-serif font-bold text-amber-100">灵隐山水音景</h2>
              <p className="text-xs text-stone-400 font-serif">万籁此俱寂 · 但余钟磬音</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Mute switch */}
        <div className="my-4 p-3 bg-stone-800/60 rounded-xl border border-stone-700/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isMuted ? <VolumeX className="w-4 h-4 text-stone-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            <span className="text-xs font-serif text-stone-200">
              {isMuted ? "静音模式" : "音景播放中"}
            </span>
          </div>
          <button
            onClick={onToggleMute}
            className={`px-3 py-1 rounded-lg text-xs font-serif transition-colors ${
              isMuted
                ? 'bg-amber-700 text-stone-950 font-bold'
                : 'bg-stone-700 text-stone-300'
            }`}
          >
            {isMuted ? "开启声音" : "静音"}
          </button>
        </div>

        {/* Soundscapes Track list */}
        <div className="space-y-2 my-4">
          <span className="text-xs text-stone-400 font-serif block">
            切换环境自然音：
          </span>
          {soundscapes.map(track => {
            const isSelected = currentTrack === track.id;
            return (
              <button
                key={track.id}
                onClick={() => handleSelectTrack(track.id)}
                className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-amber-950/60 border-amber-600/60 text-amber-100'
                    : 'bg-stone-800/30 border-stone-700/30 text-stone-300 hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{track.icon}</span>
                  <div>
                    <h4 className="text-xs font-serif font-bold text-amber-200">
                      {track.name}
                    </h4>
                    <p className="text-[11px] text-stone-400 font-serif mt-0.5">
                      {track.desc}
                    </p>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-2 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-serif rounded-xl transition-colors"
        >
          确定
        </button>
      </div>
    </div>
  );
};
