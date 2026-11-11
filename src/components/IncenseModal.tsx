/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Flame, Check } from 'lucide-react';
import { templeAudio } from '../lib/templeAudio';

interface IncenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMerit: (amount?: number) => void;
}

export const IncenseModal: React.FC<IncenseModalProps> = ({
  isOpen,
  onClose,
  onAddMerit,
}) => {
  const [isLit, setIsLit] = useState(false);
  const [selectedIntention, setSelectedIntention] = useState("家人平安，身心康泰");

  const intentions = [
    "家人平安，身心康泰",
    "心无挂碍，去尽烦恼",
    "所求如愿，前程光明",
    "广结善缘，和顺吉祥",
    "放下执念，常得安乐"
  ];

  const handleLightIncense = () => {
    templeAudio.playSingingBowl();
    setIsLit(true);
    onAddMerit(3);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-md bg-stone-900/95 border border-amber-900/40 rounded-3xl p-6 text-stone-100 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <div>
              <h2 className="text-lg font-serif font-bold text-amber-100">灵隐敬奉清香</h2>
              <p className="text-xs text-stone-400 font-serif">戒定真香 · 普熏十方</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intention Selector */}
        <div className="my-4">
          <label className="text-xs text-stone-400 font-serif block mb-2">
            选择敬香心愿：
          </label>
          <div className="space-y-1.5">
            {intentions.map(int => (
              <button
                key={int}
                onClick={() => setSelectedIntention(int)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-serif flex items-center justify-between transition-colors ${
                  selectedIntention === int
                    ? 'bg-amber-950/70 border border-amber-700/60 text-amber-200'
                    : 'bg-stone-800/40 border border-stone-700/30 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <span>{int}</span>
                {selectedIntention === int && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Incense Burner & Animated Sticks */}
        <div className="relative flex flex-col items-center justify-center py-6">
          {/* Incense Sticks */}
          <div className="flex items-end justify-center gap-3 h-36 relative">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col items-center relative">
                {/* Smoke particle if lit */}
                {isLit && (
                  <div className="absolute -top-12 flex flex-col items-center animate-smoke pointer-events-none">
                    <div className="w-1.5 h-12 bg-gradient-to-t from-stone-400/50 via-stone-300/30 to-transparent blur-xs" />
                  </div>
                )}
                {/* Glowing ember tip */}
                <div className={`w-1.5 h-1.5 rounded-full mb-0.5 transition-colors ${
                  isLit ? 'bg-orange-400 shadow-[0_0_8px_#f97316] animate-pulse' : 'bg-stone-600'
                }`} />
                {/* Stick body */}
                <div className="w-1 h-28 bg-[#8a4a2b] rounded-t-sm" />
              </div>
            ))}
          </div>

          {/* Bronze Incense Burner Basin (香炉) */}
          <div className="relative -mt-2 w-40 h-16 bg-gradient-to-b from-[#4a3f35] to-[#25201b] rounded-b-2xl border-t-2 border-[#bfa15f] shadow-lg flex items-center justify-center">
            <span className="text-[11px] font-serif tracking-widest text-[#bfa15f] border-b border-[#bfa15f]/40 pb-0.5">
              灵隐古刹
            </span>
            {/* Ash rim */}
            <div className="absolute top-0 inset-x-2 h-1 bg-[#80776c] rounded-full" />
          </div>

          {/* Light button */}
          {!isLit ? (
            <button
              onClick={handleLightIncense}
              className="mt-6 px-6 py-2.5 bg-gradient-to-r from-orange-700 to-amber-600 hover:from-orange-600 hover:to-amber-500 text-stone-950 font-serif font-bold text-xs rounded-full shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Flame className="w-4 h-4 fill-current" />
              <span>虔诚燃香三炷</span>
            </button>
          ) : (
            <div className="mt-6 text-center">
              <span className="inline-block px-3 py-1 bg-amber-950/60 border border-amber-700/50 rounded-full text-xs font-serif text-amber-200">
                三宝同证 · 善愿必应
              </span>
              <p className="mt-2 text-xs text-stone-400 font-serif">
                心香一瓣，幽远宁谧
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
