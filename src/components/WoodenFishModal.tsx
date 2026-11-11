/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Square, Sparkles, Volume2 } from 'lucide-react';
import { templeAudio } from '../lib/templeAudio';

interface WoodenFishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMerit: (amount?: number) => void;
  totalMerit: number;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
}

export const WoodenFishModal: React.FC<WoodenFishModalProps> = ({
  isOpen,
  onClose,
  onAddMerit,
  totalMerit,
}) => {
  const [sessionCount, setSessionCount] = useState(0);
  const [isStriking, setIsStriking] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoSpeed, setAutoSpeed] = useState<number>(1000); // ms per hit
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const autoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const textsPool = ["功德 +1", "烦恼 -1", "心定 +1", "心无挂碍", "身心清净", "智慧生", "善念长"];

  const handleStrike = (event?: React.MouseEvent) => {
    templeAudio.playWoodenFish();
    setIsStriking(true);
    setTimeout(() => setIsStriking(false), 120);

    setSessionCount(prev => prev + 1);
    onAddMerit(1);

    // Floating text
    const text = textsPool[Math.floor(Math.random() * textsPool.length)];
    const randomOffset = (Math.random() - 0.5) * 80;
    const newText: FloatingText = {
      id: Date.now() + Math.random(),
      text,
      x: randomOffset,
      y: -20,
    };
    setFloatingTexts(prev => [...prev.slice(-12), newText]);
  };

  // Keyboard shortcut: Spacebar to tap wooden fish
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        handleStrike();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Clean floating texts after animation
  useEffect(() => {
    if (floatingTexts.length === 0) return;
    const timer = setTimeout(() => {
      setFloatingTexts(prev => prev.slice(1));
    }, 1200);
    return () => clearTimeout(timer);
  }, [floatingTexts]);

  // Handle auto strike
  useEffect(() => {
    if (isAutoPlaying) {
      autoTimerRef.current = setInterval(() => {
        handleStrike();
      }, autoSpeed);
    } else {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    }
    return () => {
      if (autoTimerRef.current) clearInterval(autoTimerRef.current);
    };
  }, [isAutoPlaying, autoSpeed]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-stone-900/95 border border-amber-900/40 rounded-3xl p-6 text-stone-100 shadow-2xl overflow-hidden">
        {/* Ambient subtle light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪵</span>
            <div>
              <h2 className="text-lg font-serif font-bold text-amber-100">灵隐功德木鱼</h2>
              <p className="text-xs text-stone-400 font-serif">笃定一心 · 降伏躁动</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsAutoPlaying(false);
              onClose();
            }}
            className="p-1.5 text-stone-400 hover:text-stone-100 rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Counter Displays */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="bg-stone-800/60 rounded-xl p-3 border border-stone-700/40 text-center">
            <span className="text-xs text-stone-400 block mb-0.5 font-serif">本次静敲</span>
            <span className="text-2xl font-mono font-bold text-amber-200 tabular-nums">
              {sessionCount}
            </span>
          </div>
          <div className="bg-stone-800/60 rounded-xl p-3 border border-stone-700/40 text-center">
            <span className="text-xs text-stone-400 block mb-0.5 font-serif">累积功德</span>
            <span className="text-2xl font-mono font-bold text-amber-400 tabular-nums">
              {totalMerit}
            </span>
          </div>
        </div>

        {/* Main Interactive Wooden Fish Surface */}
        <div className="relative flex flex-col items-center justify-center py-6">
          {/* Floating animated texts */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {floatingTexts.map(item => (
              <div
                key={item.id}
                style={{ transform: `translate(${item.x}px, ${item.y}px)` }}
                className="absolute text-sm font-serif font-medium text-amber-300 drop-shadow-md animate-float pointer-events-none transition-all duration-1000 opacity-0 animate-in fade-in zoom-in-75 fill-mode-forwards"
              >
                {item.text}
              </div>
            ))}
          </div>

          {/* Wooden Fish Button */}
          <button
            onClick={handleStrike}
            aria-label="敲击木鱼"
            className={`relative group cursor-pointer active:scale-95 transition-all duration-150 focus:outline-none ${
              isStriking ? 'scale-95' : 'scale-100 hover:scale-[1.02]'
            }`}
          >
            {/* Visual Ripple */}
            {isStriking && (
              <div className="absolute inset-0 rounded-full border-2 border-amber-400/60 animate-ping pointer-events-none" />
            )}

            {/* Stylized Wooden Fish Illustration */}
            <div className="w-48 h-48 rounded-full bg-gradient-to-b from-[#8c4b26] via-[#633015] to-[#421d0a] p-4 shadow-xl border-4 border-[#a65d33]/40 flex items-center justify-center relative">
              <svg viewBox="0 0 100 100" className="w-36 h-36 drop-shadow-lg">
                {/* Wooden fish body outline */}
                <ellipse cx="50" cy="50" rx="42" ry="38" fill="#753919" stroke="#b0693a" strokeWidth="2.5" />
                {/* Traditional wooden fish open mouth slit */}
                <path d="M 20 50 Q 50 68 80 50 Q 50 56 20 50 Z" fill="#2b1206" />
                {/* Scale carving textures */}
                <path d="M 32 35 Q 40 42 48 35" stroke="#995028" strokeWidth="2" fill="none" />
                <path d="M 52 35 Q 60 42 68 35" stroke="#995028" strokeWidth="2" fill="none" />
                <path d="M 42 26 Q 50 33 58 26" stroke="#995028" strokeWidth="2" fill="none" />
                {/* Golden bead / core */}
                <circle cx="50" cy="54" r="5" fill="#f59e0b" opacity="0.8" />
              </svg>
            </div>
          </button>

          <p className="mt-4 text-xs text-stone-400 font-serif">
            点击木鱼或轻按 <kbd className="px-1.5 py-0.5 bg-stone-800 border border-stone-700 rounded text-stone-300 font-mono">空格键</kbd> 击鸣
          </p>
        </div>

        {/* Auto Tap Controls */}
        <div className="mt-2 pt-4 border-t border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-serif transition-colors ${
                isAutoPlaying
                  ? 'bg-amber-600 text-stone-900 font-bold'
                  : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
              }`}
            >
              {isAutoPlaying ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isAutoPlaying ? "暂停自动" : "自动慢敲"}</span>
            </button>

            {isAutoPlaying && (
              <div className="flex items-center gap-1 text-xs text-stone-400 font-mono">
                <button
                  onClick={() => setAutoSpeed(1500)}
                  className={`px-2 py-0.5 rounded ${autoSpeed === 1500 ? 'bg-amber-900/60 text-amber-200' : 'hover:bg-stone-800'}`}
                >
                  缓
                </button>
                <button
                  onClick={() => setAutoSpeed(1000)}
                  className={`px-2 py-0.5 rounded ${autoSpeed === 1000 ? 'bg-amber-900/60 text-amber-200' : 'hover:bg-stone-800'}`}
                >
                  和
                </button>
                <button
                  onClick={() => setAutoSpeed(600)}
                  className={`px-2 py-0.5 rounded ${autoSpeed === 600 ? 'bg-amber-900/60 text-amber-200' : 'hover:bg-stone-800'}`}
                >
                  疾
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setSessionCount(0)}
            className="text-xs text-stone-500 hover:text-stone-300 font-serif"
          >
            重置本次计数
          </button>
        </div>
      </div>
    </div>
  );
};
