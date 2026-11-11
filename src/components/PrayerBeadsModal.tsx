/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, RotateCcw, Award } from 'lucide-react';
import { advanceBead, getBeadProgressPercent, isMilestoneBead, getQuoteForBead } from '../lib/prayerBeads';
import { templeAudio } from '../lib/templeAudio';

interface PrayerBeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMerit: (amount?: number) => void;
}

export const PrayerBeadsModal: React.FC<PrayerBeadsModalProps> = ({
  isOpen,
  onClose,
  onAddMerit,
}) => {
  const [currentBead, setCurrentBead] = useState<number>(1);
  const [completedLaps, setCompletedLaps] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  const handleNextBead = () => {
    templeAudio.playBeadClick();
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 200);

    const result = advanceBead(currentBead, completedLaps);
    setCurrentBead(result.nextBead);
    setCompletedLaps(result.nextLaps);

    if (result.isFullLap) {
      templeAudio.playSingingBowl();
      onAddMerit(10);
    } else if (isMilestoneBead(result.nextBead)) {
      templeAudio.playSingingBowl();
      onAddMerit(2);
    } else {
      onAddMerit(1);
    }
  };

  const handleReset = () => {
    setCurrentBead(1);
  };

  if (!isOpen) return null;

  const currentQuote = getQuoteForBead(currentBead);
  const progressPercent = getBeadProgressPercent(currentBead);

  // Generate a ring of beads for visual depiction
  // We render 18 visible beads on a circle arc to represent the rolling beads
  const visibleBeadIndices = Array.from({ length: 18 }, (_, i) => {
    let index = (currentBead - 9 + i);
    while (index < 1) index += 108;
    while (index > 108) index -= 108;
    return index;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg bg-stone-900/95 border border-amber-900/40 rounded-3xl p-6 text-stone-100 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-32 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📿</span>
            <div>
              <h2 className="text-lg font-serif font-bold text-amber-100">灵隐百八念珠</h2>
              <p className="text-xs text-stone-400 font-serif">拨动一珠 · 断除一惑</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Counter and Laps */}
        <div className="flex items-center justify-between my-4 px-3 py-2 bg-stone-800/60 rounded-xl border border-stone-700/40">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-stone-400 font-serif">当前佛珠</span>
            <span className="text-2xl font-mono font-bold text-amber-300 tabular-nums">
              {currentBead}
            </span>
            <span className="text-xs text-stone-500 font-mono">/ 108</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-stone-400 font-serif block">圆满周目</span>
              <span className="text-sm font-mono font-semibold text-amber-200 tabular-nums">
                {completedLaps} 周
              </span>
            </div>
            <button
              onClick={handleReset}
              title="重置从第一颗开始"
              className="p-1.5 text-stone-400 hover:text-stone-200 hover:bg-stone-700/50 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bead Rolling Canvas & Interactive Wheel */}
        <div className="relative flex flex-col items-center justify-center py-6">
          {/* Circular Bead Wheel graphic */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Outer golden aura */}
            <div className="absolute inset-4 rounded-full border border-amber-600/20 animate-pulse pointer-events-none" />

            {/* Circular beads container */}
            <div className={`relative w-56 h-56 transition-transform duration-300 ease-out ${isRotating ? 'rotate-6' : 'rotate-0'}`}>
              {visibleBeadIndices.map((bIndex, i) => {
                const angle = (i / 18) * 2 * Math.PI;
                const radius = 95; // px from center
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const isCenter = bIndex === currentBead;
                const isMilestone = isMilestoneBead(bIndex);

                return (
                  <div
                    key={`${bIndex}-${i}`}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      left: 'calc(50% - 14px)',
                      top: 'calc(50% - 14px)',
                    }}
                    className={`absolute w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                      isCenter
                        ? 'bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 border-2 border-amber-300 scale-125 z-10'
                        : isMilestone
                        ? 'bg-gradient-to-br from-red-600 via-amber-800 to-stone-900 border border-red-400/80'
                        : 'bg-gradient-to-br from-[#8a5d3b] via-[#5c371d] to-[#381f0d] border border-[#a87449]/40'
                    }`}
                  >
                    <span className={`text-[10px] font-mono ${isCenter ? 'text-stone-950 font-bold' : 'text-stone-300'}`}>
                      {bIndex}
                    </span>
                  </div>
                );
              })}

              {/* Central tassel ornament */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-stone-950/80 border border-amber-700/50 flex flex-col items-center justify-center text-center p-1">
                  <span className="text-xs font-serif text-amber-200">灵隐</span>
                  <span className="text-[10px] text-stone-400 font-mono">108</span>
                </div>
              </div>
            </div>
          </div>

          {/* Large click button to roll next bead */}
          <button
            onClick={handleNextBead}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-500 text-stone-950 font-serif font-bold text-sm rounded-full shadow-lg hover:shadow-amber-900/40 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>拨动佛珠</span>
            <span className="text-xs font-mono font-normal opacity-80">(点击或滚轮)</span>
          </button>
        </div>

        {/* Current Zen Quote Card */}
        <div className="mt-2 p-4 bg-stone-950/60 rounded-2xl border border-stone-800 text-center relative">
          <span className="text-xs font-serif text-amber-400/80 block mb-1">
            第 {currentBead} 颗 · 禅意观照
          </span>
          <p className="text-base font-serif text-stone-200 leading-relaxed tracking-wide">
            “{currentQuote}”
          </p>
          {isMilestoneBead(currentBead) && (
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-serif text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-700/40">
              <Award className="w-3 h-3 text-amber-400" />
              <span>殊胜节点 · 身心安和</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[11px] text-stone-400 font-mono mb-1">
            <span>修持进度</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-700 to-amber-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
