/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, RefreshCw } from 'lucide-react';
import { ZenFortune, drawRandomFortune } from '../lib/templeLogic';
import { templeAudio } from '../lib/templeAudio';

interface ZenFortuneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMerit: (amount?: number) => void;
}

export const ZenFortuneModal: React.FC<ZenFortuneModalProps> = ({
  isOpen,
  onClose,
  onAddMerit,
}) => {
  const [fortune, setFortune] = useState<ZenFortune | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  const handleDrawFortune = () => {
    templeAudio.playWoodenFish(1.2);
    setIsShaking(true);
    setFortune(null);

    setTimeout(() => {
      templeAudio.playSingingBowl();
      setIsShaking(false);
      setFortune(drawRandomFortune());
      onAddMerit(2);
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md bg-[#23201d] border border-amber-900/40 rounded-3xl p-6 text-stone-100 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/3 w-64 h-32 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <div>
              <h2 className="text-lg font-serif font-bold text-amber-100">灵隐法雨禅签</h2>
              <p className="text-xs text-stone-400 font-serif">摇得一签 · 点化迷津</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fortune Drawing Stage */}
        {!fortune ? (
          <div className="flex flex-col items-center justify-center py-10">
            {/* Bamboo Cylinder SVG */}
            <div className={`relative w-28 h-40 transition-transform duration-200 ${
              isShaking ? 'rotate-12 translate-y-1' : 'rotate-0'
            }`}>
              <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-xl">
                {/* Bamboo slips sticking out */}
                <rect x="35" y="10" width="6" height="40" rx="2" fill="#c49a6c" transform="rotate(-10 38 30)" />
                <rect x="47" y="5" width="6" height="45" rx="2" fill="#e0b888" />
                <rect x="58" y="12" width="6" height="38" rx="2" fill="#c49a6c" transform="rotate(8 61 31)" />
                {/* Bamboo cylinder cup */}
                <rect x="25" y="40" width="50" height="90" rx="6" fill="#5c442e" stroke="#8c6a49" strokeWidth="2" />
                {/* Bamboo nodes */}
                <line x1="25" y1="70" x2="75" y2="70" stroke="#3b2b1d" strokeWidth="3" />
                <line x1="25" y1="100" x2="75" y2="100" stroke="#3b2b1d" strokeWidth="3" />
                {/* Text on cylinder */}
                <text x="50" y="88" fill="#d97706" fontSize="11" fontFamily="serif" textAnchor="middle">
                  灵隐法雨
                </text>
              </svg>
            </div>

            <p className="mt-4 text-xs text-stone-400 font-serif text-center max-w-xs">
              凝神静气，心念所惑。默诵所求，摇动签筒。
            </p>

            <button
              onClick={handleDrawFortune}
              disabled={isShaking}
              className="mt-6 px-7 py-2.5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-500 text-stone-950 font-serif font-bold text-xs rounded-full shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>{isShaking ? "正在感应抽签..." : "虔诚摇取今日禅签"}</span>
            </button>
          </div>
        ) : (
          /* Fortune Card Reveal */
          <div className="py-4">
            <div className="relative bg-[#f7f2e7] text-stone-900 rounded-2xl p-5 border border-amber-800/20 shadow-inner">
              {/* Traditional red seal */}
              <div className="absolute top-4 right-4 border-2 border-red-700 text-red-700 px-2 py-0.5 rounded text-[11px] font-serif font-bold rotate-6 tracking-widest">
                {fortune.grade}
              </div>

              <div className="mb-3">
                <span className="text-[11px] font-mono text-stone-500">
                  第 {fortune.number} 签
                </span>
                <h3 className="text-base font-serif font-bold text-stone-900 mt-0.5">
                  {fortune.title}
                </h3>
              </div>

              {/* Poem */}
              <div className="my-4 py-3 border-y border-stone-300/70 text-center space-y-1 bg-stone-100/50 rounded-lg">
                {fortune.poem.map((line, idx) => (
                  <p key={idx} className="font-serif text-sm tracking-widest text-stone-800">
                    {line}
                  </p>
                ))}
              </div>

              {/* Explanation & Advice */}
              <div className="space-y-2 text-xs font-serif leading-relaxed text-stone-700">
                <p>
                  <strong className="text-amber-900 mr-1 font-semibold">【禅意解】</strong>
                  {fortune.explanation}
                </p>
                <p>
                  <strong className="text-amber-900 mr-1 font-semibold">【安心语】</strong>
                  {fortune.advice}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={handleDrawFortune}
                className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-200 font-serif transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>重新抽签</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-serif rounded-lg transition-colors"
              >
                安心领纳
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
