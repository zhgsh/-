/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Flame, Bell, Sparkles, Scroll, HeartHandshake, Eye } from 'lucide-react';

interface BottomActionBarProps {
  onBow: () => void;
  onProstrate: () => void;
  onOpenWoodenFish: () => void;
  onOpenPrayerBeads: () => void;
  onOpenIncense: () => void;
  onStrikeBell: () => void;
  onOpenFortune: () => void;
  onOpenWishes: () => void;
  currentPosture: string;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  onBow,
  onProstrate,
  onOpenWoodenFish,
  onOpenPrayerBeads,
  onOpenIncense,
  onStrikeBell,
  onOpenFortune,
  onOpenWishes,
  currentPosture,
}) => {
  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 max-w-full px-2 select-none pointer-events-auto">
      <div className="flex items-center gap-1 md:gap-2 p-1.5 md:p-2 bg-stone-900/90 backdrop-blur-md rounded-2xl border border-stone-700/60 shadow-2xl overflow-x-auto max-w-[96vw] scrollbar-none">
        {/* 1. 合掌问讯 */}
        <button
          onClick={onBow}
          className={`flex flex-col items-center justify-center min-w-[52px] sm:min-w-[62px] md:min-w-[70px] px-1.5 py-1 md:py-1.5 rounded-xl transition-all cursor-pointer ${
            currentPosture === 'bowing'
              ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 scale-95'
              : 'text-stone-300 hover:text-amber-100 hover:bg-stone-800/60'
          }`}
          title="双手合十问讯"
        >
          <span className="text-base md:text-xl mb-0.5">🙏</span>
          <span className="text-[10px] md:text-xs font-serif whitespace-nowrap">合掌</span>
        </button>

        {/* 2. 顶礼拜佛 */}
        <button
          onClick={onProstrate}
          className={`flex flex-col items-center justify-center min-w-[52px] sm:min-w-[62px] md:min-w-[70px] px-1.5 py-1 md:py-1.5 rounded-xl transition-all cursor-pointer ${
            currentPosture === 'prostrating'
              ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 scale-95'
              : 'text-stone-300 hover:text-amber-100 hover:bg-stone-800/60'
          }`}
          title="在蒲团上顶礼拜佛"
        >
          <span className="text-base md:text-xl mb-0.5">🙇</span>
          <span className="text-[10px] md:text-xs font-serif whitespace-nowrap">顶礼</span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 md:h-8 bg-stone-700/60 mx-0.5 shrink-0" />

        {/* 3. 木鱼 */}
        <button
          onClick={onOpenWoodenFish}
          className="flex flex-col items-center justify-center min-w-[52px] sm:min-w-[62px] md:min-w-[70px] px-1.5 py-1 md:py-1.5 rounded-xl text-stone-200 hover:text-amber-200 hover:bg-stone-800/60 transition-all cursor-pointer group"
          title="敲击木鱼积功德"
        >
          <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center mb-0.5 group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 md:w-5 md:h-5 text-amber-400/90">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c-2.49 0-4.5-2.01-4.5-4.5 0-.58.12-1.13.33-1.63L7.1 8.64A7.47 7.47 0 004.5 12c0 4.14 3.36 7.5 7.5 7.5 3.08 0 5.74-1.86 6.89-4.52l-2.01-.67c-.67 1.3-2.03 2.19-3.88 2.19z" />
            </svg>
          </div>
          <span className="text-[10px] md:text-xs font-serif whitespace-nowrap">木鱼</span>
        </button>

        {/* 4. 念珠 */}
        <button
          onClick={onOpenPrayerBeads}
          className="flex flex-col items-center justify-center min-w-[52px] sm:min-w-[62px] md:min-w-[70px] px-1.5 py-1 md:py-1.5 rounded-xl text-stone-200 hover:text-amber-200 hover:bg-stone-800/60 transition-all cursor-pointer group"
          title="转动108颗檀木佛珠"
        >
          <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center mb-0.5 group-hover:scale-110 transition-transform">
            <span className="text-base md:text-lg">📿</span>
          </div>
          <span className="text-[10px] md:text-xs font-serif whitespace-nowrap">念珠</span>
        </button>

        {/* 5. 燃香 */}
        <button
          onClick={onOpenIncense}
          className="flex flex-col items-center justify-center min-w-[52px] sm:min-w-[62px] md:min-w-[70px] px-1.5 py-1 md:py-1.5 rounded-xl text-stone-200 hover:text-amber-200 hover:bg-stone-800/60 transition-all cursor-pointer group"
          title="供奉一炷清香"
        >
          <Flame className="w-4 h-4 md:w-5 md:h-5 text-orange-400 mb-0.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] md:text-xs font-serif whitespace-nowrap">燃香</span>
        </button>

        {/* 6. 撞钟 */}
        <button
          onClick={onStrikeBell}
          className="flex flex-col items-center justify-center min-w-[52px] sm:min-w-[62px] md:min-w-[70px] px-1.5 py-1 md:py-1.5 rounded-xl text-stone-200 hover:text-amber-200 hover:bg-stone-800/60 transition-all cursor-pointer group"
          title="撞响灵隐古铜大钟"
        >
          <Bell className="w-4 h-4 md:w-5 md:h-5 text-amber-300 mb-0.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] md:text-xs font-serif whitespace-nowrap">撞钟</span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 md:h-8 bg-stone-700/60 mx-0.5 shrink-0" />

        {/* 7. 灵隐求签 */}
        <button
          onClick={onOpenFortune}
          className="flex flex-col items-center justify-center min-w-[52px] sm:min-w-[62px] md:min-w-[70px] px-1.5 py-1 md:py-1.5 rounded-xl text-stone-200 hover:text-amber-200 hover:bg-stone-800/60 transition-all cursor-pointer group"
          title="摇签得今日禅语"
        >
          <Scroll className="w-4 h-4 md:w-5 md:h-5 text-amber-200 mb-0.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] md:text-xs font-serif whitespace-nowrap">求签</span>
        </button>

        {/* 8. 祈愿池 / 红丝带 */}
        <button
          onClick={onOpenWishes}
          className="flex flex-col items-center justify-center min-w-[52px] sm:min-w-[62px] md:min-w-[70px] px-1.5 py-1 md:py-1.5 rounded-xl text-stone-200 hover:text-amber-200 hover:bg-stone-800/60 transition-all cursor-pointer group"
          title="许愿红丝带与莲花灯"
        >
          <HeartHandshake className="w-4 h-4 md:w-5 md:h-5 text-rose-300 mb-0.5 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] md:text-xs font-serif whitespace-nowrap">祈愿</span>
        </button>
      </div>
    </div>
  );
};
