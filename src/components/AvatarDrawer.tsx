/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Check, User, Sparkles } from 'lucide-react';
import { MonkAvatar, MONK_NAMES, ROBE_PALETTES } from '../lib/monkAvatars';
import { getMeritTitle } from '../lib/templeLogic';
import { MonkFigure } from './MonkFigure';

interface AvatarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userMonk: MonkAvatar;
  onUpdateMonk: (updated: Partial<MonkAvatar>) => void;
  meritCount: number;
}

export const AvatarDrawer: React.FC<AvatarDrawerProps> = ({
  isOpen,
  onClose,
  userMonk,
  onUpdateMonk,
  meritCount,
}) => {
  const [customName, setCustomName] = useState(userMonk.name);
  const meritTitle = getMeritTitle(meritCount);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-sm bg-stone-900/95 border border-amber-900/40 rounded-3xl p-6 text-stone-100 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-serif font-bold text-amber-100">云林小沙弥</h2>
              <p className="text-xs text-stone-400 font-serif">匿名同修 · 心如明镜</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto pr-1 py-3 space-y-4">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center justify-center py-4 bg-stone-950/60 rounded-2xl border border-stone-800">
            <MonkFigure
              name={customName || userMonk.name}
              isSelf={true}
              robeColor={userMonk.robeColor}
              sashColor={userMonk.sashColor}
              posture={userMonk.posture}
            />
            <div className="mt-3 flex items-center gap-1.5 text-xs font-serif text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-700/50">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>修持阶位：{meritTitle}</span>
              <span className="font-mono tabular-nums text-stone-400">({meritCount} 功德)</span>
            </div>
          </div>

          {/* Change Name */}
          <div>
            <label className="text-xs text-stone-400 font-serif block mb-1.5">
              法号名谓：
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                maxLength={8}
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="输入法号或昵称"
                className="flex-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-200 font-serif focus:outline-none focus:border-amber-600"
              />
              <button
                type="button"
                onClick={() => onUpdateMonk({ name: customName || "听泉" })}
                className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-stone-950 font-serif font-bold text-xs rounded-xl"
              >
                保存
              </button>
            </div>

            {/* Quick Pick Poetic Names */}
            <div className="flex flex-wrap gap-1.5">
              {MONK_NAMES.slice(0, 10).map(nm => (
                <button
                  key={nm}
                  type="button"
                  onClick={() => {
                    setCustomName(nm);
                    onUpdateMonk({ name: nm });
                  }}
                  className={`text-[11px] font-serif px-2 py-0.5 rounded-lg border transition-colors ${
                    (customName || userMonk.name) === nm
                      ? 'bg-amber-950 border-amber-600 text-amber-200 font-bold'
                      : 'bg-stone-800/60 border-stone-700/40 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {nm}
                </button>
              ))}
            </div>
          </div>

          {/* Robe Color Palettes */}
          <div>
            <label className="text-xs text-stone-400 font-serif block mb-2">
              僧袍配色：
            </label>
            <div className="space-y-1.5">
              {ROBE_PALETTES.map((pal, idx) => {
                const isSelected = userMonk.robeColor === pal.robe;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onUpdateMonk({ robeColor: pal.robe, sashColor: pal.sash })}
                    className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs font-serif transition-colors ${
                      isSelected
                        ? 'bg-amber-950/70 border-amber-600 text-amber-200'
                        : 'bg-stone-800/40 border-stone-700/30 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full border border-stone-600 shadow-sm" style={{ backgroundColor: pal.robe }} />
                        <div className="w-4 h-4 rounded-full -ml-1.5 border border-stone-700 shadow-sm" style={{ backgroundColor: pal.sash }} />
                      </div>
                      <span>{pal.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-serif rounded-xl transition-colors shrink-0"
        >
          关闭
        </button>
      </div>
    </div>
  );
};
