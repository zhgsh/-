/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Heart, Send } from 'lucide-react';
import { TempleWish, INITIAL_WISHES } from '../lib/templeLogic';
import { templeAudio } from '../lib/templeAudio';

interface WishRibbonModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  onAddMerit: (amount?: number) => void;
}

export const WishRibbonModal: React.FC<WishRibbonModalProps> = ({
  isOpen,
  onClose,
  userName,
  onAddMerit,
}) => {
  const [wishes, setWishes] = useState<TempleWish[]>(INITIAL_WISHES);
  const [wishText, setWishText] = useState("");
  const [wishType, setWishType] = useState<'ribbon' | 'lantern'>('ribbon');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    templeAudio.playSingingBowl();
    const newWish: TempleWish = {
      id: `wish-${Date.now()}`,
      author: `小沙弥 · ${userName}`,
      content: wishText.trim(),
      type: wishType,
      timestamp: Date.now(),
    };

    setWishes([newWish, ...wishes]);
    setWishText("");
    setSubmitted(true);
    onAddMerit(5);
    setTimeout(() => setSubmitted(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg bg-stone-900/95 border border-amber-900/40 rounded-3xl p-6 text-stone-100 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎋</span>
            <div>
              <h2 className="text-lg font-serif font-bold text-amber-100">灵隐云林心愿池</h2>
              <p className="text-xs text-stone-400 font-serif">古樟挂红丝 · 冷泉放莲灯</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wish Form */}
        <form onSubmit={handleSubmit} className="my-4 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => setWishType('ribbon')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-serif transition-colors flex items-center justify-center gap-1.5 ${
                wishType === 'ribbon'
                  ? 'bg-rose-950/80 border border-rose-700/60 text-rose-200'
                  : 'bg-stone-800/40 border border-stone-700/30 text-stone-400'
              }`}
            >
              <span>🎋 古樟红丝带</span>
            </button>
            <button
              type="button"
              onClick={() => setWishType('lantern')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-serif transition-colors flex items-center justify-center gap-1.5 ${
                wishType === 'lantern'
                  ? 'bg-amber-950/80 border border-amber-700/60 text-amber-200'
                  : 'bg-stone-800/40 border border-stone-700/30 text-stone-400'
              }`}
            >
              <span>🪷 冷泉水上莲灯</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              maxLength={60}
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              placeholder="写下一句微小心愿（如：家人安康、心无挂碍、顺利上岸...）"
              className="w-full bg-stone-950/80 border border-stone-700/60 rounded-xl px-3.5 py-2.5 text-xs text-stone-200 placeholder:text-stone-500 font-serif focus:outline-none focus:border-amber-600/60"
            />
            <button
              type="submit"
              disabled={!wishText.trim()}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-amber-700 hover:bg-amber-600 disabled:opacity-40 text-stone-950 font-serif font-bold text-xs rounded-lg transition-all flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>祈愿</span>
            </button>
          </div>
          {submitted && (
            <p className="mt-1.5 text-xs text-amber-300 font-serif animate-in fade-in">
              心愿已寄付云林，常生吉祥。
            </p>
          )}
        </form>

        {/* Companions Wishes Wall */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 min-h-[160px]">
          <span className="text-xs text-stone-400 font-serif block mb-1">
            同修伙伴的心愿与期许：
          </span>
          {wishes.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border text-xs font-serif transition-colors ${
                item.type === 'ribbon'
                  ? 'bg-rose-950/20 border-rose-900/30 text-stone-200'
                  : 'bg-amber-950/20 border-amber-900/30 text-stone-200'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-amber-300/90 font-medium">{item.author}</span>
                <span className="text-stone-500 font-mono text-[10px]">
                  {item.type === 'ribbon' ? '红丝带' : '莲花灯'}
                </span>
              </div>
              <p className="leading-relaxed text-stone-300">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
